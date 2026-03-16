import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, getDoc, collection, addDoc, query, where, getDocs } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";


const auth = getAuth();

let wallet = 0;


auth.onAuthStateChanged(async(user)=>{

if(user){

const uid = user.uid;

const userRef = doc(db,"users",uid);

const snap = await getDoc(userRef);

wallet = snap.data().wallet;

document.getElementById("walletBalance").innerText = wallet;


loadHistory(uid);

}

});



window.withdraw = async function(){

const upi = document.getElementById("upi").value;

if(upi == ""){

alert("Enter UPI ID");

return;

}

if(wallet < 200){

alert("Minimum ₹200 required");

return;

}


const user = auth.currentUser;

await addDoc(collection(db,"withdrawals"),{

uid:user.uid,

name:user.displayName,

email:user.email,

amount:200,

upi:upi,

status:"pending",

date:new Date().toLocaleDateString()

});


alert("Withdrawal request submitted");

location.reload();

}



async function loadHistory(uid){

const q = query(collection(db,"withdrawals"), where("uid","==",uid));

const snap = await getDocs(q);

let html="";

snap.forEach(doc=>{

let data = doc.data();

html += `

<p>

₹${data.amount} - ${data.status}

</p>

`;

});


if(html==""){

html="No withdrawals yet";

}


document.getElementById("historyList").innerHTML = html;

}
