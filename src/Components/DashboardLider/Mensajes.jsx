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
  getDoc
} from "firebase/firestore";
import { db } from "../../Lib/firebase";
import { useAuth } from "../../Context/AuthContext";
import { ArrowLeft } from "lucide-react";

export default function Mensajes() {
  const { user } = useAuth();

  const [conversaciones, setConversaciones] = useState([]);
  const [activa, setActiva] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const [usuarios, setUsuarios] = useState({});
  const [mobileView, setMobileView] = useState("list"); // list | chat

  const bottomRef = useRef(null);

  /* ───────── CONVERSACIONES ───────── */
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "conversaciones"),
      where("participantes", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));

      setConversaciones(data);

      data.forEach(async (conv) => {
        const otro = conv.participantes.find(p => p !== user.uid);

        if (!usuarios[otro]) {
          const ref = doc(db, "usuariosbcp", otro);
          const snapUser = await getDoc(ref);

          if (snapUser.exists()) {
            setUsuarios(prev => ({
              ...prev,
              [otro]: snapUser.data()
            }));
          }
        }
      });
    });

    return () => unsub();
  }, [user]);

  /* ───────── MENSAJES ───────── */
  useEffect(() => {
    if (!activa) return;

    setMensajes([]);

    const q = query(
      collection(db, "mensajes"),
      where("conversacionId", "==", activa),
      orderBy("fecha", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMensajes(snap.docs.map(d => ({ id: d.id, ...d.data() })));

      
    });

    return () => unsub();
  }, [activa]);

  /* ───────── ENVIAR ───────── */
  const enviarMensaje = async () => {
    if (!texto.trim() || !activa) return;

    const participantes = activa.split("_");

    await setDoc(
      doc(db, "conversaciones", activa),
      {
        participantes,
        ultimoMensaje: texto,
        updatedAt: serverTimestamp(),
      },
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
  };

  const getOtroId = (conv) =>
    conv.participantes.find(p => p !== user.uid);

  /* ───────── UI ───────── */
  return (
  <div className="mt-6 mx-2 sm:mx-4 h-[calc(100vh-100px)] flex bg-white rounded-2xl overflow-hidden">

    {/* ───────── SIDEBAR / LISTA ───────── */}
    <div
      className={`
        w-full sm:w-80 flex flex-col
        ${mobileView === "chat" ? "hidden sm:flex" : "flex"}
      `}
    >
      <div className="px-5 py-4 text-sm font-semibold text-gray-700">
                {/* HEADER */}
        <div className="mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#003087]">
            Mensajes
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Practicantes que haz contactado
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">

        {conversaciones.map((conv) => {
          const otroId = getOtroId(conv);
          const otro = usuarios[otroId];
          const active = activa === conv.id;

          return (
            <div
              key={conv.id}
              onClick={() => {
                setActiva(conv.id);
                setMobileView("chat"); // abre chat en móvil
              }}
              className={`px-5 py-3 cursor-pointer transition-all rounded-xl mx-2
                ${active ? "bg-blue-100" : "hover:bg-gray-100"}
              `}
            >
              <p className="text-sm font-semibold text-gray-800">
                {otro?.nombre || "Usuario"}
              </p>

              <p className="text-xs text-gray-500 truncate mt-1">
                {conv.ultimoMensaje}
              </p>
            </div>
          );
        })}

      </div>
    </div>

    {/* ───────── CHAT ───────── */}
    <div
      className={`
        flex-1 flex flex-col bg-[#FAFBFC]
        ${mobileView === "list" ? "hidden sm:flex" : "flex"}
      `}
    >

      {!activa ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Selecciona una conversación
        </div>
      ) : (
        <>
          {/* HEADER CHAT */}
          <div className="px-4 sm:px-6 py-3 bg-white flex items-center gap-3">

            {/* 🔙 BACK MOBILE */}
            <button
              className="sm:hidden text-gray-700 font-bold"
              onClick={() => setMobileView("list")}
            >
              ←
            </button>

            <p className="text-sm font-semibold text-gray-700">
              {usuarios[
                getOtroId(conversaciones.find(c => c.id === activa) || {})
              ]?.nombre || "Chat"}
            </p>
          </div>

          {/* MENSAJES */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3">

            {mensajes.map((msg) => {
              const esMio = msg.de === user.uid;

              return (
                <div
                  key={msg.id}
                  className={`flex ${esMio ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[80%] sm:max-w-[70%] px-4 py-2 rounded-2xl text-sm"
                    style={{
                      background: esMio ? "#003087" : "#FFFFFF",
                      color: esMio ? "white" : "#1F2937"
                    }}
                  >
                    {msg.mensaje}
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 sm:p-4 bg-white flex gap-2 sm:gap-3">

            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribir mensaje..."
              className="flex-1 text-sm px-4 py-2.5 rounded-xl bg-gray-100 focus:outline-none"
            />

            <button
              onClick={enviarMensaje}
              className="px-4 sm:px-5 py-2.5 text-sm text-white rounded-xl bg-[#003087]"
            >
              Enviar
            </button>

          </div>
        </>
      )}
    </div>

  </div>
);
}