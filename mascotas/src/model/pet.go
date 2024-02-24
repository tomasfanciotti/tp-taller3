package model

import (
	"time"
)

type Pet struct {
	ID           int        `json:"id"`
	Name         string     `json:"name"`
	Type         AnimalType `json:"type"`
	RegisterDate time.Time  `json:"register_date"`
	BirthDate    Date       `json:"birth_date" swaggertype:"string"`
	OwnerID      string     `json:"owner_id"`
	IMGUrl       string     `json:"img_url"`
}

func (p Pet) IsZeroValue() bool {

	var zeroValue Pet

	result := p.ID == zeroValue.ID
	result = result && (p.Name == zeroValue.Name)
	result = result && (p.Type == zeroValue.Type)
	result = result && (p.RegisterDate == zeroValue.RegisterDate)
	result = result && (p.BirthDate == zeroValue.BirthDate)
	result = result && (p.OwnerID == zeroValue.OwnerID)
	result = result && (p.IMGUrl == zeroValue.IMGUrl)

	return result
}
