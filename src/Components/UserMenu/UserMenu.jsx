import { useState, useRef, useEffect } from "react";
import { User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const B = "#002A80";
const O = "#FF5000";

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
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition"
      >

        {/* FOTO (MÁS GRANDE) */}
        {user?.foto ? (
          <img
            src={user.foto}
            className="w-11 h-11 object-cover rounded-xl border border-white/20"
          />
        ) : (
          <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-white">
            <User size={20} style={{ color: B }} />
          </div>
        )}

        {/* INFO */}
        <div className="hidden sm:block text-left leading-tight">
          <p className="text-white text-sm font-semibold">
            {user?.nombre?.split(" ")[0]}
          </p>
          <p className="text-xs text-white/70">
            {user?.rol === "lider" ? "Líder" : "Practicante"}
          </p>
        </div>

        <ChevronDown
          size={18}
          className={`text-white/70 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN (MÁS GRANDE) */}
      <div
  className={`absolute mt-3 w-[90vw] max-w-64
  bg-white shadow-xl border border-gray-100
  transition-all duration-200 origin-top
  rounded-xs overflow-hidden
  left-1/3 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0

  ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
`}
>

        {/* HEADER */}
        <div className="px-5 py-4  ">
          <p className="text-base font-semibold text-gray-800 truncate">
            {user?.nombre}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {user?.correo}
          </p>
        </div>

        {/* OPTIONS */}
        <div className="py-2">

          <button
            onClick={handleGoDashboard}
            className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            Mi panel
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 text-sm text-red-500 hover:bg-red-50 transition"
          >
            Cerrar sesión
          </button>

        </div>

        {/* ACCENT */}
        <div className="h-[3px]" style={{ background: O }} />
      </div>
    </div>
  );
}