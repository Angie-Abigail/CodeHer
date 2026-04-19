// components/PractitionerCard.jsx
import React, { useState, useEffect } from "react";
import VerPracticante from "./VerPracticante";
import { collection, addDoc, deleteDoc, getDocs, query, where, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../Lib/firebase";
import { useAuth } from "../../Context/AuthContext";

const BLUE = "#002A80";

const PractitionerCard = ({ practicante }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const { user } = useAuth();
  const [guardado, setGuardado] = useState(false);
  const [guardadoId, setGuardadoId] = useState(null);

  const cursos = (practicante.cursos || []).slice(0, 3);
  const experiencia = Array.isArray(practicante.experiencia)
    ? practicante.experiencia.slice(0, 2)
    : [];

  useEffect(() => {
    const checkGuardado = async () => {
      if (!practicante?.id || !user?.uid) return;
      const q = query(
        collection(db, "guardados"),
        where("userId", "==", user.uid),
        where("practicanteId", "==", practicante.id)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setGuardado(true);
        setGuardadoId(snap.docs[0].id);
      } else {
        setGuardado(false);
        setGuardadoId(null);
      }
    };
    checkGuardado();
  }, [practicante?.id, user?.uid]);

  const toggleGuardar = async (e) => {
    e.stopPropagation();
    if (!practicante?.id) return;
    if (guardado) {
      await deleteDoc(doc(db, "guardados", guardadoId));
      setGuardado(false);
      setGuardadoId(null);
    } else {
      const ref = await addDoc(collection(db, "guardados"), {
        userId: user.uid,
        practicanteId: practicante.id,
        nombre: practicante.nombre,
        email: practicante.email || "",
        foto: practicante.foto || "",
        carrera: practicante.carrera || "",
        createdAt: serverTimestamp(),
      });
      setGuardado(true);
      setGuardadoId(ref.id);
    }
  };

  return (
    <>
      <VerPracticante
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        id={practicante.id}
      />

      {/* ── Contenedor con altura fija en desktop, auto en mobile ── */}
      <div
        className="w-full"
        style={{ perspective: "1400px" }}
      >
        {/* ── FLIP WRAPPER ── */}
        <div
          className="relative w-full"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            /* altura fija en md+, automática en mobile */
            height: "460px",
          }}
          /* Desktop: hover */
          onMouseEnter={() => setFlipped(true)}
          onMouseLeave={() => setFlipped(false)}
          /* Mobile: tap */
          onClick={() => setFlipped((f) => !f)}
        >

          {/* ══════════════ FRONT ══════════════ */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-md flex flex-col overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              zIndex: 2,
            }}
          >
            {/* Foto de portada */}
            <div className="h-[150px] sm:h-[170px] relative shrink-0">
              <img
                src={practicante.foto}
                className="w-full h-full object-cover"
                alt=""
              />
              {/* Avatar */}
              <div className="absolute -bottom-8 left-4 sm:left-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white overflow-hidden shadow-md bg-white">
                  <img src={practicante.foto} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 pt-11 sm:pt-12 flex flex-col flex-1">
              <h3 className="font-bold text-lg sm:text-xl leading-tight" style={{ color: BLUE }}>
                {practicante.nombre}
              </h3>

              <p className="text-[#FF6B00] text-sm sm:text-base font-semibold mt-1 truncate">
                {practicante.carrera}
              </p>

              <p className="text-sm text-gray-600 mt-1 truncate">
                {practicante.universidad || "—"}
              </p>

              <p className="text-sm text-gray-500">
                Ciclo: {practicante.ciclo || "—"}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {cursos.map((c, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 bg-blue-50 rounded-md border border-blue-100 text-gray-700"
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Hint en mobile */}
              <p className="mt-auto pt-3 text-[11px] text-gray-300 text-center md:hidden">
                Toca para ver más
              </p>
            </div>
          </div>

          {/* ══════════════ BACK ══════════════ */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-md flex flex-col overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              zIndex: 1,
            }}
          >
            {/* Mini header */}
            <div className="p-4 flex items-center gap-3 border-b border-gray-100 shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                <img src={practicante.foto} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-base leading-tight truncate" style={{ color: BLUE }}>
                  {practicante.nombre}
                </p>
                <p className="text-xs text-gray-500 truncate">{practicante.carrera}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3">

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide mb-0.5" style={{ color: BLUE }}>
                    Disponibilidad
                  </p>
                  <p className="text-gray-700 text-sm">{practicante.disponibilidad || "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide mb-0.5" style={{ color: BLUE }}>
                    Ciclo
                  </p>
                  <p className="text-gray-700 text-sm">{practicante.ciclo || "—"}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide mb-1.5" style={{ color: BLUE }}>
                  Experiencia
                </p>
                {experiencia.length ? (
                  experiencia.map((e, i) => (
                    <p key={i} className="text-sm text-gray-700">• {e}</p>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">Sin experiencia</p>
                )}
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide mb-1.5" style={{ color: BLUE }}>
                  Cursos
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cursos.map((c, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-md text-gray-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer CTA */}
            <div className="p-3 sm:p-4 flex gap-2 border-t border-gray-100 bg-white shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); setOpenProfile(true); }}
                className="flex-1 py-2.5 sm:py-3 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: BLUE }}
              >
                Ver perfil
              </button>

              <button
                onClick={toggleGuardar}
                className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl border transition-all"
                style={{
                  background: guardado ? BLUE : "white",
                  borderColor: guardado ? BLUE : "#E5E7EB",
                  color: guardado ? "white" : BLUE,
                }}
              >
                <svg
                  width="17" height="17" viewBox="0 0 24 24"
                  fill={guardado ? "currentColor" : "none"}
                  stroke="currentColor" strokeWidth="2.2"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default PractitionerCard;
