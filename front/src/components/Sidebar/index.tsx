import React from 'react';
import { User } from "../../types/auth";
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
    // Redirect to '/sign-in'
    navigate('/sign-in');
  };

  return (
    <nav className="bg-blue-500 w-64 p-4 text-white relative">
      <div className="mb-4 text-center">
        <img
          src="/images/logo192.png"
          alt="Logo"
          className="mx-auto w-12 h-12 rounded-full"
        />
        <p className="mt-2 text-sm">{user.name}</p>
      </div>
      <ul>
        <li className="mb-2">
          <a href="#/main/home" className="block py-2 px-4 hover:bg-blue-600">
            Dashboard
          </a>
        </li>
        <li className="mb-2">
          <a href="#/profile" className="block py-2 px-4 hover:bg-blue-600">
            Perfil
          </a>
        </li>
        <li className="mb-2">
          <a href="#/pets" className="block py-2 px-4 hover:bg-blue-600">
            Mascotas
          </a>
        </li>
        {/* Add more navigation items as needed */}
      </ul>
      {user.isDoctor ?
        <ul className="pt-10">
        <li className="mb-2">
          <a href="#/doctor/" className="block py-2 px-4 hover:bg-blue-600">
            Pacientes
          </a>
        </li>
      </ul> : <></>}
      {/* Logout button */}
      <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full absolute bottom-4 left-4">
        Cerrar sesión
      </button>
    </nav>
  );
};

export default Sidebar;
