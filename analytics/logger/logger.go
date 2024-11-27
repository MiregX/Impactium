package logger

import (
	"analytics/controller"
	"analytics/exceptions"
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Log struct {
	Status    int         `json:"status" validate:"required"`
	Timestamp int         `json:"timestamp" validate:"required"`
	Took      int         `json:"took"`
	Path      string      `json:"path" validate:"required"`
	Req_id    string      `json:"req_id" validate:"required"`
	Method    string      `json:"method" validate:"required"`
	Message   string      `json:"message"`
	Data      interface{} `json:"data"`
}

func create(context *gin.Context) (*Log, error) {
	var log Log

	if err := context.ShouldBindJSON(&log); err != nil {
		exceptions.InternalServerError(context)
		return &log, err
	}

	validate := validator.New()
	if err := validate.Struct(log); err != nil {
		exceptions.BadRequest(context)
		return nil, err
	}

	return &log, nil
}

func Insert(context *gin.Context, log *Log) (*mongo.InsertOneResult, error) {
	client := controller.GetMongoConnection()

	collection := client.Database("testdb").Collection("logs")

	if log == nil {
		var err error
		if log, err = create(context); err != nil {
			return nil, err
		}
	}

	result, err := collection.InsertOne(context, log)
	if err != nil {
		fmt.Println("Error inserting document:", err)
		return Insert(context, log)
	}
	return result, nil
}

func Find() ([]Log, error) {
	client := controller.GetMongoConnection()

	collection := client.Database("testdb").Collection("logs")

	var result []Log
	filter := bson.M{}
	options := options.Find().SetProjection(bson.M{"data": 0})

	cursor, err := collection.Find(context.TODO(), filter, options)
	if err != nil {
		return nil, fmt.Errorf("failed to execute find query: %w", err)
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		var log Log
		if err := cursor.Decode(&log); err != nil {
			return nil, fmt.Errorf("failed to decode log: %w", err)
		}
		result = append(result, log)
	}

	if err := cursor.Err(); err != nil {
		return nil, fmt.Errorf("cursor iteration error: %w", err)
	}

	return result, nil
}

func FindByReqId(req_id string) (*Log, error) {
	client := controller.GetMongoConnection()

	collection := client.Database("testdb").Collection("logs")

	var result Log
	filter := bson.M{"req_id": req_id}

	err := collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("no log found with req_id: %s", req_id)
		}
		return nil, fmt.Errorf("failed to find log: %w", err)
	}

	return &result, nil
}
