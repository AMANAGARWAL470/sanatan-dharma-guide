document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Reading Progress Bar ──────────────────────────────
  const progressBar = document.getElementById('progress');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = (window.scrollY / (total || 1)) * 100;
    if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  });

  // ── 2. Hamburger Menu Toggle ─────────────────────────────
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      // Prevent page scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on any nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });

    // Close menu on outside click
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

    // Close menu on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      }
    });
  }

  // ── 3. Myth vs Fact Accordion Toggles ───────────────────
  const mythHeaders = document.querySelectorAll('.myth-header');
  mythHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const card   = header.closest('.myth-card');
      const body   = card.querySelector('.myth-body');
      const isOpen = card.classList.contains('open');

      // Close all others
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

  // ── 4. Interactive Beginner Quiz ─────────────────────────
  const quizBtns  = document.querySelectorAll('.quiz-btn');
  const quizResult = document.getElementById('quizResult');

  const quizAnswers = {
    'action': {
      title: '🌿 Your Path: Karma Yoga (Path of Selfless Action)',
      desc: 'You love making a positive impact through duty, work, and service. You thrive by acting selflessly — doing your best without worrying about the result. Start with: <a href="modules/02-scriptures/bhagavad-gita.html" style="color:var(--gold-bright)">Bhagavad Gita — Lesson 2.3</a>.'
    },
    'devotion': {
      title: '❤️ Your Path: Bhakti Yoga (Path of Loving Devotion)',
      desc: 'You feel connected to the divine through emotion, love, prayer, and gratitude. You see the divine in all beings and relationships. Start with: <a href="modules/03-deities-symbols/trimurti-gods.html" style="color:var(--gold-bright)">Module 3 — Deities</a>.'
    },
    'wisdom': {
      title: '🧠 Your Path: Jñāna Yoga (Path of Knowledge)',
      desc: 'You love asking big questions: "Who am I?", "What is real?". You connect through self-inquiry and deep contemplation. Start with: <a href="modules/02-scriptures/upanishads.html" style="color:var(--gold-bright)">The Upanishads — Lesson 2.2</a>.'
    },
    'mind': {
      title: '🧘 Your Path: Rāja Yoga (Path of Meditation)',
      desc: 'You seek inner quiet and stillness. You connect through breathwork, focus, and self-discipline. Start with: <a href="modules/04-lifestyle-rites/daily-practices.html" style="color:var(--gold-bright)">Yoga & Meditation — Lesson 4.1</a>.'
    }
  };

  quizBtns.forEach(btn => {
    btn.addEventListener('click', () => {
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

});
