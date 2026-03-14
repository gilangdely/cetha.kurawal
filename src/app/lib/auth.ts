import { auth, db, googleProvider } from "@/app/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";

// Register User
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  if (password !== confirmPassword) {
    throw new Error("Password dan konfirmasi password tidak sama");
  }

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;

  await updateProfile(user, { displayName: username });

  await setDoc(doc(db, "users", user.uid), {
    username,
    email,
    createdAt: serverTimestamp(),
  });

  const token = await user.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
  });

  return user;
};

// Login dengan Email & Password
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const token = await userCredential.user.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
  });
  return userCredential;
};

// Login dengan Google
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      username: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } else {
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
  }

  const token = await user.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
  });

  return user;
};

// Lupa password
export const resetPassword = async (email: string) => {
  if (!email) throw new Error("Email wajib diisi");

  await sendPasswordResetEmail(auth, email);
  return "Link reset password telah dikirim ke email kamu";
};

// Logout
export const logoutUser = async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  return await signOut(auth);
};
