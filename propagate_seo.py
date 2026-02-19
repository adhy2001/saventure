import os
import re

SEO_BLOCK = """    <meta name="description" content="Loud IMC is a premier creative agency specializing in digital transformation, strategic innovation, and remarkable digital experiences for brands worldwide.">
    <meta name="keywords" content="Creative Agency, Digital Transformation, Marketing Strategy, Brand Development, Loud IMC">
    <meta name="author" content="Loud IMC">
    <meta name="robots" content="index, follow">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://loudimc.com/">
    <meta property="og:title" content="Loud IMC - Creative Agency for Digital Transformation">
    <meta property="og:description" content="Ignite your digital evolution with Loud IMC. We streamline operations and deliver remarkable growth through innovation.">
    <meta property="og:image" content="https://loudimc.com/images/Logo-Full.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://loudimc.com/">
    <meta property="twitter:title" content="Loud IMC - Creative Agency for Digital Transformation">
    <meta property="twitter:description" content="Ignite your digital evolution with Loud IMC. We streamline operations and deliver remarkable growth through innovation.">
    <meta property="twitter:image" content="https://loudimc.com/images/Logo-Full.png">

    <link rel="canonical" href="https://loudimc.com/">"""

def propagate_seo():
    for filename in os.listdir('.'):
        if filename.endswith('.html') and filename != 'index.html':
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check if SEO block already exists
            if 'og:title' in content:
                print(f"Skipping {filename} (already has SEO tags)")
                continue

            # Find position after title tag
            title_pattern = re.compile(r'(<title>.*?</title>)', re.IGNORECASE)
            match = title_pattern.search(content)
            
            if match:
                new_content = content.replace(match.group(1), match.group(1) + "\n" + SEO_BLOCK)
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")
            else:
                print(f"Could not find title tag in {filename}")

if __name__ == "__main__":
    propagate_seo()
