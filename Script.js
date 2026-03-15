let wheel=document.getElementById("wheel");

let coins=parseInt(localStorage.getItem("coins")) || 100;

document.getElementById("coins").innerText=coins;

let rewards=[5,10,20,0,15,50];

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

function updateCoins(){

document.getElementById("coins").innerText=coins;

localStorage.setItem("coins",coins);

}

function showPopup(text){

document.getElementById("resultText").innerText=text;

document.getElementById("popup").style.display="flex";

}

function closePopup(){

document.getElementById("popup").style.display="none";

}

function dailyBonus(){

let today=new Date().toDateString();

let last=localStorage.getItem("daily");

if(last==today){

alert("Today's bonus already claimed!");

return;

}

coins+=20;

updateCoins();

localStorage.setItem("daily",today);

alert("🎁 Daily Bonus: 20 coins");

}
