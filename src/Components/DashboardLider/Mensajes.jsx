import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../Lib/firebase";
import { useAuth } from "../../Context/AuthContext";

export default function MensajesLider() {
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchMensajes = async () => {
    if (!user?.id) return;

    setLoading(true);

    const q = query(
      collection(db, "mensajes"),
      where("para", "==", user.id)
    );

    const snap = await getDocs(q);

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    data.sort(
      (a, b) => (b.fecha?.seconds || 0) - (a.fecha?.seconds || 0)
    );

    setMensajes(data);
    setLoading(false);
  };

  fetchMensajes();
}, [user]);
  if (loading) {
    return <div className="p-6 text-gray-400">Cargando mensajes...</div>;
  }

  if (mensajes.length === 0) {
    return <div className="p-6 text-gray-400">No tienes mensajes.</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-[#003087]">
        Mensajes recibidos
      </h2>

      <div className="space-y-3">
        {mensajes.map((m) => (
          <div
            key={m.uid}
            className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3 shadow-sm"
          >
            {/* AVATAR */}
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
              {m.de?.slice(0, 2).toUpperCase()}
            </div>

            {/* CONTENIDO */}
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm font-semibold">
                  Usuario: {m.de}
                </p>

                <span className="text-[11px] text-gray-400">
                  {m.fecha?.toDate?.().toLocaleString?.()}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {m.mensaje}
              </p>
            </div>

            {/* NO LEÍDO */}
            {!m.leido && (
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-2"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}