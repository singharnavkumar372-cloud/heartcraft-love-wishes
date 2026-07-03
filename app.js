/* ==========================================================================
   HEARTCRAFT CORE APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // Application State
  const state = {
    boyName: '',
    girlName: '',
    surpriseType: 'gf-proposal',
    title: '',
    message: '',
    specialDate: '',
    nickname: '',
    quizQuestion: '',
    quizAnswer: '',
    theme: 'rose',
    particleStyle: 'hearts',
    musicTrack: 'piano',
    enableNoEscape: true,
    audioPlaying: false,
    audioCtx: null
  };

  const APP_URL = "https://singharnavkumar372-cloud.github.io/heartcraft-love-wishes/";

  // Preset Text Templates
  const PRESETS = {
    'gf-proposal': {
      title: "Will You Be My Girlfriend?",
      message: "From the moment you walked into my life, every single day has felt brighter and more beautiful. Your smile lights up my world in ways words can never fully capture. I can't imagine my journey without you by my side. Will you make me the happiest person alive and be my girlfriend?"
    },
    'wife-proposal': {
      title: "Will You Marry Me?",
      message: "You are my best friend, my soulmate, and my entire world. Building a life with you has been the greatest adventure of my life, and I want this adventure to last forever. Hand in hand, heart to heart, will you do me the absolute honor of becoming my wife?"
    },
    'love-letter': {
      title: "My Heart Belongs To You Always",
      message: "Dearest Love,\n\nI wanted to write this letter to remind you of how deeply and genuinely you are loved. Every laugh we share, every quiet moment, and every memory we build together is a treasure I hold close to my heart.\n\nThank you for being my constant warmth, my peace, and my inspiration. No matter where life takes us, my heart will always find its home in yours."
    },
    'birthday-wish': {
      title: "Happy Birthday My Sunshine! 🎂",
      message: "Wishing the happiest and most magical birthday to the one who makes my world spin! May your year ahead be overflowing with happiness, laughter, success, and all the boundless love you so richly deserve. Today and every day, I celebrate you!"
    },
    'anniversary-wish': {
      title: "Happy Anniversary My Love 🥂",
      message: "Happy Anniversary! Looking back at all the moments we've shared, I am filled with immense gratitude. Every year with you gets sweeter, every memory more cherished. Here is to celebrating us, our journey, and the endless beautiful years yet to come!"
    },
    'reasons-love': {
      title: "Reasons Why You Are My World",
      message: "Here are just a few of the infinite reasons why my heart chose you:"
    }
  };

  const DEFAULT_REASONS = [
    "Your magical smile brightens my darkest days ✨",
    "The warm, comforting way you laugh at my jokes 💖",
    "How kind and thoughtful you are to everyone 🌹",
    "The way your eyes sparkle when you talk about your passions 🌟",
    "You make me want to be the best version of myself 👑",
    "Holding your hand feels like coming home 🏡",
    "Our endless late-night chats and silly moments 🌙",
    "Simply because you are YOU, uniquely perfect in every way ❤️"
  ];

  // DOM Elements
  const creatorView = document.getElementById('creator-view');
  const receiverView = document.getElementById('receiver-view');
  const navCreateBtn = document.getElementById('new-create-btn');
  const particlesCanvas = document.getElementById('particles-canvas');

  // Initialize Particle Canvas
  initParticlesCanvas();

  // Register PWA Service Worker & Install Prompt
  initPwaInstaller();

  // Setup Download Banner & Modal Listeners
  initDownloadModal();

  // Check Hash Signature
  checkUrlPayload();

  window.addEventListener('hashchange', checkUrlPayload);

  function checkUrlPayload() {
    if (window.location.hash && window.location.hash.includes('#card=')) {
      try {
        const rawPayloadStr = window.location.hash.split('#card=')[1];
        const payload = decodePayload(rawPayloadStr);
        if (payload && payload.boyName && payload.girlName) {
          renderRecipientMode(payload);
          return;
        }
      } catch (e) {
        console.error("Payload decode error:", e);
      }
    }
    initCreatorStudio();
  }

  /* ==========================================================================
     ROBUST UNICODE & EMOJI SAFE ENCODER / DECODER
     ========================================================================== */
  function encodePayload(obj) {
    const jsonStr = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodePayload(base64Str) {
    let base64 = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr);
  }

  /* ==========================================================================
     CREATOR STUDIO LOGIC
     ========================================================================== */
  function initCreatorStudio() {
    creatorView.classList.add('active');
    receiverView.classList.remove('active');
    navCreateBtn.classList.add('hidden');

    // Copy App Link Button
    const copyAppBtn = document.getElementById('copy-app-link-btn');
    if (copyAppBtn) {
      copyAppBtn.onclick = () => copyToClipboard(APP_URL);
    }

    // Step Navigation
    document.querySelectorAll('.btn-next').forEach(btn => {
      btn.onclick = (e) => {
        const nextStep = e.currentTarget.getAttribute('data-next');
        switchStep(nextStep);
      };
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
      btn.onclick = (e) => {
        const prevStep = e.currentTarget.getAttribute('data-prev');
        switchStep(prevStep);
      };
    });

    // Experience Selection
    document.querySelectorAll('.exp-card').forEach(card => {
      card.onclick = (e) => {
        document.querySelectorAll('.exp-card').forEach(c => c.classList.remove('active'));
        const currentCard = e.currentTarget;
        currentCard.classList.add('active');
        const radio = currentCard.querySelector('input[type="radio"]');
        radio.checked = true;
        state.surpriseType = radio.value;

        const preset = PRESETS[state.surpriseType];
        if (preset) {
          document.getElementById('custom-title').value = preset.title;
          document.getElementById('custom-message').value = preset.message;
        }
      };
    });

    // Preset Button Click
    document.getElementById('preset-btn').onclick = () => {
      const radio = document.querySelector('input[name="surprise-type"]:checked');
      const type = radio ? radio.value : 'gf-proposal';
      const preset = PRESETS[type];
      if (preset) {
        document.getElementById('custom-title').value = preset.title;
        document.getElementById('custom-message').value = preset.message;
      }
    };

    // Theme Selection
    document.querySelectorAll('.theme-card').forEach(card => {
      card.onclick = (e) => {
        document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
        const currentCard = e.currentTarget;
        currentCard.classList.add('active');
        const theme = currentCard.getAttribute('data-theme');
        state.theme = theme;
        applyTheme(theme);
      };
    });

    // Generate Share Link & Preview
    document.getElementById('generate-btn').onclick = () => {
      const boyName = document.getElementById('boy-name').value.trim();
      const girlName = document.getElementById('girl-name').value.trim();

      if (!boyName || !girlName) {
        alert("Please enter both your name and your partner's name!");
        switchStep('1');
        return;
      }

      state.boyName = boyName;
      state.girlName = girlName;
      state.title = document.getElementById('custom-title').value.trim() || PRESETS[state.surpriseType].title;
      state.message = document.getElementById('custom-message').value.trim() || PRESETS[state.surpriseType].message;
      state.specialDate = document.getElementById('special-date').value;
      state.nickname = document.getElementById('nickname-girl').value.trim();
      state.quizQuestion = document.getElementById('quiz-question').value.trim();
      state.quizAnswer = document.getElementById('quiz-answer').value.trim();
      state.particleStyle = document.getElementById('particle-style').value;
      state.musicTrack = document.getElementById('music-track').value;
      state.enableNoEscape = document.getElementById('enable-no-escape').checked;

      // Encode Payload to Hash
      const encodedPayload = encodePayload(state);
      
      // Update URL hash
      window.location.hash = `#card=${encodedPayload}`;

      // Render Showcase Mode immediately
      renderRecipientMode(state);
    };
  }

  function switchStep(stepNum) {
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step-${stepNum}`).classList.add('active');

    document.querySelectorAll('.step-item').forEach(item => {
      const itemStep = item.getAttribute('data-step');
      if (itemStep <= stepNum) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     RECIPIENT / SHOWCASE PRESENTATION MODE
     ========================================================================== */
  function renderRecipientMode(payload) {
    creatorView.classList.remove('active');
    receiverView.classList.add('active');
    navCreateBtn.classList.remove('hidden');

    applyTheme(payload.theme || 'rose');

    const girlNameStr = payload.nickname ? `${payload.girlName} (${payload.nickname})` : payload.girlName;

    // Countdown Timer Init
    if (payload.specialDate) {
      document.getElementById('countdown-bar').classList.remove('hidden');
      startCountdown(payload.specialDate);
    } else {
      document.getElementById('countdown-bar').classList.add('hidden');
    }

    // Envelope & Quiz Overlay
    const envelopeCover = document.getElementById('envelope-cover');
    const quizOverlay = document.getElementById('quiz-overlay');
    const openBtn = document.getElementById('open-envelope-btn');
    const showcaseContent = document.getElementById('showcase-content');

    document.getElementById('envelope-tagline').innerText = `A Special Surprise for ${girlNameStr}`;

    openBtn.onclick = () => {
      envelopeCover.classList.add('hidden');
      if (payload.quizQuestion && payload.quizAnswer) {
        // Require Quiz Answer
        quizOverlay.classList.remove('hidden');
        document.getElementById('quiz-question-display').innerText = payload.quizQuestion;
        
        document.getElementById('submit-quiz-btn').onclick = () => {
          const userAns = document.getElementById('quiz-answer-input').value.trim();
          if (userAns.toLowerCase() === payload.quizAnswer.toLowerCase()) {
            quizOverlay.classList.add('hidden');
            showcaseContent.classList.remove('hidden');
            fireConfetti();
            playAmbientAudio(payload.musicTrack);
          } else {
            document.getElementById('quiz-error').classList.remove('hidden');
          }
        };
      } else {
        showcaseContent.classList.remove('hidden');
        fireConfetti();
        playAmbientAudio(payload.musicTrack);
      }
    };

    // Hide all experience containers first
    document.getElementById('proposal-card-container').classList.add('hidden');
    document.getElementById('love-letter-container').classList.add('hidden');
    document.getElementById('birthday-card-container').classList.add('hidden');
    document.getElementById('reasons-card-container').classList.add('hidden');

    // Experience Specific Rendering
    if (payload.surpriseType === 'gf-proposal' || payload.surpriseType === 'wife-proposal') {
      const proposalContainer = document.getElementById('proposal-card-container');
      proposalContainer.classList.remove('hidden');

      document.getElementById('view-girl-name').innerText = girlNameStr;
      document.getElementById('view-boy-name').innerText = payload.boyName;
      document.getElementById('view-proposal-title').innerText = payload.title;
      document.getElementById('view-proposal-message').innerText = payload.message;

      const ringBox = document.getElementById('ring-box-wrapper');
      if (payload.surpriseType === 'wife-proposal') {
        ringBox.classList.remove('hidden');
        const vRing = document.getElementById('virtual-ring-box');
        vRing.onclick = () => {
          vRing.classList.toggle('open');
          fireConfetti();
        };
      } else {
        ringBox.classList.add('hidden');
      }

      // Escaping No Button Logic
      const noBtn = document.getElementById('no-btn');
      const yesBtn = document.getElementById('yes-btn');
      const celebrationBanner = document.getElementById('yes-celebration-banner');
      const buttonsArea = document.getElementById('proposal-buttons-area');

      if (payload.enableNoEscape !== false) {
        noBtn.addEventListener('mouseover', moveNoButton);
        noBtn.addEventListener('touchstart', (e) => {
          e.preventDefault();
          moveNoButton();
        });
      }

      function moveNoButton() {
        const parentRect = proposalContainer.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();

        const maxX = parentRect.width - btnRect.width - 40;
        const maxY = parentRect.height - btnRect.height - 40;

        const randomX = Math.max(20, Math.floor(Math.random() * maxX));
        const randomY = Math.max(20, Math.floor(Math.random() * maxY));

        noBtn.style.position = 'absolute';
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
      }

      yesBtn.onclick = () => {
        buttonsArea.classList.add('hidden');
        celebrationBanner.classList.remove('hidden');
        if (payload.specialDate) {
          document.getElementById('celebration-date-badge').innerText = `Marked Special Day: ${payload.specialDate}`;
        }
        fireFireworks();
      };

    } else if (payload.surpriseType === 'love-letter') {
      const letterContainer = document.getElementById('love-letter-container');
      letterContainer.classList.remove('hidden');

      document.getElementById('view-letter-title').innerText = payload.title;
      document.getElementById('view-letter-body').innerText = payload.message;
      document.getElementById('view-letter-sender').innerText = payload.boyName;

    } else if (payload.surpriseType === 'birthday-wish') {
      const bdayContainer = document.getElementById('birthday-card-container');
      bdayContainer.classList.remove('hidden');

      document.getElementById('view-bday-title').innerText = payload.title;
      document.getElementById('view-bday-girl').innerText = girlNameStr;
      document.getElementById('view-bday-message').innerText = payload.message;

      const flame = document.getElementById('cake-flame');
      flame.parentElement.onclick = () => {
        flame.classList.toggle('off');
        fireConfetti();
      };

    } else if (payload.surpriseType === 'reasons-love') {
      const reasonsContainer = document.getElementById('reasons-card-container');
      reasonsContainer.classList.remove('hidden');

      const grid = document.getElementById('reasons-grid');
      grid.innerHTML = '';

      DEFAULT_REASONS.forEach((reason, idx) => {
        const card = document.createElement('div');
        card.className = 'reason-card';
        card.innerHTML = `<span>Reason #${idx + 1}<br><b>(Tap to flip)</b></span>`;
        card.onclick = () => {
          card.classList.toggle('flipped');
          if (card.classList.contains('flipped')) {
            card.innerHTML = `<span>${reason}</span>`;
            fireConfetti();
          } else {
            card.innerHTML = `<span>Reason #${idx + 1}<br><b>(Tap to flip)</b></span>`;
          }
        };
        grid.appendChild(card);
      });
    }

    // Share Bar Actions
    const currentUrl = window.location.href;
    document.getElementById('copy-link-btn').onclick = () => copyToClipboard(currentUrl);
    document.getElementById('whatsapp-share-btn').onclick = () => {
      const text = encodeURIComponent(`💖 ${payload.boyName} sent you a special romantic surprise on HeartCraft! Open your link here: ${currentUrl}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    };

    document.getElementById('download-card-btn').onclick = saveCardSnapshot;

    document.getElementById('qr-code-btn').onclick = () => openQrModal(currentUrl);

    navCreateBtn.onclick = () => {
      window.location.hash = '';
      window.location.reload();
    };
  }

  /* ==========================================================================
     APP DOWNLOAD BANNER & MODAL LOGIC
     ========================================================================== */
  function initDownloadModal() {
    const banner = document.getElementById('top-download-banner');
    const bannerBtn = document.getElementById('banner-download-btn');
    const bannerClose = document.getElementById('banner-close-btn');

    const modal = document.getElementById('app-download-modal');
    const navInstallBtn = document.getElementById('pwa-install-btn');
    const closeBtn = document.getElementById('close-app-modal');
    const copyAppBtn = document.getElementById('modal-copy-app-btn');

    if (bannerClose) {
      bannerClose.onclick = () => banner.style.display = 'none';
    }

    const openAppModal = () => {
      modal.classList.remove('hidden');
    };

    if (bannerBtn) bannerBtn.onclick = openAppModal;
    if (navInstallBtn) navInstallBtn.onclick = openAppModal;

    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.add('hidden');
    }

    if (copyAppBtn) {
      copyAppBtn.onclick = () => copyToClipboard(APP_URL);
    }
  }

  /* ==========================================================================
     COUNTDOWN TIMER ENGINE
     ========================================================================== */
  function startCountdown(dateStr) {
    const targetDate = new Date(dateStr).getTime();
    if (isNaN(targetDate)) return;

    function update() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        document.getElementById('cd-days').innerText = "00";
        document.getElementById('cd-hours').innerText = "00";
        document.getElementById('cd-mins').innerText = "00";
        document.getElementById('cd-secs').innerText = "00";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
      document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
      document.getElementById('cd-mins').innerText = String(mins).padStart(2, '0');
      document.getElementById('cd-secs').innerText = String(secs).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ==========================================================================
     CARD SNAPSHOT DOWNLOADER
     ========================================================================== */
  function saveCardSnapshot() {
    window.print();
  }

  /* ==========================================================================
     PWA SERVICE WORKER & APP DOWNLOADER
     ========================================================================== */
  let deferredPrompt = null;

  function initPwaInstaller() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(err => console.log('SW registration skipped', err));
    }

    const modalInstallBtn = document.getElementById('modal-install-pwa-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });

    if (modalInstallBtn) {
      modalInstallBtn.onclick = async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            document.getElementById('app-download-modal').classList.add('hidden');
          }
          deferredPrompt = null;
        } else {
          alert("📲 Android APK / PWA Download Guide:\n\n1. In Chrome / Edge: Tap 3 dots (⋮) in upper right.\n2. Tap 'Install app' or 'Add to Home screen'.\n3. HeartCraft will be installed directly to your phone menu as an Android APK app!");
        }
      };
    }
  }

  /* ==========================================================================
     THEME & AUDIO SYNTHESIZER
     ========================================================================== */
  function applyTheme(themeName) {
    document.body.className = `theme-${themeName}`;
  }

  function playAmbientAudio(trackType) {
    if (state.audioPlaying) return;
    state.audioPlaying = true;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      state.audioCtx = new AudioContext();
      
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      let noteIndex = 0;

      const playChime = () => {
        if (!state.audioPlaying || !state.audioCtx) return;
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[noteIndex % notes.length], state.audioCtx.currentTime);
        noteIndex++;

        gain.gain.setValueAtTime(0.08, state.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + 3.0);

        osc.connect(gain);
        gain.connect(state.audioCtx.destination);

        osc.start();
        osc.stop(state.audioCtx.currentTime + 3.0);

        setTimeout(playChime, 1500);
      };

      playChime();
    } catch (e) {
      console.log("Audio play deferred or unsupported");
    }
  }

  // Audio Toggle Header Button
  document.getElementById('music-toggle').onclick = () => {
    if (state.audioPlaying) {
      state.audioPlaying = false;
      if (state.audioCtx) state.audioCtx.close();
      alert("Background melody muted.");
    } else {
      playAmbientAudio('piano');
      alert("Playing romantic background melodies!");
    }
  };

  // Theme Toggle Button
  document.getElementById('theme-toggle').onclick = () => {
    const themes = ['rose', 'midnight', 'sunset', 'cyber'];
    const currentIdx = themes.indexOf(state.theme);
    const nextTheme = themes[(currentIdx + 1) % themes.length];
    state.theme = nextTheme;
    applyTheme(nextTheme);
  };

  /* ==========================================================================
     CONFETTI & FIREWORKS ENGINE
     ========================================================================== */
  function fireConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  function fireFireworks() {
    if (typeof confetti === 'function') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
      }, 250);
    }
  }

  /* ==========================================================================
     PARTICLE CANVAS BACKGROUND
     ========================================================================== */
  function initParticlesCanvas() {
    const ctx = particlesCanvas.getContext('2d');
    let width = particlesCanvas.width = window.innerWidth;
    let height = particlesCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = particlesCanvas.width = window.innerWidth;
      height = particlesCanvas.height = window.innerHeight;
    });

    const particles = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 14 + 8,
        speedY: Math.random() * 1 + 0.3,
        speedX: Math.random() * 0.6 - 0.3,
        opacity: Math.random() * 0.7 + 0.3,
        rotation: Math.random() * 360
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.rotation += 0.5;

        if (p.y < -30) {
          p.y = height + 30;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = '#ff3366';
        
        ctx.beginPath();
        const topCurveHeight = p.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -p.size / 2, 0, -p.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-p.size / 2, (p.size + topCurveHeight) / 2, 0, p.size, 0, p.size);
        ctx.bezierCurveTo(0, p.size, p.size / 2, (p.size + topCurveHeight) / 2, p.size / 2, topCurveHeight);
        ctx.bezierCurveTo(p.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ==========================================================================
     QR CODE & COPY MODAL HELPERS
     ========================================================================== */
  function openQrModal(url) {
    const modal = document.getElementById('qr-modal');
    const qrContainer = document.getElementById('qrcode-container');
    const shareInput = document.getElementById('share-url-input');

    qrContainer.innerHTML = '';
    shareInput.value = url;

    if (typeof QRCode === 'function') {
      new QRCode(qrContainer, {
        text: url,
        width: 180,
        height: 180,
        colorDark: "#2b1055",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }

    modal.classList.remove('hidden');

    document.getElementById('close-qr-modal').onclick = () => modal.classList.add('hidden');
    document.getElementById('modal-copy-btn').onclick = () => copyToClipboard(url);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert("💖 Copied to clipboard!");
    }).catch(() => {
      prompt("Copy link manually:", text);
    });
  }

});
