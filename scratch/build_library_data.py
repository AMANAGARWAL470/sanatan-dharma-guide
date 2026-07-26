"""
Build library_data.js:
Bundles key_passages, summaries, page counts, and text excerpts for all 20 books into a lightweight JS file (scratch/library_data.js) so library.html can render an instant In-Browser Book Reader Modal without needing PDF downloads or getting 404 errors!
"""
import os, json

bdir = r"d:\Sanatan Dharam project\scratch\book_data"
output_js = r"d:\Sanatan Dharam project\library_data.js"

library_db = {}

for f in os.listdir(bdir):
    if f.endswith(".json") and f not in ["master_index.json", "user_index.json"]:
        fp = os.path.join(bdir, f)
        with open(fp, "r", encoding="utf-8") as js:
            data = json.load(js)
            
        fname = data.get("filename", f)
        key_passages = data.get("key_passages", [])
        
        raw_prev = data.get("all_text_preview", "")
        if isinstance(raw_prev, str):
            text_preview = raw_prev[:2500]
        elif isinstance(raw_prev, list):
            text_preview = "\n".join([str(x) for x in raw_prev[:10]])
        else:
            text_preview = str(raw_prev)[:2500]
            
        pages = data.get("pages", 0)
        
        library_db[fname] = {
            "title": fname.replace(".pdf", "").replace("_", " ").replace("-", " "),
            "pages": pages,
            "passages": key_passages[:12], # Top 12 key passages with shlokas & page numbers
            "excerpt": text_preview
        }

# Write to JS file
js_content = f"window.LIBRARY_DB = {json.dumps(library_db, indent=2, ensure_ascii=False)};"

with open(output_js, "w", encoding="utf-8") as out:
    out.write(js_content)

print(f"[OK] Generated library_data.js with {len(library_db)} book entries!")
