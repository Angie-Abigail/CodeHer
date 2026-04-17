
import Guardados from "./Guardados";

export default function DashboardContentLider({ section }) {
  return (
    <div className="p-8">

     

      {section === "guardados" && <Guardados />}

    </div>
  );
}