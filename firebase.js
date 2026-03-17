import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXws-cPYl9uoLTDuIY8iBCzYmgs6z5BGs",
  authDomain: "spinwinindia.firebaseapp.com",
  projectId: "spinwinindia",
  storageBucket: "spinwinindia.appspot.com",
  messagingSenderId: "413087280761",
  appId: "1:413087280761:web:2f37b4a1a60a50094baea8"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
