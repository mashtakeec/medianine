---
name: モバイル確認用ビューア生成スキル
description: 本番HTMLからモバイル確認用HTMLを自動生成する手順とスクリプト
type: feedback
---

本番ファイルからモバイル確認用ビューアを再生成する手順。

**ルール:**
- 必ず本番ファイルを修正してからモバイル確認用を再生成すること
- モバイル確認用は本番のsrcdocをそのまま抽出して再構築している

**iframe-outerラップ構造:**
```html
<div class="iframe-outer">
  <iframe srcdoc="..." loading="lazy"></iframe>
</div>
```

**自動縮小JS:**
```javascript
(function(){
  function resize(){
    var w = Math.min(window.innerWidth - 24, 540);
    var scale = w / 960;
    document.querySelectorAll(".iframe-outer").forEach(function(el){
      el.style.width  = w + "px";
      el.style.height = Math.ceil(540 * scale) + "px";
      var fr = el.querySelector("iframe");
      if(fr) fr.style.transform = "scale(" + scale + ")";
    });
  }
  window.addEventListener("load", resize);
  window.addEventListener("resize", resize);
})();
```

**再生成スクリプト（Python）:**
```python
import re
with open('AIスクール2026_全スライド_SVGアイコン版.html', 'r', encoding='utf-8') as f:
    content = f.read()
slide_blocks = re.findall(
    r'<div class="slide-wrap"><div class="slide-num">(.*?)</div><iframe srcdoc="(.*?)" loading="lazy"></iframe></div>',
    content, re.DOTALL
)
# → slide_blocks から新HTMLを組み立てて書き出す
```

**How to apply:** 本番の修正が一区切りついたタイミングで再生成する。毎回の小修正ごとに再生成する必要はない。
