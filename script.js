const weddingDate = new Date("2027-01-09T19:00:00-03:00").getTime();

const weddingSong = document.getElementById("wedding-song");
const playControl = document.getElementById("play-control");

function updatePlayerState(isPlaying) {
    playControl.classList.toggle("is-playing", isPlaying);
    playControl.setAttribute("aria-pressed", String(isPlaying));
    playControl.setAttribute(
        "aria-label",
        isPlaying ? "Pausar Sabes de Reik" : "Reproducir Sabes de Reik"
    );
}

playControl.addEventListener("click", async () => {
    if (weddingSong.paused) {
        try {
            await weddingSong.play();
        } catch {
            updatePlayerState(false);
        }
    } else {
        weddingSong.pause();
    }
});

weddingSong.addEventListener("play", () => updatePlayerState(true));
weddingSong.addEventListener("pause", () => updatePlayerState(false));
weddingSong.addEventListener("ended", () => updatePlayerState(false));

const rsvpModal = document.getElementById("rsvp-modal");
const openRsvpButton = document.getElementById("open-rsvp");
const closeRsvpButton = document.getElementById("close-rsvp");
const rsvpForm = document.getElementById("rsvp-form");
const guestNameInput = document.getElementById("guest-name");
const guestCountInput = document.getElementById("guest-count");

openRsvpButton.addEventListener("click", () => {
    rsvpModal.showModal();
});

closeRsvpButton.addEventListener("click", () => {
    rsvpModal.close();
});

rsvpModal.addEventListener("click", (event) => {
    if (event.target === rsvpModal) {
        rsvpModal.close();
    }
});

rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!rsvpForm.checkValidity()) {
        rsvpForm.reportValidity();
        return;
    }

    const guestName = guestNameInput.value.trim();
    const guestCount = guestCountInput.value;
    const message = `Hola Leonela y Emanuel.\n\nQuiero confirmar mi asistencia a su celebración de boda.\n\nNombre / familia: ${guestName}\nAsistentes: ${guestCount}`;
    const whatsappUrl = `https://wa.me/543814481130?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

const countdownNodes = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
};

function pad(value, size = 2) {
    return String(value).padStart(size, "0");
}

function updateCountdown() {
    const distance = Math.max(weddingDate - Date.now(), 0);
    const day = 1000 * 60 * 60 * 24;
    const hour = 1000 * 60 * 60;
    const minute = 1000 * 60;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / 1000);

    countdownNodes.days.textContent = pad(days, 3);
    countdownNodes.hours.textContent = pad(hours);
    countdownNodes.minutes.textContent = pad(minutes);
    countdownNodes.seconds.textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const slides = [...document.querySelectorAll(".photo-slide")];
const previousButton = document.querySelector(".carousel-control.prev");
const nextButton = document.querySelector(".carousel-control.next");
const dotsContainer = document.querySelector(".carousel-dots");
let activeSlide = 0;

function showSlide(index) {
    activeSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeSlide);
    });

    [...dotsContainer.children].forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === activeSlide);
        dot.setAttribute("aria-current", dotIndex === activeSlide ? "true" : "false");
    });
}

slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver foto ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    dotsContainer.appendChild(dot);
});

previousButton.addEventListener("click", () => showSlide(activeSlide - 1));
nextButton.addEventListener("click", () => showSlide(activeSlide + 1));
showSlide(0);
