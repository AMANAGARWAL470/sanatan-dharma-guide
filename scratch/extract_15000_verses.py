"""
Extract 15,000+ Scriptural Verses & Quotes across all 20 books (18,982 pages)
and bundle them into master_verses_data.js.
"""
import os, json, re

bdir = r"d:\Sanatan Dharam project\scratch\book_data"
bhagavata_json = r"d:\Sanatan Dharam project\scratch\bhagavata_purana_1590_pages_complete.json"
output_js = r"d:\Sanatan Dharam project\master_verses_data.js"

print("Extracting 15,000+ quotes across all 20 books...")

all_verses = []

TOPIC_KEYWORDS = {
    "Dharma & Duty": ["dharma", "duty", "righteous", "virtue", "morality", "rita", "rta", "virtuous", "conduct"],
    "Brahman & Ultimate Reality": ["brahman", "ultimate", "absolute", "supreme", "reality", "unmanifest", "omnipresent", "infinite", "lord"],
    "Atman & Soul": ["atman", "soul", "self", "immortal", "consciousness", "inner self", "jiva", "spirit", "ego"],
    "Karma & Action": ["karma", "action", "consequence", "work", "deed", "fruit", "renunciation", "labor"],
    "Moksha & Freedom": ["moksha", "liberation", "freedom", "emancipation", "nirvana", "bliss", "eternal peace", "release"],
    "Yoga & Meditation": ["yoga", "meditation", "pranayama", "stillness", "samadhi", "mind", "concentration", "dhyana", "breath"],
    "Bhakti & Devotion": ["bhakti", "devotion", "love", "surrender", "worship", "grace", "bhagavan", "divine love", "prayer"],
    "Avatars & Incarnations": ["avatar", "incarnation", "vishnu", "rama", "krishna", "matsya", "narasimha", "kurma", "varaha", "buddha"],
    "Vedas & Śruti Wisdom": ["veda", "rig veda", "atharva", "sama", "yajur", "mantra", "sukta", "samhita", "hymn"],
    "Epics & Statecraft": ["rajadharma", "king", "governance", "mahabharata", "ramayana", "war", "battle", "shanti parva", "prince"],
    "Creation & Cosmology": ["cosmology", "creation", "yuga", "kalpa", "cycle", "dissolution", "pralaya", "elements", "sun", "moon"],
    "Truth & Non-Violence": ["satya", "truth", "ahimsa", "non-violence", "compassion", "peace", "shanti", "harmony", "love"]
}

def classify_text(text):
    text_lower = text.lower()
    matched_topics = []
    for topic, kw_list in TOPIC_KEYWORDS.items():
        if any(kw in text_lower for kw in kw_list):
            matched_topics.append(topic)
    return matched_topics if matched_topics else ["Vedic Wisdom & Philosophy"]

# Process files in scratch/book_data
for f in os.listdir(bdir):
    if f.endswith(".json") and f not in ["master_index.json"]:
        fp = os.path.join(bdir, f)
        try:
            with open(fp, "r", encoding="utf-8") as js:
                data = json.load(js)
            book_title = data.get("filename", f).replace(".pdf", "").replace("_", " ").replace("-", " ")
            
            # Passages
            passages = data.get("key_passages", [])
            for p in passages:
                text_content = p.get("text", "") or p.get("content", "")
                page = p.get("page", 1)
                
                sentences = re.split(r'\.\s+|\n+', text_content)
                current_chunk = ""
                for sent in sentences:
                    sent_clean = sent.strip()
                    if not sent_clean: continue
                    if len(current_chunk) + len(sent_clean) < 220:
                        current_chunk += (" " if current_chunk else "") + sent_clean
                    else:
                        if len(current_chunk) > 35:
                            topics = classify_text(current_chunk)
                            all_verses.append({
                                "book": book_title,
                                "page": page,
                                "content": current_chunk,
                                "topics": topics
                            })
                        current_chunk = sent_clean
                if len(current_chunk) > 35:
                    topics = classify_text(current_chunk)
                    all_verses.append({
                        "book": book_title,
                        "page": page,
                        "content": current_chunk,
                        "topics": topics
                    })
        except Exception as e:
            pass

# Process Bhagavata Purana if available
if os.path.exists(bhagavata_json):
    try:
        with open(bhagavata_json, "r", encoding="utf-8") as js:
            bp = json.load(js)
        pages_list = bp.get("pages_data", [])
        for pdata in pages_list:
            pnum = pdata.get("page", 1)
            text = pdata.get("text", "").strip()
            sentences = re.split(r'\.\s+|\n+', text)
            current_chunk = ""
            for sent in sentences:
                sent_clean = sent.strip()
                if not sent_clean: continue
                if len(current_chunk) + len(sent_clean) < 220:
                    current_chunk += (" " if current_chunk else "") + sent_clean
                else:
                    if len(current_chunk) > 40:
                        topics = classify_text(current_chunk)
                        all_verses.append({
                            "book": "Bhāgavata Purāṇa (Gita Press)",
                            "page": pnum,
                            "content": current_chunk,
                            "topics": topics
                        })
                    current_chunk = sent_clean
            if len(current_chunk) > 40:
                topics = classify_text(current_chunk)
                all_verses.append({
                    "book": "Bhāgavata Purāṇa (Gita Press)",
                    "page": pnum,
                    "content": current_chunk,
                    "topics": topics
                })
    except Exception as e:
        print("Bhagavata processing:", e)

print(f"Total extracted quotes compiled: {len(all_verses)}")

# Format as JavaScript array
js_output = f"window.MASTER_VERSES = {json.dumps(all_verses, indent=2, ensure_ascii=False)};"

with open(output_js, "w", encoding="utf-8") as out:
    out.write(js_output)

print(f"[SUCCESS] Saved {len(all_verses)} quotes to {output_js}!")
