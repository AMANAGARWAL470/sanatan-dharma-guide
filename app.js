document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════════════════════════
  // 1. WEB AUDIO API — Sacred Temple Bell / Singing Bowl Chime
  // ══════════════════════════════════════════════════════════
  let audioCtx = null;
  let soundEnabled = localStorage.getItem('sd_sound_enabled') !== 'false';

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a resonant 432Hz Temple Bell / Singing Bowl Tone
  window.playTempleChime = function(freq = 432, duration = 3.0) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      
      // Master Gain for smooth fade out
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.3, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(audioCtx.destination);

      # Fundamental Sine Oscillator (432 Hz - Om frequency)
      const osc1 = audioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      # Harmonic Overtone (Singing Bowl shimmer)
      const osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.76, now); // Metallic overtone ratio

      # Sub-harmonic (Deep warm bass resonance)
      const osc3 = audioCtx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq / 2, now);

      const gain2 = audioCtx.createGain();
      gain2.gain.setValueAtTime(0.12, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.7));

      const gain3 = audioCtx.createGain();
      gain3.gain.setValueAtTime(0.2, now);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(masterGain);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc3.connect(gain3);
      gain3.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + duration);
      osc2.stop(now + duration);
      osc3.stop(now + duration);
    } catch (e) {
      console.log('Audio chime disabled:', e);
    }
  };

  // Play a soft click chime for UI buttons
  window.playClickChime = function() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(864, now);
      osc.frequency.exponentialRampToValueAtTime(432, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  };

  // Create Sound Toggle Button in Header
  const headerBar = document.querySelector('.header-bar');
  if (headerBar) {
    const soundBtn = document.createElement('button');
    soundBtn.className = 'sound-toggle-btn';
    soundBtn.setAttribute('aria-label', 'Toggle sacred sound effects');
    soundBtn.style.cssText = `
      background: rgba(212, 160, 23, 0.12);
      border: 1px solid rgba(212, 160, 23, 0.3);
      color: var(--gold-bright);
      padding: 6px 14px;
      border-radius: 20px;
      font-family: var(--mono);
      font-size: 11px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      margin-left: auto;
      margin-right: 12px;
    `;
    
    function updateSoundBtn() {
      soundBtn.innerHTML = soundEnabled ? '🔔 Sound: ON' : '🔕 Sound: OFF';
      soundBtn.style.opacity = soundEnabled ? '1' : '0.6';
    }
    updateSoundBtn();

    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      soundEnabled = !soundEnabled;
      localStorage.setItem('sd_sound_enabled', soundEnabled);
      updateSoundBtn();
      if (soundEnabled) {
        window.playTempleChime(432, 2.0);
      }
    });

    headerBar.insertBefore(soundBtn, headerBar.querySelector('.nav-toggle') || headerBar.lastChild);
  }

  // Play chime on first user click anywhere to initialize audio context
  document.addEventListener('click', () => { initAudio(); }, { once: true });
  document.addEventListener('touchstart', () => { initAudio(); }, { once: true });

  // ══════════════════════════════════════════════════════════
  // 2. READING PROGRESS BAR
  // ══════════════════════════════════════════════════════════
  const progressBar = document.getElementById('progress');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = (window.scrollY / (total || 1)) * 100;
    if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }, { passive: true });

  // ══════════════════════════════════════════════════════════
  // 3. HAMBURGER MENU TOGGLE (Mobile Overlay)
  // ══════════════════════════════════════════════════════════
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      window.playClickChime();
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', e => {
      if (navLinks.classList.contains('open') &&
          !navLinks.contains(e.target) &&
          !toggle.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      }
    });
  }

  // ══════════════════════════════════════════════════════════
  // 4. MYTH VS FACT ACCORDION TOGGLES
  // ══════════════════════════════════════════════════════════
  const mythHeaders = document.querySelectorAll('.myth-header');
  mythHeaders.forEach(header => {
    header.addEventListener('click', () => {
      window.playClickChime();
      const card   = header.closest('.myth-card');
      const body   = card.querySelector('.myth-body');
      const isOpen = card.classList.contains('open');

      document.querySelectorAll('.myth-card.open').forEach(c => {
        if (c !== card) {
          c.classList.remove('open');
          c.querySelector('.myth-body').style.maxHeight = null;
          c.querySelector('.myth-toggle').textContent = '+';
        }
      });

      if (isOpen) {
        card.classList.remove('open');
        body.style.maxHeight = null;
        header.querySelector('.myth-toggle').textContent = '+';
      } else {
        card.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        header.querySelector('.myth-toggle').textContent = '−';
      }
    });
  });

  // ══════════════════════════════════════════════════════════
  // 5. INTERACTIVE BEGINNER QUIZ
  // ══════════════════════════════════════════════════════════
  const quizBtns   = document.querySelectorAll('.quiz-btn');
  const quizResult = document.getElementById('quizResult');

  const quizAnswers = {
    'action': {
      title: '🌿 Your Path: Karma Yoga (Selfless Duty & Action)',
      desc: 'You love making a real-world difference through action, service, and duty. You grow spiritually by giving your best without stressing about the outcome.<br><br>👉 <strong>Recommended First Lesson:</strong> <a href="modules/02-scriptures/bhagavad-gita.html" style="color:var(--gold-bright);text-decoration:underline;">Lesson 2.3 — Bhagavad Gītā</a>.'
    },
    'devotion': {
      title: '❤️ Your Path: Bhakti Yoga (Loving Devotion & Gratitude)',
      desc: 'You connect deeply through heart, love, music, and gratitude. You see the divine in relationships and all living beings.<br><br>👉 <strong>Recommended First Lesson:</strong> <a href="modules/03-deities-symbols/trimurti-gods.html" style="color:var(--gold-bright);text-decoration:underline;">Lesson 3.1 — Deities & Trimūrti</a>.'
    },
    'wisdom': {
      title: '🧠 Your Path: Jñāna Yoga (Self-Inquiry & Philosophy)',
      desc: 'You love big questions: "Who am I?", "What is reality?". You connect through deep reading, logic, and self-inquiry.<br><br>👉 <strong>Recommended First Lesson:</strong> <a href="modules/02-scriptures/upanishads.html" style="color:var(--gold-bright);text-decoration:underline;">Lesson 2.2 — The Upanishads</a>.'
    },
    'mind': {
      title: '🧘 Your Path: Rāja Yoga (Meditation & Stillness)',
      desc: 'You seek inner quiet, focus, and breath awareness. You thrive through meditation and self-discipline.<br><br>👉 <strong>Recommended First Lesson:</strong> <a href="modules/04-lifestyle-rites/daily-practices.html" style="color:var(--gold-bright);text-decoration:underline;">Lesson 4.1 — Daily Habits & Yoga</a>.'
    }
  };

  quizBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.playTempleChime(540, 1.8);
      const type = btn.getAttribute('data-type');
      if (quizAnswers[type] && quizResult) {
        quizResult.style.display = 'block';
        quizResult.innerHTML = `
          <h4 style="font-family:var(--serif-display);font-size:22px;color:var(--gold-bright);margin-bottom:10px;">
            ${quizAnswers[type].title}
          </h4>
          <p style="color:var(--ivory);font-size:16px;line-height:1.7;">${quizAnswers[type].desc}</p>
        `;
        quizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // ══════════════════════════════════════════════════════════
  // 6. PROFESSIONAL SCROLL UNBLUR & FADE ANIMATION (IntersectionObserver)
  // ══════════════════════════════════════════════════════════
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('unblur-visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.step-card, .shloka-block, .analogy-box, .myth-card').forEach(el => {
    el.classList.add('unblur-init');
    scrollObserver.observe(el);
  });

});
