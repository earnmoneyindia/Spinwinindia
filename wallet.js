import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

const auth = getAuth();

let wallet = 0;
let uid = "";

// LOAD USER
onAuthStateChanged(auth, async(user)=>{

if(user){

uid = user.uid;

const userRef = doc(db,"users",uid);
const snap = await getDoc(userRef);

wallet = snap.data().wallet || 0;

document.getElementById("walletBalance").innerText = wallet;

loadHistory(uid);

}

});


// WITHDRAW REQUEST
window.withdraw = async function(){

const upi = document.getElementById("upi").value;

if(upi === ""){
alert("Enter UPI ID");
return;
}

if(wallet < 200){
alert("Minimum ₹200 required");
return;
}

// deduct wallet
wallet -= 200;

await updateDoc(doc(db,"users",uid),{
wallet: wallet
});

// create request
await addDoc(collection(db,"withdrawals"),{

uid: uid,
amount: 200,
upi: upi,
status: "pending",
date: new Date().toISOString()

});

alert("✅ Withdrawal Requested");

location.reload();

};


// LOAD HISTORY
async function loadHistory(uid){

const q = query(collection(db,"withdrawals"), where("uid","==",uid));

const snap = await getDocs(q);

let html = "";

snap.forEach((doc)=>{

let data = doc.data();

html += `
<p>
₹${data.amount} - ${data.status}
</p>
`;

});

if(html === ""){
html = "No withdrawals yet";
}

document.getElementById("historyList").innerHTML = html;

}
