---
name: よくあるバグと対処法
description: スライド制作でよく発生するバグとその修正方法
type: feedback
---

スライド制作で頻出するバグと対処法。

| バグ | 原因 | 対処 |
|---|---|---|
| SVGが崩れる | 閉じタグのミス `opacity="0.15}/>` | `/>` を正しく閉じる |
| 日本語が文字化け/□ | PDF書き出し時のフォントフォールバック | `Noto Sans CJK JP` に一括置換 |
| item-rowの縦揃えがズレる | `margin-top` が残っている | ドット・番号要素の `margin-top` を削除 |
| レイアウト崩壊 | `html.escape` せずに srcdoc に直書き | 必ず `html.escape(quote=True)` を通す |
| テキストがはみ出す | カラム高さが `auto` のまま | `height:100%; overflow:hidden` を追加 |
| 要素が見切れる | padding/gapの積み上げが540pxを超過 | padding/gap縮小 or flex中央配置 |
| 改行位置がおかしい | CSSの自動折り返し | `<br>`で意味の切れ目に明示的改行 |
| セクション方向変更後に圧縮 | 横→縦で高さ増加、兄弟がflex:1で縮む | padding縮小で対処 |

**Why:** 同じバグを何度も踏まないために。特にsrcdocのエスケープ忘れとSVG閉じタグは致命的。
