package services

import (
	"errors"
	"fmt"
	"petplace/back-mascotas/src/db"
	"petplace/back-mascotas/src/db/objects"
	"petplace/back-mascotas/src/model"
	"time"
)

type PetService interface {
	New(pet model.Pet) (model.Pet, error)
	Get(petID int) (model.Pet, error)
	Edit(petID int, pet model.Pet) (model.Pet, error)
	Delete(petID int)
	GetPetsByOwner(request model.SearchRequest) (model.SearchResponse[model.Pet], error)
	GetPetsFiltered(filters map[string]string, params *model.SearchParams) (model.SearchResponse[model.Pet], error)
}

const tableName = "pets"

type PetPlace struct {
	ABMService[model.Pet]
	db db.Storable
}

func NewPetPlace(db db.Storable) PetPlace {
	return PetPlace{db: db}
}

func (pp *PetPlace) New(pet model.Pet) (model.Pet, error) {

	pet.RegisterDate = time.Now()

	var object objects.Pet
	object.FromModel(pet)
	err := pp.db.Save(&object)
	if err != nil {
		return model.Pet{}, err
	}
	pet.ID = int(object.ID)
	return pet, nil

}

func (pp *PetPlace) Get(petID int) (model.Pet, error) {

	var object objects.Pet
	err := pp.db.Get(petID, &object)
	if err != nil && errors.Is(err, errors.New("not found")) {
		return model.Pet{}, err
	}

	return object.ToModel(), nil
}

func (pp *PetPlace) GetPetsByOwner(request model.SearchRequest) (model.SearchResponse[model.Pet], error) {

	var objects []objects.Pet
	total, err := pp.db.GetFiltered(&objects, map[string]string{
		"owner_id": request.OwnerId,
	}, "Name ASC", int(request.Limit), int(request.Offset))

	if err != nil {
		return model.SearchResponse[model.Pet]{}, errors.New("error fetching from db")
	}

	result := model.SearchResponse[model.Pet]{
		Paging: model.Paging{
			Total:  uint(total),
			Offset: request.Offset,
			Limit:  request.Limit,
		},
		Results: []model.Pet{},
	}

	for _, object := range objects {
		result.Results = append(result.Results, object.ToModel())
	}

	return result, nil
}

func (pp *PetPlace) GetPetsFiltered(filters map[string]string, request *model.SearchParams) (model.SearchResponse[model.Pet], error) {

	var objects []objects.Pet
	total, err := pp.db.GetFiltered(&objects, filters, "Name ASC", int(request.Limit), int(request.Offset))

	if err != nil {
		return model.SearchResponse[model.Pet]{}, errors.New("error fetching from db")
	}

	result := model.SearchResponse[model.Pet]{
		Paging: model.Paging{
			Total:  uint(total),
			Offset: request.Offset,
			Limit:  request.Limit,
		},
		Results: []model.Pet{},
	}

	for _, object := range objects {
		result.Results = append(result.Results, object.ToModel())
	}

	return result, nil
}

func (pp *PetPlace) Edit(petID int, pet model.Pet) (model.Pet, error) {

	pet.ID = petID

	var object objects.Pet
	object.FromModel(pet)
	err := pp.db.Save(&object)
	if err != nil {
		fmt.Println(err)
	}
	return object.ToModel(), nil
}

func (pp *PetPlace) Delete(petID int) {
	var object objects.Pet
	err := pp.db.Delete(petID, &object)
	if err != nil {
		fmt.Println(err)
	}
}
