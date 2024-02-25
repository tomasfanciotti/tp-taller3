// TreatmentDetails.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetQuery } from '../../../hooks/useQuery';
import Loader from '../../../components/Loader';
import { Application, Comment, Treatment } from '../../../types/props';
import { format } from 'date-fns';
import { Column } from "../../../components/TailwindTable/definitions";
import Table from "../../../components/TailwindTable";
import ApplicationTable from "../../application";
import { getOnlyDate } from "../../../../utils/formatDate";

const TreatmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const navigate = useNavigate();
  const { isLoading, data, isSuccess } = useGetQuery<Treatment>(`http://localhost:9004/treatments/treatment/specific/${id}`);
  const columns: Array<Column<Comment>> = [
    {
      id: 'owner',
      name: 'Id del creador'
    },
    {
      id: 'information',
      name: 'Informacion'
    },
    {
      id: 'date_added',
      name: 'fecha de creacion',
      displayFn: getOnlyDate,
    }
  ]

  useEffect(() => {
    if (isSuccess && data) {
      setTreatment(data);
    }
  }, [isSuccess, data]);

  return isLoading ? (
    <Loader/>
  ) : (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Detalles del Tratamiento</h2>
      {treatment ? (
        <div>
          <p><span className="font-semibold">Fecha de Inicio:</span> {format(new Date(treatment.date_start), 'yyyy-MM-dd HH:mm')}</p>
          <p><span className="font-semibold">Fecha de Fin:</span> {treatment.date_end ? format(new Date(treatment.date_end), 'yyyy-MM-dd HH:mm') : 'Sin especificar'}</p>
          <p><span className="font-semibold">Próxima Dosis:</span> {treatment.next_dose ? format(new Date(treatment.next_dose), 'yyyy-MM-dd HH:mm') : 'Sin especificar'}</p>
          <p><span className="font-semibold">Tipo:</span> {treatment.type}</p>
          <p><span className="font-semibold">Descripción:</span> {treatment.description || 'Sin descripción'}</p>
          {data?.comments && data.comments.length > 0 ?
            <Table columns={columns} sortingColumns={[]} data={data!.comments.sort((v1, v2) => v1.date_added > v2.date_added ? 1 : -1)} setOrdering={undefined}
                   defaultOrder={'asc'}/> :
            <p><span className="font-semibold">Sin comentarios</span></p>
          }
          <div className="flex justify-center mt-3 mb-3">
            <ApplicationTable path="treatment"/>
          </div>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-lg" onClick={() => navigate(`/doctor/treatment/edit/${id}`)}>Editar</button>
          <button onClick={() => navigate(`/doctor/application/create/${data!.applied_to}?treatment_id=${id}`)}
                  className="bg-yellow-500 text-white ml-3 py-2 px-4 rounded-md hover:bg-yellow-600 text-lg">
            Agregar aplicacion
          </button>
        </div>
      ) : (
        <p>No se encontraron detalles del tratamiento.</p>
      )}
    </div>
  );
};

export default TreatmentDetails;
