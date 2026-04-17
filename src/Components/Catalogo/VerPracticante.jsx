import { X } from "lucide-react";
import VerPerfil from "../DasboardPracticante/VerPerfil";

export default function VerPracticante({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-xl">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
        >
          <X size={18} />
        </button>

        <VerPerfil />
      </div>
    </div>
  );
}