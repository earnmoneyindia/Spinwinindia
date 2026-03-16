import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let wheel = document.getElementById("wheel");

let coins = 0;

let rewards=[5,10,20,0,15,50];


// LOAD COINS FROM FIREBASE

async function loadCoins(){

const userRef = doc(window.db,"users","testuser");

const snap = await getDoc(userRef);

if(snap.exists()){

coins = snap.data().coins;

document.getElementById("coins").innerText = coins;

}

}

loadCoins();


// SAVE COINS

async function saveCoins(){

const userRef = doc(window.db,"users","testuser");

await updateDoc(userRef,{

coins: coins

});

}


// UPDATE COINS UI

function updateCoins(){

document.getElementById("coins").innerText=coins;

saveCoins();

}


// SPIN FUNCTION

function spin(){

if(coins<10){

alert("Not enough coins!");

return;

}

coins-=10;

updateCoins();

let rand=Math.floor(Math.random()*rewards.length);

let deg=720+rand*60;

wheel.style.transform="rotate("+deg+"deg)";

setTimeout(()=>{

let reward=rewards[rand];

coins+=reward;

updateCoins();

showPopup("🎉 You won "+reward+" coins!");

},4000);

}


// POPUP

function showPopup(text){

document.getElementById("resultText").innerText=text;

document.getElementById("popup").style.display="flex";

}


// CLOSE POPUP

function closePopup(){

document.getElementById("popup").style.display="none";

}


// DAILY BONUS

async function dailyBonus(){

let today=new Date().toDateString();

const userRef = doc(window.db,"users","testuser");

const snap = await getDoc(userRef);

let last = snap.data().daily;

if(last==today){

alert("Today's bonus already claimed!");

return;

}

coins+=20;

await updateDoc(userRef,{

coins: coins,

daily: today

});

updateCoins();

alert("🎁 Daily Bonus: 20 coins");

}
