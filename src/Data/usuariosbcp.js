import { db } from "../firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const usuariosbcp = [
    
  {
    id: "1",
    nombre: "Ana Sofía Quispe",
    area: "Analítica y Tecnología",
    carrera: "Ingeniería de Sistemas",
    ciclo: "7° Ciclo",
    correo: "anasofi@gmail.com",
    contraseña: "1234",
    rol: "usuario",
    universidad: "Universidad Nacional de Ingeniería",
    descripcion: "Estudiante apasionada por los datos y la automatización de procesos.",
    motivaciones: "Me motiva transformar información compleja en decisiones estratégicas.",
    disponibilidad: "Full-time",
    foto: "https://firebasestorage.googleapis.com/v0/b/fir-app2-6dc27.firebasestorage.app/o/usuarios%2Fdefault.jpg?alt=media",
    fechaRegistro: "2026-04-15T15:20:21-05:00",
    cursos: ["Excel Avanzado", "SQL Server", "Power BI", "Python for Data Science", "Cloud Computing"],
    capacitaciones: ["Workshop de IA", "Certificación AWS", "Curso de Big Data"],
    experiencia: ["Proyecto de ETL para retail", "Apoyo en modelado de datos", "Pasante en área TI"],
    voluntariado: ["3 voluntariados", "animales", "arborización"],
    conocimientosTecnicos: ["Excel", "SQL", "Power BI", "Python", "Tableau", "Jira"]
  },
  {
    id: "2",
    nombre: "Carlos Alberto Ruiz",
    area: "Finanzas y Control",
    carrera: "Economía",
    ciclo: "8° Ciclo",
    correo: "cruiz_eco@gmail.com",
    contraseña: "1234",
    rol: "usuario",
    universidad: "Universidad del Pacífico",
    descripcion: "Enfocado en el análisis financiero y la precisión en el reporte de resultados.",
    motivaciones: "Busco optimizar la rentabilidad a través de un análisis numérico riguroso.",
    disponibilidad: "Full-time",
    foto: "https://firebasestorage.googleapis.com/v0/b/fir-app2-6dc27.firebasestorage.app/o/usuarios%2Fdefault.jpg?alt=media",
    fechaRegistro: "2026-04-15T15:20:21-05:00",
    cursos: ["Excel Financiero", "Valuación de Empresas", "Contabilidad de Costos", "Finanzas Corporativas"],
    capacitaciones: ["Seminario de Inversiones", "Taller de Riesgos", "Curso Bloomberg"],
    experiencia: ["Asistente contable", "Análisis de mercado bursátil", "Proyecto de presupuesto"],
    voluntariado: ["Refuerzo escolar", "Limpieza de playas", "Colectas"],
    conocimientosTecnicos: ["Excel", "SAP", "Bloomberg", "Python", "Power BI", "EViews"]
  },
  {
    id: "4",
    nombre: "Lucía Fernanda Vargas",
    area: "Gestión y Operaciones",
    carrera: "Ingeniería Industrial",
    ciclo: "9° Ciclo",
    correo: "luciavargas@gmail.com",
    contraseña: "1234",
    rol: "usuario",
    universidad: "Pontificia Universidad Católica del Perú",
    descripcion: "Especialista en optimización de procesos y gestión del tiempo.",
    motivaciones: "Me motiva encontrar eficiencias operativas en entornos dinámicos.",
    disponibilidad: "Full-time",
    foto: "https://firebasestorage.googleapis.com/v0/b/fir-app2-6dc27.firebasestorage.app/o/usuarios%2Fdefault.jpg?alt=media",
    fechaRegistro: "2026-04-15T15:20:21-05:00",
    cursos: ["Lean Manufacturing", "Gestión de Proyectos", "Excel Avanzado", "Six Sigma"],
    capacitaciones: ["Curso de Scrum", "Taller de Procesos", "Diplomado Logística"],
    experiencia: ["Mejora de línea de producción", "Gestión de almacenes", "Control de inventarios"],
    voluntariado: ["Reciclaje", "Apoyo en comedores", "Gestión comunitaria"],
    conocimientosTecnicos: ["Excel", "Visio", "Bizagi", "Power BI", "SAP", "Trello"]
  },
  {
    id: "5",
    nombre: "Diego Armando Soto",
    area: "Comunicación y Relación",
    carrera: "Comunicaciones",
    ciclo: "6° Ciclo",
    correo: "dsoto_com@gmail.com",
    contraseña: "1234",
    rol: "usuario",
    universidad: "Universidad de Lima",
    descripcion: "Apasionado por la comunicación efectiva y la gestión de stakeholders.",
    motivaciones: "Quiero generar impacto a través de estrategias de comunicación claras y empáticas.",
    disponibilidad: "Full-time",
    foto: "https://firebasestorage.googleapis.com/v0/b/fir-app2-6dc27.firebasestorage.app/o/usuarios%2Fdefault.jpg?alt=media",
    fechaRegistro: "2026-04-15T15:20:21-05:00",
    cursos: ["Comunicación Corporativa", "Marketing Digital", "Excel", "Redacción Creativa"],
    capacitaciones: ["Taller de Liderazgo", "Curso de Storytelling", "Seminario de Relaciones Públicas"],
    experiencia: ["Gestión de redes sociales", "Evento interno de empresa", "Copywriting"],
    voluntariado: ["Ayuda social", "Apoyo en eventos", "Mentoría"],
    conocimientosTecnicos: ["Excel", "Canva", "Hootsuite", "Google Analytics", "WordPress", "Slack"]
  },
  {
    nombre: "Mariana Lucía Castro",
    area: "Finanzas y Control",
    carrera: "Administración",
    ciclo: "7° Ciclo",
    correo: "marianacastro@gmail.com",
    contraseña: "1234",
    rol: "usuario",
    universidad: "Universidad de Lima",
    descripcion: "Estudiante enfocada en el control de gestión y eficiencia administrativa.",
    motivaciones: "Me motiva el orden institucional y el impacto de un buen control financiero.",
    disponibilidad: "Full-time",
    foto: "https://firebasestorage.googleapis.com/v0/b/fir-app2-6dc27.firebasestorage.app/o/usuarios%2Fdefault.jpg?alt=media",
    fechaRegistro: "2026-04-15T16:10:00-05:00",
    cursos: ["Excel Intermedio", "Contabilidad General", "Gestión de Presupuestos", "Matemática Financiera"],
    capacitaciones: ["Taller de ERP SAP", "Certificación Excel Especialista", "Seminario de Auditoría"],
    experiencia: ["Asistente de tesorería", "Apoyo en cierre de mes", "Proyecto de reducción de costos"],
    voluntariado: ["3 voluntariados", "gestión de donaciones", "arborización"],
    conocimientosTecnicos: ["Excel", "SAP Business One", "QuickBooks", "Power BI", "PowerPoint", "Oracle"]
  },
  {
    nombre: "Renzo Gabriel Mendoza",
    area: "Analítica y Tecnología",
    carrera: "Ingeniería de Software",
    ciclo: "8° Ciclo",
    correo: "renzo.mendoza@gmail.com",
    contraseña: "1234",
    rol: "usuario",
    universidad: "UPC",
    descripcion: "Desarrollador con mentalidad analítica orientado a soluciones escalables.",
    motivaciones: "Me apasiona el aprendizaje tecnológico constante y resolver problemas lógicos.",
    disponibilidad: "Full-time",
    foto: "https://firebasestorage.googleapis.com/v0/b/fir-app2-6dc27.firebasestorage.app/o/usuarios%2Fdefault.jpg?alt=media",
    fechaRegistro: "2026-04-15T16:15:20-05:00",
    cursos: ["Algoritmos Avanzados", "SQL for Data", "Power BI", "Angular Components", "Java Spring Boot"],
    capacitaciones: ["Hackathon 2025 Ganador", "Bootcamp Data Engineering", "Workshop Cloud Fundamentals"],
    experiencia: ["Desarrollo de landing page", "Optimización de base de datos SQL", "Proyecto App móvil"],
    voluntariado: ["Enseñanza de programación", "Reciclaje tecnológico", "animales"],
    conocimientosTecnicos: ["SQL Server", "Excel", "Visual Studio Code", "Git/GitHub", "Power BI", "Azure"]
  },
  {
    nombre: "Camila Belén Rojas",
    area: "Gestión y Operaciones",
    carrera: "Ingeniería Industrial",
    ciclo: "6° Ciclo",
    correo: "camila.rojas@gmail.com",
    contraseña: "1234",
    rol: "usuario",
    universidad: "Universidad Nacional Mayor de San Marcos",
    descripcion: "Interesada en la mejora de procesos y la continuidad operativa eficiente.",
    motivaciones: "Busco aplicar metodologías ágiles para mejorar el flujo de trabajo en equipo.",
    disponibilidad: "Full-time",
    foto: "https://firebasestorage.googleapis.com/v0/b/fir-app2-6dc27.firebasestorage.app/o/usuarios%2Fdefault.jpg?alt=media",
    fechaRegistro: "2026-04-15T16:20:10-05:00",
    cursos: ["Excel Avanzado", "Supply Chain Management", "Gestión del Tiempo", "Project Management"],
    capacitaciones: ["Curso de Scrum Foundation", "Certificación Six Sigma Yellow Belt", "Taller de Logística"],
    experiencia: ["Practicante de operaciones", "Análisis de tiempos y movimientos", "Control de calidad"],
    voluntariado: ["Liderazgo juvenil", "arborización", "animales"],
    conocimientosTecnicos: ["Excel", "Trello", "Asana", "Power BI", "Visio", "Bizagi Modeler"]
  },
  {
    nombre: "Sebastián José Paredes",
    area: "Comunicación y Relación",
    carrera: "Administración y Negocios Internacionales",
    ciclo: "9° Ciclo",
    correo: "sparedes.negocios@gmail.com",
    contraseña: "1234",
    rol: "usuario",
    universidad: "ESAN",
    descripcion: "Perfil comercial con fuertes habilidades de negociación y comunicación interpersonal.",
    motivaciones: "Me motiva el trato directo con el cliente y la gestión de relaciones comerciales sólidas.",
    disponibilidad: "Full-time",
    foto: "https://firebasestorage.googleapis.com/v0/b/fir-app2-6dc27.firebasestorage.app/o/usuarios%2Fdefault.jpg?alt=media",
    fechaRegistro: "2026-04-15T16:25:45-05:00",
    cursos: ["Negociación Estratégica", "Customer Relationship Management", "Excel", "Marketing Internacional"],
    capacitaciones: ["Taller de Empatía y Feedback", "Diplomado en Ventas", "Curso de LinkedIn Estratégico"],
    experiencia: ["Asistente comercial", "Gestión de cartera de clientes", "Proyecto de expansión de marca"],
    voluntariado: ["Charlas motivacionales", "animales", "ayuda social"],
    conocimientosTecnicos: ["Salesforce", "Excel", "HubSpot", "Slack", "LinkedIn Navigator", "Zoom"]
  }

];


const subirUsuarios = async () => {
  const colRef = collection(db, "usuariosbcp");

  for (const usuario of usuariosbcp) {
    try {
      const docData = {
        ...usuario,
        fechaRegistro: Timestamp.now()
      };

      const docRef = await addDoc(colRef, docData);
      console.log(`Usuario ${usuario.nombre} creado con ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error al subir usuario:", error);
    }
  }
};

subirUsuarios();