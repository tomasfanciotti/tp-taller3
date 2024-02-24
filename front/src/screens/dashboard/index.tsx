// Dashboard.tsx

import React from 'react';
import Sidebar from "../../components/Sidebar";
import { User } from "../../types/auth";
import { UserProps } from "../../types/props";

const Dashboard: React.FC<UserProps> = ({ user }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Navigation Bar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-hidden">
        <div className="bg-white p-4 rounded shadow">
          <h1 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h1>
          {/* Add your main content here */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
