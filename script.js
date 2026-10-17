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

  let envelopeOpened = false;
  let musicPlaying = false;
  let userPausedMusic = false;
  let musicStartAttemptInProgress = false;

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

      musicButton.setAttribute("aria-pressed", "true");
    } else {
      musicIcon.textContent = "♫";
      musicLabel.textContent = "Play music";

      musicButton.setAttribute(
        "aria-label",
        "Play background music"
      );

      musicButton.setAttribute("aria-pressed", "false");
    }
  }

  async function startMusic() {
    if (!music || userPausedMusic) return false;

    // Avoid multiple simultaneous play() requests.
    if (musicStartAttemptInProgress) return false;

    if (!music.paused && !music.ended) {
      musicPlaying = true;
      updateMusicButton();
      return true;
    }

    musicStartAttemptInProgress = true;

    try {
      music.loop = true;
      music.volume = 0.65;

      const playPromise = music.play();

      if (playPromise !== undefined) {
        await playPromise;
      }

      musicPlaying = !music.paused;
      updateMusicButton();

      return musicPlaying;
    } catch (error) {
      musicPlaying = false;
      updateMusicButton();

      console.warn(
        "Music did not start. Check the audio file path and browser playback permissions.",
        error
      );

      return false;
    } finally {
      musicStartAttemptInProgress = false;
    }
  }

  function pauseMusic() {
    if (!music) return;

    music.pause();
    musicPlaying = false;
    updateMusicButton();
  }

  /*
   * PREPARE AUDIO
   */

  if (music) {
    music.loop = true;
    music.preload = "auto";
    music.volume = 0.65;

    // Prepare the file without assuming autoplay will be permitted.
    music.load();

    // Try autoplay. Some browsers will allow it; others will block it.
    startMusic();

    /*
     * If autoplay is blocked, a real visitor interaction can
     * give the browser permission to start the soundtrack.
     */
    const retryMusic = () => {
      if (music.paused && !userPausedMusic) {
        startMusic();
      }
    };

    document.addEventListener("pointerdown", retryMusic, {
      once: true,
      passive: true
    });

    document.addEventListener("keydown", retryMusic, {
      once: true
    });

    /*
     * MUSIC BUTTON
     */

    if (musicButton) {
      musicButton.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!music.paused) {
          userPausedMusic = true;
          pauseMusic();
          return;
        }

        // Explicitly tapping Play means the visitor wants music.
        userPausedMusic = false;

        await startMusic();
      });
    }

    /*
     * KEEP THE BUTTON SYNCHRONIZED WITH THE AUDIO
     */

    music.addEventListener("playing", () => {
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

      console.error(
        "The soundtrack could not load. Verify the MP3 file path and file format."
      );
    });

    music.addEventListener("canplay", () => {
      console.info("Hadiya's soundtrack is ready to play.");
    });
  }

  /*
   * ENTER THE EXPERIENCE
   *
   * Attempt playback directly from the visitor's button tap.
   */

  if (enterButton) {
    enterButton.addEventListener("click", async () => {
      showScreen("atm");

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