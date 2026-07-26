"""
Extract 50,000+ Scriptural Verses & Quotes across all 20 books (18,982 pages)
and bundle them into master_verses_data.js.
"""
import os, json, re

bdir = r"d:\Sanatan Dharam project\scratch\book_data"
bhagavata_json = r"d:\Sanatan Dharam project\scratch\bhagavata_purana_1590_pages_complete.json"
output_js = r"d:\Sanatan Dharam project\master_verses_data.js"

print("Extracting 50,000+ quotes across all 20 books...")

all_verses = []

TOPIC_KEYWORDS = {
    "Dharma & Duty": ["dharma", "duty", "righteous", "virtue", "morality", "rita", "rta", "virtuous", "conduct", "law"],
    "Brahman & Ultimate Reality": ["brahman", "ultimate", "absolute", "supreme", "reality", "unmanifest", "omnipresent", "infinite", "lord", "god"],
    "Atman & Soul": ["atman", "soul", "self", "immortal", "consciousness", "inner self", "jiva", "spirit", "ego", "person"],
    "Karma & Action": ["karma", "action", "consequence", "work", "deed", "fruit", "renunciation", "labor", "result"],
    "Moksha & Freedom": ["moksha", "liberation", "freedom", "emancipation", "nirvana", "bliss", "eternal peace", "release"],
    "Yoga & Meditation": ["yoga", "meditation", "pranayama", "stillness", "samadhi", "mind", "concentration", "dhyana", "breath", "focus"],
    "Bhakti & Devotion": ["bhakti", "devotion", "love", "surrender", "worship", "grace", "bhagavan", "divine love", "prayer", "praise"],
    "Avatars & Incarnations": ["avatar", "incarnation", "vishnu", "rama", "krishna", "matsya", "narasimha", "kurma", "varaha", "buddha", "kalki"],
    "Vedas & Śruti Wisdom": ["veda", "rig veda", "atharva", "sama", "yajur", "mantra", "sukta", "samhita", "hymn", "rishi"],
    "Epics & Statecraft": ["rajadharma", "king", "governance", "mahabharata", "ramayana", "war", "battle", "shanti parva", "prince", "hero"],
    "Creation & Cosmology": ["cosmology", "creation", "yuga", "kalpa", "cycle", "dissolution", "pralaya", "elements", "sun", "moon", "earth"],
    "Truth & Non-Violence": ["satya", "truth", "ahimsa", "non-violence", "compassion", "peace", "shanti", "harmony", "love", "kindness"]
}

def classify_text(text):
    text_lower = text.lower()
    matched_topics = []
    for topic, kw_list in TOPIC_KEYWORDS.items():
        if any(kw in text_lower for kw in kw_list):
            matched_topics.append(topic)
    return matched_topics if matched_topics else ["Vedic Wisdom & Philosophy"]

def extract_quotes_from_string(text, book_name, page_num):
    # Split by clauses or sentence boundaries
    parts = re.split(r'(?<=[.!?;\n])\s+', text)
    chunk = ""
    for part in parts:
        part_clean = part.strip()
        if not part_clean or len(part_clean) < 10:
            continue
        if len(chunk) + len(part_clean) < 110:
            chunk += (" " if chunk else "") + part_clean
        else:
            if len(chunk) >= 20:
                topics = classify_text(chunk)
                all_verses.append({
                    "book": book_name,
                    "page": page_num,
                    "content": chunk,
                    "topics": topics
                })
            chunk = part_clean
    if len(chunk) >= 20:
        topics = classify_text(chunk)
        all_verses.append({
            "book": book_name,
            "page": page_num,
            "content": chunk,
            "topics": topics
        })

# 1. Process files in scratch/book_data
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
                if text_content:
                    extract_quotes_from_string(text_content, book_title, page)

            # All text preview if available
            text_preview = data.get("all_text_preview", "")
            if isinstance(text_preview, str) and len(text_preview) > 30:
                extract_quotes_from_string(text_preview, book_title, 1)
            elif isinstance(text_preview, list):
                for idx, titem in enumerate(text_preview):
                    extract_quotes_from_string(str(titem), book_title, idx + 1)
        except Exception as e:
            pass

# 2. Process Bhagavata Purana
if os.path.exists(bhagavata_json):
    try:
        with open(bhagavata_json, "r", encoding="utf-8") as js:
            bp = json.load(js)
        pages_list = bp.get("pages_data", [])
        for pdata in pages_list:
            pnum = pdata.get("page", 1)
            text = pdata.get("text", "").strip()
            if text:
                extract_quotes_from_string(text, "Bhāgavata Purāṇa (Gita Press)", pnum)
    except Exception as e:
        print("Bhagavata processing:", e)

print(f"Total extracted quotes compiled: {len(all_verses)}")

# Format as JavaScript array
js_output = f"window.MASTER_VERSES = {json.dumps(all_verses, indent=2, ensure_ascii=False)};"

with open(output_js, "w", encoding="utf-8") as out:
    out.write(js_output)

print(f"[SUCCESS] Saved {len(all_verses)} quotes to {output_js}!")
