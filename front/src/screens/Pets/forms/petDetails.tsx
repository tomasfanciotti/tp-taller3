// PetDetails.tsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetQuery, usePutMutation } from '../../../hooks/useQuery';
import Loader from '../../../components/Loader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { PetPropsResponse } from "../../../types/props";
import { useS3UploadMutation } from "../../../hooks/uploadToS3";
import TreatmentsView from "./treatments";
import { useQueryClient } from "react-query";

const translate = (key: string) => {
  const translations: Record<string, string> = {
    dog: 'Perro',
    cat: 'Gato',
    bird: 'Pajarraco',
    hamster: 'Hámster',
  };
  return translations[key] || key;
};

const petTypes = ['dog', 'cat', 'bird', 'hamster'];

const PetDetails: React.FC<{ user?: { isDoctor: boolean, id: string } }> = ({ user }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isDoctor = !!user?.isDoctor;
  const { id } = useParams<{ id: string }>();
  const { isLoading, data: petDetailsFetched, isSuccess } = useGetQuery<PetPropsResponse>(
    `http://localhost:9001/pets/pet/${id}`
  );
  const [imgRefresh, setNewRefresh] = useState(Date.now());
  const { mutate: uploadPic, isSuccess: picUploaded } = useS3UploadMutation('my.little.ponny');
  const [petDetails, setPetDetails] = useState<PetPropsResponse>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedPetDetails, setEditedPetDetails] = useState<PetPropsResponse | null>(null);
  const [picId, setPicId] = useState<string>('');
  const { mutate, isSuccess: putSuccess, isLoading: putLoading } = usePutMutation<Partial<PetPropsResponse>, PetPropsResponse>([`/pets/pet/${id}`, '*']);

  useEffect(() => {
    if (isSuccess && petDetailsFetched) {
      setEditedPetDetails({ ...petDetailsFetched });
      setPicId(`${petDetailsFetched.owner_id}/${petDetailsFetched.id}`);
      setPetDetails(petDetailsFetched);
    }
  }, [isSuccess, petDetailsFetched]);

  const handleSave = () => {
    if (editedPetDetails) {
      mutate({
        url: `http://localhost:9001/pets/pet/${id}`,
        body: editedPetDetails,
      });
    }
  };

  useEffect(() => {
    if (putSuccess) {
      setIsEditing(false);
      setPetDetails(editedPetDetails!);
      queryClient.clear();
    }
  }, [putSuccess])

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      uploadPic({ file, fileName: `${picId}.png` });
    }
  };

  useEffect(() => {
    if (picUploaded && picId) {
      const imgUrl = `https://s3.us-east-2.amazonaws.com/my.little.ponny/${picId}.png`;
      setEditedPetDetails({ ...editedPetDetails!, img_url: imgUrl });
      mutate({
        url: `http://localhost:9001/pets/pet/${id}`,
        body: { img_url: imgUrl },
      });
      setNewRefresh(Date.now());
    }
  }, [picUploaded]);

  if (isLoading && !petDetails) {
    return <Loader/>;
  }

  if (!petDetails) {
    return <div>No se encontraron detalles de la mascota.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Detalles de la Mascota</h2>
      {isEditing ? (
        <div>
          <div className="mb-4">
            <label className="font-semibold block">Foto:</label>
            <input type="file" accept="image/jpeg, image/png" onChange={handlePictureChange}/>
          </div>
          <div className="flex mb-4">
            <div className="w-20 h-20 mr-4">
              <img src={petDetails.img_url || '/images/mascot_default.png' + `?${imgRefresh}`} alt="Pet" className="w-full h-full rounded-full"/>
            </div>
            <div className="flex flex-col flex-grow">
              <label className="font-semibold">Nombre:</label>
              <input
                type="text"
                value={editedPetDetails?.name || ''}
                onChange={(e) =>
                  setEditedPetDetails((prev) => ({ ...prev!, name: e.target.value }))
                }
                className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
              />
              <label className="font-semibold">Tipo:</label>
              <select
                value={editedPetDetails?.type || 'Perro'}
                onChange={(e) =>
                  setEditedPetDetails((prev) => ({ ...prev!, type: e.target.value }))
                }
                className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
              >
                {petTypes.map((type) => (
                  <option key={type} value={type}>
                    {translate(type)}
                  </option>
                ))}
              </select>
              <label className="font-semibold">Fecha de Nacimiento:</label>
              <DatePicker
                selected={editedPetDetails?.birth_date ? new Date(editedPetDetails.birth_date) : new Date()}
                onChange={(date: Date) =>
                  setEditedPetDetails((prev) => ({ ...prev!, birth_date: format(date, 'yyyy-MM-dd') }))
                }
                className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>
          <div className="flex mt-4">
            <button disabled={putLoading} className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-blue-600 text-lg" onClick={handleSave}>
              {putLoading ? <Loader/> : 'Guardar'}
            </button>
            <button disabled={putLoading} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 text-lg" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex mb-4">
            <div className="w-20 h-20 mr-4">
              <img src={(petDetails.img_url || '/images/mascot_default.png') + `?${imgRefresh}`} alt="Pet" className="w-full h-full rounded-full"/>
            </div>
            <div>
              <p>
                <span className="font-semibold">Nombre:</span> {petDetails.name}
              </p>
              <p>
                <span className="font-semibold">Tipo:</span> {translate(petDetails.type) || petDetails.type}
              </p>
              <p>
                <span className="font-semibold">Fecha de Nacimiento:</span> {petDetails.birth_date.replace(/T.*$/, '')}
              </p>
            </div>
          </div>
          <div className="mb-4 flex items-center justify-between">
            {(!isDoctor || user.id === petDetails.owner_id) && (
              <div className="flex">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-lg"
                >
                  Editar
                </button>
                <Link
                  to={`/pets/pet-treatments/${petDetails.id}`}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-lg ml-2"
                >
                  Tratamientos
                </Link>
              </div>
            )}
            {isDoctor &&
              <div className="flex flex-col items-center">
                <div className="flex">
                  <button onClick={() => navigate(`/doctor/treatment/create/${petDetails?.id}`)} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 text-lg">
                    Agregar tratamiento
                  </button>
                  <button onClick={() => navigate(`/doctor/application/create/${petDetails?.id}`)} className="bg-yellow-500 text-white ml-3 py-2 px-4 rounded-md hover:bg-yellow-600 text-lg">
                    Agregar aplicacion
                  </button>
                </div>
                <div className="mt-4">
                  <button onClick={() => navigate(`/doctor/application/get/${petDetails?.id}`)} className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 text-lg">
                    Ver aplicaciones
                  </button>
                </div>
              </div>


            }
          </div>
          {isDoctor && (
            <div className="flex justify-center">
              <TreatmentsView/>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PetDetails;
