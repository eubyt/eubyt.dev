package api

import (
	"encoding/json"
	"net/http"
	"net/url"

	util "eubyt.dev/api/middlewares"
)

type UrlShortener struct {
	Url string
}

func isUrl(s string) bool {
	u, err := url.ParseRequestURI(s)
	return err == nil && u.Scheme != "" && u.Host != ""
}

// Based on https://github.com/eubyt/go.eub.yt
func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		decoder := json.NewDecoder(r.Body)
		var urlShortener UrlShortener
		err := decoder.Decode(&urlShortener)

		if err != nil || urlShortener.Url == "" {
			util.JsonHandler(w, r, &util.Response{Message: "Invalid body JSON."}, http.StatusUnprocessableEntity)
			return
		}

		if !isUrl(urlShortener.Url) {
			util.JsonHandler(w, r, &util.Response{Message: "Invalid URL."}, http.StatusUnprocessableEntity)
			return
		}

		util.JsonHandler(w, r, urlShortener, http.StatusCreated)
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
}
