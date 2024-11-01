package main

import (
	"log"
	"net"
	"net/http"
	"os"

	"analytics/exceptions"
	"analytics/middlewares"

	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
)

func main() {
	port := os.Getenv("GO_PORT")
	handler := gin.Default()
	λ := handler.Group("/api/v2")

	λ.Use(middlewares.RequestMiddleware())
	λ.Use(middlewares.ResponseWrapper())

	λ.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "PONG")
	})

	λ.GET("/error", exceptions.NotFound)

	listener, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()

	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
