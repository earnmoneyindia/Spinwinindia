import { getAuth, signInWithPopup, GoogleAuthProvider }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();
const provider = new GoogleAuthProvider();

window.login = async function(){

const result = await signInWithPopup(auth,provider);

localStorage.setItem("user", result.user.displayName);

window.location.href="index.html";

}
