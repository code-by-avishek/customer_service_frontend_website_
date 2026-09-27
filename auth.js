// ===========================================
// AUTH SYSTEM
// ===========================================

// Show / Hide Password

document.querySelectorAll(".toggle-password").forEach(button=>{

button.addEventListener("click",()=>{

const input=button.parentElement.querySelector("input");

const icon=button.querySelector("i");

if(input.type==="password"){

input.type="text";

icon.classList.replace("fa-eye","fa-eye-slash");

}else{

input.type="password";

icon.classList.replace("fa-eye-slash","fa-eye");

}

});

});

// Password Strength

const password=document.getElementById("password");

const bar=document.getElementById("strengthBar");

if(password){

password.addEventListener("input",()=>{

let value=password.value.length;

if(value<5){

bar.style.width="30%";

bar.style.background="#ff4d4d";

}else if(value<8){

bar.style.width="60%";

bar.style.background="#f7b731";

}else{

bar.style.width="100%";

bar.style.background="#2ecc71";

}

});

}

// Register Validation

const form=document.getElementById("registerForm");

if(form){

form.addEventListener("submit",(e)=>{

e.preventDefault();

const pass=document.getElementById("password").value;

const confirm=document.getElementById("confirmPassword").value;

if(pass!==confirm){

alert("Passwords do not match!");

return;

}

alert("Registration Successful! (Frontend Demo)");

form.reset();

bar.style.width="0";

});

}