// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
