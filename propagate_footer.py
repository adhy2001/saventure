import os
import re

def get_footer_content(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract footer
    match = re.search(r'(<!-- Footer -->.*?</footer>)', content, re.DOTALL)
    if match:
        return match.group(1)
    return None

def propagate_footer(source_file, target_dir):
    new_footer = get_footer_content(source_file)
    if not new_footer:
        print("Could not find footer in source file.")
        return

    # List all html files
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith(".html") and file != "index.html":
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace footer
                new_content = re.sub(r'<!-- Footer -->.*?</footer>', new_footer, content, flags=re.DOTALL)
                
                if new_content != content:
                    print(f"Updating {file}...")
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                else:
                    print(f"No footer match in {file} or already updated.")

if __name__ == "__main__":
    propagate_footer('index.html', '.')
