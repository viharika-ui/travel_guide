import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleAuthCallback() {
  const [searchParams] = useSearchParams();
  const { setUserFromToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    if (error) {
      navigate("/login?error=" + error, { replace: true });
      return;
    }
    if (token) {
      setUserFromToken(token);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, setUserFromToken, navigate]);

  return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
}
