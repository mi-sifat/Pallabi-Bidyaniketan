import os
import glob

base = r"e:\mis project\Pallabi Bidyaniketan\pallabi-school\src\app"
locale_dir = os.path.join(base, "[locale]")

pages = []
for root, dirs, files in os.walk(locale_dir):
    for f in files:
        if f == "page.tsx":
            pages.append(os.path.join(root, f))

dynamic_line = 'export const dynamic = "force-dynamic";\n'
added = []
skipped = []

for page_path in pages:
    with open(page_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    has_prisma = "lib/prisma" in content
    has_dynamic = "force-dynamic" in content
    
    if has_prisma and not has_dynamic:
        new_content = dynamic_line + content
        with open(page_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        added.append(page_path)
        print(f"ADDED: {page_path}")
    elif has_prisma and has_dynamic:
        skipped.append(page_path)
        print(f"SKIP (already has dynamic): {page_path}")
    else:
        print(f"NO PRISMA: {page_path}")

print(f"\nTotal added: {len(added)}, Skipped: {len(skipped)}")
