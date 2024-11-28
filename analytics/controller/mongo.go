package controller

import (
	context "context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func connectToMongo() (*mongo.Client, error) {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		return nil, err
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		return nil, err
	}

	return client, nil
}

func GetMongoCollection() *mongo.Collection {
	client, err := connectToMongo()
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	return client.Database("testdb").Collection("logs")
}
