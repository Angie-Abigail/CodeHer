
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import Inicio from "./Pages/Home/Inicio";
import ProtectedRoute from "./Components/AdminRoute/AdminRoute";

//Componentes Generales
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/Login/Login";
import Registro from "./Components/Registro/Registro";
import Perfil from "./Components/DasboardPracticante/Perfil";
import Dashboard from "./Components/DasboardPracticante/Dashboard";
import UserMenu from "./Components/UserMenu/UserMenu";
import DashboardNav from "./Components/DasboardPracticante/DashboardNav";
import DashboardContent from "./Components/DasboardPracticante/DashboardContent";
import VerPerfil from "./Components/DasboardPracticante/VerPerfil";
import Mensajes from "./Components/DasboardPracticante/Mensajes";
import CatalogoPracticantes from "./Pages/Catalogo/Catalogo";

import "./App.css";


// ⭐ RUTA PROTEGIDA PARA USUARIOS NORMALES
function RutaProtegida({ element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-cyan-600">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return element;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  return (



      <main className="min-h-[calc(100vh-64px)]">
        <Routes>
          {/* 📌 RUTAS PÚBLICAS */}
          <Route path="/" element={<Inicio searchQuery={searchQuery} />} />     
          <Route path="/dashboard" element={<Perfil />} />
          <Route path="/catalogo" element={<CatalogoPracticantes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </main>

   

  );
}
