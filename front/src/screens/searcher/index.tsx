import React, { useEffect, useState } from 'react';
import Sidebar from "../../components/Sidebar";
import { ResponseForm, UserProps } from "../../types/props";
import { useGetQuery, usePutMutation } from "../../hooks/useQuery";
import Loader from "../../components/Loader";


const Searcher: React.FC<UserProps> = ({ user }) => {
  const [userData, setUserData] = useState<ResponseForm | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const url = `/users/${user.id}`;

  const SearchVets = () => {
    console.log("searching vets")
  }
  // create a cosntant that contain the location of the user
  const userLocation = {
    lat: 0,
    lng: 0
  }

  // create a constant that contains a list of locations of the vets
  const vetsLocation:({lat:number, lng: number})[] = [ ]

  const { data, isLoading, isSuccess } = useGetQuery<{ data: ResponseForm }>(`https://api.lnt.digital${url}`);
  const {data: putData, isLoading: putLoading, isSuccess: putSuccess, mutate } = usePutMutation<ResponseForm, ResponseForm>([url]);

  useEffect(() => {
    if (isSuccess && data) {
      setUserData(data?.data);
    }
  }, [isSuccess]);


  useEffect(() => {
    if (putData && putSuccess) {
      setUserData(putData)
    }
  }, [putSuccess])

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <main className="flex-1 p-4 overflow-hidden">
        <div id="map">
          <h1> Localize Pets </h1>
        </div>
        <div id="search">
            <h1> Search Pets </h1>
            <button onClick={SearchVets}>Buscar</button>
        </div>

      </main>

    </div>
  );
};

export default Searcher;
