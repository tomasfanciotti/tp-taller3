package controller

import (
	"drugs/src/services"
	"drugs/src/utils"
	"github.com/gin-gonic/gin"
	"strconv"
	"time"
)

type ApplicationController struct {
	s services.IApplication
}

func (a *Application) ToApplicationServiceDTO() services.Application {
	return services.Application{
		Id:          a.Id,
		AppliedTo:   a.AppliedTo,
		TreatmentId: a.TreatmentId,
		Date:        a.Date,
		Type:        a.Type,
		Name:        a.Name,
	}
}

func ToApplication(application services.Application) Application {
	return Application{
		Id:          application.Id,
		AppliedTo:   application.AppliedTo,
		TreatmentId: application.TreatmentId,
		Date:        application.Date,
		Type:        application.Type,
		Name:        application.Name,
	}
}

func (a *Application) JoinApplication(oa Application) {
	if a.Date.IsZero() {
		a.Date = oa.Date
	}
	if a.TreatmentId == "" {
		a.TreatmentId = oa.TreatmentId
	}
	if a.Type == "" {
		a.Type = oa.Type
	}
	if a.AppliedTo == 0 {
		a.AppliedTo = oa.AppliedTo
	}
	if a.Name == "" {
		a.Name = oa.Name
	}
}

// CreateApplication godoc
//
//	@Summary		Creates an application
//	@Description	Create an application for a given animal
//	@Tags			Application request
//	@Accept			json
//	@Produce		json
//	@Param			Application	body   Application	true	"TBD"
//	@Success		200		{object}	Application
//	@Failure		400		{object}	ErrorMsg
//	@Router			/treatments/application [post]
func (ac ApplicationController) CreateApplication(c *gin.Context) {
	var a Application
	if err := c.BindJSON(&a); err != nil {
		c.JSON(400, gin.H{
			"reason": err.Error(),
		})
		return
	}
	if err := utils.FailIfZeroValue(a.Type); err != nil || a.AppliedTo == 0 {
		c.JSON(400, gin.H{
			"reason": "one of the required fields is empty",
		})
		return
	}
	if a.Date.IsZero() {
		a.Date = time.Now()
	}
	if nt, err := ac.s.CreateApplication(a.ToApplicationServiceDTO()); err != nil {
		c.JSON(400, gin.H{
			"reason": err.Error(),
		})
	} else {
		c.JSON(200, ToApplication(nt))
	}
}

// SetApplication godoc
//
//	@Summary		Updates an application
//	@Description	Updates an application changing everything on it, except the id
//	@Tags			Application request
//	@Accept			json
//	@Produce		json
//	@Param			Application	body   Application	true	"TBD"
//	@Success		200		{object}	Application
//	@Failure		404		{object}	ErrorMsg
//	@Router			/treatments/application [put]
func (ac ApplicationController) SetApplication(c *gin.Context) {
	var a Application
	if err := c.BindJSON(&a); err != nil {
		c.JSON(400, gin.H{
			"reason": err.Error(),
		})
		return
	}
	if err := utils.FailIfZeroValue(a.Id); err != nil {
		c.JSON(400, gin.H{
			"reason": "one of the required fields of title or course at params is empty",
		})
		return
	}
	if nt, err := ac.s.SetApplication(a.ToApplicationServiceDTO()); err != nil {
		c.JSON(400, gin.H{
			"reason": "one of the required fields of title or course at params is empty",
		})
	} else {
		c.JSON(200, ToApplication(nt))
	}
}

// UpdateApplication godoc
//
//	@Summary		Updates an application
//	@Description	Updates an application only changing the specified fields
//	@Tags			Application request
//	@Accept			json
//	@Produce		json
//	@Param			id      path		string	true	"Application affected"
//	@Param			Application	body   Application	true	"TBD"
//	@Success		200		{object}	Application
//	@Failure		400		{object}	ErrorMsg
//	@Failure		404		{object}	ErrorMsg
//	@Router			/treatments/application/{id} [patch]
func (ac ApplicationController) UpdateApplication(c *gin.Context) {
	applicationId := c.Param("id")
	if err := utils.FailIfZeroValue([]string{applicationId}...); err != nil {
		c.JSON(400, gin.H{
			"reason": "one of the required fields is empty",
		})
		return
	}
	app, err := ac.s.GetApplication(applicationId)
	if err != nil {
		c.JSON(400, gin.H{
			"reason": "Application not found",
		})
		return
	}
	var a Application
	if err := c.BindJSON(&a); err != nil {
		c.JSON(400, gin.H{
			"reason": err.Error(),
		})
		return
	}
	a.JoinApplication(ToApplication(app))
	a.Id = applicationId
	if tf, err := ac.s.SetApplication(a.ToApplicationServiceDTO()); err != nil {
		c.JSON(400, gin.H{
			"reason": err.Error(),
		})
	} else {
		c.JSON(200, ToApplication(tf))
	}
}

