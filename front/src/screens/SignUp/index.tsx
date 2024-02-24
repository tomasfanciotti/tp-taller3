import React, { useEffect, useState } from 'react';
import { signUpData, useSignUp } from "../../hooks/useAuth";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { ClipLoader } from "react-spinners";

interface FormData {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  registrationNumber: string;
  random?: string;
}

const SignUp: React.FC = () => {
  const { mutate, isSuccess, isLoading, isError, data: resultSignUp } = useSignUp();
  const [s] = useSearchParams();
  const telegramId = s.get('telegram_id');
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    registrationNumber: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isDoctor, setIsDoctor] = useState<boolean>(false);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Formato de correo electrónico no válido';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'El número de teléfono es obligatorio';
    } else if (!/^\+?\d*$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Formato de número de teléfono no válido';
    }

    if (isDoctor && !formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'El número de registro es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const data: signUpData = { mail: formData.email, name: formData.username, password: formData.password, phoneNumber: Number(formData.phoneNumber) };
      if (telegramId && Number(telegramId)) {
        console.log('telegram id is:', telegramId);
        data['telegramId'] = Number(telegramId);
      }
      if (isDoctor) {
        data['registrationNumber'] = Number(formData.registrationNumber);
      }
      mutate(data)
    }
  };

  useEffect(() => {
    if (isSuccess && localStorage.getItem('TOKEN_USER')) {
      navigate('/main/home');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccess && localStorage.getItem('TOKEN_USER')) {
      navigate('/main/home');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      console.log('error data is:', resultSignUp);
      setErrors({random: resultSignUp});
    }
  }, [isError]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-center">Registrarse</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                Nombre de usuario:
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.username && 'border-red-500'
                }`}
              />
              {errors.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Correo electrónico:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.email && 'border-red-500'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Contraseña:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.password && 'border-red-500'
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                Número de teléfono:
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.phoneNumber && 'border-red-500'
                }`}
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs italic">{errors.phoneNumber}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="isDoctor" className="block text-gray-700 text-sm font-bold mb-2">
                ¿Sos un doctor?
              </label>
              <input
                type="checkbox"
                name="isDoctor"
                id="isDoctor"
                checked={isDoctor}
                onChange={() => setIsDoctor(!isDoctor)}
                className="mr-2"
              />
              <label htmlFor="isDoctor" className="text-gray-700 text-sm">
                Sí
              </label>
            </div>
            {isDoctor && (
              <div className="mb-4">
                <label htmlFor="registrationNumber" className="block text-gray-700 text-sm font-bold mb-2">
                  Número de Registro:
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.registrationNumber && 'border-red-500'
                  }`}
                />
                {errors.registrationNumber && (
                  <p className="text-red-500 text-xs italic">{errors.registrationNumber}</p>
                )}
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full"
              disabled={isLoading}
            >
              {isLoading ? <ClipLoader size={20} color='#fff' /> : 'Registrarse'}
            </button>
            {errors.random && (
              <p className="text-red-500 text-xs italic">{errors.registrationNumber}</p>
            )}
          </form>
          <p className="text-center text-gray-600 text-md">
            ¿Ya tenes una cuenta?{' '}
            <Link to={`/sign-in${telegramId ? `?telegram_id=${telegramId}` : ''}`} className="text-primary-600 hover:text-primary-500 font-semibold">
              Ingresar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
