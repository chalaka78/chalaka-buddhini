const envelopeIntro = document.getElementById("envelopeIntro");
const openEnvelopeBtn = document.getElementById("openEnvelopeBtn");

function createFloralDecorations() {
  if (document.querySelector(".wedding-floral-layer")) {
    return;
  }

  const floralLayer = document.createElement("div");
  floralLayer.className = "wedding-floral-layer";
  floralLayer.setAttribute("aria-hidden", "true");

  const petalField = document.createElement("div");
  petalField.className = "petal-field";

  function createCorner(side) {
    const corner = document.createElement("div");
    corner.className = `floral-corner ${side}`;

    const branch = document.createElement("span");
    branch.className = "floral-branch";
    corner.appendChild(branch);

    const flowers = [
      { x: "18px", y: "16px", size: "54px", rotate: "-12deg", delay: "-0.4s", gold: false },
      { x: "70px", y: "28px", size: "44px", rotate: "18deg", delay: "-1.4s", gold: true },
      { x: "34px", y: "78px", size: "48px", rotate: "24deg", delay: "-2.2s", gold: false },
      { x: "118px", y: "52px", size: "38px", rotate: "-28deg", delay: "-0.9s", gold: false },
      { x: "84px", y: "104px", size: "34px", rotate: "36deg", delay: "-1.8s", gold: true }
    ];

    flowers.forEach((item) => {
      const flower = document.createElement("span");
      flower.className = item.gold ? "corner-flower gold-flower" : "corner-flower";
      flower.style.setProperty("--x", item.x);
      flower.style.setProperty("--y", item.y);
      flower.style.setProperty("--size", item.size);
      flower.style.setProperty("--rotate", item.rotate);
      flower.style.setProperty("--delay", item.delay);
      corner.appendChild(flower);
    });

    const leaves = [
      { x: "104px", y: "18px", w: "38px", h: "18px", rotate: "18deg" },
      { x: "132px", y: "88px", w: "42px", h: "20px", rotate: "-32deg" },
      { x: "22px", y: "128px", w: "44px", h: "20px", rotate: "36deg" },
      { x: "162px", y: "44px", w: "34px", h: "16px", rotate: "20deg" }
    ];

    leaves.forEach((item) => {
      const leaf = document.createElement("span");
      leaf.className = "corner-leaf";
      leaf.style.setProperty("--x", item.x);
      leaf.style.setProperty("--y", item.y);
      leaf.style.setProperty("--w", item.w);
      leaf.style.setProperty("--h", item.h);
      leaf.style.setProperty("--rotate", item.rotate);
      corner.appendChild(leaf);
    });

    return corner;
  }

  const petalColors = ["var(--white)", "var(--gold)", "rgba(255, 255, 255, 0.86)", "rgba(214, 170, 88, 0.88)"];
  const petalCount = window.matchMedia("(max-width: 520px)").matches ? 18 : 30;

  for (let i = 0; i < petalCount; i += 1) {
    const petal = document.createElement("span");
    petal.className = "falling-petal";
    petal.style.setProperty("--x", `${Math.random() * 100}%`);
    petal.style.setProperty("--size", `${8 + Math.random() * 10}px`);
    petal.style.setProperty("--duration", `${7 + Math.random() * 7}s`);
    petal.style.setProperty("--delay", `${Math.random() * -12}s`);
    petal.style.setProperty("--drift", `${-70 + Math.random() * 140}px`);
    petal.style.setProperty("--rotate", `${Math.random() * 180}deg`);
    petal.style.setProperty("--opacity", `${0.36 + Math.random() * 0.42}`);
    petal.style.setProperty("--petal-color", petalColors[i % petalColors.length]);
    petalField.appendChild(petal);
  }

  floralLayer.appendChild(createCorner("left"));
  floralLayer.appendChild(createCorner("right"));
  floralLayer.appendChild(petalField);
  document.body.appendChild(floralLayer);
}

createFloralDecorations();

if (envelopeIntro && openEnvelopeBtn) {
  document.body.classList.add("intro-active");

  openEnvelopeBtn.addEventListener("click", () => {
    openEnvelopeBtn.disabled = true;
    envelopeIntro.classList.add("opened");

    setTimeout(() => {
      envelopeIntro.classList.add("hide");
      document.body.classList.remove("intro-active");
    }, 2550);
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
