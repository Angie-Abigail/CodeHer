import { useAuth } from "../../Context/AuthContext";

const B = "#003087";
const O = "#F47920";

function Section({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h3 className="text-m font-semibold tracking-wide text-gray-700">
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
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
      <p className="text-sm text-gray-500 ">
        {label}
      </p>
      <p className="text-sm text-gray-800 mt-1">
        {value || "—"}
      </p>
    </div>
  );
}

export default function VerPerfil() {
  const { user } = useAuth();

  const listas = {
    experiencia: user?.experiencia || "",
    descripcion: user?.descripcion || "",
    motivaciones: user?.motivaciones || "",
    cursos: user?.cursos || [],
    capacitaciones: user?.capacitaciones || [],
  };
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="space-y-6">

        {/* ─── HEADER PRINCIPAL ─── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div
            className="h-12"

          />

          <div className="p-6 flex items-center gap-6 -mt-12">

            {/* FOTO */}
            <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-gray-100">
              {user?.foto ? (
                <img src={user.foto} className="w-full h-full object-cover" />
              ) : null}
            </div>

            {/* INFO */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {user?.nombre || "Sin nombre"}
              </h2>

              <p className="text-sm text-gray-500 mt-1 font-medium">
                {user?.area || "Sin área"} • {user?.carrera || "Sin carrera"}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                {user?.disponibilidad && (
                  <Chip>{user.disponibilidad}</Chip>
                )}

                {user?.correo && (
                  <span className="text-xs text-gray-400">
                    {user.correo}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── GRID PRINCIPAL ─── */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* ─── COLUMNA IZQUIERDA ─── */}
          <div className="space-y-6">

            {/* INFO PERSONAL */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <Section title="Información" />

              <div className="space-y-4 mt-4">
                <Field label="Nombre" value={user?.nombre} />
                <Field label="Correo" value={user?.correo} />
                <Field label="Universidad" value={user?.universidad} />
                <Field label="Ciclo" value={user?.ciclo} />
              </div>
            </div>

            {/* LINKS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <Section title="Links" />

              <div className="space-y-3 mt-4 text-sm">

                <div>
                  <p className="text-gray-500 text-sm">LinkedIn</p>
                  {user?.linkedin ? (
                    <a
                      href={user.linkedin}
                      target="_blank"
                      className="text-sm font-semibold"
                      style={{ color: "#0052CC" }}
                    >
                      Ver perfil →
                    </a>
                  ) : "No registrado"}
                </div>

                <div>
                  <p className="text-gray-500 text-sm">GitHub</p>
                  {user?.github ? (
                    <a href={user.github} target="_blank" className="text-blue-700 font-medium hover:underline">
                      Ver repositorio
                    </a>
                  ) : "No registrado"}
                </div>
              </div>
            </div>

          </div>

          {/* ─── COLUMNA DERECHA ─── */}
          <div className="md:col-span-2 space-y-6">

            {/* DESCRIPCIÓN */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <Section title="Sobre el candidato" />
              <p className="text-sm text-gray-500 mb-2 ">
                Perfil del candidato
              </p>
              <div className="space-y-4 mt-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">Descripción: </span>
                  {listas.descripcion || "Sin descripción"}
                </p>

                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">Motivaciones: </span>
                  {listas.motivaciones || "No especificadas"}
                </p>
              </div>
            </div>

            {/* EXPERIENCIA */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <Section title="Experiencia profesional" />
              <p className="text-sm text-gray-500 mb-2  ">
                Trayectoria
              </p>
              <p className="text-sm text-gray-900 leading-relaxed mt-4">
                {listas.experiencia || "Sin experiencia registrada"}
              </p>
            </div>

            {/* SKILLS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <Section title="Formación y habilidades" />

              {/* CURSOS */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Cursos</p>
                <div className="flex flex-wrap gap-2">
                  {listas.cursos.length > 0 ? (
                    listas.cursos.map((item, i) => (
                      <Chip key={i}>{item}</Chip>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Sin cursos</p>
                  )}
                </div>
              </div>

              {/* CAPACITACIONES */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Capacitaciones</p>
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
  );
}