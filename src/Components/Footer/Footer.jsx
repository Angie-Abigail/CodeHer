export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white mt-16">
      <div className="w-full px-6 md:px-16 lg:px-24 py-10">

        {/* TOP */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

          {/* INFO */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-sm text-white mb-2">
              Banca Móvil BCP
            </h3>

            <p className="text-xs text-blue-200 leading-relaxed max-w-md mx-auto md:mx-0">
              Accede a tus operaciones bancarias de forma segura desde cualquier lugar.
            </p>
          </div>

          {/* LINKS */}
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-xs text-blue-200">
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] text-blue-300 text-center md:text-left">

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