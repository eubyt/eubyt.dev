package util

import (
	"context"
	"fmt"
	"os"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

func StartFireStore() (*firestore.Client, error) {
	envCredentials := os.Getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
	opt := option.WithCredentialsJSON([]byte(envCredentials))
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return nil, fmt.Errorf("error initializing app: %v", err)
	}

	clientFirestore, err := app.Firestore(context.Background())
	if err != nil {
		return nil, fmt.Errorf("error initializing app: %v", err)
	}

	return clientFirestore, nil
}
