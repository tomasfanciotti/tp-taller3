package controller

import (
	"drugs/src/middleware"
	"drugs/src/services"
	"drugs/src/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"sort"
	"strconv"
	"time"
)

type TreatmentController struct {
	ts services.ITreatment
}

func (t *Treatment) ToTreatmentServiceObject() services.Treatment {
	comments := make([]services.Comment, 0)
	if t.Comments != nil {
		for _, c := range t.Comments {
			comments = append(comments, services.Comment{
				Information: c.Information,
				DateAdded:   c.DateAdded,
				Owner:       c.Owner,
			})
		}
	}
	return services.Treatment{
		Id:          t.Id,
		AppliedTo:   t.AppliedTo,
		DateStart:   t.DateStart,
		DateEnd:     t.DateEnd,
		Comments:    comments,
		NextTurn:    t.NextDose,
		Type:        t.Type,
		Description: t.Description,
	}
}

func ToTreatment(t services.Treatment) Treatment {
	comments := make([]Comment, 0)
	if t.Comments != nil {
		for _, c := range t.Comments {
			comments = append(comments, Comment{
				Information: c.Information,
				DateAdded:   c.DateAdded,
				Owner:       c.Owner,
			})
		}
	}
	return Treatment{
		Id:          t.Id,
		AppliedTo:   t.AppliedTo,
		DateStart:   t.DateStart,
		DateEnd:     t.DateEnd,
		Comments:    comments,
		NextDose:    t.NextTurn,
		Type:        t.Type,
		Description: t.Description,
	}
}

func (t *Treatment) LeftJoinTreatments(ot Treatment) {
	comments := t.Comments
	if comments == nil {
		comments = make([]Comment, 0)
	}
	comments = append(comments, ot.Comments...)
	sort.Slice(comments, func(i, j int) bool {
		return comments[i].DateAdded.Unix() < comments[j].DateAdded.Unix()
	})
	if t.NextDose.IsZero() {
		t.NextDose = ot.NextDose
	}
	if t.DateEnd.IsZero() {
		t.DateEnd = ot.DateEnd
	}
	if t.DateStart.IsZero() {
		t.DateStart = ot.DateStart
	}
	if t.AppliedTo == 0 {
		t.AppliedTo = ot.AppliedTo
	}
	if t.Description == "" {
		t.Description = ot.Description
	}
	t.Comments = comments
}

// CreateTreatment godoc
//
//	@Summary		Creates a treatment
//	@Description	Create a treatment for a given animal
//	@Tags			Treatment request
//	@Accept			json
//	@Produce		json
//	@Param			treatment	body   Treatment	true	"TBD"
//	@Success		200		{object}	Treatment
//	@Failure		400		{object}	ErrorMsg
//	@Router			/treatments/treatment [post]
func (ac TreatmentController) CreateTreatment(c *gin.Context) {
	var t Treatment
	if err := c.BindJSON(&t); err != nil {
		c.JSON(400, gin.H{
			"reason": err.Error(),
		})
		return
	}
	if t.AppliedTo == 0 {
		c.JSON(400, gin.H{
			"reason": "one of the required fields is empty",
		})
		return
	}
	if nt, err := ac.ts.CreateTreatment(t.ToTreatmentServiceObject()); err != nil {
		c.JSON(400, gin.H{
			"reason": err.Error(),
		})
	} else {
		c.JSON(200, ToTreatment(nt))
	}
}

// SetTreatment godoc
//
//	@Summary		Updates a treatment
//	@Description	Updates a treatment changing everything on it, except the id
//	@Tags			Treatment request
//	@Accept			json
//	@Produce		json
//	@Param			treatment	body   Treatment	true	"TBD"
//	@Success		200		{object}	Treatment
//	@Failure		404		{object}	ErrorMsg
//	@Router			/treatments/treatment [put]
func (ac TreatmentController) SetTreatment(c *gin.Context) {
	var t Treatment
	if err := c.BindJSON(&t); err != nil {
		c.JSON(400, gin.H{
			"reason": err.Error(),
		})
		return
	}
	if err := utils.FailIfZeroValue(t.Id); err != nil {
		c.JSON(400, gin.H{
			"reason": "one of the required fields of title or course at params is empty",
		})
		return
	}
	if nt, err := ac.ts.SetTreatment(t.ToTreatmentServiceObject()); err != nil {
		c.JSON(400, gin.H{
			"reason": "one of the required fields of title or course at params is empty",
		})
	} else {
		c.JSON(200, ToTreatment(nt))
	}
}

// UpdateTreatment godoc
//
//	@Summary		Updates a treatment
//	@Description	Updates a treatment only changing the specified fields
//	@Tags			Treatment request
//	@Accept			json
//	@Produce		json
//	@Param			id      path		string	true	"treatment affected"
//	@Param			treatment	body   Treatment	true	"TBD"
//	@Success		200		{object}	Treatment
//	@Failure		400		{object}	ErrorMsg
//	@Failure		404		{object}	ErrorMsg
//	@Router			/treatments/treatment/{id} [patch]
func (ac TreatmentController) UpdateTreatment(c *gin.Context) {
	treatmentId := c.Param("id")
	if err := utils.FailIfZeroValue([]string{treatmentId}...); err != nil {
		c.JSON(400, gin.H{
			"reason": "one of the required fields is empty",
		})
		return
	}
	t, err := ac.ts.GetTreatment(treatmentId)
	if err != nil {
		c.JSON(400, gin.H{
			"reason": "treatment not found",
		})
		return
	}
	var tr Treatment
	if err := c.BindJSON(&tr); err != nil {
		c.JSON(400, gin.H{
			"reason": err.Error(),
		})
		return
	}
	tr.LeftJoinTreatments(ToTreatment(t))
	if tf, err := ac.ts.SetTreatment(tr.ToTreatmentServiceObject()); err != nil {
		c.JSON(400, gin.H{
			"reason": err.Error(),
		})
	} else {
		c.JSON(200, ToTreatment(tf))
	}
}

