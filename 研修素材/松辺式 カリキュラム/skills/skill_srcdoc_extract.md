---
name: srcdoc抽出関数（get_srcdoc / get_srcdoc_range）
description: 特定スライドのsrcdocを安全に抽出する公式関数2種
type: feedback
---

引き継ぎドキュメントで定義された公式抽出関数。必ずこれを使うこと。

**get_srcdoc — HTMLのみ取得:**
```python
import html

def get_srcdoc(content, label):
    idx = content.find(f'<div class="slide-num">{label}')
    srcdoc_s = content.find('srcdoc="', idx) + len('srcdoc="')
    iframe_end = content.find('</iframe>', srcdoc_s)
    loading_pos = content.find('" loading=', srcdoc_s)
    if loading_pos != -1 and loading_pos < iframe_end:
        end = loading_pos
    else:
        end = content.rfind('"', srcdoc_s, iframe_end)
    return html.unescape(content[srcdoc_s:end])
```

**get_srcdoc_range — HTML + 位置情報（書き戻し用）:**
```python
def get_srcdoc_range(content, label):
    idx = content.find(f'<div class="slide-num">{label}')
    srcdoc_s = content.find('srcdoc="', idx) + len('srcdoc="')
    iframe_end = content.find('</iframe>', srcdoc_s)
    loading_pos = content.find('" loading=', srcdoc_s)
    end = loading_pos if (loading_pos != -1 and loading_pos < iframe_end) else content.rfind('"', srcdoc_s, iframe_end)
    return html.unescape(content[srcdoc_s:end]), srcdoc_s, end
```

**Why:** 自前でsrcdocの位置を探すとバグの温床。この関数を使えば`loading=`属性の境界を正しく処理できる。
