---
name: はみ出し・見切れ修正スキル
description: カード内の要素が枠外にはみ出して見切れる問題の修正手法
type: feedback
---

カード内の最後の要素（03番目など）が枠の下端で見切れる問題の修正。

**Why:** `.slide`は`overflow:hidden`固定（540px）のため、はみ出した要素は切り取られる。padding/gap/font-sizeの積み上げが高さを超えると発生する。

**How to apply:**

**方法1: padding/gapを縮小する**
```css
/* Before */
.cycle-body { padding:12px 16px; gap:7px; }
.dark-body { padding:14px 16px; gap:8px; }
.card-head { padding:10px 16px; }

/* After */
.cycle-body { padding:8px 16px; gap:5px; }
.dark-body { padding:10px 16px; gap:6px; }
.card-head { padding:8px 16px; }
```

**方法2: 兄弟要素のgapを縮小する**
```css
.right-col { gap:10px; } → .right-col { gap:8px; }
```

**方法3: flex:1 + justify-content:centerで中央配置する**
- 親カードに`display:flex; flex-direction:column`
- コンテンツ部分に`flex:1; justify-content:center`
- これにより余白が均等に分配され、見切れが解消されることもある

**P13での実例:**
成長サイクルの03が見切れ → padding/gap縮小 + 親カードにflex column追加 + cycle-bodyにjustify-content:center
