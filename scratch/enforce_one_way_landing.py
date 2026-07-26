"""
Enforce One-Way Landing Entry Rule:
Once inside the website (curriculum hub & all module pages):
1. Remove any '✨ Intro' or landing page links from the header bar.
2. Make brand-title logo links point to 'curriculum' (Curriculum Hub), NOT landing/index!
3. All 'Home' and 'Curriculum Hub' links point to 'curriculum'.
4. The ONLY way to see the landing intro is if the user directly opens the initial root URL from scratch.
"""
import os, re

ROOT = r"d:\Sanatan Dharam project"

HTML_FILES = []
for dirpath, dirs, files in os.walk(ROOT):
    if any(s in dirpath for s in ['scratch', 'pages', '.git', 'node_modules', 'Leads']):
        continue
    for f in files:
        if f.endswith('.html') and f not in ['index.html', 'landing.html']:
            HTML_FILES.append(os.path.join(dirpath, f))

print(f"Enforcing One-Way Landing Entry across {len(HTML_FILES)} site pages...")

for fpath in HTML_FILES:
    fname = os.path.basename(fpath)
    depth = fpath.replace(ROOT, '').count(os.sep) - 1
    
    # Calculate relative path to curriculum.html
    if depth == 0:
        curr_link = 'curriculum'
    elif depth == 1:
        curr_link = '../../curriculum'
    elif depth == 2:
        curr_link = '../../../curriculum'
    else:
        curr_link = 'curriculum'
        
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
        
    new_c = content
    
    # 1. Remove ✨ Intro nav links entirely from inside pages
    new_c = re.sub(r'<li><a href="[^"]*"[^>]*>✨ Intro</a></li>\s*', '', new_c)
    
    # 2. Update brand-title link to point to curriculum hub instead of index/landing
    new_c = re.sub(
        r'<a href="[^"]*" class="brand-title">',
        f'<a href="{curr_link}" class="brand-title">',
        new_c
    )
    
    # 3. In breadcrumbs or home links, ensure they point to curriculum hub
    new_c = re.sub(
        r'<li><a href="[^"]*index"([^>]*)>🏠 (?:Home|Hub)</a></li>',
        f'<li><a href="{curr_link}"\\1>🏠 Curriculum Hub</a></li>',
        new_c
    )
    
    if new_c != content:
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_c)
        print(f"  [UPDATED] {os.path.relpath(fpath, ROOT)}")

print("\nDone! All internal site links now stay strictly within curriculum hub & lessons.")
