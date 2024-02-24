package services

import "time"

// ToDo implement a version that uses sql with tags

type Treatment struct {
	Id          string     `json:"id" dynamo:"Id,hash"`
	AppliedTo   int        `json:"applied_to" index:"AppliedTo-index,hash"`
	DateStart   time.Time  `json:"date_start"`
	DateEnd     *time.Time `json:"date_end"`
	Comments    []Comment  `json:"comments"`
	NextTurn    *time.Time `json:"next_dose"`
	Type        string     `json:"type"`
	Description string     `json:"description"`
}

func (receiver Treatment) GetTableId() string {
	return "Id"
}

type Comment struct {
	Information string    `json:"information"`
	DateAdded   time.Time `json:"date_added"`
	Owner       string    `json:"owner"`
}

type Application struct {
	Id          string    `json:"id" dynamo:"Id,hash"`
	AppliedTo   int       `json:"applied_to" index:"AppliedTo-index,hash"`
	TreatmentId string    `json:"treatment_id" index:"TreatmentId-index,hash"`
	Date        time.Time `json:"date"`
	Type        string    `json:"type"`
	Name        string
}

func (receiver Application) GetTableId() string {
	return "Id"
}
