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

export default function Mensajes() {
  const { user } = useAuth();

  const [conversaciones, setConversaciones] = useState([]);
  const [activa, setActiva] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const [usuarios, setUsuarios] = useState({});

  const bottomRef = useRef(null);

  // 🔥 CONVERSACIONES
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "conversaciones"),
      where("participantes", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setConversaciones(data);

      // traer usuarios
      data.forEach(async (conv) => {
        const otro = conv.participantes.find(p => p !== user.uid);

        if (!usuarios[otro]) {
          const ref = doc(db, "usuariosbcp", otro);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            setUsuarios(prev => ({
              ...prev,
              [otro]: snap.data()
            }));
          }
        }
      });
    });

    return () => unsub();
  }, [user]);

  // 🔥 MENSAJES
  useEffect(() => {
    if (!activa) return;

    // 👉 limpiar mensajes al cambiar usuario
    setMensajes([]);

    const q = query(
      collection(db, "mensajes"),
      where("conversacionId", "==", activa),
      orderBy("fecha", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setMensajes(data);
    });

    return () => unsub();
  }, [activa]);

  // 🔥 ENVIAR
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

  return (
  <div className="mt-6 mx-4 h-[calc(100vh-100px)] flex bg-white rounded-2xl overflow-hidden">

    {/* 🟦 SIDEBAR */}
    <div className="w-80  flex flex-col">

      <div className="px-5 py-4 text-sm font-semibold text-gray-700">
        Mensajes
      </div>

      <div className="flex-1 overflow-y-auto">

        {conversaciones.map((conv) => {
          const otroId = getOtroId(conv);
          const otro = usuarios[otroId];
          const active = activa === conv.id;

          return (
            <div
              key={conv.id}
              onClick={() => setActiva(conv.id)}
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

    {/* 🟩 CHAT */}
    <div className="flex-1 flex flex-col bg-[#FAFBFC]">

      {!activa ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Selecciona una conversación
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="px-6 py-4 text-sm font-semibold text-gray-700 bg-white">
            {
              usuarios[
                getOtroId(conversaciones.find(c => c.id === activa) || {})
              ]?.nombre || "Chat"
            }
          </div>

          {/* MENSAJES */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">

            {mensajes.map((msg) => {
              const esMio = msg.de === user.uid;

              return (
                <div
                  key={msg.id}
                  className={`flex ${esMio ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[70%] px-4 py-2 rounded-2xl text-sm"
                    style={{
                      background: esMio ? "#003087" : "#FFFFFF",
                      color: esMio ? "white" : "#1F2937"
                    }}
                  >
                    <div className="whitespace-pre-wrap">
                      {msg.mensaje}
                    </div>

                    <div className="text-[10px] mt-1 opacity-60 text-right">
                      {msg.fecha?.toDate?.().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="p-4 bg-white flex gap-3">

            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribir mensaje..."
              className="flex-1 text-sm px-4 py-2.5 rounded-xl bg-gray-100 focus:outline-none"
            />

            <button
              onClick={enviarMensaje}
              className="px-5 py-2.5 text-sm text-white rounded-xl"
              style={{ background: "#003087" }}
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