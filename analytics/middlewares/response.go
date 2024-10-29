package middlewares

import (
	"bytes"
	"encoding/json"

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

		response := gin.H{
			"req_id":    c.GetString("req_id"),
			"timestamp": c.GetInt64("timestamp"),
			"status":    c.Writer.Status(),
			"data":      responseData,
		}

		c.Writer = rbw.ResponseWriter
		c.Header("Content-Type", "application/json")
		c.JSON(rbw.Status(), response)
	}
}
