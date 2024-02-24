// UpperOptionsBar.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const UpperOptionsBar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center mb-8">
      <div className="space-x-4">
        <Link
          to="create"
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          Create Pet
        </Link>
        <Link
          to="view"
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          View Pets
        </Link>
      </div>
      {/* Add user-related options or other actions as needed */}
    </nav>
  );
};

export default UpperOptionsBar;
