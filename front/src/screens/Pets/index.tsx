// PetManagement.tsx

import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import CreatePet from './forms/createPets';
import ViewPets from './forms/getPets';
import Sidebar from "../../components/Sidebar";
import { UserProps } from "../../types/props";
import UpperOptionsBar from "./upperbar";
import PetDetails from "./forms/petDetails";
import Treatments from "./forms/treatments";

const PetManagement: React.FC<UserProps> = ({ user }) => {

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Navigation Bar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-hidden">
        <div className="bg-white p-8 rounded shadow">
          <h1 className="text-3xl font-semibold mb-6">Pet Management</h1>

          <UpperOptionsBar></UpperOptionsBar>

          {/* Subpage Content */}
          <Routes>
            <Route
              path="create"
              element={<CreatePet/>}
            />
            <Route
              path="view"
              element={<ViewPets user={user} />}
            />
            <Route path="pet-details/:id" element={<PetDetails />}/>
            <Route path="pet-treatments/:petId" element={<Treatments />}/>
            {/* Default redirect to 'create' */}
            <Route index element={<Navigate to="create" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default PetManagement;
