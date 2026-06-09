import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../data/services/authServiceTemp";
import { setAuthToken } from "../../../data/services/authStorage";
import { resolveApiErrorMessage, uiMessages } from "../../../shared/messages";
import { AxiosError } from "axios";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrorResponse {
  code?: string;
  error?: string;
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
      setAuthToken(response.token);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof AxiosError) {
        const data = err.response?.data as LoginErrorResponse | undefined;
        setError(resolveApiErrorMessage(data, uiMessages.loginFailed));
      } else {
        setError(uiMessages.loginFailed);
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
