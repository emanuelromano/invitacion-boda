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
const rsvpSection = document.getElementById("rsvp");
const rsvpFixedBg = document.querySelector(".rsvp-fixed-bg");

let isRsvpBgVisible = false;
let rsvpBgFrame = null;

document.documentElement.classList.add("rsvp-fixed-ready");

function updateRsvpBgClip() {
    rsvpBgFrame = null;

    if (!isRsvpBgVisible) {
        return;
    }

    const rect = rsvpSection.getBoundingClientRect();
    const top = Math.max(rect.top, 0);
    const bottom = Math.max(window.innerHeight - rect.bottom, 0);

    rsvpFixedBg.style.clipPath = `inset(${top}px 0 ${bottom}px 0)`;
}

function requestRsvpBgUpdate() {
    if (rsvpBgFrame === null) {
        rsvpBgFrame = requestAnimationFrame(updateRsvpBgClip);
    }
}

const rsvpBackgroundObserver = new IntersectionObserver(([entry]) => {
    isRsvpBgVisible = entry.isIntersecting;
    rsvpFixedBg.classList.toggle("is-visible", isRsvpBgVisible);

    if (isRsvpBgVisible) {
        requestRsvpBgUpdate();
    } else {
        rsvpFixedBg.style.clipPath = "inset(0 0 100% 0)";
    }
}, {
    threshold: 0,
});

rsvpBackgroundObserver.observe(rsvpSection);
window.addEventListener("scroll", requestRsvpBgUpdate, { passive: true });
window.addEventListener("resize", requestRsvpBgUpdate);

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
const carouselTrack = document.querySelector(".carousel-track");
const previousButton = document.querySelector(".carousel-control.prev");
const nextButton = document.querySelector(".carousel-control.next");
const dotsContainer = document.querySelector(".carousel-dots");
let activeSlide = 0;
let swipeStartX = 0;
let swipeStartY = 0;
let swipeCurrentX = 0;
let swipeStartTime = 0;
let swipePointerId = null;
let isHorizontalSwipe = false;
let isSwipeDirectionKnown = false;

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

carouselTrack.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
        return;
    }

    swipePointerId = event.pointerId;
    swipeStartX = event.clientX;
    swipeStartY = event.clientY;
    swipeCurrentX = event.clientX;
    swipeStartTime = event.timeStamp;
    isHorizontalSwipe = false;
    isSwipeDirectionKnown = false;
    carouselTrack.setPointerCapture(swipePointerId);
});

carouselTrack.addEventListener("pointermove", (event) => {
    if (event.pointerId !== swipePointerId) {
        return;
    }

    const deltaX = event.clientX - swipeStartX;
    const deltaY = event.clientY - swipeStartY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    swipeCurrentX = event.clientX;

    if (!isSwipeDirectionKnown && (absX > 8 || absY > 8)) {
        isHorizontalSwipe = absX > absY * 1.2;
        isSwipeDirectionKnown = true;
    }
});

function finishCarouselSwipe(event) {
    if (event.pointerId !== swipePointerId) {
        return;
    }

    const deltaX = swipeCurrentX - swipeStartX;
    const elapsed = Math.max(event.timeStamp - swipeStartTime, 1);
    const velocity = Math.abs(deltaX) / elapsed;
    const distanceThreshold = Math.min(80, Math.max(44, carouselTrack.offsetWidth * 0.16));
    const isIntentionalSwipe = isHorizontalSwipe && (
        Math.abs(deltaX) >= distanceThreshold || (velocity > 0.45 && Math.abs(deltaX) > 24)
    );

    if (isIntentionalSwipe) {
        showSlide(deltaX < 0 ? activeSlide + 1 : activeSlide - 1);
    }

    if (swipePointerId !== null && carouselTrack.hasPointerCapture(swipePointerId)) {
        carouselTrack.releasePointerCapture(swipePointerId);
    }

    swipePointerId = null;
}

carouselTrack.addEventListener("pointerup", finishCarouselSwipe);
carouselTrack.addEventListener("pointercancel", finishCarouselSwipe);
showSlide(0);
