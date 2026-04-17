import React, { useState } from "react";

/* ─── SECTION (COLLAPSIBLE) ─── */
const FilterSection = ({ title, items, selected, onToggle }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-gray-100 py-4 last:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-3"
      >
        <h3 className="text-[12px] font-bold tracking-widest text-[#003087] uppercase">
          {title}
        </h3>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="text-gray-400 transition-transform duration-200 flex-shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="space-y-2">
          {items.map((item) => {
            const name = item.nombre || item;
            const active = selected.includes(name);

            return (
              <button
                key={name}
                onClick={() => onToggle(name)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-[13px] transition-all border"
                style={{
                  background: active ? "#003087" : "white",
                  color: active ? "white" : "#4B5563",
                  borderColor: active ? "#003087" : "#E5E7EB",
                }}
              >
                <span className="truncate text-left font-medium">{name}</span>
                {active && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── MAIN ─── */
const FilterPanel = ({
  areas,
  carreras,
  selectedAreas,
  selectedCarreras,
  selectedDisponibilidad,
  onToggleArea,
  onToggleCarrera,
  onToggleDisponibilidad,
  onClearAll,
  totalResults,
}) => {
  const totalFiltros =
    selectedAreas.length + selectedCarreras.length + selectedDisponibilidad.length;

  return (
    <aside className="w-60 flex-shrink-0">
      <div className="sticky top-6 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="bg-[#003087] px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M7 12h10M11 18h2" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h2 className="text-white text-[13px] font-bold tracking-wide">Filtros</h2>
            </div>

            {/* Contador de filtros activos */}
            {totalFiltros > 0 && (
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: "#FF6B00", color: "white", minWidth: "22px", textAlign: "center" }}
                >
                  {totalFiltros}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-[12px] text-blue-200">
              {totalResults} resultado{totalResults !== 1 ? "s" : ""}
            </p>

            {/* Botón limpiar */}
            {totalFiltros > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-semibold text-blue-200 hover:text-white transition-colors underline underline-offset-2"
              >
                Limpiar todo
              </button>
            )}
          </div>
        </div>

        {/* FILTROS ACTIVOS (pills resumen) */}
        {totalFiltros > 0 && (
          <div className="px-3 pt-3 pb-1 flex flex-wrap gap-1.5">
            {[...selectedAreas, ...selectedCarreras, ...selectedDisponibilidad].map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ background: "#FFF3E8", color: "#C2410C", border: "1px solid #FED7AA" }}
              >
                {f}
                <button
                  onClick={() => {
                    if (selectedAreas.includes(f)) onToggleArea(f);
                    else if (selectedCarreras.includes(f)) onToggleCarrera(f);
                    else onToggleDisponibilidad(f);
                  }}
                  className="hover:text-red-600 transition-colors ml-0.5 font-bold leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* SECCIONES */}
        <div className="px-3 pb-2">
          <FilterSection
            title="Áreas"
            items={areas}
            selected={selectedAreas}
            onToggle={onToggleArea}
          />

          <FilterSection
            title="Carreras"
            items={carreras}
            selected={selectedCarreras}
            onToggle={onToggleCarrera}
          />

          {/* DISPONIBILIDAD */}
          <div className="pt-4">
            <h3 className="text-[12px] font-bold tracking-widest text-[#003087] uppercase mb-3">
              Disponibilidad
            </h3>
            <div className="space-y-2">
              {["Full-time", "Part-time"].map((item) => {
                const active = selectedDisponibilidad.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => onToggleDisponibilidad(item)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] border transition-all font-medium"
                    style={{
                      background: active ? "#003087" : "white",
                      color: active ? "white" : "#4B5563",
                      borderColor: active ? "#003087" : "#E5E7EB",
                    }}
                  >
                    <span>{item}</span>
                    {active && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                        <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default FilterPanel;
