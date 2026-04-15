import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../Lib/firebase.js";
import { 
  collection, query, where, getDocs, addDoc, updateDoc, doc 
} from "firebase/firestore";

import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  // 🔁 ESCUCHAR SESIÓN FIREBASE (CLAVE 🔥)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      
      if (firebaseUser) {
        // Usuario logueado con Google
        setUser({
          nombre: firebaseUser.displayName,
          correo: firebaseUser.email,
          foto: firebaseUser.photoURL,
        });
      } else {
        // No hay sesión
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔐 LOGIN NORMAL
  const login = async (correo, contraseña) => {
    const q = query(
      collection(db, "usuariosbcp"),
      where("correo", "==", correo),
      where("contraseña", "==", contraseña)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) throw new Error("Credenciales incorrectas");

    const docData = snapshot.docs[0];

    setUser({ id: docData.id, ...docData.data() });

    return docData.data();
  };

  // 🟢 REGISTRO
  const register = async (data) => {
    const nuevoUsuario = {
      ...data,
      rol: "usuario",
      fechaRegistro: new Date(),
    };

    const docRef = await addDoc(collection(db, "usuariosbcp"), nuevoUsuario);

    setUser({ id: docRef.id, ...nuevoUsuario });
  };

  // ✏️ ACTUALIZAR PERFIL
  const updateUser = async (id, newData) => {
    const ref = doc(db, "usuariosbcp", id);
    await updateDoc(ref, newData);

    setUser((prev) => ({ ...prev, ...newData }));
  };

  // 🔵 GOOGLE
  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);
    const googleUser = result.user;

    setUser({
      nombre: googleUser.displayName,
      correo: googleUser.email,
      foto: googleUser.photoURL,
    });

    return googleUser;
  };

  // 🔴 LOGOUT (ESTO TE FALTABA)
  const logout = async () => {
    try {
      await signOut(auth); // 🔥 cierra sesión Firebase
      setUser(null);       // 🔥 limpia estado local
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ user, loading, login, register, updateUser, loginGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}