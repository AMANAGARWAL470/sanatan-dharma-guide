"""
Swap index.html and landing.html so index.html IS the Landing Page:
- Copy landing.html -> index.html (with href="curriculum.html")
- Copy old index.html -> curriculum.html
- Update all 19 HTML files so nav links point to curriculum.html for lessons hub
"""
import os, re

ROOT = r"d:\Sanatan Dharam project"

# Read landing.html content and set button target to curriculum.html
with open(os.path.join(ROOT, "landing.html"), "r", encoding="utf-8") as f:
    landing_content = f.read()

# Update begin-btn href in landing content to curriculum.html
landing_content = landing_content.replace('href="index.html"', 'href="curriculum.html"')

# Read current index.html (curriculum hub) content
with open(os.path.join(ROOT, "index.html"), "r", encoding="utf-8") as f:
    curriculum_content = f.read()

# Write landing_content to index.html (so index.html IS the landing page)
with open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8") as f:
    f.write(landing_content)
print("[OK] Set index.html to be the Cinematic Landing Page!")

# Write curriculum_content to curriculum.html
with open(os.path.join(ROOT, "curriculum.html"), "w", encoding="utf-8") as f:
    f.write(curriculum_content)
print("[OK] Created curriculum.html as the Curriculum Hub!")

# Now update all HTML files to fix nav links:
# In curriculum.html & all module pages & library.html:
# Any reference to index.html as "Home/All Lessons" -> curriculum.html
# Any reference to index.html as "Intro" -> index.html (landing page)

HTML_FILES = []
for dirpath, dirs, files in os.walk(ROOT):
    if any(s in dirpath for s in ['scratch', 'pages', '.git', 'node_modules', 'Leads']):
        continue
    for f in files:
        if f.endswith('.html') and f != 'landing.html':
            HTML_FILES.append(os.path.join(dirpath, f))

print(f"\nUpdating links across {len(HTML_FILES)} HTML files...")

for fpath in HTML_FILES:
    fname = os.path.basename(fpath)
    depth = fpath.replace(ROOT, '').count(os.sep) - 1
    prefix = '../../' if depth == 2 else ('../' if depth == 1 else '')
    
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
        
    new_c = content
    
    if fname == 'curriculum.html':
        # Brand link goes to index.html (landing page)
        new_c = new_c.replace('<a href="index.html" class="brand-title">', '<a href="index.html" class="brand-title">')
        # Active nav link is Home -> curriculum.html
        new_c = new_c.replace('<li><a href="landing.html" style="color:var(--gold-bright);">✨ Intro</a></li>', '<li><a href="index.html" style="color:var(--gold-bright);">✨ Intro</a></li>')
        new_c = new_c.replace('<li><a href="index.html" class="active">🏠 Home</a></li>', '<li><a href="curriculum.html" class="active">🏠 Hub</a></li>')
        
    elif depth >= 1: # Module subpages & sub-subpages
        sub_prefix = '../../../' if depth == 3 else '../../'
        # Fix navbar links
        # ← All Lessons -> curriculum.html
        new_c = re.sub(
            r'<a href="[^"]*index\.html">← All Lessons</a>',
            f'<a href="{sub_prefix}curriculum.html">← All Lessons</a>',
            new_c
        )
        new_c = re.sub(
            r'<a href="[^"]*index\.html">Home</a>',
            f'<a href="{sub_prefix}curriculum.html">Home</a>',
            new_c
        )
        new_c = re.sub(
            r'<a href="[^"]*index\.html">← Back to Curriculum Hub</a>',
            f'<a href="{sub_prefix}curriculum.html">← Back to All Lessons</a>',
            new_c
        )
        # Fix lesson-nav at bottom of pages
        new_c = re.sub(
            r'<a href="[^"]*index\.html">🎉 Curriculum Complete — Explore All Lessons →</a>',
            f'<a href="{sub_prefix}curriculum.html">🎉 Curriculum Complete — Explore All Lessons →</a>',
            new_c
        )
        new_c = re.sub(
            r'<a href="[^"]*index\.html">Return to Epics Overview →</a>',
            f'<a href="{sub_prefix}curriculum.html">Return to All Lessons →</a>',
            new_c
        )
        
    if new_c != content:
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_c)
        print(f"  [UPDATED] {os.path.relpath(fpath, ROOT)}")

print("\nDone! index.html is now the landing entry point.")
