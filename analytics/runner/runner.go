package runner

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func getDomain() string {
	x := os.Getenv("X")
	if x == "" {
		log.Fatal("Environment not provided")
	}

	parsedEnvitonmentXValue, err := strconv.Atoi(x)
	if err != nil {
		log.Fatalf("Failed to convert environment value X to Int")
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

func Cors(handler *gin.Engine) {
	domain := getDomain()

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
