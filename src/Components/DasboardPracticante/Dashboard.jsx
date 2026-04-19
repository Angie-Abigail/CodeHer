import { useState } from "react";
import DashboardContent from "./DashboardContent";
import DashboardNav from "./DashboardNav.jsx";
import Navbar from "../Navbar/Navbar";
import { Menu, X } from "lucide-react";
import Footer from "../Footer/Footer.jsx"

export default function Dashboard() {
  const [section, setSection] = useState("perfil");
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen  pt-16">

        <div className="hidden md:block">
          <DashboardNav section={section} setSection={setSection} />
        </div>

        <button
          onClick={() => setOpen(true)}
          className="md:hidden fixed top-20 left-4 z-50 bg-blue-950 text-white p-2 rounded-lg shadow"
        >
          <Menu size={20} />
        </button>

        {open && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeMenu}
            />
            <div className="relative w-64 bg-white h-full shadow-lg z-50">
              <div className="flex justify-between items-center p-4 border-b">
                <span className="font-semibold text-blue-950">
                  Menú
                </span>

                <button onClick={closeMenu}>
                  <X size={20} />
                </button>
              </div>

              <DashboardNav
                section={section}
                setSection={(s) => {
                  setSection(s);
                  closeMenu();
                }}
              />
            </div>
          </div>
        )}
        <div className="flex-1 w-full">
          <DashboardContent section={section} />
        </div>

      </div>
      <Footer/>
    </>
  );
}