import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import usePostMutation from "../../../hooks/useQuery";
import { Application } from "../../../types/props";
import { useQueryClient } from "react-query";

const AddApplicationScreen: React.FC = () => {
  const [s] = useSearchParams();
  const { petId } = useParams();
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [otherName, setOtherName] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const suggestions: string[] = ['Anti rábica', 'covid', 'aleatorio']; // Check where the fuck to look for this
  const { mutate, isSuccess } = usePostMutation<Partial<Application>>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setName(selectedName);
  };

  const handleOtherNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherName(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  const handleDateChange = (date: Date) => {
    setDate(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      applied_to: Number(petId),
      date: date.toISOString(),
      name: name === 'other' ? otherName : name,
      treatment_id: s.get('treatment_id'),
      type,
    }
    mutate({ url: 'http://localhost:9000/treatments/application/', body })
  };

  useEffect(() => {
    if (isSuccess) {
      queryClient.clear();
      const treatmentId = s.get('treatment_id');
      const url = treatmentId ? `/doctor/treatment/actual/${treatmentId}` : `/doctor/application/get/${petId}`
      navigate(url);
    }
  }, [isSuccess])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-semibold mb-8">Agregar Aplicación</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Nombre:</label>
          <select
            value={name}
            onChange={handleNameChange}
            className="block w-full p-3 border border-gray-300 rounded"
          >
            <option value="">Selecciona o escribe un nombre</option>
            {suggestions.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
            <option value="other">Otro</option>
          </select>
          {name === 'other' && (
            <input
              type="text"
              value={otherName}
              onChange={handleOtherNameChange}
              placeholder="Ingresa otro nombre"
              className="block w-full mt-3 p-3 border border-gray-300 rounded"
            />
          )}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Tipo:</label>
          <select
            value={type}
            onChange={handleTypeChange}
            className="block w-full p-3 border border-gray-300 rounded"
          >
            <option value="">Selecciona el tipo</option>
            <option value="vaccine">Vacuna</option>
            <option value="pill">Pastilla</option>
            <option value="other">Otro</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Fecha de aplicacion:</label>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            className="block w-full p-3 border border-gray-300 rounded"
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600"
        >
          Agregar Aplicación
        </button>
      </form>
    </div>
  );
};

export default AddApplicationScreen;
