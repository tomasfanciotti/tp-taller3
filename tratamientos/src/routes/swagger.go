package routes

import (
	"drugs/docs"
	"github.com/gin-gonic/gin"
	"github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"
)

func addSwagger(router *gin.RouterGroup) error {
	docs.SwaggerInfo.Title = "Swagger Drugs API"
	group := router.Group("/swagger")
	group.GET("/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	return nil
}
