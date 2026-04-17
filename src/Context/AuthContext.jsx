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
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  // 🔥 FUNCIÓN CENTRAL: traer usuario desde Firestore
  const fetchUserFromDB = async (email) => {
    const q = query(
      collection(db, "usuariosbcp"),
      where("correo", "==", email)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docData = snapshot.docs[0];

    return {
      id: docData.id,
      ...docData.data()
    };
  };

  const getAreas = async () => {
  try {
    const snapshot = await getDocs(collection(db, "areas"));

    return snapshot.docs.map(doc => ({
      id: doc.id,
      nombre: doc.data().nombre
    }));
  } catch (error) {
    console.error("Error cargando áreas:", error);
    return [];
  }
};

const getCarreras = async () => {
  try {
    const snapshot = await getDocs(collection(db, "carreras"));

    return snapshot.docs.map(doc => ({
      id: doc.id,
      nombre: doc.data().nombre
    }));
  } catch (error) {
    console.error("Error cargando carreras:", error);
    return [];
  }
};


const getDisponibilidad = async () => {
  try {
    const snapshot = await getDocs(collection(db, "disponibilidad"));

    return snapshot.docs.map(doc => ({
      id: doc.id,
      nombre: doc.data().nombre
    }));
  } catch (error) {
    console.error("Error cargando disponibilidad:", error);
    return [];
  }
};



  // 🔁 SESIÓN FIREBASE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const dbUser = await fetchUserFromDB(firebaseUser.email);

      if (dbUser) {
        setUser(dbUser);
      } else {
        // 🔥 si no existe en Firestore, lo creamos
        const newUserRef = await addDoc(collection(db, "usuariosbcp"), {
          nombre: firebaseUser.displayName,
          correo: firebaseUser.email,
          foto: firebaseUser.photoURL,
          rol: "usuario",
          experiencia: [],
          cursos: [],
          voluntariado: [],
          capacitaciones: [],
          programas: [],
          motivaciones: [],
          descripcion: []
        });

        setUser({
          id: newUserRef.id,
          nombre: firebaseUser.displayName,
          correo: firebaseUser.email,
          foto: firebaseUser.photoURL,
          rol: "usuario"
        });
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

    const userData = {
      id: docData.id,
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
  cv: cvURL,
linkedin: data.linkedin || "",
github: data.github || "",
};

    const docRef = await addDoc(collection(db, "usuariosbcp"), nuevoUsuario);

    setUser({
      id: docRef.id,
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

  // 🔥 Subir nueva foto si es File
  if (newData.foto instanceof File) {
    const storageRef = ref(storage, `usuarios/${Date.now()}_${newData.foto.name}`);
    await uploadBytes(storageRef, newData.foto);
    fotoURL = await getDownloadURL(storageRef);
  }

  // 🔥 Subir nuevo CV si es File
  if (newData.cv instanceof File) {
    const storageRef = ref(storage, `cv/${Date.now()}_${newData.cv.name}`);
    await uploadBytes(storageRef, newData.cv);
    cvURL = await getDownloadURL(storageRef);
  }

  const dataToSave = {
    ...newData,
    foto: fotoURL || "",
    cv: cvURL || "",
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
        voluntariado: [],
        capacitaciones: [],
        programas: [],
        motivaciones: [],
        descripcion: []
      });

      setUser({
        id: newUserRef.id,
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
    getAreas,
    getCarreras,
    getDisponibilidad
  }}>
      {children}
    </AuthContext.Provider>
  );
}