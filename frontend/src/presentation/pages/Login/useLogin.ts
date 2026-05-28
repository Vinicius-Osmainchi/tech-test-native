import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../data/services/AuthService";
import { AxiosError } from "axios";

interface LoginFormData {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthService.login(values.email, values.password);
      localStorage.setItem("@TechTest:token", response.token);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Falha ao comunicar com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleLogin,
  };
};
