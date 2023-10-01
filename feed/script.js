class Story {
    constructor(date, from, id, imageUrl, text, title, likes=[]) {
        this.date = date;
        this.from = from;
        this.id = id;
        this.imageUrl = imageUrl;
        this.text = text;
        this.title = title;
        this.likes = likes;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            // User is signed in.
            console.log("User is not signed in:");

            window.location.href = '../auth/auth.html';
        } else {
            // No user is signed in.
            console.log("User is signed in.", user.uid);
        }
    });
});

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

//loading all stories
var storiesRef = firebase.database().ref("Stories");

function displayStories(stories) {
    var storiesListV = document.getElementById("stories-list");
    storiesListV.innerHTML = "";

    //for each through all stories
    stories.forEach(function (story) {


        //loading and displaying new story
        var storyItem = document.createElement("div");
        storyItem.innerHTML = `
        <div class="story-item">
        <div class="title-date-div">
            <h2 class="story-title">${story.title}</h2>
            <h2 class="story-release-date">${story.date}</h2>
        </div>

        <div>
            <img src="${
                (!story.imageUrl) ? "../assets/default-image.jpg" : story.imageUrl
            }" alt="Story Image" class="story-image">
        </div>
        <div class="bottom-actions">
        <div class="story-buttons">
            <button class="comment-btn">
                <img src="../assets/comment_icon.svg" />
            </button>
            <button class="read-btn">
                <img src="../assets/read-icon.svg" id="read-icon-img"/>
            </button>
            <button class="like-btn">
                <i class='bx bxs-heart ${
                    //if this user already put his like
                    story.likes.includes(firebase.auth().currentUser.uid) ? "clicked" : ""
                }' ></i>
                <h4 class="likes-count">${story.likes.length}</h4>
            </button>
        </div>
        </div>
    </div>
        `;

        //adding an on click listener on like btn
        const likeBtn = storyItem.querySelector('.like-btn');
        const likeImg = storyItem.querySelector('.bxs-heart');
        const likesCount = storyItem.querySelector('.likes-count')
        likeBtn.addEventListener('click', ()=>{
            if (story.likes.includes(firebase.auth().currentUser.uid)){
                story.likes = story.likes.filter((element)=>element!==firebase.auth().currentUser.uid);
                
                //changing likes count and toggling the like btn
                likesCount.textContent = story.likes.length;
                likeImg.classList.toggle('clicked');

                //removing like from the DB
                firebase.database().ref("Stories").child(story.id).child("likes")
                    .child(firebase.auth().currentUser.uid).remove().then(()=>{
                        console.log("Data removed successfully");
                    }).catch((error)=>{
                        console.error("Error removing data: ", error);
                    })
            }else{
                //adding user's like locally
                story.likes.push(firebase.auth().currentUser.uid);

                //changing likes count and toggling the like btn
                likesCount.textContent = story.likes.length;
                likeImg.classList.toggle('clicked');
                
                //adding like to the DB
                firebase.database().ref("Stories").child(story.id).child("likes")
                .child(firebase.auth().currentUser.uid).set("");
            }
            
        });

        storiesListV.appendChild(storyItem);
    });


}

storiesRef.once('value', function (snapshot) {
    console.log(firebase.auth().currentUser.uid);

    var stories = [];
    snapshot.forEach(function (childSnapshot) {
        var likes = [];
        if (childSnapshot.child("likes").exists()){
            console.log("Exists");
            childSnapshot.child("likes").forEach(function(likesSnapshot){
                likes.push(likesSnapshot.key);
            });
        }else{
            console.log("Does not exist");
        }
        
        stories.push(
            new Story(
                childSnapshot.child("date").val(),
                childSnapshot.child("from").val(),
                childSnapshot.child("id").val(),
                childSnapshot.child("imageUrl").val(),
                childSnapshot.child("text").val(),
                childSnapshot.child("title").val(), 
                likes
            )
        );
    });
    stories.reverse()
    displayStories(stories);
});

function putLike(){

}