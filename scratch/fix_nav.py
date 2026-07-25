"""
Batch update all HTML files in the Sanatan Dharam project:
1. Replace 'Academy' with 'Guide' everywhere
2. Replace old brand-title div with new clickable brand-link
3. Fix nav: remove the erroneous landing.html Home link
4. Add hamburger button to every page's header
5. Fix nav-links structure with proper lib-link class
"""
import os
import re

ROOT = r"d:\Sanatan Dharam project"

# ── Files to update (all lesson pages + index + library) ──
HTML_FILES = []
for dirpath, dirs, files in os.walk(ROOT):
    # skip scratch, pages (old), node_modules
    skip = ['scratch', 'pages', '.git', 'node_modules', 'Leads']
    if any(s in dirpath for s in skip):
        continue
    for f in files:
        if f.endswith('.html') and f != 'landing.html':
            HTML_FILES.append(os.path.join(dirpath, f))

print(f"Found {len(HTML_FILES)} HTML files to update:")
for f in HTML_FILES:
    print(f"  {f}")

# ── Replacement rules ──────────────────────────────────────
def fix_html(content, filepath):
    changed = False

    # 1. Replace "Academy" with "Guide" in brand/title text
    new = content.replace('Sanātana Dharma <em>Academy</em>', 'Sanātana Dharma <em>Guide</em>')
    new = new.replace('Sanātana Dharma Academy', 'Sanātana Dharma Guide')
    if new != content:
        content = new
        changed = True

    # 2. Replace old non-link brand-title div with an anchor tag
    # Pattern: <div class="brand-title">...<span class="om">ॐ</span><span>Sanātana Dharma <em>Guide</em></span></div>
    # Replace with: <a href="INDEX_PATH" class="brand-title">...same...</a>
    old_brand = r'<div class="brand-title">(.*?)</div>'
    def make_brand_link(m):
        # Determine relative path to index.html
        depth = filepath.replace(ROOT, '').count(os.sep) - 1
        prefix = '../../' if depth >= 2 else ''
        inner = m.group(1)
        # Replace inner span text to be the new brand
        inner = re.sub(r'<span>.*?</span>', '<span>Sanātana Dharma <em>Guide</em><span class="brand-sub">Your Beginner\'s Path</span></span>', inner, count=1)
        return f'<a href="{prefix}index.html" class="brand-title">{inner}</a>'
    new = re.sub(old_brand, make_brand_link, content, flags=re.DOTALL)
    if new != content:
        content = new
        changed = True

    # 3. Add hamburger button after nav-links ul if not already present
    if 'nav-toggle' not in content:
        # Insert hamburger BEFORE </header>
        hamburger = '''    <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
'''
        new = content.replace('  </header>', hamburger + '  </header>', 1)
        if new != content:
            content = new
            changed = True

    # 4. Remove the erroneous ← Home → landing.html link
    # <li><a href="landing.html" class="header-home-link">← Home</a></li>
    new = re.sub(r'\s*<li><a href="[./]*landing\.html"[^>]*>.*?</a></li>', '', content)
    if new != content:
        content = new
        changed = True

    # 5. Wrap library link in <li class="lib-link"> if not already
    # Match: <li><a href="...library.html" style="...">📚 ...
    new = re.sub(
        r'<li>(<a href="[^"]*library\.html"[^>]*>📚[^<]*</a>)</li>',
        r'<li class="lib-link">\1</li>',
        content
    )
    if new != content:
        content = new
        changed = True

    # 6. Fix page title: remove "Academy" 
    new = content.replace('| Sanātana Dharma Academy', '| Sanātana Dharma Guide')
    if new != content:
        content = new
        changed = True

    return content, changed

# ── Run on all files ───────────────────────────────────────
updated = 0
for filepath in HTML_FILES:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content, changed = fix_html(content, filepath)
        if changed:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"  [UPDATED] {os.path.basename(filepath)}")
            updated += 1
        else:
            print(f"  [no change] {os.path.basename(filepath)}")
    except Exception as e:
        print(f"  [ERROR] {filepath}: {e}")

print(f"\nDone. Updated {updated}/{len(HTML_FILES)} files.")
