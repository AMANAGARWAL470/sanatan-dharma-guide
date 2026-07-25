import os
import json
import re
import sys
import io

# Force UTF-8 output to avoid Windows cp1252 encoding errors
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

try:
    from pypdf import PdfReader
except ImportError:
    os.system(f"{sys.executable} -m pip install pypdf")
    from pypdf import PdfReader

LEADS_DIR = r"d:\Sanatan Dharam project\Leads"
OUTPUT_DIR = r"d:\Sanatan Dharam project\scratch\book_data"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Key terms to flag for extraction
KEY_TERMS = [
    "dharma", "karma", "atman", "brahman", "moksha", "samsara",
    "yoga", "ahimsa", "satya", "tapas", "veda", "upanishad",
    "shiva", "vishnu", "brahma", "devi", "shakti", "ganesha", "krishna", "ram",
    "om", "aum", "mantra", "samskar", "yajna", "puja", "bhakti",
    "jnana", "raja", "karma yoga", "gita", "purana", "samkhya",
    "varna", "ashrama", "grihastha", "brahmachari", "sannyasa",
    "rta", "satya", "ekam sat", "tat tvam asi", "aham brahmasmi",
    "sanatana", "nitya", "prana", "chakra", "kundalini",
    "vedanta", "advaita", "dvaita", "nirvana", "liberation",
    "creation", "destruction", "preservation", "trimurti",
    "swastika", "lotus", "trishula", "sacred", "symbol",
    "samskara", "birth", "marriage", "death", "ritual", "rite",
    "caste", "myth", "misconception", "woman", "gender",
    "scripture", "shruti", "smriti", "agama", "tantra"
]

def is_key_passage(text):
    text_lower = text.lower()
    return any(term in text_lower for term in KEY_TERMS)

def clean_text(text):
    if not text:
        return ""
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Remove page artifacts
    text = re.sub(r'-\s*\n\s*', '', text)
    return text

def extract_pdf_deep(filepath, filename):
    print(f"\n{'='*60}")
    print(f"Extracting: {filename}")
    print(f"{'='*60}")
    
    result = {
        "filename": filename,
        "filepath": filepath,
        "pages": 0,
        "size_mb": round(os.path.getsize(filepath) / (1024*1024), 2),
        "chapters": [],
        "key_passages": [],
        "all_text_preview": {},
        "total_chars_extracted": 0
    }
    
    try:
        reader = PdfReader(filepath)
        total_pages = len(reader.pages)
        result["pages"] = total_pages
        print(f"  Total pages: {total_pages}")
        
        current_chapter = None
        chapter_text = []
        
        # Extract EVERY page
        for page_num in range(total_pages):
            try:
                page = reader.pages[page_num]
                text = page.extract_text()
                if not text or len(text.strip()) < 20:
                    continue
                
                text = clean_text(text)
                
                # Store sample every 50 pages for preview
                if page_num % 50 == 0:
                    result["all_text_preview"][f"page_{page_num+1}"] = text[:500]
                
                # Detect chapter headings (all caps lines, or lines starting with Chapter/Book/Hymn/Verse)
                lines = text.split('.')
                first_line = text[:100]
                
                chapter_patterns = [
                    r'^Chapter\s+\d+', r'^CHAPTER\s+\d+',
                    r'^Book\s+\d+', r'^BOOK\s+\d+',
                    r'^Hymn\s+\d+', r'^HYMN\s+\d+',
                    r'^Section\s+\d+', r'^Part\s+\d+',
                    r'^Adhyaya\s+\d+', r'^Sarga\s+\d+',
                    r'^Canto\s+\d+', r'^Skandha\s+\d+',
                    r'^Mandala\s+\d+', r'^Sukta\s+\d+',
                    r'^Kanda\s+\d+'
                ]
                
                is_chapter_start = any(re.match(p, first_line.strip(), re.IGNORECASE) for p in chapter_patterns)
                
                if is_chapter_start and current_chapter:
                    # Save previous chapter
                    chap_text = ' '.join(chapter_text)
                    result["chapters"].append({
                        "title": current_chapter,
                        "text_preview": chap_text[:2000],
                        "char_count": len(chap_text)
                    })
                    chapter_text = []
                
                if is_chapter_start:
                    current_chapter = first_line.strip()[:100]
                
                chapter_text.append(text)
                result["total_chars_extracted"] += len(text)
                
                # Extract key passages
                if is_key_passage(text):
                    # Find the most relevant sentences
                    sentences = re.split(r'[.!?]+', text)
                    key_sentences = []
                    for sent in sentences:
                        if len(sent.strip()) > 30 and is_key_passage(sent):
                            key_sentences.append(sent.strip())
                    
                    if key_sentences:
                        passage = '. '.join(key_sentences[:3])
                        if len(passage) > 50:
                            result["key_passages"].append({
                                "page": page_num + 1,
                                "text": passage[:800],
                                "topics": [t for t in KEY_TERMS if t in text.lower()][:5]
                            })
                
                # Progress indicator every 100 pages
                if (page_num + 1) % 100 == 0:
                    print(f"  Processed {page_num+1}/{total_pages} pages... ({len(result['key_passages'])} key passages found)")
                    
            except Exception as e:
                pass
        
        # Save last chapter
        if current_chapter and chapter_text:
            chap_text = ' '.join(chapter_text)
            result["chapters"].append({
                "title": current_chapter,
                "text_preview": chap_text[:2000],
                "char_count": len(chap_text)
            })
        
        print(f"  [OK] Done! {len(result['key_passages'])} key passages, {len(result['chapters'])} chapters, {result['total_chars_extracted']:,} total chars")
        
    except Exception as e:
        result["error"] = str(e)
        print(f"  [ERR] Error: {e}")
    
    return result

