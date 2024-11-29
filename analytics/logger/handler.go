package logger

import (
	"analytics/exceptions"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InsertHandler(context *gin.Context) {
	Ignore(context)

	logs, err := Insert(context)

	if logs == nil || len(*logs) == 0 {
		context.JSON(http.StatusBadRequest, err.Error())
		return
	}

	if err != nil {
		context.JSON(http.StatusCreated, err.Error())
		return
	}

	context.JSON(http.StatusCreated, len(*logs))
}

func FindHandler(context *gin.Context) {
	settings := SelectOptions{}
	settings.FromContext(context)

	logs, err := Find(settings)
	if err != nil {
		exceptions.InternalServerError(context)
	}

	context.JSON(http.StatusOK, logs)
}
