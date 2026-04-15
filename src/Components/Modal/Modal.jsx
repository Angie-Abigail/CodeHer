// ✅ src/Componentes/Modal.jsx
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, children }) {


    // Bloquear scroll cuando el modal esté abierto
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    if (!isOpen) return null;

   
    return (
        <div 
            className={`fixed inset-0 flex justify-center items-center z-999 ${overlayClass}`}
            onClick={onClose}
        >
            <div 
                className={`${modalBg} rounded-xl p-6 w-full max-w-md shadow-xl relative animate-fadeIn`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón de cerrar */}
                <button 
                    className={`absolute top-3 right-3 text-xl ${btnClose}`}
                    onClick={onClose}
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
}
