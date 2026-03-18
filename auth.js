import { signInWithPopup, GoogleAuthProvider, signOut }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, setDoc, getDoc }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { auth, db } from "./firebase.js";

const provider = new GoogleAuthProvider();

window.googleLogin = async function(){

const result = await signInWithPopup(auth, provider);
const user = result.user;

const ref = doc(db,"users",user.uid);
const snap = await getDoc(ref);

if(!snap.exists()){
await setDoc(ref,{
name:user.displayName,
email:user.email,
coins:100,
wallet:0,
referral:user.uid.slice(0,6),
date:new Date().toISOString()
});
}

window.location.href="index.html";
}

window.logout = function(){
signOut(auth).then(()=>{
window.location.href="login.html";
});
}
