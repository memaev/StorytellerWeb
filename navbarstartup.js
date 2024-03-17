const firebaseConfig = {
    apiKey: "AIzaSyBZNYifsu-YQUbDY_gjPS-PB6aBaLrWXSk",
    authDomain: "storiesapp-b9fad.firebaseapp.com",
    databaseURL: "https://storiesapp-b9fad-default-rtdb.firebaseio.com",
    projectId: "storiesapp-b9fad",
    storageBucket: "storiesapp-b9fad.appspot.com",
    messagingSenderId: "359429738160",
    appId: "1:359429738160:web:efc01da509587c0de13575",
    measurementId: "G-7JN6HLBSZB"
};

firebase.initializeApp(firebaseConfig);

const body = document.querySelector("body")
sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    modeSwitcher = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text"),
    sunMoonIcon = body.querySelector("#sun-moon-icon"),
    logoutBtn = body.querySelector("#logout-btn");


toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
})

modeSwitcher.addEventListener("click", () => {
    body.classList.toggle("dark");
})

function logout() {
    firebase.auth().signOut().then(function () {
        window.location.href = "../auth/auth.html";
    })
}