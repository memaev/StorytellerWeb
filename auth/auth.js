const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle")
const main = document.querySelector("main")
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");
const textSlider = document.querySelector(".text-group");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const bioInput = document.querySelector("#bio");
const passwordInput = document.querySelector("#password");
const loader = document.querySelector("#preloader");

inputs.forEach(inp => {
    inp.addEventListener("focus", () => {
        inp.classList.add("active");
    });
    inp.addEventListener("blur", () => {
        if (inp.value != "") return;
        inp.classList.remove("active");
    });
})

toggle_btn.forEach(btn => {
    btn.addEventListener("click", () => {
        main.classList.toggle("sign-up-mode");
    });
});


function moveSlider() {
    let index = this.dataset.value;

    let currentImage = document.querySelector(`.img-${index}`);
    images.forEach(img => img.classList.remove("show"));
    currentImage.classList.add("show");

    //choosing what text to show
    textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;

    bullets.forEach(bull => bull.classList.remove("active"));
    this.classList.add("active");
}

bullets.forEach(bullet => {
    bullet.addEventListener("click", moveSlider);
})

function login() {
    //fields cannot be empty
    if (inputs[0].value.trim()=='' || inputs[1].value.trim()==''){
        alert("Fields cannot be empty");
        return;
    }

    //hiding the main view and enabling the loader
    main.classList.toggle("invisible");
    loader.classList.toggle("invisible");

    firebase.auth().signInWithEmailAndPassword(inputs[0].value, inputs[1].value)
        .then((userCred) => {
            const user = userCred.user;

            window.location.href = '../feed/feed.html';
        })
        .catch((error) => {
            console.log(error.message);
        });
}


function signUp() {

    //fields cannot be empty
    if (emailInput.value.trim()=='' || passwordInput.value.trim()=='' || nameInput.value.trim()=='' || bioInput.value.trim()==''){
        alert("Fields cannot be empty");
        return;
    }

    //hiding the main view and enabling the loader
    main.classList.toggle("invisible");
    loader.classList.toggle("invisible");
    
    const userData = {
        "email": emailInput.value,
        "username": nameInput.value,
        "bio": bioInput.value,
        "likes": 0,
        "stories": "",
        "storiesCount": 0
    };

    firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function (userCred) {
            const user = userCred.user;

            console.log(user.uid);

            firebase.database().ref("Users/"+user.uid).set(userData);

            window.location.href = "../feed/feed.html";
        }).catch(function (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Sign-up error:', errorCode, errorMessage);
        });
}