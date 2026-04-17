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
  const [practicantes, setPracticantes] = useState([]);

  const [areas, setAreas] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);

  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedCarreras, setSelectedCarreras] = useState([]);
  const [selectedDisponibilidad, setSelectedDisponibilidad] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "usuariosbcp"));
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((u) => u.rol === "usuario");

      setPracticantes(data);
    };

    const fetchAreas = async () => {
      const snap = await getDocs(collection(db, "areas"));
      setAreas(snap.docs.map((d) => d.data().nombre));
    };

    const fetchCarreras = async () => {
      const snap = await getDocs(collection(db, "carreras"));
      setCarreras(snap.docs.map((d) => d.data().nombre));
    };

    const fetchDisponibilidad = async () => {
      const snap = await getDocs(collection(db, "disponibilidades"));
      setDisponibilidades(snap.docs.map((d) => d.data().nombre));
    };

    fetchData();
    fetchAreas();
    fetchCarreras();
    fetchDisponibilidad();
  }, []);

  const toggleItem = (setter) => (item) => {
    setter((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handleClearFilters = () => {
    setSelectedAreas([]);
    setSelectedCarreras([]);
    setSelectedDisponibilidad([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // 🔥 FILTRO UNIFICADO
  const filtered = practicantes.filter((p) => {
    const matchArea =
      selectedAreas.length === 0 || selectedAreas.includes(p.area);

    const matchCarrera =
      selectedCarreras.length === 0 || selectedCarreras.includes(p.carrera);

    const matchDisponibilidad =
      selectedDisponibilidad.length === 0 ||
      selectedDisponibilidad.includes(p.disponibilidad);

    const q = searchQuery.toLowerCase();

    const matchSearch =
      !q ||
      p.carrera?.toLowerCase().includes(q) ||
  p.area?.toLowerCase().includes(q) ||
  (Array.isArray(p.cursos) &&
    p.cursos.some((c) => c.toLowerCase().includes(q)));

    return matchArea && matchCarrera && matchDisponibilidad && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

          onClearAll={handleClearFilters}
          totalResults={filtered.length}
        />

        {/* CONTENT */}
        <div className="flex-1">

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* 🔥 AREA TABS AHORA MODIFICAN selectedAreas */}
          <AreaTabs
  areas={areas.map((a) => ({ nombre: a }))}
  selectedArea={selectedAreas[0] || null}
  onSelectArea={(a) => {
    setSelectedAreas(a ? [a] : []);
    setCurrentPage(1);
  }}
  className="mt-4"
/>

          {/* LIST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-6">
            {paginated.map((p) => (
              <PractitionerCard key={p.id} practicante={p} />
            ))}
          </div>

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