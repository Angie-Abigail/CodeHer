import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, BookOpen, Heart, Award, Image as ImageIcon,
  X, Loader2, User, Mail, Lock
} from "lucide-react";

const input =
  "w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900";
export default function Registro({ onClose, irALogin }) {
  const navigate = useNavigate();
  const { register, getAreas, getCarreras } = useAuth();

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [areas, setAreas] = useState([]);
  const [carreras, setCarreras] = useState([]);

  const [form, setForm] = useState({
  nombre: "", correo: "", contraseña: "",
  area: "", areaId: "",
  carrera: "", carreraId: "",
  universidad: "", ciclo: "",
  descripcion: "", motivaciones: "",
  linkedin: "", github: "",
  foto: null
});

  const [listas, setListas] = useState({
    experiencia: "",
    cursos: [],
    capacitaciones: []
  });

  // 🔒 Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const cargarDatos = async () => {
      const areasData = await getAreas();
      const carrerasData = await getCarreras();

      setAreas(areasData);
      setCarreras(carrerasData);
    };

    cargarDatos();

    return () => (document.body.style.overflow = "auto");
  }, [getAreas, getCarreras]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, foto: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const ejecutarRegistro = async () => {
  if (!form.nombre || !form.correo || !form.contraseña) {
    alert("Completa los datos personales");
    return;
  }

  if (!form.area || !form.carrera) {
    alert("Completa tu información académica");
    return;
  }

  setLoading(true);

  await register({ ...form, ...listas });

  // 👇 SI ES MODAL → cerrar
  if (onClose) {
    onClose();
  }

  navigate("/dashboard");
};
  return (
  <div
    className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    onClick={onClose}
  >
    <div
      className="bg-white w-[92%] max-w-4xl rounded-3xl shadow-2xl flex flex-col h-[90vh] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >

      <div className="p-6 border-b border-blue-100">
  <div className="flex items-center justify-between mb-3">
    <button
      onClick={irALogin}
      className="text-blue-900 font-bold text-sm"
    >
      ← Regresar
    </button>
    <button
      onClick={onClose}
      className="text-blue-900"
    >
      <X />
    </button>
  </div>
  <div className="text-center">
    <h2 className="text-xl font-bold text-blue-900">
      Registro de Talento BCP
    </h2>
    <p className="text-sm text-gray-500">
      Completa tu perfil profesional
    </p>
  </div>
</div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10">

        <div className="grid md:grid-cols-2 gap-8 pb-6 border-b border-blue-100">
          
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-28 h-28 rounded-2xl bg-white border border-blue-200 flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="text-blue-300" size={40} />
              )}
              <input type="file" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <p className="text-xs text-gray-600">Foto de perfil</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input name="nombre" placeholder="Nombre completo" className={`${input} pl-10`} onChange={handleChange} />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input name="correo" placeholder="Correo electrónico" className={`${input} pl-10`} onChange={handleChange} />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="password" name="contraseña" placeholder="Contraseña" className={`${input} pl-10`} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="pb-6 border-b border-blue-100 space-y-5">
          <h3 className="font-bold text-blue-900">Información académica</h3>

          <div className="grid md:grid-cols-2 gap-5">
            <input name="universidad" placeholder="Universidad" className={input} onChange={handleChange} />

            <select name="ciclo" className={input} onChange={handleChange}>
              <option value="">Ciclo</option>
              {[6, 7, 8, 9, 10].map((ciclo) => (
  <option key={ciclo}>{ciclo}° Ciclo</option>
))}
            </select>

            <select
              name="area"
              className={input}
              onChange={(e) => {
                const selected = areas.find(a => a.id === e.target.value);
                if (!selected) return;
                setForm(prev => ({
                  ...prev,
                  area: selected.nombre,
                  areaId: selected.id
                }));
              }}
            >
              <option value="">Área</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>

            <select
              name="carrera"
              className={input}
              onChange={(e) => {
                const selected = carreras.find(c => c.id === e.target.value);
                if (!selected) return;
                setForm(prev => ({
                  ...prev,
                  carrera: selected.nombre,
                  carreraId: selected.id
                }));
              }}
            >
              <option value="">Carrera</option>
              {carreras.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pb-6 border-b border-blue-100 space-y-4">
          <h3 className="font-bold text-blue-900">Sobre ti</h3>

          <textarea
            name="descripcion"
            placeholder="Cuéntanos quién eres..."
            className={`${input} h-20`}
            onChange={handleChange}
          />

          <textarea
            name="motivaciones"
            placeholder="¿Qué te motiva?"
            className={`${input} h-20`}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-6 pb-6 border-b border-blue-100">
          <h3 className="font-bold text-blue-900">Perfil profesional</h3>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Experiencia laboral
            </label>
            <textarea
              value={listas.experiencia}
              onChange={(e) =>
                setListas({ ...listas, experiencia: e.target.value })
              }
              className={`${input} h-24 mt-2`}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <TagInput label="Cursos y certificaciones" tipo="cursos" listas={listas} setListas={setListas} />
            <TagInput label="Capacitaciones" tipo="capacitaciones" listas={listas} setListas={setListas} />
          </div>
        </div>

       
        <div className="grid md:grid-cols-2 gap-5">
          <input name="linkedin" placeholder="Link de LinkedIn" className={input} onChange={handleChange} />
          <input name="github" placeholder="Link de GitHub" className={input} onChange={handleChange} />

          
        </div>

      </div>

      <div className="p-6 border-t border-blue-100 flex justify-center">
        <button
          onClick={ejecutarRegistro}
          className="bg-orange-500 text-white px-12 py-3 rounded-xl font-bold hover:bg-orange-600"
        >
          CREAR MI CUENTA
        </button>
      </div>

    </div>
  </div>
);

}

function TagInput({ label, tipo, listas, setListas }) {
  const [value, setValue] = useState("");

  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>

      {/* TAGS */}
      {listas[tipo].length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 mb-2">
          {listas[tipo].map((item) => (
            <span
              key={item}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-orange-100 text-orange-700 border border-orange-200"
            >
              {item}
              <button
                onClick={() =>
                  setListas({
                    ...listas,
                    [tipo]: listas[tipo].filter((i) => i !== item),
                  })
                }
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* INPUT + BOTÓN */}
      <div className="flex gap-2 mt-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Escribe y agrega"
          className={input}
        />

        <button
          onClick={() => {
            if (!value.trim()) return;
            setListas({
              ...listas,
              [tipo]: [...listas[tipo], value],
            });
            setValue("");
          }}
          className="bg-orange-500 text-white px-4 rounded-lg font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
}
