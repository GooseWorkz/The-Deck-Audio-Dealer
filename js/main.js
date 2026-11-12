// JS scripts placed here
const slot = document.getElementById("slot");
const deck = document.getElementById("deck");
const cardTemplate = document.getElementById("cardTemplate");
const podcastPlayer = document.getElementById("podcastPlayer");
const spotifyPlayer = document.getElementById("spotifyPlayer");


const cards = [
  {rank: "6", suit: "spades", effect: "effect-spin" },
  {rank: "9", suit: "hearts", effect: "effect-spin" },
  { rank: "10", suit: "diamonds", effect: "effect-spin" },
  { rank: "5", suit: "spades", effect: "effect-spin" },
];

const firstCardImage = {
  src: "img/sharonglover.png",
  alt: "Sharon-Glover",
  name: "Sharon Glover",
  date: "November 14, 1993",
};

const secondCardImage = {
  src: "img/luthermeshell.png",
  alt: "Luther-Meshell",
  name: "Luther Meshell",
  date: "Spring 1991",
};

const thirdCardImage = {
  src: "img/robertgenejones.png",
  alt: "Robert-Gene-Jones",
  name: "Robert Gene Jones",
  date: "Winter 2002",
};

const fourthCardImage = {
  src: "img/sandraannburris.png",
  alt: "Sandra-Ann-Burris",
  name: "Sandra Ann Burris",
  date: "Summer 2005",
};

const shreveportPortrait = {
  src: "img/shreveport.png",
  alt: "Shreveport, Louisiana",
  name: "Shreveport",
  date: "Louisiana",
};

const bethanyPortrait = {
  ...shreveportPortrait,
  name: "Bethany",
};

const stLandryPortrait = {
  src: "img/stlandry.png",
  alt: "St. Landry Parish, Louisiana",
  name: "St. Landry Parish",
  date: "Louisiana",
};

const portraitsByCard = {
  "6-spades": firstCardImage,
  "9-hearts": secondCardImage,
  "10-diamonds": thirdCardImage,
  "5-spades": fourthCardImage,
};

const podcastsByCard = {
  "6-spades": "https://open.spotify.com/embed/episode/0VGqYblvfbYawY68PlZRtA",
  "9-hearts": "https://open.spotify.com/embed/episode/2A1FbDMLNT8MMWEHJb6RGh",
  "10-diamonds": "https://open.spotify.com/embed/episode/4XiCMkzxqSuNEBNE1rd5Sq",
  "5-spades": "https://open.spotify.com/embed/episode/37E7f4vgGhp43piToShanA",
};


const suitSymbols = {
  hearts: "\u2665",
  diamonds: "\u2666",
  clubs: "\u2663",
  spades: "\u2660",
};

function shuffle(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

const shuffledCards = shuffle([...cards]);
let dealtCount = 0;

deck.addEventListener("click", () => {
  if (shuffledCards.length === 0) return;

  const cardInfo = shuffledCards.pop();
  const cardKey = `${cardInfo.rank}-${cardInfo.suit}`;
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  card.classList.add("dealing");
  card.style.zIndex = String(++dealtCount);

  const podcastUrl = podcastsByCard[cardKey];
  if (!podcastUrl) {
    throw new Error(`No Spotify episode is configured for ${cardKey}`);
  }
  spotifyPlayer.src = podcastUrl;
  spotifyPlayer.title = `Spotify episode for ${cardInfo.rank} of ${cardInfo.suit}`;
  podcastPlayer.hidden = false;
  document.body.classList.add("podcast-visible");

  const details = card.querySelector(".card-details");
  const portraitImage = portraitsByCard[cardKey];
  const portrait = card.querySelector(".card-portrait");
  portrait.classList.toggle("card-portrait-small", dealtCount >= 2 && dealtCount <= 4);
  portrait.classList.toggle("card-portrait-fourth", dealtCount === 4);
  portrait.hidden = false;
  const nameLabel = card.querySelector(".portrait-name-top");
  const dateLabel = card.querySelector(".portrait-name-bottom");
  const typewriterLabels = [nameLabel, dateLabel];
  let showingAlternatePortrait = false;

portrait.classList.toggle(
  "card-portrait-six-spades",
  cardInfo.rank === "6" && cardInfo.suit === "spades"
);

  function showPortrait(info) {
    portrait.src = info.src;
    portrait.alt = info.alt;
    nameLabel.textContent = info.name;
    nameLabel.style.setProperty("--name-length", String(info.name.length));
    dateLabel.textContent = info.date;
    dateLabel.style.setProperty("--name-length", String(info.date.length));
    card.setAttribute("aria-label", `${cardInfo.rank} of ${cardInfo.suit}, ${info.name}, ${info.date}`);
  }

  showPortrait(portraitImage);

  details.querySelectorAll(".card-rank").forEach((rank) => {
    rank.textContent = cardInfo.rank;
  });
  details.querySelectorAll(".card-suit").forEach((suit) => {
    suit.textContent = suitSymbols[cardInfo.suit];
  });
  details.classList.toggle("red-suit", cardInfo.suit === "hearts" || cardInfo.suit === "diamonds");

  function playEffect() {
    if (card.classList.contains("dealing")) return;

    const isSpinning = details.classList.toggle(cardInfo.effect);
    const switchedToAlternate = !isSpinning && !showingAlternatePortrait;
    if (switchedToAlternate) {
      showingAlternatePortrait = true;
      portrait.classList.add("card-portrait-alternate");
      const alternatePortrait = cardInfo.rank === "10" && cardInfo.suit === "diamonds"
        ? bethanyPortrait
        : cardInfo.rank === "5" && cardInfo.suit === "spades"
          ? stLandryPortrait
          : shreveportPortrait;
      showPortrait(alternatePortrait);
    }
    if (!isSpinning && !switchedToAlternate) return;

    typewriterLabels.forEach((label) => {
      label.classList.remove("writing");
      void label.offsetWidth;
      label.classList.add("writing");
    });
  }

  card.addEventListener("click", playEffect);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      playEffect();
    }
  });
  card.addEventListener("animationend", (event) => {
    if (event.animationName === "deal") {
      card.classList.add("dealt");
      card.classList.remove("dealing");
    }
  });

  slot.appendChild(card);
});