// GetTreatment godoc
//
//	@Summary		Get a treatment
//	@Description	Updates a treatment only changing the specified fields
//	@Tags			Treatment request
//	@Accept			json
//	@Produce		json
//	@Param			id      path		string	true	"treatment affected"
//	@Success		200		{object}	Treatment
//	@Failure		400		{object}	ErrorMsg
//	@Failure		404		{object}	ErrorMsg
//	@Router			/treatments/treatment/specific/{id} [get]
func (ac TreatmentController) GetTreatment(c *gin.Context) {
	treatmentId := c.Param("id")
	if err := utils.FailIfZeroValue([]string{treatmentId}...); err != nil {
		c.JSON(400, gin.H{
			"reason": "one of the required fields is empty",
		})
		return
	}
	if t, err := ac.ts.GetTreatment(treatmentId); err != nil {
		c.JSON(400, gin.H{
			"reason": "treatment not found",
		})
	} else {
		c.JSON(200, ToTreatment(t))
	}
}

// DeleteTreatment godoc
//
//	@Summary		Deletes a treatment
//	@Description	Removes a given treatment with given id
//	@Tags			Treatment request
//	@Accept			json
//	@Produce		json
//	@Param			id      path		string	true	"treatment affected"
//	@Param			pet      path		string	true	"pet affected"
//	@Success		200		{object}	Treatment
//	@Failure		400		{object}	ErrorMsg
//	@Failure		404		{object}	ErrorMsg
//	@Router			/treatments/treatment/{id} [delete]
func (ac TreatmentController) DeleteTreatment(c *gin.Context) {
	treatmentId := c.Param("id")
	if err := utils.FailIfZeroValue([]string{treatmentId}...); err != nil {
		c.JSON(400, gin.H{
			"reason": "one of the required fields is empty",
		})
		return
	}
	if t, err := ac.ts.DeleteTreatment(treatmentId); err != nil {
		c.JSON(400, gin.H{
			"reason": "treatment not found",
		})
	} else {
		c.JSON(200, ToTreatment(t))
	}
}

// GetTreatmentsForPet godoc
//
//	@Summary		Get a treatment
//	@Description	Updates a treatment only changing the specified fields
//	@Tags			Treatment request
//	@Accept			json
//	@Produce		json
//	@Param			pet      path		string	true	"treatment affected"
//	@Success		200		{array}	Treatment
//	@Failure		400		{object}	ErrorMsg
//	@Failure		404		{object}	ErrorMsg
//	@Router			/treatments/treatment/pet/{pet} [get]
func (ac TreatmentController) GetTreatmentsForPet(c *gin.Context) {
	pet := c.Param("pet")
	petId, _ := strconv.Atoi(pet)
	if err := utils.FailIfZeroValue(petId); err != nil {
		c.JSON(400, gin.H{
			"reason": "one of the required fields is empty",
		})
		return
	}
	if t, err := ac.ts.GetAllTreatmentsForPet(petId); err != nil {
		c.JSON(400, gin.H{
			"reason": "treatment not found",
		})
	} else {
		ta := make([]Treatment, 0)
		for _, tr := range t {
			ta = append(ta, ToTreatment(tr))
		}
		c.JSON(200, ta)
	}
}

// AddComment godoc
//
//		@Summary		Add a comment
//		@Description	Adds a comment to the treatment
//		@Tags			Treatment request
//		@Accept			json
//		@Produce		json
//		@Param			pet      path		string	true	"treatment affected"
//		@Param			comment	body   CommentInput	true	"Comment from the treatment"
//	 @Param          Authorization header string true "Authorization"
//		@Success		200		{object}	Treatment
//		@Failure		400		{object}	ErrorMsg
//		@Failure		404		{object}	ErrorMsg
//		@Router			/treatments/treatment/comment/{treatmentId} [post]
func (ac TreatmentController) AddComment(c *gin.Context) {
	treatmentId := c.Param("treatmentId")
	var jwt *middleware.JwtData
	var err error
	if jwt, err = middleware.ExtractDataFromJWT(c.GetHeader("Authorization")); err != nil {
		c.JSON(403, gin.H{
			"reason": fmt.Sprintf("token is invalid: %s", err.Error()),
		})
		return
	}
	if err := utils.FailIfZeroValue(treatmentId); err != nil {
		c.JSON(400, gin.H{
			"reason": "one of the required fields is empty",
		})
		return
	}
	var comment CommentInput
	if err := c.BindJSON(&comment); err != nil || comment.Comment == "" {
		c.JSON(400, gin.H{
			"reason": "comment is empty",
		})
		return
	}
	newComment := services.Comment{
		Information: comment.Comment,
		DateAdded:   time.Now(),
		Owner:       jwt.UserID,
	}
	if t, err := ac.ts.GetTreatment(treatmentId); err != nil {
		c.JSON(400, gin.H{
			"reason": "treatment not found",
		})
	} else {
		t.Comments = append(t.Comments, newComment)
		ta, _ := ac.ts.SetTreatment(t)
		c.JSON(200, ToTreatment(ta))
	}
}
func CreateController(ts services.ITreatment) (TreatmentController, error) {
	return TreatmentController{ts: ts}, nil
}
