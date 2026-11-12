// JS scripts placed here
const slot = document.getElementById("slot");
const deck = document.getElementById("deck");
const cardTemplate = document.getElementById("cardTemplate");

const cards = [
  { rank: "A", suit: "hearts", effect: "effect-bounce" },
  { rank: "K", suit: "spades", effect: "effect-spin" },
];

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
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  card.classList.add("dealing");
  card.style.zIndex = String(++dealtCount);
  card.setAttribute("aria-label", `${cardInfo.rank} of ${cardInfo.suit}`);

  const details = card.querySelector(".card-details");
  details.querySelectorAll(".card-rank").forEach((rank) => {
    rank.textContent = cardInfo.rank;
  });
  details.querySelectorAll(".card-suit").forEach((suit) => {
    suit.textContent = suitSymbols[cardInfo.suit];
  });
  details.classList.toggle("red-suit", cardInfo.suit === "hearts" || cardInfo.suit === "diamonds");

  function playEffect() {
    if (card.classList.contains("dealing")) return;

    details.classList.remove(cardInfo.effect);
    void details.offsetWidth;
    details.classList.add(cardInfo.effect);
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
