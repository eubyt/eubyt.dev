package util

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"
)

type TwitchOauth struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
	Scope       []string
	TokenType   string `json:"token_type"`
}

type TwitchStream struct {
	Data []struct {
		ID           string    `json:"id"`
		UserID       string    `json:"user_id"`
		UserLogin    string    `json:"user_login"`
		UserName     string    `json:"user_name"`
		GameID       string    `json:"game_id"`
		GameName     string    `json:"game_name"`
		Type         string    `json:"type"`
		Title        string    `json:"title"`
		ViewerCount  int       `json:"viewer_count"`
		StartedAt    time.Time `json:"started_at"`
		Language     string    `json:"language"`
		ThumbnailURL string    `json:"thumbnail_url"`
		TagIDs       []string  `json:"tag_ids"`
		IsMature     bool      `json:"is_mature"`
	} `json:"data"`
	Pagination struct {
		Cursor string `json:"cursor"`
	} `json:"pagination"`
}

func getTokenAccess() string {
	var client_id = os.Getenv("TWITCH_CLIENT_ID")
	var client_secret = os.Getenv("TWITCH_CLIENT_SECRET")
	var grant_type = "client_credentials"

	var url = "https://id.twitch.tv/oauth2/token?client_id=" + client_id + "&client_secret=" + client_secret + "&grant_type=" + grant_type

	req, err := http.NewRequest("POST", url, nil)
	if err != nil {
		log.Fatal(err)
		return ""
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal(err)
		return ""
	}
	defer resp.Body.Close()

	var token TwitchOauth
	json.NewDecoder(resp.Body).Decode(&token)
	return token.AccessToken
}

func GetStream(user_ids string) TwitchStream {
	var token = getTokenAccess()
	var url = "https://api.twitch.tv/helix/streams?user_id=" + user_ids
	var client_id = os.Getenv("TWITCH_CLIENT_ID")

	if token == "" {
		return TwitchStream{}
	}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Fatal(err)
		return TwitchStream{}
	}

	req.Header.Add("Authorization", "Bearer "+token)
	req.Header.Add("Client-ID", client_id)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal(err)
		return TwitchStream{}
	}
	defer resp.Body.Close()

	var stream TwitchStream
	json.NewDecoder(resp.Body).Decode(&stream)

	if len(stream.Data) == 0 {
		return TwitchStream{}
	}
	return stream
}
