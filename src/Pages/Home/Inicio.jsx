import { useState } from "react";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import Footer from "../../Components/Footer/Footer.jsx";

const B = "#003087";
const O = "#F47920";

export default function Inicio() {
  const [active, setActive] = useState(0);

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
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white overflow-hidden">

      <Navbar />

      {/* HERO FULL WIDTH */}
      <div className="pt-28 px-6 md:px-16 lg:px-24 max-w-none">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* LEFT */}
          <div>

            <span
              className="text-xs font-semibold px-4 py-1 rounded-full border"
              style={{ borderColor: O, color: O }}
            >
              PROGRAMA DE PRÁCTICAS BCP
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold mt-6 leading-tight">
              Impulsa tu futuro en el{" "}
              <span style={{ color: O }}>BCP</span>
            </h1>

            <p className="text-gray-300 mt-6 max-w-xl text-base leading-relaxed">
              Forma parte del Banco de Crédito del Perú, la institución financiera más importante del país.
              Aprende con equipos de alto rendimiento, proyectos reales y tecnología de clase mundial.
            </p>

            {/* CTA */}
            <div className="flex gap-4 mt-8">
              <button
                className="px-6 py-3 rounded-xl font-semibold transition hover:scale-105"
                style={{ background: O }}
              >
                Postular ahora
              </button>

              <button className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition">
                Conocer más
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="bg-white/5 hover:bg-white/10 transition p-4 rounded-xl border border-white/10"
                >
                  <p className="text-xl font-bold" style={{ color: O }}>
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT VISUAL SYSTEM */}
          <div className="relative">

            {/* MAIN IMAGE */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={gallery[active]}
                className="w-full h-[420px] object-cover transition duration-500"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 mt-4">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-16 w-24 rounded-lg overflow-hidden border transition ${
                    active === i
                      ? "border-orange-400 scale-105"
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
      <div className="mt-24 px-6 md:px-16 lg:px-24 pb-24">

        <h2 className="text-2xl font-bold mb-8">
          ¿Por qué BCP?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

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
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <h3 className="font-semibold" style={{ color: O }}>
                {item.title}
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
      <Footer/>
    </div>
  );
}