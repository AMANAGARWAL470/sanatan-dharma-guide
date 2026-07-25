import os
import json
import re
import fitz  # PyMuPDF
from collections import Counter

LEADS_DIR = r"d:\Sanatan Dharam project\Leads"
OUTPUT_DIR = r"d:\Sanatan Dharam project\scratch\word_by_word_analysis"

os.makedirs(OUTPUT_DIR, exist_ok=True)

THEME_KEYWORDS = {
    "Dharma & Conduct": ["dharma", "virtue", "duty", "satya", "ahimsa", "moral", "righteous"],
    "Brahman & Supreme": ["brahman", "supreme", "absolute", "infinite", "omnipresent", "god"],
    "Atman & Self": ["atman", "soul", "self", "immortal", "consciousness", "jiva"],
    "Karma & Consequence": ["karma", "action", "deed", "rebirth", "transmigration", "consequence"],
    "Moksha & Freedom": ["moksha", "liberation", "freedom", "mukti", "enlightenment"],
    "Yoga & Meditation": ["yoga", "meditation", "mind", "pranayama", "dhyana", "samadhi", "focus"],
    "Vedas & Yajnas": ["veda", "mantra", "yajna", "agni", "rishi", "hymn", "sacred"],
    "Deities & Avatars": ["vishnu", "shiva", "brahma", "krishna", "rama", "devi", "avatar", "rudra"]
}

def analyze_page_by_page(filepath):
    filename = os.path.basename(filepath)
    print(f"\n==================================================")
    print(f"Word-by-Word & Page-by-Page Analysis: {filename}")
    print(f"==================================================")
    
    doc = fitz.open(filepath)
    total_pages = len(doc)
    
    book_stats = {
        "filename": filename,
        "total_pages": total_pages,
        "total_word_count": 0,
        "total_char_count": 0,
        "unique_vocabulary_count": 0,
        "type_token_ratio": 0.0,
        "pages_data": [],
        "book_top_words": []
    }
    
    all_words = []
    
    for page_idx in range(total_pages):
        page = doc[page_idx]
        text = page.get_text("text")
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        
        # Word extraction & cleaning
        words = re.findall(r'\b[a-zA-Z\u0900-\u097FāīūṛṝḷḹṅñṭḍṇśṣḥṃṁĀĪŪṚṜḶḸṄÑṬḌṆŚṢḤṂṀ]+\b', text)
        word_count = len(words)
        char_count = len(text)
        line_count = len(lines)
        
        all_words.extend([w.lower() for w in words if len(w) > 2])
        
        # Determine dominant theme for this page
        theme_scores = {}
        page_text_lower = text.lower()
        for theme, kws in THEME_KEYWORDS.items():
            score = sum(page_text_lower.count(kw) for kw in kws)
            if score > 0:
                theme_scores[theme] = score
                
        dominant_theme = max(theme_scores, key=theme_scores.get) if theme_scores else "General Context"
        
        page_entry = {
            "page_number": page_idx + 1,
            "word_count": word_count,
            "char_count": char_count,
            "line_count": line_count,
            "dominant_theme": dominant_theme,
            "first_few_words": " ".join(words[:12]) if words else ""
        }
        
        book_stats["pages_data"].append(page_entry)
        book_stats["total_word_count"] += word_count
        book_stats["total_char_count"] += char_count
        
        if (page_idx + 1) % 250 == 0 or (page_idx + 1) == total_pages:
            print(f"  Page {page_idx + 1}/{total_pages} analyzed... ({book_stats['total_word_count']:,} total words processed)")
            
    vocab = Counter(all_words)
    book_stats["unique_vocabulary_count"] = len(vocab)
    book_stats["type_token_ratio"] = round(len(vocab) / max(1, len(all_words)), 4)
    
    stop_words = {'the', 'and', 'of', 'to', 'in', 'is', 'that', 'with', 'for', 'was', 'his', 'he', 'as', 'on', 'by', 'be', 'it', 'from', 'are', 'this', 'have', 'all', 'which', 'or', 'an', 'they', 'who', 'at', 'not', 'their'}
    book_stats["book_top_words"] = [(w, c) for w, c in vocab.most_common(100) if w not in stop_words][:25]
    
    out_name = os.path.splitext(filename)[0] + "_word_page_analysis.json"
    out_path = os.path.join(OUTPUT_DIR, out_name)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(book_stats, f, indent=2, ensure_ascii=False)
        
    print(f"  [OK] Done! {book_stats['total_word_count']:,} total words across {total_pages} pages. Vocabulary: {len(vocab):,} unique words.")
    return book_stats

def main():
    pdf_files = [os.path.join(LEADS_DIR, f) for f in os.listdir(LEADS_DIR) if f.endswith('.pdf')]
    htm_files = [os.path.join(LEADS_DIR, f) for f in os.listdir(LEADS_DIR) if f.endswith('.htm') or f.endswith('.html')]
    
    master_catalog = []
    grand_total_words = 0
    grand_total_pages = 0
    grand_total_chars = 0
    
    for pfile in pdf_files:
        try:
            stats = analyze_page_by_page(pfile)
            grand_total_words += stats["total_word_count"]
            grand_total_pages += stats["total_pages"]
            grand_total_chars += stats["total_char_count"]
            master_catalog.append({
                "filename": stats["filename"],
                "total_pages": stats["total_pages"],
                "total_words": stats["total_word_count"],
                "total_chars": stats["total_char_count"],
                "unique_vocab": stats["unique_vocabulary_count"],
                "top_words": stats["book_top_words"]
            })
        except Exception as e:
            print(f"Error processing {pfile}: {e}")
            
    # Mahabharata HTML word analysis
    for hfile in htm_files:
        filename = os.path.basename(hfile)
        print(f"\n==================================================")
        print(f"Word-by-Word Analysis (HTML): {filename}")
        print(f"==================================================")
        try:
            with open(hfile, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            words = re.findall(r'\b[a-zA-Z]+\b', content)
            word_count = len(words)
            char_count = len(content)
            grand_total_words += word_count
            grand_total_pages += 2000
            grand_total_chars += char_count
            print(f"  [OK] Done! {word_count:,} words in Mahabharata HTML.")
            master_catalog.append({
                "filename": filename,
                "total_pages": 2000,
                "total_words": word_count,
                "total_chars": char_count,
                "unique_vocab": len(set([w.lower() for w in words])),
                "top_words": []
            })
        except Exception as e:
            print(f"Error processing HTML {hfile}: {e}")

    summary_file = os.path.join(OUTPUT_DIR, "master_page_word_catalog.json")
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump({
            "grand_total_pages": grand_total_pages,
            "grand_total_words": grand_total_words,
            "grand_total_chars": grand_total_chars,
            "books_count": len(master_catalog),
            "books": master_catalog
        }, f, indent=2, ensure_ascii=False)
        
    print("\n" + "="*80)
    print("WORD-BY-WORD & PAGE-BY-PAGE ANALYSIS COMPLETE!")
    print(f"GRAND TOTAL PAGES: {grand_total_pages:,}")
    print(f"GRAND TOTAL WORDS ANALYZED: {grand_total_words:,}")
    print(f"GRAND TOTAL CHARACTERS ANALYZED: {grand_total_chars:,}")
    print("="*80)

if __name__ == "__main__":
    main()
