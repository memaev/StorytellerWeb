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

console.log("helelee");

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
                            childSnapshot.child("storyID").val(),
                            childSnapshot.child("type").val(),
                            childSnapshot.child("date").val(),
                            childSnapshot.child("text").val(), 
                            childSnapshot.child("storyTitle").val()
                        ));
                    });

                    console.log(notifications);

                    var notificationsList = document.querySelector("#notifications-list");

                    //clearing the list before adding new elements
                    // notificationsList.innerHTML = "";

                    //reversing the array to show the latest notifications first
                    notifications.reverse();

                    notifications.forEach(function (notification) {
                        var notificationItem = document.createElement("div");

                        //checking if it's notification about comment or about like
                        if (notification.type == "like") {
                            notificationItem.innerHTML = `
                <div class="like-notification">
                <p class="like-notification-text"><span class="highlighted username">${notification.username}</span> liked your story: <span class="highlighted story-title">${notification.storyTitle}</span></p>
                </div>`
                        } else {
                            notificationItem.innerHTML = `
                <div class="comment-notification">
                <p class="comment-notification-text"><span class="highlighted username">${notification.username}</span> commented on your story: <span class="highlighted story-title">${notification.storyTitle}</span></p>
                <p class="comment-notification-comment">${notification.text}</p>
                </div>`
                        }

                        notificationsList.appendChild(notificationItem);
                    });
                });
        }
    });
});

function loadComments() {

    console.log("Loading notifications...");


}

console.log("hello");

