// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "outstylr.firebaseapp.com",
  projectId: "outstylr",
  storageBucket: "outstylr.firebasestorage.app",
  messagingSenderId: "965137149865",
  appId: "1:965137149865:web:60b5b60eb3a84652b39eb8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);