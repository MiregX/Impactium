package middlewares

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func RequestMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		reqID := c.GetHeader("req_id")

		if reqID == "" {
			reqID = uuid.New().String()
		}

		c.Set("req_id", reqID)
		c.Set("timestamp", time.Now().UnixMilli())
		c.Next()
	}
}
