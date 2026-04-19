import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../Lib/firebase";
import { useAuth } from "../../Context/AuthContext";

/* ── palette ── */
const BLUE = "#002A80";
const ORANGE = "#FF5000";
const LIGHT = "#F4F6FB";

/* ── Avatar initials ── */
function Avatar({ name = "", size = 38 }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: `linear-gradient(135deg, ${BLUE}, #0041CC)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, color: "#fff", fontSize: size * 0.36,
        fontFamily: "'Sora',sans-serif", fontWeight: 700,
        userSelect: "none",
      }}
    >
      {initials || "?"}
    </div>
  );
}

/* ── Back arrow icon ── */
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

/* ── Send icon ── */
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

/* ── Relative time ── */
function relativeTime(date) {
  if (!date) return "";
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return date.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function Mensajes() {
  const { user } = useAuth();

  const [conversaciones, setConversaciones] = useState([]);
  const [activa, setActiva] = useState(null);           // conv id
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const [usuarios, setUsuarios] = useState({});
  const [showChat, setShowChat] = useState(false);      // mobile: show chat panel
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);


  /* ── conversaciones ── */
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "conversaciones"),
      where("participantes", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );
    const unsub = onSnapshot(q, async (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setConversaciones(data);
      data.forEach(async (conv) => {
        const otroId = conv.participantes.find((p) => p !== user.uid);
        if (!otroId) return;
        setUsuarios((prev) => {
          if (prev[otroId]) return prev;
          getDoc(doc(db, "usuariosbcp", otroId)).then((s) => {
            if (s.exists()) setUsuarios((p) => ({ ...p, [otroId]: s.data() }));
          });
          return prev;
        });
      });
    });
    return () => unsub();
  }, [user]);

  /* ── mensajes ── */
  useEffect(() => {
    if (!activa) return;
    setMensajes([]);
    const q = query(
      collection(db, "mensajes"),
      where("conversacionId", "==", activa),
      orderBy("fecha", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMensajes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [activa]);

  /* ── select conv ── */
  const selectConv = (id) => {
    setActiva(id);
    setShowChat(true);      // on mobile, slide to chat view
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  /* ── back to list (mobile) ── */
  const goBack = () => {
    setShowChat(false);
  };

  /* ── enviar ── */
  const enviarMensaje = async () => {
    if (!texto.trim() || !activa || sending) return;
    setSending(true);
    const participantes = activa.split("_");
    await setDoc(
      doc(db, "conversaciones", activa),
      { participantes, ultimoMensaje: texto, updatedAt: serverTimestamp() },
      { merge: true }
    );
    await addDoc(collection(db, "mensajes"), {
      conversacionId: activa,
      de: user.uid,
      mensaje: texto,
      fecha: serverTimestamp(),
      leido: false,
    });
    setTexto("");
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarMensaje(); }
  };

  const getOtroId = (conv) => conv?.participantes?.find((p) => p !== user.uid);

  const activaConv = conversaciones.find((c) => c.id === activa);
  const activaUser = activaConv ? usuarios[getOtroId(activaConv)] : null;

  /* ── group messages by date ── */
  const grouped = mensajes.reduce((acc, msg) => {
    const date = msg.fecha?.toDate?.();
    const label = date
      ? date.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })
      : "";
    const last = acc[acc.length - 1];
    if (!last || last.label !== label) acc.push({ label, msgs: [msg] });
    else last.msgs.push(msg);
    return acc;
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');

        .msg-root {
          font-family:'DM Sans',sans-serif;
          display:flex; flex-direction:column;
          height:calc(100dvh - 72px);   /* fills below navbar */
          margin:12px; border-radius:20px;
          overflow:hidden;
          background:#fff;
          box-shadow:0 4px 32px rgba(0,42,128,0.10);
        }
        @media(min-width:768px){
          .msg-root{ flex-direction:row; margin:16px 20px; }
        }

        /* ── SIDEBAR ── */
        .sidebar {
          width:100%; flex-shrink:0;
          display:flex; flex-direction:column;
          background:#fff;
          border-right:1px solid #EEF1F8;
          transition:transform 0.32s cubic-bezier(.4,0,.2,1);
        }
        @media(min-width:768px){ .sidebar{ width:300px; } }

        /* mobile: hide sidebar when chat is open */
        @media(max-width:767px){
          .sidebar { position:absolute; inset:0; z-index:2; border-radius:20px; }
          .sidebar.hidden-mobile { transform:translateX(-100%); pointer-events:none; }
        }

        .sidebar-header {
          padding:18px 20px 14px;
          display:flex; align-items:center; gap:10px;
          border-bottom:1px solid #EEF1F8;
        }
        .sidebar-title {
          font-family:'Sora',sans-serif; font-size:16px; font-weight:700;
          color:${BLUE}; flex:1;
        }
        .sidebar-count {
          background:${ORANGE}; color:#fff;
          font-size:11px; font-weight:700; font-family:'Sora',sans-serif;
          padding:2px 7px; border-radius:100px;
        }

        .conv-list { flex:1; overflow-y:auto; padding:8px; }

        .conv-item {
          display:flex; align-items:center; gap:12px;
          padding:10px 12px; border-radius:14px; cursor:pointer;
          transition:background 0.18s, transform 0.18s;
          position:relative;
        }
        .conv-item:hover { background:${LIGHT}; }
        .conv-item.is-active { background:rgba(0,42,128,0.07); }
        .conv-item.is-active::before {
          content:''; position:absolute; left:0; top:20%; bottom:20%;
          width:3px; border-radius:2px; background:${ORANGE};
        }
        .conv-body { flex:1; min-width:0; }
        .conv-name {
          font-family:'Sora',sans-serif; font-size:13.5px; font-weight:600;
          color:${BLUE}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .conv-preview {
          font-size:12px; color:#8898B0; margin-top:2px;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .conv-meta { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
        .conv-time { font-size:10.5px; color:#B0BEC5; }
        .unread-dot { width:8px; height:8px; border-radius:50%; background:${ORANGE}; }

        /* ── CHAT PANEL ── */
        .chat-panel {
          flex:1; display:flex; flex-direction:column;
          background:${LIGHT}; min-width:0;
          transition:transform 0.32s cubic-bezier(.4,0,.2,1);
        }
        @media(max-width:767px){
          .chat-panel { position:absolute; inset:0; z-index:3; border-radius:20px; }
          .chat-panel.hidden-mobile { transform:translateX(100%); pointer-events:none; }
        }

        /* ── CHAT HEADER ── */
        .chat-header {
          padding:14px 18px; background:#fff;
          border-bottom:1px solid #EEF1F8;
          display:flex; align-items:center; gap:12px;
          min-height:64px;
        }
        .back-btn {
          display:flex; align-items:center; justify-content:center;
          width:34px; height:34px; border-radius:10px;
          background:${LIGHT}; border:none; cursor:pointer;
          color:${BLUE}; transition:background 0.15s;
          flex-shrink:0;
        }
        .back-btn:hover { background:#E2E8F0; }
        @media(min-width:768px){ .back-btn{ display:none; } }
        .chat-header-info { flex:1; min-width:0; }
        .chat-header-name {
          font-family:'Sora',sans-serif; font-size:14px; font-weight:700; color:${BLUE};
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .chat-header-status { font-size:11px; color:#63B07A; margin-top:1px; }

        /* ── MESSAGES AREA ── */
        .messages-area {
          flex:1; overflow-y:auto; padding:20px 16px;
          display:flex; flex-direction:column; gap:2px;
        }

        .date-divider {
          text-align:center; margin:14px 0 10px;
        }
        .date-chip {
          display:inline-block; font-size:11px; color:#8898B0;
          background:#fff; padding:4px 12px; border-radius:100px;
          border:1px solid #E8EEF8;
          text-transform:capitalize;
        }

        .bubble-row { display:flex; margin-bottom:4px; }
        .bubble-row.mine { justify-content:flex-end; }
        .bubble-row.theirs { justify-content:flex-start; }

        .bubble {
          max-width:72%; padding:10px 14px; border-radius:18px;
          font-size:13.5px; line-height:1.6; position:relative;
          word-break:break-word;
        }
        .bubble.mine {
          background:${BLUE}; color:#fff;
          border-bottom-right-radius:5px;
          box-shadow:0 2px 10px rgba(0,42,128,0.18);
        }
        .bubble.theirs {
          background:#fff; color:#1F2937;
          border-bottom-left-radius:5px;
          box-shadow:0 2px 8px rgba(0,0,0,0.07);
        }
        .bubble-time {
          font-size:10px; margin-top:5px;
          display:block; text-align:right;
        }
        .bubble.mine .bubble-time { color:rgba(255,255,255,0.55); }
        .bubble.theirs .bubble-time { color:#B0BEC5; }

        /* bubble consecutive (group) */
        .bubble-row.mine + .bubble-row.mine .bubble { border-top-right-radius:6px; }
        .bubble-row.theirs + .bubble-row.theirs .bubble { border-top-left-radius:6px; }

        /* ── EMPTY STATE ── */
        .empty-state {
          flex:1; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:14px;
          color:#B0BEC5; text-align:center; padding:24px;
        }
        .empty-icon { font-size:48px; opacity:0.5; }
        .empty-title { font-family:'Sora',sans-serif; font-size:15px; font-weight:600; color:#8898B0; }
        .empty-sub { font-size:13px; color:#B0BEC5; max-width:220px; line-height:1.6; }

        /* ── INPUT ── */
        .input-bar {
          padding:12px 14px; background:#fff;
          border-top:1px solid #EEF1F8;
          display:flex; align-items:flex-end; gap:10px;
        }
        .input-wrap {
          flex:1; background:${LIGHT}; border-radius:14px;
          border:1.5px solid transparent;
          display:flex; align-items:center; padding:0 14px;
          transition:border-color 0.2s;
          min-height:44px;
        }
        .input-wrap:focus-within { border-color:rgba(0,42,128,0.25); background:#fff; }
        .msg-input {
          flex:1; background:transparent; border:none; outline:none;
          font-size:14px; font-family:'DM Sans',sans-serif;
          color:#1F2937; resize:none; max-height:120px;
          padding:10px 0; line-height:1.5;
        }
        .msg-input::placeholder { color:#B0BEC5; }
        .send-btn {
          width:44px; height:44px; border-radius:12px;
          background:${BLUE}; border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          color:#fff; flex-shrink:0;
          transition:background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow:0 3px 12px rgba(0,42,128,0.25);
        }
        .send-btn:hover:not(:disabled) { background:${ORANGE}; transform:translateY(-1px); box-shadow:0 5px 16px rgba(255,80,0,0.35); }
        .send-btn:disabled { opacity:0.45; cursor:not-allowed; }

        /* ── RELATIVE CONTAINER for mobile ── */
        @media(max-width:767px){
          .msg-root { position:relative; }
        }
      `}</style>

      <div className="msg-root">

        {/* ══ SIDEBAR ══ */}
        <div className={`sidebar ${showChat ? "hidden-mobile" : ""}`}>
          <div className="sidebar-header">
            <span className="sidebar-title">Mensajes</span>
            {conversaciones.length > 0 && (
              <span className="sidebar-count">{conversaciones.length}</span>
            )}
          </div>

          <div className="conv-list">
            {conversaciones.length === 0 && (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "#B0BEC5", fontSize: 13 }}>
                No hay conversaciones aún.
              </div>
            )}

            {conversaciones.map((conv) => {
              const otroId = getOtroId(conv);
              const otro = usuarios[otroId];
              const isActive = activa === conv.id;
              const time = conv.updatedAt?.toDate ? relativeTime(conv.updatedAt.toDate()) : "";

              return (
                <div
                  key={conv.id}
                  className={`conv-item ${isActive ? "is-active" : ""}`}
                  onClick={() => selectConv(conv.id)}
                >
                  <Avatar name={otro?.nombre || "U"} size={42} />
                  <div className="conv-body">
                    <div className="conv-name">{otro?.nombre || "Usuario"}</div>
                    <div className="conv-preview">{conv.ultimoMensaje || "Sin mensajes"}</div>
                  </div>
                  <div className="conv-meta">
                    <span className="conv-time">{time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ CHAT PANEL ══ */}
        <div className={`chat-panel ${!showChat && window?.innerWidth < 768 ? "hidden-mobile" : ""}`}
          style={typeof window !== "undefined" && window.innerWidth >= 768
            ? {} // always visible on desktop
            : { transform: showChat ? "translateX(0)" : "translateX(100%)" }
          }
        >
          {!activa ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <div className="empty-title">Tus mensajes</div>
              <div className="empty-sub">Selecciona una conversación para comenzar a chatear.</div>
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div className="chat-header">
                <button className="back-btn" onClick={goBack} aria-label="Volver">
                  <BackIcon />
                </button>
                <Avatar name={activaUser?.nombre || "U"} size={38} />
                <div className="chat-header-info">
                  <div className="chat-header-name">{activaUser?.nombre || "Chat"}</div>
                </div>
              </div>

              {/* MESSAGES */}
              <div className="messages-area">
                {grouped.length === 0 && (
                  <div style={{ textAlign: "center", color: "#B0BEC5", fontSize: 13, marginTop: 24 }}>
                    Aún no hay mensajes. ¡Empieza la conversación!
                  </div>
                )}

                {grouped.map((group, gi) => (
                  <div key={gi}>
                    <div className="date-divider">
                      <span className="date-chip">{group.label}</span>
                    </div>
                    {group.msgs.map((msg) => {
                      const esMio = msg.de === user.uid;
                      const time = msg.fecha?.toDate?.().toLocaleTimeString("es-PE", {
                        hour: "2-digit", minute: "2-digit",
                      });
                      return (
                        <div key={msg.id} className={`bubble-row ${esMio ? "mine" : "theirs"}`}>
                          <div className={`bubble ${esMio ? "mine" : "theirs"}`}>
                            <span style={{ whiteSpace: "pre-wrap" }}>{msg.mensaje}</span>
                            <span className="bubble-time">{time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* INPUT */}
              <div className="input-bar">
                <div className="input-wrap">
                  <textarea
                    ref={inputRef}
                    className="msg-input"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Escribe un mensaje..."
                    rows={1}
              
                  />
                </div>
                <button
                  className="send-btn"
                  onClick={enviarMensaje}
                  disabled={!texto.trim() || sending}
                  aria-label="Enviar mensaje"
                >
                  <SendIcon />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
