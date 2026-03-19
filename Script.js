import { getAuth, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, getDoc, setDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

const auth = getAuth();

let wheel, spinBtn;
let coins = 0;
let wallet = 0;
let uid = "";

let rewards = [5,10,20,0,15,50];

window.onload = ()=>{
  wheel = document.getElementById("wheel");
  spinBtn = document.getElementById("spinBtn");
};

/* AUTH */
onAuthStateChanged(auth, async(user)=>{
  if(user){
    uid = user.uid;

    const ref = doc(db,"users",uid);
    const snap = await getDoc(ref);

    if(snap.exists()){
      const data = snap.data() || {};

      coins = data.coins || 0;
      wallet = data.wallet || 0;
    }

    updateUI();
  }
});

/* SAVE */
async function saveData(){
  if(!uid) return;

  const ref = doc(db,"users",uid);
  await setDoc(ref,{
    coins,
    wallet
  },{merge:true});
}

/* UI */
function updateUI(){
  convertWallet();
  document.getElementById("coins").innerText = coins;
  document.getElementById("wallet").innerText = wallet;
  saveData();
}

/* CONVERT */
function convertWallet(){
  if(coins >= 100){
    let r = Math.floor(coins/100);
    wallet += r;
    coins = coins % 100;
  }
}

/* SPIN */
window.spin = ()=>{
  if(!uid) return alert("Login required");
  if(coins < 10) return alert("Not enough coins");

  spinBtn.disabled = true;

  coins -= 10;
  updateUI();

  try{
    new Audio("spin_sound.mp3").play();
  }catch(e){}

  let rand = Math.floor(Math.random()*6);
  let deg = 720 + rand * 60;

  wheel.style.transition = "none";
  wheel.style.transform = "rotate(0deg)";

  setTimeout(()=>{
    wheel.style.transition = "transform 4s ease-out";
    wheel.style.transform = `rotate(${deg}deg)`;
  },50);

  setTimeout(()=>{
    coins += rewards[rand];
    updateUI();
    showPopup("🎉 +" + rewards[rand] + " coins");
    spinBtn.disabled = false;
  },4000);
};

/* POPUP */
function showPopup(text){
  document.getElementById("resultText").innerText = text;
  document.getElementById("popup").style.display = "flex";

  setTimeout(()=>{
    document.getElementById("popup").style.display = "none";
  },2000);
}

/* DAILY BONUS */
window.dailyBonus = async ()=>{
  if(!uid) return alert("Login required");

  let today = new Date().toDateString();
  const ref = doc(db,"users",uid);
  const snap = await getDoc(ref);
  const data = snap.data() || {};

  if(data.daily === today){
    return alert("Already claimed today");
  }

  coins += 20;

  await setDoc(ref,{
    coins,
    daily: today
  },{merge:true});

  updateUI();
  alert("🎁 Bonus Added!");
};

/* WATCH AD */
window.watchAd = ()=>{
  if(!uid) return alert("Login required");

  alert("Watching Ad...");
  setTimeout(()=>{
    coins += 5;
    updateUI();
    alert("+5 Coins Earned 🎉");
  },3000);
};

/* CHECK-IN */
window.checkIn = async ()=>{
  if(!uid) return alert("Login required");

  let today = new Date().toDateString();
  const ref = doc(db,"users",uid);
  const snap = await getDoc(ref);
  const data = snap.data() || {};

  if(data.checkin === today){
    return alert("Already checked in today");
  }

  coins += 10;

  await setDoc(ref,{
    coins,
    checkin: today
  },{merge:true});

  updateUI();
  alert("✅ +10 coins");
};

/* REFER */
window.refer = ()=>{
  if(!uid) return alert("Login required");
  alert("Refer Code: " + uid.substring(0,6));
};

/* WITHDRAW */
window.withdraw = async ()=>{
  if(!uid) return alert("Login required");

  let upi = document.getElementById("upi").value.trim();

  if(!upi) return alert("Enter UPI ID");
  if(wallet < 10) return alert("Minimum ₹10 required");

  let amount = wallet;

  await setDoc(doc(db,"withdraws",Date.now().toString()),{
    uid,
    upi,
    amount,
    status:"pending"
  });

  wallet = 0;
  updateUI();

  alert("Withdrawal Requested ✅");
};

/* LOGOUT */
window.logout = ()=>{
  signOut(auth);
  location.href = "login.html";
};
