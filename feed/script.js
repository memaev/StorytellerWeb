class Story {
    constructor(date, from, id, imageUrl, text, title, likes = []) {
        this.date = date;
        this.from = from;
        this.id = id;
        this.imageUrl = imageUrl;
        this.text = text;
        this.title = title;
        this.likes = likes;
    }
}

class Comment {
    constructor(text, username, date, from) {
        this.text = text;
        this.username = username;
        this.date = date;
        this.from = from;
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


function loadComments(commentsList, story) {
    //getting all comments from database
    storiesRef.child(story.id).child("comments").once('value', function (snapshot) {
        var comments = [];
        snapshot.forEach(function (childSnapshot) {
            comments.push(
                new Comment(
                    childSnapshot.child("text").val(),
                    childSnapshot.child("username").val(),
                    childSnapshot.child("date").val(),
                    childSnapshot.child("from").val()
                )
            );
        });

        displayComments(commentsList, comments);
    });
}

function displayComments(commentsList, comments) {
    //clearing comments list
    commentsList.innerHTML = "";

    //reversing the comments in order to have the latest on top
    comments.reverse();

    //displaying all comments to the page
    comments.forEach(function (comment) {
        var commentItem = document.createElement("div");
        commentItem.innerHTML = `
    <div class="comment">
            <div class="comment-header">
                <h4 class="comment-username">${comment.username}</h4>
                <h5 class="sent-time">${comment.date}</h4>
            </div>
            <div class="comment-body">
                <p class="comment-text">${comment.text}</p>
            </div>
        </div>
    `;

        commentsList.appendChild(commentItem);
    });
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
        <div class="story-comments-item">
        <div class="story-item">
        <div class="title-date-div">
            <h2 class="story-title">${story.title}</h2>
            <h2 class="story-release-date">${story.date}</h2>
        </div>

        <div>
            <img src="${(!story.imageUrl) ? "../assets/default-image.jpg" : story.imageUrl
            }" alt="Story Image" class="story-image">
        </div>
        <div class="bottom-actions">
        <div class="story-buttons">
            <button class="comment-btn">
                <i class='bx bx-comment'></i>
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
    <div class="full-story">
            <div class="full-story-header">
                <h2 id="full-story-title">Story Title</h2>
                <i class='bx bx-x close-full-story-btn'></i>
            </div>
            <div class="full-story-body">
                <p id="full-story-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra tincidunt ex eget finibus. Morbi consequat hendrerit elit sed facilisis. Nam vitae posuere lacus. Donec molestie facilisis tempus. Curabitur lacus leo, ultricies ac lorem quis, tempus imperdiet lorem. Vestibulum nec cursus dui, vitae dictum neque. Vivamus nec sem eu leo viverra tincidunt egestas vel sem. Nunc blandit sed orci sit amet varius. Donec fringilla, nisi eu vulputate sollicitudin, odio est porttitor tellus, ut consectetur arcu nibh eu libero. Morbi lacinia enim nulla, ac porttitor lacus ornare convallis. Fusce eget magna nec risus viverra tristique. Aliquam eu eros libero. Vivamus ligula velit, dignissim tincidunt arcu at, porta consectetur nulla.

                Aenean vel felis nibh. Proin vitae convallis arcu, blandit suscipit lacus. Duis quis mi odio. Morbi et erat eu ipsum finibus ultrices vel posuere justo. Mauris in orci vitae risus commodo hendrerit. Fusce sit amet ex tempor, faucibus sem non, elementum nibh. Vestibulum id sagittis odio.
                
                Morbi sed pharetra magna. Suspendisse id pellentesque tellus. Sed dignissim ultricies erat et tristique. Mauris et diam condimentum, vehicula turpis interdum, efficitur mi. In hac habitasse platea dictumst. Aenean nec velit massa. Maecenas vitae consectetur turpis, sit amet bibendum tellus. Vestibulum ut bibendum enim, ut tristique sapien. Donec turpis odio, porttitor ac tellus nec, eleifend consectetur magna. Fusce semper, risus a congue placerat, quam leo sollicitudin mi, ac placerat velit quam vitae purus. Quisque eget sagittis leo, a fermentum mauris. Mauris fermentum ultricies vehicula. Aenean feugiat et est tempus ornare. Morbi tincidunt, orci id luctus auctor, turpis ipsum fermentum tellus, quis lobortis mi arcu nec sapien.
                
                Nulla at massa ultrices, gravida eros nec, vestibulum purus. Vestibulum vitae consequat lacus. Nam et est eget felis iaculis lobortis. Vivamus sed vestibulum justo, eu consequat nibh. Mauris nulla est, lobortis condimentum lacus non, suscipit suscipit ipsum. Donec condimentum commodo dictum. Vivamus lacus massa, ultrices id commodo ut, tincidunt ut augue. Nam volutpat nisl nec felis imperdiet lacinia. Quisque in rhoncus velit, ac fringilla neque. Ut non lectus semper nisl condimentum imperdiet. Praesent eu est quam. Proin dignissim nunc vitae aliquam fermentum. Mauris consectetur libero in condimentum pretium. Morbi lectus purus, lacinia ac laoreet eget, tristique vehicula lacus.
                
                Proin congue velit et nulla ultrices, non aliquet enim aliquet. Vestibulum tincidunt at nisi at pretium. Donec tempus aliquam blandit. Vestibulum sed nisi risus. Ut dapibus maximus ultricies. Proin et bibendum ante. Nunc dui sem, sagittis in aliquet in, pellentesque at purus. Vestibulum vehicula elit accumsan, placerat nisi vitae, faucibus erat. Etiam ac finibus mauris. Nam eleifend pellentesque consectetur. Mauris a lectus eget ligula volutpat porta.</p>
            </div>
        </div>
    <div class="comments">
            <div class="comments-header">
                <h2 id="comments-title">Comments</h2>
                <i class='bx bx-x close-comments-btn'></i>
            </div>

            <div class="comments-list">
            
            </div>

            <div class="comment-input">
                <textarea class="multiline-input" placeholder="Comment..."
                    ></textarea>
                <button><i class='bx bx-send send-btn'></i></button>
            </div>
            
        </div>
    </div>
        `;

        //adding an on click listener on like btn
        const likeBtn = storyItem.querySelector('.like-btn');
        const likeImg = storyItem.querySelector('.bxs-heart');
        const likesCount = storyItem.querySelector('.likes-count')
        likeBtn.addEventListener('click', () => {
            if (story.likes.includes(firebase.auth().currentUser.uid)) {
                story.likes = story.likes.filter((element) => element !== firebase.auth().currentUser.uid);

                //changing likes count and toggling the like btn
                likesCount.textContent = story.likes.length;
                likeImg.classList.toggle('clicked');

                

                //removing like from the DB
                firebase.database().ref("Stories").child(story.id).child("likes")
                    .child(firebase.auth().currentUser.uid).once("value")
                    .then((snapshot)=>{
                        const notificationID = snapshot.val();

                        //removing like from the DB
                        firebase.database().ref("Stories").child(story.id).child("likes")
                            .child(firebase.auth().currentUser.uid).remove();

                        //removing notification about like
                        firebase.database().ref("Users").child(story.from).child("notifications")
                            .child(notificationID).remove();
                    });
            } else {
                //adding user's like locally
                story.likes.push(firebase.auth().currentUser.uid);

                //changing likes count and toggling the like btn
                likesCount.textContent = story.likes.length;
                likeImg.classList.toggle('clicked');


                firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("username")
                    .once("value").then((snapshot) => {
                        const username = snapshot.val();

                        //sending the notification about like to the story's author
                        const notificationInfo = {};
                        notificationInfo["from"] = firebase.auth().currentUser.uid;
                        notificationInfo["username"] = username;
                        notificationInfo["storyID"] = story.id;
                        notificationInfo["type"] = "like";
                        notificationInfo["date"] = new Date().toLocaleString();
                        notificationInfo["text"] = "";

                        //pushing data to the database
                        firebase.database().ref("Users").child(story.from).child("notifications")
                            .push(notificationInfo).then((snapshot) => {
                                //adding like to the DB
                                firebase.database().ref("Stories").child(story.id).child("likes")
                                    .child(firebase.auth().currentUser.uid).set(snapshot.key);
                            }).catch((error) => {
                                console.error("Error adding data: ", error);
                            });
                    });

            }

        });

        // main story item
        const storyItemDiv = storyItem.querySelector(".story-item");

        //read story btn
        const readBtn = storyItem.querySelector(".read-btn");
        const fullStory = storyItem.querySelector(".full-story");
        const fullStoryTitle = storyItem.querySelector("#full-story-title");
        const fullStoryText = storyItem.querySelector("#full-story-text");
        const closeFullStoryBtn = storyItem.querySelector(".close-full-story-btn");

        readBtn.addEventListener('click', () => {
            //checking if the comments tab is opened and closing if it is
            if (comments.classList.contains("comments-opened")) {
                storyItemDiv.classList.toggle("comments-opened");
                comments.classList.toggle("comments-opened");
            }

            fullStory.classList.toggle("full-story-opened");
            storyItemDiv.classList.toggle("full-story-opened");

            //displaying story's data
            fullStoryTitle.textContent = story.title;
            fullStoryText.textContent = story.text;
        });

        closeFullStoryBtn.addEventListener('click', () => {
            //closing the full story tab if it's opened
            if (fullStory.classList.contains("full-story-opened")) {
                fullStory.classList.toggle("full-story-opened");
                storyItemDiv.classList.toggle("full-story-opened");
            }
        });

        //comments btn
        const commentBtn = storyItem.querySelector(".comment-btn");
        const comments = storyItem.querySelector(".comments");
        const closeCommentsBtn = storyItem.querySelector(".close-comments-btn");

        commentBtn.addEventListener('click', () => {
            //checking if the full story tab is opened and closing if it is
            if (fullStory.classList.contains("full-story-opened")) {
                fullStory.classList.toggle("full-story-opened");
                storyItemDiv.classList.toggle("full-story-opened");
            }

            storyItemDiv.classList.toggle("comments-opened");
            comments.classList.toggle("comments-opened");

            //loading comments only if comments are opened
            if (storyItemDiv.classList.contains("comments-opened")) {
                //loading comments
                const commentsList = storyItem.querySelector(".comments-list");

                loadComments(commentsList, story);

                const commentInput = storyItem.querySelector(".multiline-input");
                const sendBtn = storyItem.querySelector(".send-btn");

                //adding an on click listener on send btn
                sendBtn.addEventListener('click', () => {
                    if (commentInput.value.trim() !== "") {
                        const comment = commentInput.value.trim();
                        commentInput.value = "";

                        firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("username")
                            .once("value").then((snapshot) => {
                                const username = snapshot.val();

                                //adding comment to the DB
                                firebase.database().ref("Stories").child(story.id).child("comments")
                                    .push({
                                        text: comment,
                                        username: username,
                                        date: new Date().toLocaleString(),
                                        from: firebase.auth().currentUser.uid
                                    }).then(() => {
                                        console.log("Data added successfully");
                                    }).catch((error) => {
                                        console.error("Error adding data: ", error);
                                    })

                                loadComments(commentsList, story);

                                //sending notification about comment
                                const notificationInfo = {};
                                notificationInfo["from"] = firebase.auth().currentUser.uid;
                                notificationInfo["username"] = username;
                                notificationInfo["storyID"] = story.id;
                                notificationInfo["type"] = "comment";
                                notificationInfo["date"] = new Date().toLocaleString();
                                notificationInfo["text"] = comment;

                                //pushing data to the database
                                firebase.database().ref("Users").child(story.from).child("notifications")
                                    .push(notificationInfo).then(() => {
                                        console.log("Data added successfully");
                                    }).catch((error) => {
                                        console.error("Error adding data: ", error);
                                    });


                            });

                    }
                });
            }

        })

        closeCommentsBtn.addEventListener('click', () => {
            if (storyItemDiv.classList.contains("comments-opened")) {
                storyItemDiv.classList.toggle("comments-opened");
                comments.classList.toggle("comments-opened");
            }
        })

        storiesListV.appendChild(storyItem);
    });
}

storiesRef.once('value', function (snapshot) {
    console.log(firebase.auth().currentUser.uid);

    var stories = [];
    snapshot.forEach(function (childSnapshot) {
        var likes = [];
        if (childSnapshot.child("likes").exists()) {
            console.log("Exists");
            childSnapshot.child("likes").forEach(function (likesSnapshot) {
                likes.push(likesSnapshot.key);
            });
        } else {
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


// Function to automatically resize the textarea as content changes
function autoResize(textarea) {
    textarea.style.height = "auto"; // Reset height to auto
    textarea.style.height = (textarea.scrollHeight) + "px"; // Set the new height based on content
}