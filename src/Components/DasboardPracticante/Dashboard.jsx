export default function Dashboard() {
  const [section, setSection] = useState("perfil");

  return (
    <>
      {/* NAVBAR ARRIBA (FUERA) */}
      <Navbar />

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