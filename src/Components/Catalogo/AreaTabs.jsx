import React from "react";

const AREA_ICONS = {
  default: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
};

const AreaTabs = ({ areas = [], selectedArea, onSelectArea }) => {
  return (
    <div
      className="
        hidden md:flex
        w-full
        min-w-0
        overflow-x-auto
        gap-2
        pb-2
        scrollbar-hide
      "
      style={{
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* ALL */}
      <button
        onClick={() => onSelectArea(null)}
        className={`
          flex items-center gap-1.5
          px-4 py-2
          rounded-xl
          text-xs font-semibold
          border
          whitespace-nowrap
          flex-shrink-0
          transition
          ${
            selectedArea === null
              ? "bg-[#003087] text-white border-[#003087]"
              : "bg-white text-gray-500 border-gray-200 hover:border-[#003087] hover:text-[#003087]"
          }
        `}
      >
        {AREA_ICONS.default}
        Todas
      </button>

      {/* AREAS */}
      {areas.map((area) => {
        const isActive = selectedArea === area.nombre;

        return (
          <button
            key={area.id || area.nombre}
            onClick={() => onSelectArea(isActive ? null : area.nombre)}
            className={`
              flex items-center gap-1.5
              px-4 py-2
              rounded-xl
              text-xs font-semibold
              border
              whitespace-nowrap
              flex-shrink-0
              transition
              ${
                isActive
                  ? "bg-[#FF6B00] text-white border-[#FF6B00]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#FF6B00] hover:text-[#FF6B00]"
              }
            `}
          >
            {AREA_ICONS.default}
            {area.nombre}
          </button>
        );
      })}
    </div>
  );
};

export default AreaTabs;