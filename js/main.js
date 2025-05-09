import { residuos } from "./residuos.js";

const itemsContainer = document.getElementById("items");
const bins = document.querySelectorAll(".bin");
const message = document.getElementById("message");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const retryLevelBtn = document.getElementById("retryLevelBtn");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const timeDisplay = document.getElementById("time");
const levelProgress = document.getElementById("levelProgress");

let score = 0;
let level = 1;
let totalItems = 0;
let correctItems = 0;
let errors = 0;
let selectedItem = null;
let timer;
let timeLeft = 30;

function updateStatus() {
  scoreDisplay.textContent = score;
  levelDisplay.textContent = level;

  const progressWidth = (correctItems / totalItems) * 100;
  levelProgress.style.width = `${progressWidth}%`;
}

function startTimer() {
  clearInterval(timer);
  timeLeft = Math.max(30 - level * 2, 10);
  timeDisplay.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 5) {
      document.getElementById("timer").classList.add("pulse");
    } else {
      document.getElementById("timer").classList.remove("pulse");
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      document.querySelectorAll(".item").forEach((item) => {
        item.classList.add("disabled");
      });
      endLevel(false);
    }
  }, 1000);
}

function createItems() {
  itemsContainer.innerHTML = "";
  message.textContent = "";
  message.className = "";
  nextLevelBtn.style.display = "none";
  retryLevelBtn.style.display = "none";
  correctItems = 0;
  errors = 0;
  selectedItem = null;

  levelProgress.style.width = "0%";

  const itemCount = Math.min(level + 2, 10);
  const randomItems = residuos
    .sort(() => 0.5 - Math.random())
    .slice(0, itemCount);
  totalItems = randomItems.length;

  randomItems.forEach((residuo) => {
    const item = document.createElement("div");
    item.classList.add("item", "fade-in");
    item.textContent = residuo.emoji;
    item.dataset.type = residuo.type;

    item.addEventListener("click", () => {
      selectedItem = item;
      document.querySelectorAll(".item").forEach((i) => {
        i.classList.remove("selected");
      });
      item.classList.add("selected");
    });

    itemsContainer.appendChild(item);
  });

  updateStatus();
  startTimer();
}

bins.forEach((bin) => {
  bin.addEventListener("click", () => {
    if (!selectedItem) return;

    const type = selectedItem.dataset.type;
    const binType = bin.dataset.bin;

    if (type === binType) {
      message.textContent = "✅ ¡Correcto!";
      message.className = "message-success";
      score++;
      correctItems++;

      bin.classList.add("pulse");
      setTimeout(() => {
        bin.classList.remove("pulse");
      }, 1000);
    } else {
      message.textContent = "❌ ¡Incorrecto!";
      message.className = "message-error";
      score = Math.max(0, score - 1);
      errors++;

      bin.classList.add("shake");
      setTimeout(() => {
        bin.classList.remove("shake");
      }, 500);
    }

    selectedItem.remove();
    selectedItem = null;
    updateStatus();

    if (itemsContainer.children.length === 0) {
      clearInterval(timer);
      endLevel(errors === 0);
    }
  });
});

function endLevel(success) {
  if (success) {
    message.textContent = "🎉 ¡Nivel superado! Avanza al siguiente nivel.";
    message.className = "message-success";
    nextLevelBtn.style.display = "inline-block";
    nextLevelBtn.classList.add("pulse");
  } else {
    message.textContent = "😢 Has fallado el nivel. Intenta de nuevo.";
    message.className = "message-error";
    retryLevelBtn.style.display = "inline-block";

    document.querySelectorAll(".item").forEach((item) => {
      item.classList.add("disabled");
    });
  }
}

nextLevelBtn.addEventListener("click", () => {
  level++;
  nextLevelBtn.classList.remove("pulse");
  createItems();
});

retryLevelBtn.addEventListener("click", () => {
  createItems();
});

// Añadir efectos de sonido
function playSound(type) {
  const audio = new Audio();
  audio.volume = 0.5;

  if (type === "correct") {
    audio.src =
      "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDA4ODg4ODg4ODg4ODg4ODg4P//////////////////AAAAOkxhdmM1OC4xMzAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/jOMAAAAAAAAAAAABJbmZvAAAADwAAAAMAAAGwAJCQkJCQkJCQkJCQkJCQkMDAwMDAwMDAwMDAwMDAwODg4ODg4ODg4ODg4ODg4OD//////////////////wAAAABMYXZjNTguMjkAAAAAAAAAAAAkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
  } else {
    audio.src =
      "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAeAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDA4ODg4ODg4ODg4ODg4ODg4P//////////////////AAAAOkxhdmM1OC4xMzAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/jOMAAAAAAAAAAAABJbmZvAAAADwAAAAMAAAHgAJCQkJCQkJCQkJCQkJCQkMDAwMDAwMDAwMDAwMDAwODg4ODg4ODg4ODg4ODg4OD//////////////////wAAAABMYXZjNTguMjkAAAAAAAAAAAAkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
  }

  audio.play().catch((e) => console.log("Error al reproducir sonido:", e));
}

createItems();
