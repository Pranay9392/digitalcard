
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import storage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
    apiKey: "AIzaSyAFcFGcGccovDOSKsVQSbh5gAELDt04SgY",
    authDomain: "card-c78c2.firebaseapp.com",
    projectId: "card-c78c2",
    storageBucket: "card-c78c2.firebasestorage.app",
    messagingSenderId: "434596941344",
    appId: "1:434596941344:web:3c9e217fe8aed844c0b645",
    measurementId: "G-M50NTMLV81"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app); // Initialize Storage
export default app;