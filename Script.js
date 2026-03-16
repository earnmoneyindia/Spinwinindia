import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, getDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

const auth = getAuth();

let wheel;
let spinBtn;

let coins = 0;
let wallet = 0;
let uid = "";

let rewards = [5,10,20,0,15,50];


// Wait until page loads
window.addEventListener("DOMContentLoaded",()=>{

wheel = document.getElementById("wheel");
spinBtn = document.getElementById("spinBtn");

});


// LOAD USER DATA
onAuthStateChanged(auth, async (user)=>{

if(user){

uid = user.uid;

const userRef = doc(db,"users",uid);

const snap = await getDoc(userRef);

if(snap.exists()){

coins = snap.data().coins || 0;
wallet = snap.data().wallet || 0;

document.getElementById("coins").innerText = coins;
document.getElementById("wallet").innerText = wallet;

}

}

});



// SAVE DATA
async function saveData(){

const userRef = doc(db,"users",uid);

await updateDoc(userRef,{
coins: coins,
wallet: wallet
});

}



// UPDATE DISPLAY
function updateCoins(){

convertWallet();

document.getElementById("coins").innerText = coins;
document.getElementById("wallet").innerText = wallet;

saveData();

}



// COIN → WALLET
function convertWallet(){

if(coins >= 100){

let rupees = Math.floor(coins / 100);

wallet += rupees;

coins = coins % 100;

}

}



// SPIN BUTTON
window.spin = function(){

if(coins < 10){

alert("Not enough coins!");

return;

}

spinBtn.disabled = true;


// Show ad before spin
try{
(adsbygoogle = window.adsbygoogle || []).push({});
}catch(e){}


// Small delay
setTimeout(()=>{

startSpin();

},1500);

}



// SPIN LOGIC
function startSpin(){

coins -= 10;

updateCoins();

let sound = new Audio("spin_sound.mp3");

sound.play();

let rand = Math.floor(Math.random()*rewards.length);

let deg = 720 + rand * 60;

wheel.style.transform = "rotate("+deg+"deg)";


setTimeout(()=>{

let reward = rewards[rand];

coins += reward;

updateCoins();

showPopup("🎉 +" + reward + " coins");

spinBtn.disabled = false;

},4000);

}



// POPUP
function showPopup(text){

document.getElementById("resultText").innerText = text;

document.getElementById("popup").style.display="flex";

setTimeout(()=>{

closePopup();

},2000);

}



// CLOSE POPUP
window.closePopup = function(){

document.getElementById("popup").style.display="none";

}



// DAILY BONUS
window.dailyBonus = async function(){

let today = new Date().toDateString();

const userRef = doc(db,"users",uid);

const snap = await getDoc(userRef);

let last = snap.data().daily;

if(last == today){

alert("Today's bonus already claimed!");

return;

}

coins += 20;

await updateDoc(userRef,{
coins: coins,
daily: today
});

updateCoins();

alert("🎁 Daily Bonus: 20 coins");

}
