package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"analytics/exceptions"
	"analytics/middlewares"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func getDomains() string {
	x := os.Getenv("X")
	if x == "" {
		x = "0"
	}

	parsedEnvitonmentXValue, err := strconv.Atoi(x)
	if err != nil {
		log.Fatalf("Failed to convert enivronment value X to Int")
	}

	isProduction := parsedEnvitonmentXValue > 0

	domain := os.Getenv("LOCALHOST")
	if isProduction {
		domain = os.Getenv("DOMAIN")
	}

	if domain == "" {
		domain = "http://localhost"
		if isProduction {
			domain = "http://impactium.fun"
		}
	}

	return domain
}

func settleCors(handler *gin.Engine) {
	domain := getDomains()

	handler.Use(cors.New(cors.Config{
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return strings.HasPrefix(origin, domain)
		},
	}))
}

func main() {
	handler := gin.Default()

	settleCors(handler)

	λ := handler.Group("/api/v2/")

	λ.Use(middlewares.RequestMiddleware())
	λ.Use(middlewares.ResponseWrapper())

	λ.GET("/ping", func(context *gin.Context) {
		context.String(http.StatusOK, "PONG")
	})

	λ.GET("/error", exceptions.NotFound)

	port := os.Getenv("GO_PORT")
	if port == "" {
		port = "3002"
	}

	handler.Run(":" + port)
}
