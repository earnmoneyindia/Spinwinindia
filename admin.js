import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { collection, getDocs, updateDoc, doc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";


const auth = getAuth();

const adminEmail = "admin@earnmoneyindia.com";


auth.onAuthStateChanged(async(user)=>{

if(!user || user.email != adminEmail){

document.body.innerHTML = "Access Denied";

return;

}

loadRequests();

});



async function loadRequests(){

const snap = await getDocs(collection(db,"withdrawals"));

let html="";

snap.forEach((d)=>{

let data = d.data();

html += `

<div style="border:1px solid #ccc;padding:10px;margin:10px">

<b>${data.name}</b><br>

Amount : ₹${data.amount}<br>

UPI : ${data.upi}<br>

Status : ${data.status}<br>

<button onclick="approve('${d.id}')">Approve</button>

<button onclick="reject('${d.id}')">Reject</button>

<button onclick="paid('${d.id}')">Mark Paid</button>

</div>

`;

});

document.getElementById("requests").innerHTML = html;

}



window.approve = async function(id){

await updateDoc(doc(db,"withdrawals",id),{

status:"approved"

});

location.reload();

}



window.reject = async function(id){

await updateDoc(doc(db,"withdrawals",id),{

status:"rejected"

});

location.reload();

}



window.paid = async function(id){

await updateDoc(doc(db,"withdrawals",id),{

status:"paid"

});

location.reload();

}
