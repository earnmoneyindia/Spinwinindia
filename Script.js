import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, getDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";


let wheel = document.getElementById("wheel");
let spinBtn = document.querySelector("button");

let coins = 0;
let wallet = 0;
let uid = "";

let rewards = [5,10,20,0,15,50];

const auth = getAuth();


// LOAD USER DATA
onAuthStateChanged(auth, async (user)=>{

if(user){

uid = user.uid;

const userRef = doc(db,"users",uid);

const snap = await getDoc(userRef);

if(snap.exists()){

coins = snap.data().coins;
wallet = snap.data().wallet;

document.getElementById("coins").innerText = coins;

}

}

});


// SAVE DATA TO FIRESTORE
async function saveData(){

const userRef = doc(db,"users",uid);

await updateDoc(userRef,{
coins: coins,
wallet: wallet
});

}


// COIN DISPLAY UPDATE
function updateCoins(){

document.getElementById("coins").innerText = coins;

convertWallet();

saveData();

}


// WALLET CONVERSION
function convertWallet(){

if(coins >= 100){

let rupees = Math.floor(coins/100);

wallet += rupees;

coins = coins % 100;

}

}


// SPIN FUNCTION
window.spin = function(){

if(coins < 10){

alert("Not enough coins!");

return;

}

spinBtn.disabled = true;

coins -= 10;

updateCoins();

let sound = new Audio("spin_sound.mp3");

sound.play();

let rand = Math.floor(Math.random()*rewards.length);

let deg = 720 + rand*60;

wheel.style.transform = "rotate("+deg+"deg)";

setTimeout(()=>{

let reward = rewards[rand];

coins += reward;

updateCoins();

showPopup("🎉 +"+reward+" coins");

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
