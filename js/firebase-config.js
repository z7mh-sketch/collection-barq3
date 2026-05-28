import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCwlcxFr89Xf6kTRpWeuzG_oS2IjghqjHE",
  authDomain: "collection-barq.firebaseapp.com",
  projectId: "collection-barq",
  storageBucket: "collection-barq.firebasestorage.app",
  messagingSenderId: "991249745187",
  appId: "1:991249745187:web:3e05d1c65ccfb24237f896",
  measurementId: "G-3RDFKPYL41"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
