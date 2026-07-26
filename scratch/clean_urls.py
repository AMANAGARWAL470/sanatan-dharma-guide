"""
Clean URL Converter:
Removes .html extensions from internal href links across all HTML files in the project.
GitHub Pages automatically resolves extensionless URLs (e.g. href="curriculum" -> curriculum.html)
and keeps the URL clean in the browser address bar!
"""
import os, re

ROOT = r"d:\Sanatan Dharam project"

HTML_FILES = []
for dirpath, dirs, files in os.walk(ROOT):
    if any(s in dirpath for s in ['scratch', 'pages', '.git', 'node_modules', 'Leads']):
        continue
    for f in files:
        if f.endswith('.html'):
            HTML_FILES.append(os.path.join(dirpath, f))

print(f"Converting internal links to Clean URLs across {len(HTML_FILES)} HTML files...")

def clean_href(match):
    full_link = match.group(1)
    # Don't touch external links (http, https, //) or anchor links (#)
    if full_link.startswith(('http://', 'https://', '//', '#')):
        return f'href="{full_link}"'
    
    # If link ends with .html, strip .html
    # Handle optional anchors e.g. path/to/page.html#section -> path/to/page#section
    if '.html' in full_link:
        cleaned = re.sub(r'\.html(#.*)?$', r'\1', full_link)
        return f'href="{cleaned}"'
    
    return f'href="{full_link}"'

modified_count = 0
for fpath in HTML_FILES:
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace href="...html..." with clean links
    new_content = re.sub(r'href=["\']([^"\']+)["\']', clean_href, content)
    
    if new_content != content:
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_content)
        modified_count += 1
        print(f"  [CLEANED LINKS] {os.path.relpath(fpath, ROOT)}")

print(f"\nDone! Cleaned links in {modified_count} files.")
