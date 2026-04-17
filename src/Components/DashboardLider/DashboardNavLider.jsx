import { MessageCircle, Bookmark } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";

export default function DashboardNavLider({ section, setSection }) {
  const { user } = useAuth();

  const menu = [
    { id: "mensajes", label: "Mensajes", icon: MessageCircle },
    { id: "guardados", label: "Perfiles guardados", icon: Bookmark },
  ];

  return (
    <div className="w-64 min-h-screen bg-[#F4F6FB] px-4 py-6 flex flex-col">

<br />
      {/* USER */}
      <div className="flex items-center gap-3 px-3 mb-6">
        {user?.foto ? (
          <img src={user.foto} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm" />
        )}

        <div>
          <p className="text-sm font-semibold">{user?.nombre}</p>
          <p className="text-xs text-gray-400">{user?.correo}</p>
        </div>
      </div>

      {/* MENU */}
      <div className="bg-white rounded-2xl p-2 shadow-sm">

        {menu.map(({ id, label, icon: Icon }) => {
          const active = section === id;

          return (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${active ? "text-white" : "text-gray-600 hover:bg-gray-100"}
              `}
              style={
                active
                  ? { background: "linear-gradient(135deg, #003087, #0a6fd8)" }
                  : {}
              }
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}

      </div>
    </div>
  );
}