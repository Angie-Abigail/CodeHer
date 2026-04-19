import { useAuth } from "../../Context/AuthContext";
import { useEffect, useState, useRef } from "react";

/* ─── BCP Brand Colors ─── */
const BLUE = "#003087";
const BLUE_MID = "#0052CC";
const ORANGE = "#FF6B00";
const ORANGE_LIGHT = "#FFF3E8";

/* ─── Reusable Components ─── */

const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-4">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
      {title}
    </h3>
    {subtitle && (
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    )}
    <div className="mt-3 border-b border-gray-200"></div>
  </div>
);

const FloatingInput = ({ label, name, value, onChange, type = "text", placeholder }) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value;

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={focused ? placeholder || "" : ""}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="peer w-full border-0 border-b-2 bg-transparent pt-5 pb-2 px-0 text-sm text-gray-800 placeholder-gray-300 transition-all duration-200 outline-none"
        style={{
          borderColor: focused ? BLUE_MID : "#E2E8F0",
        }}
      />
      <label
        className="absolute left-0 transition-all duration-200 pointer-events-none font-medium"
        style={{
          top: active ? "0px" : "20px",
          fontSize: active ? "10px" : "13px",
          color: focused ? BLUE_MID : "#94A3B8",
          letterSpacing: active ? "0.05em" : "0",
        }}
      >
        {label}
      </label>
      <div
        className="absolute bottom-0 left-0 h-0.5 transition-all duration-300"
        style={{
          width: focused ? "100%" : "0%",
          background: `linear-gradient(90deg, ${BLUE} 0%, ${ORANGE} 100%)`,
        }}
      />
    </div>
  );
};

const FloatingSelect = ({ label, name, value, onChange, options }) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value;

  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="peer w-full border-0 border-b-2 bg-transparent pt-5 pb-2 px-0 text-sm text-gray-800 transition-all duration-200 outline-none appearance-none cursor-pointer"
        style={{ borderColor: focused ? BLUE_MID : "#E2E8F0" }}
      >
        <option value="" disabled />
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <label
        className="absolute left-0 transition-all duration-200 pointer-events-none font-medium"
        style={{
          top: active ? "0px" : "20px",
          fontSize: active ? "10px" : "13px",
          color: focused ? BLUE_MID : "#94A3B8",
          letterSpacing: active ? "0.05em" : "0",
        }}
      >
        {label}
      </label>
      <div className="absolute right-0 bottom-3 text-gray-400 pointer-events-none">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div
        className="absolute bottom-0 left-0 h-0.5 transition-all duration-300"
        style={{
          width: focused ? "100%" : "0%",
          background: `linear-gradient(90deg, ${BLUE} 0%, ${ORANGE} 100%)`,
        }}
      />
    </div>
  );
};

/* ─── MAIN ─── */

