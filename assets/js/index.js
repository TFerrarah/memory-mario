const typed = document.getElementById("typed");

// Titles
const titles = [
  "Memory Game",
  "El juego de memoria",
  "Le jeu de mémoire",
  "u shek d la memorij"
];
//Change titles randomly every 2 seconds
setInterval(function () {
  let random = titles[Math.floor(Math.random() * titles.length)];

  document.title = random;

  typed.innerHTML = random;
  
}, 5000);

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  //Get values of checkboxes if selected
  const args = Array.from(document.querySelectorAll('input[type="checkbox"]'))
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  //Resume normal behaviour
  // Send args as JSON if present
  window.location.href =
    "./game.html" + (args.length > 0 ? "?args=" + JSON.stringify(args) : "");
});
