const body = document.querySelector("body")
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    modeSwitcher = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text"),
    sunMoonIcon = body.querySelector("#sun-moon-icon");


    toggle.addEventListener("click", ()=>{
        sidebar.classList.toggle("close");  
    })

    modeSwitcher.addEventListener("click", ()=>{
        body.classList.toggle("dark");  
    })