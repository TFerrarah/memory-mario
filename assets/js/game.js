// Get args from url
const url = new URL(window.location.href);
const args = JSON.parse(url.searchParams.get("args"));

const time = document.getElementById("time");

// Show elapsed time since page load in minutes:seconds
let s = 0;
let m = 0;
const timeInterval = setInterval(function () {
    s++;
    if (s == 60) {
        m++;
        s = 0;
    }
    time.innerText = `${ m < 10 ? "0" + m : m }:${ s < 10 ? "0" + s : s }`;
}, 1000);

// Game logic

const flippedCards = []; // MAX ARRAY LENGTH = 2

let moves = 0;

// onCard click
function onCardClick(card) {
    // Mute all videos if "mute" is contained in args
    if (args && args.includes("Mute")) {
        document.querySelectorAll("video").forEach(video => video.muted = true);
    }

    //Temporarily remove event listener from every other card to prevent multiple clicks
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => card.removeEventListener("click", onCardClick));


    
    if (card.classList.contains("flipped")) {
        console.log("Flippa un'altra card.");
        return;
    }

    // Add card to flipped cards array
    flippedCards.push(card);
    
    card.classList.toggle("flipped");
    const video = card.querySelector("video");
    video.play();

    //Game logic
    if (flippedCards.length === 2) {

        // Add a move
        moves++;
        
        // Add a class to prevent clicks on other cards
        cards.forEach(card => card.style.pointerEvents = "none");
        
        // Check if flipped cards are the same
        if (flippedCards[0].querySelector(".back video").getAttribute("src") === flippedCards[1].querySelector(".back video").getAttribute("src")) {
            // Remove flipped cards from array
            flippedCards.forEach(card => card.querySelector('.back').classList.add("matched"));
            flippedCards.length = 0;
            // Enable other cards to be clicked again
            cards.forEach(card => card.style.pointerEvents = "unset");
        } else {
            // Flip cards back
            setTimeout(() => {
                flippedCards.forEach(card => card.classList.toggle("shake"));
            },500);    
            setTimeout(() => {
                flippedCards.forEach(card => card.classList.remove("flipped", "shake"));
                flippedCards.length = 0;
                // Enable other cards to be clicked again
                cards.forEach(card => card.style.pointerEvents = "unset");
            }, 700);
        }

        

        // Check if every card is matched
        //      Win condition
        if (Array.from(cards).every(card => card.querySelector(".back").classList.contains("matched"))) {
            //Stop time
            clearInterval(timeInterval);
            console.log("you won in " + time.innerText + " using " + moves + " moves");
            // Set time color to green
            time.style.color = "var(--success)";
            time.classList.add("blink");
            // Set opacity of container to 0 with a transition
            document.querySelector(".cards").style.opacity = 0;

            // Remove every child from container
            document.querySelector(".cards").innerHTML = "";

            // Add new div with text
            const winScreen = document.createElement("div");
            winScreen.classList.add("win-screen");
            winScreen.innerHTML = `
                <h1>You won!</h1>
                <h3>You won in ${ time.innerText } using ${ moves } moves</h3>
                <a href="./index.html">Play again</a>
            `;
            
            // Set opacity of container back to 100
            document.querySelector(".cards").style.opacity = 1;
            document.querySelector(".cards").appendChild(winScreen);
        }
    }
    // Set back event listener
    cards.forEach(card => card.addEventListener("click", onCardClick));
}

// Page intitialization

document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => onCardClick(card));
});

//card sorting

// Names of files to be loaded as videos in cards
const sources = ["1.mp4", "2.mp4", "3.mp4", "4.mp4", "5.mp4", "6.mp4"];

const card = (source) => {
  const cardsContainer = document.querySelector(".cards");
  const card = document.createElement("div");
  card.classList.add("card");
  card.onclick = () => onCardClick(card);
  card.innerHTML = `
    <div class="content">
        <div class="front">
            ?
        </div>
        <div class="back">
            <video src="./assets/video/${source}" width="100%" height="100%" autoplay="false" data-played="false">
                <source src="./assets/video/${source}" type="video/mp4">
                Your browser does not support HTML5 video.
            </video>
        </div>
    </div>
  `;
  cardsContainer.appendChild(card); // add card to container
  return card;
};

//Generate 6 pair of cards
const cards = [];

for (let i = 0; i < sources.length; i++) {
    cards.push(card(sources[i]), card(sources[i]));
}

//Shuffle cards array
cards.sort(() => Math.random() - 0.5);

//Add shuffled cards to container
document.querySelector(".cards").append(...cards);

//Return every video to first frame on video end
document.querySelectorAll("video").forEach(video => {
    video.onended = () => {
        video.currentTime = 0;
        video.pause();
    };
});