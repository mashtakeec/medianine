---
name: レイアウト方向変更スキル
description: 横並び→縦並び等のレイアウト方向変更とそれに伴う調整
type: feedback
---

セクション内の要素の並び方向を変更する手法。

**Why:** 横2列だとテキストが窮屈で読みにくい場合、縦2段にすると1行あたりの幅が広がり読みやすくなる。

**How to apply:**

**横→縦の変更:**
```css
/* Before */
.compare-body { display:flex; }
.cmp-side:first-child { border-right:1px solid var(--line); }

/* After */
.compare-body { display:flex; flex-direction:column; }
.cmp-side:first-child { border-bottom:1px solid var(--line); }
```

**縦に変更した後の副作用:**
- 高さが増えるため、同じカラム内の他のセクション（flex:1の兄弟要素）が圧縮される
- → paddingを詰める、フォントサイズを下げる等で対処

**P37での実例:**
1. NG/OKを横2列→縦2段に変更
2. 高さ増加でREADING PROCEDUREカードが圧縮された
3. → NG/OKのpadding縮小（10px→5px）、margin縮小（5px→2px→0）で対処
4. タグ+テキストを横1列に: `display:flex; align-items:center; gap:10px`
