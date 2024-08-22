import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDGhJRg0NevaDrZ8l6F61LxH08tF77-zW8",
    authDomain: "cfsistemas-b4634.firebaseapp.com",
    projectId: "cfsistemas-b4634",
    storageBucket: "cfsistemas-b4634.appspot.com",
    messagingSenderId: "99448355093",
    appId: "1:99448355093:web:70aa0058406ff64c6fd11c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);