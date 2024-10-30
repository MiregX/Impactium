package main

import (
	"context"
	"log"
	"net/http"
	"time"

	pb "analytics/controller"
	"analytics/exceptions"
	"analytics/middlewares"

	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
)

// Создаем gRPC клиент
func newGRPCClient() (pb.AnalyticsServiceClient, *grpc.ClientConn, error) {
	conn, err := grpc.Dial("localhost:3001", grpc.WithInsecure(), grpc.WithDefaultCallOptions(grpc.MaxCallRecvMsgSize(1024*1024*10)))
	if err != nil {
		return nil, nil, err
	}

	client := pb.NewAnalyticsServiceClient(conn)
	return client, conn, nil
}

func dataHandler(c *gin.Context) {
	client, conn, err := newGRPCClient()
	if err != nil {
		log.Fatalf("Could not connect to gRPC server: %v", err)
	}
	defer conn.Close()

	req := &pb.GetDataRequest{
		ReqId: "",
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	resp, err := client.GetData(ctx, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": resp.Data})
}

func main() {
	handler := gin.Default()
	λ := handler.Group("/api/v2")

	λ.Use(middlewares.RequestMiddleware())
	λ.Use(middlewares.ResponseWrapper())

	λ.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "PONG")
	})

	λ.GET("/error", func(c *gin.Context) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "An error occurred"})
	})

	λ.GET("/data", dataHandler)

	handler.NoRoute(exceptions.NotFound)
	handler.Run(":3002")
}
