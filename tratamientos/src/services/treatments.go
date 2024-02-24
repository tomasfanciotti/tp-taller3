package services

import (
	"errors"
	"fmt"
	"github.com/Ignaciocl/commonLibrary/dynamo"
	"github.com/google/uuid"
)

type TreatmentService struct {
	db dynamo.Table[Treatment]
}

func (ts *TreatmentService) CreateTreatment(t Treatment) (Treatment, error) {
	if pt, err := ts.GetTreatment(t.Id); err == nil && pt.Id != "" {
		return pt, errors.New("treatment already existent")
	}
	t.Id = uuid.New().String()
	return t, ts.db.Put(t)
}

func (ts *TreatmentService) SetTreatment(t Treatment) (Treatment, error) {
	if pt, err := ts.GetTreatment(t.Id); err != nil || pt.Id == "" {
		return pt, errors.New("treatment does not exist")
	}
	return t, ts.db.Put(t)
}

func (ts *TreatmentService) GetTreatment(id string) (Treatment, error) {
	var tr Treatment
	if t, err := ts.db.Get(id); err != nil {
		return tr, fmt.Errorf("errors while fetching treatment: %s", err.Error())
	} else {
		return t, err
	}
}

func (ts *TreatmentService) DeleteTreatment(id string) (Treatment, error) {
	return ts.db.Delete(id)
}

func (ts *TreatmentService) GetAllTreatmentsForPet(pet int) ([]Treatment, error) {
	if t, err := ts.db.QueryBy("AppliedTo", pet, "AppliedTo-index", "", nil); err != nil {
		return nil, fmt.Errorf("errors while fetching treatments: %s", err.Error())
	} else {
		return t, err
	}
}

func CreateTreatmentService(innerDb dynamo.Table[Treatment]) TreatmentService {
	return TreatmentService{
		db: innerDb,
	}
}
