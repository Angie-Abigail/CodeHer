import { User, Eye, MessageCircle } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";

const O = "#FF5000";
const B = "#002A80";

export default function DashboardNav({ section, setSection }) {
  const { user } = useAuth();

  const menu = [
    { id: "perfil", label: "Editar Perfil", icon: User },
    { id: "verPerfil", label: "Ver Perfil", icon: Eye },
    { id: "mensajes", label: "Mensajes", icon: MessageCircle },
  ];

  return (
    <div
      className="
        w-full md:w-64
        min-h-auto md:min-h-screen
        px-3 sm:px-4 py-4 sm:py-6
        flex flex-col
      "
    >
<br />
      <div className="flex items-center gap-3 px-2 sm:px-3 mb-5 sm:mb-6">
        {user?.foto ? (
          <img
            src={user.foto}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <User size={18} className="text-gray-400" />
          </div>
        )}

        <div className="leading-tight">
          <p className="text-xs sm:text-sm font-semibold text-gray-800">
            {user?.nombre?.split(" ")[0]}
          </p>
          <p className="text-[11px] sm:text-xs text-gray-400 truncate max-w-[140px]">
            {user?.correo}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl p-1 sm:p-2 shadow-sm">

        {menu.map(({ id, label, icon: Icon }) => {
          const active = section === id;

          return (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`
                w-full flex items-center gap-3
                px-3 sm:px-4 py-2.5 sm:py-3
                rounded-lg sm:rounded-xl
                text-xs sm:text-sm font-medium
                transition-all duration-200
              `}
              style={
                active
                  ? {
                      background: `#002A80`,
                      color: "white",
                    }
                  : {}
              }
            >
              <Icon
                size={18}
                className={active ? "text-white" : "text-gray-400"}
              />

              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}