import React, { useState } from "react";

const BLUE = "#002A80";

const FilterSection = ({ title, items = [], selected = [], onToggle }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-gray-100 py-3 last:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-2"
      >
        <h3 className="text-[11px] font-bold tracking-widest uppercase" style={{ color: BLUE }}>
          {title}
        </h3>
        <svg
          width="13" height="13" viewBox="0 0 24 24" fill="none"
          className="text-gray-400 transition-transform duration-200 shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="flex flex-col gap-1.5">
          {items.map((item) => {
            const name = item.nombre ?? item;
            const active = selected.includes(name);
            return (
              <button
                key={name}
                onClick={() => onToggle(name)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] border transition-all font-medium text-left"
                style={{
                  background: active ? BLUE : "white",
                  color: active ? "white" : "#374151",
                  borderColor: active ? BLUE : "#E5E7EB",
                }}
              >
                <span className="truncate">{name}</span>
                {active && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 ml-2">
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

const FilterContent = ({
  areas = [], carreras = [], disponibilidad = [],
  selectedAreas = [], selectedCarreras = [], selectedDisponibilidad = [],
  onToggleArea, onToggleCarrera, onToggleDisponibilidad,
  onClearAll, totalResults, totalFiltros, onClose,
}) => {
  const [dispOpen, setDispOpen] = useState(true);

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden h-full flex flex-col">

      {/* HEADER */}
      <div className="px-4 py-4 shrink-0" style={{ background: BLUE }}>
        <div className="flex justify-between items-center">
          <h2 className="text-white text-[13px] font-bold tracking-wide">Filtros</h2>
          {onClose && (
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1 rounded">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-[12px] text-blue-200">{totalResults} resultados</p>
          {totalFiltros > 0 && (
            <button onClick={onClearAll} className="text-[11px] text-blue-200 underline hover:text-white transition-colors">
              Limpiar todo
            </button>
          )}
        </div>

        {totalFiltros > 0 && (
          <div className="mt-2 flex gap-1 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-medium">
              {totalFiltros} {totalFiltros === 1 ? "filtro activo" : "filtros activos"}
            </span>
          </div>
        )}
      </div>

      <div className="px-3 pb-3 overflow-y-auto flex-1">
        <FilterSection title="Áreas" items={areas} selected={selectedAreas} onToggle={onToggleArea} />
        <FilterSection title="Carreras" items={carreras} selected={selectedCarreras} onToggle={onToggleCarrera} />

        <div className="py-3">
          <button
            onClick={() => setDispOpen(!dispOpen)}
            className="w-full flex items-center justify-between mb-2"
          >
            <h3 className="text-[11px] font-bold tracking-widest uppercase" style={{ color: BLUE }}>
              Disponibilidad
            </h3>
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              className="text-gray-400 transition-transform duration-200 shrink-0"
              style={{ transform: dispOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {dispOpen && (
            <div className="flex flex-col gap-1.5">
              {disponibilidad.length > 0 ? (
                disponibilidad.map((item) => {
                  const name = item.nombre ?? item;
                  const active = selectedDisponibilidad.includes(name);
                  return (
                    <button
                      key={name}
                      onClick={() => onToggleDisponibilidad(name)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg border text-[13px] transition-all font-medium"
                      style={{
                        background: active ? BLUE : "white",
                        color: active ? "white" : "#374151",
                        borderColor: active ? BLUE : "#E5E7EB",
                      }}
                    >
                      <span className="truncate text-left">{name}</span>
                      {active && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 ml-2">
                          <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-gray-400 px-1 py-2">Sin opciones de disponibilidad</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterPanel = ({
  areas, carreras, disponibilidad,
  selectedAreas, selectedCarreras, selectedDisponibilidad,
  onToggleArea, onToggleCarrera, onToggleDisponibilidad,
  onClearAll, totalResults,
}) => {
  const [openMobile, setOpenMobile] = useState(false);

  const totalFiltros =
    (selectedAreas?.length ?? 0) +
    (selectedCarreras?.length ?? 0) +
    (selectedDisponibilidad?.length ?? 0);

  const sharedProps = {
    areas, carreras, disponibilidad,
    selectedAreas, selectedCarreras, selectedDisponibilidad,
    onToggleArea, onToggleCarrera, onToggleDisponibilidad,
    onClearAll, totalResults, totalFiltros,
  };

  return (
    <>
      <div className="md:hidden mb-3">
        <button
          onClick={() => setOpenMobile(true)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-white text-sm font-semibold shadow-md transition-all"
          style={{ background: BLUE }}
        >
          <span className="flex items-center gap-2 px-1.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M7 12h10M10 18h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Filtros
          </span>
          {totalFiltros > 0 && (
            <span className="bg-white text-[11px] font-bold px-2 py-0.5 rounded-full " style={{ color: BLUE }}>
              {totalFiltros}
            </span>
          )}
        </button>
      </div>

      {openMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpenMobile(false)}
          />

          <div
            className="relative ml-auto w-[85%] max-w-xs h-full bg-white shadow-2xl flex flex-col"
            style={{ animation: "slideIn 0.22s ease-out" }}
          >
            <style>{`@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>
            <FilterContent
              {...sharedProps}
              onClose={() => setOpenMobile(false)}
            />
          </div>
        </div>
      )}

      <aside className="hidden md:flex flex-col w-56 lg:w-60 shrink-0">
        <FilterContent {...sharedProps} />
      </aside>
    </>
  );
};

export default FilterPanel;
