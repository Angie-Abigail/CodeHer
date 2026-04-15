

import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Lib/firebase";

import FilterPanel from "../../Components/Catalogo/FilterPanel";
import SearchBar from "../../Components/Catalogo/SearchBar";
import AreaTabs from "../../Components/Catalogo/AreaTabs";
import PractitionerCard from "../../Components/Catalogo/PractitionerCard";
import Pagination from "../../Components/Catalogo/Pagination";

// ─── Constantes ────────────────────────────────────────────────────────────────
const AREAS = [
  "Analítica y Tecnología",
  "Finanzas y Control",
  "Gestión y Operaciones",
  "Comunicación y Relación",
];

const CARRERAS = [
  "Ingeniería de Sistemas",
  "Economía",
  "Comunicaciones",
  "Administración",
  "Ingeniería Industrial",
  "Ingeniería de Software",
  "Administración y Negocios Internacionales",
];

const ITEMS_PER_PAGE = 10;

// ─── Componente Principal ───────────────────────────────────────────────────────
const CatalogoPracticantes = () => {
  // Data
  const [practicantes, setPracticantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros del panel lateral
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedCarreras, setSelectedCarreras] = useState([]);
  const [selectedDisponibilidad, setSelectedDisponibilidad] = useState([]);

  // Filtros aplicados (se aplican al presionar el botón)
  const [appliedAreas, setAppliedAreas] = useState([]);
  const [appliedCarreras, setAppliedCarreras] = useState([]);
  const [appliedDisponibilidad, setAppliedDisponibilidad] = useState([]);

  // Tabs superiores (filtro rápido por área)
  const [activeAreaTab, setActiveAreaTab] = useState(null);

  // Búsqueda y paginación
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch desde Firebase ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPracticantes = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "usuariosbcp"));
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((u) => u.rol === "usuario"); // solo practicantes
        setPracticantes(data);
      } catch (err) {
        console.error("Error al cargar practicantes:", err);
        setError("No se pudo cargar el catálogo. Verifica tu conexión a Firebase.");
      } finally {
        setLoading(false);
      }
    };

    fetchPracticantes();
  }, []);

  // ── Toggle helpers ────────────────────────────────────────────────────────────
  const toggleItem = (setter) => (item) =>
    setter((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );

  // ── Aplicar / limpiar filtros ─────────────────────────────────────────────────
  const handleApplyFilters = () => {
    setAppliedAreas(selectedAreas);
    setAppliedCarreras(selectedCarreras);
    setAppliedDisponibilidad(selectedDisponibilidad);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedAreas([]);
    setSelectedCarreras([]);
    setSelectedDisponibilidad([]);
    setAppliedAreas([]);
    setAppliedCarreras([]);
    setAppliedDisponibilidad([]);
    setActiveAreaTab(null);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // ── Filtrado ──────────────────────────────────────────────────────────────────
  const filtered = practicantes.filter((p) => {
    const matchArea =
      activeAreaTab
        ? p.area === activeAreaTab
        : appliedAreas.length === 0 || appliedAreas.includes(p.area);

    const matchCarrera =
      appliedCarreras.length === 0 || appliedCarreras.includes(p.carrera);

    const matchDisponibilidad =
      appliedDisponibilidad.length === 0 ||
      appliedDisponibilidad.includes(p.disponibilidad);

    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      p.nombre?.toLowerCase().includes(q) ||
      p.carrera?.toLowerCase().includes(q) ||
      p.area?.toLowerCase().includes(q) ||
      p.cursos?.some((c) => c.toLowerCase().includes(q)) ||
      p.capacitaciones?.some((c) => c.toLowerCase().includes(q));

    return matchArea && matchCarrera && matchDisponibilidad && matchSearch;
  });

  // ── Paginación ────────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Al cambiar búsqueda o tab, resetear página
  useEffect(() => setCurrentPage(1), [searchQuery, activeAreaTab]);

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* ── Hero band ── */}
      <div className="bg-gradient-to-r from-[#003087] via-[#0041a8] to-[#003087] py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-white text-2xl font-extrabold tracking-tight">
                Catálogo de Practicantes
                <span className="text-[#FF6B00]"> BCP</span>
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Descubre el talento que impulsa el futuro del banco
              </p>
            </div>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-bold text-white">{practicantes.length}</div>
                <div className="text-xs text-blue-200">Practicantes</div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-bold text-white">{AREAS.length}</div>
                <div className="text-xs text-blue-200">Áreas</div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-bold text-white">{CARRERAS.length}</div>
                <div className="text-xs text-blue-200">Carreras</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contenido principal ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8 items-start">
          {/* ── Panel de filtros lateral ── */}
          <FilterPanel
            areas={AREAS}
            carreras={CARRERAS}
            selectedAreas={selectedAreas}
            selectedCarreras={selectedCarreras}
            selectedDisponibilidad={selectedDisponibilidad}
            onToggleArea={toggleItem(setSelectedAreas)}
            onToggleCarrera={toggleItem(setSelectedCarreras)}
            onToggleDisponibilidad={toggleItem(setSelectedDisponibilidad)}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            totalResults={filtered.length}
          />

          {/* ── Contenido derecho ── */}
          <div className="flex-1 min-w-0">
            {/* Buscador */}
            <div className="mb-5">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {/* Tabs de área */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 mb-6 overflow-x-auto">
              <AreaTabs
                areas={AREAS}
                selectedArea={activeAreaTab}
                onSelectArea={(a) => {
                  setActiveAreaTab(a);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Estado de carga */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <div className="w-10 h-10 border-4 border-[#003087]/20 border-t-[#003087] rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium">Cargando practicantes...</p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <p className="text-red-600 font-medium text-sm">{error}</p>
              </div>
            )}

            {/* Sin resultados */}
            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-sm font-semibold text-gray-500">No se encontraron practicantes</p>
                <p className="text-xs text-gray-400 mt-1">Intenta con otros filtros o términos de búsqueda</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-[#003087] text-white text-xs font-semibold rounded-xl hover:bg-[#002266] transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Grid de cards */}
            {!loading && !error && paginated.length > 0 && (
              <>
                {/* Info de resultados */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-gray-500 font-medium">
                    Mostrando{" "}
                    <span className="text-[#003087] font-bold">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                      {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                    </span>{" "}
                    de{" "}
                    <span className="text-[#003087] font-bold">{filtered.length}</span> practicantes
                  </p>

                  {/* Active filter chips */}
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {appliedAreas.map((a) => (
                      <span key={a} className="px-2 py-0.5 bg-[#003087]/10 text-[#003087] text-[10px] font-semibold rounded-full">
                        {a}
                      </span>
                    ))}
                    {appliedCarreras.map((c) => (
                      <span key={c} className="px-2 py-0.5 bg-[#FF6B00]/10 text-[#FF6B00] text-[10px] font-semibold rounded-full">
                        {c}
                      </span>
                    ))}
                    {appliedDisponibilidad.map((d) => (
                      <span key={d} className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                  {paginated.map((p) => (
                    <PractitionerCard
                      key={p.id}
                      practicante={p}
                      onVerPerfil={(practicante) => {
                        // Implementa navegación a perfil completo
                        console.log("Ver perfil:", practicante);
                      }}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogoPracticantes;
