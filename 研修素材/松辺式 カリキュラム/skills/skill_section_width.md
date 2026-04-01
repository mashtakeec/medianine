---
name: セクション幅調整スキル
description: カードやセクションの横幅を広げて余白バランスを改善する手法
type: feedback
---

セクション内の要素が左に詰まりすぎている場合、幅を広げる。

**Why:** 固定幅のセクションが狭すぎると左寄りに見え、テキストも折り返されやすくなる。

**How to apply:**

**P23 5幕構成での実例:**
```css
/* Before */
.maku-num { width:52px; }
.maku-title { width:130px; }

/* After */
.maku-num { width:72px; }
.maku-title { width:150px; }
```

**判断基準:**
- スライド全体幅960pxから左右マージン52px×2を引いた856pxが使用可能幅
- 番号部分・タイトル部分・本文部分のバランスを見て調整
- 広げすぎると本文部分（flex:1）が狭くなるので注意
