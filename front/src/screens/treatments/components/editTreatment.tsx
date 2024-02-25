import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import usePostMutation, { useGetQuery, usePatchMutation } from "../../../hooks/useQuery";
import { Treatment } from "../../../types/props";
import Loader from "../../../components/Loader";
import SpeechModal from "../../../components/Voice";

const EditTreatmentScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const url = `http://localhost:9004/treatments/treatment/specific/${id}`;
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [nextDose, setNextDose] = useState<Date | null>(null);
  const [description, setDescription] = useState<string>('');
  const { data, isSuccess: loadedData, isLoading: loadingData } = useGetQuery<Treatment>(url);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate, isSuccess, isLoading } = usePatchMutation<Partial<Treatment>, Partial<Treatment>>([url]);
  const { mutate: addComment } = usePostMutation<{ comment: string }, { comment: string }>(`treatment/specific/${id}`);
  const navigate = useNavigate();

  useEffect(() => {
    if (loadedData && data) {
      setStartDate(new Date(data.date_start));
      setEndDate(data.date_end ? new Date(data.date_end) : null);
      setNextDose(data.next_dose ? new Date(data.next_dose) : null);
      setDescription(data.description || '');
    }
  }, [loadedData]);

  const handleSaveChanges = () => {
    const treatmentUpdated: Partial<Treatment> = {
      description: description,
      next_dose: nextDose?.toISOString(),
      date_end: endDate?.toISOString(),
      id,
    }
    mutate({ url: `http://localhost:9004/treatments/treatment/${id}`, body: treatmentUpdated });
  };

  useEffect(() => {
    if (isSuccess) {
      navigate(`/doctor/pet/${data!.applied_to}`);
    }
  }, [isSuccess]);

  if (loadingData) {
    return <Loader/>;
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveText = (text: string) => {
    addComment({ url: `http://localhost:9004/treatments/treatment/comment/${id}`, body: { comment: text } })
    handleCloseModal();
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Editar Tratamiento</h2>
      <div className="mb-4">
        <label className="font-semibold block">Fecha de Inicio:</label>
        <div className="text-gray-700">{startDate.toDateString()}</div>
      </div>
      <div className="mb-4">
        <label className="font-semibold block">Fecha de Fin:</label>
        <DatePicker selected={endDate} onChange={date => setEndDate(date)}/>
      </div>
      <div className="mb-4">
        <label className="font-semibold block">Próxima Dosis:</label>
        <DatePicker selected={nextDose} onChange={date => setNextDose(date)}/>
      </div>
      <div className="mb-4">
        <label className="font-semibold block">Descripción:</label>
        <div className="border border-gray-300 rounded-md">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="p-2 w-full h-32 max-h-48 resize-vertical overflow-y-auto focus:outline-none focus:shadow-outline"
            placeholder="Escriba una descripción aquí..."
          />
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Comentarios</h3>
        <div className="flex items-center">
          <button onClick={handleOpenModal} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none">Agregar Comentario</button>
          {isModalOpen && <SpeechModal onSave={handleSaveText} onCancel={handleCloseModal}/>}
        </div>
      </div>
      <button disabled={isLoading} onClick={handleSaveChanges} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none">{isLoading ? <Loader/> : 'Guardar Cambios'}</button>
    </div>
  );
};

export default EditTreatmentScreen;
