import { signInWithEmailAndPassword, signOut, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  if (!snap.exists() || !snap.data().active) {
    await signOut(auth);
    throw new Error("Account inactive hai ya exist nahi karta");
  }
  return { uid: cred.user.uid, ...snap.data() };
}

export const logout = () => signOut(auth);

export async function changeFirstPassword(newPassword) {
  await updatePassword(auth.currentUser, newPassword);
  await updateDoc(doc(db, "users", auth.currentUser.uid), { mustChangePassword: false });
}