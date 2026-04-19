import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Login from "../Login/Login";
import Registro from "../Registro/Registro";
import UserMenu from "../UserMenu/UserMenu";
import { useAuth } from "../../Context/AuthContext";
import { Menu, X } from "lucide-react";
import logo from "../../assets/logo.png"

export default function Navbar() {
  const [modal, setModal] = useState(null);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => setOpen(false);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 shadow-md border-b border-white/10 bg-[#002A80]">
        <div className="w-full px-6 md:px-16 lg:px-24 py-3 flex justify-between items-center">

          <div className="flex items-center gap-6">
            <Link
              to="/"
              
            >
              <img src={logo} alt=""  className="h-8 md:h-10 lg:h-12 w-auto object-contain"/>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  isActive("/")
                    ? "bg-white text-blue-950"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                Inicio
              </Link>

              {user?.rol?.toLowerCase() === "lider" && (
                <Link
                  to="/catalogo"
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    isActive("/catalogo")
                      ? "bg-orange-500 text-white"
                      : "text-white/80 hover:text-white hover:bg-orange-500/20"
                  }`}
                >
                  Catálogo
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              {user ? (
                <UserMenu user={user} />
              ) : (
                <button
                  onClick={() => setModal("login")}
                  className="px-5 py-2 rounded-full text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600"
                >
                  Iniciar sesión
                </button>
              )}
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden px-6 pb-4 pt-2 space-y-2  bg-[#002A80] border-t border-white/10">
            <Link
              to="/"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md ${
                isActive("/")
                  ? "bg-white text-blue-950"
                  : "text-white/80"
              }`}
            >
              Inicio
            </Link>

            {user?.rol?.toLowerCase() === "lider" && (
              <Link
                to="/catalogo"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md ${
                  isActive("/catalogo")
                    ? "bg-orange-500 text-white"
                    : "text-white/80"
                }`}
              >
                Catálogo
              </Link>
            )}

            <div className="pt-2 border-t border-white/10">
              {user ? (
                <UserMenu user={user} />
              ) : (
                <button
                  onClick={() => {
                    setModal("login");
                    closeMenu();
                  }}
                  className="w-full px-5 py-2 rounded-full bg-orange-500 text-white"
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {modal === "login" && (
        <Login
          onClose={() => setModal(null)}
          irARegistro={() => setModal("registro")}
        />
      )}

      {modal === "registro" && (
        <Registro
          onClose={() => setModal(null)}
          irALogin={() => setModal("login")}
        />
      )}
    </>
  );
}