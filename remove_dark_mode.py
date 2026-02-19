import os
import re

def remove_dark_mode():
    # 1. New Navbar Section (removing switch)
    old_nav_item = r'<li class="nav-item d-flex align-items-center mb-3 mb-lg-0">\s*<a href="contact\.html" class="nav-link btn-join-nav ms-lg-3">Join Us</a>\s*<div class="theme-switch-wrapper">\s*<div class="theme-switch" id="themeToggle" role="button" aria-label="Toggle Dark Mode">\s*<div class="theme-switch-handle">\s*<i class="fas fa-moon"></i>\s*</div>\s*</div>\s*</div>\s*</li>'
    
    clean_nav_item = """                    <li class="nav-item mb-3 mb-lg-0">
                        <a href="contact.html" class="nav-link btn-join-nav ms-lg-3">Join Us</a>
                    </li>"""
    
    # 2. Cleanup orphaned theme tags (if any)
    orphan_switch = r'<div class="theme-switch-wrapper">.*?</div>'

    for filename in os.listdir('.'):
        if filename.endswith('.html'):
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            modified = False
            
            # Remove Switch
            if re.search(old_nav_item, content, re.DOTALL):
                content = re.sub(old_nav_item, clean_nav_item, content, flags=re.DOTALL)
                modified = True
            elif re.search(orphan_switch, content, re.DOTALL):
                content = re.sub(orphan_switch, '', content, flags=re.DOTALL)
                modified = True
            
            if modified:
                print(f"Removed Dark Mode from {filename}")
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)

if __name__ == "__main__":
    remove_dark_mode()
