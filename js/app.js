/* common part */
// hamburger menu on/off
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}

// carousel autoslide & page turning
let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");
const dots = document.querySelectorAll(".dot");
let autoSlideInterval;

function updateIndicators() {
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

function showSlide(index) {
  slides[currentSlide].classList.remove("active");

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide].classList.add("active");
  updateIndicators();
}

function changeSlide(step) {
  showSlide(currentSlide + step);
  resetTimer();
}

function jumpToSlide(index) {
  showSlide(index);
  resetTimer();
}

function startTimer() {
  autoSlideInterval = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);
}

function resetTimer() {
  clearInterval(autoSlideInterval);
  startTimer();
}

startTimer();

// sound handling
const audio = document.getElementById("myAudio");
const btn = document.getElementById("muteBtn");

function setupAudio() {
  if (!audio) return;

  let savedMuteState;

  // mute/unmute állapot betöltése
  if (localStorage.getItem("audioMuted") === "false") {
    savedMuteState = false;
  } else {
    savedMuteState = true;
  }

  // lejátszási időbélyeg betöltése
  const savedTime = localStorage.getItem("audioTime");
  if (savedTime) {
    audio.currentTime = parseFloat(savedTime);
  }

  // mute/unmute állapot mentése
  audio.muted = savedMuteState;

  if (btn) {
    if (!savedMuteState) {
      audio.play();
      btn.classList.remove("muted");
      btn.classList.add("unmuted");
    } else {
      btn.classList.remove("unmuted");
      btn.classList.add("muted");
    }
  }
}

// mute/unmute kattintás kezelése
if (btn) {
  btn.addEventListener("click", function () {
    if (audio.muted) {
      audio.play();
      audio.muted = false;
      btn.classList.replace("muted", "unmuted");
      localStorage.setItem("audioMuted", "false");
    } else {
      audio.muted = true;
      btn.classList.replace("unmuted", "muted");
      localStorage.setItem("audioMuted", "true");
    }
  });
}

// lejátszási időbélyeg mentése oldal elhagyásakor,
// hogy folyamatos legyen a zene
window.addEventListener("beforeunload", function () {
  if (audio) {
    localStorage.setItem("audioTime", audio.currentTime);
  }
});

window.addEventListener("load", setupAudio);

/* booking.html */
// vendégszám szabályzó függvény
function changeGuests(amount) {
  const input = document.getElementById("guests");
  let value = parseInt(input.value);
  value += amount;
  if (value < 1) value = 1;
  if (value > 10) value = 10;
  input.value = value;
}

// mai dátum beállítása minimumként a naptárban
document.getElementById("date").min = new Date().toISOString().split("T")[0];

// adatok ellenőrzése beküldéskor
document.getElementById("bookingForm").addEventListener("submit", function (x) {
  const email = document.getElementById("email").value;
  const confirm = document.getElementById("emailConfirm").value;
  const datum = new Date(document.getElementById("date").value);
  const day = datum.getDay();
  const time = document.getElementById("time").value;

  let message = "";

  if (email !== confirm) {
    message = "A két e-mail cím nem egyezik meg!";
  } else if (day === 1) {
    message = "Az étterem hétfőn zárva tart!";
  } else if (day >= 2 && day <= 4 && time > "21:00") {
    message = "Az étterem keddtől csütörtökig csak 21 óráig van nyitva!";
  } else if ((day === 0 || day === 5 || day === 6) && time < "13:00") {
    message = "Az étterem péntektől vasárnapig csak 13 órától van nyitva!";
  } else if (day === 0 && time > "21:00") {
    message = "Az étterem vasárnap csak 21 óráig van nyitva!";
  }

  if (message !== "") {
    x.preventDefault();
    alert(message);
  }
});

// csak azok az időpontok választhatók ki,
// amelyek az aktuális időpont után találhatók
function updateAvailableTimes() {
  // csak a booking.html oldal betöltésekor..
  const select = document.getElementById("time");

  if (!select) return;
  //..kell végrehajtani

  const now = new Date();
  const currentTime =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  const options = select.getElementsByTagName("option");

  for (let i = 0; i < options.length; i++) {
    const optionValue = options[i].value;
    if (
      optionValue !== "" &&
      optionValue <= currentTime &&
      optionValue !== "00:00"
    ) {
      options[i].disabled = true;
    }
  }
}

window.addEventListener("load", updateAvailableTimes);
