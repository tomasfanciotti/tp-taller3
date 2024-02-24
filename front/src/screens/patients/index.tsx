import React from 'react';
import { UserProps } from "../../types/props";
import Sidebar from "../../components/Sidebar";
import { Navigate, Route, Routes } from "react-router-dom";
import ViewPets from "../Pets/forms/getPets";
import Patients from "./forms/patients";
import PetDetails from "../Pets/forms/petDetails";
import CreateTreatmentScreen from "../treatments";
import TreatmentDetails from "../treatments/components/getTreatment";
import EditTreatmentScreen from "../treatments/components/editTreatment";
import AddApplicationScreen from "../application/forms/addApplication";
import ApplicationsPet from "../Pets/forms/applications";

const DoctorSearchPatientsScreen: React.FC<UserProps> = ({ user }) => {

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user}/>
      <Routes>
        <Route path="owner/:id" element={<ViewPets/>}></Route>
        <Route path="pet/:id" element={<PetDetails user={user}/>}></Route>
        <Route path="treatment/create/:id" element={<CreateTreatmentScreen/>}></Route>
        <Route path="treatment/actual/:id" element={<TreatmentDetails/>}></Route>
        <Route path="treatment/edit/:id" element={<EditTreatmentScreen/>}></Route>
        <Route path="owners" element={<Patients user={user}/>} />
        <Route path="application/create/:petId" element={<AddApplicationScreen/>} />
        <Route path="application/get/:id" element={<ApplicationsPet/>} />
        <Route index element={<Navigate to="owners" />} />
      </Routes>
    </div>
  );
};

export default DoctorSearchPatientsScreen;
