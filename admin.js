import { db } from "./firebase.js";
import { collection, getDocs, doc, updateDoc, deleteDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let list = document.getElementById("list");

async function load(){

let snap = await getDocs(collection(db,"withdrawRequests"));

snap.forEach(docSnap=>{

let d = docSnap.data();

let div = document.createElement("div");

div.innerHTML = `
<p>UID: ${d.uid}</p>
<p>Amount: ₹${d.amount}</p>
<p>UPI: ${d.upi}</p>

<button onclick="approve('${docSnap.id}','${d.uid}',${d.amount})">Approve</button>
<button onclick="reject('${docSnap.id}')">Reject</button>
<hr>
`;

list.appendChild(div);

});

}

window.approve = async function(id, uid, amount){

alert("💰 Send money manually via UPI");

await updateDoc(doc(db,"withdrawRequests",id),{
status:"approved"
});

};

window.reject = async function(id){

await deleteDoc(doc(db,"withdrawRequests",id));

alert("❌ Rejected");

};

load();
