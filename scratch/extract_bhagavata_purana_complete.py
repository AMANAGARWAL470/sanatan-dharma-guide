import os
import json
import re
import fitz  # PyMuPDF

PDF_PATH = r"d:\Sanatan Dharam project\Leads\Bhagavata Purana - Gita Press_text.pdf"
OUTPUT_JSON = r"d:\Sanatan Dharam project\scratch\bhagavata_purana_1590_pages_complete.json"

def extract_bhagavata_complete():
    print(f"==================================================")
    print(f"Extracting FULL 1,590 Pages of Bhagavata Purana (Gita Press)")
    print(f"==================================================")
    
    doc = fitz.open(PDF_PATH)
    total_pages = len(doc)
    print(f"Total Pages in PDF: {total_pages}")
    
    extraction = {
        "title": "Bhāgavata Purāṇa (Srimad Bhagavatam) — Gita Press Text",
        "total_pages": total_pages,
        "total_words": 0,
        "total_chars": 0,
        "total_shlokas_detected": 0,
        "cantos_detected": [],
        "pages": []
    }
    
    current_canto = "Canto 1 (Skandha 1)"
    
    for page_idx in range(total_pages):
        page = doc[page_idx]
        text = page.get_text("text")
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        
        words = re.findall(r'\b[a-zA-Z\u0900-\u097FāīūṛṝḷḹṅñṭḍṇśṣḥṃṁĀĪŪṚṜḶḸṄÑṬḌṆŚṢḤṂṀ]+\b', text)
        
        # Canto & Chapter detection
        canto_match = re.search(r'(Skandha|Canto|Book)\s+(\d+|[IVXLCDM]+)', text, re.I)
        if canto_match:
            canto_title = canto_match.group(0)
            if canto_title not in extraction["cantos_detected"]:
                extraction["cantos_detected"].append(canto_title)
            current_canto = canto_title
            
        # Shloka count on this page
        shlokas_on_page = len(re.findall(r'[\u0900-\u097F]{10,}|\|\||\u0964\u0964', text))
        extraction["total_shlokas_detected"] += shlokas_on_page
        
        page_record = {
            "page_number": page_idx + 1,
            "canto": current_canto,
            "word_count": len(words),
            "char_count": len(text),
            "line_count": len(lines),
            "shloka_count": shlokas_on_page,
            "full_page_text": text
        }
        
        extraction["pages"].append(page_record)
        extraction["total_words"] += len(words)
        extraction["total_chars"] += len(text)
        
        if (page_idx + 1) % 200 == 0 or (page_idx + 1) == total_pages:
            print(f"  Processed page {page_idx + 1}/{total_pages}... ({extraction['total_words']:,} words, {extraction['total_chars']:,} chars extracted)")
            
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(extraction, f, indent=2, ensure_ascii=False)
        
    print("\n==================================================")
    print(f"EXTRACTION COMPLETE FOR BHAGAVATA PURANA!")
    print(f"Total Pages Processed: {total_pages:,}")
    print(f"Total Words Extracted: {extraction['total_words']:,}")
    print(f"Total Characters Extracted: {extraction['total_chars']:,}")
    print(f"Total Shlokas/Verses Detected: {extraction['total_shlokas_detected']:,}")
    print(f"Saved complete page-by-page JSON to: {OUTPUT_JSON}")
    print("==================================================")

if __name__ == "__main__":
    extract_bhagavata_complete()
