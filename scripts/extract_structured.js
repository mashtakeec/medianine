/**
 * 各スライドのHTMLから構造化データを抽出
 * → React コンポーネントで直接レンダリングできる形にする
 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const BASE_DIR = path.join(__dirname, "..");
const SLIDES_PATH = path.join(BASE_DIR, "src", "data", "slides_lesson1.json");
const OUTPUT_PATH = path.join(BASE_DIR, "src", "data", "slides_structured.json");

const slides = JSON.parse(fs.readFileSync(SLIDES_PATH, "utf-8"));

function getText(el) {
  return el ? el.textContent.trim() : "";
}

function getAll(doc, selector) {
  return Array.from(doc.querySelectorAll(selector));
}

function extractSVG(el) {
  const svg = el ? el.querySelector("svg") : null;
  return svg ? svg.outerHTML : null;
}

function extractSlide(slide) {
  const dom = new JSDOM(slide.content);
  const doc = dom.window.document;

  const base = {
    id: slide.id,
    slideNumber: slide.slideNumber,
    title: slide.title,
    chapter: slide.chapter,
    phase: slide.phase,
    type: slide.type,
  };

  switch (slide.type) {
    case "cover":
      return {
        ...base,
        data: {
          titleJa: getText(doc.querySelector(".title-ja")),
          titleEn: getText(doc.querySelector(".title-en")),
          subtitle: getText(doc.querySelector(".subtitle")),
          badge: getText(doc.querySelector(".badge-text")),
        },
      };

    case "lesson-title":
      return {
        ...base,
        data: {
          titleJa: getText(doc.querySelector(".title-ja")),
          titleEn: getText(doc.querySelector(".title-en")),
          subtitle: getText(doc.querySelector(".subtitle")),
          badge: getText(doc.querySelector(".badge-text")),
          lessonNum: getText(doc.querySelector(".lesson-num, .chapter-num")),
        },
      };

    case "phase-divider": {
      const pointCards = getAll(doc, ".point-card").map((card) => ({
        title: getText(card.querySelector(".point-title, .card-title, strong")),
        desc: getText(card.querySelector(".point-desc, .card-desc")),
        items: getAll(card, ".lesson-item").map((li) => getText(li)),
      }));
      // phase番号
      const phaseNum = getText(doc.querySelector(".phase-num, .phase-num-big"));
      const phaseTitle = getText(doc.querySelector(".phase-title-jp"));
      return {
        ...base,
        data: {
          phaseNum: phaseNum || `PHASE ${slide.phase}`,
          phaseTitle,
          pointCards,
          lessonItems: getAll(doc, ".lesson-item").map((li) => getText(li)),
        },
      };
    }

    case "learning-objectives": {
      const itemCards = getAll(doc, ".item-card").map((card, i) => ({
        num: getText(card.querySelector(".ic-num")) || String(i + 1),
        theme: getText(card.querySelector(".ic-theme")),
        desc: getText(card.querySelector(".ic-desc")),
        icon: extractSVG(card.querySelector(".ic-icon")),
      }));
      return {
        ...base,
        data: {
          slideTitle: getText(doc.querySelector(".slide-title")),
          slideSubtitle: getText(doc.querySelector(".slide-subtitle")),
          items: itemCards,
          footerText: getText(doc.querySelector(".footer-banner .footer-text, .footer-banner .banner-text")),
          footerRight: getText(doc.querySelector(".footer-banner .footer-right, .footer-banner .banner-right")),
        },
      };
    }

    case "content-cards": {
      // カード系 (複数パターンに対応)
      const cards = [];

      // .card パターン
      getAll(doc, ".cards-area > *, .card-grid > *").forEach((card) => {
        const stepNum = getText(card.querySelector(".step-num, .card-num"));
        const title = getText(card.querySelector(".card-title, .step-title, strong"));
        const desc = getText(card.querySelector(".card-desc, .step-desc"));
        const icon = extractSVG(card.querySelector(".card-icon, .step-icon"));
        if (title || desc) cards.push({ stepNum, title, desc, icon });
      });

      // .reason-card パターン
      if (cards.length === 0) {
        getAll(doc, ".reason-card").forEach((card) => {
          const title = getText(card.querySelector(".reason-title"));
          const desc = getText(card.querySelector(".reason-desc"));
          const icon = extractSVG(card.querySelector(".reason-icon"));
          if (title || desc) cards.push({ title, desc, icon });
        });
      }

      // .point-card パターン (content-cards内)
      if (cards.length === 0) {
        getAll(doc, ".point-card").forEach((card) => {
          const title = getText(card.querySelector(".point-title"));
          const desc = getText(card.querySelector(".point-desc"));
          if (title || desc) cards.push({ title, desc });
        });
      }

      // .card クラス直接
      if (cards.length === 0) {
        getAll(doc, ".card").forEach((card) => {
          const title = getText(card.querySelector(".card-title, strong, h3, h4"));
          const desc = getText(card.querySelector(".card-desc, p"));
          const icon = extractSVG(card);
          if (title || desc) cards.push({ title, desc, icon });
        });
      }

      // 左右カラムパターン
      const leftCol = doc.querySelector(".left-col");
      const rightCol = doc.querySelector(".right-col");

      // content-area直下の要素
      const contentBlocks = [];
      if (cards.length === 0 && !leftCol) {
        getAll(doc, ".content-area > *").forEach((el) => {
          const text = getText(el);
          const cls = el.className;
          if (text && text.length > 3) {
            contentBlocks.push({
              className: cls,
              html: el.innerHTML,
              text,
            });
          }
        });
      }

      return {
        ...base,
        data: {
          slideTitle: getText(doc.querySelector(".slide-title")),
          slideSubtitle: getText(doc.querySelector(".slide-subtitle")),
          badge: getText(doc.querySelector(".badge-text")),
          cards,
          leftCol: leftCol ? leftCol.innerHTML : null,
          rightCol: rightCol ? rightCol.innerHTML : null,
          leftColText: leftCol ? getText(leftCol) : null,
          rightColText: rightCol ? getText(rightCol) : null,
          contentBlocks,
          footerText: getText(
            doc.querySelector(
              ".footer-banner .footer-text, .footer-banner .banner-text, .bottom-banner .footer-text, .bottom-banner .banner-text"
            )
          ),
          footerRight: getText(
            doc.querySelector(
              ".footer-banner .footer-right, .footer-banner .banner-right, .bottom-banner .footer-right, .bottom-banner .banner-right"
            )
          ),
          footerIcon: extractSVG(
            doc.querySelector(".footer-banner .banner-icon, .bottom-banner .banner-icon")
          ),
        },
      };
    }

    case "summary": {
      const summaryCards = getAll(doc, ".summary-card, .key-point").map((card) => ({
        title: getText(card.querySelector("strong, .summary-title")),
        text: getText(card),
      }));

      return {
        ...base,
        data: {
          slideTitle: getText(doc.querySelector(".slide-title")),
          slideSubtitle: getText(doc.querySelector(".slide-subtitle")),
          leftCol: doc.querySelector(".left-col") ? doc.querySelector(".left-col").innerHTML : null,
          leftColText: doc.querySelector(".left-col") ? getText(doc.querySelector(".left-col")) : null,
          rightCol: doc.querySelector(".right-col") ? doc.querySelector(".right-col").innerHTML : null,
          rightColText: doc.querySelector(".right-col") ? getText(doc.querySelector(".right-col")) : null,
          summaryCards,
          footerText: getText(doc.querySelector(".footer-banner .footer-text, .footer-banner .banner-text")),
          footerRight: getText(doc.querySelector(".footer-banner .footer-right, .footer-banner .banner-right")),
        },
      };
    }

    default:
      return base;
  }
}

const structured = slides.map(extractSlide);

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(structured, null, 2), "utf-8");

// サマリー
structured.forEach((s) => {
  const d = s.data || {};
  const cardCount = d.cards ? d.cards.length : 0;
  const itemCount = d.items ? d.items.length : 0;
  console.log(
    `${s.id} [${s.type}] ${s.title}: cards=${cardCount} items=${itemCount}`
  );
  if (d.cards) {
    d.cards.forEach((c, i) => console.log(`  [${i}] ${c.title || c.stepNum || "(no title)"}`));
  }
  if (d.items) {
    d.items.forEach((it, i) => console.log(`  [${i}] ${it.theme || it.text || "(no theme)"}`));
  }
});
