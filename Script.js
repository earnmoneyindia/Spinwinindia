import { auth, db } from "./firebase.js";
import { doc, getDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let coins = 0;
let wallet = 0;
let uid = "";

// ============================
// 🔐 SECURITY VARIABLES
// ============================
let lastSpinTime = 0;
const SPIN_COOLDOWN = 5000;

let adCooldown = 0;
let dailyAdCount = 0;
let lastAdDate = "";

let lastWalletHour = new Date().getHours();
let earnedThisHour = 0;
const HOURLY_LIMIT = 200;


// ============================
// 👤 LOAD USER
// ============================
onAuthStateChanged(auth, async(user)=>{

if(!user){
window.location.href="login.html";
return;
}

uid = user.uid;

const ref = doc(db,"users",uid);
const snap = await getDoc(ref);

if(snap.exists()){
coins = snap.data().coins || 0;
wallet = snap.data().wallet || 0;
}

updateUI();

});


// ============================
// 🎯 UI UPDATE
// ============================
function updateUI(){
document.getElementById("coins").innerText = coins;
document.getElementById("wallet").innerText = wallet;
}

function drawWheel(){

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

canvas.width = 260;
canvas.height = 260;

let rewards = getRewards();
let angle = (2*Math.PI)/rewards.length;

for(let i=0;i<rewards.length;i++){

ctx.beginPath();
ctx.moveTo(130,130);

ctx.fillStyle = i%2==0 ? "#06b6d4" : "#0ea5e9";

ctx.arc(130,130,130,i*angle,(i+1)*angle);
ctx.fill();

ctx.save();
ctx.translate(130,130);
ctx.rotate(i*angle + angle/2);

ctx.fillStyle = "white";
ctx.font = "bold 14px Arial";
ctx.fillText(rewards[i],50,5);

ctx.restore();
}
}

drawWheel();

function confetti(){

for(let i=0;i<30;i++){
let div = document.createElement("div");

div.style.position="fixed";
div.style.width="6px";
div.style.height="6px";
div.style.background="cyan";
div.style.top=Math.random()*window.innerHeight+"px";
div.style.left=Math.random()*window.innerWidth+"px";

document.body.appendChild(div);

setTimeout(()=>div.remove(),1000);
}
}

confetti();

let spinSound = new Audio("sounds/spin.mp3");
let winSound = new Audio("sounds/win.mp3");

function playSpin(){
spinSound.play();
}

function playWin(){
winSound.play();
}

playSpin();
// after result
playWin();

// ============================
// 🎡 DYNAMIC REWARD SYSTEM
// ============================
function getRewards(){

if(wallet <= 100 && coins <= 50){
return [35,15,0,20,25,50,0,10,5,8,10,30];
}
else if(wallet >= 500){
return [5,10,0,22,15,19,0,10,7,20,0,32];
}
return [5,10,8,20,15,9,0,12,15,25,11,30];

}


// ============================
// 🎯 SPIN FUNCTION (SECURE)
// ============================
window.spin = async function(){

let now = Date.now();

// ⛔ cooldown
if(now - lastSpinTime < SPIN_COOLDOWN){
alert("⏳ Wait before spinning again!");
return;
}

// ⛔ min coins
if(coins < 10){
alert("Not enough coins");
return;
}

lastSpinTime = now;

// deduct
coins -= 10;

// reward
let rewards = getRewards();
let reward = rewards[Math.floor(Math.random()*rewards.length)];

coins += reward;


// ============================
// 💰 WALLET CONTROL
// ============================
let currentHour = new Date().getHours();

// reset hourly limit
if(currentHour !== lastWalletHour){
earnedThisHour = 0;
lastWalletHour = currentHour;
}

// conversion logic
if(coins >= 120){

if(earnedThisHour < HOURLY_LIMIT){

coins -= 100;
wallet += 1;
earnedThisHour++;

}else{
showPopup("⛔ Hourly wallet limit reached");
}

}


// ============================
// 💾 SAVE DATA
// ============================
await updateDoc(doc(db,"users",uid),{
coins: coins,
wallet: wallet
});

showPopup("🎉 You won " + reward);
updateUI();

}


// ============================
// 🎁 DAILY BONUS (AD)
// ============================
window.dailyBonus = function(){
showAd(()=>{
coins += 20;
saveAndUpdate();
});
}


// ============================
// 📺 WATCH AD REWARD
// ============================
window.watchAdCoins = function(){
showAd(()=>{
coins += 20;
saveAndUpdate();
});
}


// ============================
// 💾 SAVE HELPER
// ============================
async function saveAndUpdate(){
await updateDoc(doc(db,"users",uid),{
coins: coins,
wallet: wallet
});
updateUI();
}


// ============================
// 🎉 POPUP
// ============================
function showPopup(text){
let p = document.getElementById("popup");
p.innerText = text;
p.style.display="block";
setTimeout(()=>p.style.display="none",2000);
}


// ============================
// 📺 AD SYSTEM (SECURE)
// ============================
function showAd(callback){

let today = new Date().toDateString();

// reset daily limit
if(lastAdDate !== today){
dailyAdCount = 0;
lastAdDate = today;
}

// ⛔ daily limit
if(dailyAdCount >= 5){
alert("🚫 Daily ad limit reached");
return;
}

// ⛔ cooldown
let now = Date.now();
if(now - adCooldown < 30000){
alert("⏳ Wait before next ad");
return;
}

// ⛔ condition (your idea)
if(coins >= 10){
alert("❗ Use coins first before watching ads");
return;
}

// update counters
adCooldown = now;
dailyAdCount++;


// 🎬 fake ad UI
let ad = document.createElement("div");
ad.innerHTML = "📺 Watching Ad...";
ad.style.position = "fixed";
ad.style.top = 0;
ad.style.left = 0;
ad.style.width = "100%";
ad.style.height = "100%";
ad.style.background = "black";
ad.style.color = "white";
ad.style.display = "flex";
ad.style.justifyContent = "center";
ad.style.alignItems = "center";
ad.style.fontSize = "24px";

document.body.appendChild(ad);

// simulate ad
setTimeout(()=>{
document.body.removeChild(ad);
callback();
},4000);

}
