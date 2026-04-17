import Perfil from "./Perfil";

// crea estos luego (te dejo placeholders abajo)
import VerPerfil from "./VerPerfil";
import Mensajes from "./Mensajes";

export default function DashboardContent({ section }) {
  return (
    <div className="p-8">
      {section === "perfil" && <Perfil />}
      {section === "verPerfil" && <VerPerfil />}
      {section === "mensajes" && <Mensajes />}

    </div>
  );
}