import { getAuth, signInWithPopup, GoogleAuthProvider } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, setDoc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain: "spinwinindia.firebaseapp.com",

projectId: "spinwinindia",

storageBucket: "spinwinindia.appspot.com",

messagingSenderId: "XXXXXXXX",

appId: "XXXXXXXX"

};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();


window.googleLogin = async function(){

const result = await signInWithPopup(auth,provider);

const user = result.user;

const userRef = doc(db,"users",user.uid);

const snap = await getDoc(userRef);

if(!snap.exists()){

await setDoc(userRef,{

name:user.displayName,

email:user.email,

coins:100,

wallet:0,

date:new Date().toISOString()

});

}

window.location.href="index.html";

}
