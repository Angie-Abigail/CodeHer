import { User, Eye, MessageCircle } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";

const O = "#F47920";
const B = "#003087";

export default function DashboardNav({ section, setSection }) {
  const { user } = useAuth();

  const menu = [
    { id: "perfil", label: "Editar Perfil", icon: User },
    { id: "verPerfil", label: "Ver Perfil", icon: Eye },
    { id: "mensajes", label: "Mensajes", icon: MessageCircle },
  ];

  return (
    <div className="w-64 min-h-screen bg-[#F4F6FB] px-4 py-6 flex flex-col">
      <br />
      {/* USER */}
      <div className="flex items-center gap-3 px-3 mb-6">
        {user?.foto ? (
          <img
            src={user.foto}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <User size={18} className="text-gray-400" />
          </div>
        )}

        <div className="leading-tight">
          <p className="text-sm font-semibold text-gray-800">
            {user?.nombre?.split(" ")[0]}
          </p>
          <p className="text-xs text-gray-400 truncate max-w-[140px]">
            {user?.correo}
          </p>
        </div>
      </div>

      {/* MENU CARD */}
      <div className="bg-white rounded-2xl p-2 shadow-sm">

        {menu.map(({ id, label, icon: Icon }) => {
          const active = section === id;

          return (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              
              ${
                active
                  ? "text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }
              `}
              style={
                active
                  ? {
                      background: `linear-gradient(135deg, ${B}, #0a6fd8)`,
                    }
                  : {}
              }
            >
              <Icon
                size={18}
                className={`${
                  active ? "text-white" : "text-gray-400"
                }`}
              />

              <span>{label}</span>
            </button>
          );
        })}

      </div>

    </div>
  );
}