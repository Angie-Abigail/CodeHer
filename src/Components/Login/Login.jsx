import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo.png"

export default function Login({ onClose, irARegistro }) {
  const { login, loginGoogle } = useAuth();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await login(correo, password);
      onClose();
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  };

  const handleGoogle = async () => {
    try {
      await loginGoogle();
      onClose();
    } catch (err) {
      setError("Error con Google");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* LOGO */}
        <div className="bg-[#002A80] -mx-8 -mt-8 mb-4 p-1 rounded-t-2xl flex justify-center">
  <img src={logo} alt="logo" className="h-10 w-auto object-contain" />
</div>

        <h3 className="text-center text-xl font-semibold text-gray-900">
          Iniciar sesión
        </h3>

        <p className="text-center text-sm text-gray-500 mb-6">
          Bienvenido de nuevo. Ingresa para continuar.
        </p>

        {/* INPUTS */}
        <div className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-700 font-medium">
              Correo electrónico
            </label>

            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 
                           text-gray-900 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-900"
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-700 font-medium">
              Contraseña
            </label>

            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 
                           text-gray-900 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-900"
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* 👁️ OJITO */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 text-white py-2 rounded-lg mt-6 hover:bg-orange-400 transition"
        >
          Iniciar sesión
        </button>

        {/* REGISTER */}
        <p className="text-center text-sm mt-4 text-gray-600">
          ¿No tienes cuenta?{" "}
          <span
            onClick={irARegistro}
            className="text-orange-500 cursor-pointer"
          >
            Regístrate
          </span>
        </p>

      </div>
    </div>
  );
}