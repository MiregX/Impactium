package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"analytics/exceptions"
	"analytics/logger"
	"analytics/middlewares"
	"analytics/runner"

	"github.com/gin-gonic/gin"
)

const DEFAULT_PORT = "3002"

func main() {
	handler := gin.Default()

	runner.Cors(handler)

	handler.Use(middlewares.ProxyMiddleware())

	configuration := middlewares.GetConfiguration()
	λ := handler.Group(configuration.Self)

	λ.Use(middlewares.RequestMiddleware())
	λ.Use(middlewares.ResponseWrapper())

	λ.GET("/ping", func(context *gin.Context) {
		context.String(http.StatusOK, "PONG")
	})

	λ.GET("/error", exceptions.NotFound)
	λ.POST("/log", logger.InsertHandler)
	λ.GET("/logs", logger.FindHandler)
	λ.GET("/logs/count", logger.CountHandler)

	port := os.Getenv("GO_PORT")
	if port == "" {
		fmt.Printf("error unexpected environment GO_PORT. Defaulting to: %s", DEFAULT_PORT)
		port = DEFAULT_PORT
	}

	// log.Fatal(http.ListenAndServe(":"+port, nil))

	log.Fatal(handler.Run(":" + port))
}
