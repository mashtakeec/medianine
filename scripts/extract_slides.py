import re
import json
import html
import os

input_html = r"..\研修素材\松辺式 カリキュラム\AIスクール2026_全スライド_SVGアイコン版_修正済み.html"
output_json = r"..\remotion-project\src\data\slides.json"

print(f"Reading {input_html}...")
with open(input_html, encoding="utf-8") as f:
    content = f.read()

slide_blocks = re.findall(
    r'<div class="slide-wrap"><div class="slide-num">(.*?)</div>.*?<iframe srcdoc="(.*?)" loading="lazy"></iframe></div>',
    content, re.DOTALL
)

print(f"Found {len(slide_blocks)} slides.")

slides = []
for slide_num, srcdoc in slide_blocks:
    html_content = html.unescape(srcdoc)
    # フッター右のテキスト (LESSON X ／ PHASE Y) を抽出して章分けのヒントにする
    chapter_match = re.search(r'<div class="footer-right">(.*?)</div>', html_content)
    chapter_info = chapter_match.group(1).strip() if chapter_match else ""
    
    slides.append({
        "id": slide_num,
        "chapter": chapter_info,
        "content": html_content
    })

os.makedirs(os.path.dirname(output_json), exist_ok=True)
with open(output_json, "w", encoding="utf-8") as out:
    json.dump(slides, out, ensure_ascii=False, indent=2)

print(f"Saved to {output_json}")
