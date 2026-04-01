---
name: 禁止ルール一覧
description: スライド制作で絶対に使ってはいけないCSS・HTML・表記の一覧
type: feedback
---

スライド制作における禁止事項。違反すると全体のデザインが崩れる。

**CSS禁止:**
- `box-shadow` — 全ページで使用禁止
- `@import` — CDN依存なし・スタンドアロン動作が必須
- `.top-bar` を表示する — `display:none`固定
- `.slide` の height を 540px 以外にする — 全レイアウトが崩壊
- `.slide` の overflow を visible にする — 前後スライドに内容が漏れる
- フッターバナーの bottom を 18px 以外にする — コンテンツと重なる
- `footer-text` に `flex:1` を付与する — レイアウト崩壊

**HTML禁止:**
- `.page-num` 要素を作らない
- `.top-bar` 要素を表示しない

**表記禁止:**
- `CW` 表記 → 必ず「クラウドワークス」と表記
- 黒背景内で赤文字（`color:var(--red)`）→ `white` または `#ADADAD` に変更
- レッド・ダーク背景上の薄い赤テキスト → 白（`#FFFFFF`）に変更
- フッター `span` は必ず `color: white`

**Why:** これらはプロジェクト全体で確定したルール。1箇所でも違反すると他スライドとの統一感が崩れ、修正コストが膨大になる。
