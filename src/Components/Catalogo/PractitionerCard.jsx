// components/PractitionerCard.jsx
import React , {useState} from "react";
import VerPracticante from "./VerPracticante";

const PractitionerCard = ({ practicante, onVerPerfil }) => {
  const [openProfile, setOpenProfile] = useState(false);
  
  const cursos = (practicante.cursos || []).slice(0, 3);
  const experiencia = Array.isArray(practicante.experiencia)
    ? practicante.experiencia.slice(0, 2)
    : [];

  return (
  <>
    {/* MODAL (fuera del card visualmente pero dentro del componente) */}
      <VerPracticante
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      />
    <div className="w-full h-[460px] [perspective:1400px]">
      
      {/* FLIP WRAPPER */}
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "rotateY(180deg)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "rotateY(0deg)")
        }
      >

        {/* ================= FRONT ================= */}
<div
  className="absolute inset-0 bg-white rounded-2xl shadow-md flex flex-col overflow-hidden"
  style={{
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    position: "absolute",
    inset: 0,
    zIndex: 2,
  }}
>
  {/* IMAGE */}
  <div className="h-[170px] relative">
    <img
      src={practicante.foto}
      className="w-full h-full object-cover"
      alt=""
    />

    {/* FOTO CIRCULAR */}
    <div className="absolute -bottom-9 left-5">
      <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-md bg-white">
        <img
          src={practicante.foto}
          className="w-full h-full object-cover"
          alt=""
        />
      </div>
    </div>
  </div>

  {/* CONTENT */}
  <div className="p-5 pt-12 flex flex-col flex-1">
    
    {/* NOMBRE */}
    <h3 className="text-[#003087] font-bold text-xl leading-tight">
      {practicante.nombre}
    </h3>

    {/* CARRERA */}
    <p className="text-[#FF6B00] text-base font-semibold mt-1">
      {practicante.carrera}
    </p>

    {/* UNIVERSIDAD */}
    <p className="text-sm  mt-2">
      {practicante.universidad || "—"}
    </p>

    {/* CICLO */}
    <p className="text-sm ">
      Ciclo: {practicante.ciclo || "—"}
    </p>

    {/* CURSOS (AL FINAL) */}
    <div className=" pt-4 flex flex-wrap gap-2">
      {cursos.map((c, i) => (
        <span
          key={i}
          className="text-xs px-3 py-1 bg-blue-50  rounded-md border border-blue-100"
        >
          {c}
        </span>
      ))}
    </div>
  </div>
</div>

        {/* ================= BACK ================= */}
        <div
          className="absolute inset-0 bg-white rounded-2xl shadow-md border-0 flex flex-col overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
            inset: 0,
            zIndex: 1,
          }}
        >

          {/* HEADER */}
          <div className="p-5 flex items-center gap-4 border-b border-gray-100">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200">
              <img
                src={practicante.foto}
                className="w-full h-full object-cover"
                alt=""
              />
            </div>

            <div>
              <p className="text-lg font-bold text-[#003087]">
                {practicante.nombre}
              </p>
              <p className="text-sm text-gray-500">
                {practicante.carrera}
              </p>
            </div>
          </div>

          {/* BODY */}
          <div className="p-4 flex-1 space-y-4">

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[#003087] font-semibold">
                  Disponibilidad
                </p>
                <p>{practicante.disponibilidad || "—"}</p>
              </div>

              <div>
                <p className="text-[#003087] font-semibold">
                  Ciclo
                </p>
                <p>{practicante.ciclo || "—"}</p>
              </div>
            </div>

            {/* EXPERIENCIA */}
            <div>
              <p className="text-[#003087] font-semibold mb-2">
                Experiencia
              </p>

              {experiencia.length ? (
                experiencia.map((e, i) => (
                  <p key={i} className="text-sm">
                    • {e}
                  </p>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Sin experiencia</p>
              )}
            </div>

            {/* CURSOS */}
            <div>
              <p className="text-[#003087] font-semibold mb-2">
                Cursos
              </p>

              <div className="flex flex-wrap gap-2">
                {cursos.map((c, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-blue-50 border border-blue-100 rounded-md"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* BOTONES */}
          <div className="p-4 flex gap-3 border-t border-gray-100 bg-white">

            <button
                onClick={() => setOpenProfile(true)}
                className="w-full py-3 bg-[#003087] text-white rounded-lg"
              >
                Ver perfil
              </button>

            <button className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-lg text-[#003087] hover:border-[#003087] transition">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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