def extract_html(filepath, filename):
    print(f"\nExtracting HTML: {filename}")
    result = {
        "filename": filename,
        "filepath": filepath,
        "size_mb": round(os.path.getsize(filepath) / (1024*1024), 2),
        "key_passages": [],
        "total_chars_extracted": 0
    }
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        
        # Strip HTML tags
        clean = re.sub(r'<[^>]+>', ' ', content)
        clean = re.sub(r'\s+', ' ', clean).strip()
        result["total_chars_extracted"] = len(clean)
        
        # Extract key passages by splitting into chunks
        chunk_size = 1000
        for i in range(0, min(len(clean), 500000), chunk_size):
            chunk = clean[i:i+chunk_size]
            if is_key_passage(chunk):
                sentences = re.split(r'[.!?]+', chunk)
                key_sents = [s.strip() for s in sentences if len(s.strip()) > 30 and is_key_passage(s)]
                if key_sents:
                    result["key_passages"].append({
                        "offset": i,
                        "text": '. '.join(key_sents[:3])[:600],
                        "topics": [t for t in KEY_TERMS if t in chunk.lower()][:5]
                    })
        
        print(f"  [OK] Done! {len(result['key_passages'])} key passages")
    except Exception as e:
        result["error"] = str(e)
        print(f"  [ERR] Error: {e}")
    return result

# Master index for the library page
master_index = {
    "total_books": 0,
    "books": []
}

files = sorted(os.listdir(LEADS_DIR))
print(f"Found {len(files)} files in Leads directory.")
print("Starting DEEP extraction of all books...\n")

for filename in files:
    filepath = os.path.join(LEADS_DIR, filename)
    
    if filename.endswith(".pdf"):
        data = extract_pdf_deep(filepath, filename)
    elif filename.endswith(".htm") or filename.endswith(".html"):
        data = extract_html(filepath, filename)
    else:
        continue
    
    # Save individual book JSON
    safe_name = re.sub(r'[^\w\-]', '_', filename.replace('.pdf', '').replace('.htm', '').replace('.html', ''))
    out_path = os.path.join(OUTPUT_DIR, f"{safe_name}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  Saved: {out_path}")
    
    # Add to master index
    master_index["books"].append({
        "filename": filename,
        "json_file": f"{safe_name}.json",
        "pages": data.get("pages", 0),
        "size_mb": data.get("size_mb", 0),
        "key_passages_count": len(data.get("key_passages", [])),
        "chapters_count": len(data.get("chapters", [])),
        "total_chars": data.get("total_chars_extracted", 0)
    })
    master_index["total_books"] += 1

# Save master index
master_path = os.path.join(OUTPUT_DIR, "master_index.json")
with open(master_path, "w", encoding="utf-8") as f:
    json.dump(master_index, f, ensure_ascii=False, indent=2)

print(f"\n{'='*60}")
print(f"EXTRACTION COMPLETE!")
print(f"Total books processed: {master_index['total_books']}")
total_passages = sum(b['key_passages_count'] for b in master_index['books'])
print(f"Total key passages extracted: {total_passages:,}")
print(f"Master index saved to: {master_path}")
print(f"Individual book JSONs saved to: {OUTPUT_DIR}")
