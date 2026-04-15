import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import {
  Mail, Lock, User, ChevronDown, ChevronUp,
  Briefcase, BookOpen, Heart, Award, Image as ImageIcon
} from "lucide-react";

const SECCIONES = [
  { id: 'experiencia', title: 'Experiencia Laboral', icon: Briefcase },
  { id: 'cursos', title: 'Cursos', icon: BookOpen },
  { id: 'voluntariado', title: 'Voluntariado', icon: Heart },
  { id: 'capacitaciones', title: 'Capacitaciones', icon: Award },
];

export default function Registro({ onClose, irALogin }) {
  const { register } = useAuth();

  const [activeSection, setActiveSection] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    area: "",
    carrera: "",
    disponibilidad: "",
    foto: null
  });

  const [listas, setListas] = useState({
  experiencia: [""],
  cursos: [""],
  voluntariado: [""],
  capacitaciones: [""],
});

const handleListChange = (tipo, index, value) => {
  const nuevas = [...listas[tipo]];
  nuevas[index] = value;

  setListas({ ...listas, [tipo]: nuevas });
};

const agregarItem = (tipo) => {
  setListas({
    ...listas,
    [tipo]: [...listas[tipo], ""]
  });
};

const eliminarItem = (tipo, index) => {
  const nuevas = listas[tipo].filter((_, i) => i !== index);

  setListas({
    ...listas,
    [tipo]: nuevas.length ? nuevas : [""]
  });
};


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 📸 MANEJO DE IMAGEN
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Solo se permiten imágenes JPG o PNG");
      return;
    }

    setForm({ ...form, foto: file });
    setPreview(URL.createObjectURL(file));
  };

  const areas = [
    "Analítica y Tecnología",
    "Finanzas y Control",
    "Gestión y Operaciones",
    "Comunicación y Relación"
  ];

  const carreras = [
    "Ingeniería de Sistemas",
    "Economía",
    "Comunicaciones",
    "Administración",
    "Ingeniería Industrial",
    "Ingeniería de Software",
    "Administración y Negocios Internacionales"
  ];

  const disponibilidad = ["Full-time", "Part-time"];
  

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={irALogin}
            className="text-sm text-blue-900 hover:underline"
          >
            ← Regresar
          </button>

          <h2 className="text-lg font-bold text-blue-900">BCP</h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* ===== DATOS PERSONALES ===== */}
        <div className="mb-6">
          <h3 className="text-gray-900 font-semibold mb-3">
            Datos personales
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            {/* FOTO */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4">
              
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-24 h-24 rounded-full object-cover mb-2"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
                  <ImageIcon size={30} />
                </div>
              )}

              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImage}
                className="text-xs text-gray-600"
              />
            </div>

            {/* INPUTS */}
            <div className="space-y-3">

              {/* NOMBRE */}
              <div>
                <label className="text-sm text-gray-700 font-medium">
                  Nombre completo
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                  <input
                    name="nombre"
                    placeholder="Juan Pérez"
                    className="w-full border border-gray-300 rounded-lg pl-10 py-2 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-900"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* CORREO */}
              <div>
                <label className="text-sm text-gray-700 font-medium">
                  Correo electrónico
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                  <input
                    name="correo"
                    placeholder="ejemplo@correo.com"
                    className="w-full border border-gray-300 rounded-lg pl-10 py-2 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-900"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-gray-700 font-medium">
                  Contraseña
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="contraseña"
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg pl-10 py-2 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-900"
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ===== INFORMACIÓN ADICIONAL ===== */}
        <div className="mb-6">
          <h3 className="text-gray-900 font-semibold mb-3">
            Información adicional
          </h3>

          <div className="grid md:grid-cols-3 gap-3">

            <select
              name="disponibilidad"
              onChange={handleChange}
              className="border border-gray-300 py-2 px-3 rounded-lg text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="">Disponibilidad</option>
              {disponibilidad.map(d => <option key={d}>{d}</option>)}
            </select>

            <select
              name="area"
              onChange={handleChange}
              className="border border-gray-300 py-2 px-3 rounded-lg text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="">Área</option>
              {areas.map(a => <option key={a}>{a}</option>)}
            </select>

            <select
              name="carrera"
              onChange={handleChange}
              className="border border-gray-300 py-2 px-3 rounded-lg text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="">Carrera</option>
              {carreras.map(c => <option key={c}>{c}</option>)}
            </select>

          </div>
        </div>

        {/* ===== PERFIL PROFESIONAL ===== */}
        <div className="mb-6">
          <h3 className="text-gray-900 font-semibold mb-3">
            Perfil profesional
          </h3>

          <div className="space-y-2">
            {SECCIONES.map(({ id, title, icon: Icon }) => (
              <div key={id} className="border rounded-lg overflow-hidden">

                <button
                  onClick={() =>
                    setActiveSection(activeSection === id ? null : id)
                  }
                  className="w-full flex justify-between items-center px-4 py-2 bg-gray-50 hover:bg-gray-100"
                >
                  <span className="flex items-center gap-2 text-gray-800 font-medium">
                    <Icon size={16} />
                    {title}
                  </span>

                  {activeSection === id
                    ? <ChevronUp size={18} />
                    : <ChevronDown size={18} />}
                </button>

                {activeSection === id && (
                  <div className="p-3 border-t">
                    <div className="space-y-2">

  {listas[id].map((item, index) => (
    <div key={index} className="flex gap-2">

      <input
        value={item}
        onChange={(e) =>
          handleListChange(id, index, e.target.value)
        }
        placeholder={`Ej: ${title}`}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                   text-gray-900 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-900"
      />

      {/* ELIMINAR */}
      <button
        onClick={() => eliminarItem(id, index)}
        className="text-red-400 hover:text-red-600"
      >
        ✕
      </button>

    </div>
  ))}

  {/* AGREGAR */}
  <button
    onClick={() => agregarItem(id)}
    className="text-sm text-orange-500 hover:underline"
  >
    + Agregar
  </button>

</div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

        {/* BOTÓN */}
        <button 
        className="w-full mt-4 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-medium"
  onClick={() =>
    register({
      ...form,
      experiencia: listas.experiencia.filter(Boolean),
      cursos: listas.cursos.filter(Boolean),
      voluntariado: listas.voluntariado.filter(Boolean),
      capacitaciones: listas.capacitaciones.filter(Boolean),
    })
  }
        >
          Crear cuenta
        </button>

      </div>
    </div>
  );
}