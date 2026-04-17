import React from "react";

/* ICONOS SEPARADOS (solo UI, no lógica) */
const AREA_ICONS = {
  default: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  "Analítica y Tecnología": (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  "Finanzas y Control": (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
    </svg>
  ),
};

const AreaTabs = ({ areas = [], selectedArea, onSelectArea, className = "" }) => {
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>

      {/* ALL */}
      <button
        onClick={() => onSelectArea(null)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition border ${
          selectedArea === null
            ? "bg-[#003087] text-white border-[#003087] shadow-md"
            : "bg-white text-gray-500 border-gray-200 hover:border-[#003087] hover:text-[#003087]"
        }`}
      >
        {AREA_ICONS.default}
        Todas las áreas
      </button>

      {/* DYNAMIC AREAS */}
      {areas.map((area) => {
        const isActive = selectedArea === area.nombre;

        return (
          <button
            key={area.id || area.nombre}
            onClick={() => onSelectArea(isActive ? null : area.nombre)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition border whitespace-nowrap ${
              isActive
                ? "bg-[#FF6B00] text-white border-[#FF6B00] shadow-md"
                : "bg-white text-gray-500 border-gray-200 hover:border-[#FF6B00] hover:text-[#FF6B00]"
            }`}
          >
            {AREA_ICONS[area.nombre] || AREA_ICONS.default}
            {area.nombre}
          </button>
        );
      })}
    </div>
  );
};

export default AreaTabs;