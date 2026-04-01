---
name: スライドタイプ別チェックリスト
description: 表紙・PHASE区切り・コンテンツスライドごとの最終確認項目
type: feedback
---

スライドの種類に応じた最終チェック項目。

**表紙・PHASE区切り:**
- Impact/Oswald フォントは PHASE番号の装飾数字のみ使用
- `footer-right` テキストなし

**コンテンツスライド:**
- バッジ位置が `top:16px / left:52px`
- フッターが `bottom:18px / left:52px / right:52px / height:42px`
- `footer-right` に正しいLESSON/PHASEが入っている
- ダーク・レッド背景上のテキストが白になっている
- SVGアイコンの閉じタグが正しい

**全スライド共通:**
- `CW` 表記がない（「クラウドワークス」に統一）
- `@import` がない
- `box-shadow` がない
- `page-num` 要素がない
- `.top-bar` 要素が `display:none` になっている

**フッター右テキスト対応表:**
| ページ | footer-right |
|---|---|
| P01〜P03 | なし |
| P04/P31/P63/P86（PHASE区切り） | なし |
| P05〜P15 | LESSON 1 ／ PHASE 01 |
| P16〜P30 | LESSON 2 ／ PHASE 01 |
| P32〜P42 | LESSON 3 ／ PHASE 02 |
| P43〜P52 | LESSON 4 ／ PHASE 02 |
| P53〜P62 | LESSON 5 ／ PHASE 02 |
| P64〜P72 | LESSON 6 ／ PHASE 03 |
| P73〜P85 | LESSON 7 ／ PHASE 03 |
| P87〜P97 | LESSON 8 ／ PHASE 04 |
| P98〜P100 | なし |
