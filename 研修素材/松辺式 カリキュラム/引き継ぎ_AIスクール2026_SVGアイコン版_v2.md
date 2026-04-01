# AIスクール2026 スライド制作 — 引き継ぎドキュメント（SVGアイコン版 v2）

> **最終更新**: 2026-03-27
> **対象ファイル**: `AIスクール2026_全スライド_SVGアイコン版.html`
> **モバイル確認用**: `AIスクール2026_モバイル確認用.html`
> **総ページ数**: 100ページ（P01〜P100・完全連番）
> **スクール名**: Ai-BOW AI School 2026 ／ YouTube台本ライター養成スクール

---

## ファイル構成

| ファイル | 内容 |
|---|---|
| `AIスクール2026_全スライド_SVGアイコン版.html` | 全100ページ収録ビューア（本番用・PDF出力用） |
| `AIスクール2026_モバイル確認用.html` | スマホ確認専用（画面幅に自動縮小） |
| `引き継ぎ_AIスクール2026_SVGアイコン版_v2.md` | 本ドキュメント |

---

## カリキュラム構成（全100ページ）

### オープニング（P01〜P04）
| P# | タイトル | 種別 |
|---|---|---|
| P01 | 表紙 | 表紙型 |
| P02 | このスクールで目指すゴール | コンテンツ |
| P03 | カリキュラム全体マップ | コンテンツ |
| P04 | PHASE 1 区切り | PHASE区切り型 |

### LESSON 1（P05〜P15）〜 LESSON 8（P86〜P97）
※ 引き継ぎ初期版MDの構成と同一。変更なし。

### クロージング（P98〜P100）
| P# | タイトル | 種別 |
|---|---|---|
| P98 | カリキュラム全体サマリー | NEW |
| P99 | 次のアクション | NEW |
| P100 | エンディング | NEW |

---

## 確定デザインシステム（v2更新版）

### カラー変数（全スライド共通）

```css
:root {
  --red:     #C8232C;
  --dark:    #1A1A1A;
  --gray:    #3D3D3D;
  --gray-mid:#4A4A4A;   /* ← v2変更: 旧#6B6B6B → #4A4A4A（少し暗く）*/
  --gray-lt: #6B6B6B;   /* ← v2変更: PHASE区切りP04/P31/P63/P86は#6B6B6Bで統一 */
  --line:    #E2E2E2;
  --bg:      #FFFFFF;
  --bg-off:  #F7F7F7;
}
body { background: #DCDCDC; }
```

> **注意**: `--gray-lt` はページによって値が異なる場合がある。PHASE区切り4枚（P04/P31/P63/P86）は `#6B6B6B` で統一済み。それ以外は `#ADADAD` が多い。

### フォント

| 用途 | フォント | 備考 |
|---|---|---|
| 本文全体 | `"Noto Sans JP", sans-serif` | CDN不使用・オフライン対応 |
| PHASE装飾大数字 | `'Oswald', sans-serif` | Google Fonts CDN（要接続） |
| monospace | **廃止** | P39で`Noto Sans JP`に変更済み |

### Google Fonts CDN（P04・P31・P63・P86のみ）

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap" rel="stylesheet">
```

> **PDF出力時の注意**: Oswaldはインターネット接続時のみ正常表示。オフライン環境ではフォールバック。

### レイアウト固定値

| 項目 | 値 |
|---|---|
| スライドサイズ | **960×540px**（変更禁止） |
| スライド overflow | **hidden**（変更禁止） |
| 左右マージン | left / right: 52px |
| 上部赤バー | `display:none`（全ページ削除済み） |
| フッターバナー | height: 42px / bottom: 18px |
| フッター左右 | left: 52px / right: 52px |
| フッター角丸 | border-radius: 8px |
| header top | 16px（全ページ統一） |
| content-area top / bottom | 118px / 68px |

### フォントサイズ一覧（v2確定値）

| 用途 | クラス | サイズ | 変更前 |
|---|---|---|---|
| バッジ「Ai-BOW AI School 2026」 | `.badge-text` | **10px** | 8px |
| スライドタイトル | `.slide-title` | 32px | 変更なし |
| 章タイトル大見出し | `.title-ja` | 44〜46px | 変更なし |
| PHASE大見出し | `.phase-title-jp` | 46px | 変更なし |
| 英語サブタイトル | `.title-en` | 12px | 変更なし |
| サブタイトル | `.slide-subtitle` | **13px** | 12px |
| フッターメインテキスト | `.footer-text` / `.summary-text` / `.banner-text` | **12px** | 12px（統一済み） |
| フッター右テキスト | `.footer-right` / `.summary-right` / `.banner-right` | 8px（固定） | 変更なし |
| ゴールバナーテキスト | `.goal-text` | **14px** | 12px |
| カードアイコン `.ic-theme` | `.ic-theme` | **15px** | 13px |
| 説明文 `.ic-desc` | `.ic-desc` | **12px** | 11px |
| カード説明 `.card-desc` | `.card-desc` | **13px** | 12px |
| PHASE装飾大数字 | `.phase-num-big` | 310px / Oswald 700 | Impact 320px |
| 章タイトル説明文 | `.subtitle`（P05/P16等） | **15px** | 13px |
| LESSON項目テキスト | `.lesson-item-text` | **15px** | 13px |

---

## v2で実施した修正一覧

### フォント・カラー系

| 修正内容 | 対象 |
|---|---|
| Impact → Oswald 700（Google Fonts CDN） | P04・P31・P63・P86（PHASE区切り4枚） |
| monospace → Noto Sans JP | P39 |
| `.badge-text` 8px → 10px | 全95ページ |
| `.goal-text` 12px → 14px | P02・P03 |
| フッターメインテキスト 14px → 12px（バナー高さに合わせ調整） | 全86ページ |
| `.footer-right`系 color → `#ADADAD` 統一 | 全100ページ |
| `.goal-right` color var(--gray-lt) → `#ADADAD` | P02・P03 |
| `--gray-mid` #6B6B6B → #4A4A4A | 全100ページ |
| `--gray-lt` P31/P63/P86 → #6B6B6B（P04に統一） | P31・P63・P86 |
| subtitle 13px → 15px | P05・P16・P32・P43・P53・P64・P73・P87 |
| lesson-item-text 13px → 15px | P04・P31・P63・P86 |

