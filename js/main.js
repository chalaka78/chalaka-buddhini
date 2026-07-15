const envelopeIntro = document.getElementById("envelopeIntro");
const openEnvelopeBtn = document.getElementById("openEnvelopeBtn");
const heroCoupleStage = document.getElementById("heroCoupleStage");
const heroCard = document.querySelector(".hero-card");

/* ============================================================
   BACKGROUND MUSIC — begins on the seal tap (a real user
   gesture, so browser autoplay policies allow it)
   ============================================================ */

const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const MUSIC_VOLUME = 0.55;
let musicStarted = false;
let fadeFrame = null;

function fadeVolume(target, duration) {
  if (!bgMusic) {
    return;
  }

  if (fadeFrame) {
    cancelAnimationFrame(fadeFrame);
  }

  const start = bgMusic.volume;
  const startTime = performance.now();

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    bgMusic.volume = Math.min(Math.max(start + (target - start) * t, 0), 1);

    if (t < 1) {
      fadeFrame = requestAnimationFrame(step);
    } else {
      fadeFrame = null;
    }
  }

  fadeFrame = requestAnimationFrame(step);
}

function setMusicButtonState(isPlaying) {
  if (!musicToggle) {
    return;
  }

  musicToggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
  musicToggle.setAttribute("aria-label", isPlaying ? "Turn music off" : "Turn music on");
  document.body.classList.toggle("music-on", isPlaying);
}

function startWeddingMusic() {
  if (!bgMusic || musicStarted) {
    return;
  }

  musicStarted = true;
  bgMusic.volume = 0;

  const playAttempt = bgMusic.play();

  if (playAttempt === undefined) {
    document.body.classList.add("music-available");
    setMusicButtonState(true);
    fadeVolume(MUSIC_VOLUME, 2200);
    return;
  }

  playAttempt
    .then(() => {
      document.body.classList.add("music-available");
      setMusicButtonState(true);
      fadeVolume(MUSIC_VOLUME, 2200);
    })
    .catch(() => {
      // blocked (e.g. iOS low-power mode) — reveal the button so the guest can start it
      musicStarted = false;
      document.body.classList.add("music-available");
      setMusicButtonState(false);
    });
}

if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      musicStarted = true;
      bgMusic.play()
        .then(() => {
          setMusicButtonState(true);
          fadeVolume(MUSIC_VOLUME, 900);
        })
        .catch(() => setMusicButtonState(false));
    } else {
      bgMusic.pause();
      setMusicButtonState(false);
    }
  });
}

// pause when the guest leaves the tab, resume when they return
document.addEventListener("visibilitychange", () => {
  if (!bgMusic || !musicStarted) {
    return;
  }

  if (document.hidden) {
    bgMusic.pause();
  } else if (musicToggle && musicToggle.getAttribute("aria-pressed") === "true") {
    bgMusic.play().catch(() => {});
  }
});

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

  // seal "cracks" the moment it is pressed, then the flap takes over
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

function createHeroParticles() {
  if (!heroCoupleStage || heroCoupleStage.querySelector(".hero-gold-particle")) {
    return;
  }

  const particleCount = window.matchMedia("(max-width: 520px)").matches ? 12 : 18;

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement("span");
    particle.className = "hero-gold-particle";
    particle.setAttribute("aria-hidden", "true");
    particle.style.setProperty("--particle-x", `${12 + Math.random() * 76}%`);
    particle.style.setProperty("--particle-y", `${12 + Math.random() * 74}%`);
    particle.style.setProperty("--particle-size", `${3 + Math.random() * 4}px`);
    particle.style.setProperty("--particle-duration", `${3.8 + Math.random() * 3.8}s`);
    particle.style.setProperty("--particle-delay", `${Math.random() * -5}s`);
    particle.style.setProperty("--particle-drift", `${-22 + Math.random() * 44}px`);
    heroCoupleStage.appendChild(particle);
  }
}

createHeroParticles();

function addHeroMouseMotion() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !heroCoupleStage) {
    return;
  }

  const coupleImage = heroCoupleStage.querySelector(".hero-couple-img");

  heroCoupleStage.addEventListener("mousemove", (event) => {
    const rect = heroCoupleStage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    if (coupleImage) {
      coupleImage.style.transform = `translate3d(${x * 8}px, ${y * -7}px, 0) rotate(${x * 1.2}deg)`;
    }

    heroCoupleStage.style.setProperty("--mouse-x", `${50 + x * 8}%`);
    heroCoupleStage.style.setProperty("--mouse-y", `${50 + y * 8}%`);
  });

  heroCoupleStage.addEventListener("mouseleave", () => {
    if (coupleImage) {
      coupleImage.style.transform = "";
    }
  });

  if (heroCard) {
    heroCard.addEventListener("mousemove", (event) => {
      const rect = heroCard.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      heroCard.style.transform = `rotateX(${y * -2.2}deg) rotateY(${x * 2.2}deg)`;
    });

    heroCard.addEventListener("mouseleave", () => {
      heroCard.style.transform = "";
    });
  }
}

addHeroMouseMotion();

if (envelopeIntro && openEnvelopeBtn) {
  document.body.classList.add("intro-active");

  openEnvelopeBtn.addEventListener("click", () => {
    openEnvelopeBtn.disabled = true;
    document.body.classList.remove("intro-active");

    // 0) music starts on the tap itself — the gesture browsers require
    startWeddingMusic();

    // 1) seal cracks (handled above) -> 2) flap lifts + card slides out
    setTimeout(() => {
      envelopeIntro.classList.add("opened");
      envelopeIntro.setAttribute("aria-hidden", "true");
    }, 280);

    // 3) petals begin drifting once the flap has opened
    setTimeout(() => {
      createPetalEffect();
      document.body.classList.add("petals-active");
    }, 1050);

    // 4) fade the whole intro away to reveal the invitation
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      envelopeIntro.classList.add("hide");
    }, 2500);
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

// Add to Calendar — builds a real .ics file the guest can open in
// Apple Calendar, Google Calendar, or Outlook.
const addCalendarBtn = document.getElementById("addCalendar");

if (addCalendarBtn) {
  addCalendarBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Chalaka and Buddhini//Wedding//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:chalaka-buddhini-wedding-2026@invitation",
      "DTSTAMP:20260101T000000Z",
      "DTSTART:20260731T100000Z",
      "DTEND:20260731T180000Z",
      "SUMMARY:Chalaka & Buddhini Wedding",
      "DESCRIPTION:Join us as we celebrate our wedding day. Poruwa ceremony at 3:41 PM. Kindly RSVP by 10th July 2026.",
      "LOCATION:Grand Walawwa, Kegalle, Sri Lanka",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Chalaka-and-Buddhini-Wedding.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  });
}

// Scroll progress bar + back-to-top button (created in JS, no markup needed)
const scrollProgress = document.createElement("div");
scrollProgress.className = "scroll-progress";
scrollProgress.setAttribute("aria-hidden", "true");
document.body.appendChild(scrollProgress);

const toTopBtn = document.createElement("button");
toTopBtn.className = "to-top";
toTopBtn.type = "button";
toTopBtn.setAttribute("aria-label", "Back to top");
toTopBtn.textContent = "\u2191";
document.body.appendChild(toTopBtn);

toTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function updateScrollUI() {
  const doc = document.documentElement;
  const scrolled = doc.scrollTop || document.body.scrollTop;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;

  scrollProgress.style.width = `${pct}%`;
  toTopBtn.classList.toggle("show", scrolled > 620);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);
updateScrollUI();
