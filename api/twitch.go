package api

import (
	"net/http"

	middleware "eubyt.dev/api/middlewares"
	"eubyt.dev/api/util"
)

func apiStreams(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		var userIds = r.URL.Query().Get("userIds")
		var twitchStream = util.GetStream(userIds)

		if twitchStream.Data != nil {
			middleware.JsonHandler(w, r, &middleware.Response{Message: "Twitch stream found.", Data: twitchStream.Data}, http.StatusOK, false)
		} else {
			middleware.JsonHandler(w, r, &middleware.Response{Message: "Twitch stream not found."}, http.StatusNotFound, false)
		}
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func HandlerTwitch(w http.ResponseWriter, r *http.Request) {
	util.Cors(w)
	var typeApi = r.URL.Query().Get("type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	switch typeApi {
	case "streams":
		apiStreams(w, r)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}