### デザイン系

| 修正内容 | 対象 |
|---|---|
| `.phase-num-big` → display:none（背景数字削除） | P04・P31・P63・P86 |
| `.point-card` border削除・border-radius:0（角四角） | P04・P31・P63・P86 |
| `.accent` border-left削除 | P03 |
| TARGETボックス border-left削除 | P03（インラインstyle） |
| 赤 `border-left` 全削除（10種類のクラス） | P04/P09/P13/P31/P39/P57/P63/P86/P93/P94 |
| アクセント要素 display:none（左赤バー） | P09・P37・P77・P89 |
| P08 `.banner-dot` → `.banner-icon`（SVG星アイコン） | P08 |
| P56 `.banner-dot` → `.banner-icon`（SVG星アイコン） | P56 |
| フッターバナー min-height:44px・padding:8px 22px・line-height:1.4 | 全86ページ |
| P03 `.lesson-card` padding/min-height拡大・gap調整 | P03 |
| P04/P31/P63/P86 lesson-item margin-bottom拡大 | 4ページ |
| `THIS PHASE COVERS` カラーを `#6B6B6B` に統一 | P04・P31・P63・P86 |

---

## 禁止ルール（v2追加・厳守）

1. `.top-bar` は `display:none` 固定
2. `.page-num` 要素を作らない
3. フッター `span` は `color: white`
4. `@import` なし
5. `box-shadow` 使用禁止
6. テキスト中の「CW」表記禁止 → 必ず「クラウドワークス」と表記
7. **黒背景内で赤文字（`color:var(--red)`）を使わない** → `white` または `#ADADAD`
8. **`footer-text` に `flex:1` を付与しない**
9. **`.slide` の height は 540px 固定**（変更すると全スライドのレイアウトが崩れる）
10. **`.slide` の overflow は hidden 固定**（visibleにすると前後スライドに内容が漏れる）
11. **フッターバナーの bottom は 18px 固定**（0にするとコンテンツと重なる）

---

## SVGアイコン色ルール

- 通常背景（白・グレー）上のアイコン: `fill="#C8232C"` / `stroke="#C8232C"`（赤）
- 赤背景・ダーク背景上のアイコン: `fill="white"` / `stroke="white"`

---

## srcdoc 抽出関数（重要・必ず使うこと）

```python
import html

def get_srcdoc(content, label):
    idx = content.find(f'<div class="slide-num">{label}')
    srcdoc_s = content.find('srcdoc="', idx) + len('srcdoc="')
    iframe_end = content.find('</iframe>', srcdoc_s)
    loading_pos = content.find('" loading=', srcdoc_s)
    if loading_pos != -1 and loading_pos < iframe_end:
        end = loading_pos
    else:
        end = content.rfind('"', srcdoc_s, iframe_end)
    return html.unescape(content[srcdoc_s:end])

def get_srcdoc_range(content, label):
    idx = content.find(f'<div class="slide-num">{label}')
    srcdoc_s = content.find('srcdoc="', idx) + len('srcdoc="')
    iframe_end = content.find('</iframe>', srcdoc_s)
    loading_pos = content.find('" loading=', srcdoc_s)
    end = loading_pos if (loading_pos != -1 and loading_pos < iframe_end) else content.rfind('"', srcdoc_s, iframe_end)
    return html.unescape(content[srcdoc_s:end]), srcdoc_s, end
```

---

## モバイル確認用ビューア 仕様

