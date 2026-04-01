/**
 * 各スライドのHTML構造を実際に解析し、正確なアニメーションキューを生成
 * セレクタはnth-childではなく、実際のクラス名とDOM位置で指定
 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const BASE_DIR = path.join(__dirname, "..");
const SLIDES_PATH = path.join(BASE_DIR, "src", "data", "slides_lesson1.json");
const OUTPUT_PATH = path.join(BASE_DIR, "src", "data", "animation_cues.json");

const slides = JSON.parse(fs.readFileSync(SLIDES_PATH, "utf-8"));

function getText(el) {
  return el ? el.textContent.trim().substring(0, 60) : "";
}

function buildCues(slide) {
  const dom = new JSDOM(slide.content);
  const doc = dom.window.document;
  const cues = [];

  // ヘッダー（ほぼ全スライド共通）
  const header = doc.querySelector(".header");
  if (header) {
    cues.push({ selector: ".header", label: "ヘッダー" });
  }

  switch (slide.id) {
    // === P01: 表紙 ===
    case "P01":
      cues.push({ selector: ".title-ja", label: "メインタイトル" });
      cues.push({ selector: ".subtitle", label: "サブタイトル" });
      cues.push({ selector: ".title-en", label: "英語タイトル" });
      break;

    // === P02: 3ステップカード + ゴールバナー ===
    case "P02":
      // cards-area内: card, (arrow), card, (arrow), card → nth-child(1,3,5)
      cues.push({ selector: ".cards-area > :nth-child(1)", label: "STEP 01 知識インプット" });
      cues.push({ selector: ".cards-area > :nth-child(3)", label: "STEP 02 制作スキル" });
      cues.push({ selector: ".cards-area > :nth-child(5)", label: "STEP 03 案件獲得" });
      cues.push({ selector: ".goal-banner", label: "ゴールバナー" });
      break;

    // === P03: 4フェーズカラム + ゴールバナー ===
    case "P03":
      cues.push({ selector: ".phases .phase-col.ph1", label: "PHASE 01" });
      cues.push({ selector: ".phases .phase-col.ph2", label: "PHASE 02" });
      cues.push({ selector: ".phases .phase-col.ph3", label: "PHASE 03" });
      cues.push({ selector: ".phases .phase-col.ph4", label: "PHASE 04" });
      cues.push({ selector: ".goal-banner", label: "ゴールバナー" });
      break;

    // === P04: PHASE区切り（左パネル + 右パネル point-card x4） ===
    case "P04":
      cues.push({ selector: ".left-panel", label: "PHASE 1 タイトル" });
      cues.push({ selector: ".right-panel .right-heading", label: "THIS PHASE COVERS" });
      // right-panel内: right-heading, point-card, point-card, point-card, point-card → nth-child(2,3,4,5)
      cues.push({ selector: ".right-panel > :nth-child(2)", label: "ポイント01" });
      cues.push({ selector: ".right-panel > :nth-child(3)", label: "ポイント02" });
      cues.push({ selector: ".right-panel > :nth-child(4)", label: "ポイント03" });
      cues.push({ selector: ".right-panel > :nth-child(5)", label: "ポイント04" });
      break;

    // === P05: LESSON章タイトル ===
    case "P05":
      cues.push({ selector: ".title-ja", label: "章タイトル" });
      cues.push({ selector: ".subtitle", label: "サブタイトル" });
      break;

    // === P06: この章で学ぶこと（item-card x5 + footer） ===
    case "P06":
      cues.push({ selector: ".content-area > :nth-child(1)", label: "項目1 市場の現状" });
      cues.push({ selector: ".content-area > :nth-child(2)", label: "項目2 単価・相場" });
      cues.push({ selector: ".content-area > :nth-child(3)", label: "項目3 収益ロードマップ" });
      cues.push({ selector: ".content-area > :nth-child(4)", label: "項目4 作業時間" });
      cues.push({ selector: ".content-area > :nth-child(5)", label: "項目5 心構え" });
      cues.push({ selector: ".footer-banner", label: "フッター" });
      break;

    // === P07: reason-card x3 + summary-banner ===
    case "P07":
      cues.push({ selector: ".content-area > :nth-child(1)", label: "理由01 動画投稿本数の増加" });
      cues.push({ selector: ".content-area > :nth-child(2)", label: "理由02 外注文化の拡大" });
      cues.push({ selector: ".content-area > :nth-child(3)", label: "理由03 AI活用" });
      cues.push({ selector: ".summary-banner", label: "まとめバナー" });
      break;

    // === P08: genre-card x3 + bottom-banner ===
    case "P08":
      cues.push({ selector: ".cards-area > :nth-child(1)", label: "スカッと系" });
      cues.push({ selector: ".cards-area > :nth-child(2)", label: "ゆっくり解説" });
      cues.push({ selector: ".cards-area > :nth-child(3)", label: "一人語り" });
      cues.push({ selector: ".bottom-banner", label: "バナー" });
      break;

    // === P09: left-col(price-card x4) + right-col(bar chart) + footer ===
    case "P09":
      cues.push({ selector: ".content-area .left-col", label: "単価カード" });
      cues.push({ selector: ".content-area .right-col", label: "文字単価比較チャート" });
      cues.push({ selector: ".footer-banner", label: "フッター" });
      break;

    // === P10: 3段階カラム + footer ===
    case "P10":
      // content-area: col-a, arrow, col-b, arrow, col-c → nth-child(1,3,5)
      cues.push({ selector: ".content-area > :nth-child(1)", label: "STEP 01 実績をつくる" });
      cues.push({ selector: ".content-area > :nth-child(3)", label: "STEP 02 型を身につける" });
      cues.push({ selector: ".content-area > :nth-child(5)", label: "STEP 03 単価を上げる" });
      cues.push({ selector: ".footer-banner", label: "フッター" });
      break;

    // === P11: left-col(time比較+reason) + right-col(day+point) + footer ===
    case "P11":
      cues.push({ selector: ".content-area .left-col", label: "作業時間の比較" });
      cues.push({ selector: ".content-area .right-col", label: "1日の作業ペース" });
      cues.push({ selector: ".footer-banner", label: "フッター" });
      break;

    // === P12: left-col + right-col + footer ===
    case "P12":
      cues.push({ selector: ".content-area .left-col", label: "同時受注の考え方" });
      cues.push({ selector: ".content-area .right-col", label: "管理のポイント" });
      cues.push({ selector: ".footer-banner", label: "フッター" });
      break;

    // === P13: left-col(card x2) + right-col(dark-card + card) + footer ===
    case "P13":
      cues.push({ selector: ".content-area .left-col", label: "AIへの誤解と現実" });
      cues.push({ selector: ".content-area .right-col", label: "落選・修正への向き合い方" });
      cues.push({ selector: ".footer-banner", label: "フッター" });
      break;

    // === P14: left-col(dark-card + card) + right-col(card + quote) + footer ===
    case "P14":
      cues.push({ selector: ".content-area .left-col", label: "提出恐怖症の症状" });
      cues.push({ selector: ".content-area .right-col", label: "対処法" });
      cues.push({ selector: ".footer-banner", label: "フッター" });
      break;

    // === P15: まとめ left-col(KEY POINTS) + right-col(SUMMARY) + footer ===
    case "P15":
      cues.push({ selector: ".content-area .left-col", label: "KEY POINTS" });
      cues.push({ selector: ".content-area .right-col", label: "CHAPTER SUMMARY" });
      cues.push({ selector: ".footer-banner", label: "フッター" });
      break;
  }

  // バリデーション: セレクタが実際にマッチするか確認
  const validated = cues.filter((cue) => {
    const el = doc.querySelector(cue.selector);
    if (!el) {
      console.warn(`  ⚠ ${slide.id}: セレクタ不一致 "${cue.selector}"`);
      return false;
    }
    return true;
  });

  return validated;
}

// メイン
const allCues = {};
slides.forEach((slide) => {
  const cues = buildCues(slide);
  allCues[slide.id] = cues;
  console.log(`${slide.id} [${slide.type}]: ${cues.length}キュー`);
  cues.forEach((c, i) => console.log(`  [${i}] ${c.selector} → ${c.label}`));
});

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allCues, null, 2), "utf-8");
console.log(`\n→ ${OUTPUT_PATH}`);
