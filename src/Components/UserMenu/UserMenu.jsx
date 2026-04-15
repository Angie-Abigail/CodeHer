import { useState, useRef, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/"); // redirige al inicio
  };

  return (
    <div className="relative" ref={ref}>
      
      {/* BOTÓN PERFIL */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition"
      >
        {/* FOTO */}
        {user?.foto ? (
          <img
            src={user.foto}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <User size={16} className="text-blue-900" />
          </div>
        )}

        {/* NOMBRE */}
        <span className="text-white text-sm font-medium">
          {user?.nombre?.split(" ")[0]}
        </span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">

          {/* PERFIL */}
          <button
            onClick={() => {
              setOpen(false);
              navigate("/dashboard");
            }}
            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition text-sm"
          >
            Ver perfil
          </button>

          {/* DIVIDER */}
          <div className="border-t"></div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 transition text-sm"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>

        </div>
      )}
    </div>
  );
}