import os
import re

def propagate_navbar(target_dir):
    # Desired navbar brand (from index.html, but with href fixed)
    # index.html has:
    # <a class="navbar-brand d-flex align-items-center" href="#">
    #     <img src="images/Logo1.png" alt="Loud IMC" class="nav-logo me-2">
    # </a>
    
    new_brand_html = '''<a class="navbar-brand d-flex align-items-center" href="index.html">
                <img src="images/Logo1.png" alt="Loud IMC" class="nav-logo me-2">
            </a>'''

    # Regex to find existing navbar brand
    # It usually starts with <a class="navbar-brand" and ends with </a>. 
    # It might contain img and span.
    # We use DOTALL to match across lines.
    regex = r'<a class="navbar-brand[^"]*".*?>.*?</a>'
    
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith(".html") and file != "index.html":
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace
                new_content = re.sub(regex, new_brand_html, content, count=1, flags=re.DOTALL)
                
                if new_content != content:
                    print(f"Updating Navbar in {file}...")
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                else:
                    print(f"No match or already updated in {file}")

if __name__ == "__main__":
    propagate_navbar('.')
