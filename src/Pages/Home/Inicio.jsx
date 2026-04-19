import { useState, useEffect, useRef } from "react";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import Footer from "../../Components/Footer/Footer.jsx";
import Login from "../../Components/Login/Login.jsx";

const O = "#FF5000";
const BLUE = "#002A80";
const LIGHT_BLUE = "#0041CC";

/* ─── Animated counter hook ─── */
function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const numeric = parseFloat(target.replace(/[^0-9.]/g, ""));
    const suffix = target.replace(/[0-9.]/g, "");
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(+(numeric * eased).toFixed(1));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  const numeric = parseFloat(target.replace(/[^0-9.]/g, ""));
  const suffix = target.replace(/[0-9.]/g, "");
  const display = Number.isInteger(numeric) ? Math.round(count) : count;
  return display + suffix;
}

/* ─── Stat card with animated number ─── */
function StatCard({ value, label, delay, visible }) {
  const animated = useCountUp(value, 1600, visible);
  return (
    <div
      className="stat-card"
      style={{ animationDelay: `${delay}ms`, opacity: visible ? 1 : 0 }}
    >
      <p className="stat-value">{animated}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

/* ─── Typewriter effect ─── */
function Typewriter({ texts, speed = 80 }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = texts[index];
    if (!deleting && displayed.length < current.length) {
      const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), speed);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === current.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), speed / 2);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }
  }, [displayed, deleting, index, texts, speed]);
  return (
    <span style={{ color: O }}>
      {displayed}
      <span className="cursor-blink">|</span>
    </span>
  );
}

