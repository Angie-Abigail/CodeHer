import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Lib/firebase";
import { useAuth } from "../../Context/AuthContext";

export default function Guardados() {
  const { user } = useAuth();
  const [guardados, setGuardados] = useState([]);

useEffect(() => {
  if (!user?.uid) return;

  const fetchGuardados = async () => {
    try {
      const snap = await getDocs(collection(db, "guardados"));

      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      console.log("GUARDADOS:", data);

      setGuardados(data.filter(g => g.liderId === user.uid));
    } catch (err) {
      console.error("ERROR:", err);
    }
  };

  fetchGuardados();
}, [user?.uid]);

  return (
    <div className="space-y-4">

      <h2 className="text-xl font-bold text-gray-800">
        Perfiles guardados
      </h2>

      {guardados.length === 0 ? (
        <p className="text-gray-500">No tienes perfiles guardados</p>
      ) : (
        guardados.map((g) => (
          <div
            key={g.id}
            className="bg-white p-4 rounded-xl shadow-sm border"
          >
            <p className="font-semibold">{g.nombre}</p>
            <p className="text-sm text-gray-500">{g.email}</p>
          </div>
        ))
      )}

    </div>
  );
}