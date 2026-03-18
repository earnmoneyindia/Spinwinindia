import { auth, db } from "./firebase.js";
import { doc, getDoc, updateDoc, addDoc, collection } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let uid = "";
let wallet = 0;

onAuthStateChanged(auth, async(user)=>{
if(!user){
window.location.href="login.html";
return;
}

uid = user.uid;

let snap = await getDoc(doc(db,"users",uid));
wallet = snap.data().wallet || 0;

document.getElementById("wallet").innerText = wallet;

});


// ============================
// 💸 WITHDRAW FUNCTION
// ============================
window.requestWithdraw = async function(){

let amount = parseInt(document.getElementById("amount").value);
let upi = document.getElementById("upi").value;

if(!amount || amount < 200){
show("❗ Minimum ₹200 required");
return;
}

if(amount > 7000){
show("❗ Max ₹7000 allowed");
return;
}

if(amount > wallet){
show("❗ Not enough balance");
return;
}

if(!upi){
show("❗ Enter UPI ID");
return;
}


// ============================
// 🔐 LIMIT CHECKS
// ============================
let snap = await getDoc(doc(db,"users",uid));
let user = snap.data();

let now = Date.now();
let today = new Date().toDateString();
let week = getWeek();

// reset daily
if(user.lastWithdrawDate !== today){
user.dailyWithdraw = 0;
user.lastWithdrawDate = today;
}

// reset weekly
if(user.lastWithdrawWeek !== week){
user.weeklyWithdraw = 0;
user.lastWithdrawWeek = week;
}

// ⛔ daily limit
if(user.dailyWithdraw + amount > 1000){
show("🚫 Daily limit ₹1000 reached");
return;
}

// ⛔ weekly limit
if(user.weeklyWithdraw + amount > 5000){
show("🚫 Weekly limit ₹5000 reached");
return;
}

// ⛔ hourly limit
if(user.lastWithdrawTime && now - user.lastWithdrawTime < 3600000){
show("⏳ Only ₹200 per hour allowed");
return;
}


// ============================
// 💾 CREATE REQUEST
// ============================
await addDoc(collection(db,"withdrawRequests"),{
uid: uid,
amount: amount,
upi: upi,
status: "pending",
time: now
});

// deduct wallet
wallet -= amount;

await updateDoc(doc(db,"users",uid),{
wallet: wallet,
dailyWithdraw: user.dailyWithdraw + amount,
weeklyWithdraw: user.weeklyWithdraw + amount,
lastWithdrawTime: now
});

document.getElementById("wallet").innerText = wallet;

show("✅ Request submitted");

};


// ============================
// 🧠 HELPERS
// ============================
function show(msg){
document.getElementById("msg").innerText = msg;
}

function getWeek(){
let d = new Date();
let onejan = new Date(d.getFullYear(),0,1);
return Math.ceil((((d - onejan) / 86400000) + onejan.getDay()+1)/7);
}
