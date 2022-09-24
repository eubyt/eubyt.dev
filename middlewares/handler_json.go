package middlewares

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func JsonHandler(w http.ResponseWriter, r *http.Request, data interface{}, statusCode int, cache bool) {
	w.Header().Set("Access-Control-Allow-Origin", "https://eub.yt")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	w.Header().Set("Content-Type", "application/json")
	if cache {
		w.Header().Set("Cache-Control", "max-age=0, s-maxage=604800, stale-while-revalidate, public")
	}
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}
