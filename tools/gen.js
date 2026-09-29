const fs = require("fs");
const path = require("path");
const { HANDLE, PILLAR, ROMAN, ITEMS } = require("./data.js");

const PROJECT = "/home/user/my-project";
const CAR_DIR = path.join(PROJECT, "content/carousels");
const REEL_DIR = path.join(__dirname, "reels");
fs.mkdirSync(CAR_DIR, { recursive: true });
fs.mkdirSync(REEL_DIR, { recursive: true });

const markName = HANDLE.replace("@", "");

function reelFrames(it) {
  const p = PILLAR[it.pillar];
  const steps = it.points.filter(x => x.r).slice(0, 3);
  const stepFrames = steps.map((s, i) =>
    `<div class="frame"><div class="step">0${i + 1}</div><div class="big">${s.r}</div></div>`).join("\n");
  return { p, stepFrames };
}

function caption(it) {
  const p = PILLAR[it.pillar];
  const marks = ["①", "②", "③", "④", "⑤"];
  const lines = it.points.map((pt, i) => `${marks[i]} ${pt.c}`).join("\n");
  return `【保存版】${it.capTitle}

${p.intro}

${lines}

${p.close}
▸ 正規品のお取り寄せはプロフィール ${HANDLE} から

※本投稿は一般的な知識の紹介です。`;
}

