import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, getDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

import { auth } from "./firebase.js";

let wheel;
let spinBtn;

let coins = 0;
let wallet = 0;
let uid = "";

let rewards = [5,10,20,0,15,50];


window.onload = function(){

wheel = document.getElementById("wheel");

spinBtn = document.getElementById("spinBtn");

}


onAuthStateChanged(auth, async(user)=>{

if(user){

uid = user.uid;

const ref = doc(db,"users",uid);

const snap = await getDoc(ref);

if(snap.exists()){

coins = snap.data().coins || 0;

wallet = snap.data().wallet || 0;

document.getElementById("coins").innerText = coins;

document.getElementById("wallet").innerText = wallet;

}

}

});



async function saveData(){

const ref = doc(db,"users",uid);

await updateDoc(ref,{

coins: coins,

wallet: wallet

});

}



function updateCoins(){

convertWallet();

document.getElementById("coins").innerText = coins;

document.getElementById("wallet").innerText = wallet;

saveData();

}



function convertWallet(){

if(coins >= 100){

let r = Math.floor(coins/100);

wallet += r;

coins = coins % 100;

}

}



window.spin = function(){

if(coins < 10){

alert("Not enough coins");

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

showPopup("🎉 +" + reward + " coins");

spinBtn.disabled = false;

},4000);

}



function showPopup(text){

document.getElementById("resultText").innerText=text;

document.getElementById("popup").style.display="flex";

setTimeout(()=>{

closePopup();

},2000);

}



window.closePopup=function(){

document.getElementById("popup").style.display="none";

}



window.dailyBonus=async function(){

let today=new Date().toDateString();

const ref=doc(db,"users",uid);

const snap=await getDoc(ref);

let last=snap.data().daily;

if(last==today){

alert("Today's bonus already claimed");

return;

}

coins+=20;

await updateDoc(ref,{

coins:coins,

daily:today

});

updateCoins();

alert("🎁 Daily bonus added");

}
