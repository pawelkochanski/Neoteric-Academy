const genElement = (type, classes) => {
  const element = document.createElement(type);

  classes.forEach((className) => {
    element.classList.add(className);
  });

  return element;
};

const generateCard = (index) => {
  const container = document.querySelector(".game");

  const cardDiv = genElement("div", ["card", "lead"]);

  const cardBack = genElement("div", ["card-back", "card-face"]);
  const cardBackIcon = genElement("i", ["fas", "fa-times"]);
  cardBack.appendChild(cardBackIcon);

  cardDiv.appendChild(cardBack);

  const cardFront = genElement("div", ["card-front", "card-face"]);
  const cardFrontSpan = genElement("span", ["card-value"]);
  cardFrontSpan.innerText = index;
  cardFront.appendChild(cardFrontSpan);

  cardDiv.appendChild(cardFront);

  container.appendChild(cardDiv);
};

class Memo {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.getElementById("time-remaining");
    this.ticker = document.getElementById("flips-remaining");
    this.matchedCards = [];
  }

  startGame() {
    this.cardToCheck = null;
    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    this.matchedCards = [];
    this.busy = true;

    setTimeout(() => {
      this.shuffleCards();
      this.countDown = this.startCountDown();
      this.busy = false;
    }, 500);
    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.ticker.innerText = this.totalClicks;
  }
  hideCards() {
    this.cardsArray.forEach((card) => {
      card.classList.remove("visible");
      card.classList.remove("matched");
    });
  }
  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;
      card.classList.add("visible");

      if (this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }
  checkForCardMatch(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
      this.cardMatch(card, this.cardToCheck);
    } else {
      this.cardMisMatch(card, this.cardToCheck);
    }

    this.cardToCheck = null;
  }
  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);

    const htmlArray = Array.from(document.getElementsByClassName("card"));
    let orders = [];
    let numbers = [];
    let visible = [];

    htmlArray.forEach((card) => {
      orders.push(card.style.order);
      numbers.push(card.innerText);
      if (card.classList.contains("visible")) {
        visible.push(1);
      } else {
        visible.push(0);
      }
    });
    localStorage.setItem("card-order", orders);
    localStorage.setItem("card-value", numbers);
    localStorage.setItem("card-visibility", visible);
    localStorage.setItem("stats", [
      document.getElementById("time-remaining").innerText,
      document.getElementById("flips-remaining").innerText,
    ]);

    if (this.matchedCards.length === this.cardsArray.length) {
      this.victory();
    }
  }
  cardMisMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove("visible");
      card2.classList.remove("visible");
      this.busy = false;
    }, 800);
  }
  getCardType(card) {
    return card.getElementsByClassName("card-value")[0].innerText;
  }
  startCountDown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;

      if (this.timeRemaining === 0) {
        this.gameOver();
      }
    }, 1000);
  }
  gameOver() {
    clearInterval(this.countDown);
    document.getElementById("game-over-text").classList.add("visible");

    this.hideCards();

    setTimeout(() => {
      localStorage.clear();
      location.reload();
    }, 1000);
  }
  victory() {
    clearInterval(this.countDown);
    document.getElementById("victory-text").classList.add("visible");

    this.hideCards();

    setTimeout(() => {
      localStorage.clear();
      location.reload();
    }, 1000);
  }
  shuffleCards() {
    for (let i = this.cardsArray.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randomIndex].style.order = i;
      this.cardsArray[i].style.order = randomIndex;
    }
  }
  canFlipCard(card) {
    return (
      !this.busy &&
      !this.matchedCards.includes(card) &&
      card != this.cardToCheck
    );
  }
}

