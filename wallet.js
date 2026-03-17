import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, getDoc, updateDoc, setDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

const auth = getAuth();

let uid = "";
let wallet = 0;

// LOAD USER
onAuthStateChanged(auth, async (user)=>{

if(user){

uid = user.uid;

const ref = doc(db,"users",uid);
const snap = await getDoc(ref);

if(snap.exists()){

wallet = snap.data().wallet || 0;

document.getElementById("wallet").innerText = wallet;

}

}

});

// 🔥 WITHDRAW FUNCTION (FULL PROTECTION)
window.withdraw = async function(){

let amount = parseInt(document.getElementById("amount").value);
let upi = document.getElementById("upi").value.trim();

// ❌ BASIC VALIDATION
if(!amount || amount <= 0){
alert("Enter valid amount");
return;
}

if(!upi){
alert("Enter UPI ID");
return;
}

// 💵 MIN LIMIT
if(amount < 200){
alert("❌ Minimum withdrawal ₹200");
return;
}

// 💸 MAX LIMIT
if(amount > 7000){
alert("❌ Maximum withdrawal ₹7000");
return;
}

// 💰 CHECK BALANCE
if(amount > wallet){
alert("❌ Not enough balance");
return;
}

// ⏱ HOURLY LIMIT (₹200)
let now = Date.now();
let hourData = JSON.parse(localStorage.getItem("hourWithdraw")) || {time:0, amount:0};

if(now - hourData.time > 60*60*1000){
hourData = {time: now, amount: 0};
}

if(hourData.amount + amount > 200){
alert("⏳ Hourly limit ₹200 reached");
return;
}

// 📅 DAILY LIMIT (₹1000)
let today = new Date().toDateString();
let dayData = JSON.parse(localStorage.getItem("dayWithdraw")) || {date:"", amount:0};

if(dayData.date !== today){
dayData = {date: today, amount: 0};
}

if(dayData.amount + amount > 1000){
alert("🚫 Daily limit ₹1000 reached");
return;
}

// 📆 WEEKLY LIMIT (₹5000)
let week = Math.floor(now / (7*24*60*60*1000));
let weekData = JSON.parse(localStorage.getItem("weekWithdraw")) || {week:0, amount:0};

if(weekData.week !== week){
weekData = {week: week, amount: 0};
}

if(weekData.amount + amount > 5000){
alert("🚫 Weekly limit ₹5000 reached");
return;
}

// 🛡 FRAUD PROTECTION (Too many requests)
let fraudData = JSON.parse(localStorage.getItem("fraudCheck")) || {count:0, time:0};

if(now - fraudData.time < 5*60*1000){ // 5 min window
fraudData.count++;
}else{
fraudData = {count:1, time:now};
}

if(fraudData.count > 5){
alert("🚫 Too many requests. Try later");
return;
}

// ✅ UPDATE LIMIT TRACKERS
hourData.amount += amount;
hourData.time = now;
localStorage.setItem("hourWithdraw", JSON.stringify(hourData));

dayData.amount += amount;
localStorage.setItem("dayWithdraw", JSON.stringify(dayData));

weekData.amount += amount;
localStorage.setItem("weekWithdraw", JSON.stringify(weekData));

fraudData.time = now;
localStorage.setItem("fraudCheck", JSON.stringify(fraudData));

// 💸 DEDUCT WALLET
wallet -= amount;

// 🔥 SAVE TO FIRESTORE
await updateDoc(doc(db,"users",uid),{
wallet: wallet
});

// 🧾 SAVE REQUEST (ADMIN PANEL)
await setDoc(doc(db,"withdrawals", uid + "_" + now),{
uid: uid,
amount: amount,
upi: upi,
status: "pending",
time: new Date().toISOString()
});

// ✅ SUCCESS
alert("✅ Withdrawal request sent");

document.getElementById("wallet").innerText = wallet;
document.getElementById("amount").value = "";
document.getElementById("upi").value = "";

}
