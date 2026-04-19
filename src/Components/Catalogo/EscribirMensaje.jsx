import { useState, useRef } from "react";
import {
  collection, addDoc, serverTimestamp, doc, setDoc
} from "firebase/firestore";
import { db } from "../../Lib/firebase";
import { useAuth } from "../../Context/AuthContext";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Send, X } from "lucide-react";

const BLUE = "#002A80";

export default function EscribirMensaje({ open, onClose, receptorId }) {
  const { user } = useAuth();
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const editorRef = useRef(null);

  const limpiarHTML = (html) => html.replace(/<[^>]*>?/gm, "").trim();

  if (!open) return null;

  const aplicarFormato = (tipo) => {
    editorRef.current?.focus();
    const cmds = {
      bold: () => document.execCommand("bold"),
      italic: () => document.execCommand("italic"),
      underline: () => document.execCommand("underline"),
      left: () => document.execCommand("justifyLeft"),
      center: () => document.execCommand("justifyCenter"),
      right: () => document.execCommand("justifyRight"),
      list: () => document.execCommand("insertUnorderedList"),
    };
    cmds[tipo]?.();
  };

  const enviarMensaje = async () => {
    const contenido = editorRef.current.innerHTML;
    if (!limpiarHTML(contenido) || !user?.uid || !receptorId) return;
    setEnviando(true);
    try {
      const participantes = [user.uid, receptorId];
      const conversacionId = participantes.sort().join("_");
      await setDoc(doc(db, "conversaciones", conversacionId), {
        participantes,
        ultimoMensaje: contenido,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      await addDoc(collection(db, "mensajes"), {
        conversacionId,
        de: user.uid,
        mensaje: contenido,
        fecha: serverTimestamp(),
        leido: false,
      });
      editorRef.current.innerHTML = "";
      setTexto("");
      setEnviado(true);
      setTimeout(() => { setEnviado(false); onClose(); }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  return (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">

    {/* BACKDROP */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    />

    {/* MODAL */}
    <div className="
      relative
      w-[92%] sm:w-full sm:max-w-2xl
      max-h-[85vh]
      bg-white
      rounded-2xl
      shadow-xl
      flex flex-col
      overflow-hidden
    ">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700">
          Redactar mensaje
        </h2>

        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X size={16} />
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="flex items-center gap-1 px-3 sm:px-4 py-2  overflow-x-auto">
        <ToolbarButton icon={<Bold size={14} />} onClick={() => aplicarFormato("bold")} />
        <ToolbarButton icon={<Italic size={14} />} onClick={() => aplicarFormato("italic")} />
        <ToolbarButton icon={<Underline size={14} />} onClick={() => aplicarFormato("underline")} />

        <div className="w-px h-4 bg-gray-300 mx-1" />

        <ToolbarButton icon={<AlignLeft size={14} />} onClick={() => aplicarFormato("left")} />
        <ToolbarButton icon={<AlignCenter size={14} />} onClick={() => aplicarFormato("center")} />
        <ToolbarButton icon={<AlignRight size={14} />} onClick={() => aplicarFormato("right")} />

        <div className="w-px h-4 bg-gray-300 mx-1" />

        <ToolbarButton icon={<List size={14} />} onClick={() => aplicarFormato("list")} />
      </div>

      {/* EDITOR */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
        <div className="relative">
          {!texto && (
            <span className="absolute top-3 left-4 text-gray-400 text-sm pointer-events-none">
              Escriba un mensaje claro y profesional...
            </span>
          )}

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setTexto(e.currentTarget.innerHTML)}
            className="
              w-full
              min-h-[180px] sm:min-h-[220px]
              text-sm
              rounded-xl
              p-3 sm:p-4
              focus:outline-none
              bg-gray-50
              border border-gray-200
            "
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3  gap-3">

        <div className="text-xs sm:text-sm text-green-600 font-medium">
          {enviado && "✓ Mensaje enviado"}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancelar
          </button>

          <button
            onClick={enviarMensaje}
            disabled={enviando}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 text-sm text-white rounded-lg disabled:opacity-60"
            style={{ background: BLUE }}
          >
            <Send size={13} />
            <span>{enviando ? "Enviando..." : "Enviar"}</span>
          </button>
        </div>

      </div>

    </div>
  </div>
);
}

function ToolbarButton({ icon, onClick }) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="p-1.5 sm:p-2 rounded hover:bg-gray-200 transition-colors shrink-0"
    >
      {icon}
    </button>
  );
}
