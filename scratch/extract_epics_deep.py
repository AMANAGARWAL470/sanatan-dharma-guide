import os
import json
import re
import fitz  # PyMuPDF

RAMAYANA_PDF = r"d:\Sanatan Dharam project\Leads\user index.pdf"
MAHABHARATA_HTM = r"d:\Sanatan Dharam project\Leads\The Mahabharata Set of 10 Volumes.htm"
OUTPUT_DIR = r"d:\Sanatan Dharam project\scratch\epics_extraction"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def extract_ramayana_deep():
    print("==================================================")
    print("Extracting Deep Content from Valmiki Ramayana (1,626 pages)")
    print("==================================================")
    doc = fitz.open(RAMAYANA_PDF)
    total_pages = len(doc)
    
    kandas = {
        "Bala Kanda": [],
        "Ayodhya Kanda": [],
        "Aranya Kanda": [],
        "Kishkindha Kanda": [],
        "Sundara Kanda": [],
        "Yuddha Kanda": [],
        "Uttara Kanda": []
    }
    
    shlokas_extracted = []
    
    for pidx in range(total_pages):
        page = doc[pidx]
        text = page.get_text("text")
        
        # Check shlokas
        shlokas = re.findall(r'([\u0900-\u097F\s\.\,\|॥]{15,}\d+\s*[\|॥])', text)
        for s in shlokas:
            shlokas_extracted.append({
                "page": pidx + 1,
                "text": s.strip()
            })
            
        if pidx % 300 == 0 or pidx == total_pages - 1:
            print(f"  Processed {pidx+1}/{total_pages} pages...")
            
    out_path = os.path.join(OUTPUT_DIR, "ramayana_deep_extraction.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump({
            "total_pages": total_pages,
            "total_shlokas_found": len(shlokas_extracted),
            "shlokas": shlokas_extracted[:200]
        }, f, indent=2, ensure_ascii=False)
        
    print(f"Ramayana Deep Extraction Complete! Found {len(shlokas_extracted)} verses across {total_pages} pages.")

def extract_mahabharata_deep():
    print("\n==================================================")
    print("Extracting Deep Content from Mahabharata (10 Volumes)")
    print("==================================================")
    with open(MAHABHARATA_HTM, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    total_lines = len(lines)
    
    parvas = [
        "Adi Parva", "Sabha Parva", "Vana Parva", "Virata Parva", "Udyoga Parva",
        "Bhisma Parva", "Drona Parva", "Karna Parva", "Salya Parva", "Sauptika Parva",
        "Stri Parva", "Santi Parva", "Anusasana Parva", "Ashvamedhika Parva",
        "Ashramavasika Parva", "Mausala Parva", "Mahaprasthanika Parva", "Svargarohana Parva"
    ]
    
    parva_index = {}
    for line_num, line in enumerate(lines):
        for parva in parvas:
            if parva.lower() in line.lower() and parva not in parva_index:
                parva_index[parva] = line_num + 1
                
    out_path = os.path.join(OUTPUT_DIR, "mahabharata_deep_extraction.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump({
            "total_lines": total_lines,
            "parvas_detected": parva_index
        }, f, indent=2, ensure_ascii=False)
        
    print(f"Mahabharata Deep Extraction Complete! Processed {total_lines:,} lines across 18 Parvas.")

if __name__ == "__main__":
    extract_ramayana_deep()
    extract_mahabharata_deep()
