import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetQuery } from '../../../hooks/useQuery';
import Loader from '../../../components/Loader';
import { Treatment } from '../../../types/props';
import { Column } from "../../../components/TailwindTable/definitions";
import Table from "../../../components/TailwindTable";
import { getOnlyDate } from "../../../../utils/formatDate";

const TreatmentsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [petTreatments, setPetTreatments] = useState<Treatment[]>([]);
  const { isLoading, data, isSuccess } = useGetQuery<Treatment[]>(`http://localhost:9000/treatments/treatment/pet/${id}`);
  const navigate = useNavigate();
  const columns: Array<Column<Treatment>> = [
    {
      id: 'id',
      className: 'font-medium text-gray-900 text-left',
      name: 'Id'
    },
    {
      id: 'date_start',
      className: 'font-medium text-gray-900 text-left',
      name: 'Fecha de inicio',
      displayFn: getOnlyDate,
    },
    {
      id: 'description',
      name: 'Descripcion'
    },
    {
      id: 'date_end',
      className: 'font-medium text-gray-900 text-left',
      name: 'Fecha de fin',
      displayFn: getOnlyDate,
    },
  ];

  useEffect(() => {
    if (isSuccess && data) {
      setPetTreatments(data);
    }
  }, [isSuccess, data]);

  return (
    <div className="flex justify-center items-center">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="max-w-4xl w-full p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Tratamientos de la Mascota</h2>
          {petTreatments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                sortingColumns={[]}
                onClickRow={(d) => navigate(`/doctor/treatment/actual/${d.id}`)}
                data={petTreatments}
                setOrdering={undefined}
                defaultOrder={'asc'}
              />
            </div>
          ) : (
            <p className="text-gray-600 text-center">No se encontraron tratamientos para esta mascota.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TreatmentsView;
