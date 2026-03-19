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

/* AUTH */
onAuthStateChanged(auth, async(user)=>{
  if(user){
    uid = user.uid;

    const ref = doc(db,"users",uid);
    const snap = await getDoc(ref);

    if(snap.exists()){
      const data = snap.data() || {};  // ✅ SAFE FIX

      coins = data.coins || 0;
      wallet = data.wallet || 0;

      document.getElementById("coins").innerText = coins;
      document.getElementById("wallet").innerText = wallet;
    }
  }
});

/* SAVE DATA */
async function saveData(){
  const ref = doc(db,"users",uid);
  await setDoc(ref,{
    coins: coins,
    wallet: wallet
  },{merge:true});  // ✅ SAFE
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

  if(!uid){
    alert("Login required");
    return;
  }

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

  /* FIXED ROTATION */
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

  if(!uid){
    alert("Login required");
    return;
  }

  let today = new Date().toDateString();

  const ref = doc(db,"users",uid);
  const snap = await getDoc(ref);
  const data = snap.data() || {};   // ✅ FIX

  let last = data.daily;

  if(last == today){
    alert("Already claimed today");
    return;
  }

  coins += 20;

  await setDoc(ref,{
    coins: coins,
    daily: today
  },{merge:true});   // ✅ SAFE

  updateCoins();

  alert("🎁 Bonus Added!");
}

/* WATCH AD */
window.watchAd = function(){

  if(!uid){
    alert("Login required");
    return;
  }

  alert("Watching Ad...");
  setTimeout(()=>{
    coins += 5;
    updateCoins();
    alert("+5 Coins Earned 🎉");
  },3000);
}

/* DAILY CHECK-IN */
window.checkIn = async function(){

  if(!uid){
    alert("Login required");
    return;
  }

  let today = new Date().toDateString();

  const ref = doc(db,"users",uid);
  const snap = await getDoc(ref);
  const data = snap.data() || {};   // ✅ FIX

  let last = data.checkin;

  if(last == today){
    alert("Already checked in today");
    return;
  }

  coins += 10;

  await setDoc(ref,{
    coins: coins,
    checkin: today
  },{merge:true});   // ✅ SAFE

  updateCoins();

  alert("✅ Daily reward +10 coins");
}

/* REFER */
window.refer = function(){
  if(!uid){
    alert("Login required");
    return;
  }

  let code = uid.substring(0,6);
  alert("Share this code: " + code + "\nEarn 50 coins per user!");
}

/* WITHDRAW */
window.withdraw = async function(){

  if(!uid){
    alert("Login required");
    return;
  }

  let upi = document.getElementById("upi").value;

  if(upi == ""){
    alert("Enter UPI ID");
    return;
  }

  if(wallet < 10){
    alert("Minimum ₹10 required");
    return;
  }

  let amount = wallet;

  const ref = doc(db,"withdraws", Date.now().toString());

  await setDoc(ref,{
    uid: uid,
    upi: upi,
    amount: amount,
    status: "pending"
  });

  wallet -= amount;
  updateCoins();

  alert("Withdrawal Request Sent ✅");
}

/* LOGOUT */
window.logout = function(){
  signOut(auth);
  window.location.href = "login.html";
}
