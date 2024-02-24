import { useNavigate } from "react-router-dom";
import ApplicationTable from "../../application";
import React from "react";

const ApplicationsPet = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="max-w-4xl w-full p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Aplicaciones de la mascota</h2>
        <ApplicationTable
          path="pet"
          onClick={(d) => d.treatment_id ? navigate(`/doctor/treatment/actual/${d.treatment_id}`) : alert('No hay tratamiento para ir')}
        />
      </div>
    </div>
  )
}

export default ApplicationsPet;
