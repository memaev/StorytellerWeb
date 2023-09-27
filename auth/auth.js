document.addEventListener("DOMContentLoaded", function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log("User is signed in:", user.uid);

            window.location.href = '../feed.html';
            // You can access user information like user.uid, user.email, etc.
        } else {
            // No user is signed in.
            console.log("No user is signed in.");
        }
    });
});

const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle")
const main = document.querySelector("main")
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");
const textSlider = document.querySelector(".text-group");
const signInBtn = document.getElementById("sign-in-btn");
const signInForm = document.getElementById(".sign-in-form");

inputs.forEach(inp =>{
    inp.addEventListener("focus", ()=>{
         inp.classList.add("active");
    });
    inp.addEventListener("blur", ()=>{
        if (inp.value != "") return;
        inp.classList.remove("active");
    });
})

toggle_btn.forEach(btn => {
    btn.addEventListener("click", ()=>{
        main.classList.toggle("sign-up-mode");
    });
});


function moveSlider(){
    let index = this.dataset.value;
    
    let currentImage = document.querySelector(`.img-${index}`);
    images.forEach(img => img.classList.remove("show"));
    currentImage.classList.add("show");

    //choosing what text to show
    textSlider.style.transform = `translateY(${-(index-1)*2.2}rem)`;

    bullets.forEach(bull => bull.classList.remove("active"));
    this.classList.add("active");
}

bullets.forEach(bullet =>{
    bullet.addEventListener("click", moveSlider);
})

function login(){
    firebase.auth().signInWithEmailAndPassword(inputs[0].value, inputs[1].value)
        .then((userCred) => {
            const user = userCred.user;

            window.location.href = '../feed.html';
        })
        .catch((error) => {
            console.log(error.message);
        });
}
