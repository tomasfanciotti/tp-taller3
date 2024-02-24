package services

import (
	"errors"
	"fmt"
	"github.com/Ignaciocl/commonLibrary/dynamo"
	"github.com/google/uuid"
)

type ApplicationService struct {
	db dynamo.Table[Application]
}

func (as *ApplicationService) CreateApplication(a Application) (Application, error) {
	if pt, err := as.GetApplication(a.Id); err == nil && pt.Id != "" {
		return pt, errors.New("treatment already existent")
	}
	a.Id = uuid.New().String()
	return a, as.db.Put(a)
}

func (as *ApplicationService) SetApplication(t Application) (Application, error) {
	if pt, err := as.GetApplication(t.Id); err != nil || pt.Id == "" {
		return pt, errors.New("treatment does not exist")
	}
	return t, as.db.Put(t)
}

func (as *ApplicationService) GetApplication(id string) (Application, error) {
	var tr Application
	if t, err := as.db.Get(id); err != nil {
		return tr, fmt.Errorf("errors while fetching treatment: %s", err.Error())
	} else {
		return t, err
	}
}

func (as *ApplicationService) DeleteApplication(id string) (Application, error) {
	return as.db.Delete(id)
}

func (as *ApplicationService) GetApplicationsByPet(pet int) ([]Application, error) {
	if t, err := as.db.QueryBy("AppliedTo", pet, "AppliedTo-index", "", nil); err != nil {
		return nil, fmt.Errorf("errors while fetching treatments: %s", err.Error())
	} else {
		return t, err
	}
}

func (as *ApplicationService) GetApplicationsByTreatment(treatmentId string) ([]Application, error) {
	if t, err := as.db.QueryBy("TreatmentId", treatmentId, "TreatmentId-index", "", nil); err != nil {
		return nil, fmt.Errorf("errors while fetching treatments: %s", err.Error())
	} else {
		return t, err
	}
}

func CreateApplicationService(innerDb dynamo.Table[Application]) ApplicationService {
	return ApplicationService{
		db: innerDb,
	}
}
