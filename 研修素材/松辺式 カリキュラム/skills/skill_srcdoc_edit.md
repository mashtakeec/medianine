---
name: srcdoc編集の基本手順
description: iframeのsrcdocに埋め込まれたスライドHTMLを安全に編集する手順
type: feedback
---

全スライドは1つのHTMLファイル内にiframeのsrcdoc属性として格納されている。編集時は必ずエスケープ/アンエスケープ処理を通す。

**Why:** srcdoc内のHTMLはHTMLエンティティとしてエスケープされている。直接文字列置換するとencoding破損の原因になる。

**How to apply:**

```python
import html

with open('AIスクール2026_全スライド_SVGアイコン版.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 対象スライドの位置を特定
idx = content.find('<div class="slide-num">P XX')
srcdoc_s = content.find('srcdoc="', idx) + len('srcdoc="')
loading_pos = content.find('" loading=', srcdoc_s)

# 2. アンエスケープして生HTMLを取得
inner = html.unescape(content[srcdoc_s:loading_pos])

# 3. 生HTMLに対して修正を加える
inner = inner.replace('変更前テキスト', '変更後テキスト')

# 4. 再エスケープして書き戻す
encoded = html.escape(inner, quote=True)
content = content[:srcdoc_s] + encoded + content[loading_pos:]

with open('AIスクール2026_全スライド_SVGアイコン版.html', 'w', encoding='utf-8') as f:
    f.write(content)
```

**注意点:**
- `html.unescape()` → 編集 → `html.escape(quote=True)` の順序を厳守
- テキスト置換は生HTML上で行う（エスケープ済み文字列を直接置換しない）
- `<strong>`タグ等を含む場合、タグごと置換対象にする
- 置換文字列がユニークであることを確認（複数マッチすると意図しない箇所も変更される）
