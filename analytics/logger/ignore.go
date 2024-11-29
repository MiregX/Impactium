package logger

import "github.com/gin-gonic/gin"

const ignorance = "ignorance"
const data_ignorance = "data_ignorance"

func Ignore(ctx *gin.Context) {
	ctx.Set(ignorance, true)
}

func IsIgnored(ctx *gin.Context) bool {
	return ctx.GetBool(ignorance)
}

func IgnoreData(ctx *gin.Context) {
	ctx.Set(data_ignorance, true)
}

func IsDataIgnored(ctx *gin.Context) bool {
	return ctx.GetBool(data_ignorance)
}
