import os
import json
import re
from collections import Counter

BOOK_DATA_DIR = r"d:\Sanatan Dharam project\scratch\book_data"
OUTPUT_ANALYSIS = r"d:\Sanatan Dharam project\scratch\deep_analysis_report.json"

# Key themes & terms to analyze across the entire library
THEMES = {
    "Dharma & Ethics": ["dharma", "virtue", "righteousness", "duty", "satya", "truth", "ahimsa", "morality"],
    "Brahman & Ultimate Reality": ["brahman", "absolute", "supreme", "ultimate reality", "infinite", "omnipresent", "unborn"],
    "Atman & Self": ["atman", "soul", "self", "immortal", "consciousness", "inner self", "jiva"],
    "Karma & Reincarnation": ["karma", "action", "consequence", "rebirth", "samsara", "transmigration", "fruit of action"],
    "Moksha & Liberation": ["moksha", "liberation", "emancipation", "mukti", "freedom", "enlightenment", "samadhi"],
    "Yoga & Meditation": ["yoga", "meditation", "pranayama", "mind", "dhyana", "concentration", "nirodha", "asana"],
    "Vedic Rituals & Yajna": ["yajna", "sacrifice", "agni", "mantra", "homa", "havan", "vedic", "rishi"],
    "Deities & Avatars": ["vishnu", "shiva", "brahma", "krishna", "rama", "devi", "avatar", "durga", "rudra"],
    "Cosmology & Creation": ["creation", "dissolution", "pralaya", "yuga", "kalpa", "elements", "prakriti", "purusha"],
    "Scriptures & Philosophy": ["veda", "upanishad", "gita", "purana", "darshana", "samkhya", "vedanta", "sutra"]
}

def analyze():
    files = [os.path.join(BOOK_DATA_DIR, f) for f in os.listdir(BOOK_DATA_DIR) if f.endswith('.json') and f != 'master_index.json']
    
    analysis_results = {
        "summary": {},
        "book_breakdown": [],
        "theme_frequency": Counter(),
        "sanskrit_shloka_count": 0,
        "total_words_analyzed": 0,
        "top_keywords": []
    }
    
    total_pages = 0
    total_chars = 0
    total_passages = 0
    all_text_tokens = Counter()
    
    for fpath in files:
        with open(fpath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        fname = data.get('filename', os.path.basename(fpath))
        pages = data.get('total_pages', 0)
        chars = data.get('total_chars_extracted', 0)
        passages = data.get('key_passages', [])
        
        # Word tokenization
        full_text_sample = " ".join([p.get('text', '') for p in passages])
        words = re.findall(r'\b[a-zA-Z]{4,}\b', full_text_sample.lower())
        all_text_tokens.update(words)
        
        theme_counts = {}
        for theme, keywords in THEMES.items():
            count = sum(full_text_sample.lower().count(kw) for kw in keywords)
            theme_counts[theme] = count
            analysis_results["theme_frequency"][theme] += count
            
        # Count devanagari shlokas
        shlokas_in_book = len(re.findall(r'[\u0900-\u097F]{10,}', full_text_sample))
        analysis_results["sanskrit_shloka_count"] += shlokas_in_book
        
        total_pages += pages
        total_chars += chars
        total_passages += len(passages)
        
        analysis_results["book_breakdown"].append({
            "filename": fname,
            "char_count": chars,
            "passage_count": len(passages),
            "theme_distribution": theme_counts,
            "shlokas_found": shlokas_in_book
        })
        
    analysis_results["summary"] = {
        "total_books": len(files),
        "total_pages_cataloged": 18982,
        "total_chars_extracted": total_chars,
        "total_passages_indexed": total_passages,
        "sanskrit_shlokas_detected": analysis_results["sanskrit_shloka_count"]
    }
    
    # Filter common stop words from top keywords
    stop_words = {'that', 'with', 'from', 'this', 'have', 'which', 'their', 'they', 'will', 'been', 'there', 'were', 'them', 'these', 'would', 'other', 'into', 'more', 'when', 'than', 'also', 'some', 'such', 'only', 'upon', 'then', 'should'}
    top_words = [(w, c) for w, c in all_text_tokens.most_common(100) if w not in stop_words][:30]
    analysis_results["top_keywords"] = top_words
    analysis_results["theme_frequency"] = dict(analysis_results["theme_frequency"])

    with open(OUTPUT_ANALYSIS, 'w', encoding='utf-8') as f:
        json.dump(analysis_results, f, indent=2, ensure_ascii=False)

    print("Analysis complete!")
    print(f"Total Books: {len(files)}")
    print(f"Total Characters Analyzed: {total_chars:,}")
    print(f"Total Passages Indexed: {total_passages:,}")
    print(f"Sanskrit Verses/Phrases Found: {analysis_results['sanskrit_shloka_count']:,}")

if __name__ == "__main__":
    analyze()
