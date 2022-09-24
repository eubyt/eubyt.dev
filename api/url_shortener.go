package api

import (
	"context"
	"encoding/json"
	"math/rand"
	"net/http"
	"net/url"
	"time"

	middleware "eubyt.dev/api/middlewares"
	"eubyt.dev/api/util"
)

type UrlShortener struct {
	Url string
}

func isUrl(s string) bool {
	u, err := url.ParseRequestURI(s)
	return err == nil && u.Scheme != "" && u.Host != ""
}

func save(url string, alias string) bool {
	client, err := util.StartFireStore()
	if err != nil {
		println(err.Error())
		return false
	}
	defer client.Close()
	_, _, err = client.Collection("urls").Add(context.Background(), map[string]interface{}{
		"url":        url,
		"alias":      alias,
		"created_at": time.Now(),
	})
	if err != nil {
		println(err.Error())
		return false
	}

	return true
}

func getDocument(path string, value string) map[string]interface{} {
	client, err := util.StartFireStore()
	if err != nil {
		println(err.Error())
		return nil
	}
	defer client.Close()
	iter := client.Collection("urls").Where(path, "==", value).Documents(context.Background())
	defer iter.Stop()
	doc, err := iter.Next()
	if err != nil {
		println(err.Error())
		return nil
	}
	return doc.Data()
}

//doc.Data()["url"].(string)

// Based on https://github.com/eubyt/go.eub.yt
func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("access-control-allow-credentials", "true")
	w.Header().Set("access-control-allow-origin", "www.eub.yt")
	w.Header().Set("access-control-allow-methods", "GET, POST, OPTIONS")
	w.Header().Set("access-control-allow-headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
	w.Header().Set("cross-origin-resource-policy", "cross-origin")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method == "POST" {
		rand.Seed(time.Now().UnixNano())
		decoder := json.NewDecoder(r.Body)

		var urlShortener UrlShortener
		var alias string = util.RandomString(rand.Intn(5) + 4)
		err := decoder.Decode(&urlShortener)

		if err != nil || urlShortener.Url == "" {
			middleware.JsonHandler(w, r, &middleware.Response{Message: "Invalid body JSON."}, http.StatusUnprocessableEntity, false)
			return
		}

		if !isUrl(urlShortener.Url) {
			middleware.JsonHandler(w, r, &middleware.Response{Message: "Invalid URL."}, http.StatusUnprocessableEntity, false)
			return
		}

		document := getDocument("url", urlShortener.Url)
		if document != nil {
			middleware.JsonHandler(w, r, &middleware.Response{Message: "URL already exists.", Data: map[string]string{"alias": document["alias"].(string)}}, http.StatusCreated, true)
			return
		}

		if save(urlShortener.Url, alias) {
			middleware.JsonHandler(w, r, &middleware.Response{Message: "URL saved successfully.", Data: map[string]string{"alias": alias}}, http.StatusCreated, true)
		} else {
			middleware.JsonHandler(w, r, &middleware.Response{Message: "Error saving URL."}, http.StatusInternalServerError, false)
		}

		return
	}

	if r.Method == "GET" {
		alias := r.URL.Query().Get("alias")
		if alias == "" {
			middleware.JsonHandler(w, r, &middleware.Response{Message: "Invalid alias."}, http.StatusUnprocessableEntity, false)
			return
		}

		document := getDocument("alias", alias)
		if document == nil {
			middleware.JsonHandler(w, r, &middleware.Response{Message: "Alias not found."}, http.StatusNotFound, false)
			return
		}

		middleware.JsonHandler(w, r, &middleware.Response{Message: "URL found.", Data: map[string]string{"url": document["url"].(string)}}, http.StatusOK, true)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}
