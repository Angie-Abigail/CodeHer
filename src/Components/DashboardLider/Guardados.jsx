import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Lib/firebase";
import { useAuth } from "../../Context/AuthContext";
import VerPracticante from "../Catalogo/VerPracticante";

export default function Guardados() {
  const { user } = useAuth();
  const [guardados, setGuardados] = useState([]);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchGuardados = async () => {
      try {
        const q = query(
          collection(db, "guardados"),
          where("userId", "==", user.uid)
        );

        const snap = await getDocs(q);

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setGuardados(data);
      } catch (err) {
        console.error("ERROR:", err);
      }
    };

    fetchGuardados();
  }, [user?.uid]);

  const abrirPerfil = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  return (
    <>
      <VerPracticante
        open={open}
        onClose={() => setOpen(false)}
        id={selectedId}
      />

      <div className="p-4 sm:p-6 lg:p-8 mt-4 sm:mt-6">

        <div className="mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#003087]">
            Perfiles guardados
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Practicantes que has guardado
          </p>
        </div>

        {guardados.length === 0 ? (
          <div className="text-gray-400 text-sm">
            No tienes perfiles guardados
          </div>
        ) : (
          <div
            className="
              grid gap-4 sm:gap-5
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {guardados.map((g) => (
              <div
                key={g.id}
                onClick={() => abrirPerfil(g.practicanteId)}
                className="
                  cursor-pointer
                  bg-white rounded-2xl p-4
                  shadow-sm hover:shadow-md
                  transition-all
                  border border-gray-100 hover:border-[#003087]/20
                "
              >
                <div className="flex items-center gap-3">

                  {/* FOTO */}
                  <img
                    src={g.foto}
                    alt={g.nombre}
                    className="
                      w-10 h-10 sm:w-12 sm:h-12
                      rounded-full object-cover
                      border border-gray-100
                    "
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#003087] text-sm sm:text-base truncate">
                      {g.nombre}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {g.carrera}
                    </p>
                  </div>

                  <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                </div>

                <p className="text-xs text-gray-400 mt-3 truncate">
                  {g.email}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}