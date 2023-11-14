class Notification {
    constructor(from, username, storyID, type, date, text, storyTitle) {
        this.from = from;
        this.username = username;
        this.storyID = storyID;
        this.type = type;
        this.date = date;
        this.text = text;
        this.storyTitle = storyTitle;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            // User is not signed in.
            console.log("User is not signed in:");

            window.location.href = '../auth/auth.html';
        } else {
            // user is signed in.
            console.log("User is signed in.", user.uid);

            firebase.database().ref("Users").child(user.uid)
                .child("notifications").once("value", function (snapshot) {
                    var notifications = [];
                    snapshot.forEach(function (childSnapshot) {
                        notifications.push(new Notification(
                            childSnapshot.child("from").val(),
                            childSnapshot.child("username").val(),
                            childSnapshot.child("storyId").val(),
                            childSnapshot.child("type").val(),
                            childSnapshot.child("date").val(),
                            childSnapshot.child("text").val(), 
                            childSnapshot.child("storyTitle").val()
                        ));
                    });

                    console.log(notifications);

                    var notificationsList = document.querySelector("#notifications-list");

                    //clearing the list before adding new elements
                    notificationsList.innerHTML = "";

                    //reversing the array to show the latest notifications first
                    notifications.reverse();

                    var notificationItem = document.createElement("div");

                    notifications.forEach(function (notification) {
                        firebase.database().ref("Stories").child(notification.storyID)
                                    .once("value", function(storySnapshot){
                                        let storyTitle = storySnapshot.child("title").val();
                                        let storyImageUrl = storySnapshot.child("imageUrl").val();
                                        let storyText = storySnapshot.child("text").val();
                                        let storyDate = storySnapshot.child("date").val();
                                        var notificationItem = document.createElement("div");
                                

                        //checking if it's notification about comment or about like
                        if (notification.type == "like") {
                            notificationItem.innerHTML = `
                <div class="like-notification">
                <p class="like-notification-text"><span class="highlighted username">${notification.username}</span> liked your story: <span class="highlighted story-title">${storyTitle}</span></p>
                <p class="comment-notification-comment" style="font-size:0.7rem;">${notification.date}</p>
                
                <div class="full-story">
                <hr style="margin:1vw;border-top: 2px solid #bbb;
                border-radius: 5px;width:96%;align-items: center;">
        
                <h2 style="margin-left: 1vw;">${storyTitle}</h2>
                <p style="margin-left: 1vw;">${storyDate}</p>

                <div>
                    <img src=${storyImageUrl} alt="Story Image" class="story-image">
                </div>

                <p class="story-text" style="margin: 10px;">${storyText}</p>
                </div>
                        </div>`
                        
                    } else {
                            notificationItem.innerHTML = `
                <div class="comment-notification">
                <p class="comment-notification-text"><span class="highlighted username">${notification.username}</span> commented on your story: <span class="highlighted story-title">${notification.storyTitle}</span></p>
                <p class="comment-notification-comment">${notification.text}</p>
                <p class="comment-notification-comment" style="font-size:0.7rem;">${notification.date}</p>

                <div class="full-story">
                <hr style="margin:15px;border-top: 2px solid #bbb;
                border-radius: 5px;width:96%;">
        
                <h2 style="margin-left: 1vw;">${storyTitle}</h2>
                <p style="margin-left: 1vw;">${storyDate}</p>

                <div>
                    <img src=${storyImageUrl} alt="Story Image" class="story-image">
                </div>

                <p class="story-text" style="margin: 10px;">${storyText}</p>
                </div>
                </div>`
                        }

                        notificationsList.appendChild(notificationItem);

                        //adding an on click listener to the story name to open full story
                        const storyTitleH = notificationItem.querySelector(".story-title");
                        const fullStoryDiv = notificationItem.querySelector(".full-story");
                        storyTitleH.addEventListener('click', ()=>{
                            fullStoryDiv.classList.toggle("opened");
                        });
                                    });
                       

                    });
                });
        }
    });
});

