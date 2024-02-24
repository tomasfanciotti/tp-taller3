import { useAuthSession } from "./hooks/useAuth";
import { Route, useNavigate, useLocation, Routes } from 'react-router-dom';
import React, { useEffect } from "react";
import uiRoutes from './uiRoutes.json';
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Dashboard from "./screens/dashboard";
import Profile from "./screens/Profile";
import PetManagement from "./screens/Pets";
import Patients from "./screens/patients";

const authRoutes = uiRoutes.auth;

export const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user, isAuthenticated, isLoading,
  } = useAuthSession();

  useEffect(() => {
    if (typeof isAuthenticated === 'boolean') {
      if (!isAuthenticated && location.pathname.startsWith('/main')) {
        navigate('/');
      } else if (isAuthenticated && (location.pathname.length <= 1 || location.pathname.startsWith('/access_token'))) {
        navigate('/main/home');
      }
    }
  }, [isAuthenticated, location, user]);
  return <div className="m-0 ltr:text-center bg-gray-50">
    <>
      <Routes>
        <Route path={authRoutes.signIn} Component={SignIn}/>
        <Route path={authRoutes.signUp} Component={SignUp}/>
        <Route path={'/sign-in'} Component={SignIn}/>
        {user && isAuthenticated &&
          <Route path={'/'}>
            <Route path={'/main/home'} Component={() => <Dashboard user={user}/>}/>
            <Route path={'/profile'} Component={() => <Profile user={user}/>}/>
            <Route path={'/pets/*'} element={<PetManagement user={user}/>}/>
            <Route path={'/doctor/*'} element={<Patients user={user}/>}/>
          </Route>
        }
      </Routes>
    </>
  </div>
}


