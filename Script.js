import { auth, db } from "./firebase.js";
import { doc, getDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let coins = 0;
let wallet = 0;
let uid = "";

onAuthStateChanged(auth, async(user)=>{

if(!user){
window.location.href="login.html";
return;
}

uid = user.uid;

const ref = doc(db,"users",uid);
const snap = await getDoc(ref);

coins = snap.data().coins;
wallet = snap.data().wallet;

updateUI();

});

function updateUI(){
document.getElementById("coins").innerText = coins;
document.getElementById("wallet").innerText = wallet;
}

function getRewards(){

if(wallet<=100 && coins<=50){
return [35,15,0,20,25,50,0,10,5,8,10,30];
}
else if(wallet>=500){
return [5,10,0,22,15,19,0,10,7,20,0,32];
}
return [5,10,8,20,15,9,0,12,15,25,11,30];
}

window.spin = async function(){

if(coins<10){
alert("Not enough coins");
return;
}

coins -=10;

let rewards = getRewards();
let reward = rewards[Math.floor(Math.random()*rewards.length)];

coins += reward;

// convert to wallet
if(coins>=120){
coins-=100;
wallet+=1;
}

await updateDoc(doc(db,"users",uid),{
coins:coins,
wallet:wallet
});

showPopup("You won "+reward);

updateUI();
}

window.dailyBonus = function(){
showAd(()=>{
coins+=20;
updateUI();
});
}

window.watchAdCoins = function(){
showAd(()=>{
coins+=20;
updateUI();
});
}

function showPopup(text){
let p = document.getElementById("popup");
p.innerText = text;
p.style.display="block";
setTimeout(()=>p.style.display="none",2000);
}

function showAd(callback){
let ad = document.createElement("div");
ad.innerHTML="📺 Ad...";
ad.style.position="fixed";
ad.style.top=0;
ad.style.left=0;
ad.style.width="100%";
ad.style.height="100%";
ad.style.background="black";
ad.style.color="white";
ad.style.display="flex";
ad.style.justifyContent="center";
ad.style.alignItems="center";

document.body.appendChild(ad);

setTimeout(()=>{
document.body.removeChild(ad);
callback();
},3000);
}
