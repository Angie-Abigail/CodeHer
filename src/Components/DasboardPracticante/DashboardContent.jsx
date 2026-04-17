import Perfil from "./Perfil";
import VerPerfil from "./VerPerfil";
import Mensajes from "./Mensajes";

export default function DashboardContent({ section }) {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8">

      {/* CONTENIDO DINÁMICO */}
      <div className="max-w-6xl mx-auto">

        {section === "perfil" && <Perfil />}

        {section === "verPerfil" && <VerPerfil />}

        {section === "mensajes" && <Mensajes />}

      </div>

    </div>
  );
}