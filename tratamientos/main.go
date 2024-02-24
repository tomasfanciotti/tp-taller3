package main

import (
	"drugs/src/config"
	"drugs/src/routes"
	"drugs/src/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	c := config.GetConfig()
	r := routes.Routes{
		Router: gin.Default(),
	}
	r.Router.Use(CORSMiddleware())
	log.Infof("configs is: %+v", c)
	utils.FailOnError(r.WakeMeUpWhenSeptemberEnds())
	log.Infof("starting to run")
	utils.FailOnError(r.Router.Run(fmt.Sprintf(":%d", c.Port)))
}
