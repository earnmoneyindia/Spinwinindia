import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { collection, getDocs, updateDoc, doc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

const auth = getAuth();

// 🔐 CHANGE THIS TO YOUR EMAIL
const adminEmail = "admin@earnmoneyindia.com";

onAuthStateChanged(auth, async(user)=>{

if(!user || user.email !== adminEmail){
document.body.innerHTML = "❌ Access Denied";
return;
}

loadRequests();

});


// LOAD REQUESTS
async function loadRequests(){

const snap = await getDocs(collection(db,"withdrawals"));

let html = "";

snap.forEach((d)=>{

let data = d.data();

html += `
<div style="border:1px solid #ccc;padding:10px;margin:10px">

<b>${data.name || "User"}</b><br>
Amount : ₹${data.amount}<br>
UPI : ${data.upi}<br>
Status : ${data.status}<br><br>

<button onclick="approve('${d.id}')">✅ Approve</button>
<button onclick="reject('${d.id}')">❌ Reject</button>
<button onclick="paid('${d.id}')">💰 Mark Paid</button>

</div>
`;

});

document.getElementById("requests").innerHTML = html;

}


// APPROVE
window.approve = async function(id){

await updateDoc(doc(db,"withdrawals",id),{
status:"approved"
});

alert("Approved");
location.reload();

}


// REJECT + REFUND
window.reject = async function(id){

const ref = doc(db,"withdrawals",id);
const snap = await getDoc(ref);

let data = snap.data();

// refund wallet
const userRef = doc(db,"users",data.uid);
const userSnap = await getDoc(userRef);

let currentWallet = userSnap.data().wallet || 0;

await updateDoc(userRef,{
wallet: currentWallet + data.amount
});

// update status
await updateDoc(ref,{
status:"rejected"
});

alert("Rejected & Refunded");
location.reload();

}


// MARK PAID
window.paid = async function(id){

await updateDoc(doc(db,"withdrawals",id),{
status:"paid"
});

alert("Marked as Paid");
location.reload();

}
