// Get args from url
const url = new URL(window.location.href);
const args = JSON.parse(url.searchParams.get("args"));

const time = document.getElementById("time");

// Show elapsed time since page load in minutes:seconds
let s = 0;
let m = 0;
setInterval(function () {
    s++;
    if (s == 60) {
        m++;
        s = 0;
    }
    time.innerText = `${ m < 10 ? "0" + m : m }:${ s < 10 ? "0" + s : s }`;
}, 1000);

// Game logic

const flippedCards = []; // MAX ARRAY LENGTH = 2


// onCard click
function onCardClick(card) {
    // Add card to flipped cards array
    flippedCards.push(card);
    
    if (card.classList.contains("flipped")) {
        console.log("Flippa un'altra card.");
        return;
    }
    
    
    card.classList.toggle("flipped");
    const video = card.querySelector("video");
    video.play();

    if (flippedCards.length === 2) {
        // Check if flipped cards are the same
        if (flippedCards[0].querySelector(".back video").getAttribute("src") === flippedCards[1].querySelector(".back video").getAttribute("src")) {
            console.log("Carte uguali");
            // Remove flipped cards from array
            flippedCards.forEach(card => card.classList.add("matched"));
            flippedCards.length = 0;
        } else {
            console.log("Carte diverse");
            // Flip cards back
            flippedCards.forEach(card => card.classList.toggle("shake"));
            setTimeout(() => {
                flippedCards.forEach(card => card.classList.remove("flipped", "shake"));
                flippedCards.length = 0;
            }, 1000);
        }
    }
        
}


//match check


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