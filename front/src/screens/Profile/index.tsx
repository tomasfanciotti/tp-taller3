import React, { useEffect, useState } from 'react';
import Sidebar from "../../components/Sidebar";
import { ResponseForm, UserProps } from "../../types/props";
import { useGetQuery, usePutMutation } from "../../hooks/useQuery";
import Loader from "../../components/Loader";


const Profile: React.FC<UserProps> = ({ user }) => {
  const [userData, setUserData] = useState<ResponseForm | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const url = `/users/${user.id}`;

  const { data, isLoading, isSuccess } = useGetQuery<{ data: ResponseForm }>(`http://localhost:9005${url}`);
  const {data: putData, isLoading: putLoading, isSuccess: putSuccess, mutate } = usePutMutation<ResponseForm, ResponseForm>([url]);

  useEffect(() => {
    if (isSuccess && data) {
      setUserData(data?.data);
    }
  }, [isSuccess]);

  const handleEditToggle = () => {
    if (isEditing && userData) {
      mutate({ url: `http://localhost:9005/users/${encodeURIComponent(user.email)}`, body: userData });
    }
    setIsEditing((prev) => !prev); // Toggle edit mode
  };

  useEffect(() => {
    if (putData && putSuccess) {
      setUserData(putData)
    }
  }, [putSuccess])

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />

      {(isLoading || userData === undefined || putLoading) ? (
        <Loader />
      ) : (
        <main className="flex-1 p-4 overflow-hidden">
          <div className="bg-white p-8 rounded shadow">
            <h1 className="text-2xl font-semibold mb-4">Profile Information</h1>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-gray-600">Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData!.fullname}
                    onChange={(e) => setUserData((prev) => ({ ...prev!, fullname: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-800 text-lg font-semibold">{userData!.fullname}</p>
                )}
              </div>
              <div>
                <label className="text-gray-600">Email:</label>
                <p className="text-gray-800 text-lg font-semibold">{user.email}</p>
              </div>
              {/* Add more profile information as needed */}
            </div>

            {/* Additional UI elements for a better user experience */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-600">Fecha de creacion:</label>
                  <p className="text-gray-800">{userData!.register_date}</p>
                </div>
                {user!.isDoctor && (
                  <div>
                    <label className="text-gray-600">Numero de registro:</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={userData!.registration_number}
                        onChange={(e) => setUserData((prev) => ({ ...prev!, registration_number: Number(e.target.value) }))}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">{userData!.registration_number}</p>
                    )}
                  </div>
                )}
                <div>
                  <label className="text-gray-600">Numero de telefono:</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={userData!.phoneNumber}
                      onChange={(e) => setUserData((prev) => ({ ...prev!, phoneNumber: Number(e.target.value) }))}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-800">{userData!.phoneNumber}</p>
                  )}
                </div>
                {/* Add more additional information as needed */}
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="mt-8">
              <button
                onClick={handleEditToggle}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700"
              >
                {isEditing ? 'Save Changes' : 'Editar'}
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Profile;
