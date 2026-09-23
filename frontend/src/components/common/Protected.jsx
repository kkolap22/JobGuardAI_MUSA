import { Navigate } from "react-router-dom";
import { api } from "../../services/api";

export default function Protected({ children }) {
  return api.isAuthenticated() ? children : <Navigate to="/login" replace />;
}