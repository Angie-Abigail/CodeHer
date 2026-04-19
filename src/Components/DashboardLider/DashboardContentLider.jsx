
import Guardados from "./Guardados";
import Mensajes from "./Mensajes"

export default function DashboardContentLider({ section }) {
  return (
    <div className="h-full">

      {section === "mensajes" && <Mensajes />}  {/* 👈 ESTO */}
      
      {section === "guardados" && <Guardados />}

    </div>
  );
}