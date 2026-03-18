let coins = 100;
let wallet = 0;

let spinCount = 0;
let totalSpins = 0;

const rewardsDefault = [5,10,0,20,15,9,0,12,15,25,11,30];

function updateUI(){
document.getElementById("userInfo").innerHTML =
"Coins: "+coins+" | Wallet: ₹"+wallet;
}

function getRewards(){

if(wallet <=100 && coins <=50){
return [35,15,0,20,25,50,0,10,5,8,10,30];
}

else if(wallet >=500){
return [5,10,0,22,15,19,0,10,7,20,0,32];
}

return rewardsDefault;
}

function spin(){

if(coins < 10){
alert("Not enough coins");
return;
}

coins -=10;

spinCount++;
totalSpins++;

let rewards = getRewards();
let rand = Math.floor(Math.random()*rewards.length);
let reward = rewards[rand];

// 🎯 Ad every 10 spins
if(spinCount % 10 === 0){
showAd(()=>{
coins += reward;
finishSpin(reward);
});
}else{
coins += reward;
finishSpin(reward);
}

}

function finishSpin(reward){

// wallet convert
if(coins >=120){
coins -=100;
wallet +=1;
}

document.getElementById("result").innerText =
"You won "+reward+" coins";

playWin();

updateUI();
}

function dailyBonus(){
showAd(()=>{
coins +=20;
updateUI();
alert("20 coins added");
});
}

// Fake Ad
function showAd(callback){

let ad = document.createElement("div");

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

ad.innerHTML="📺 Ad Playing...";

document.body.appendChild(ad);

setTimeout(()=>{
document.body.removeChild(ad);
callback();
},3000);

}

// sounds
function playWin(){
let audio = new Audio("sounds/win.mp3");
audio.play();
}

updateUI();
