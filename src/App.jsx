import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import Inicio from "./Pages/Home/Inicio";
import ProtectedRoute from "./Components/AdminRoute/ProtectedRoute";
import Login from "./Components/Login/Login";
import Registro from "./Components/Registro/Registro";
import Perfil from "./Components/DasboardPracticante/Perfil";
import CatalogoPracticantes from "./Pages/Catalogo/Catalogo";
import Dashboard from "./Components/DasboardPracticante/Dashboard";
import DashboardLider from "./Components/DashboardLider/DashboardLider";

export default function App() {
  const [searchQuery] = useState("");

  return (
    <AuthProvider>
      <main className="min-h-[calc(100vh-64px)]">
        <Routes>

          <Route path="/" element={<Inicio searchQuery={searchQuery} />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute rolRequerido="usuario">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
  path="/catalogo"
  element={
    <ProtectedRoute rolRequerido="lider">
      <CatalogoPracticantes />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard-lider"
  element={
    <ProtectedRoute rolRequerido="lider">
      <DashboardLider />
    </ProtectedRoute>
  }
/>

          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

        </Routes>
      </main>
    </AuthProvider>
  );
}