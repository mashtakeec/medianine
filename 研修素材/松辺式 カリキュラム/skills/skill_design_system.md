---
name: デザインシステム（カラー・レイアウト固定値）
description: 全スライド共通のカラー変数・レイアウト固定値・スライド構造テンプレート
type: feedback
---

全スライドで共通のデザインシステム。変更禁止の固定値。

**カラー変数:**
```css
:root {
  --red:     #C8232C;   /* メインアクセント */
  --dark:    #1A1A1A;   /* ほぼ黒・テキスト */
  --gray:    #3D3D3D;
  --gray-mid:#4A4A4A;
  --gray-lt: #ADADAD;
  --line:    #E2E2E2;
  --bg:      #FFFFFF;
  --bg-off:  #F7F7F7;
}
body { background: #DCDCDC; }
```

**レイアウト固定値（変更禁止）:**
| 項目 | 値 |
|---|---|
| スライドサイズ | 960×540px |
| slide overflow | hidden |
| 左右マージン | left/right: 52px |
| header top | 16px |
| content-area top/bottom | 118px / 68px |
| フッターバナー | bottom:18px, left:52px, right:52px, height:42px |

**スライド構造テンプレート:**
```html
<div class="slide">
  <div class="top-bar"></div><!-- display:none固定 -->
  <div class="header">
    <div class="badge"><div class="badge-dot"></div><span class="badge-text">Ai-BOW AI School 2026</span></div>
    <div class="slide-title">タイトル</div>
    <div class="slide-subtitle">サブタイトル</div>
  </div>
  <div class="content-area"><!-- コンテンツ --></div>
  <div class="footer-banner">
    <div class="footer-icon"><!-- SVG 14×14 --></div>
    <div class="footer-text">フッターテキスト</div>
    <div class="footer-right">LESSON X ／ PHASE 0X</div>
  </div>
</div>
```