export default function Perfil() {
  const { user, updateUser, getAreas, getCarreras, getDisponibilidad } = useAuth();
  const fileRef = useRef();
  const [areas, setAreas] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);

  const [form, setForm] = useState({
    nombre: "", correo: "", universidad: "", ciclo: "",
    area: "", areaId: "", carrera: "", carreraId: "", disponibilidad: "", disponibilidadId:"", linkedin: "", github: "",
    foto: null,
  });

  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(false);

  const [listas, setListas] = useState({
    experiencia: "",
    cursos: [],
    capacitaciones: [],
    motivaciones: "",
    descripcion: "",
  });

  useEffect(() => {
    if (!user?.uid) return;
    setForm({
      nombre: user.nombre || "", correo: user.correo || "",
      universidad: user.universidad || "", ciclo: user.ciclo || "",
      area: user.area || "", carrera: user.carrera || "",
      disponibilidad: user.disponibilidad || "", linkedin: user.linkedin || "",
      github: user.github || "" || null, foto: user.foto || null,
      areaId: user.areaId || "", carreraId: user.carreraId || "",
    });
    setPreview(user.foto || null);
    setListas({
      experiencia: user.experiencia || "",
      cursos: user.cursos || [],
      capacitaciones: user.capacitaciones || [],
      motivaciones: user.motivaciones || "",
      descripcion: user.descripcion || "",
    });
    const cargarDatos = async () => {
      const areasData = await getAreas();
      const carrerasData = await getCarreras();
      const disponibilidadData = await getDisponibilidad();

      setAreas(areasData);
      setCarreras(carrerasData);
      setDisponibilidad(disponibilidadData);
    };

    cargarDatos();
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, foto: file });
    setPreview(URL.createObjectURL(file));
  };
  const addItem = (tipo, value) => {
    if (!value.trim()) return;
    setListas((prev) => ({ ...prev, [tipo]: [...prev[tipo], value] }));
  };

  const removeItem = (tipo, item) => {
    setListas((prev) => ({ ...prev, [tipo]: prev[tipo].filter((i) => i !== item) }));
  };

  const guardar = async () => {
    if (!user?.uid) return;
    await updateUser(user.uid, { ...form, ...listas });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  /* ─── Lista labels & icons ─── */
  const listaConfig = {
    experiencia: { label: "Experiencia laboral", placeholder: "Ej: Asistente en área de TI · 2023" },
    cursos: { label: "Cursos y certificaciones", placeholder: "Ej: Python · Coursera" },
    capacitaciones: { label: "Capacitaciones", placeholder: "Ej: Agile · 2024" },
    motivaciones: { label: "Motivaciones", placeholder: "Ej: Innovación tecnológica" },
    descripcion: { label: "Descripción personal", placeholder: "Ej: Orientado a resultados" },
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div className="mb-8">
            <h1 className="text-2xl font-bold" style={{ color: BLUE }}>
              Mi Perfil Profesional
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Esta información será evaluada por el equipo de reclutamiento BCP
            </p>
          </div>

        </div>

        {/* ── Card 1: Identidad ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Card accent top */}

          <div className="p-6">
            <SectionTitle title="Datos personales" subtitle="Información básica de identificación" />

            <div className="flex flex-col md:flex-row gap-8">
              {/* ── Photo Upload ── */}
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <div
                  onClick={() => fileRef.current.click()}
                  className="relative w-28 h-28 rounded-2xl overflow-hidden cursor-pointer group"
                  style={{
                    background: preview ? "transparent" : `linear-gradient(135deg, #EBF0FA 0%, #D6E0F5 100%)`,
                    border: `2px dashed ${preview ? "transparent" : "#C0CDE8"}`,
                  }}
                >
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" alt="foto perfil" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-2">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="mb-1">
                        <circle cx="12" cy="8" r="4" stroke="#94A3B8" strokeWidth="1.5" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-[10px] text-gray-400 leading-tight">Sube tu foto</span>
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4v16m8-8H4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                <button
                  onClick={() => fileRef.current.click()}
                  className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all"
                  style={{ color: BLUE_MID, background: "#EBF2FF", border: `1px solid #C0D4F5` }}
                >
                  Cambiar foto
                </button>
                <span className="text-[10px] text-gray-400 text-center">JPG, PNG · Máx 2MB</span>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </div>

              {/* ── Form Fields ── */}
              <div className="flex-1 grid sm:grid-cols-2 gap-x-8 gap-y-6">
                <FloatingInput label="NOMBRE COMPLETO" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre completo" />
                <FloatingInput label="CORREO ELECTRÓNICO" name="correo" value={form.correo} onChange={handleChange} type="email" placeholder="correo@ejemplo.com" />
                <FloatingInput label="UNIVERSIDAD" name="universidad" value={form.universidad} onChange={handleChange} placeholder="Nombre de tu universidad" />
                <FloatingSelect
                  label="CICLO ACADÉMICO"
                  name="ciclo"
                  value={form.ciclo}
                  onChange={handleChange}
                  options={["6", "7", "8", "9", "10"]}
                />
                <div className="relative">
                  <div className="relative">
                    <select
                      value={form.areaId}
                      onChange={(e) => {
                        const selected = areas.find(a => a.id === e.target.value);
                        if (!selected) return;

                        setForm(prev => ({
                          ...prev,
                          area: selected.nombre,
                          areaId: selected.id
                        }));
                      }}
                      className="w-full border-0 border-b-2 bg-transparent pt-5 pb-2 px-0 text-sm text-gray-800 outline-none appearance-none"
                      style={{ borderColor: "#E2E8F0" }}
                    >
                      <option value="">Selecciona área</option>
                      {areas.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative">
                    <select
                      value={form.carreraId}
                      onChange={(e) => {
                        const selected = carreras.find(c => c.id === e.target.value);
                        if (!selected) return;

                        setForm(prev => ({
                          ...prev,
                          carrera: selected.nombre,
                          carreraId: selected.id
                        }));
                      }}
                      className="w-full border-0 border-b-2 bg-transparent pt-5 pb-2 px-0 text-sm text-gray-800 outline-none appearance-none"
                      style={{ borderColor: "#E2E8F0" }}
                    >
                      <option value="">Selecciona carrera</option>
                      {carreras.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative">
                    <select
                      value={form.disponibilidadId}
                      onChange={(e) => {
                        const selected = disponibilidad.find(d => d.id === e.target.value);
                        if (!selected) return;

                        setForm(prev => ({
                          ...prev,
                          disponibilidad: selected.nombre,
                          disponibilidadId: selected.id
                        }));
                      }}
                      className="w-full border-0 border-b-2 bg-transparent pt-5 pb-2 px-0 text-sm text-gray-800 outline-none appearance-none"
                      style={{ borderColor: "#E2E8F0" }}
                    >
                      <option value="">Selecciona Disponibilidad</option>
                      {disponibilidad.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Card 2: Links ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="p-8">
            <SectionTitle icon="🔗" title="PRESENCIA DIGITAL" subtitle="Perfiles y documentos profesionales" />

            <div className="grid sm:grid-cols-3 gap-6">
              {/* LinkedIn */}
              <div className="relative group">
                <div
                  className="flex items-center gap-3 border-2 rounded-xl px-4 py-3.5 transition-all duration-200"
                  style={{ borderColor: "#E2E8F0" }}
                  onFocus={() => { }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "#0A66C2" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" fill="white" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold tracking-wider text-gray-400 mb-0.5">LINKEDIN</div>
                    <input
                      name="linkedin"
                      value={form.linkedin}
                      onChange={handleChange}
                      placeholder="linkedin.com/in/tu-perfil"
                      className="w-full text-sm text-gray-700 outline-none bg-transparent placeholder-gray-300 truncate"
                    />
                  </div>
                </div>
              </div>

              {/* GitHub */}
              <div className="relative group">
                <div
                  className="flex items-center gap-3 border-2 rounded-xl px-4 py-3.5 transition-all duration-200"
                  style={{ borderColor: "#E2E8F0" }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-900">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold tracking-wider text-gray-400 mb-0.5">GITHUB</div>
                    <input
                      name="github"
                      value={form.github}
                      onChange={handleChange}
                      placeholder="github.com/tu-usuario"
                      className="w-full text-sm text-gray-700 outline-none bg-transparent placeholder-gray-300 truncate"
                    />
                  </div>
                </div>
              </div>  
            </div>
          </div>
        </div>

        {/* ── Card 3: Perfil Profesional ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="p-8">
            <SectionTitle title="PERFIL PROFESIONAL" subtitle="Presiona Enter para agregar cada elemento" />

            <div className="space-y-8">

  {/* TEXTAREAS FULL WIDTH */}
  <ListaTag tipo="descripcion" config={listaConfig.descripcion} items={listas.descripcion} setListas={setListas} />
  <ListaTag tipo="motivaciones" config={listaConfig.motivaciones} items={listas.motivaciones} setListas={setListas} />
  <ListaTag tipo="experiencia" config={listaConfig.experiencia} items={listas.experiencia} setListas={setListas} />
  

  {/* TAGS EN MITAD */}
  <div className="grid sm:grid-cols-2 gap-6">
    <ListaTag tipo="cursos" config={listaConfig.cursos} items={listas.cursos} setListas={setListas} />
    <ListaTag tipo="capacitaciones" config={listaConfig.capacitaciones} items={listas.capacitaciones} setListas={setListas} />
  </div>

</div>
          </div>
        </div>

        {/* ── Save Button ── */}
        <div className="flex items-center justify-between pb-6">
          <p className="text-xs text-gray-400">
            Los cambios se guardan en tu perfil de candidato
          </p>
          <button
  onClick={guardar}
  className="relative flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-95 shadow-lg"
  style={{
    background: saved
      ? `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_MID} 100%)`
      : `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_MID} 100%)`,
    boxShadow: "0 4px 20px rgba(0,48,135,0.35)",
  }}
>
            {saved ? "¡Perfil actualizado!" : "Actualizar perfil"}
</button>
        </div>

      </div>
    </div>
  );
}

/* ─── Lista Tag Component ─── */
function ListaTag({ tipo, config, items, setListas }) {
  const [value, setValue] = useState("");
  const isTextarea = ["experiencia", "motivaciones", "descripcion"].includes(tipo);

  return (
    <div className="w-full">
      
      {/* LABEL */}
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {config.label}
      </label>

      {/* TEXTAREA */}
      {isTextarea && (
        <textarea
          rows={5}
          value={items}
          onChange={(e) =>
            setListas((prev) => ({ ...prev, [tipo]: e.target.value }))
          }
          className="w-full text-sm px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500"
          placeholder={config.placeholder}
        />
      )}

      {/* TAGS */}
      {!isTextarea && (
        <>
          {/* LISTA DE TAGS */}
          {items.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {items.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                  style={{
                    background: ORANGE_LIGHT,
                    color: "#C2410C",
                    border: "1px solid #FED7AA",
                  }}
                >
                  {item}
                  <button
                    onClick={() =>
                      setListas((prev) => ({
                        ...prev,
                        [tipo]: prev[tipo].filter((i) => i !== item),
                      }))
                    }
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* INPUT + BOTÓN */}
          <div className="flex gap-2">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 text-sm px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500"
              placeholder={config.placeholder}
            />

            <button
              onClick={() => {
                if (!value.trim()) return;
                setListas((prev) => ({
                  ...prev,
                  [tipo]: [...prev[tipo], value],
                }));
                setValue("");
              }}
              className="px-4 rounded-lg text-white font-bold"
              style={{ background: ORANGE }}
            >
              +
            </button>
          </div>
        </>
      )}
    </div>
  );
}