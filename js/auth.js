// js/auth.js
import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userRef = doc(db, "users", email);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const role = docSnap.data().role;
      const plant = docSnap.data().plant;
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("plant", plant);
      window.location.href = "dashboard.html";
    } else {
      alert("User record not found.");
    }
  } catch (err) {
    alert("Login failed: " + err.message);
  }
});
