import { useState } from "react";
import DashboardContentLider from "./DashboardContentLider.jsx";
import DashboardNavLider from "./DashboardNavLider.jsx";
import Navbar from "../Navbar/Navbar.jsx";
import { Menu } from "lucide-react";
import Footer from "../Footer/Footer.jsx"

export default function DashboardLider() {
  const [section, setSection] = useState("mensajes");
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <Navbar />

      <div className="flex pt-16 min-h-screen  relative z-0">
        {/* SIDEBAR DESKTOP */}
        <div className="hidden md:block pt-16">
  <DashboardNavLider section={section} setSection={setSection} />
</div>

        {/* BOTÓN MOBILE */}
        <button
          onClick={() => setOpenMenu(true)}
          className="md:hidden fixed top-20 left-4 z-50 bg-white p-2 rounded-lg shadow"
        >
          <Menu size={20} />
        </button>

        {/* DRAWER MOBILE */}
        {openMenu && (
          <div className="absolute left-0 top-16 h-[calc(100%-64px)] w-72 bg-[#F4F6FB] shadow-lg">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpenMenu(false)}
            />

            <div className="absolute left-0 top-0 h-full w-72 bg-[#F4F6FB] shadow-lg">
              <DashboardNavLider
                section={section}
                setSection={(v) => {
                  setSection(v);
                  setOpenMenu(false);
                }}
              />
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto">
          <DashboardContentLider section={section} />
        </div>

      </div>
      <Footer/>
    </>
  );
}