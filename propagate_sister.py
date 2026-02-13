import os
import re

def propagate_sister_concern(source_file, target_dir):
    with open(source_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract Sister Concern Section
    # Matches from <!-- Sister Concern Section --> to before <!-- Footer -->
    match = re.search(r'(<!-- Sister Concern Section -->.*?)(?=\s*<!-- Footer -->)', content, re.DOTALL)
    if not match:
        print("Could not find Sister Concern section in source file.")
        return

    sister_section = match.group(1)

    # List all html files
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith(".html") and file != "index.html":
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    target_content = f.read()
                
                # Check if already exists
                if "sister-concern-section" in target_content:
                    print(f"Sister concern already exists in {file}. Skipping.")
                    continue

                # Insert before footer
                # We assume standard comment <!-- Footer --> exists as common anchor
                if '<!-- Footer -->' in target_content:
                    new_content = target_content.replace('<!-- Footer -->', f'{sister_section}\n    <!-- Footer -->')
                    
                    print(f"Inserting into {file}...")
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                else:
                    print(f"Could not find Footer anchor in {file}")

if __name__ == "__main__":
    propagate_sister_concern('index.html', '.')
