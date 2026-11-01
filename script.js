// Game-style intro -> loading -> click-through presentation.
document.body.classList.add("intro-active");

const gameIntro = document.getElementById("gameIntro");
const startButton = document.getElementById("startButton");
const loadingScreen = document.getElementById("loadingScreen");
const loadingBar = document.getElementById("loadingBar");
const loadingPercent = document.getElementById("loadingPercent");
const loadingStatus = document.getElementById("loadingStatus");

const slides = Array.from(document.querySelectorAll(".presentation-slide"));
const prevButton = document.getElementById("prevSlide");
const nextButton = document.getElementById("nextSlide");
const slideCounter = document.getElementById("slideCounter");
const progressDots = Array.from(document.querySelectorAll(".progress-dot"));
const controls = document.getElementById("slideControls");
const endScreen = document.getElementById("endScreen");
const restartButton = document.getElementById("restartButton");
let currentSlide = 0;

function showSlide(index) {
  currentSlide = Math.max(0, Math.min(index, slides.length - 1));
  slides.forEach((slide, i) => {
    slide.classList.toggle("active-slide", i === currentSlide);
    slide.setAttribute("aria-hidden", i === currentSlide ? "false" : "true");
  });

  slideCounter.textContent = `${String(currentSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  progressDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
    dot.classList.toggle("done", i < currentSlide);
  });
  prevButton.disabled = currentSlide === 0;
  nextButton.innerHTML = currentSlide === slides.length - 1
    ? 'FINISH <span>✓</span>'
    : 'NEXT <span>→</span>';
  controls.classList.remove("controls-hidden");
}

function beginPresentation() {
  startButton.disabled = true;
  gameIntro.classList.add("hidden");
  loadingScreen.classList.add("active");
  loadingScreen.setAttribute("aria-hidden", "false");

  const steps = [
    [12, "BOOTING AI EXPERIENCE..."],
    [30, "LOADING VISUAL INTERFACE..."],
    [52, "CONNECTING KNOWLEDGE MODULES..."],
    [76, "PREPARING PRESENTATION..."],
    [92, "CALIBRATING DISPLAY..."],
    [100, "SYSTEM READY — WELCOME"]
  ];
  let step = 0;

  function advance() {
    const [percent, status] = steps[step];
    loadingBar.style.width = `${percent}%`;
    loadingPercent.textContent = `${percent}%`;
    loadingStatus.textContent = status;
    step += 1;

    if (step < steps.length) {
      window.setTimeout(advance, 420);
    } else {
      window.setTimeout(() => {
        loadingScreen.classList.remove("active");
        loadingScreen.setAttribute("aria-hidden", "true");
        document.body.classList.remove("intro-active");
        showSlide(0);
      }, 650);
    }
  }
  window.setTimeout(advance, 250);
}

startButton.addEventListener("click", beginPresentation);
prevButton.addEventListener("click", () => showSlide(currentSlide - 1));
nextButton.addEventListener("click", () => {
  if (currentSlide < slides.length - 1) {
    showSlide(currentSlide + 1);
  } else {
    controls.classList.add("controls-hidden");
    endScreen.classList.add("active");
    endScreen.setAttribute("aria-hidden", "false");
  }
});
restartButton.addEventListener("click", () => {
  endScreen.classList.remove("active");
  endScreen.setAttribute("aria-hidden", "true");
  showSlide(0);
});

document.addEventListener("keydown", (event) => {
  if (document.body.classList.contains("intro-active")) return;
  if (endScreen.classList.contains("active")) {
    if (event.key === "Enter" || event.key === " ") restartButton.click();
    return;
  }
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    nextButton.click();
  } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    prevButton.click();
  }
});

// Keep the slide experience fixed to the viewport; no page scrolling.
document.documentElement.style.scrollBehavior = "auto";
document.body.addEventListener("wheel", (event) => event.preventDefault(), { passive: false });
document.addEventListener("touchmove", (event) => {
  if (!event.target.closest(".allow-touch-scroll")) event.preventDefault();
}, { passive: false });

showSlide(0);
