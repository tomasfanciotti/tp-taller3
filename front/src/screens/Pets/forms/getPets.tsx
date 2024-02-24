import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PetPropsResponse, UserProps } from '../../../types/props';
import { useGetQuery } from '../../../hooks/useQuery';
import Loader from '../../../components/Loader';
import { Column } from "../../../components/TailwindTable/definitions";
import Table from "../../../components/TailwindTable";
import { useAuthSession } from "../../../hooks/useAuth";
import { getOnlyDate } from "../../../../utils/formatDate";

const ViewPets: React.FC<{ user?: { id: string } }> = ({ user }) => {
  const id = user?.id || useParams().id;
  const realUser = useAuthSession();
  const [pets, setPets] = useState<PetPropsResponse[]>([]);
  const { isLoading, data, isSuccess } = useGetQuery<{ results: PetPropsResponse[] }>(
    `http://localhost:9001/pets/owner/${id}`
  );

  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess && data) {
      const sortedPets = data.results.sort((a, b) => (a.id || 0) - (b.id || 0));
      setPets(sortedPets);
    }
  }, [isSuccess, data]);

  const columns: Array<Column<PetPropsResponse>> = [
    {
      id: 'id',
      name: 'ID',
      className: 'font-medium text-gray-900 text-left',
    },
    {
      id: 'name',
      name: 'Nombre',
      className: 'font-medium text-gray-900 text-left',
    },
    {
      id: 'birth_date',
      name: 'Nacimiento',
      className: 'font-medium text-gray-900 text-left',
      displayFn: getOnlyDate,
    },
    {
      id: 'type',
      name: 'Tipo',
      className: 'font-medium text-gray-900 text-left',
    },
    {
      id: 'register_date',
      name: 'Registrado en',
      className: 'font-medium text-gray-900 text-left',
      displayFn: getOnlyDate,
    }
  ];

  return isLoading || realUser.isLoading ? (
    <Loader />
  ) : (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Tus Mascotas</h2>
      {pets.length === 0 ? (
        <p className="text-gray-600">No tienes mascotas registradas.</p>
      ) : (
        <Table
          columns={columns}
          sortingColumns={[]}
          data={pets}
          setOrdering={'asc'}
          defaultOrder={'asc'}
          onClickRow={(pet) => navigate(realUser.user?.isDoctor && realUser.user.id !== id ? `/doctor/pet/${pet.id}` : `/pets/pet-details/${pet.id}`)}
        />
      )}
    </div>
  );
};

export default ViewPets;
