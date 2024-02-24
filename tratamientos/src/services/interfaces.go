package services

type ITreatment interface {
	CreateTreatment(t Treatment) (Treatment, error)
	SetTreatment(t Treatment) (Treatment, error)
	GetTreatment(id string) (Treatment, error)
	DeleteTreatment(id string) (Treatment, error)
	GetAllTreatmentsForPet(pet int) ([]Treatment, error)
}

type IApplication interface {
	CreateApplication(a Application) (Application, error)
	SetApplication(a Application) (Application, error)
	GetApplication(id string) (Application, error)
	GetApplicationsByTreatment(treatmentId string) ([]Application, error)
	GetApplicationsByPet(petId int) ([]Application, error)
	DeleteApplication(id string) (Application, error)
}
