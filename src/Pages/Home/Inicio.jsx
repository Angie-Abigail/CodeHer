import { useState } from "react";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import Footer from "../../Components/Footer/Footer.jsx";
import Login from "../../Components/Login/Login.jsx";

const O = "#FF5000";

export default function Inicio() {
  const [active, setActive] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  const stats = [
    { value: "11M+", label: "clientes en el Perú" },
    { value: "130+", label: "años de historia" },
    { value: "95%", label: "cobertura bancaria nacional" },
    { value: "500+", label: "programas de talento" },
  ];

  const gallery = [
    "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
    "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
  ];

  return (
    <div className="min-h-screen bg-white text-[#002A80] overflow-hidden">

      <Navbar />

      {/* HERO */}
      <div className="pt-24 sm:pt-28 lg:pt-32 px-4 sm:px-6 md:px-16 lg:px-24">

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* LEFT */}
          <div>

            <span
              className="text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1 rounded-full border"
              style={{ borderColor: O, color: O }}
            >
              PROGRAMA DE PRÁCTICAS BCP
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mt-5 sm:mt-6 leading-tight text-[#002A80]">
              Impulsa tu futuro en el{" "}
              <span style={{ color: O }}>BCP</span>
            </h1>

            <p className="text-gray-600 mt-5 sm:mt-6 max-w-xl text-sm sm:text-base leading-relaxed">
              Forma parte del Banco de Crédito del Perú, la institución financiera más importante del país.
              Aprende con equipos de alto rendimiento, proyectos reales y tecnología de clase mundial.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button
                onClick={() => setShowLogin(true)}
                className="px-5 sm:px-6 py-3 rounded-xl font-semibold transition hover:scale-105 w-full sm:w-auto text-white"
                style={{ background: O }}
              >
                Postular ahora
              </button>

              <button
                onClick={() =>
                  document.getElementById("porque-bcp")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="px-5 sm:px-6 py-3 rounded-xl border transition w-full sm:w-auto"
style={{ borderColor: O, color: O }}
              >
                Conocer más
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="bg-white hover:shadow-md transition p-3 sm:p-4 rounded-xl border"
style={{ borderColor: O }}
                >
                  <p className="text-lg sm:text-xl font-bold" style={{ color: O }}>
                    {s.value}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-600 mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT */}
          <div className="relative mt-6 lg:mt-0">

            {/* MAIN IMAGE */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={gallery[active]}
                className="w-full h-[220px] sm:h-[300px] md:h-[380px] lg:h-[420px] object-cover transition duration-500"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-12 sm:h-14 lg:h-16 w-16 sm:w-20 lg:w-24 rounded-lg overflow-hidden border transition ${active === i
                      ? "scale-105"
                      : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* SECOND SECTION */}


      <div
        id="porque-bcp"
        className="mt-16 sm:mt-20 lg:mt-24 px-4 sm:px-6 md:px-16 lg:px-24 pb-20 sm:pb-24 scroll-mt-32"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-[#002A80]">
          ¿Por qué BCP?
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              title: "Liderazgo",
              desc: "El banco más importante del Perú con presencia regional.",
            },
            {
              title: "Innovación",
              desc: "Equipos de tecnología trabajando en productos digitales reales.",
            },
            {
              title: "Crecimiento",
              desc: "Programas de prácticas con alta tasa de contratación.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-sm sm:text-base" style={{ color: O }}>
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-900 mt-2">
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </div>

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          irARegistro={() => {
            setShowLogin(false);
            // aquí luego puedes abrir registro si quieres
          }}
        />
      )}

      <Footer />
    </div>
  );
}