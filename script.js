/* =========================================
   HADIYA — CHAPTER 24
   Interactive experience
========================================= */
document.addEventListener("DOMContentLoaded", () => {
  const screens = Array.from(document.querySelectorAll(".screen"));
  const progressDots = Array.from(
    document.querySelectorAll(".progress-dot")
  );
  const enterButton = document.getElementById("enterButton");
  const petalsContainer = document.getElementById("petals");
  const music = document.getElementById("birthdayMusic");
  const musicButton = document.getElementById("musicButton");
  const musicIcon = document.getElementById("musicIcon");
  const musicLabel = document.getElementById("musicLabel");
  const envelopeButton = document.getElementById("envelopeButton");
  const finalLetter = document.getElementById("finalLetter");
  const finalBirthday = document.getElementById("finalBirthday");
  let currentScreenIndex = 0;
  let envelopeOpened = false;
  let musicPlaying = false;
  /*
   * CHAPTER NAVIGATION
   */
  function showScreen(screenId) {
    const targetIndex = screens.findIndex(
      (screen) => screen.id === screenId
    );
    if (targetIndex === -1) {
      return;
    }
    screens.forEach((screen) => {
      screen.classList.remove("active");
      screen.setAttribute("aria-hidden", "true");
    });
    progressDots.forEach((dot, index) => {
      dot.classList.toggle("active", index === targetIndex);
    });
    const targetScreen = screens[targetIndex];
    targetScreen.classList.add("active");
    targetScreen.setAttribute("aria-hidden", "false");
    currentScreenIndex = targetIndex;
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    createPetals(7);
  }
  /*
   * ENTER THE EXPERIENCE
   */
  enterButton.addEventListener("click", () => {
    showScreen("atm");
  });
  /*
   * NEXT CHAPTER BUTTONS
   */
  document.querySelectorAll(".next-button").forEach((button) => {
    button.addEventListener("click", () => {
      const nextScreen = button.dataset.next;
      if (nextScreen) {
        showScreen(nextScreen);
      }
    });
  });
  /*
   * FALLING PETALS
   */
  function createPetal() {
    if (!petalsContainer) {
      return;
    }
    const petal = document.createElement("span");
    petal.className = "petal";
    const size = 6 + Math.random() * 9;
    const duration = 7 + Math.random() * 8;
    const startPosition = Math.random() * 100;
    petal.style.left = `${startPosition}%`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.45}px`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.opacity = `${0.25 + Math.random() * 0.45}`;
    petalsContainer.appendChild(petal);
    window.setTimeout(() => {
      petal.remove();
    }, duration * 1000);
  }
  function createPetals(amount = 5) {
    for (let i = 0; i < amount; i++) {
      window.setTimeout(() => {
        createPetal();
      }, i * 180);
    }
  }
  // Keep the effect subtle rather than filling the screen.
  createPetals(10);
  window.setInterval(() => {
    createPetal();
  }, 1800);
  /*
   * BACKGROUND MUSIC
   *
   * Music starts only after the visitor taps
   * the music button.
   */
  function updateMusicButton() {
    if (musicPlaying) {
      musicIcon.textContent = "Ⅱ";
      musicLabel.textContent = "Pause music";
      musicButton.setAttribute(
        "aria-label",
        "Pause background music"
      );
    } else {
      musicIcon.textContent = "♫";
      musicLabel.textContent = "Play music";
      musicButton.setAttribute(
        "aria-label",
        "Play background music"
      );
    }
  }
  musicButton.addEventListener("click", async () => {
    if (!music) {
      return;
    }
    if (musicPlaying) {
      music.pause();
      musicPlaying = false;
      updateMusicButton();
      return;
    }
    try {
      await music.play();
      musicPlaying = true;
      updateMusicButton();
    } catch (error) {
      musicPlaying = false;
      updateMusicButton();
      console.warn(
        "Music could not be played. Check the audio file.",
        error
      );
    }
  });
  music.addEventListener("ended", () => {
    musicPlaying = false;
    updateMusicButton();
  });
  music.addEventListener("pause", () => {
    musicPlaying = false;
    updateMusicButton();
  });
  music.addEventListener("play", () => {
    musicPlaying = true;
    updateMusicButton();
  });
  /*
   * FINAL LETTER ENVELOPE
   */
  envelopeButton.addEventListener("click", () => {
    if (envelopeOpened) {
      return;
    }
    envelopeOpened = true;
    envelopeButton.classList.add("opened");
    envelopeButton.setAttribute(
      "aria-label",
      "Birthday letter opened"
    );
    envelopeButton.disabled = true;
    window.setTimeout(() => {
      finalLetter.hidden = false;
      finalLetter.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      // Reveal the final birthday message after the letter.
      window.setTimeout(() => {
        finalBirthday.hidden = false;
      }, 1800);
    }, 650);
  });
  /*
   * INITIAL ACCESSIBILITY STATE
   */
  screens.forEach((screen, index) => {
    screen.setAttribute(
      "aria-hidden",
      index === 0 ? "false" : "true"
    );
  });
  updateMusicButton();
  /*
   * PREVENT ACCIDENTAL PAGE JUMPS
   */
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });
});