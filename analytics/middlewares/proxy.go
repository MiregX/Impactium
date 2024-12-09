package middlewares

import (
	"analytics/logger"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"sort"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type Route struct {
	Prefix string `json:"prefix"`
	Target string `json:"target"`
}

type Config struct {
	Self   string  `json:"self"`
	Routes []Route `json:"routes"`
}

const CONFIG_FILE_NAME = "config.json"

var config *Config

func ProxyMiddleware() gin.HandlerFunc {
	config := GetConfiguration()

	return func(c *gin.Context) {
		requestPath := c.Request.URL.Path

		if isPathMatches(config.Self, requestPath) {
			return
		}

		for _, route := range config.Routes {
			if isPathMatches(route.Prefix, requestPath) {
				targetURL, err := url.Parse(route.Target)
				if err != nil {
					c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Invalid target URL"})
					return
				}

				proxy := httputil.NewSingleHostReverseProxy(targetURL)
				proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
					log.Printf("Proxy error: %v", err)
					c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"error": err.Error()})
				}

				startTime := time.Now()
				proxy.ServeHTTP(c.Writer, c.Request)
				endTime := time.Now()

				go logger.Do(logger.Log{
					Req_id:    c.GetString("req_id"),
					Timestamp: startTime.UnixMilli(),
					Data:      nil,
					Took:      endTime.Sub(startTime).Nanoseconds(),
					Method:    c.Request.Method,
					Status:    c.Writer.Status(),
					Path:      c.Request.URL.Path,
				})

				return
			}
		}

		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Route not found"})
	}
}

func GetConfiguration() *Config {
	if config != nil {
		return config
	}

	data, err := os.ReadFile(CONFIG_FILE_NAME)
	if err != nil {
		log.Fatalf("unable to read config file: %v", err)
		return nil
	}

	var loadedConfig Config
	err = json.Unmarshal(data, &loadedConfig)
	if err != nil {
		log.Fatalf("unable to parse config: %v", err)
		return nil
	}

	sort.Slice(loadedConfig.Routes, func(i, j int) bool {
		return len(loadedConfig.Routes[i].Prefix) > len(loadedConfig.Routes[j].Prefix)
	})

	config = &loadedConfig
	return config
}

func isPathMatches(pattern string, path string) bool {
	return strings.HasPrefix(path, pattern)
}
