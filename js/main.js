const envelopeIntro = document.getElementById("envelopeIntro");
const openEnvelopeBtn = document.getElementById("openEnvelopeBtn");

if (envelopeIntro && openEnvelopeBtn) {
  document.body.classList.add("intro-active");

  openEnvelopeBtn.addEventListener("click", () => {
    openEnvelopeBtn.disabled = true;
    envelopeIntro.classList.add("opened");

    setTimeout(() => {
      envelopeIntro.classList.add("hide");
      document.body.classList.remove("intro-active");
    }, 1650);
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
