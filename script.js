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
  let userPausedMusic = false;

  /*
   * CHAPTER NAVIGATION
   */

  function showScreen(screenId) {
    const targetIndex = screens.findIndex(
      (screen) => screen.id === screenId
    );

    if (targetIndex === -1) return;

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
   * BACKGROUND MUSIC
   */

  function updateMusicButton() {
    if (!musicButton || !musicIcon || !musicLabel) return;

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

  async function startMusic() {
    if (!music || userPausedMusic) return;

    try {
      music.loop = true;
      music.volume = 0.65;

      await music.play();

      musicPlaying = true;
      updateMusicButton();

      return true;
    } catch (error) {
      musicPlaying = false;
      updateMusicButton();

      console.info(
        "Autoplay was blocked or the audio could not start.",
        error
      );

      return false;
    }
  }

  function pauseMusic() {
    if (!music) return;

    music.pause();
    musicPlaying = false;

    updateMusicButton();
  }

  /*
   * ATTEMPT AUTOPLAY AS SOON AS THE PAGE OPENS
   */

  if (music) {
    music.loop = true;
    music.preload = "auto";
    music.volume = 0.65;

    // Browsers may allow autoplay, but may also block it.
    startMusic();

    // If autoplay was blocked, retry on the visitor's
    // first interaction with the page.
    const retryAutoplay = () => {
      if (!musicPlaying && !userPausedMusic) {
        startMusic();
      }

      document.removeEventListener("touchstart", retryAutoplay);
      document.removeEventListener("click", retryAutoplay);
      document.removeEventListener("keydown", retryAutoplay);
    };

    document.addEventListener(
      "touchstart",
      retryAutoplay,
      { once: true, passive: true }
    );

    document.addEventListener(
      "click",
      retryAutoplay,
      { once: true }
    );

    document.addEventListener(
      "keydown",
      retryAutoplay,
      { once: true }
    );

    // Keep the music control available.
    if (musicButton) {
      musicButton.addEventListener("click", async (event) => {
        event.stopPropagation();

        if (musicPlaying && !music.paused) {
          userPausedMusic = true;
          pauseMusic();
          return;
        }

        userPausedMusic = false;
        await startMusic();
      });
    }

    music.addEventListener("play", () => {
      musicPlaying = true;
      updateMusicButton();
    });

    music.addEventListener("pause", () => {
      musicPlaying = false;
      updateMusicButton();
    });

    music.addEventListener("ended", () => {
      musicPlaying = false;
      updateMusicButton();
    });

    music.addEventListener("error", () => {
      musicPlaying = false;
      updateMusicButton();

      console.warn(
        "The soundtrack could not load. Check the MP3 path."
      );
    });
  }

  /*
   * ENTER THE EXPERIENCE
   */

  if (enterButton) {
    enterButton.addEventListener("click", async () => {
      showScreen("atm");

      // A button tap is a user interaction, so this is
      // another opportunity for the browser to allow audio.
      if (music && music.paused && !userPausedMusic) {
        await startMusic();
      }
    });
  }

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
    if (!petalsContainer) return;

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

  createPetals(10);

  window.setInterval(() => {
    createPetal();
  }, 1800);

  /*
   * FINAL LETTER ENVELOPE
   */

  if (envelopeButton) {
    envelopeButton.addEventListener("click", () => {
      if (envelopeOpened) return;

      envelopeOpened = true;

      envelopeButton.classList.add("opened");

      envelopeButton.setAttribute(
        "aria-label",
        "Birthday letter opened"
      );

      envelopeButton.disabled = true;

      window.setTimeout(() => {
        if (finalLetter) {
          finalLetter.hidden = false;

          finalLetter.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }

        // Reveal the final birthday message after the letter.
        window.setTimeout(() => {
          if (finalBirthday) {
            finalBirthday.hidden = false;
          }
        }, 1800);
      }, 650);
    });
  }

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