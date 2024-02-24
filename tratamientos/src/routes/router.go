package routes

import "github.com/gin-gonic/gin"

func (r Routes) WakeMeUpWhenSeptemberEnds() error {
	adders := []func(router *gin.RouterGroup) error{addSwagger, addTreatment, addApplication}
	g := r.Router.Group("/treatments")
	for _, adder := range adders {
		if err := adder(g); err != nil {
			return err
		}
	}
	return nil
}
