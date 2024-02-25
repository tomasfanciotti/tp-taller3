import React, { useEffect, useState } from 'react';
import { useGetQuery } from "hooks/useQuery";
import { UserProps, UserRequestProps } from "types/props";
import Loader from "components/Loader";
import Table from "components/TailwindTable";
import { Column } from "components/TailwindTable/definitions";
import { useNavigate } from "react-router-dom";
import { getOnlyDate } from "../../../../utils/formatDate";

const Patients: React.FC<UserProps> = ({ user }) => {
  const navigate = useNavigate();
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<Array<UserRequestProps>>([]);
  const [firstLoading, setFirstLoading] = useState(true);
  const { isSuccess, isLoading, data } = useGetQuery<{ data: Array<UserRequestProps> }>(`http://localhost:9005/users/search/by_email?email=${searchEmail}`);
  const columns: Array<Column<UserRequestProps>> = [
    {
      id: 'id',
      className: 'font-medium text-gray-900 text-left',
      name: 'Id'
    },
    {
      id: 'fullname',
      className: 'font-medium text-gray-900 text-left',
      name: 'Nombre completo'
    },
    {
      id: 'register_date',
      className: 'font-medium text-gray-900 text-left',
      name: 'Registrado en',
      displayFn: getOnlyDate,
    },
    {
      id: 'email',
      className: 'font-medium text-gray-900 text-left',
      name: 'Email'
    },
  ];

  useEffect(() => {
    if (isSuccess && data) {
      setSearchResults(data.data.filter((v) => !v.registration_number));
      setFirstLoading(false);
    }
  }, [isSuccess, data]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {isLoading && firstLoading ? (
        <div className="flex items-center justify-center w-full">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full p-6">
          <h2 className="text-2xl font-semibold mb-4">Buscar mascotas por dueño</h2>
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Escribir email del dueño"
              className="border border-gray-300 rounded-md p-2 mr-2 focus:outline-none"
            />
          </div>
          {searchResults.length > 0 ? (
            <div className="w-full border-b border-gray-200 shadow sm:rounded-lg">
              <Table onClickRow={(data) => navigate(`/doctor/owner/${data.id}`)} setOrdering={undefined} columns={columns} data={searchResults} defaultOrder="asc" sortingColumns={[]} />
            </div>
          ) : (
            <div className="text-gray-600">No se encontraron usuarios.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Patients;
