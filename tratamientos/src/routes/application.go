package routes

import (
	"drugs/src/config"
	"drugs/src/controller"
	"drugs/src/services"
	"github.com/Ignaciocl/commonLibrary/dynamo"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/gin-gonic/gin"
	father "github.com/guregu/dynamo"
)

func addApplication(router *gin.RouterGroup) error {
	c := config.GetConfig().AWSConfig
	sess, err := session.NewSession(&c)
	if err != nil {
		return err
	}
	dy := father.New(sess)
	applicationsDb, err := dynamo.CreateDynamoTable[services.Application]("application", dy)
	if err != nil {
		return err
	}
	as := services.CreateApplicationService(&applicationsDb)
	ac := controller.CreateApplicationController(&as)
	group := router.Group("/application")
	group.POST("/", ac.CreateApplication)
	group.GET("/specific/:id", ac.GetApplication)
	group.PUT("/", ac.SetApplication)
	group.PATCH("/:id", ac.UpdateApplication)
	group.DELETE("/:id", ac.DeleteApplication)
	group.GET("/pet/:pet", ac.GetApplicationsForPet)
	group.GET("/treatment/:treatmentId", ac.GetApplicationsForTreatment)
	return nil
}
