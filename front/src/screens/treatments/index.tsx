import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import usePostMutation from "../../hooks/useQuery";
import Loader from "../../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { Treatment } from "../../types/props";

interface TreatmentData {
  startDate: Date;
  endDate: Date | null;
  nextDoseDate: Date | null;
  type: 'vaccine' | 'pill' | 'other';
  customType?: string;
  description: string;
}

const CreateTreatmentScreen: React.FC = () => {
  const { id } = useParams();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [nextDoseDate, setNextDoseDate] = useState<Date | null>(null);
  const [type, setType] = useState<'vaccine' | 'pill' | 'other'>('vaccine');
  const [customType, setCustomType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const {mutate, isSuccess, isLoading} = usePostMutation<Partial<Treatment>>();
  const navigate = useNavigate();

  const handleSaveTreatment = () => {
    const treatmentData: Partial<Treatment> = {
      date_start: startDate.toISOString(),
      date_end: endDate?.toISOString(),
      next_dose: nextDoseDate?.toISOString(),
      type: type === 'other' && customType ? customType : type,
      description,
      applied_to: Number(id),
    };
    mutate({url: 'http://localhost:9000/treatments/treatment/', body: treatmentData });
  };

  useEffect(() => {
    if (isSuccess) {
      navigate(`/doctor/pet/${id}`);
    }
  }, [isSuccess])

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value as 'vaccine' | 'pill' | 'other';
    if (selectedType !== 'other') {
      setCustomType('');
    }
    setType(selectedType);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Crear Tratamiento para Mascota</h1>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-lg font-medium">Fecha y Hora de Inicio:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date as Date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            className="border border-gray-300 rounded-md p-2 focus:outline-none"
            placeholderText="Seleccione fecha y hora"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-lg font-medium">Fecha y Hora de Fin:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date as Date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            className="border border-gray-300 rounded-md p-2 focus:outline-none"
            placeholderText="Seleccione fecha y hora"
            minDate={startDate}
            maxDate={new Date(nextDoseDate || Infinity)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="nextDoseDate" className="text-lg font-medium">Fecha y Hora de la Próxima Dosis:</label>
          <DatePicker
            selected={nextDoseDate}
            onChange={(date) => setNextDoseDate(date as Date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            className="border border-gray-300 rounded-md p-2 focus:outline-none"
            placeholderText="Seleccione fecha y hora"
            minDate={new Date(startDate)}
            maxDate={endDate}
          />
        </div>
        {/* Type and Custom Type fields */}
        <div className="flex flex-col">
          <label htmlFor="type" className="text-lg font-medium">Tipo de Tratamiento:</label>
          <select
            id="type"
            value={type}
            onChange={handleTypeChange}
            className="border border-gray-300 rounded-md p-2 focus:outline-none"
          >
            <option value="vaccine">Vacuna</option>
            <option value="pill">Pastilla</option>
            <option value="other">Otro</option>
          </select>
          {type === 'other' && (
            <input
              type="text"
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              placeholder="Especificar tipo"
              className="border border-gray-300 rounded-md p-2 mt-2 focus:outline-none"
            />
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="text-lg font-medium">Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Ingrese una descripción"
            className="border border-gray-300 rounded-md p-2 focus:outline-none"
          />
        </div>
        <button
          onClick={handleSaveTreatment}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          {isLoading ? <Loader/> : 'Guardar Tratamiento'}
        </button>
      </div>
    </div>
  );
};

export default CreateTreatmentScreen;
