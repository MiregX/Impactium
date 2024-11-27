package main

import (
	"net/http"
	"os"

	"analytics/exceptions"
	"analytics/logger"
	"analytics/middlewares"
	"analytics/runner"

	"github.com/gin-gonic/gin"
)

func main() {
	handler := gin.Default()

	runner.Cors(handler)

	λ := handler.Group("/api/v2/")

	λ.Use(middlewares.RequestMiddleware())
	λ.Use(middlewares.ResponseWrapper())

	λ.GET("/ping", func(context *gin.Context) {
		context.String(http.StatusOK, "PONG")
	})

	λ.GET("/error", exceptions.NotFound)

	λ.POST("/log", func(context *gin.Context) {
		result, err := logger.Insert(context, nil)
		if err != nil {
			exceptions.InternalServerError(context)
			return
		}
		context.JSON(http.StatusCreated, result)
	})

	λ.GET("/log/get", func(context *gin.Context) {
		log, err := logger.Find()
		if err != nil {
			exceptions.InternalServerError(context)
		}

		context.JSON(http.StatusOK, log)
	})

	λ.GET("/log/get/:req_id", func(context *gin.Context) {
		req_id, found := context.Params.Get("req_id")
		if !found {
			exceptions.BadRequest(context, "Bad request. Expected /api/v2/log/find/${req_id}")
		}

		log, err := logger.FindByReqId(req_id)
		if err != nil {
			exceptions.NotFound(context)
		}

		context.JSON(http.StatusOK, log)
	})

	port := os.Getenv("GO_PORT")
	if port == "" {
		port = "3002"
	}

	handler.Run(":" + port)
}
