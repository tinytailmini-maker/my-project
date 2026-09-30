const fs = require("fs");
const path = require("path");
const { HANDLE, PILLAR, ROMAN, ITEMS } = require("./data.js");

const OUT = path.join(__dirname, "slides");
fs.mkdirSync(OUT, { recursive: true });
const markName = HANDLE.replace("@", "");

const CSS = `
@font-face{font-family:'MinchoB';src:url('../fonts/mincho-800.woff2') format('woff2');font-weight:800;font-display:block}
@font-face{font-family:'MinchoB';src:url('../fonts/mincho-700.woff2') format('woff2');font-weight:700;font-display:block}
@font-face{font-family:'NotoJP';src:url('../fonts/noto-400.woff2') format('woff2');font-weight:400;font-display:block}
@font-face{font-family:'NotoJP';src:url('../fonts/noto-500.woff2') format('woff2');font-weight:500;font-display:block}
@font-face{font-family:'Cormo';src:url('../fonts/cormorant-600.woff2') format('woff2');font-weight:600;font-style:normal;font-display:block}
@font-face{font-family:'Cormo';src:url('../fonts/cormorant-500i.woff2') format('woff2');font-weight:500;font-style:italic;font-display:block}
:root{--ink:#0B0B0D;--panel:#15151A;--panel2:#1E1E25;--ivory:#F7F3EC;--body:#EAE3D6;--muted:#C4BCA9;--gold:#D2AC62;--goldsoft:#8A7442;--line:#33333C}
*{margin:0;box-sizing:border-box}
body{background:#000;font-family:'NotoJP',sans-serif}
/* 안전영역: 위아래 크롭 대비 — 콘텐츠는 padding 안, 프레임은 상하 100px 인셋 */
.slide{position:relative;width:1080px;height:1350px;overflow:hidden;padding:168px 100px;display:flex;flex-direction:column;
  background:radial-gradient(130% 105% at 50% -5%,var(--panel2),var(--panel) 72%);color:var(--ivory)}
.slide::before{content:"";position:absolute;inset:100px 72px;border:1.5px solid rgba(210,172,98,.36);pointer-events:none}
.corner{position:absolute;width:44px;height:44px;border:3px solid var(--gold);opacity:.85}
.c1{top:100px;left:72px;border-right:0;border-bottom:0}.c2{top:100px;right:72px;border-left:0;border-bottom:0}
.c3{bottom:100px;left:72px;border-right:0;border-top:0}.c4{bottom:100px;right:72px;border-left:0;border-top:0}
.eyebrow{font-family:'Cormo',serif;font-style:italic;font-size:52px;color:var(--gold);letter-spacing:.04em}
.rule{width:110px;height:3px;background:linear-gradient(90deg,var(--gold),transparent);margin:34px 0}
.rule.center{margin-left:auto;margin-right:auto}
.num{font-family:'Cormo',serif;font-weight:600;font-size:132px;color:var(--gold);line-height:1}
.stitle{font-family:'MinchoB',serif;font-weight:800;font-size:82px;line-height:1.5;letter-spacing:.03em;color:var(--ivory);margin:.12em 0}
.sbody{font-family:'NotoJP',sans-serif;font-weight:400;font-size:41px;color:var(--body);line-height:1.9;margin-top:24px;max-width:820px}
.spacer{flex:1 1 auto}
.mark{display:flex;align-items:center;gap:14px;color:var(--muted);font-size:25px;letter-spacing:.28em;text-transform:uppercase;font-weight:500}
.mark .dot{width:7px;height:7px;background:var(--gold);border-radius:50%}
.mark.center{justify-content:center}
/* cover */
.cover{align-items:center;justify-content:center;text-align:center}
.badge{border:1.5px solid var(--gold);color:var(--gold);font-size:27px;letter-spacing:.24em;padding:14px 26px;margin-bottom:44px;font-weight:500}
.ch3{font-family:'MinchoB',serif;font-weight:800;font-size:90px;line-height:1.42;color:var(--ivory);margin:.1em 0 .34em;white-space:nowrap}
.csub{color:var(--muted);font-size:34px;letter-spacing:.02em}
/* cta */
.cta{align-items:center;justify-content:center;text-align:center}
.cta .stitle{font-size:78px}
/* 표지 스와이프 안내 */
.swipe{position:absolute;left:0;right:0;bottom:150px;text-align:center}
.swipe span{display:inline-flex;align-items:center;gap:22px;border:1.5px solid var(--goldsoft);border-radius:999px;padding:19px 42px;color:var(--gold);font-family:'NotoJP',sans-serif;font-weight:500;font-size:35px;letter-spacing:.14em}
.swipe .arw{font-family:'NotoJP',sans-serif;font-size:40px;line-height:1}
.handle{font-family:'Cormo',serif;font-size:80px;color:var(--gold);margin-top:20px}
.save{margin-top:40px;border:2px solid var(--gold);color:var(--ivory);font-size:30px;letter-spacing:.24em;padding:22px 40px}
.muted{color:var(--muted)}
`;

function corners() {
  return '<span class="corner c1"></span><span class="corner c2"></span><span class="corner c3"></span><span class="corner c4"></span>';
}

function slidesHTML(it) {
  const p = PILLAR[it.pillar];
  const pts = it.points.map((pt, i) => `<section class="slide">${corners()}
  <div class="eyebrow">Point 0${i + 1}</div><div class="rule"></div><div class="num">${ROMAN[i]}</div>
  <div class="stitle">${pt.t}</div><div class="sbody">${pt.b}</div>
  <div class="spacer"></div><div class="mark"><span class="dot"></span>${markName} ・ ${p.badge}</div></section>`).join("\n");
  return `<title>slides ${it.id}</title><style>${CSS}</style>
<section class="slide cover">${corners()}
  <div class="badge">保存版 ・ ${p.badge}</div><div class="ch3">${p.coverH}</div><div class="csub">${it.sub} ・ ${p.unit}</div>
  <div class="swipe"><span>スワイプでチェック <b class="arw">→</b></span></div></section>
${pts}
<section class="slide cta">${corners()}
  <div class="eyebrow">Save it</div><div class="rule center"></div>
  <div class="stitle">買う前に、<br>もう一度チェック。</div><div class="sbody muted" style="max-width:none">保存して、お買い物のお守りに。</div>
  <div class="handle">${HANDLE}</div><div class="save">SAVE &amp; FOLLOW</div>
  <div class="spacer"></div><div class="mark center">正規品はプロフィールのリンクから</div></section>`;
}

ITEMS.forEach(it => fs.writeFileSync(path.join(OUT, `${it.id}.html`), slidesHTML(it)));
console.log("generated", ITEMS.length, "slide-sheets ->", OUT);
