import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect} from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  return user ? children : null;
};
