import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../Lib/firebase.js";

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AuthContext = createContext();

const SESSION_KEY = "bcp_session_uid";

const getAreas = async () => {
  const snapshot = await getDocs(collection(db, "areas"));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};
const getCarreras = async () => {
  const snapshot = await getDocs(collection(db, "carreras"));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};
const getDisponibilidad = async () => {
  const snapshot = await getDocs(collection(db, "disponibilidad"));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserById = async (uid) => {
    const docRef = doc(db, "usuariosbcp", uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { uid: snap.id, ...snap.data() };
  };

  useEffect(() => {
    const restore = async () => {
      try {
        const savedUid = localStorage.getItem(SESSION_KEY);
        if (!savedUid) return;

        const userData = await fetchUserById(savedUid);
        if (userData) {
          setUser(userData);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      } catch (error) {
        console.error("Error restaurando sesión:", error);
        localStorage.removeItem(SESSION_KEY);
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  const login = async (correo, contraseña) => {
    const q = query(
      collection(db, "usuariosbcp"),
      where("correo", "==", correo),
      where("contraseña", "==", contraseña)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error("Credenciales incorrectas");

    const docData = snapshot.docs[0];
    const userData = { uid: docData.id, ...docData.data() };

    localStorage.setItem(SESSION_KEY, docData.id);
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    let fotoURL = "";
    let cvURL = "";
    const storage = getStorage();

    if (data.foto) {
      const storageRef = ref(storage, `usuarios/${Date.now()}_${data.foto.name}`);
      await uploadBytes(storageRef, data.foto);
      fotoURL = await getDownloadURL(storageRef);
    }
    if (data.cv) {
      const storageRef = ref(storage, `cv/${Date.now()}_${data.cv.name}`);
      await uploadBytes(storageRef, data.cv);
      cvURL = await getDownloadURL(storageRef);
    }

    const nuevoUsuario = {
      ...data,
      foto: fotoURL,
      cv: cvURL,
      rol: "usuario",
      experiencia: data.experiencia || [],
      cursos: data.cursos || [],
      capacitaciones: data.capacitaciones || [],
      fechaRegistro: new Date(),
      universidad: data.universidad || "",
      ciclo: data.ciclo || "",
      descripcion: data.descripcion || "",
      motivaciones: data.motivaciones || [],
      areaId: data.areaId,
      carreraId: data.carreraId,
      linkedin: data.linkedin || "",
      github: data.github || ""
    };

    const docRef = await addDoc(collection(db, "usuariosbcp"), nuevoUsuario);
    const userData = { uid: docRef.id, ...nuevoUsuario };

    localStorage.setItem(SESSION_KEY, docRef.id);
    setUser(userData);
    return userData;
  };

  const updateUser = async (id, newData) => {
    if (!id) return;
    const refDoc = doc(db, "usuariosbcp", id);
    const storage = getStorage();
    let fotoURL = newData.foto;
    let cvURL = newData.cv;

    if (newData.foto instanceof File) {
      const storageRef = ref(storage, `usuarios/${Date.now()}_${newData.foto.name}`);
      await uploadBytes(storageRef, newData.foto);
      fotoURL = await getDownloadURL(storageRef);
    }
    if (newData.cv instanceof File) {
      const storageRef = ref(storage, `cv/${Date.now()}_${newData.cv.name}`);
      await uploadBytes(storageRef, newData.cv);
      cvURL = await getDownloadURL(storageRef);
    }

    const dataToSave = { ...newData, foto: fotoURL || "", cv: cvURL || "" };
    await updateDoc(refDoc, dataToSave);
    setUser((prev) => ({ ...prev, ...dataToSave }));
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const fetchUserFromDB = async (email) => {
    const q = query(collection(db, "usuariosbcp"), where("correo", "==", email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return { uid: d.id, ...d.data() };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateUser,
        logout,
        fetchUserFromDB,
        getAreas,
        getCarreras,
        getDisponibilidad
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
