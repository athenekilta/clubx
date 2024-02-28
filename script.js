// todo: muuta kortin leveys ja korkeusksen yksiköt paremmiksi

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function prng(a) {
  return function () {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    var t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

// scroll length of transition
let animationScrollLength = 300;

let cardGap = 50;

const cardHeight = 420;
const heroHeightViewportHeightPercentage = 3 / 4;

const initialScrollTop =
  document.documentElement.scrollTop || document.body.scrollTop || 0;

document.querySelectorAll(".card-scroll-box.rotate").forEach((ca, i) => {
  ca.style.zIndex = `${i + 1}`;
});
const cards = document.querySelectorAll(".card-scroll-box.rotate .card");
const rand = prng(0);
const cardRotationRandomization = [...cards].map(() => rand());

let animationFrameRequested = false;

function updateCards() {
  const h = window.innerHeight;
  const rotationStartY = window.scrollY;
  const firstCardTop = heroHeightViewportHeightPercentage * h + cardGap;
  cards.forEach((card, i) => {
    const cardTop = firstCardTop + i * (cardGap + cardHeight);
    console.log("cardtop", i, cardTop);
    let end = cardTop - 0.5 * h + cardHeight / 2;
    let start = end - animationScrollLength;
    const cardProgress = clamp((rotationStartY - start) / (end - start), 0, 1);
    const cardLift = clamp(-4 * cardProgress ** 2 + 4 * cardProgress, 0, 1);
    card.style.transform = `rotateX(${cardProgress ** 1.2 * 180}deg) rotateZ(${
      3 * cardRotationRandomization[i] * ((i % 2) * 2 - 1)
    }deg) translate3d(0,0,-${150 * cardLift}px)`;
  });
  animationFrameRequested = false;
}

window.addEventListener("scroll", () => {
  if (animationFrameRequested) return;
  requestAnimationFrame(updateCards);
  animationFrameRequested = true;
});
window.addEventListener("touchmove", () => {
  if (animationFrameRequested) return;
  requestAnimationFrame(updateCards);
  animationFrameRequested = true;
});

function onMediaChange(ev) {
  console.log(ev);
  if (ev.matches) {
    animationScrollLength = 470;
    cardGap = 100;
  } else {
    animationScrollLength = 400;
    cardGap = 50;
  }
  updateCards();
}

const mediaMatch = window.matchMedia("screen and (min-height: 768px)");

mediaMatch.addEventListener("change", onMediaChange);

onMediaChange(mediaMatch);

const countdownEnd = new Date("2024-02-28T14:00:00+02:00");

function msToTime(duration) {
  if (duration < 0) return "reveal live @ Olkkari";
  var seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    days = Math.floor(duration / (1000 * 60 * 60 * 24));

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  let dstr = days > 0 ? `${days}d ` : "";

  return dstr + hours + ":" + minutes + ":" + seconds;
}
function updateCountdown() {
  const countdownElem = document.getElementById("countdown");
  if (!countdownElem) return;
  countdownElem.textContent = msToTime(countdownEnd - new Date());
}
//updateCountdown();

//setInterval(updateCountdown, 1000);