```html
<!-- iframe-outerラップ構造 -->
<div class="iframe-outer">
  <iframe srcdoc="..." loading="lazy"></iframe>
</div>

<!-- JS: 画面幅に自動縮小 -->
<script>
(function(){
  function resize(){
    var w = Math.min(window.innerWidth - 24, 540);
    var scale = w / 960;
    document.querySelectorAll(".iframe-outer").forEach(function(el){
      el.style.width  = w + "px";
      el.style.height = Math.ceil(540 * scale) + "px";
      var fr = el.querySelector("iframe");
      if(fr) fr.style.transform = "scale(" + scale + ")";
    });
  }
  window.addEventListener("load", resize);
  window.addEventListener("resize", resize);
})();
</script>
```

> **注意**: モバイル確認用はiframe内のsrcdocを本番ファイルからそのまま抽出して再構築している。必ず本番ファイルを修正してからモバイル確認用を再生成すること。

---

## モバイル確認用 再生成スクリプト

```python
import re

with open('AIスクール2026_全スライド_SVGアイコン版.html', 'r', encoding='utf-8') as f:
    content = f.read()

slide_blocks = re.findall(
    r'<div class="slide-wrap"><div class="slide-num">(.*?)</div><iframe srcdoc="(.*?)" loading="lazy"></iframe></div>',
    content, re.DOTALL
)

new_html = '''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Ai-BOW AI School 2026 — モバイル確認用</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#1A1A1A; font-family:"Noto Sans JP",sans-serif; padding:12px; }
.page-title { color:#FFF; font-size:13px; font-weight:700; margin-bottom:4px; }
.page-meta { color:#555; font-size:10px; margin-bottom:20px; }
.slide-wrap { margin-bottom:14px; }
.slide-num { color:#666; font-size:9px; font-weight:700; letter-spacing:0.1em; margin-bottom:4px; }
.iframe-outer { position:relative; overflow:hidden; border-radius:6px; background:#fff; }
.iframe-outer iframe { display:block; border:none; width:960px; height:540px; transform-origin:top left; }
</style>
<script>
(function(){
  function resize(){
    var w = Math.min(window.innerWidth - 24, 540);
    var scale = w / 960;
    document.querySelectorAll(".iframe-outer").forEach(function(el){
      el.style.width  = w + "px";
      el.style.height = Math.ceil(540 * scale) + "px";
      var fr = el.querySelector("iframe");
      if(fr) fr.style.transform = "scale(" + scale + ")";
    });
  }
  window.addEventListener("load", resize);
  window.addEventListener("resize", resize);
})();
</script>
</head>
<body>
<div class="page-title">Ai-BOW AI School 2026 — 全スライド P01〜P100</div>
<div class="page-meta">AIライティングでYouTube台本案件を獲得する ／ PHASE 01〜04 ／ 全8レッスン</div>
'''
for slide_num, srcdoc in slide_blocks:
    new_html += f'<div class="slide-wrap"><div class="slide-num">{slide_num}</div><div class="iframe-outer"><iframe srcdoc="{srcdoc}" loading="lazy"></iframe></div></div>\n'
new_html += '</body>\n</html>'

with open('AIスクール2026_モバイル確認用.html', 'w', encoding='utf-8') as f:
    f.write(new_html)
```

---

## PENDING（次のチャットへの引き継ぎ事項）

| 優先度 | 内容 | 詳細 |
|---|---|---|
| 🔴 高 | 不自然な改行の修正 | CSSの自動折り返しで意味の切れ目でない場所で改行される問題。スクリーンショット＋ページ番号＋箇所を指定して1件ずつ修正すること |
| 🟡 中 | 全スライドPDF書き出し対応確認 | Oswald（Googleフォント）はオンライン接続必須 |
| 🟡 中 | テンプレートシステム化（他教材への転用） | — |
| 🟢 低 | 一部スライドへの追加アイコン | レイアウトを壊さない形で |

---

## 改行修正の進め方（重要）

不自然な改行はCSSの自動折り返しが原因。修正方法は以下の2通り：

**① `<br>` を意味の切れ目に追加する**
```html
<!-- 悪い例（CSSが勝手に折り返す） -->
YouTube台本市場とAIライターの可能性

<!-- 良い例（意味の切れ目で明示的に改行） -->
YouTube台本市場と<br>AIライターの可能性
```

**② CSSで `white-space: nowrap` を指定する（1行固定したい場合）**
```css
.footer-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
```

> **注意**: 修正前に必ずスクリーンショットで現状を確認してから変更すること。

---

## プロジェクト情報

| 項目 | 内容 |
|---|---|
| クライアント | Ai-BOW |
| スクール名 | Ai-BOW AI School 2026 |
| コース | YouTube台本ライター養成スクール |
| スライドサイズ | 960×540px（YouTube/動画向け16:9） |
| 制作方式 | HTML/CSS完全手書き（iframeビューア形式） |
| 総ページ数 | 100ページ（P01〜P100・完全連番） |
| 最終更新 | 2026-03-27 |
| 担当者引き継ぎ | Claude Sonnet 4.6（Ai-BOWプロジェクト） |
