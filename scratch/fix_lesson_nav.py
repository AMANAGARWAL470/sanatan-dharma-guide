"""
Fix lesson page navbars:
- Replace nav-links content to have proper labels
- "← Back to All Lessons" for lesson pages going back to index.html
- All module lesson links labeled properly
- Ensure hamburger is present and working
"""
import os, re

ROOT = r"d:\Sanatan Dharam project\modules"

# Map of filepath pattern → correct nav ul html
def get_nav_for_file(filepath, prefix):
    return f'''    <ul class="nav-links">
      <li><a href="{prefix}index.html">\u2190 All Lessons</a></li>
      <li><a href="{prefix}modules/01-foundations/what-is-sanatan-dharma.html">Foundations</a></li>
      <li><a href="{prefix}modules/02-scriptures/vedas.html">Scriptures</a></li>
      <li><a href="{prefix}modules/03-deities-symbols/trimurti-gods.html">Deities</a></li>
      <li><a href="{prefix}modules/04-lifestyle-rites/daily-practices.html">Lifestyle</a></li>
      <li><a href="{prefix}modules/05-myths-faq/myths-busted.html">Myths Busted</a></li>
      <li class="lib-link"><a href="{prefix}library.html">📚 Library</a></li>
    </ul>'''

updated = 0
for dirpath, dirs, files in os.walk(ROOT):
    for fname in files:
        if not fname.endswith('.html'):
            continue
        fpath = os.path.join(dirpath, fname)
        # All module files are 2 levels deep (modules/XX-name/file.html)
        prefix = '../../'
        
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace the entire <ul class="nav-links">...</ul> block
            new_nav = get_nav_for_file(fpath, prefix)
            new = re.sub(
                r'<ul class="nav-links">.*?</ul>',
                new_nav,
                content,
                flags=re.DOTALL
            )
            
            if new != content:
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.write(new)
                print(f"[UPDATED] {fname}")
                updated += 1
            else:
                print(f"[no change] {fname}")
        except Exception as e:
            print(f"[ERROR] {fname}: {e}")

print(f"\nDone: {updated} lesson files updated.")
