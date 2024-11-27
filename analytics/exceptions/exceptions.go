package exceptions

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func NotFound(c *gin.Context) {
	c.String(http.StatusNotFound, "Not found")
}

func GatewayTimeout(c *gin.Context) {
	c.JSON(http.StatusNotFound, gin.H{
		"msg":  "Gateway timeout",
		"code": "gateway_timeout",
	})
}

func InternalServerError(c *gin.Context, msgs ...string) {
	msg := "Internal Server Error"
	code := "internal_server_error"
	if len(msgs) > 0 {
		msg = msgs[0]
		if len(msgs) > 1 {
			code = msgs[1]
		}
	}

	c.JSON(http.StatusInternalServerError, gin.H{
		"msg":  msg,
		"code": code,
	})
}

// TODO: TraceLogs
func BadRequest(c *gin.Context, e ...string) {
	var msg string
	if len(e) > 0 {
		msg = e[0]
	}

	if msg == "" {
		msg = "bad_request"
	}

	c.String(http.StatusBadRequest, msg)
}
