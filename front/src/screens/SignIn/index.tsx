import React from "react";
import Login, { FormData } from "./form";
import { useSignIn } from "../../hooks/useAuth";

export default function SignIn() {
  const { mutate, isLoading, isSuccess, isError } = useSignIn();
  const handleLogin = (formData: FormData) => mutate({ mail: formData.username, password: formData.password });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="flex justify-center w-full">
            <img
              src='/images/img.png'
              alt="pet place"
            />
          </div>

          {/* Login component added here */}
          <Login onLogin={handleLogin} isLoading={isLoading} isSuccess={isSuccess} isError={isError} />
        </div>
      </div>
    </div>
  );
};
