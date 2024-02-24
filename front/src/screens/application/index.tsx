import React from "react";
import { useGetQuery } from "../../hooks/useQuery";
import { Application } from "../../types/props";
import { useParams } from "react-router-dom";
import Table from "../../components/TailwindTable";
import { Column } from "../../components/TailwindTable/definitions";
import { getOnlyDate } from "../../../utils/formatDate";

const translations: Record<string, string> = {
  vaccine: 'Vacuna',
  pill: 'Pastilla',
}
const ApplicationTable: React.FC<{ path: string, onClick?: (d: Application) => void }> = ({ path, onClick }) => {
  const { id } = useParams<{ id: string }>();
  const { data } = useGetQuery<Array<Application>>(`http://localhost:9000/treatments/application/${path}/${id}`);
  const columnsApp: Array<Column<Application>> = [
    {
      id: 'id',
      name: 'Id del aplicacion'
    },
    {
      id: 'type',
      name: 'Tipo',
      displayFn: (d) => translations[d] || d,
    },
    {
      id: 'date',
      name: 'fecha de aplicacion',
      displayFn: getOnlyDate,
    },
    {
      id: 'name',
      name: 'nombre de la aplicacion',
    }
  ]
  return (
    <div className="flex justify-center items-center">
      {data && data.length > 0 ?
        <Table columns={columnsApp} onClickRow={onClick} sortingColumns={[]} data={data.sort((v1, v2) => v1.date > v2.date ? 1 : -1)} setOrdering={undefined}
               defaultOrder={'asc'}/> :
        <p><span className="font-semibold">Sin Aplicaciones</span></p>
      }
    </div>
  )
}
export default ApplicationTable;
