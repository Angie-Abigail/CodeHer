// components/FilterPanel.jsx
import React from "react";

const AREA_ICONS = {
  "Analítica y Tecnología": "💻",
  "Finanzas y Control": "📊",
  "Gestión y Operaciones": "⚙️",
  "Comunicación y Relación": "📣",
};

const CARRERA_ICONS = {
  "Ingeniería de Sistemas": "🖥️",
  Economía: "📈",
  Comunicaciones: "📡",
  Administración: "🏢",
  "Ingeniería Industrial": "🏭",
  "Ingeniería de Software": "💾",
  "Administración y Negocios Internacionales": "🌐",
};

const FilterSection = ({ title, items, selected, onToggle, icons }) => (
  <div className="mb-6">
    <h3 className="text-xs font-bold text-[#003087] uppercase tracking-widest mb-3 flex items-center gap-2">
      <span className="w-5 h-0.5 bg-[#FF6B00] rounded-full inline-block" />
      {title}
    </h3>
    <div className="space-y-1">
      {items.map((item) => {
        const isActive = selected.includes(item);
        return (
          <button
            key={item}
            onClick={() => onToggle(item)}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2.5 group ${
              isActive
                ? "bg-[#003087] text-white shadow-md shadow-[#003087]/20"
                : "text-gray-600 hover:bg-[#003087]/8 hover:text-[#003087]"
            }`}
          >
            <span className="text-base leading-none">
              {icons?.[item] || "•"}
            </span>
            <span className="text-xs leading-snug">{item}</span>
            {isActive && (
              <span className="ml-auto w-4 h-4 rounded-full bg-[#FF6B00] flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

const FilterPanel = ({
  areas,
  carreras,
  selectedAreas,
  selectedCarreras,
  selectedDisponibilidad,
  onToggleArea,
  onToggleCarrera,
  onToggleDisponibilidad,
  onApply,
  onClear,
  totalResults,
}) => {
  const hasFilters =
    selectedAreas.length > 0 ||
    selectedCarreras.length > 0 ||
    selectedDisponibilidad.length > 0;

  return (
    <aside className="w-72 flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003087] to-[#004db3] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-sm tracking-wide">Filtrar practicantes</h2>
              <p className="text-blue-200 text-xs mt-0.5">{totalResults} resultados</p>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-5">
          <FilterSection
            title="Áreas"
            items={areas}
            selected={selectedAreas}
            onToggle={onToggleArea}
            icons={AREA_ICONS}
          />
          <FilterSection
            title="Carreras"
            items={carreras}
            selected={selectedCarreras}
            onToggle={onToggleCarrera}
            icons={CARRERA_ICONS}
          />

          {/* Disponibilidad */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-[#003087] uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-[#FF6B00] rounded-full inline-block" />
              Disponibilidad
            </h3>
            <div className="flex gap-2">
              {["Full-time", "Part-time"].map((disp) => {
                const isActive = selectedDisponibilidad.includes(disp);
                return (
                  <button
                    key={disp}
                    onClick={() => onToggleDisponibilidad(disp)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                      isActive
                        ? disp === "Full-time"
                          ? "bg-green-600 text-white border-green-600 shadow-md"
                          : "bg-amber-500 text-white border-amber-500 shadow-md"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:border-[#003087] hover:text-[#003087]"
                    }`}
                  >
                    {disp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-2">
            <button
              onClick={onApply}
              className="w-full py-3 bg-gradient-to-r from-[#003087] to-[#0044bb] hover:from-[#002266] hover:to-[#003087] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md shadow-[#003087]/20 hover:shadow-lg hover:shadow-[#003087]/30 hover:-translate-y-0.5"
            >
              Aplicar filtros
            </button>
            {hasFilters && (
              <button
                onClick={onClear}
                className="w-full py-2.5 text-gray-500 text-xs font-medium rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 hover:text-[#003087] hover:border-[#003087]"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterPanel;
