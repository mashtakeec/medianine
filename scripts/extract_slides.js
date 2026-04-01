/**
 * Phase 1: HTMLスライドからsrcdocを抽出してslides.jsonを生成
 *
 * 引き継ぎドキュメントのget_srcdoc関数をNode.jsに移植
 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

// --- パス設定 ---
const BASE_DIR = path.join(__dirname, "..");
const CURRICULUM_DIR = path.join(BASE_DIR, "研修素材", "松辺式 カリキュラム");
const OUTPUT_PATH = path.join(BASE_DIR, "src", "data", "slides.json");

// HTMLファイルを見つける
const files = fs.readdirSync(CURRICULUM_DIR);
const htmlFile = files.find((f) => f.includes("修正済み") && f.endsWith(".html"));
if (!htmlFile) {
  console.error("修正済みHTMLファイルが見つかりません");
  process.exit(1);
}
const HTML_PATH = path.join(CURRICULUM_DIR, htmlFile);
console.log(`入力: ${htmlFile}`);

// --- HTML Entity デコード (引き継ぎドキュメント準拠) ---
function htmlUnescape(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&apos;/g, "'");
}

// --- srcdoc抽出 (引き継ぎドキュメントのPython関数をJS移植) ---
function getSrcdoc(content, label) {
  const idx = content.indexOf(`<div class="slide-num">${label}`);
  if (idx === -1) return null;

  const srcdocStart = content.indexOf('srcdoc="', idx) + 'srcdoc="'.length;
  const iframeEnd = content.indexOf("</iframe>", srcdocStart);

  const loadingPos = content.indexOf('" loading=', srcdocStart);
  let end;
  if (loadingPos !== -1 && loadingPos < iframeEnd) {
    end = loadingPos;
  } else {
    end = content.lastIndexOf('"', iframeEnd);
  }

  return htmlUnescape(content.substring(srcdocStart, end));
}

// --- テキスト抽出 ---
function extractText(htmlContent) {
  const dom = new JSDOM(htmlContent);
  const doc = dom.window.document;

  const texts = [];

  // タイトル系
  const titleJa = doc.querySelector(".title-ja");
  if (titleJa) texts.push(titleJa.textContent.trim());

  const slideTitle = doc.querySelector(".slide-title");
  if (slideTitle) texts.push(slideTitle.textContent.trim());

  const subtitle = doc.querySelector(".slide-subtitle, .subtitle");
  if (subtitle) texts.push(subtitle.textContent.trim());

  // カード・アイテムのテーマと説明
  doc.querySelectorAll(".ic-theme, .card-title, .reason-title, .point-title").forEach((el) => {
    texts.push(el.textContent.trim());
  });
  doc.querySelectorAll(".ic-desc, .card-desc, .reason-desc, .point-desc").forEach((el) => {
    texts.push(el.textContent.trim());
  });

  // フッター
  const footerText = doc.querySelector(".footer-text, .banner-text, .summary-text");
  if (footerText) texts.push(footerText.textContent.trim());

  // 一般的なテキスト要素（上記で取れなかった場合のフォールバック）
  if (texts.length === 0) {
    doc.querySelectorAll("div, span, li, p, strong").forEach((el) => {
      const t = el.textContent.trim();
      if (t.length > 5 && t.length < 200 && !texts.includes(t)) {
        texts.push(t);
      }
    });
  }

  return [...new Set(texts)].filter((t) => t.length > 0);
}

// --- スライドタイプ分類 ---
function classifyType(htmlContent, label) {
  if (label.includes("表紙") || label.includes("エンディング")) return "cover";
  if (label.includes("PHASE") && label.includes("区切り")) return "phase-divider";
  if (label.includes("章タイトル")) return "lesson-title";
  if (label.includes("この章で学ぶこと") || label.includes("学ぶこと")) return "learning-objectives";
  if (label.includes("まとめ") || label.includes("サマリー")) return "summary";

  // HTMLの構造から判定
  if (htmlContent.includes("phase-num-big") || htmlContent.includes("phase-title-jp")) return "phase-divider";
  if (htmlContent.includes("item-card") && htmlContent.includes("ic-num")) return "learning-objectives";
  if (htmlContent.includes("reason-card") || htmlContent.includes("point-card")) return "content-cards";
  if (htmlContent.includes("summary-card")) return "summary";

  return "content-cards";
}

// --- 章情報を推定 ---
function getChapterInfo(slideNum) {
  if (slideNum <= 4) return { chapter: null, phase: 1 };
  if (slideNum <= 15) return { chapter: "LESSON 1", phase: 1 };
  if (slideNum <= 30) return { chapter: "LESSON 2", phase: 1 };
  if (slideNum <= 31) return { chapter: null, phase: 2 };
  if (slideNum <= 42) return { chapter: "LESSON 3", phase: 2 };
  if (slideNum <= 52) return { chapter: "LESSON 4", phase: 2 };
  if (slideNum <= 62) return { chapter: "LESSON 5", phase: 3 };
  if (slideNum <= 63) return { chapter: null, phase: 3 };
  if (slideNum <= 72) return { chapter: "LESSON 6", phase: 3 };
  if (slideNum <= 85) return { chapter: "LESSON 7", phase: 4 };
  if (slideNum <= 86) return { chapter: null, phase: 4 };
  if (slideNum <= 97) return { chapter: "LESSON 8", phase: 4 };
  return { chapter: null, phase: 4 };
}

// --- メイン処理 ---
function main() {
  console.log("HTMLファイル読み込み中...");
  const content = fs.readFileSync(HTML_PATH, "utf-8");
  console.log(`ファイルサイズ: ${(content.length / 1024).toFixed(0)} KB`);

  const slides = [];

  for (let i = 1; i <= 100; i++) {
    const id = `P${String(i).padStart(2, "0")}`;

    // slide-numラベルを探す（"P01 — 表紙" の形式）
    const labelRegex = new RegExp(`<div class="slide-num">${id} — ([^<]+)</div>`);
    const labelMatch = content.match(labelRegex);
    const title = labelMatch ? labelMatch[1].trim() : `スライド${i}`;

    const srcdoc = getSrcdoc(content, `${id} —`);
    if (!srcdoc) {
      console.warn(`  ${id}: srcdoc抽出失敗、スキップ`);
      continue;
    }

    const { chapter, phase } = getChapterInfo(i);
    const type = classifyType(srcdoc, title);
    const extractedText = extractText(srcdoc);

    slides.push({
      id,
      slideNumber: i,
      title,
      chapter,
      phase,
      type,
      content: srcdoc,
      extractedText,
    });

    console.log(`  ${id}: ${title} [${type}] (${extractedText.length}テキスト)`);
  }

  // 出力
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(slides, null, 2), "utf-8");
  console.log(`\n完了: ${slides.length}スライド → ${OUTPUT_PATH}`);

  // サマリー
  const types = {};
  slides.forEach((s) => {
    types[s.type] = (types[s.type] || 0) + 1;
  });
  console.log("\nタイプ別集計:");
  Object.entries(types).forEach(([k, v]) => console.log(`  ${k}: ${v}枚`));
}

main();
