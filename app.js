document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════════════════════════
  // 1. WEB AUDIO API — Sacred Temple Bell / Singing Bowl Chime
  // ══════════════════════════════════════════════════════════
  let audioCtx = null;
  let soundEnabled = localStorage.getItem('sd_sound_enabled') !== 'false';

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a resonant 432Hz Temple Bell / Singing Bowl Tone
  window.playTempleChime = function(freq = 432, duration = 2.8) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.35, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(audioCtx.destination);

      const osc1 = audioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      const osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.76, now);

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

      osc1.start(now); osc2.start(now); osc3.start(now);
      osc1.stop(now + duration); osc2.stop(now + duration); osc3.stop(now + duration);
    } catch (e) {}
  };

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

      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(now); osc.stop(now + 0.12);
    } catch (e) {}
  };

  // Header Sound Toggle Button
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
      if (soundEnabled) window.playTempleChime(432, 2.0);
    });

    headerBar.insertBefore(soundBtn, headerBar.querySelector('.nav-toggle') || headerBar.lastChild);
  }

  document.addEventListener('click', () => { initAudio(); }, { once: true });
  document.addEventListener('touchstart', () => { initAudio(); }, { once: true });

  // ══════════════════════════════════════════════════════════
  // 2. GOLDEN CLICK / TOUCH RIPPLE EFFECT
  // ══════════════════════════════════════════════════════════
  function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => { ripple.remove(); }, 750);
  }

  document.addEventListener('click', e => {
    // Avoid creating double ripple on inputs or toggle buttons
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
    createRipple(e.clientX, e.clientY);
  });

  document.addEventListener('touchstart', e => {
    if (e.touches.length > 0) {
      createRipple(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // ══════════════════════════════════════════════════════════
  // 3. 3D CARD TILT & SPOTLIGHT GLARE TRACKER
  // ══════════════════════════════════════════════════════════
  const interactiveCards = document.querySelectorAll('.step-card, .myth-card, .shloka-block, .analogy-box');

  interactiveCards.forEach(card => {
    // Inject glare element
    if (!card.querySelector('.card-glare')) {
      const glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

      // 3D tilt calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -((y - centerY) / centerY) * 4; // Max 4 deg tilt
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });

    card.addEventListener('touchmove', e => {
      if (e.touches.length > 0) {
        const rect = card.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      }
    }, { passive: true });
  });

  // ══════════════════════════════════════════════════════════
  // 4. INTERACTIVE SHLOKA PLAYER (Click Shloka to Chant)
  // ══════════════════════════════════════════════════════════
  const shlokas = document.querySelectorAll('.shloka-block');
  shlokas.forEach(shloka => {
    shloka.style.cursor = 'pointer';
    shloka.title = 'Click/Tap to play sacred mantra chime';

    shloka.addEventListener('click', () => {
      window.playTempleChime(432, 3.2);
      shloka.classList.add('playing-shloka');
      setTimeout(() => { shloka.classList.remove('playing-shloka'); }, 3200);
    });
  });

  // ══════════════════════════════════════════════════════════
  // 5. AMBIENT GOLD SPARK CANVAS (For Subpages)
  // ══════════════════════════════════════════════════════════
  if (!document.getElementById('canvas') && !document.getElementById('ambient-canvas')) {
    const ambientCanvas = document.createElement('canvas');
    ambientCanvas.id = 'ambient-canvas';
    document.body.prepend(ambientCanvas);

    const actx = ambientCanvas.getContext('2d');
    let aW, aH, aParticles = [];

    function aResize() {
      aW = ambientCanvas.width = window.innerWidth;
      aH = ambientCanvas.height = window.innerHeight;
    }
    aResize();
    window.addEventListener('resize', aResize);

    class AmbientParticle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * aW;
        this.y = Math.random() * aH;
        this.vy = -(Math.random() * 0.3 + 0.1);
        this.vx = (Math.random() - 0.5) * 0.2;
        this.r = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.y += this.vy;
        this.x += this.vx;
        if (this.y < 0) this.reset();
      }
      draw() {
        actx.fillStyle = `rgba(242, 193, 78, ${this.alpha})`;
        actx.beginPath();
        actx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        actx.fill();
      }
    }

    for (let i = 0; i < 40; i++) aParticles.push(new AmbientParticle());

    function aLoop() {
      actx.clearRect(0, 0, aW, aH);
      aParticles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(aLoop);
    }
    aLoop();
  }

  // ══════════════════════════════════════════════════════════
  // 6. READING PROGRESS BAR
  // ══════════════════════════════════════════════════════════
  const progressBar = document.getElementById('progress');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = (window.scrollY / (total || 1)) * 100;
    if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }, { passive: true });

  // ══════════════════════════════════════════════════════════
  // 7. HAMBURGER MENU TOGGLE (Mobile Overlay)
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
  // 8. MYTH ACCORDIONS
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
  // 9. INTERACTIVE BEGINNER QUIZ
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
  // 10. SCROLL UNBLUR & SLIDE-UP ANIMATION
  // ══════════════════════════════════════════════════════════
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
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
