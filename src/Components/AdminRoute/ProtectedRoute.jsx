import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function ProtectedRoute({ children, rolRequerido }) {
  const { user, loading } = useAuth();

  // 🔥 IMPORTANTE: esperar Firebase
  if (loading) {
    return <div className="p-10 text-center">Cargando...</div>;
  }

  // 🔥 si no hay usuario después de cargar Firebase
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 🔥 si hay rol requerido
  if (
    rolRequerido &&
    user?.rol &&
    user.rol.toLowerCase() !== rolRequerido.toLowerCase()
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}