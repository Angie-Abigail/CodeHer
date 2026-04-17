import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Lib/firebase";

import FilterPanel from "../../Components/Catalogo/FilterPanel";
import SearchBar from "../../Components/Catalogo/SearchBar";
import AreaTabs from "../../Components/Catalogo/AreaTabs";
import PractitionerCard from "../../Components/Catalogo/PractitionerCard";
import Pagination from "../../Components/Catalogo/Pagination";

import Navbar from "../../Components/Navbar/Navbar";

const ITEMS_PER_PAGE = 10;

const CatalogoPracticantes = () => {
  // DATA
  const [practicantes, setPracticantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FILTROS (DINÁMICOS)
  const [areas, setAreas] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedCarreras, setSelectedCarreras] = useState([]);
  const [selectedDisponibilidad, setSelectedDisponibilidad] = useState([]);

  // APLICADOS
  const [appliedAreas, setAppliedAreas] = useState([]);
  const [appliedCarreras, setAppliedCarreras] = useState([]);
  const [appliedDisponibilidad, setAppliedDisponibilidad] = useState([]);

  // UI
  const [activeAreaTab, setActiveAreaTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ─── FIREBASE ─────────────────────────────
  useEffect(() => {
    const fetchPracticantes = async () => {
      try {
        setLoading(true);

        const snapshot = await getDocs(collection(db, "usuariosbcp"));

        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((u) => u.rol === "usuario");

        setPracticantes(data);
      } catch (err) {
        setError("Error cargando practicantes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAreas = async () => {
      const snapshot = await getDocs(collection(db, "areas"));
      const data = snapshot.docs.map((doc) => doc.data().nombre);
      setAreas(data);
    };

    const fetchCarreras = async () => {
      const snapshot = await getDocs(collection(db, "carreras"));
      const data = snapshot.docs.map((doc) => doc.data().nombre);
      setCarreras(data);
    };
    const fetchDisponibilidad = async () => {
  const snapshot = await getDocs(collection(db, "disponibilidades"));
  const data = snapshot.docs.map((doc) => doc.data().nombre);
  setDisponibilidades(data);
};

    fetchPracticantes();
    fetchAreas();
    fetchCarreras();
    fetchDisponibilidad();
  }, []);

  // ─── HELPERS ─────────────────────────────
  const toggleItem = (setter) => (item) => {
    setter((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  // ─── APPLY FILTERS ───────────────────────
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

  // ─── FILTER LOGIC ───────────────────────
  const filtered = practicantes.filter((p) => {
    const matchArea =
      activeAreaTab
        ? p.area === activeAreaTab
        : appliedAreas.length === 0 || appliedAreas.includes(p.area);

    const matchCarrera =
      appliedCarreras.length === 0 ||
      appliedCarreras.includes(p.carrera);

    const matchDisponibilidad =
      appliedDisponibilidad.length === 0 ||
      appliedDisponibilidad.includes(p.disponibilidad);

    const q = searchQuery.toLowerCase();

    const matchSearch =
      !q ||
      p.nombre?.toLowerCase().includes(q) ||
      p.carrera?.toLowerCase().includes(q) ||
      p.area?.toLowerCase().includes(q);

    return matchArea && matchCarrera && matchDisponibilidad && matchSearch;
  });

  // ─── PAGINATION ─────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ─── RENDER ─────────────────────────────
  return (
    <div className="min-h-screen bg-[#F4F6FB] pt-20">
<Navbar />

      <div className="w-full px-6 lg:px-10 py-8 flex gap-6">

        {/* FILTERS */}
        <FilterPanel
  areas={areas}
  carreras={carreras}
  disponibilidades={disponibilidades}

  selectedAreas={selectedAreas}
  selectedCarreras={selectedCarreras}
  selectedDisponibilidad={selectedDisponibilidad}

  onToggleArea={toggleItem(setSelectedAreas)}
  onToggleCarrera={toggleItem(setSelectedCarreras)}
  onToggleDisponibilidad={toggleItem(setSelectedDisponibilidad)}

  totalResults={filtered.length}
/>

        {/* CONTENT */}
        <div className="flex-1">

          <div className="space-y-5">
  <SearchBar value={searchQuery} onChange={setSearchQuery} />

  <AreaTabs
    areas={areas.map((a) => ({ nombre: a }))}
    selectedArea={activeAreaTab}
    onSelectArea={(a) => {
      setActiveAreaTab(a);
      setCurrentPage(1);
    }}
  />
</div>

          {/* LIST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-6 w-full">
            {paginated.map((p) => (
              <PractitionerCard
                key={p.id}
                practicante={p}
                onVerPerfil={() => console.log(p)}
              />
            ))}
          </div>

          {/* PAGINATION */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default CatalogoPracticantes;