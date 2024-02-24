package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"notification-scheduler/internal/internal/context"
	"strings"
)

// AppContextCreator middleware use by each endpoint to create a context.AppContext
func AppContextCreator() gin.HandlerFunc {
	return func(c *gin.Context) {
		if strings.Contains(c.Request.URL.Path, "swagger") {
			c.Next()
			return
		}
		appRequestContext, err := context.NewAppContext(c.Request)
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			c.Abort()
			return
		}

		c.Request = c.Request.WithContext(appRequestContext)
		c.Next()
	}
}
