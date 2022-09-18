package middlewares

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	Message string `json:"message"`
}

func JsonHandler(w http.ResponseWriter, r *http.Request, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}
