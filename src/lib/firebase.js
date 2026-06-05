import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace with your actual Firebase project configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCkixRC48n5KCxLL_m7QDw9hZ85y1t_Oeg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "business-connect-community.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "business-connect-community",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "business-connect-community.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "767174759678",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:767174759678:web:54091cab2a689d8db281af",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-59YD13699Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
