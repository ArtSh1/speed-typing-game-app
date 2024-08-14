const RANDOM_QUOTE_API = "https://api.quotable.io/random";
const MOCK_QUOTES = [
  "The quick brown fox jumps over the lazy dog.",
  "To be or not to be, that is the question.",
  "A journey of a thousand miles begins with a single step.",
  "All that glitters is not gold.",
  "The only thing we have to fear is fear itself.",
];

const timer = document.getElementById("timer");
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const scoreElement = document.getElementById("score");

let interval;
let score = 0;
let startTime;

quoteInputElement.addEventListener("input", handleInput);

function handleInput() {
  const arrayQuote = [...quoteDisplayElement.querySelectorAll("span")];
  const arrayValue = quoteInputElement.value.split("");

  const correct = checkCorrectness(arrayQuote, arrayValue);

  if (correct && arrayValue.length === arrayQuote.length) {
    score++;
    scoreElement.innerText = score;
    stopTimer();
    renderNewQuote();
  }
}

function checkCorrectness(arrayQuote, arrayValue) {
  let correct = true;

  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove("correct", "incorrect");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });

  return correct;
}

async function getRandomQuote() {
  try {
    const response = await fetch(RANDOM_QUOTE_API);
    if (!response.ok) {
      throw new Error("Failed to fetch the quote");
    }
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error fetching quote:", error);
    return getMockedQuote();
  }
}

function getMockedQuote() {
  const randomIndex = Math.floor(Math.random() * MOCK_QUOTES.length);
  return MOCK_QUOTES[randomIndex];
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = "";
  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = "";
  startTimer();
}

function startTimer() {
  timer.innerText = 0;
  startTime = new Date();

  if (interval) clearInterval(interval);

  interval = setInterval(() => {
    timer.innerText = getTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
}

function getTimer() {
  return Math.floor((new Date() - startTime) / 1000);
}

renderNewQuote();
