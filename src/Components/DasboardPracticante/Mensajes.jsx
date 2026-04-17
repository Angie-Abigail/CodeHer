import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../Lib/firebase";
import { useAuth } from "../../Context/AuthContext";

const B = "#003087";

export default function Mensajes() {
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    const fetchMensajes = async () => {
      if (!user?.uid) return;

      const q = query(
        collection(db, "mensajes"),
        where("para", "==", user.uid)
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      data.sort((a, b) => b.fecha?.seconds - a.fecha?.seconds);

      setMensajes(data);
    };

    fetchMensajes();
  }, [user?.uid]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      {/* HEADER */}
      <h2
        className="text-base font-semibold mb-5"
        style={{ color: B }}
      >
        Mis mensajes
      </h2>

      {/* EMPTY STATE */}
      {mensajes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 text-sm">
            No tienes mensajes aún
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {mensajes.map((m) => (
            <div
              key={m.id}
              className="rounded-xl bg-gray-50 px-4 py-3 hover:bg-gray-100 transition"
            >

              {/* sender */}
              <p className="text-xs font-medium text-gray-500">
                De: <span className="text-gray-700">{m.de}</span>
              </p>

              {/* message */}
              <p className="text-sm text-gray-800 mt-1 leading-snug">
                {m.mensaje}
              </p>

              {/* time */}
              <p className="text-[11px] text-gray-400 mt-2">
                {m.fecha?.toDate?.().toLocaleString?.() || ""}
              </p>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}