/* ─── Benefit card ─── */
function BenefitCard({ icon, title, desc, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`benefit-card ${hovered ? "hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="benefit-icon">{icon}</div>
      <h3 className="benefit-title">{title}</h3>
      <p className="benefit-desc">{desc}</p>
      <div className="benefit-bar" />
    </div>
  );
}

/* ─── Process step ─── */
function ProcessStep({ number, title, desc, active, onClick }) {
  return (
    <button className={`process-step ${active ? "active" : ""}`} onClick={onClick}>
      <div className="step-number">{number}</div>
      <div className="step-content">
        <h4 className="step-title">{title}</h4>
        {active && <p className="step-desc">{desc}</p>}
      </div>
    </button>
  );
}

/* ─── Testimonial ─── */
function TestimonialCard({ name, role, text, avatar, active }) {
  return (
    <div className={`testimonial-card ${active ? "active" : ""}`}>
      <div className="quote-mark">"</div>
      <p className="testimonial-text">{text}</p>
      <div className="testimonial-author">
        <div className="avatar">{avatar}</div>
        <div>
          <p className="author-name">{name}</p>
          <p className="author-role">{role}</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function Inicio() {
  const [active, setActive] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const statsRef = useRef(null);
  const heroRef = useRef(null);

  /* Auto-slide gallery */
  useEffect(() => {
    const iv = setInterval(() => setActive((a) => (a + 1) % gallery.length), 4000);
    return () => clearInterval(iv);
  }, []);

  /* Auto-slide testimonials */
  useEffect(() => {
    const iv = setInterval(() => setActiveTestimonial((a) => (a + 1) % testimonials.length), 5000);
    return () => clearInterval(iv);
  }, []);

  /* IntersectionObserver for stats */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  /* Parallax scroll */
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const stats = [
    { value: "11M+", label: "clientes en el Perú" },
    { value: "130+", label: "años de historia" },
    { value: "95%", label: "cobertura nacional" },
    { value: "500+", label: "programas de talento" },
  ];

  const gallery = ["https://i.ytimg.com/vi/wBszLpZEpJw/maxresdefault.jpg",
    "https://media.licdn.com/dms/image/v2/D4D22AQHTM4J-jM_aWg/feedshare-shrink_2048_1536/B4DZ0sRahYIoAg-/0/1774564256278?e=1778112000&v=beta&t=eyTLQ4hKpTRhIlq9_HRhFW3TU-T6oF0Hrh8RGQhQ5VU",
    "https://stakeholders.com.pe/wp-content/uploads/2024/07/dsc01825-jpg.webp",
    
  ];

  const benefits = [
    { title: "Proyectos de impacto real", desc: "Trabaja en iniciativas que transforman la experiencia de millones de peruanos." },
    { title: "Mentoría personalizada", desc: "Aprende junto a líderes del sector financiero y tecnológico del país." },
    { title: "Innovación constante", desc: "Forma parte de squads ágiles que construyen el futuro del banking digital." },
    { title: "Línea de carrera", desc: "Alta tasa de conversión a plazas fijas. Tu crecimiento nos importa." },
    { title: "Impacto regional", desc: "Posibilidad de participar en proyectos con alcance en toda Latinoamérica." },
    { title: "Capacitación continua", desc: "Acceso a plataformas de aprendizaje, certificaciones y talleres exclusivos." },
  ];

  const steps = [
    { title: "Postula en línea", desc: "Completa tu perfil, sube tu CV y cuéntanos sobre ti. El proceso toma menos de 10 minutos." },
    { title: "Evaluación online", desc: "Resuelve un test de aptitudes y habilidades digitales desde la comodidad de tu casa." },
    { title: "Entrevista con el área", desc: "Conversa con el equipo que podría ser el tuyo. Conócenos y cuéntanos tu historia." },
    { title: "Bienvenido al BCP", desc: "Recibe tu oferta, firma tu contrato y empieza a construir el banco del futuro." },
  ];

  const testimonials = [
    { name: "Valeria Torres", role: "Practicante de Data Analytics · 2024", text: "Jamás imaginé tener tanta autonomía en mi primer trabajo. Aquí puse en práctica todo lo que aprendí en la universidad desde el día uno.", avatar: "VT" },
    { name: "Rodrigo Quispe", role: "Practicante de Ingeniería de Software · 2024", text: "El ambiente es increíble, los proyectos son desafiantes y el aprendizaje es exponencial. BCP fue la mejor decisión de mi carrera.", avatar: "RQ" },
    { name: "Camila Fernández", role: "Practicante de UX Design · 2023", text: "Trabajé directamente con el equipo de producto en mejoras que vieron millones de usuarios. Una experiencia que te marca para siempre.", avatar: "CF" },
  ];

  const typewriterTexts = ["banca digital", "innovación", "tecnología", "el futuro"];

  return (
    <div className="bcp-root">
      <style>{`
        /* ── GLOBALS ── */
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .bcp-root { min-height:100vh; background:#fff; color:${BLUE}; font-family:'DM Sans',sans-serif; overflow-x:hidden; }

        /* ── HERO BG ── */
        .hero-bg {
          position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:0;
        }
        .hero-blob {
          position:absolute; border-radius:50%; filter:blur(80px); opacity:0.08;
          animation: blobFloat 8s ease-in-out infinite;
        }
        .blob1 { width:500px; height:500px; background:${O}; top:-100px; right:-100px; animation-delay:0s; }
        .blob2 { width:350px; height:350px; background:${LIGHT_BLUE}; bottom:-80px; left:-80px; animation-delay:3s; }
        .blob3 { width:200px; height:200px; background:${O}; top:40%; left:30%; animation-delay:5s; }
        @keyframes blobFloat {
          0%,100%{transform:translateY(0) scale(1);}
          50%{transform:translateY(-30px) scale(1.05);}
        }

        /* ── HERO SECTION ── */
        .hero-section {
          position:relative; padding-top:clamp(80px,10vw,140px);
          padding-left:clamp(16px,6vw,96px); padding-right:clamp(16px,6vw,96px);
          padding-bottom:clamp(40px,6vw,80px);
        }
        .hero-grid { display:grid; grid-template-columns:1fr; gap:40px; align-items:center; }
        @media(min-width:1024px){ .hero-grid{ grid-template-columns:1fr 1fr; gap:56px; } }

        /* ── BADGE ── */
        .hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          font-size:11px; font-weight:700; letter-spacing:1.5px;
          padding:6px 14px; border-radius:100px;
          border:1.5px solid ${O}; color:${O};
          background:rgba(255,80,0,0.06);
          font-family:'Sora',sans-serif;
          animation: fadeDown 0.6s ease both;
        }
        .badge-dot { width:7px; height:7px; border-radius:50%; background:${O}; animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(1.4);} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-16px);} to{opacity:1;transform:translateY(0);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }

        /* ── HEADLINE ── */
        .hero-title {
          font-family:'Sora',sans-serif;
          font-size:clamp(2rem,5vw,4rem);
          font-weight:800; line-height:1.1;
          color:${BLUE}; margin-top:20px;
          animation: fadeUp 0.7s 0.15s ease both;
        }
        .cursor-blink { animation:blink 0.8s step-end infinite; }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }

        /* ── SUBTITLE ── */
        .hero-subtitle {
          color:#4A5568; margin-top:20px; max-width:520px;
          font-size:clamp(0.875rem,1.5vw,1rem); line-height:1.8;
          animation: fadeUp 0.7s 0.25s ease both;
        }

        /* ── BUTTONS ── */
        .btn-row { display:flex; flex-wrap:wrap; gap:12px; margin-top:28px; animation: fadeUp 0.7s 0.35s ease both; }
        .btn-primary {
          padding:14px 28px; border-radius:12px; font-weight:700;
          background:${O}; color:#fff; border:none; cursor:pointer;
          font-family:'Sora',sans-serif; font-size:14px;
          position:relative; overflow:hidden; transition:transform 0.2s, box-shadow 0.2s;
          box-shadow:0 4px 20px rgba(255,80,0,0.35);
        }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(255,80,0,0.45); }
        .btn-primary::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.2),transparent);
          opacity:0; transition:opacity 0.2s;
        }
        .btn-primary:hover::after { opacity:1; }
        .btn-secondary {
          padding:14px 28px; border-radius:12px; font-weight:600;
          background:transparent; color:${BLUE}; border:2px solid ${BLUE};
          cursor:pointer; font-family:'Sora',sans-serif; font-size:14px;
          transition:background 0.2s, color 0.2s, transform 0.2s;
        }
        .btn-secondary:hover { background:${BLUE}; color:#fff; transform:translateY(-2px); }

        /* ── STATS ── */
        .stats-grid {
          display:grid; grid-template-columns:repeat(2,1fr);
          gap:12px; margin-top:36px;
          animation: fadeUp 0.7s 0.45s ease both;
        }
        @media(min-width:768px){ .stats-grid{ grid-template-columns:repeat(4,1fr); } }
        .stat-card {
          background:#fff; border:1.5px solid rgba(255,80,0,0.2);
          border-radius:14px; padding:16px;
          animation: fadeUp 0.5s ease both;
          transition:transform 0.25s, box-shadow 0.25s, border-color 0.25s;
        }
        .stat-card:hover { transform:translateY(-4px); box-shadow:0 8px 24px rgba(0,42,128,0.12); border-color:${O}; }
        .stat-value { font-family:'Sora',sans-serif; font-size:clamp(1.2rem,2.5vw,1.5rem); font-weight:800; color:${O}; }
        .stat-label { font-size:11px; color:#718096; margin-top:4px; }

        /* ── GALLERY ── */
        .gallery-wrap { position:relative; animation: fadeUp 0.7s 0.2s ease both; }
        .gallery-main {
          border-radius:20px; overflow:hidden;
          box-shadow:0 20px 60px rgba(0,42,128,0.2);
          position:relative;
        }
        .gallery-img {
          width:100%; height:clamp(220px,35vw,440px);
          object-fit:cover; transition:transform 0.7s ease;
          display:block;
        }
        .gallery-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to top, rgba(0,42,128,0.5) 0%, transparent 50%);
          pointer-events:none;
        }
        .gallery-label {
          position:absolute; bottom:16px; left:20px; right:20px;
          color:#fff; font-family:'Sora',sans-serif; font-size:13px; font-weight:600;
          display:flex; align-items:center; gap:8px;
        }
        .gallery-label-dot { width:8px; height:8px; border-radius:50%; background:${O}; }
        .gallery-thumbs { display:flex; gap:10px; margin-top:12px; }
        .gallery-thumb {
          flex:1; height:clamp(48px,8vw,72px); border-radius:10px;
          overflow:hidden; border:2px solid transparent;
          cursor:pointer; transition:all 0.25s;
          opacity:0.55;
        }
        .gallery-thumb.is-active { border-color:${O}; opacity:1; transform:scale(1.05); }
        .gallery-thumb:hover { opacity:0.9; }
        .gallery-thumb img { width:100%; height:100%; object-fit:cover; }
        .gallery-progress {
          display:flex; gap:6px; margin-top:12px; justify-content:center;
        }
        .progress-dot {
          height:3px; border-radius:2px; background:#E2E8F0;
          transition:all 0.4s; cursor:pointer;
        }
        .progress-dot.is-active { background:${O}; width:24px !important; }

        /* ── FLOATING CARD ── */
        .float-card {
          position:absolute; background:#fff;
          border-radius:14px; padding:12px 16px;
          box-shadow:0 8px 32px rgba(0,42,128,0.15);
          display:flex; align-items:center; gap:10px;
          animation:floatCard 4s ease-in-out infinite;
          border:1px solid rgba(255,80,0,0.1);
          z-index:10;
        }
        .float-card-left { bottom:24px; left:-16px; animation-delay:0s; }
        .float-card-right { top:24px; right:-16px; animation-delay:2s; }
        @media(max-width:767px){ .float-card-left,.float-card-right{ display:none; } }
        @keyframes floatCard {
          0%,100%{transform:translateY(0);}
          50%{transform:translateY(-8px);}
        }
        .float-icon { font-size:24px; }
        .float-text { font-size:11px; font-weight:600; color:${BLUE}; font-family:'Sora',sans-serif; }
        .float-sub { font-size:10px; color:#718096; }

        /* ── DIVIDER WAVE ── */
        .wave-divider { width:100%; overflow:hidden; line-height:0; }
        .wave-divider svg { display:block; width:100%; }

        /* ── BENEFITS SECTION ── */
        .section { padding:clamp(48px,8vw,96px) clamp(16px,6vw,96px); }
        .section-tag {
          display:inline-block; font-size:11px; font-weight:700;
          letter-spacing:2px; color:${O}; font-family:'Sora',sans-serif;
          text-transform:uppercase; margin-bottom:12px;
        }
        .section-title {
          font-family:'Sora',sans-serif;
          font-size:clamp(1.5rem,3.5vw,2.5rem);
          font-weight:800; color:${BLUE}; line-height:1.2;
          max-width:560px;
        }
        .benefits-grid {
          display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
          gap:20px; margin-top:40px;
        }
        .benefit-card {
          background:#fff; border:1.5px solid #E8EEF8;
          border-radius:16px; padding:24px;
          cursor:default; position:relative; overflow:hidden;
          animation:fadeUp 0.5s ease both;
          transition:transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .benefit-card::before {
          content:''; position:absolute; bottom:0; left:0;
          height:3px; width:0%; background:${O};
          transition:width 0.4s;
        }
        .benefit-card.hovered { transform:translateY(-6px); box-shadow:0 16px 40px rgba(0,42,128,0.12); border-color:rgba(255,80,0,0.3); }
        .benefit-card.hovered::before { width:100%; }
        .benefit-icon { font-size:32px; margin-bottom:14px; }
        .benefit-title { font-family:'Sora',sans-serif; font-size:15px; font-weight:700; color:${BLUE}; }
        .benefit-desc { font-size:13px; color:#718096; margin-top:8px; line-height:1.7; }
        .benefit-bar { display:none; }

        /* ── PROCESS SECTION ── */
        .process-section {
          background:linear-gradient(135deg,${BLUE} 0%,${LIGHT_BLUE} 100%);
          padding:clamp(48px,8vw,96px) clamp(16px,6vw,96px);
          position:relative; overflow:hidden;
        }
        .process-section::before {
          content:''; position:absolute; inset:0;
          background-image:radial-gradient(rgba(255,255,255,0.05) 1px,transparent 1px);
          background-size:32px 32px;
          pointer-events:none;
        }
        .process-section .section-tag { color:rgba(255,80,0,0.9); }
        .process-section .section-title { color:#fff; max-width:100%; }
        .process-grid { display:grid; gap:12px; margin-top:36px; max-width:640px; }
        .process-step {
          background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.12);
          border-radius:14px; padding:16px 20px;
          display:flex; align-items:flex-start; gap:16px;
          cursor:pointer; text-align:left; width:100%;
          transition:background 0.3s, border-color 0.3s, transform 0.2s;
        }
        .process-step:hover { background:rgba(255,255,255,0.1); transform:translateX(4px); }
        .process-step.active { background:rgba(255,255,255,0.12); border-color:${O}; transform:translateX(0); }
        .step-number {
          min-width:36px; height:36px; border-radius:50%;
          background:rgba(255,255,255,0.1); border:2px solid rgba(255,255,255,0.2);
          display:flex; align-items:center; justify-content:center;
          font-family:'Sora',sans-serif; font-weight:700; font-size:13px; color:#fff;
          transition:background 0.3s, border-color 0.3s;
          flex-shrink:0;
        }
        .process-step.active .step-number { background:${O}; border-color:${O}; }
        .step-title { font-family:'Sora',sans-serif; font-size:14px; font-weight:700; color:#fff; }
        .step-desc { font-size:12px; color:rgba(255,255,255,0.7); margin-top:6px; line-height:1.7; max-height:0; overflow:hidden; transition:max-height 0.35s; }
        .process-step.active .step-desc { max-height:80px; }
        .process-visual {
          display:none;
        }
        @media(min-width:768px){
          .process-inner { display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:center; }
          .process-visual {
            display:flex; align-items:center; justify-content:center;
            position:relative;
          }
        }
        .process-circle {
          width:180px; height:180px; border-radius:50%;
          border:3px solid rgba(255,80,0,0.4);
          display:flex; align-items:center; justify-content:center;
          position:relative;
        }
        .process-circle::before {
          content:''; position:absolute;
          width:220px; height:220px; border-radius:50%;
          border:1px dashed rgba(255,255,255,0.15);
          animation:spin 20s linear infinite;
        }
        .process-circle::after {
          content:''; position:absolute;
          width:260px; height:260px; border-radius:50%;
          border:1px dashed rgba(255,255,255,0.08);
          animation:spin 30s linear infinite reverse;
        }
        @keyframes spin { to{transform:rotate(360deg);} }
        .circle-number {
          font-family:'Sora',sans-serif; font-size:64px; font-weight:800;
          color:${O}; line-height:1;
        }
        .circle-label { font-size:12px; color:rgba(255,255,255,0.7); text-align:center; margin-top:8px; }

        /* ── TESTIMONIALS ── */
        .testimonials-section {
          background:#F7F9FC;
          padding:clamp(48px,8vw,96px) clamp(16px,6vw,96px);
        }
        .testimonials-track { display:grid; gap:20px; margin-top:40px; }
        @media(min-width:768px){ .testimonials-track{ grid-template-columns:repeat(3,1fr); } }
        .testimonial-card {
          background:#fff; border-radius:16px; padding:28px;
          border:1.5px solid #E8EEF8;
          transition:transform 0.4s, box-shadow 0.4s, border-color 0.4s;
          position:relative; overflow:hidden;
        }
        .testimonial-card:hover,.testimonial-card.active {
          transform:translateY(-6px);
          box-shadow:0 16px 40px rgba(0,42,128,0.1);
          border-color:rgba(255,80,0,0.25);
        }
        .quote-mark {
          font-family:Georgia,serif; font-size:56px; line-height:0.8;
          color:rgba(255,80,0,0.15); font-weight:700;
          margin-bottom:16px;
        }
        .testimonial-text { font-size:14px; color:#4A5568; line-height:1.8; font-style:italic; }
        .testimonial-author { display:flex; align-items:center; gap:12px; margin-top:20px; }
        .avatar {
          width:40px; height:40px; border-radius:50%;
          background:linear-gradient(135deg,${O},${LIGHT_BLUE});
          display:flex; align-items:center; justify-content:center;
          font-family:'Sora',sans-serif; font-size:11px; font-weight:700; color:#fff;
          flex-shrink:0;
        }
        .author-name { font-family:'Sora',sans-serif; font-size:13px; font-weight:700; color:${BLUE}; }
        .author-role { font-size:11px; color:#718096; margin-top:2px; }

        /* ── CTA BAND ── */
        .cta-band {
          background:${O};
          padding:clamp(32px,5vw,56px) clamp(16px,6vw,96px);
          display:flex; flex-direction:column; align-items:center; text-align:center;
          gap:20px; position:relative; overflow:hidden;
        }
        @media(min-width:768px){ .cta-band{ flex-direction:row; justify-content:space-between; text-align:left; } }
        .cta-band::before {
          content:''; position:absolute;
          width:400px; height:400px; border-radius:50%;
          background:rgba(255,255,255,0.07); top:-200px; right:-100px;
        }
        .cta-band::after {
          content:''; position:absolute;
          width:200px; height:200px; border-radius:50%;
          background:rgba(255,255,255,0.07); bottom:-100px; left:5%;
        }
        .cta-title {
          font-family:'Sora',sans-serif; font-size:clamp(1.25rem,2.5vw,1.75rem);
          font-weight:800; color:#fff; position:relative; z-index:1;
        }
        .cta-sub { font-size:14px; color:rgba(255,255,255,0.8); margin-top:6px; position:relative; z-index:1; }
        .btn-white {
          padding:14px 32px; border-radius:12px; font-weight:700;
          background:#fff; color:${O}; border:none; cursor:pointer;
          font-family:'Sora',sans-serif; font-size:14px;
          transition:transform 0.2s, box-shadow 0.2s;
          white-space:nowrap; position:relative; z-index:1;
          box-shadow:0 4px 20px rgba(0,0,0,0.15);
          flex-shrink:0;
        }
        .btn-white:hover { transform:translateY(-2px) scale(1.03); box-shadow:0 8px 30px rgba(0,0,0,0.2); }

        /* ── PORQUE BCP ── */
        #porque-bcp {
          scroll-margin-top:80px;
        }

        /* ── SCROLL FADE IN ── */
        .reveal {
          opacity:0; transform:translateY(24px);
          transition:opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.visible { opacity:1; transform:translateY(0); }
      `}</style>

      <Navbar />

      {/* ════ HERO ════ */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-bg">
          <div className="hero-blob blob1" />
          <div className="hero-blob blob2" />
          <div className="hero-blob blob3" />
        </div>

        <div className="hero-grid" style={{ position: "relative", zIndex: 1 }}>

          {/* LEFT */}
          <div>
            <div className="hero-badge">
              <span className="badge-dot" />
              PROGRAMA DE PRÁCTICAS BCP 2026
            </div>

            <h1 className="hero-title">
              Construye el futuro<br />
              de la{" "}
              <Typewriter texts={typewriterTexts} />
            </h1>

            <p className="hero-subtitle">
              Únete al banco más importante del Perú. Trabaja en proyectos que transforman
              la vida financiera de millones de peruanos con tecnología de clase mundial.
            </p>

            <div className="btn-row">
              <button className="btn-primary" onClick={() => setShowLogin(true)}>
                Postular ahora →
              </button>
              <button
                className="btn-secondary"
                onClick={() => document.getElementById("porque-bcp")?.scrollIntoView({ behavior: "smooth" })}
              >
                Descubrir el programa
              </button>
            </div>

            {/* STATS */}
            <div className="stats-grid" ref={statsRef}>
              {stats.map((s, i) => (
                <StatCard key={i} value={s.value} label={s.label} delay={i * 80} visible={statsVisible} />
              ))}
            </div>
          </div>

          {/* RIGHT – Gallery */}
          <div className="gallery-wrap">

            <div className="gallery-main">
              <img src={gallery[active]} className="gallery-img" alt="BCP workplace" />
              <div className="gallery-overlay" />
              <div className="gallery-label">
                <div className="gallery-label-dot" />
                Banco de Crédito del Perú
              </div>
            </div>

            <div className="gallery-thumbs">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  className={`gallery-thumb ${active === i ? "is-active" : ""}`}
                  onClick={() => setActive(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>

            <div className="gallery-progress">
              {gallery.map((_, i) => (
                <div
                  key={i}
                  className={`progress-dot ${active === i ? "is-active" : ""}`}
                  style={{ width: active === i ? 24 : 8 }}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ WAVE ════ */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: 60 }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#F7F9FC" />
        </svg>
      </div>

      {/* ════ BENEFITS ════ */}
      <section id="porque-bcp" className="section testimonials-section">
        <div>
          <div className="section-tag">¿Por qué elegir BCP?</div>
          <h2 className="section-title">
            Todo lo que necesitas para despegar tu carrera
          </h2>
        </div>
        <div className="benefits-grid">
          {benefits.map((b, i) => (
            <BenefitCard key={i} {...b} index={i} />
          ))}
        </div>
      </section>

      {/* ════ PROCESS ════ */}
      <section className="process-section">
        <div className="process-inner">
          <div>
            <div className="section-tag">Proceso de selección</div>
            <h2 className="section-title">
              4 pasos para unirte al mejor banco del Perú
            </h2>
            <div className="process-grid">
              {steps.map((s, i) => (
                <ProcessStep
                  key={i}
                  number={i + 1}
                  title={s.title}
                  desc={s.desc}
                  active={activeStep === i}
                  onClick={() => setActiveStep(i)}
                />
              ))}
            </div>
          </div>
          <div className="process-visual">
            <div style={{ textAlign: "center" }}>
              <div className="process-circle">
                <div>
                  <div className="circle-number">0{activeStep + 1}</div>
                </div>
              </div>
              <div className="circle-label" style={{ color: "rgba(255,255,255,0.8)", marginTop: 16, maxWidth: 180, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                {steps[activeStep].title}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ TESTIMONIALS ════ */}
      <section className="section testimonials-section">
        <div className="section-tag">Lo que dicen nuestros practicantes</div>
        <h2 className="section-title">Historias reales de crecimiento</h2>
        <div className="testimonials-track">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} active={activeTestimonial === i} />
          ))}
        </div>
        {/* Dot navigation */}
        <div style={{ display: "flex", gap: 8, marginTop: 28, justifyContent: "center" }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTestimonial(i)}
              style={{
                width: activeTestimonial === i ? 24 : 8,
                height: 8, borderRadius: 4,
                background: activeTestimonial === i ? O : "#CBD5E0",
                border: "none", cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </section>

      {/* ════ CTA BAND ════ */}
      <div className="cta-band">
        <div>
          <div className="cta-title">¿Listo para marcar la diferencia?</div>
          <div className="cta-sub">Las postulaciones cierran pronto. No dejes pasar esta oportunidad.</div>
        </div>
        <button className="btn-white" onClick={() => setShowLogin(true)}>
          Postular al programa →
        </button>
      </div>

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          irARegistro={() => setShowLogin(false)}
        />
      )}

      <Footer />
    </div>
  );
}
