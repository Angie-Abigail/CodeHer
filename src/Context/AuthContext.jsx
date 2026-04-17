import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../Lib/firebase.js";

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

const AuthContext = createContext();
const getAreas = async () => {
  const snapshot = await getDocs(collection(db, "areas"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

const getCarreras = async () => {
  const snapshot = await getDocs(collection(db, "carreras"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

const getDisponibilidad = async () => {
  const snapshot = await getDocs(collection(db, "disponibilidad"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  // 🔥 TRAER USUARIO DESDE FIRESTORE
  const fetchUserFromDB = async (email) => {
    const q = query(
      collection(db, "usuariosbcp"),
      where("correo", "==", email)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docData = snapshot.docs[0];

    return {
      uid: docData.id,
      ...docData.data()
    };
  };

  // 🔁 SESIÓN PERSISTENTE (FIX PRINCIPAL)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);

        if (!firebaseUser) {
          setUser(null);
          return;
        }

        const dbUser = await fetchUserFromDB(firebaseUser.email);

        // ✅ SI EXISTE EN FIRESTORE
        if (dbUser) {
          setUser(dbUser);
        } 
        // ✅ FALLBACK SI NO EXISTE O FALLA FIRESTORE
        else {
          setUser({
            uid: firebaseUser.uid,
            nombre: firebaseUser.displayName,
            correo: firebaseUser.email,
            foto: firebaseUser.photoURL,
            rol: "usuario"
          });
        }

      } catch (error) {
        console.error("Error cargando usuario:", error);

        // 🔥 FALLBACK DE EMERGENCIA
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            nombre: firebaseUser.displayName,
            correo: firebaseUser.email,
            foto: firebaseUser.photoURL,
            rol: "usuario"
          });
        } else {
          setUser(null);
        }

      } finally {
        setLoading(false);
      }
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

    const userData = {
      uid: docData.id,
      ...docData.data()
    };

    setUser(userData);
    return userData;
  };

  // 🟢 REGISTER
  const register = async (data) => {
    let fotoURL = "";
    let cvURL = "";

    if (data.foto) {
      const storage = getStorage();
      const storageRef = ref(storage, `usuarios/${Date.now()}_${data.foto.name}`);

      await uploadBytes(storageRef, data.foto);
      fotoURL = await getDownloadURL(storageRef);
    }

    if (data.cv) {
      const storage = getStorage();
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

    setUser({
      uid: docRef.id,
      ...nuevoUsuario
    });
  };

  // ✏️ UPDATE
  const updateUser = async (id, newData) => {
    if (!id) return;

    const refDoc = doc(db, "usuariosbcp", id);

    let fotoURL = newData.foto;
    let cvURL = newData.cv;

    const storage = getStorage();

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

    const dataToSave = {
      ...newData,
      foto: fotoURL || "",
      cv: cvURL || ""
    };

    await updateDoc(refDoc, dataToSave);

    setUser((prev) => ({
      ...prev,
      ...dataToSave
    }));
  };

  // 🔵 GOOGLE LOGIN
  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);
    const googleUser = result.user;

    const dbUser = await fetchUserFromDB(googleUser.email);

    if (dbUser) {
      setUser(dbUser);
    } else {
      const newUserRef = await addDoc(collection(db, "usuariosbcp"), {
        nombre: googleUser.displayName,
        correo: googleUser.email,
        foto: googleUser.photoURL,
        rol: "usuario",
        experiencia: [],
        cursos: [],
        capacitaciones: [],
        motivaciones: [],
        descripcion: []
      });

      setUser({
        uid: newUserRef.id,
        nombre: googleUser.displayName,
        correo: googleUser.email,
        foto: googleUser.photoURL,
        rol: "usuario"
      });
    }
  };

  // 🔴 LOGOUT
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateUser,
        loginGoogle,
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