import { useState } from "react";
import DashboardContent from "./DashboardContent";
import DashboardNav from "./DashboardNav.jsx"
import Navbar from "../Navbar/Navbar";

export default function Dashboard() {
  const [section, setSection] = useState("perfil");

  return (
    <>
      <Navbar/>
      {/* CONTENIDO */}
      <div className="flex pt-16 min-h-screen bg-gray-100">

        {/* SIDEBAR */}
        <DashboardNav section={section} setSection={setSection} />

        {/* CONTENIDO */}
        <div className="flex-1">
          <DashboardContent section={section} />
        </div>

      </div>
    </>
  );
}