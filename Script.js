import { getAuth, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, getDoc, updateDoc, setDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

const auth = getAuth();

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

/* SAVE DATA */
async function saveData(){
const ref = doc(db,"users",uid);
await updateDoc(ref,{
coins: coins,
wallet: wallet
});
}

/* UPDATE UI */
function updateCoins(){
convertWallet();
document.getElementById("coins").innerText = coins;
document.getElementById("wallet").innerText = wallet;
saveData();
}

/* AUTO CONVERT */
function convertWallet(){
if(coins >= 100){
let r = Math.floor(coins/100);
wallet += r;
coins = coins % 100;
}
}

/* SPIN */
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

let rand = Math.floor(Math.random()*6);
let deg = 720 + rand * 60;

wheel.style.transition = "none";
wheel.style.transform = "rotate(0deg)";

setTimeout(()=>{
wheel.style.transition = "transform 4s ease-out";
wheel.style.transform = "rotate("+deg+"deg)";
},50);

setTimeout(()=>{
let reward = rewards[rand];
coins += reward;
updateCoins();

showPopup("🎉 +" + reward + " coins");

spinBtn.disabled = false;

},4000);
}

/* POPUP */
function showPopup(text){
document.getElementById("resultText").innerText = text;
document.getElementById("popup").style.display = "flex";

setTimeout(()=>{
closePopup();
},2000);
}

window.closePopup = function(){
document.getElementById("popup").style.display = "none";
}

/* DAILY BONUS */
window.dailyBonus = async function(){

let today = new Date().toDateString();

const ref = doc(db,"users",uid);
const snap = await getDoc(ref);

let last = snap.data().daily;

if(last == today){
alert("Already claimed today");
return;
}

coins += 20;

await updateDoc(ref,{
coins: coins,
daily: today
});

updateCoins();

alert("🎁 Bonus Added!");
}

/* LOGOUT */
window.logout = function(){
signOut(auth);
window.location.href = "login.html";
}
/* WATCH AD (SIMULATED) */
window.watchAd = function(){
alert("Watching Ad...");
setTimeout(()=>{
coins += 5;
updateCoins();
alert("+5 Coins Earned 🎉");
},3000);
}

/* DAILY CHECK-IN */
window.checkIn = async function(){

let today = new Date().toDateString();

const ref = doc(db,"users",uid);
const snap = await getDoc(ref);

let last = snap.data().checkin;

if(last == today){
alert("Already checked in today");
return;
}

coins += 10;

await updateDoc(ref,{
coins: coins,
checkin: today
});

updateCoins();

alert("✅ Daily reward +10 coins");
}

/* REFER SYSTEM (BASIC) */
window.refer = function(){
let code = uid.substring(0,6);
alert("Share this code: " + code + "\nEarn 50 coins per user!");
}

/* WITHDRAW SYSTEM */
window.withdraw = async function(){

let upi = document.getElementById("upi").value;

if(upi == ""){
alert("Enter UPI ID");
return;
}

if(wallet < 10){
alert("Minimum ₹10 required");
return;
}

let amount = wallet; // you can change later

const ref = doc(db,"withdraws", Date.now().toString());

await setDoc(ref,{
uid: uid,
upi: upi,
amount: amount,
status: "pending"
});

wallet -= amount; // safer
updateCoins();

alert("Withdrawal Request Sent ✅");
}
