import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function ProtectedRoute({ children, rolRequerido }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (
    rolRequerido &&
    user?.rol?.toLowerCase() !== rolRequerido.toLowerCase()
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}