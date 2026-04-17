import { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../Login/Login";
import Registro from "../Registro/Registro";
import UserMenu from "../UserMenu/UserMenu";
import { useAuth } from "../../Context/AuthContext";

export default function Navbar() {
  const [modal, setModal] = useState(null);
  const { user } = useAuth();

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 shadow-sm bg-blue-950">
        <div className="w-full px-6 md:px-16 lg:px-24 py-4 flex justify-between items-center">
          
          {/* IZQUIERDA: LOGO + INICIO */}
          <div className="flex items-center gap-8">
            {/* LOGO */}
            <Link to="/" className="text-white font-extrabold text-xl tracking-wide">
              BCP
            </Link>

            {/* INICIO */}
            <Link
              to="/"
              className="text-white font-semibold text-base md:text-lg transition hover:opacity-80"
            >
              Inicio
            </Link>
          </div>

          {/* DERECHA: USER / LOGIN */}
          {user ? (
            <UserMenu user={user} />
          ) : (
            <button
              onClick={() => setModal("login")}
              className="px-5 py-2 rounded-full text-sm font-semibold transition bg-orange-500 text-white hover:opacity-90"
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