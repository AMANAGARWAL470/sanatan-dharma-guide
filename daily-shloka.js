/**
 * DAILY SHLOKA ENGINE v2.0
 * Rotates one verse per day, cached in localStorage.
 * Auto-injects a glowing shloka bar on pages with .beginner-hero
 */
(function () {
  const SHLOKAS = [
    { s: 'एकं सद्विप्रा बहुधा वदन्ति', i: 'Ekam Sad Vipra Bahudha Vadanti', m: 'Truth is One — the wise call it by many names.', src: 'Rig Veda 1.164.46', t: 'Unity of Truth' },
    { s: 'सर्वं खल्विदं ब्रह्म', i: 'Sarvam Khalvidam Brahma', m: 'All this universe is indeed Brahman.', src: 'Chandogya Upanishad 3.14.1', t: 'Brahman' },
    { s: 'अयमात्मा ब्रह्म', i: 'Ayam Atma Brahma', m: 'This Self is Brahman — the universal consciousness.', src: 'Mandukya Upanishad 2', t: 'Ātman' },
    { s: 'अहं ब्रह्मास्मि', i: 'Aham Brahmasmi', m: 'I am Brahman — the infinite, eternal Reality.', src: 'Brihadaranyaka Upanishad 1.4.10', t: 'Mahāvākya' },
    { s: 'तत्त्वमसि', i: 'Tat Tvam Asi', m: 'Thou art That — you are the infinite Brahman.', src: 'Chandogya Upanishad 6.8.7', t: 'Mahāvākya' },
    { s: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन', i: 'Karmanye vadhikaraste ma phaleshu kadachana', m: 'You have a right to perform your duty, but never to the fruits of action.', src: 'Bhagavad Gita 2.47', t: 'Karma Yoga' },
    { s: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत', i: 'Yada yada hi dharmasya glanir bhavati bharata', m: 'Whenever Dharma declines, I manifest Myself.', src: 'Bhagavad Gita 4.7', t: 'Avatara' },
    { s: 'धर्मो रक्षति रक्षितः', i: 'Dharmo rakshati rakshitah', m: 'Dharma protects those who protect Dharma.', src: 'Manusmriti 8.15', t: 'Dharma' },
    { s: 'असतो मा सद्गमय', i: 'Asato ma sadgamaya', m: 'Lead me from the unreal to the Real, from darkness to Light.', src: 'Brihadaranyaka Upanishad 1.3.28', t: 'Prayer' },
    { s: 'सर्वे भवन्तु सुखिनः', i: 'Sarve bhavantu sukhinah', m: 'May all beings be happy. May all be free from illness.', src: 'Brihadaranyaka Upanishad', t: 'Universal Prayer' },
    { s: 'न जायते म्रियते वा कदाचित्', i: 'Na jayate mriyate va kadachit', m: 'The soul is never born, nor does it ever die at any time.', src: 'Bhagavad Gita 2.20', t: 'Ātman' },
    { s: 'योगः कर्मसु कौशलम्', i: 'Yogah karmasu kaushalam', m: 'Yoga is skill in action — excellence and mindfulness in everything you do.', src: 'Bhagavad Gita 2.50', t: 'Yoga' },
    { s: 'सत्यमेव जयते', i: 'Satyameva Jayate', m: 'Truth alone triumphs — not falsehood.', src: 'Mundaka Upanishad 3.1.6', t: 'Satya' },
    { s: 'वसुधैव कुटुम्बकम्', i: 'Vasudhaiva Kutumbakam', m: 'The entire world is one family.', src: 'Maha Upanishad 6.72', t: 'Universal Brotherhood' },
    { s: 'अहिंसा परमो धर्मः', i: 'Ahimsa Paramo Dharmah', m: 'Non-violence is the highest Dharma.', src: 'Mahabharata, Adi Parva 11.13', t: 'Ahimsa' },
    { s: 'यतो धर्मस्ततो जयः', i: 'Yato Dharmastato Jayah', m: 'Where there is Dharma, there is victory.', src: 'Mahabharata', t: 'Dharma' },
    { s: 'प्रज्ञानं ब्रह्म', i: 'Prajnanam Brahma', m: 'Pure Consciousness is Brahman.', src: 'Aitareya Upanishad 3.3', t: 'Mahāvākya' },
    { s: 'तमेव भान्तमनुभाति सर्वम्', i: 'Tameva bhantam anubhati sarvam', m: 'Everything shines after that Light — the sun, moon, stars and lightning.', src: 'Mundaka Upanishad 2.2.10', t: 'Brahman' },
    { s: 'ॐ तत्सत्', i: 'Om Tat Sat', m: 'Om — That is Truth. The three-fold designation of the Absolute.', src: 'Bhagavad Gita 17.23', t: 'Brahman' },
    { s: 'मनसैव जगत्सर्वं', i: 'Manasaiva jagat sarvam', m: 'With the mind alone the entire world is both destroyed and won.', src: 'Amritabindu Upanishad', t: 'Mind' },
    { s: 'ॐ शान्तिः शान्तिः शान्तिः', i: 'Om Shantih Shantih Shantih', m: 'Om — Peace in body, peace in mind, peace in spirit.', src: 'Vedic Shanti Mantra', t: 'Peace' },
    { s: 'ऋतं च सत्यं चाभीद्धात्', i: 'Rtam cha satyam chabhiddhat', m: 'From cosmic contemplation were born Cosmic Order and Truth.', src: 'Rig Veda 10.190.1', t: 'Cosmic Order' }
  ];

  function getDayIndex() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const day = Math.floor((now - start) / 86400000);
    return day % SHLOKAS.length;
  }

  function getTodaysShloka() {
    const todayKey = new Date().toDateString();
    try {
      const cached = localStorage.getItem('sd_daily_v2');
      if (cached) {
        const p = JSON.parse(cached);
        if (p.date === todayKey) return p.shloka;
      }
    } catch(e) {}
    const shloka = SHLOKAS[getDayIndex()];
    try { localStorage.setItem('sd_daily_v2', JSON.stringify({ date: todayKey, shloka })); } catch(e) {}
    return shloka;
  }

  window.DailyShloka = {
    get: getTodaysShloka,
    getAll: () => SHLOKAS,
    getRandom: () => SHLOKAS[Math.floor(Math.random() * SHLOKAS.length)],
    render(containerId, mode) {
      const el = document.getElementById(containerId);
      if (!el) return;
      const v = getTodaysShloka();
      if (mode === 'compact') {
        el.innerHTML = `<div class="dsc-wrap"><span class="dsc-tag">✨ ${v.t}</span><span class="dsc-s">${v.s}</span><span class="dsc-m">"${v.m}"</span><span class="dsc-src">— ${v.src}</span></div>`;
      } else {
        el.innerHTML = `<div class="dsb-wrap"><div class="dsb-tag">✨ Verse of the Day · ${v.t}</div><div class="dsb-sanskrit">${v.s}</div><div class="dsb-iast">${v.i}</div><div class="dsb-meaning">"${v.m}"</div><div class="dsb-src">— ${v.src}</div><a href="verses-library" class="dsb-cta">Explore 23,800+ Verses →</a></div>`;
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.beginner-hero');
    if (!hero) return;
    const v = getTodaysShloka();
    const bar = document.createElement('div');
    bar.id = 'daily-shloka-bar';
    bar.innerHTML = `
      <div class="dsb-inner">
        <div class="dsb-pill">✨ Today's Verse · <em>${v.t}</em></div>
        <div class="dsb-inline-s">${v.s}</div>
        <div class="dsb-inline-m">"${v.m}"</div>
        <div class="dsb-inline-src">— ${v.src} &nbsp;·&nbsp; <a href="verses-library">See all 23,800+ verses →</a></div>
      </div>
    `;
    hero.insertAdjacentElement('afterend', bar);
  });
})();
