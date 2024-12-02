package controller

import (
	"context"
	"log"
	"sync"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	clientInstance     *mongo.Client
	clientInstanceOnce sync.Once
	clientInstanceErr  error
)

func initializeMongoClient() {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	clientInstance, clientInstanceErr = mongo.Connect(context.TODO(), clientOptions)
	if clientInstanceErr != nil {
		log.Fatal("Failed to initialize MongoDB client:", clientInstanceErr)
	}

	err := clientInstance.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}
}

func GetMongoClient() (*mongo.Client, error) {
	clientInstanceOnce.Do(initializeMongoClient)
	return clientInstance, clientInstanceErr
}

func GetMongoCollection() *mongo.Collection {
	client, err := GetMongoClient()
	if err != nil {
		log.Fatal("Failed to get MongoDB client:", err)
	}
	return client.Database("testdb").Collection("logs")
}
