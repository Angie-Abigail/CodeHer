
export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white mt-16">

      <div className="w-full px-6 md:px-16 lg:px-24 py-8">

        {/* TOP ROW */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* BANCA MOVIL */}
          <div>
            <h3 className="font-semibold text-sm text-white mb-1">
              Banca Móvil BCP
            </h3>

            <p className="text-xs text-blue-200 leading-relaxed max-w-md">
              Accede a tus operaciones bancarias de forma segura desde cualquier lugar.
            </p>
          </div>

          {/* LINKS */}
          <div className="flex flex-wrap gap-6 text-xs text-blue-200">
            {["Privacidad", "Términos", "Seguridad", "Soporte"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-white transition"
              >
                {item}
              </a>
            ))}
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 my-6" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] text-blue-300">

          <p>
            © 2026 Banco de Crédito del Perú - BCP. Todos los derechos reservados.
          </p>

          <p className="text-blue-400">
            Plataforma de prácticas profesionales
          </p>

        </div>

      </div>
    </footer>
  );
}