// Login.tsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ClipLoader } from 'react-spinners';
import { usePutMutation } from "../../hooks/useQuery";

interface LoginProps {
  onLogin: (formData: FormData) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export interface FormData {
  username: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading, isSuccess, isError }) => {
  const navigate = useNavigate();
  const [s] = useSearchParams();
  const telegramId = s.get('telegram_id');
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const {isLoading: putLoading, isSuccess: putSuccess, mutate } = usePutMutation<{ telegram_id: number }, { telegram_id: number }>();

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const passwordToggleIcon = showPassword ? (
    <FontAwesomeIcon icon={faEye} className="h-6 w-6 text-gray-600" />
  ) : (
    <FontAwesomeIcon icon={faEyeSlash} className="h-6 w-6 text-gray-600" />
  );

  const passwordToggleLabel = showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onLogin(formData);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      if (telegramId && Number(telegramId)) {
        mutate({url: `http://localhost:9005/users/${encodeURIComponent(formData.username)}`, body: { telegram_id: Number(telegramId) }})
      } else {
        navigate('/main/home');
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (putSuccess) {
      navigate('/main/home');
    }
  }, [putSuccess])

  useEffect(() => {
    if (isError) {
      setErrors({ password: 'usuario o contraseña incorrecto' });
    }
  }, [isError]);

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full p-6 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Iniciar sesión</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-600 mb-1">
              Nombre de usuario:
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`input-field ${errors.username && 'border-red-500'} w-full`}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-600 mb-1 w-full">
              Contraseña:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`input-field ${errors.password && 'border-red-500'}`}
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 focus:outline-none"
                onClick={handleTogglePasswordVisibility}
                aria-label={passwordToggleLabel}
              >
                {passwordToggleIcon}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full transition duration-300"
            disabled={isLoading}
          >
            {(isLoading || putLoading) ? <ClipLoader size={20} color='#fff' /> : 'Iniciar sesión'}
          </button>
        </form>
        <p className="text-center text-gray-600 text-md">
          ¿No tienes una cuenta?{' '}
          <Link to={`/sign-up${telegramId ? `?telegram_id=${telegramId}` : ''}`} className="text-primary-600 hover:text-primary-500 font-semibold">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
