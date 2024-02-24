// CreatePet.tsx

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import usePostMutation from 'hooks/useQuery';
import { PetProps } from '../../../types/props';
import { useAuthSession } from '../../../hooks/useAuth';

// Simple translation function
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

const CreatePet: React.FC = () => {
  const { user } = useAuthSession();
  const [newPet, setNewPet] = useState<PetProps>({
    id: 0,
    name: '',
    type: petTypes[0], // Default type
    birthdate: new Date(),
  });

  const postMutation = usePostMutation();

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const handleCreatePet = () => {
    const formattedDate = format(newPet.birthdate, 'yyyy-MM-dd');

    postMutation.mutate({
      url: 'http://localhost:9001/pets/pet',
      body: { ...newPet, birth_date: formattedDate, owner_id: user?.id },
    });
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if (postMutation.isSuccess) {
      setPopupMessage(`Tu mascota ${newPet.name} ha sido creada`);
      setIsError(false);
      setShowPopup(true);
      // Hide the popup after 3 seconds
      setTimeout(closePopup, 3000);
    } else if (postMutation.isError) {
      setPopupMessage('Ha ocurrido un error. Por favor, contacta al soporte.');
      setIsError(true);
      setShowPopup(true);
      // Hide the popup after 3 seconds
      setTimeout(closePopup, 3000);
    }
  }, [postMutation.isSuccess, postMutation.isError, newPet.name]);

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-md shadow-md relative">
      <h2 className="text-3xl font-semibold mb-6 text-center">Crear Nueva Mascota</h2>
      <div className="grid grid-cols-1 gap-4">
        <label className="text-gray-600">Nombre:</label>
        <input
          type="text"
          value={newPet.name}
          onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        <label className="text-gray-600">Tipo:</label>
        <select
          value={newPet.type}
          onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {petTypes.map((type) => (
            <option key={type} value={type}>
              {translate(type)}
            </option>
          ))}
        </select>

        <label className="text-gray-600">Fecha de Nacimiento:</label>
        <DatePicker
          selected={newPet.birthdate}
          onChange={(date) => setNewPet({ ...newPet, birthdate: date || new Date() })}
          dateFormat="yyyy-MM-dd"
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        <button
          onClick={handleCreatePet}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 w-full"
          disabled={postMutation.isLoading}
        >
          {postMutation.isLoading ? 'Creando...' : 'Crear Mascota'}
        </button>

        {showPopup && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-md flex items-center ${isError ? 'bg-red-500' : 'bg-green-500'}`}>
            <span className="mr-2">{popupMessage}</span>
            <button className="ml-2 text-white" onClick={closePopup}>
              &#10005; {/* Cross symbol */}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePet;
