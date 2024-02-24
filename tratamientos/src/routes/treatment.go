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

func addTreatment(router *gin.RouterGroup) error {
	c := config.GetConfig().AWSConfig
	sess, err := session.NewSession(&c)
	if err != nil {
		return err
	}
	dy := father.New(sess)
	treatmentDb, err := dynamo.CreateDynamoTable[services.Treatment]("treatments", dy)
	if err != nil {
		return err
	}
	ts := services.CreateTreatmentService(&treatmentDb)
	tc, err := controller.CreateController(&ts)
	if err != nil {
		return err
	}
	group := router.Group("/treatment")
	group.POST("/", tc.CreateTreatment)
	group.GET("/specific/:id", tc.GetTreatment)
	group.PUT("/", tc.SetTreatment)
	group.PATCH("/:id", tc.UpdateTreatment)
	group.DELETE("/:id", tc.DeleteTreatment)
	group.GET("/pet/:pet", tc.GetTreatmentsForPet)
	group.POST("/comment/:treatmentId", tc.AddComment)
	return nil
}