class LoadMemo {
  constructor(totalTime, cards, flips, matched) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.flips = flips;
    this.matched = matched;
    this.timeRemaining = totalTime;
    this.timer = document.getElementById("time-remaining");
    this.ticker = document.getElementById("flips-remaining");
    this.matchedCards = [];
  }

  startGame() {
    this.cardToCheck = null;
    this.totalClicks = this.flips;
    this.timeRemaining = this.totalTime;
    this.matchedCards = [];
    this.busy = true;

    setTimeout(() => {
      this.countDown = this.startCountDown();
      this.busy = false;
    }, 500);
    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.ticker.innerText = this.totalClicks;
  }
  hideCards() {
    this.cardsArray.forEach((card) => {
      card.classList.remove("visible");
      card.classList.remove("matched");
    });
  }
  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;
      card.classList.add("visible");

      if (this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }
  checkForCardMatch(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
      this.cardMatch(card, this.cardToCheck);
    } else {
      this.cardMisMatch(card, this.cardToCheck);
    }

    this.cardToCheck = null;
  }
  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);

    const htmlArray = Array.from(document.getElementsByClassName("card"));
    let orders = [];
    let numbers = [];
    let visible = [];

    htmlArray.forEach((card) => {
      orders.push(card.style.order);
      numbers.push(card.innerText);
      if (
        card.classList.contains("visible") ||
        card.classList.contains("turned")
      ) {
        visible.push(1);
      } else {
        visible.push(0);
      }
    });
    localStorage.setItem("card-order", orders);
    localStorage.setItem("card-value", numbers);
    localStorage.setItem("card-visibility", visible);
    localStorage.setItem("stats", [
      document.getElementById("time-remaining").innerText,
      document.getElementById("flips-remaining").innerText,
    ]);

    if (this.matchedCards.length === this.cardsArray.length - this.matched) {
      this.victory();
    }
  }
  cardMisMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove("visible");
      card2.classList.remove("visible");
      this.busy = false;
    }, 800);
  }
  getCardType(card) {
    return card.getElementsByClassName("card-value")[0].innerText;
  }
  startCountDown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;

      if (this.timeRemaining === 0) {
        this.gameOver();
      }
    }, 1000);
  }
  gameOver() {
    clearInterval(this.countDown);
    document.getElementById("game-over-text").classList.add("visible");

    this.hideCards();

    setTimeout(() => {
      localStorage.clear();
      location.reload();
    }, 1000);
  }
  victory() {
    clearInterval(this.countDown);
    document.getElementById("victory-text").classList.add("visible");

    this.hideCards();

    setTimeout(() => {
      localStorage.clear();
      location.reload();
    }, 1000);
  }
  canFlipCard(card) {
    return (
      !this.busy &&
      !this.matchedCards.includes(card) &&
      card != this.cardToCheck
    );
  }
}

const newGame = () => {
  for (let i = 1; i < 9; i++) {
    generateCard(i);
    generateCard(i);
  }

  const container = document.querySelector(".difficulty");
  let overlays = Array.from(document.getElementsByClassName("overlay-text"));
  let cards = Array.from(document.getElementsByClassName("card"));

  container.addEventListener("click", (e) => {
    if (e.target.classList[0] === "time-btn") {
      let game = new Memo(30, cards);
      overlays.forEach((overlay) => {
        overlay.addEventListener("click", () => {
          overlay.classList.remove("visible");
          game.startGame();
        });
      });

      cards.forEach((card) => {
        card.addEventListener("click", () => {
          game.flipCard(card);
        });
      });
    }

    if (e.target.classList[0] === "no-time-btn") {
      let game = new Memo(Number.POSITIVE_INFINITY, cards);

      overlays.forEach((overlay) => {
        overlay.addEventListener("click", () => {
          overlay.classList.remove("visible");
          game.startGame();
        });
      });

      cards.forEach((card) => {
        card.addEventListener("click", () => {
          game.flipCard(card);
        });
      });
    }
  });
};

const loadGame = () => {
  const orders = localStorage.getItem("card-order").split(",");
  const numbers = localStorage.getItem("card-value").split(",");
  let visible = localStorage.getItem("card-visibility").split(",");
  let stats = localStorage.getItem("stats").split(",");
  visible = visible.map((x) => +x);
  stats = stats.map((x) => +x);

  const overlays = Array.from(document.getElementsByClassName("overlay-text"));
  overlays.forEach((overlay) => {
    overlay.classList.remove("visible");
  });

  for (let i = 0; i < 16; i++) {
    const container = document.querySelector(".game");

    const cardDiv = genElement("div", ["card", "lead"]);

    if (visible[i] === 1) {
      cardDiv.classList.add("turned");
    }

    cardDiv.style.order = orders[i];

    const cardBack = genElement("div", ["card-back", "card-face"]);
    const cardBackIcon = genElement("i", ["fas", "fa-times"]);
    cardBack.appendChild(cardBackIcon);

    cardDiv.appendChild(cardBack);

    const cardFront = genElement("div", ["card-front", "card-face"]);
    const cardFrontSpan = genElement("span", ["card-value"]);
    cardFrontSpan.innerText = numbers[i];
    cardFront.appendChild(cardFrontSpan);

    cardDiv.appendChild(cardFront);

    container.appendChild(cardDiv);
  }

  const cards = Array.from(document.getElementsByClassName("card"));
  let time;

  if (stats[0] === "Infinity") {
    time = Number.POSITIVE_INFINITY;
  } else {
    time = stats[0];
  }

  const matched = visible.reduce((a, b) => {
    return a + b;
  });

  const game = new LoadMemo(time, cards, stats[1], matched);

  game.startGame();

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      game.flipCard(card);
    });
  });
};

if (localStorage.getItem("card-order") === null) {
  newGame();
} else {
  loadGame();
}
