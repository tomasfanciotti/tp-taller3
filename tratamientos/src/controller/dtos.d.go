package controller

import "time"

type Treatment struct {
	Id          string     `json:"id" example:"e013f973-ed95-45c5-8bc4-3abf2d9112c3"`
	AppliedTo   int        `json:"applied_to" example:"20"`
	DateStart   time.Time  `json:"date_start" example:"2006-01-02T15:04:05Z"`
	DateEnd     *time.Time `json:"date_end" example:"2023-01-02T15:04:05Z"`
	Comments    []Comment  `json:"comments"`
	NextDose    *time.Time `json:"next_dose" example:"2023-01-02T15:04:05Z"`
	Type        string     `json:"type" example:"papota"`
	Description string     `json:"description"`
}

type Comment struct {
	Information string    `json:"information"`
	DateAdded   time.Time `json:"date_added" example:"2023-01-02T15:04:05Z"`
	Owner       string    `json:"owner"`
}

type CommonApplication struct {
	Id   string `json:"id" binding:"required"`
	Name string `json:"name" binding:"required"`
}

type Application struct {
	Id          string    `json:"id" example:"e013f973-ed95-45c5-8bc4-3abf2d9112c3"`
	AppliedTo   int       `json:"applied_to" example:"20"`
	TreatmentId string    `json:"treatment_id" example:"a45b9e1a-366a-450e-b298-f455139bfcd0"`
	Date        time.Time `json:"date" example:"2006-01-02T15:04:05Z"`
	Type        string    `json:"type" example:"vaccine"`
	Name        string    `json:"name" example:"Anti rabica"`
}

type CommentInput struct {
	Comment string `json:"comment" binding:"required"`
}

type ErrorMsg struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
}
