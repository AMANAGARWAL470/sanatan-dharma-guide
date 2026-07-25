import os
import json
import re
from pypdf import PdfReader

LEADS_DIR = r"d:\Sanatan Dharam project\Leads"
OUTPUT_JSON = r"d:\Sanatan Dharam project\scratch\extracted_summary.json"

results = {}

print("Starting extraction of book metadata and content...")

files = os.listdir(LEADS_DIR)
for filename in files:
    filepath = os.path.join(LEADS_DIR, filename)
    print(f"Processing: {filename}...")
    
    if filename.endswith(".pdf"):
        try:
            reader = PdfReader(filepath)
            num_pages = len(reader.pages)
            
            # Sample first 5 pages and last 5 pages and 10 middle pages for outline
            sample_pages = list(range(min(5, num_pages)))
            middle = num_pages // 2
            sample_pages.extend(list(range(max(0, middle - 5), min(num_pages, middle + 5))))
            sample_pages = sorted(list(set(sample_pages)))
            
            extracted_sample = ""
            for p_num in sample_pages:
                try:
                    text = reader.pages[p_num].extract_text()
                    if text:
                        extracted_sample += f"\n--- Page {p_num + 1} ---\n" + text[:1500]
                except Exception as e:
                    pass
            
            results[filename] = {
                "type": "pdf",
                "pages": num_pages,
                "size_mb": round(os.path.getsize(filepath) / (1024 * 1024), 2),
                "sample_text": extracted_sample[:10000]
            }
        except Exception as e:
            results[filename] = {"type": "pdf", "error": str(e)}
            
    elif filename.endswith(".htm") or filename.endswith(".html"):
        try:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            results[filename] = {
                "type": "html",
                "size_mb": round(os.path.getsize(filepath) / (1024 * 1024), 2),
                "sample_text": content[:10000]
            }
        except Exception as e:
            results[filename] = {"type": "html", "error": str(e)}

os.makedirs(r"d:\Sanatan Dharam project\scratch", exist_ok=True)
with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Extraction complete! Saved metadata for {len(results)} books to {OUTPUT_JSON}")
