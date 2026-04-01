---
name: コンポーネント別レイアウトルール
description: item-row・カード系・2カラムの基本CSSパターン
type: feedback
---

スライド内の主要コンポーネントのレイアウトパターン。

**item-row（箇条書き行）:**
```css
.item-row {
  display: flex;
  align-items: center; /* 必須・縦中央揃え */
  gap: 8px;
}
/* ドット・ナンバー要素には margin-top を付けない */
```

**カード系（stretch指定）:**
```css
.card {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
```

**2カラムレイアウト:**
```css
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 100%;
}
/* 左右カラムはそれぞれ height:100%; overflow:hidden */
```

**Why:** これらのパターンを守ることでスライド間のレイアウト統一性が保たれる。特にitem-rowの`align-items:center`と`margin-topなし`は縦揃えズレの防止に必須。

**よくあるバグ:**
- item-rowの縦揃えがズレる → ドット・番号要素の `margin-top` を削除
- テキストがはみ出す → カラム高さが `auto` のまま → `height:100%; overflow:hidden` を追加
