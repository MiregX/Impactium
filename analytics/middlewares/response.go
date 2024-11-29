package middlewares

import (
	"analytics/logger"
	"bytes"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

type responseBodyWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (rbw responseBodyWriter) Write(b []byte) (int, error) {
	return rbw.body.Write(b)
}

func ResponseWrapper() gin.HandlerFunc {
	return func(c *gin.Context) {
		rbw := &responseBodyWriter{body: &bytes.Buffer{}, ResponseWriter: c.Writer}
		c.Writer = rbw

		c.Next()

		var responseData interface{}

		if err := json.Unmarshal(rbw.body.Bytes(), &responseData); err != nil {
			responseData = rbw.body.String()
		}

		timestamp := c.GetInt64("timestamp")
		if timestamp == 0 {
			timestamp = time.Now().Unix()
		}

		status := c.Writer.Status()

		response := gin.H{
			"req_id":    c.GetString("req_id"),
			"timestamp": timestamp,
			"status":    status,
			"data":      responseData,
		}

		now := time.Now().UnixMilli()

		protocol := "http"
		if c.Request.TLS != nil {
			protocol = "https"
		}

		path := fmt.Sprintf("%s://%s%s",
			protocol,
			c.Request.Host,
			c.Request.RequestURI,
		)

		c.Writer = rbw.ResponseWriter
		c.Header("Content-Type", "application/json")
		c.JSON(rbw.Status(), response)

		if logger.IsIgnored(c) {
			return
		}

		go logger.Do(logger.Log{
			Req_id:    response["req_id"].(string),
			Timestamp: timestamp,
			Data:      nil,
			Took:      now - timestamp,
			Method:    c.Request.Method,
			Status:    status,
			Path:      path,
		})
	}
}
