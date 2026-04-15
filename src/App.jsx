
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import Inicio from "./Pages/Home/Inicio";



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
        </Routes>
      </main>

   

  );
}
