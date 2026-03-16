// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase config (replace with your code)

const firebaseConfig = {
  apiKey: "AIzaSyDXws-cPYl9uoLTDuIY8iBCzYmgs6z5BGs",
  authDomain: "spinwinindia.firebaseapp.com",
  projectId: "spinwinindia",
  storageBucket: "spinwinindia.firebasestorage.app",
  messagingSenderId: "413087280761",
  appId: "1:413087280761:web:2f37b4a1a60a50094baea8",
  measurementId: "G-GKGVS527MR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
