// components/PractitionerCard.jsx
import React from "react";

const SKILL_COLORS = [
  "bg-orange-100 text-orange-700 border border-orange-200",
  "bg-blue-100 text-blue-700 border border-blue-200",
  "bg-sky-100 text-sky-700 border border-sky-200",
  "bg-amber-100 text-amber-700 border border-amber-200",
];

const getSkillColor = (index) => SKILL_COLORS[index % SKILL_COLORS.length];

const getInitials = (nombre) => {
  if (!nombre) return "?";
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const AvatarPlaceholder = ({ nombre, size = "lg" }) => {
  const sizeClass = size === "lg" ? "w-20 h-20 text-2xl" : "w-14 h-14 text-lg";
  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-[#FF6B00] to-[#003087] flex items-center justify-center text-white font-bold shadow-md flex-shrink-0`}
    >
      {getInitials(nombre)}
    </div>
  );
};

const PractitionerCard = ({ practicante, onVerPerfil }) => {
  const skills = [
    ...(practicante.cursos || []),
    ...(practicante.capacitaciones || []),
  ].slice(0, 4);

  return (
    <div className="group w-full h-[320px]" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full h-full transition-transform duration-700 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "rotateY(180deg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "rotateY(0deg)";
        }}
      >
        {/* FRENTE */}
        <div
          className="absolute inset-0 rounded-2xl bg-white border border-gray-100 shadow-md overflow-hidden flex flex-col"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* Header azul decorativo */}
          <div className="h-2 bg-gradient-to-r from-[#003087] to-[#FF6B00]" />

          <div className="flex flex-col items-center pt-5 px-4 pb-4 flex-1">
            {/* Avatar */}
            <div className="mb-3">
              {practicante.foto ? (
                <img
                  src={practicante.foto}
                  alt={practicante.nombre}
                  className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white ring-2 ring-[#003087]/20"
                />
              ) : (
                <AvatarPlaceholder nombre={practicante.nombre} />
              )}
            </div>

            {/* Nombre y carrera */}
            <h3 className="text-[#003087] font-bold text-base text-center leading-tight">
              {practicante.nombre}
            </h3>
            <p className="text-[#FF6B00] text-xs font-semibold mt-0.5 text-center">
              {practicante.carrera}
            </p>

            {/* Área badge */}
            <span className="mt-2 px-2.5 py-0.5 rounded-full bg-[#003087]/10 text-[#003087] text-[10px] font-semibold">
              {practicante.area}
            </span>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getSkillColor(i)}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Disponibilidad */}
            <div className="mt-auto pt-3 w-full border-t border-gray-100 flex items-center justify-between">
              <span
                className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                  practicante.disponibilidad === "Full-time"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {practicante.disponibilidad}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                {practicante.correo?.split("@")[1] || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* REVERSO */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, #003087 0%, #004db3 60%, #FF6B00 100%)",
          }}
        >
          <div className="flex flex-col h-full p-5 text-white">
            {/* Header reverso */}
            <div className="flex items-center gap-3 mb-4">
              <AvatarPlaceholder nombre={practicante.nombre} size="sm" />
              <div>
                <h3 className="font-bold text-sm leading-tight">{practicante.nombre}</h3>
                <p className="text-orange-300 text-xs font-medium">{practicante.carrera}</p>
              </div>
            </div>

            {/* Descripción / experiencia */}
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-orange-300 uppercase tracking-widest mb-1">
                Experiencia
              </p>
              {practicante.experiencia?.length > 0 ? (
                <ul className="space-y-0.5">
                  {practicante.experiencia.slice(0, 2).map((exp, i) => (
                    <li key={i} className="text-xs text-white/90 flex items-start gap-1">
                      <span className="text-orange-300 mt-0.5">▸</span>
                      <span className="line-clamp-2">{exp}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-white/60 italic">Sin experiencia registrada</p>
              )}
            </div>

            {/* Voluntariado */}
            {practicante.voluntariado?.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] font-semibold text-orange-300 uppercase tracking-widest mb-1">
                  Voluntariado
                </p>
                <p className="text-xs text-white/90 line-clamp-2">
                  {practicante.voluntariado.slice(0, 2).join(" · ")}
                </p>
              </div>
            )}

            {/* Área + disponibilidad */}
            <div className="mt-auto space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/60 font-medium">Área</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                  {practicante.area}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/60 font-medium">Disponibilidad</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    practicante.disponibilidad === "Full-time"
                      ? "bg-green-400/30 text-green-200"
                      : "bg-amber-400/30 text-amber-200"
                  }`}
                >
                  {practicante.disponibilidad}
                </span>
              </div>

              {/* Botón ver perfil */}
              <button
                onClick={() => onVerPerfil && onVerPerfil(practicante)}
                className="w-full mt-2 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#e55f00] text-white text-xs font-bold tracking-wide transition-colors shadow-lg"
              >
                Ver perfil completo →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PractitionerCard;
