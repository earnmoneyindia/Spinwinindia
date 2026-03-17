import { auth } from "./firebase.js";

import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, getDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";


let wheel, spinBtn;

let coins = 0;
let wallet = 0;
let uid = "";

let rewards = [2,5,10,0,15,23];


window.onload = ()=>{
wheel = document.getElementById("wheel");
spinBtn = document.getElementById("spinBtn");
};


// LOAD USER
onAuthStateChanged(auth, async(user)=>{

if(user){

uid = user.uid;

const ref = doc(db,"users",uid);
const snap = await getDoc(ref);

if(snap.exists()){

coins = snap.data().coins || 0;
wallet = snap.data().wallet || 0;

updateUI();

}

}

});


// SAVE
async function saveData(){

const ref = doc(db,"users",uid);

await updateDoc(ref,{
coins,
wallet
});

}


// UPDATE UI
function updateUI(){

convertWallet();

document.getElementById("coins").innerText = coins;
document.getElementById("wallet").innerText = wallet;

saveData();

}


// NEW CONVERSION LOGIC (120 → ₹1)
function convertWallet(){

if(coins >= 120){

let r = Math.floor(coins / 100);

wallet += r;

coins = coins % 100;

}

}


// ====== AD SYSTEM ======

function showAd(callback){

let ad = document.getElementById("adPopup");
let timer = document.getElementById("adTimer");

ad.style.display = "flex";

let time = 3; // 3 sec demo ad

timer.innerText = "Ad ends in " + time + "s";

let interval = setInterval(()=>{

time--;

timer.innerText = "Ad ends in " + time + "s";

if(time <= 0){

clearInterval(interval);

ad.style.display = "none";

callback(); // reward ఇవ్వు

}

},1000);

}


// ===== SPIN =====

window.spin = function(){

if(coins < 10){

showPopup("❌ Not enough coins 🤡 Watch Ads To Get Coin");
return;

}

spinBtn.disabled = true;

// 👉 FIRST AD SHOW
showAd(()=>{

coins -= 10;

let sound = new Audio("spin_sound.mp3");
sound.play();

let rand = Math.floor(Math.random()*rewards.length);
let deg = 720 + rand*60;

wheel.style.transform = "rotate("+deg+"deg)";

setTimeout(()=>{

let reward = rewards[rand];

coins += reward;

updateUI();

showPopup("🎉 +" + reward + " coins");

spinBtn.disabled = false;

},4000);

});

};


// POPUP
function showPopup(text){

document.getElementById("resultText").innerText = text;

document.getElementById("popup").style.display="flex";

setTimeout(()=>{
closePopup();
},2000);

}


window.closePopup = function(){
document.getElementById("popup").style.display="none";
};


// DAILY BONUS REMOVE (optional)
window.dailyBonus = function(){
showPopup("📺 Watch ads to earn coins");
};
