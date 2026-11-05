"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const Ctx = createContext({ user: null, loading: true, refresh: async () => {} });
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load(fbUser) {
    if (!fbUser) {
      setUser(null);
      setLoading(false);
      return;
    }
    const snap = await getDoc(doc(db, "users", fbUser.uid));
    const data = snap.data();
    setUser(data && data.active ? { uid: fbUser.uid, ...data } : null);
    setLoading(false);
  }

  useEffect(() => onAuthStateChanged(auth, load), []);

  return (
    <Ctx.Provider value={{ user, loading, refresh: () => load(auth.currentUser) }}>
      {children}
    </Ctx.Provider>
  );
}