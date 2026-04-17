import { useState, useRef, useEffect } from "react";
import { User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const B = "#003087";
const O = "#F47920";

export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();
  const { logout } = useAuth();

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
    navigate("/");
  };

  const handleGoDashboard = () => {
    setOpen(false);

    if (user?.rol?.toLowerCase() === "lider") {
      navigate("/dashboard-lider");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="relative" ref={ref}>

      {/* TRIGGER */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg hover:bg-white/5 transition"
      >
        {/* FOTO */}
        {user?.foto ? (
          <img
            src={user.foto}
            className="w-8 h-8 sm:w-9 sm:h-9 object-cover rounded-lg"
          />
        ) : (
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-white"
          >
            <User size={16} style={{ color: B }} />
          </div>
        )}

        {/* INFO (ocultar en mobile muy pequeño) */}
        <div className="hidden sm:block text-left leading-tight">
          <p className="text-white text-xs sm:text-sm font-semibold">
            {user?.nombre?.split(" ")[0]}
          </p>
          <p className="text-[10px] sm:text-[11px] text-white/70">
            {user?.rol === "lider" ? "Líder" : "Practicante"}
          </p>
        </div>

        <ChevronDown
          size={16}
          className={`text-white/70 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN */}
      <div
        className={`absolute right-0 mt-3 w-52 sm:w-56 md:w-60
        bg-white shadow-lg border border-gray-100
        transition-all duration-200 origin-top-right
        rounded-lg overflow-hidden
        ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >

        {/* HEADER */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {user?.nombre}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {user?.correo}
          </p>
        </div>

        {/* OPTIONS */}
        <div className="py-1">

          <button
            onClick={handleGoDashboard}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            Mi panel
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
          >
            Cerrar sesión
          </button>

        </div>

        {/* ACCENT */}
        <div className="h-[2px]" style={{ background: O }} />
      </div>
    </div>
  );
}