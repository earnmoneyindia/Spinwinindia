import { auth, db } from "./firebase.js";
import { doc, getDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let coins = 0;
let wallet = 0;
let uid = "";

let rewards = [5,10,20,0,15,50];

// LOAD USER
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

});

// UPDATE UI
function updateUI(){
document.getElementById("coins").innerText = coins;
document.getElementById("wallet").innerText = wallet;
}

// SAVE
async function save(){
await updateDoc(doc(db,"users",uid),{
coins: coins,
wallet: wallet
});
}

// SPIN
window.spin = function(){

if(coins < 10){
alert("Not enough coins!");
return;
}

coins -= 10;
updateUI();

let wheel = document.getElementById("wheel");

let rand = Math.floor(Math.random()*rewards.length);
let deg = 720 + rand*60;

wheel.style.transform = "rotate("+deg+"deg)";

setTimeout(()=>{

let reward = rewards[rand];

coins += reward;

// wallet convert
if(coins >= 100){
wallet += Math.floor(coins/100);
coins = coins % 100;
}

updateUI();
save();

showPopup("🎉 You got "+reward+" coins");

},3000);

}

// POPUP
function showPopup(text){
let p = document.getElementById("popup");
p.innerText = text;
p.style.display="block";

setTimeout(()=>p.style.display="none",2000);
}

// DAILY BONUS
window.dailyBonus = function(){
coins += 20;
updateUI();
save();
alert("🎁 +20 coins");
}

// WATCH AD
window.watchAdCoins = function(){

let ad = document.createElement("div");
ad.innerHTML="📺 Watching Ad...";
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
coins += 20;
updateUI();
save();
},3000);

}

// LOGOUT
window.logout = function(){
signOut(auth);
window.location.href="login.html";
}
