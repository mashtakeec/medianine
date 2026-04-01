---
name: v2実施済み修正一覧
description: v1→v2で実施したフォント・カラー・デザイン変更の全リスト
type: feedback
---

v2で実施した修正の全リスト。既に適用済み。

**フォント・カラー系:**
- Impact → Oswald 700（Google Fonts CDN） → P04・P31・P63・P86
- monospace → Noto Sans JP → P39
- `.badge-text` 8px → 10px → 全95ページ
- `.goal-text` 12px → 14px → P02・P03
- フッターメインテキスト 14px → 12px → 全86ページ
- `.footer-right`系 color → `#ADADAD` 統一 → 全100ページ
- `--gray-mid` #6B6B6B → #4A4A4A → 全100ページ
- `--gray-lt` P31/P63/P86 → #6B6B6B（P04に統一）
- subtitle 13px → 15px → P05・P16・P32・P43・P53・P64・P73・P87
- lesson-item-text 13px → 15px → P04・P31・P63・P86

**デザイン系:**
- `.phase-num-big` → display:none（背景数字削除） → P04・P31・P63・P86
- `.point-card` border削除・border-radius:0 → P04・P31・P63・P86
- 赤 `border-left` 全削除（10種類のクラス） → P04/P09/P13/P31/P39/P57/P63/P86/P93/P94
- アクセント要素 display:none（左赤バー） → P09・P37・P77・P89
- P08/P56 `.banner-dot` → `.banner-icon`（SVG星アイコン）
- フッターバナー min-height:44px・padding:8px 22px・line-height:1.4 → 全86ページ
- `THIS PHASE COVERS` カラーを `#6B6B6B` に統一 → P04・P31・P63・P86

**Why:** 同じ修正を二度行わないため。また新規スライド作成時にv2ルールに合わせるため。
