// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig"; // Make sure Firestore is configured in firebaseConfig
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions

const AuthContext = createContext();      

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Retrieve additional data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUser({ ...user, ...userDoc.data() }); // Add Firestore data to user state
        } else {
          setUser(user); // Only use basic auth data if Firestore doc is missing
        }
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const signUp = async (email, password, fullName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    // Update Firebase Auth displayName
    await updateProfile(newUser, { displayName: fullName });

    // Save additional info in Firestore
    await setDoc(doc(db, "users", newUser.uid), { fullName });

    setUser({ ...newUser, displayName: fullName, fullName }); // Set fullName in state
  };

  const signIn = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
