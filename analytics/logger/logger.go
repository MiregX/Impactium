package logger

import (
	"analytics/controller"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Log struct {
	Timestamp int64       `json:"timestamp" validate:"required"`
	Status    int         `json:"status" validate:"required"`
	Took      int64       `json:"took"`
	Path      string      `json:"path" validate:"required"`
	Req_id    string      `json:"req_id" validate:"required"`
	Method    string      `json:"method" validate:"required"`
	Message   string      `json:"message"`
	Data      interface{} `json:"data"`
}

type SelectOptions struct {
	Skip   int64
	Limit  int64
	Filter bson.M
}

func (s *SelectOptions) FromContext(c *gin.Context) error {
	skip, err := strconv.Atoi(c.DefaultQuery("skip", "0"))
	if err != nil {
		skip = 0
	}

	limit, err := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if err != nil {
		limit = 10
	}

	var filter bson.M
	raw := c.DefaultQuery("filter", "")
	if raw != "" {
		filter, err = ParseFilter(raw)
		if err != nil {
			return err
		}
	}

	s.Skip = int64(skip)
	s.Limit = int64(limit)
	s.Filter = filter
	return nil
}

func validate(log Log) (bool, error) {
	validate := validator.New()
	err := validate.Struct(log)
	if err != nil {
		return false, err
	}
	return true, nil
}

func parse(context *gin.Context) []Log {
	var logs []Log

	body, err := io.ReadAll(context.Request.Body)
	if err != nil {
		return logs
	}

	if err := json.Unmarshal(body, &logs); err != nil {
		var log Log
		if err := json.Unmarshal(body, &log); err != nil {
			return logs
		}
		logs = append(logs, log)
	}

	return logs
}

func create(context *gin.Context) (*[]Log, error) {
	logs := parse(context)

	var invalidLogs []string
	var validLogs []Log
	for _, log := range logs {
		valid, err := validate(log)
		if valid {
			validLogs = append(validLogs, log)
		} else {
			invalidLogs = append(invalidLogs, err.Error())
		}
	}

	return &validLogs, fmt.Errorf("received invalid logs: %s", strings.Join(invalidLogs, ", "))
}

func Insert(context *gin.Context) (*[]Log, error) {
	collection := controller.GetMongoCollection()

	logs, err := create(context)
	if logs == nil {
		return nil, err
	}

	var data []interface{}
	for _, log := range *logs {
		data = append(data, log)
	}

	_, err = collection.InsertMany(context, data)
	if err != nil {
		fmt.Println("Error inserting documents:", err)
		return Insert(context)
	}
	return logs, err
}

func Do(log Log) (*mongo.InsertOneResult, error) {
	collection := controller.GetMongoCollection()

	result, err := collection.InsertOne(context.TODO(), log)
	if err != nil {
		fmt.Printf("error doing log %s", err.Error())
	}
	return result, nil
}

func Find(so SelectOptions) ([]Log, error) {
	collection := controller.GetMongoCollection()

	var logs []Log = []Log{}
	options := options.Find().
		SetProjection(bson.M{"data": 0}).
		SetSort(bson.M{"timestamp": -1}).
		SetSkip(so.Skip).
		SetLimit(so.Limit)

	cursor, err := collection.Find(context.TODO(), so.Filter, options)
	if err != nil {
		return nil, fmt.Errorf("failed to execute find query: %w", err)
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		var log Log
		if err := cursor.Decode(&log); err != nil {
			return nil, fmt.Errorf("failed to decode log: %w", err)
		}
		logs = append(logs, log)
	}

	if err := cursor.Err(); err != nil {
		return nil, fmt.Errorf("cursor iteration error: %w", err)
	}

	return logs, nil
}

func FindByReqId(req_id string) (*Log, error) {
	collection := controller.GetMongoCollection()

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
