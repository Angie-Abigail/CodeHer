import { useState } from "react";
import Login from "../Login/Login";
import Registro from "../Registro/Registro";
import UserMenu from "../UserMenu/UserMenu";
import { useAuth } from "../../Context/AuthContext";

export default function Navbar() {
  const [modal, setModal] = useState(null); // "login" | "registro"
  const { user } = useAuth();

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 
                      bg-white/10 backdrop-blur-md 
                      border-b border-white/10">

        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          
          {/* LOGO */}
          <div className="text-white font-bold text-xl">
            BCP
          </div>

          {/* 🔥 AQUÍ ESTÁ LA MAGIA */}
          {user ? (
            <UserMenu user={user} />
          ) : (
            <button 
              onClick={() => setModal("login")}
              className="bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600 transition"
            >
              Iniciar sesión
            </button>
          )}

        </div>
      </div>

      {/* LOGIN */}
      {modal === "login" && (
        <Login 
          onClose={() => setModal(null)}
          irARegistro={() => setModal("registro")}
        />
      )}

      {/* REGISTRO */}
      {modal === "registro" && (
        <Registro 
          onClose={() => setModal(null)}
          irALogin={() => setModal("login")}
        />
      )}
    </>
  );
}