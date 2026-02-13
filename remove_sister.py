import os
import re

def remove_sister_concern(target_dir):
    # Regex to find the Sister Concern Section
    # Matches from <!-- Sister Concern Section --> to closing </section>
    # We need to be careful to match the specific structure we added.
    regex = r'\s*<!-- Sister Concern Section -->.*?<section class="sister-concern-section.*?</section>'
    
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith(".html") and file != "index.html":
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Check if it exists
                if "sister-concern-section" in content:
                    # Remove it
                    new_content = re.sub(regex, '', content, flags=re.DOTALL)
                    
                    if new_content != content:
                        print(f"Removing Sister Concern from {file}...")
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                    else:
                        print(f"Regex didn't match in {file} quite right, but keyword found.")
                else:
                    # print(f"Not found in {file}")
                    pass

if __name__ == "__main__":
    remove_sister_concern('.')
