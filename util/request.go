package util

import (
	"net/http"
	"os"
	"strings"
)

func GetIp(r *http.Request) string {
	ip := r.Header.Get("X-Forwarded-For")
	if ip == "" {
		ip = r.RemoteAddr
	}
	return ip
}

func Cors(w http.ResponseWriter) {
	if strings.ToLower(os.Getenv("NODE_EVN")) != "development" {
		println("production CORS")
		w.Header().Set("access-control-allow-credentials", "true")
		w.Header().Set("access-control-allow-origin", "https://www.eub.yt")
		w.Header().Set("access-control-allow-methods", "GET, POST, OPTIONS")
		w.Header().Set("access-control-allow-headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
		w.Header().Set("cross-origin-resource-policy", "cross-origin")
	}
}
