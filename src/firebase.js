import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyA-QGj-zogwT-IDkByLppRjhhOlS9lQFZ0",
  authDomain: "chat-app-d9500.firebaseapp.com",
  projectId: "chat-app-d9500",
  storageBucket: "chat-app-d9500.appspot.com",
  messagingSenderId: "1066831098881",
  appId: "1:1066831098881:web:85bce72b54aea185d0fc00",
  measurementId: "G-CKPZLZ1RB9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getDatabase(app);
export const getFStore = getFirestore(app);
