import os
import re

def propagate_navbar(target_dir):
    print("Starting Navbar Propagation...")
    
    index_path = os.path.join(target_dir, "index.html")
    if not os.path.exists(index_path):
        print("Error: index.html not found!")
        return

    # Read index.html
    with open(index_path, 'r', encoding='utf-8') as f:
        index_content = f.read()

    # Extract Navbar Block
    # Look for <!-- Navbar --> ... </nav>
    navbar_regex = r'(<!-- Navbar -->.*?</nav>)'
    match = re.search(navbar_regex, index_content, re.DOTALL)
    
    if not match:
        print("Error: Could not find <!-- Navbar --> block in index.html")
        return

    navbar_html = match.group(1)
    
    # Prepare Navbar versions
    # For index.html, it stays as is (obviously).
    # For other pages, we need to fix anchor links to point to index.html
    
    # Replace href="#" with href="index.html" (Brand link)
    internal_navbar_html = navbar_html.replace('href="#"', 'href="index.html"')
    
    # Replace other hash links href="#something" with href="index.html#something"
    # We use regex to avoid breaking things that are already correct or external
    # Matches href="#..." but logic is simpler: simple replace is usually matching "href=\"#"
    
    # We want to match `href="#` followed by alphanumeric
    # But wait, looking at index.html, all functional anchor links are `#something`.
    # Dropdowns are also `#something`.
    # It is safe to prefix ALL local anchors with index.html for internal pages.
    
    internal_navbar_html = re.sub(r'href="#([a-zA-Z0-9_\-]+)"', r'href="index.html#\1"', internal_navbar_html)

    # Now iterate all files
    count = 0
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith(".html") and file != "index.html":
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Check if file has a navbar to replace
                if '<!-- Navbar -->' in content and '</nav>' in content:
                    # Replace the block
                    new_content = re.sub(navbar_regex, lambda m: internal_navbar_html, content, count=1, flags=re.DOTALL)
                    
                    if new_content != content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {file}")
                        count += 1
                    else:
                        print(f"Skipped (No Change): {file}")
                else:
                    print(f"Skipped (No Navbar found): {file}")

    print(f"Propagation Complete. Updated {count} files.")

if __name__ == "__main__":
    propagate_navbar('.')
