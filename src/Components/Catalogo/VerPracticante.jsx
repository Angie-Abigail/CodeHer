import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../Lib/firebase.js";
import { useAuth } from "../../Context/AuthContext.jsx"

function Section({ title, subtitle }) {
  return (
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
}

function Chip({ children }) {
  return (
    <span
      className="px-3 py-1.5 rounded-lg text-xs font-semibold"
      style={{
        background: "#FFF3E8",
        color: "#C2410C",
        border: "1px solid #FED7AA",
      }}
    >
      {children}
    </span>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
        {label}
      </p>
      <p className="text-sm text-gray-800 mt-1">{value || "—"}</p>
    </div>
  );
}

function ModalMensaje({ open, onClose, onSend }) {
  const [mensaje, setMensaje] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white w-full max-w-md rounded-xl p-6 shadow-lg">

        <h2 className="text-lg font-bold mb-4">Enviar mensaje</h2>

        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="w-full border rounded-lg p-3 text-sm"
          rows={5}
          placeholder="Escribe tu mensaje..."
        />

        <div className="flex justify-end gap-2 mt-4">

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={() => onSend(mensaje)}
            className="px-4 py-2 text-sm text-white rounded-lg"
            style={{ background: "#003087" }}
          >
            Enviar
          </button>

        </div>
      </div>
    </div>
  );
}

export default function VerPracticante({ open, onClose, id }) {
  const [practicante, setPracticante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openMessage, setOpenMessage] = useState(false);
  const { user } = useAuth();
const sendMessage = async (mensaje) => {
  try {
    await addDoc(collection(db, "mensajes"), {
      de: user?.uid, // luego lo cambias por user.uid
      para: id,
      mensaje,
      fecha: serverTimestamp(),
      leido: false
    });

    setOpenMessage(false);
  } catch (error) {
    console.error("Error enviando mensaje:", error);
  }
};
  
  useEffect(() => {
    if (!open || !id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const ref = doc(db, "usuariosbcp", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setPracticante({ id: snap.id, ...snap.data() });
        } else {
          setPracticante(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, id]);

  if (!open) return null;

  const listas = {
    experiencia: practicante?.experiencia || "",
    descripcion: practicante?.descripcion || "",
    motivaciones: practicante?.motivaciones || "",
    cursos: practicante?.cursos || [],
    capacitaciones: practicante?.capacitaciones || [],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL CON SCROLL */}
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-100">

        {/* ACTIONS TOP RIGHT */}
<div className="absolute top-3 right-3 z-10 flex gap-2">
  

  {/* CLOSE */}
  <button
    onClick={onClose}
    className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
  >
    <X size={18} />
  </button>

</div>

        <div className="p-8">

          {loading ? (
            <p className="text-gray-500">Cargando perfil...</p>
          ) : !practicante ? (
            <p className="text-red-500">No se encontró el practicante</p>
          ) : (
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">

              <div className="space-y-6">

                {/* HEADER */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-12" />
                  {/* BOTÓN ARRIBA DERECHA */}
  <div className="absolute top-43 right-30">
    <button
      onClick={() => setOpenMessage(true)}
      className="px-3 py-2 text-xs font-semibold rounded-lg text-white shadow"
      style={{ background: "#003087" }}
    >
      Enviar mensaje
    </button>
  </div>

                  <div className="p-6 flex items-center gap-6 -mt-12">

                    <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-gray-100">
                      {practicante?.foto && (
                        <img
                          src={practicante.foto}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                        {practicante?.nombre} {practicante?.apellido}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1 font-medium">
                        {practicante?.area || "Sin área"} • {practicante?.carrera || "Sin carrera"}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {practicante?.disponibilidad && (
                          <Chip>{practicante.disponibilidad}</Chip>
                        )}

                        <span className="text-xs text-gray-400">
                          {practicante?.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GRID PRINCIPAL */}
                <div className="grid md:grid-cols-3 gap-6">

                  {/* IZQUIERDA */}
                  <div className="space-y-6">

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <Section title="Información" />

                      <div className="space-y-4 mt-4">
                        <Field label="Nombre" value={practicante?.nombre} />
                        <Field label="Correo" value={practicante?.email} />
                        <Field label="Universidad" value={practicante?.universidad} />
                        <Field label="Ciclo" value={practicante?.ciclo} />
                      </div>
                    </div>

                    {/* LINKS */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <Section title="Links" />

                      <div className="space-y-3 mt-4 text-sm">

                        <div>
                          <p className="text-gray-400 text-xs">LinkedIn</p>
                          {practicante?.linkedin ? (
                            <a
                              href={practicante.linkedin}
                              target="_blank"
                              className="text-blue-700 font-semibold hover:underline"
                            >
                              Ver perfil →
                            </a>
                          ) : (
                            "No registrado"
                          )}
                        </div>

                        <div>
                          <p className="text-gray-400 text-xs">GitHub</p>
                          {practicante?.github ? (
                            <a
                              href={practicante.github}
                              target="_blank"
                              className="text-blue-700 font-semibold hover:underline"
                            >
                              Ver repositorio
                            </a>
                          ) : (
                            "No registrado"
                          )}
                        </div>

                        <div>
                          <p className="text-gray-400 text-xs">CV</p>
                          <p className="text-gray-700">
                            {practicante?.cv ? "Documento cargado" : "No subido"}
                          </p>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* DERECHA */}
                  <div className="md:col-span-2 space-y-6">

                    {/* SOBRE EL CANDIDATO */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <Section title="Sobre el candidato" />

                      <div className="space-y-4 mt-4">

                        <p className="text-sm text-gray-700 leading-relaxed">
                          <span className="font-semibold text-gray-900">Descripción: </span>
                          {listas.descripcion || "Sin descripción"}
                        </p>

                        <p className="text-sm text-gray-700 leading-relaxed">
                          <span className="font-semibold text-gray-900">Motivaciones: </span>
                          {listas.motivaciones || "Sin motivaciones"}
                        </p>

                      </div>
                    </div>

                    {/* EXPERIENCIA */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <Section title="Experiencia profesional" />

                      <p className="text-sm text-gray-700 leading-relaxed mt-4">
                        {listas.experiencia || "Sin experiencia registrada"}
                      </p>
                    </div>

                    {/* FORMACIÓN Y HABILIDADES */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <Section title="Formación y habilidades" />

                      <div className="mt-4">
                        <p className="text-xs text-gray-400 mb-2">Cursos</p>
                        <div className="flex flex-wrap gap-2">
                          {listas.cursos.length > 0 ? (
                            listas.cursos.map((item, i) => (
                              <Chip key={i}>{item}</Chip>
                            ))
                          ) : (
                            <p className="text-sm text-gray-400">Sin cursos</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs text-gray-400 mb-2">Capacitaciones</p>
                        <div className="flex flex-wrap gap-2">
                          {listas.capacitaciones.length > 0 ? (
                            listas.capacitaciones.map((item, i) => (
                              <Chip key={i}>{item}</Chip>
                            ))
                          ) : (
                            <p className="text-sm text-gray-400">Sin capacitaciones</p>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      <ModalMensaje
  open={openMessage}
  onClose={() => setOpenMessage(false)}
  onSend={sendMessage}
/>
    </div>

    
  );
}