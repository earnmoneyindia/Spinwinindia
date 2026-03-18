import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID"
};

const app = initializeApp(firebaseConfig);

window.app = app;
