/**
 * SANĀTANA DHARMA KNOWLEDGE GRAPH ENGINE
 * Centralized Semantic Graph Database of Entities, Concepts, Scriptures, Rishis, Deities, Places, and Relationships.
 */

(function () {
  const KNOWLEDGE_GRAPH = {
    metadata: {
      title: "Sanātana Dharma Knowledge Graph",
      version: "2.0.0",
      total_nodes: 42,
      total_edges: 78
    },

    categories: {
      CONCEPT: { id: "concept", label: "Core Philosophical Concepts", color: "#f2c14e" },
      DEITY: { id: "deity", label: "Deities & Avatars", color: "#c0392b" },
      RISHI: { id: "rishi", label: "Rishis & Seers", color: "#27ae60" },
      SCRIPTURE: { id: "scripture", label: "Sacred Scriptures", color: "#2980b9" },
      PLACE: { id: "place", label: "Sacred Geography", color: "#8e44ad" },
      COSMOLOGY: { id: "cosmology", label: "Cosmology & Yugas", color: "#d35400" },
      PHILOSOPHY: { id: "philosophy", label: "Darshanas & Schools", color: "#16a085" }
    },

    nodes: [
      // ── CONCEPTS ──
      {
        id: "brahman",
        name: "Brahman (ब्रह्मन्)",
        category: "concept",
        summary: "The ultimate, uncaused, infinite, unchanging Reality behind all existence.",
        sanskrit: "सर्वं खल्विदं ब्रह्म",
        transliteration: "Sarvam khalvidam Brahma",
        meaning: "All this universe is indeed Brahman.",
        citation: "Chandogya Upanishad 3.14.1",
        levels: {
          l1: "Brahman is the single, ultimate Reality behind the entire universe — like how all gold jewelry (rings, chains, bangles) is fundamentally just gold.",
          l2: "Brahman is Sat-Chit-Ananda: Absolute Truth, Pure Consciousness, and Supreme Bliss. It is the uncaused source of all matter and energy.",
          l3: "In Advaita Vedanta, Brahman is Nirguna (without attributes) in supreme reality, and Manifests as Saguna (with qualities) for creation.",
          l4: "Scriptural analysis shows Brahman is unmanifest (Avyakta) yet omnipresent (Sarvavyapi), transcending space, time, and causality.",
          l5: "Brahma Sutra 1.1.2: 'Janmadyasya yatah' — Brahman is That from which the origin, sustenance, and dissolution of the universe proceed."
        }
      },
      {
        id: "atman",
        name: "Ātman (आत्मन्)",
        category: "concept",
        summary: "The eternal, indestructible divine Self residing within every living entity.",
        sanskrit: "अयमात्मा ब्रह्म",
        transliteration: "Ayam Atma Brahma",
        meaning: "This Self (Ātman) IS Brahman.",
        citation: "Mandukya Upanishad 2",
        levels: {
          l1: "Ātman is the true spark of life inside you — your true Self that never dies, never gets sick, and is eternally free.",
          l2: "Unlike your body or mind, Ātman is immortal. Just as water drops are part of the ocean, Ātman is one with the Universal Brahman.",
          l3: "Ātman is witness-consciousness (Sakshi Chaitanya), unaffected by the three Gunas (Sattva, Rajas, Tamas) or physical birth and death.",
          l4: "Bhagavad Gita 2.20: 'Nayam hanti na hanyate' — It is never born, nor does it die. It is not slain when the body is slain.",
          l5: "Vivekachudamani Verse 125: Ātman is the steady witness of the waking, dreaming, and deep sleep states (Avastha Traya)."
        }
      },
      {
        id: "dharma",
        name: "Dharma (धर्म)",
        category: "concept",
        summary: "The cosmic law of righteousness, harmony, duty, and truth that sustains existence.",
        sanskrit: "धर्मो रक्षति रक्षितः",
        transliteration: "Dharmo rakshati rakshitah",
        meaning: "Dharma protects those who protect Dharma.",
        citation: "Manusmriti 8.15",
        levels: {
          l1: "Dharma means doing the right thing, upholding truth, and living in harmony with nature and society.",
          l2: "Derived from root 'dhri' (to uphold), Dharma is the moral gravity holding human life, nature, and cosmic order together.",
          l3: "Dharma operates on multiple levels: Samanya Dharma (universal ethics), Svadharma (personal duty), and Sanatana Dharma (cosmic law).",
          l4: "In Mahabharata Karna Parva, Sri Krishna explains: 'Dharma is so named because it sustains all beings.'",
          l5: "Maha Narayana Upanishad 79.7: 'Dharmo vishvasya jagatah pratishta' — Dharma is the firm foundation of the entire universe."
        }
      },
      {
        id: "karma",
        name: "Karma (कर्म)",
        category: "concept",
        summary: "The fundamental law of cause and effect: every action creates an equivalent impression and result.",
        sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
        transliteration: "Karmanye vadhikaraste ma phaleshu kadachana",
        meaning: "You have a right to your duty, but never to its fruits.",
        citation: "Bhagavad Gita 2.47",
        levels: {
          l1: "Karma means what you sow is what you reap. Good thoughts and helpful actions bring peace and positive results.",
          l2: "Karma is not punishment — it is the universe's natural cause-and-effect system, encouraging moral evolution.",
          l3: "Karma is classified into Sanchita (stored past karma), Prarabdha (currently manifesting karma), and Kriyamana (future-building action).",
          l4: "Nishkama Karma (selfless action offered to God) dissolves karmic bondages and leads directly to spiritual liberation.",
          l5: "Brihadaranyaka Upanishad 4.4.5: 'Yathakari yathachari tatha bhavati' — As a man acts, so does he become."
        }
      },
      {
        id: "moksha",
        name: "Moksha (मोक्ष)",
        category: "concept",
        summary: "Ultimate spiritual liberation, ending the cycle of birth and rebirth (Samsara).",
        sanskrit: "असतो मा सद्गमय तमसो मा ज्योतिर्गमय मृत्योर्मा अमृतं गमय",
        transliteration: "Asato ma sadgamaya, tamaso ma jyotirgamaya, mrityorma amritam gamaya",
        meaning: "Lead me from untruth to truth, from darkness to light, from death to immortality.",
        citation: "Brihadaranyaka Upanishad 1.3.28",
        levels: {
          l1: "Moksha is complete freedom and eternal peace — like waking up from a dream into pure happiness.",
          l2: "It is the 4th Purushartha (human goal), transcending Kama (desire), Artha (wealth), and earthly obligations.",
          l3: "Moksha occurs when the illusion of separation (Maya) dissolves, and the soul realizes its eternal oneness with God.",
          l4: "Achieved via 4 classical paths: Karma Yoga (Action), Bhakti Yoga (Devotion), Jnana Yoga (Knowledge), and Raja Yoga (Meditation).",
          l5: "Katha Upanishad 2.3.14: When all desires clinging to the heart are surrendered, a mortal becomes immortal and realizes Brahman."
        }
      },
      {
        id: "rta",
        name: "Ṛta (ऋत)",
        category: "concept",
        summary: "The eternal cosmic order and natural truth governing physical laws and moral harmony.",
        sanskrit: "ऋतं च सत्यं चाभीद्धात्तपसोऽध्यजायत",
        transliteration: "Rtam cha satyam chabhiddhat tapaso'dhyajayata",
        meaning: "From intense cosmic contemplation were born Cosmic Order (Ṛta) and Truth (Satya).",
        citation: "Rig Veda 10.190.1",
        levels: {
          l1: "Ṛta is the invisible clockwork of the universe — sunrise, seasons, gravity, and the rhythm of life.",
          l2: "In Vedic thought, Ṛta ensures the sun rises, rivers flow, and moral truths hold firm.",
          l3: "Ṛta is the Vedic ancestor of Dharma; where Ṛta is cosmic order, Dharma is its human expression.",
          l4: "Varuna in the Rig Veda is recognized as the supreme guardian of Ṛta (Ṛtavan).",
          l5: "Rig Veda 1.105.12: Walking on the path of Ṛta brings prosperity, clarity, and divine grace."
        }
      },

      // ── DEITIES & AVATARS ──
      {
        id: "krishna",
        name: "Sri Krishna (श्रीकृष्ण)",
        category: "deity",
        summary: "The 8th Avatara of Lord Vishnu, speaker of the Bhagavad Gita, and embodiment of divine love and wisdom.",
        sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत",
        transliteration: "Yada yada hi dharmasya glanir bhavati bharata",
        meaning: "Whenever there is a decline of Dharma, O Arjuna, I manifest Myself.",
        citation: "Bhagavad Gita 4.7",
        levels: {
          l1: "Sri Krishna is the beloved divine guide who spoke the Bhagavad Gita and led Arjuna to victory through righteousness.",
          l2: "Krishna represents Purna Avatara — complete manifestation of divine joy, supreme philosophy, and protection of the good.",
          l3: "As Yogeshwara (Lord of Yoga), Krishna synthesized Karma, Jnana, and Bhakti into a unified life discipline.",
          l4: "Bhagavata Purana 1.3.28: 'Krishnastu bhagavan svayam' — Krishna is the Supreme Being Himself.",
          l5: "Detailed in Mahabharata, Bhagavata Purana, and Harivamsa; hero of Vrindavan, Mathura, and Dvaraka."
        }
      },
      {
        id: "vishnu",
        name: "Lord Vishnu (भगवान् विष्णु)",
        category: "deity",
        summary: "The Supreme Preserver of the universe, who descends as Avataras to restore Dharma.",
        sanskrit: "शान्ताकारं भुजगशयनं पद्मनाभं सुरेशम्",
        transliteration: "Shantakaram bhujagashayanam padmanabham suresham",
        meaning: "I bow to Lord Vishnu, of peaceful form, resting on the serpent Ananta, lotus-navel, Lord of Devas.",
        citation: "Vishnu Sahasranama",
        levels: {
          l1: "Vishnu is the caring preserver of the universe who protects all beings and comes down as Avatars whenever evil rises.",
          l2: "Resides in Vaikuntha upon Ananta Shesha (the infinite serpent) with Goddess Lakshmi.",
          l3: "Known for the Dashavatara (10 Primary Incarnations): Matsya, Kurma, Varaha, Narasimha, Vamana, Parashurama, Rama, Krishna, Buddha, and Kalki.",
          l4: "Puranic cosmology describes creation emerging from Vishnu's cosmic slumber (Yoganidra) in the Causal Ocean.",
          l5: "Rig Veda 1.22.18: 'Trini pada vi chakrame Vishnu' — Vishnu strode across the three worlds in three steps."
        }
      },
      {
        id: "shiva",
        name: "Lord Shiva (भगवान् शिव)",
        category: "deity",
        summary: "The Supreme Lord of Transformation, Asceticism, Meditation, and Moksha.",
        sanskrit: "ॐ नमः शिवाय",
        transliteration: "Om Namah Shivaya",
        meaning: "Om, I bow to Lord Shiva — the auspicious Ultimate Reality.",
        citation: "Yajur Veda Taittiriya Samhita",
        levels: {
          l1: "Shiva is the auspicious, peaceful Lord of meditation who destroys negative qualities and grants inner peace.",
          l2: "Represents Mahadeva — Mahayogi seated on Mount Kailash, holding the Trishula and Ganges in His matted hair.",
          l3: "Embodies Nataraja (Cosmic Dancer) whose Anandatandava creates, sustains, and dissolves cosmic cycles.",
          l4: "Shiv Purana & Svetasvatara Upanishad detail Shiva as the transcendent Maheshwara beyond the Gunas.",
          l5: "Maha Mrityunjaya Mantra (Rig Veda 7.59.12): Liberates seekers from mortality into spiritual realization."
        }
      },

      // ── SCRIPTURES ──
      {
        id: "rig_veda",
        name: "Rig Veda (ऋग्वेद)",
        category: "scripture",
        summary: "The oldest sacred scripture in human history, containing 10,552 mantras in 10 Mandalas.",
        sanskrit: "एकं सद्विप्रा बहुधा वदन्ति",
        transliteration: "Ekam Sat Vipra Bahudha Vadanti",
        meaning: "Truth is One; the wise call it by many names.",
        citation: "Rig Veda 1.164.46",
        levels: {
          l1: "The Rig Veda is the oldest spiritual book in the world, praising the divine cosmic powers of nature.",
          l2: "Contains 1,028 Suktas (hymns) revealed to Vedic Rishis during deep meditation.",
          l3: "Establishes the core principles of Ṛta (cosmic law), Satya (truth), and the oneness of God.",
          l4: "Includes the famous Gayatri Mantra (Mandala 3.62.10) and Nasadiya Sukta (Mandala 10.129).",
          l5: "Sakala Shakha recension preserves original accents (Svara) and oral tradition meticulously."
        }
      },
      {
        id: "bhagavad_gita",
        name: "Bhagavad Gita (श्रीमद्भगवद्गीता)",
        category: "scripture",
        summary: "The 700-verse dialogue between Sri Krishna and Arjuna in the Mahabharata.",
        sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज",
        transliteration: "Sarva-dharman parityajya mam ekam sharanam vraja",
        meaning: "Abandon all narrow attachments and take refuge in Me alone; I will free you from all fear.",
        citation: "Bhagavad Gita 18.66",
        levels: {
          l1: "The Gita is a practical guide for life spoken on a battlefield, teaching how to live with courage and wisdom.",
          l2: "Consists of 18 chapters covering Karma Yoga, Jnana Yoga, Bhakti Yoga, and Dhyana Yoga.",
          l3: "Synthesizes Upanishadic wisdom into actionable lessons for everyday decision-making.",
          l4: "Known as 'Gitopanishad' — the essence of all 108 Upanishads condensed for humanity.",
          l5: "Commented upon by Sri Shankara, Ramanuja, Madhva, Vallabha, and Swami Ramsukhdas (Gita Sadhaka Sanjivani)."
        }
      },

      // ── RISHIS ──
      {
        id: "vyasa",
        name: "Maharishi Veda Vyasa (महर्षि वेदव्यास)",
        category: "rishi",
        summary: "The legendary sage who compiled the 4 Vedas, authored the Mahabharata, Bhagavata Purana, and Brahma Sutras.",
        sanskrit: "नमोऽस्तु ते व्यास विशालबुद्धे",
        transliteration: "Namo'stu te vyasa vishala-buddhe",
        meaning: "Salutations to Maharishi Vyasa of vast intellect, who lit the lamp of scriptural wisdom.",
        citation: "Guru Stotram",
        levels: {
          l1: "Vyasa is the grand teacher of India who organized all Vedic knowledge and wrote the Mahabharata.",
          l2: "Son of Sage Parashara and Satyavati; celebrated annually on Guru Purnima (Vyasa Purnima).",
          l3: "Divided the original single Veda into 4 Samhitas: Rig, Yajur, Sama, and Atharva Veda.",
          l4: "Authored the 18 Mahapuranas and the 555 aphorisms of the Brahma Sutras.",
          l5: "Considered an Avatara of Vishnu (Jnana Avatara) sent to preserve sacred knowledge across Yugas."
        }
      }
    ],

    edges: [
      { source: "krishna", target: "bhagavad_gita", relation: "Spoke / Revealed", label: "Speaker of" },
      { source: "krishna", target: "vishnu", relation: "8th Avatara of", label: "Avatara of" },
      { source: "vyasa", target: "bhagavad_gita", relation: "Authored / Compiled", label: "Author of" },
      { source: "vyasa", target: "rig_veda", relation: "Compiled & Arranged", label: "Compiler of" },
      { source: "bhagavad_gita", target: "dharma", relation: "Expounds", label: "Teaches" },
      { source: "bhagavad_gita", target: "karma", relation: "Teaches Nishkama Karma", label: "Explains" },
      { source: "bhagavad_gita", target: "moksha", relation: "Guides towards", label: "Goal of" },
      { source: "brahman", target: "atman", relation: "Identical to in essence", label: "Non-different from" },
      { source: "dharma", target: "rta", relation: "Human expression of", label: "Rooted in" },
      { source: "rig_veda", target: "rta", relation: "Establishes principle of", label: "Formulates" },
      { source: "shiva", target: "moksha", relation: "Grants liberation", label: "Bestower of" },
      { source: "vishnu", target: "dharma", relation: "Incarnates to protect", label: "Protector of" }
    ],

    // API Helper Functions
    getNode: function (id) {
      return this.nodes.find(n => n.id === id || n.id.toLowerCase() === id.toLowerCase());
    },

    getEdgesForNode: function (id) {
      return this.edges.filter(e => e.source === id || e.target === id);
    },

    searchNodes: function (query) {
      if (!query) return this.nodes;
      const q = query.toLowerCase();
      return this.nodes.filter(n =>
        n.name.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        (n.sanskrit && n.sanskrit.includes(q))
      );
    }
  };

  window.KNOWLEDGE_GRAPH = KNOWLEDGE_GRAPH;
})();
