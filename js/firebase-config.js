// js/firebase-config.js
//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
//import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
//import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM-Ksgch8DJIGD5YpSg7SaP28F2Dm3sR8",
  authDomain: "lagmay-irrigation-v2.firebaseapp.com",
  projectId: "lagmay-irrigation-v2",
  storageBucket: "lagmay-irrigation-v2.firebasestorage.app",
  messagingSenderId: "997036670223",
  appId: "1:997036670223:web:255e97be8144a2ff4e927a"
};

// Initialize Firebase
firebaseConfig.initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
