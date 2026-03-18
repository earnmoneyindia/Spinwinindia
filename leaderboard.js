import { db } from "./firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const snap = await getDocs(collection(db,"users"));

let html="";

snap.forEach(d=>{
let data = d.data();
html += `<p>${data.name} - ₹${data.wallet}</p>`;
});

document.getElementById("list").innerHTML = html;
