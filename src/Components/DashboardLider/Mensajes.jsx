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
import "./Mensajes.css";

function Avatar({ name = "", size = 38 }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials || "?"}
    </div>
  );
}

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

function relativeTime(date) {
  if (!date) return "";
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return date.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
}

export default function Mensajes() {
  const { user } = useAuth();

  const [conversaciones, setConversaciones] = useState([]);
  const [activa, setActiva] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const [usuarios, setUsuarios] = useState({});
  const [showChat, setShowChat] = useState(false);
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

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
      data.forEach((conv) => {
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

  const selectConv = (id) => {
    setActiva(id);
    setShowChat(true);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const goBack = () => setShowChat(false);

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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  const getOtroId = (conv) => conv?.participantes?.find((p) => p !== user.uid);
  const activaConv = conversaciones.find((c) => c.id === activa);
  const activaUser = activaConv ? usuarios[getOtroId(activaConv)] : null;

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

  const chatHidden = typeof window !== "undefined" && window.innerWidth < 768 && !showChat;

  return (
    <div className="msg-root">

      <div className={`sidebar ${showChat ? "hidden-mobile" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Mensajes</span>
          {conversaciones.length > 0 && (
            <span className="sidebar-count">{conversaciones.length}</span>
          )}
        </div>

        <div className="conv-list">
          {conversaciones.length === 0 && (
            <p className="conv-empty">No hay conversaciones aún.</p>
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

      <div className={`chat-panel ${chatHidden ? "hidden-mobile" : ""}`}>

        {!activa ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <div className="empty-title">Tus mensajes</div>
            <div className="empty-sub">Selecciona una conversación para comenzar a chatear.</div>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <button className="back-btn" onClick={goBack} aria-label="Volver">
                <BackIcon />
              </button>
              <Avatar name={activaUser?.nombre || "U"} size={38} />
              <div className="chat-header-info">
                <div className="chat-header-name">{activaUser?.nombre || "Chat"}</div>
              </div>
            </div>

            <div className="messages-area">
              {grouped.length === 0 && (
                <p className="messages-empty">Aún no hay mensajes. ¡Empieza la conversación!</p>
              )}

              {grouped.map((group, gi) => (
                <div key={gi}>
                  <div className="date-divider">
                    <span className="date-chip">{group.label}</span>
                  </div>

                  {group.msgs.map((msg) => {
                    const esMio = msg.de === user.uid;
                    const time = msg.fecha?.toDate?.().toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
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
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
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
  );
}