/* ---------------- CAROUSEL (Google Fonts, 3-part) ---------------- */
function carousel(it) {
  const p = PILLAR[it.pillar];
  const slides = it.points.map((pt, i) => `      <section class="slide">
        <span class="corner c1"></span><span class="corner c2"></span><span class="corner c3"></span><span class="corner c4"></span>
        <div class="eyebrow">Point 0${i + 1}</div><div class="rule"></div><div class="num">${ROMAN[i]}</div>
        <div class="stitle">${pt.t}</div>
        <div class="sbody">${pt.b}</div>
        <div class="spacer"></div><div class="mark"><span class="dot"></span>${markName} ・ ${p.badge}</div>
      </section>`).join("\n");
  const { stepFrames } = reelFrames(it);
  const cap = caption(it);
  return `<title>${it.brand} ${it.sub.replace(/ 編$/, "")}</title>
<meta name="description" content="${it.capTitle} — 保存用カルーセル + ショート動画プレビュー + キャプション（${HANDLE}）">
<style>
:root{--ink:#0B0B0D;--panel:#15151A;--panel-2:#1E1E25;--ivory:#F7F3EC;--body:#EAE3D6;--muted:#C4BCA9;--gold:#D2AC62;--gold-soft:#8A7442;--line:#33333C;
  --font-disp:"Shippori Mincho B1","Noto Serif JP",serif;--font-body:"Noto Sans JP","Noto Serif JP",system-ui,sans-serif;--font-lat:"Cormorant Garamond",Georgia,serif;color-scheme:dark;}
*{box-sizing:border-box}
body{background:var(--ink);color:var(--ivory);font-family:var(--font-body);font-weight:400;line-height:1.7;-webkit-font-smoothing:antialiased}
.wrap{max-width:900px;margin:0 auto;padding-block:40px}.g{padding-inline:16px}
.mast{text-align:center;margin-bottom:14px}.mast .kick{font-family:var(--font-lat);font-style:italic;font-size:1.2rem;color:var(--gold)}
.mast h1{font-family:var(--font-disp);font-weight:800;font-size:1.55rem;letter-spacing:.06em;margin:.3em 0 .2em;text-wrap:balance}.mast p{color:var(--muted);font-size:.86rem;margin:0}
.block{margin-top:34px}.blockhead{display:flex;align-items:center;gap:10px;justify-content:center;margin-bottom:6px}.blockhead .bar{width:26px;height:1px;background:var(--gold)}
.blockhead h2{font-family:var(--font-disp);font-weight:700;font-size:1.05rem;letter-spacing:.16em;margin:0;color:var(--ivory)}.blocksub{text-align:center;color:var(--muted);font-size:.8rem;margin:0 0 14px}
.deck{display:flex;gap:18px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding:8px 16px 6px;scrollbar-width:none}.deck::-webkit-scrollbar{display:none}
.slide{flex:0 0 auto;width:min(90vw,400px);aspect-ratio:4/5;scroll-snap-align:center;background:radial-gradient(130% 105% at 50% -5%,var(--panel-2),var(--panel) 72%);border:1px solid var(--line);border-radius:5px;position:relative;overflow:hidden;padding:36px 32px;display:flex;flex-direction:column;box-shadow:0 26px 64px -34px rgba(0,0,0,.95)}
.slide::before{content:"";position:absolute;inset:14px;border:1px solid rgba(210,172,98,.36);border-radius:3px;pointer-events:none}
.corner{position:absolute;width:15px;height:15px;border:1.5px solid var(--gold);opacity:.85}
.c1{top:14px;left:14px;border-right:0;border-bottom:0}.c2{top:14px;right:14px;border-left:0;border-bottom:0}.c3{bottom:14px;left:14px;border-right:0;border-top:0}.c4{bottom:14px;right:14px;border-left:0;border-top:0}
.eyebrow{font-family:var(--font-lat);font-style:italic;font-size:1.15rem;color:var(--gold);letter-spacing:.05em}
.rule{width:38px;height:1.5px;background:linear-gradient(90deg,var(--gold),transparent);margin:14px 0}
.num{font-family:var(--font-lat);font-size:3.4rem;font-weight:600;color:var(--gold);line-height:1}
.stitle{font-family:var(--font-disp);font-weight:800;font-size:1.6rem;line-height:1.5;letter-spacing:.03em;color:var(--ivory);text-wrap:balance;margin:.1em 0}
.sbody{font-size:1.02rem;color:var(--body);line-height:1.95;margin-top:10px}.spacer{flex:1 1 auto;min-height:12px}
.mark{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:.62rem;letter-spacing:.3em;text-transform:uppercase}.mark .dot{width:3px;height:3px;background:var(--gold);border-radius:50%;flex:0 0 auto}
.cover{justify-content:center;text-align:center}.cover .badge{display:inline-block;border:1px solid var(--gold);color:var(--gold);font-size:.66rem;letter-spacing:.24em;padding:6px 12px;border-radius:2px;margin-bottom:14px}
.cover h3{font-family:var(--font-disp);font-weight:800;font-size:2.05rem;line-height:1.4;color:var(--ivory);margin:.2em 0 .35em;text-wrap:balance}.cover .sub{color:var(--muted);font-size:.95rem}
.cta{justify-content:center;text-align:center}.cta .handle{font-family:var(--font-lat);font-size:1.6rem;color:var(--gold);margin-top:6px}
.cta .save{display:inline-block;margin-top:18px;border:1.5px solid var(--gold);color:var(--ivory);font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;padding:11px 20px;border-radius:2px}
.navrow{display:flex;align-items:center;justify-content:center;gap:16px;margin:20px 0 4px}
.nav{width:44px;height:44px;flex:0 0 auto;border:1.5px solid var(--gold-soft);background:transparent;color:var(--gold);border-radius:50%;font-size:1.3rem;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:var(--font-lat)}
.nav:hover{border-color:var(--gold);background:rgba(210,172,98,.1)}.nav:disabled{opacity:.3;cursor:default}.nav:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
.dots{display:flex;gap:8px}.dots span{width:9px;height:9px;border-radius:50%;background:var(--line);cursor:pointer;transition:all .3s}.dots span.on{background:var(--gold);width:22px;border-radius:4px}
.reelrow{display:flex;gap:24px;justify-content:center;align-items:flex-start;flex-wrap:wrap}
.phone{width:min(78vw,300px);aspect-ratio:9/16;border-radius:22px;border:1px solid var(--line);position:relative;overflow:hidden;background:radial-gradient(120% 80% at 50% 15%,#191921,#0C0C0F 75%);box-shadow:0 30px 70px -34px rgba(0,0,0,.95)}
.reel-frame{position:absolute;inset:14px;border:1px solid rgba(210,172,98,.28);border-radius:14px;pointer-events:none}
.sky span{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;opacity:.25;animation:drift linear infinite}@keyframes drift{from{transform:translate(0,0)}to{transform:translate(-30px,26px)}}
.sweep{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);top:50%;opacity:.5;animation:sweep 4s ease-in-out infinite}@keyframes sweep{0%,100%{transform:translateY(-120px)}50%{transform:translateY(120px)}}
.frame{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;opacity:0;transform:scale(.94);transition:opacity .35s,transform .35s}.frame.on{opacity:1;transform:scale(1)}
.frame .big{font-family:var(--font-disp);font-weight:800;color:var(--ivory);line-height:1.4;letter-spacing:.03em;font-size:1.7rem;text-wrap:balance}
.frame .tag{font-family:var(--font-lat);font-style:italic;color:var(--gold);font-size:1.1rem;margin-bottom:10px}.frame .small{color:var(--muted);font-size:.86rem;margin-top:10px}
.frame .step{font-family:var(--font-lat);color:var(--gold);font-size:2.4rem;line-height:1;margin-bottom:8px}
.progress{position:absolute;left:14px;right:14px;bottom:10px;height:2px;background:rgba(255,255,255,.12);border-radius:2px;overflow:hidden}.progress i{display:block;height:100%;width:0;background:var(--gold)}
.reel-cap{max-width:320px;min-width:0;font-size:.86rem;color:var(--muted);line-height:1.8}.reel-cap b{color:var(--ivory)}
.replay{margin-top:10px;background:transparent;border:1px solid var(--gold-soft);color:var(--gold);font-family:var(--font-lat);font-size:.95rem;padding:7px 16px;border-radius:3px;cursor:pointer}
.caption{margin:30px 16px 0;background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:22px}
.caption h4{font-family:var(--font-disp);font-weight:700;font-size:.76rem;letter-spacing:.24em;text-transform:uppercase;color:var(--gold);margin:0 0 12px}
.caption .txt{white-space:pre-wrap;font-size:.96rem;color:var(--body);line-height:1.95}.caption .tags{margin-top:12px;color:var(--muted);font-size:.88rem;word-break:break-word;line-height:1.8}
.copy{margin-top:16px;background:transparent;border:1.5px solid var(--gold-soft);color:var(--ivory);font-family:var(--font-lat);font-size:1rem;letter-spacing:.1em;padding:9px 18px;border-radius:3px;cursor:pointer}.copy:hover{border-color:var(--gold);background:rgba(210,172,98,.1)}
.note{margin:26px 16px 0;color:var(--muted);font-size:.82rem;line-height:1.8;border-top:1px solid var(--line);padding-top:16px}.note b{color:var(--ivory)}
@media (max-width:440px){.cover h3{font-size:1.7rem}.stitle{font-size:1.42rem}.frame .big{font-size:1.45rem}}
</style>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@500;700&family=Shippori+Mincho+B1:wght@700;800&display=swap">
<div class="wrap g">
  <div class="mast"><div class="kick">Content №${it.id} ・ ${p.badge}</div><h1>${it.capTitle}</h1><p>カルーセル(保存用) ＋ ショート動画(集客用) ＋ キャプション</p></div>
  <div class="block">
    <div class="blockhead"><span class="bar"></span><h2>CAROUSEL</h2><span class="bar"></span></div>
    <p class="blocksub">Instagram 保存用 ・ 1080×1350 ・ 全7枚</p>
    <div class="deck" id="deck">
      <section class="slide cover"><span class="corner c1"></span><span class="corner c2"></span><span class="corner c3"></span><span class="corner c4"></span>
        <div class="badge">保存版 ・ ${p.badge}</div><h3>${p.coverH}</h3><div class="sub">${it.sub} ・ ${p.unit}</div></section>
${slides}
      <section class="slide cta"><span class="corner c1"></span><span class="corner c2"></span><span class="corner c3"></span><span class="corner c4"></span>
        <div class="eyebrow">Save it</div><div class="rule" style="margin-inline:auto"></div>
        <div class="stitle">買う前に、<br>もう一度チェック。</div><div class="sbody" style="color:var(--muted)">保存して、お買い物のお守りに。</div>
        <div class="handle">${HANDLE}</div><div class="save">Save &amp; Follow</div>
        <div class="spacer"></div><div class="mark" style="justify-content:center">正規品はプロフィールのリンクから</div></section>
    </div>
    <div class="navrow"><button class="nav" id="prev" type="button" aria-label="前へ">‹</button><div class="dots" id="dots"></div><button class="nav" id="next" type="button" aria-label="次へ">›</button></div>
  </div>
  <div class="block">
    <div class="blockhead"><span class="bar"></span><h2>SHORT / REEL</h2><span class="bar"></span></div>
    <p class="blocksub">YouTube・TikTok・Reels 集客用 ・ 1080×1920 ・ 約10秒</p>
    <div class="reelrow"><div class="phone" id="phone"><div class="sky" id="sky"></div><div class="sweep"></div><div class="reel-frame"></div>
      <div class="frame"><div class="big">${it.hook}</div></div>
      <div class="frame"><div class="tag">${p.tag}</div><div class="big">${it.reelTitle}</div></div>
${stepFrames}
      <div class="frame"><div class="big">保存して、<br>買う前に。</div><div class="small">${HANDLE}</div></div>
      <div class="progress"><i id="bar"></i></div></div>
      <div class="reel-cap"><p><b>ショート動画の構成案です。</b> この構成でMP4を書き出し済み（content/shorts/${it.id}.mp4）。トレンド音源や実写カットを足すとさらに効果的です。</p>
      <button class="replay" id="replay" type="button">↺ もう一度再生</button></div></div>
  </div>
  <div class="caption"><h4>投稿キャプション</h4><div class="txt" id="cap">${cap}</div>
    <div class="tags">${it.tags}</div><button class="copy" id="copyBtn" type="button">キャプションをコピー</button></div>
  <p class="note"><b>コンプライアンス ✓</b> 特定の販売者を名指ししない一般知識 ・ ブランド公式画像は不使用（オリジナルグラフィック） ・ 販売誘導はプロフィールのみ。 <b>${HANDLE}</b> で統一。</p>
</div>
<script>
(function(){
  var deck=document.getElementById('deck'),slides=deck.querySelectorAll('.slide'),dots=document.getElementById('dots'),prev=document.getElementById('prev'),next=document.getElementById('next'),cur=0;
  slides.forEach(function(_,i){var s=document.createElement('span');if(i===0)s.className='on';s.addEventListener('click',function(){goTo(i);});dots.appendChild(s);});
  var ds=dots.querySelectorAll('span');
  function setA(i){cur=Math.max(0,Math.min(slides.length-1,i));ds.forEach(function(d,j){d.className=j===cur?'on':'';});prev.disabled=cur===0;next.disabled=cur===slides.length-1;}
  function goTo(i){i=Math.max(0,Math.min(slides.length-1,i));var s=slides[i];deck.scrollTo({left:s.offsetLeft-(deck.clientWidth-s.clientWidth)/2,behavior:'smooth'});setA(i);}
  prev.addEventListener('click',function(){goTo(cur-1);});next.addEventListener('click',function(){goTo(cur+1);});
  document.addEventListener('keydown',function(e){if(e.key==='ArrowRight')goTo(cur+1);else if(e.key==='ArrowLeft')goTo(cur-1);});
  var t;deck.addEventListener('scroll',function(){clearTimeout(t);t=setTimeout(function(){var best=0,bd=1e9,mid=deck.scrollLeft+deck.clientWidth/2;slides.forEach(function(s,j){var c=s.offsetLeft+s.clientWidth/2,d=Math.abs(c-mid);if(d<bd){bd=d;best=j;}});setA(best);},60);},{passive:true});setA(0);
  var sky=document.getElementById('sky');for(var k=0;k<26;k++){var s=document.createElement('span');s.style.left=(Math.random()*100)+'%';s.style.top=(Math.random()*100)+'%';s.style.animationDuration=(6+Math.random()*8).toFixed(1)+'s';s.style.animationDelay=(-Math.random()*8).toFixed(1)+'s';if(Math.random()>.7){s.style.width='3px';s.style.height='3px';s.style.opacity='.5';}sky.appendChild(s);}
  var frames=document.querySelectorAll('.frame'),bar=document.getElementById('bar'),step=0,start=0,HOLD=1500,total=frames.length*HOLD;
  function show(i){frames.forEach(function(f,j){f.classList.toggle('on',j===i);});}
  function tick(ts){if(!start)start=ts;var el=ts-start;bar.style.width=Math.min(100,el/total*100)+'%';var idx=Math.floor(el/HOLD);if(idx>=frames.length){show(frames.length-1);return;}if(idx!==step){step=idx;show(step);}requestAnimationFrame(tick);}
  function play(){start=0;step=0;show(0);requestAnimationFrame(tick);}
  document.getElementById('replay').addEventListener('click',play);show(0);setTimeout(play,400);
  var btn=document.getElementById('copyBtn'),cap=document.getElementById('cap');
  btn.addEventListener('click',function(){var text=cap.innerText+"\\n\\n"+document.querySelector('.tags').innerText;function done(){var o=btn.textContent;btn.textContent='コピーしました ✓';setTimeout(function(){btn.textContent=o;},1600);}function sel(){var r=document.createRange();r.selectNodeContents(cap);var s=window.getSelection();s.removeAllRanges();s.addRange(r);done();}try{navigator.clipboard.writeText(text).then(done,sel);}catch(e){sel();}});
})();
</script>`;
}

