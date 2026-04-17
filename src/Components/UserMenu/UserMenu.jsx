import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
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

  return (
    <div className="relative" ref={ref}>

      {/* TRIGGER */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-4 py-2 transition group"
      >
        {/* FOTO */}
        {user?.foto ? (
          <img
            src={user.foto}
            className="w-9 h-9 object-cover"
            style={{ borderRadius: "8px" }}
          />
        ) : (
          <div
            className="w-9 h-9 flex items-center justify-center"
            style={{
              background: "white",
              borderRadius: "8px",
            }}
          >
            <User size={18} style={{ color: B }} />
          </div>
        )}

        {/* INFO */}
        <div className="text-left leading-tight">
          <p className="text-white text-sm font-semibold">
            {user?.nombre?.split(" ")[0]}
          </p>
          <p className="text-[11px] text-white/70">
            Practicante
          </p>
        </div>

        {/* ICON */}
        <ChevronDown
          size={16}
          className={`text-white/70 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN */}
      <div
        className={`absolute right-0 mt-3 w-56 bg-white shadow-lg border border-gray-100 
        transition-all duration-200 origin-top-right
        ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
        style={{ borderRadius: "10px" }}
      >

        {/* HEADER */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800">
            {user?.nombre}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {user?.correo}
          </p>
        </div>

        {/* OPTIONS */}
        <div className="py-1">

          <button
            onClick={() => {
              setOpen(false);
              navigate("/dashboard");
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 
            hover:bg-gray-50 transition"
          >
            Mi perfil
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-sm text-red-500 
            hover:bg-red-50 transition"
          >
            Cerrar sesión
          </button>

        </div>

        {/* ACCENT LINE */}
        <div
          className="h-[2px]"
          style={{ background: O }}
        />

      </div>
    </div>
  );
}