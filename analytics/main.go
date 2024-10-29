package main

import (
	"analytics/exceptions"
	"analytics/middlewares"
	"net/http"

	"github.com/gin-gonic/gin"
)

func errorHandler(c *gin.Context) {

}
func dataHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"expected": "result"})
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
	λ.GET("/instagram/general/:username")

	handler.NoRoute(exceptions.NotFound)
	handler.Run(":3002")
}
