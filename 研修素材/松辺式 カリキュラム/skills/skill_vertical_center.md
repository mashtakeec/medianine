---
name: 上下中央配置スキル
description: カード・セクション内のテキストをflexboxで上下中央に配置する手法
type: feedback
---

カード内のテキストが上寄りや下寄りになっている場合、flexboxで上下中央に配置する。

**Why:** カードの高さは`flex:1`で親に依存するが、コンテンツ部分がデフォルトで`flex-start`（上寄せ）になっているため、余白が下に偏る。

**How to apply:**

**① 親カード（外枠）に高さを使い切らせる:**
```css
.card {
  display: flex;
  flex-direction: column;
}
```

**② コンテンツ部分に中央配置を指定:**
```css
.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

**バリエーション:**
| やりたいこと | CSS |
|---|---|
| 上下中央 | `justify-content: center` |
| 均等配置（行間含む） | `justify-content: space-evenly` |
| 均等配置（端に余白なし） | `justify-content: space-between` |
| 均等配置（端にも余白） | `justify-content: space-around` |

**注意:** `flex:1`がないと高さが中身依存になり`justify-content:center`が効かない。親カードに`display:flex; flex-direction:column`がないと`flex:1`が効かない。両方セットで必要。

**ユーザーの指示パターン:**
- 「上下中央配置して」→ `justify-content: center`
- 「均等な感覚で縦の行間を含めて」→ `justify-content: space-evenly`
- 「バランスが取れて均等に配置」→ 全セクションに`justify-content: center`を適用
