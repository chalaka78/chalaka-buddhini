const envelopeIntro = document.getElementById("envelopeIntro");
const openEnvelopeBtn = document.getElementById("openEnvelopeBtn");

function animateRingButtonImage() {
  const ringImage = openEnvelopeBtn ? openEnvelopeBtn.querySelector("img") : null;

  if (!ringImage) {
    return;
  }

  let rotation = 0;
  let lastTime = performance.now();
  let isRunning = true;
  let isHovering = false;

  function rotateRingButton(currentTime) {
    if (!isRunning) {
      return;
    }

    const delta = currentTime - lastTime;
    lastTime = currentTime;

    const speed = isHovering ? 0.04 : 0.018;
    const pulse = 1 + Math.sin(currentTime / 520) * 0.025;

    rotation = (rotation + delta * speed) % 360;
    ringImage.style.transform = `rotate(${rotation}deg) scale(${pulse})`;

    requestAnimationFrame(rotateRingButton);
  }

  requestAnimationFrame(rotateRingButton);

  openEnvelopeBtn.addEventListener("mouseenter", () => {
    isHovering = true;
    openEnvelopeBtn.classList.add("is-hovering");
  });

  openEnvelopeBtn.addEventListener("mouseleave", () => {
    isHovering = false;
    openEnvelopeBtn.classList.remove("is-hovering");
  });

  openEnvelopeBtn.addEventListener("pointerdown", () => {
    openEnvelopeBtn.classList.remove("is-clicked");
    void openEnvelopeBtn.offsetWidth;
    openEnvelopeBtn.classList.add("is-clicked");
  });

  openEnvelopeBtn.addEventListener("click", () => {
    openEnvelopeBtn.classList.add("is-opening");
    isRunning = false;
    ringImage.style.transform = `rotate(${rotation + 34}deg) scale(0.72)`;
    ringImage.style.opacity = "0.92";
  }, { once: true });
}

animateRingButtonImage();

function createPetalEffect() {
  if (document.querySelector(".petal-layer")) {
    return;
  }

  const petalLayer = document.createElement("div");
  petalLayer.className = "petal-layer";
  petalLayer.setAttribute("aria-hidden", "true");

  const petalColors = [
    "rgba(255, 255, 255, 0.88)",
    "rgba(214, 170, 88, 0.88)",
    "rgba(255, 255, 255, 0.68)",
    "rgba(214, 170, 88, 0.68)"
  ];

  const petalCount = window.matchMedia("(max-width: 520px)").matches ? 16 : 28;

  for (let i = 0; i < petalCount; i += 1) {
    const petal = document.createElement("span");
    petal.className = "falling-petal";
    petal.style.setProperty("--x", `${Math.random() * 100}%`);
    petal.style.setProperty("--size", `${8 + Math.random() * 10}px`);
    petal.style.setProperty("--duration", `${8 + Math.random() * 8}s`);
    petal.style.setProperty("--delay", `${Math.random() * -14}s`);
    petal.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    petal.style.setProperty("--rotate", `${Math.random() * 180}deg`);
    petal.style.setProperty("--opacity", `${0.34 + Math.random() * 0.36}`);
    petal.style.setProperty("--petal-color", petalColors[i % petalColors.length]);
    petalLayer.appendChild(petal);
  }

  document.body.appendChild(petalLayer);
}

if (envelopeIntro && openEnvelopeBtn) {
  document.body.classList.add("intro-active");

  openEnvelopeBtn.addEventListener("click", () => {
    openEnvelopeBtn.disabled = true;
    envelopeIntro.classList.add("opened");

    setTimeout(() => {
      envelopeIntro.classList.add("hide");
      document.body.classList.remove("intro-active");
      createPetalEffect();
      document.body.classList.add("petals-active");
    }, 1850);
  });
}

const weddingDate = new Date("2026-07-31T00:00:00+05:30").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
    return;
  }

  if (distance <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, { threshold: 0.14 });

revealElements.forEach((element) => revealObserver.observe(element));
