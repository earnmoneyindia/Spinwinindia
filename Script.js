import { auth, db } from "./firebase.js";
import { doc, getDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.logout = function(){
signOut(auth);
window.location.href="login.html";
}

let coins = 0;
let wallet = 0;
let uid = "";

// 🔐 Controls
let lastSpinTime = 0;
const SPIN_COOLDOWN = 5000;

let adCooldown = 0;
let dailyAdCount = 0;
let lastAdDate = "";

let lastWalletHour = new Date().getHours();
let earnedThisHour = 0;
const HOURLY_LIMIT = 200;


// 🔊 Sounds
let spinSound = new Audio("sounds/spin.mp3");
let winSound = new Audio("sounds/win.mp3");


// ============================
// 👤 LOAD USER
// ============================
onAuthStateChanged(auth, async(user)=>{

if(!user){
window.location.href="login.html";
return;
}

uid = user.uid;

const snap = await getDoc(doc(db,"users",uid));

if(snap.exists()){
coins = snap.data().coins || 0;
wallet = snap.data().wallet || 0;
}

updateUI();
drawWheel();

});


// ============================
// 🎯 UI UPDATE
// ============================
function updateUI(){
document.getElementById("coins").innerText = coins;
document.getElementById("wallet").innerText = wallet;
}


// ============================
// 🎡 DRAW WHEEL
// ============================

function drawWheel(){

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 320;

let rewards = getRewards();
let angle = (2*Math.PI)/rewards.length;

// 🔥 OUTER GLOW
ctx.shadowBlur = 20;
ctx.shadowColor = "gold";

for(let i=0;i<rewards.length;i++){

ctx.beginPath();
ctx.moveTo(160,160);

// gradient colors (premium look)
let grad = ctx.createLinearGradient(0,0,320,320);
grad.addColorStop(0, i%2==0 ? "#1e3a8a" : "#0ea5e9");
grad.addColorStop(1, "#38bdf8");

ctx.fillStyle = grad;

ctx.arc(160,160,150,i*angle,(i+1)*angle);
ctx.fill();

// TEXT
ctx.save();
ctx.translate(160,160);
ctx.rotate(i*angle + angle/2);

ctx.fillStyle = "gold";
ctx.font = "bold 20px Arial";
ctx.fillText(rewards[i],100,5);

ctx.restore();
}

// 🔥 CENTER CIRCLE
ctx.beginPath();
ctx.arc(160,160,50,0,2*Math.PI);
ctx.fillStyle = "#0f172a";
ctx.fill();

ctx.fillStyle = "white";
ctx.font = "bold 18px Arial";
ctx.fillText("SPIN",130,165);

}
  
// ============================
// 🎡 REWARDS
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
// 🎯 SPIN
// ============================

window.spin = async function(){

let now = Date.now();

if(now - lastSpinTime < SPIN_COOLDOWN){
alert("⏳ Wait!");
return;
}

if(coins < 10){
alert("Not enough coins");
return;
}

lastSpinTime = now;

coins -= 10;
updateUI();

spinSound.play();

let wheel = document.getElementById("wheel");

// 🎡 RANDOM ROTATION
let deg = 360 * 5 + Math.floor(Math.random()*360);

wheel.style.transition = "transform 3s ease-out";
wheel.style.transform = "rotate("+deg+"deg)";

let rewards = getRewards();
let reward = rewards[Math.floor(Math.random()*rewards.length)];

setTimeout(async ()=>{

coins += reward;

// 💰 conversion
if(coins >= 120){
coins -= 100;
wallet += 1;
}

// save
await updateDoc(doc(db,"users",uid),{
coins, wallet
});

winSound.play();
confetti();

showPopup("🎉 "+reward+" coins");
updateUI();

},3000);

}

// ============================
// 🎁 ADS
// ============================
window.watchAdCoins = function(){

showAd(()=>{
coins += 20;
saveAndUpdate();
});

}


// ============================
// 💾 SAVE
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
// 📺 AD SYSTEM
// ============================
function showAd(callback){

let today = new Date().toDateString();

if(lastAdDate !== today){
dailyAdCount = 0;
lastAdDate = today;
}

if(dailyAdCount >= 5){
alert("🚫 Daily limit reached");
return;
}

let now = Date.now();
if(now - adCooldown < 30000){
alert("⏳ Wait for next ad");
return;
}

if(coins >= 10){
alert("❗ Use coins first");
return;
}

adCooldown = now;
dailyAdCount++;

let ad = document.createElement("div");
ad.innerHTML = "📺 Watching Ad...";
ad.style = `
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:black;
color:white;
display:flex;
justify-content:center;
align-items:center;
font-size:24px;
`;

document.body.appendChild(ad);

setTimeout(()=>{
document.body.removeChild(ad);
callback();
},4000);

}


// ============================
// 🎉 CONFETTI
// ============================
function confetti(){

for(let i=0;i<25;i++){
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