/* ---------------- VERTICAL REEL for MP4 (local fonts, 1080x1920) ---------------- */
function reel(it) {
  const p = PILLAR[it.pillar];
  const steps = it.points.filter(x => x.r).slice(0, 3);
  const stepFrames = steps.map((s, i) =>
    `<div class="fr"><div class="step">0${i + 1}</div><div class="big">${s.r}</div></div>`).join("\n");
  return `<title>reel ${it.id}</title>
<style>
@font-face{font-family:'MinchoB';src:url('fonts/mincho-800.woff2') format('woff2');font-weight:800;font-display:block}
@font-face{font-family:'MinchoB';src:url('fonts/mincho-700.woff2') format('woff2');font-weight:700;font-display:block}
@font-face{font-family:'NotoJP';src:url('fonts/noto-400.woff2') format('woff2');font-weight:400;font-display:block}
@font-face{font-family:'NotoJP';src:url('fonts/noto-500.woff2') format('woff2');font-weight:500;font-display:block}
@font-face{font-family:'Cormo';src:url('fonts/cormorant-600.woff2') format('woff2');font-weight:600;font-style:normal;font-display:block}
@font-face{font-family:'Cormo';src:url('fonts/cormorant-500i.woff2') format('woff2');font-weight:500;font-style:italic;font-display:block}
:root{--ink:#0B0B0D;--ivory:#F7F3EC;--muted:#C4BCA9;--gold:#D2AC62;color-scheme:dark}
*{margin:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--ink)}
.stage{position:relative;width:1080px;height:1920px;background:radial-gradient(120% 78% at 50% 16%,#191921,#0A0A0D 76%);overflow:hidden}
.gframe{position:absolute;inset:46px;border:2px solid rgba(210,172,98,.30);border-radius:26px;pointer-events:none}
.gcorner{position:absolute;width:54px;height:54px;border:3px solid var(--gold);opacity:.85}
.k1{top:70px;left:70px;border-right:0;border-bottom:0}.k2{top:70px;right:70px;border-left:0;border-bottom:0}
.k3{bottom:70px;left:70px;border-right:0;border-top:0}.k4{bottom:70px;right:70px;border-left:0;border-top:0}
.sky span{position:absolute;width:3px;height:3px;background:#fff;border-radius:50%;opacity:.22;animation:drift linear infinite}
@keyframes drift{from{transform:translate(0,0)}to{transform:translate(-46px,40px)}}
.sweep{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);top:0;opacity:.45;animation:sweep 4.2s ease-in-out infinite}
@keyframes sweep{0%,100%{transform:translateY(430px)}50%{transform:translateY(1490px)}}
.fr{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:150px 110px;opacity:0;transform:scale(.93);transition:opacity .4s ease,transform .5s ease}
.fr.on{opacity:1;transform:scale(1)}
.big{font-family:'MinchoB',serif;font-weight:800;color:var(--ivory);line-height:1.42;letter-spacing:.03em;font-size:104px;text-wrap:balance;text-shadow:0 4px 30px rgba(0,0,0,.6)}
.tag{font-family:'Cormo',serif;font-style:italic;color:var(--gold);font-size:70px;margin-bottom:26px}
.step{font-family:'Cormo',serif;font-weight:600;color:var(--gold);font-size:190px;line-height:1;margin-bottom:20px}
.small{font-family:'Cormo',serif;color:var(--gold);font-size:60px;margin-top:34px;letter-spacing:.04em}
.badge{position:absolute;top:150px;left:0;right:0;text-align:center;font-family:'NotoJP';font-weight:500;color:var(--muted);font-size:34px;letter-spacing:.5em;text-transform:uppercase}
.progress{position:absolute;left:70px;right:70px;bottom:96px;height:5px;background:rgba(255,255,255,.12);border-radius:3px;overflow:hidden}
.progress i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--gold-soft,#8A7442),var(--gold))}
</style>
<div class="stage" id="stage">
  <div class="sky" id="sky"></div><div class="sweep"></div>
  <div class="gframe"></div><span class="gcorner k1"></span><span class="gcorner k2"></span><span class="gcorner k3"></span><span class="gcorner k4"></span>
  <div class="badge">${markName} ・ ${p.badge}</div>
  <div class="fr"><div class="big">${it.hook}</div></div>
  <div class="fr"><div class="tag">${p.tag}</div><div class="big">${it.reelTitle}</div></div>
${stepFrames}
  <div class="fr"><div class="big">保存して、<br>買う前に。</div><div class="small">${HANDLE}</div></div>
  <div class="progress"><i id="bar"></i></div>
</div>
<script>
(function(){
  var sky=document.getElementById('sky');for(var k=0;k<34;k++){var s=document.createElement('span');s.style.left=(Math.random()*100)+'%';s.style.top=(Math.random()*100)+'%';s.style.animationDuration=(7+Math.random()*9).toFixed(1)+'s';s.style.animationDelay=(-Math.random()*9).toFixed(1)+'s';if(Math.random()>.7){s.style.width='4px';s.style.height='4px';s.style.opacity='.45';}sky.appendChild(s);}
  var frames=document.querySelectorAll('.fr'),bar=document.getElementById('bar'),step=-1,start=0,HOLD=1650,total=frames.length*HOLD;
  function show(i){frames.forEach(function(f,j){f.classList.toggle('on',j===i);});}
  function tick(ts){if(!start)start=ts;var el=ts-start;bar.style.width=Math.min(100,el/total*100)+'%';var idx=Math.floor(el/HOLD);if(idx>=frames.length)idx=frames.length-1;if(idx!==step){step=idx;show(step);}if(el<total+300)requestAnimationFrame(tick);}
  window.__done=false;window.__total=total;
  window.startReel=function(){start=0;step=-1;requestAnimationFrame(function r(ts){if(!start)start=ts;var el=ts-start;bar.style.width=Math.min(100,el/total*100)+'%';var idx=Math.floor(el/HOLD);if(idx>=frames.length)idx=frames.length-1;if(idx!==step){step=idx;show(step);}if(el<total+250){requestAnimationFrame(r);}else{window.__done=true;}});};
})();
</script>`;
}

// write files
ITEMS.forEach(it => {
  fs.writeFileSync(path.join(CAR_DIR, `${it.id}_${it.slug}.html`), carousel(it));
  fs.writeFileSync(path.join(REEL_DIR, `${it.id}.html`), reel(it));
});
console.log("generated", ITEMS.length, "carousels ->", CAR_DIR);
console.log("generated", ITEMS.length, "reels ->", REEL_DIR);