// GetApplication godoc
//
//	@Summary		Get an application
//	@Description	Get an application with a given id
//	@Tags			Application request
//	@Accept			json
//	@Produce		json
//	@Param			id      path		string	true	"application id"
//	@Success		200		{object}	Application
//	@Failure		400		{object}	ErrorMsg
//	@Failure		404		{object}	ErrorMsg
//	@Router			/treatments/application/specific/{id} [get]
func (ac ApplicationController) GetApplication(c *gin.Context) {
	applicationId := c.Param("id")
	if err := utils.FailIfZeroValue([]string{applicationId}...); err != nil {
		c.JSON(400, gin.H{
			"reason": "one of the required fields is empty",
		})
		return
	}
	if t, err := ac.s.GetApplication(applicationId); err != nil {
		c.JSON(400, gin.H{
			"reason": "Application not found",
		})
	} else {
		c.JSON(200, ToApplication(t))
	}
}

// DeleteApplication godoc
//
//	@Summary		Deletes an application
//	@Description	Removes a given application with given id
//	@Tags			Application request
//	@Accept			json
//	@Produce		json
//	@Param			id      path		string	true	"application affected"
//	@Success		200		{object}	Application
//	@Failure		400		{object}	ErrorMsg
//	@Failure		404		{object}	ErrorMsg
//	@Router			/treatments/application/{id} [delete]
func (ac ApplicationController) DeleteApplication(c *gin.Context) {
	applicationId := c.Param("id")
	if err := utils.FailIfZeroValue([]string{applicationId}...); err != nil {
		c.JSON(400, gin.H{
			"reason": "one of the required fields is empty",
		})
		return
	}
	if t, err := ac.s.DeleteApplication(applicationId); err != nil {
		c.JSON(400, gin.H{
			"reason": "Application not found",
		})
	} else {
		c.JSON(200, ToApplication(t))
	}
}

// GetApplicationsForPet godoc
//
//	@Summary		Get an application
//	@Description	Updates an application only changing the specified fields
//	@Tags			Application request
//	@Accept			json
//	@Produce		json
//	@Param			pet      path		string	true	"Application affected"
//	@Success		200		{array}	Application
//	@Failure		400		{object}	ErrorMsg
//	@Failure		404		{object}	ErrorMsg
//	@Router			/treatments/application/pet/{pet} [get]
func (ac ApplicationController) GetApplicationsForPet(c *gin.Context) {
	pet := c.Param("pet")
	petId, _ := strconv.Atoi(pet)
	if err := utils.FailIfZeroValue(petId); err != nil {
		c.JSON(400, gin.H{
			"reason": "one of the required fields is empty",
		})
		return
	}
	if t, err := ac.s.GetApplicationsByPet(petId); err != nil {
		c.JSON(400, gin.H{
			"reason": "Application not found",
		})
	} else {
		ta := make([]Application, 0)
		for _, tr := range t {
			ta = append(ta, ToApplication(tr))
		}
		c.JSON(200, ta)
	}
}

// GetApplicationsForTreatment godoc
//
//	@Summary		Get an application
//	@Description	Updates an application only changing the specified fields
//	@Tags			Application request
//	@Accept			json
//	@Produce		json
//	@Param			treatmentId      path		string	true	"Application affected"
//	@Success		200		{array}	Application
//	@Failure		400		{object}	ErrorMsg
//	@Failure		404		{object}	ErrorMsg
//	@Router			/treatments/application/treatment/{treatmentId} [get]
func (ac ApplicationController) GetApplicationsForTreatment(c *gin.Context) {
	treatmentId := c.Param("treatmentId")
	if err := utils.FailIfZeroValue(treatmentId); err != nil {
		c.JSON(400, gin.H{
			"reason": "one of the required fields is empty",
		})
		return
	}
	if t, err := ac.s.GetApplicationsByTreatment(treatmentId); err != nil {
		c.JSON(400, gin.H{
			"reason": "Application not found",
		})
	} else {
		ta := make([]Application, 0)
		for _, tr := range t {
			ta = append(ta, ToApplication(tr))
		}
		c.JSON(200, ta)
	}
}

func CreateApplicationController(service services.IApplication) ApplicationController {
	return ApplicationController{s: service}
}
