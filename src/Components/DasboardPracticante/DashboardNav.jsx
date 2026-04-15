import { User, Eye, MessageCircle, LogOut } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardNav({ section, setSection }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const menu = [
    { id: "perfil", label: "Editar Perfil", icon: User },
    { id: "verPerfil", label: "Ver Perfil", icon: Eye },
    { id: "mensajes", label: "Mensajes", icon: MessageCircle },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r flex flex-col justify-between">

      {/* TOP */}
      <div>
        {/* USER INFO */}
        <div className="flex items-center gap-3 p-4 border-b">
          {user?.foto ? (
            <img
              src={user.foto}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <User size={18} className="text-gray-500" />
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user?.nombre?.split(" ")[0]}
            </p>
            <p className="text-xs text-gray-500">
              {user?.correo}
            </p>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-blue-900 font-bold text-sm px-4 mt-4 mb-2 uppercase tracking-wide">
          Panel
        </h2>

        {/* MENU */}
        <div className="space-y-1 px-2">
          {menu.map(({ id, label, icon: Icon }) => {
            const active = section === id;

            return (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition relative
                  
                  ${
                    active
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {/* ACTIVE BAR 🔥 */}
                {active && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-blue-900 rounded-r"></span>
                )}

                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* LOGOUT */}
      <div className="p-3 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 transition"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}