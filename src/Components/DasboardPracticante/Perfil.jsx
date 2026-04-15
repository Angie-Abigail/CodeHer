import { useAuth } from "../../Context/AuthContext";
import {
  Mail, User, Briefcase, BookOpen,
  Heart, Award, Image as ImageIcon
} from "lucide-react";
import { useState } from "react";

export default function Perfil() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    nombre: user?.nombre || "",
    correo: user?.correo || "",
    area: user?.area || "",
    carrera: user?.carrera || "",
    disponibilidad: user?.disponibilidad || "",
    foto: user?.foto || null
  });

  const [preview, setPreview] = useState(user?.foto || null);

  const [listas, setListas] = useState({
    experiencia: user?.experiencia || [""],
    cursos: user?.cursos || [""],
    voluntariado: user?.voluntariado || [""],
    capacitaciones: user?.capacitaciones || [""],
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 📸 IMAGEN
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Solo JPG o PNG");
      return;
    }

    setForm({ ...form, foto: file });
    setPreview(URL.createObjectURL(file));
  };

  // 🔁 LISTAS DINÁMICAS
  const handleListChange = (tipo, index, value) => {
    const nuevas = [...listas[tipo]];
    nuevas[index] = value;
    setListas({ ...listas, [tipo]: nuevas });
  };

  const agregarItem = (tipo) => {
    setListas({ ...listas, [tipo]: [...listas[tipo], ""] });
  };

  const eliminarItem = (tipo, index) => {
    const nuevas = listas[tipo].filter((_, i) => i !== index);
    setListas({ ...listas, [tipo]: nuevas.length ? nuevas : [""] });
  };

  const guardar = async () => {
    await updateUser(user.id, {
      ...form,
      experiencia: listas.experiencia.filter(Boolean),
      cursos: listas.cursos.filter(Boolean),
      voluntariado: listas.voluntariado.filter(Boolean),
      capacitaciones: listas.capacitaciones.filter(Boolean),
    });

    alert("Perfil actualizado 🚀");
  };

  const SECCIONES = [
    { id: "experiencia", title: "Experiencia Laboral", icon: Briefcase },
    { id: "cursos", title: "Cursos", icon: BookOpen },
    { id: "voluntariado", title: "Voluntariado", icon: Heart },
    { id: "capacitaciones", title: "Capacitaciones", icon: Award },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Editar Perfil
          </h2>
          <p className="text-gray-500">{user?.nombre}</p>
        </div>
      </div>

      {/* DATOS PERSONALES */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Datos personales
        </h3>

        <div className="grid md:grid-cols-3 gap-6">

          {/* FOTO */}
          <div className="flex flex-col items-center">
            {preview ? (
              <img
                src={preview}
                className="w-32 h-32 rounded-full object-cover mb-3"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <ImageIcon className="text-gray-400" size={30} />
              </div>
            )}

            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImage}
              className="text-xs text-gray-600"
            />
          </div>

          {/* FORM */}
          <div className="md:col-span-2 space-y-4">

            <div>
              <label className="text-sm text-gray-700 font-medium">
                Nombre
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full border rounded-lg pl-10 py-2 text-gray-900 focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium">
                Correo
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                <input
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  className="w-full border rounded-lg pl-10 py-2 text-gray-900 focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="Área"
                className="border rounded-lg px-3 py-2"
              />

              <input
                name="carrera"
                value={form.carrera}
                onChange={handleChange}
                placeholder="Carrera"
                className="border rounded-lg px-3 py-2"
              />
            </div>

            <input
              name="disponibilidad"
              value={form.disponibilidad}
              onChange={handleChange}
              placeholder="Disponibilidad"
              className="border rounded-lg px-3 py-2 w-full"
            />

          </div>
        </div>
      </div>

      {/* PERFIL PROFESIONAL */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Perfil profesional
        </h3>

        <div className="space-y-4">
          {SECCIONES.map(({ id, title, icon: Icon }) => (
            <div key={id}>
              <div className="flex items-center gap-2 mb-2 text-gray-800 font-medium">
                <Icon size={16} />
                {title}
              </div>

              {listas[id].map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    value={item}
                    onChange={(e) =>
                      handleListChange(id, index, e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => eliminarItem(id, index)}
                    className="text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                onClick={() => agregarItem(id)}
                className="text-sm text-orange-500"
              >
                + Agregar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BOTÓN */}
      <div className="flex justify-end">
        <button
          onClick={guardar}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
        >
          Guardar cambios
        </button>
      </div>

    </div>
  );
}