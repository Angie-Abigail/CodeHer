import { useState } from "react";
import DashboardContentLider from "./DashboardContentLider.jsx";
import DashboardNavLider from "./DashboardNavLider.jsx";
import Navbar from "../Navbar/Navbar.jsx";

export default function DashboardLider() {
  const [section, setSection] = useState("mensajes");

  return (
    <>
      <Navbar />

      <div className="flex pt-16 min-h-screen bg-gray-100">

        <DashboardNavLider section={section} setSection={setSection} />

        <div className="flex-1">
          <DashboardContentLider section={section} />
        </div>

      </div>
    </>
  );
}