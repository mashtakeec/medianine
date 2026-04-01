---
name: 区切り線の統一スキル
description: 同一スライド内のセクション間でborder-bottomの有無を揃え、視覚的一貫性を保つ手法
type: feedback
---

あるセクションにある区切り線（border-bottom）が、隣接する別セクションにない場合、揃えて統一する。

**Why:** 同じスライド内で片方のセクションにだけ区切り線があると、視覚的にバランスが悪く見える。デザインの一貫性が崩れる。

**How to apply:**

**既存の区切り線パターンを参考セクションから取得:**
```css
/* 参考: 覚えておくべき3つのこと (.pi) */
.pi {
  padding: 7px 0;
  border-bottom: 1px solid var(--line);
}
.pi:last-child { border-bottom: none; }
```

**同じパターンを対象セクションに適用:**
```css
/* 適用: 短縮できる2つの理由 (.ri) */
.ri {
  padding: 7px 0;
  border-bottom: 1px solid var(--line);
}
.ri:last-child { border-bottom: none; }
```

**セットで調整するもの:**
- 区切り線を追加したら、親の`gap`を`0`にする（gap + border-bottomで間隔が二重になるため）
- 代わりに`justify-content: space-around`で均等配置にする

**ユーザーの指示パターン:**
- 「セクションAの横線をセクションBにも入れて」→ 同じborder-bottomパターンを適用
- 「枠内のバランスが比例していない」→ フォントサイズ調整 + 区切り線統一 + 均等配置のセット
