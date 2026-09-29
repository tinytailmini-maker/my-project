const { chromium } = require("playwright");
const ffmpeg = require("ffmpeg-static");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const REEL_DIR = path.join(__dirname, "reels");
const VID_DIR = path.join(__dirname, "video");
const OUT_DIR = "/home/user/my-project/content/shorts";
fs.mkdirSync(VID_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const ids = process.argv.slice(2);
const targets = ids.length ? ids : fs.readdirSync(REEL_DIR).filter(f => f.endsWith(".html")).map(f => f.replace(".html", ""));

const TAIL_MS = 1400; // wait after startReel before closing (holds CTA)
const HOLD_END = 1.1;  // seconds of CTA hold kept in final clip

function durationOf(file) {
  try {
    execFileSync(ffmpeg, ["-i", file], { stdio: ["ignore", "ignore", "pipe"] });
  } catch (e) {
    const s = (e.stderr || "").toString();
    const m = s.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (m) return (+m[1]) * 3600 + (+m[2]) * 60 + parseFloat(m[3]);
  }
  return null;
}

(async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  for (const id of targets) {
    const html = path.join(REEL_DIR, `${id}.html`);
    if (!fs.existsSync(html)) { console.log("skip missing", id); continue; }
    const vdir = path.join(VID_DIR, id);
    fs.mkdirSync(vdir, { recursive: true });
    const ctx = await browser.newContext({
      viewport: { width: 1080, height: 1920 },
      deviceScaleFactor: 1,
      recordVideo: { dir: vdir, size: { width: 1080, height: 1920 } },
    });
    const page = await ctx.newPage();
    await page.goto("file://" + html);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    const total = await page.evaluate(() => { window.startReel(); return window.__total || 9900; });
    await page.waitForTimeout(total + TAIL_MS);
    await page.close();
    await ctx.close(); // finalizes webm
    const webm = fs.readdirSync(vdir).find(f => f.endsWith(".webm"));
    const inPath = path.join(vdir, webm);
    const outPath = path.join(OUT_DIR, `${id}.mp4`);
    const animSec = total / 1000;
    const webmDur = durationOf(inPath) || (animSec + 3);
    // lead-in before animation started = full recording - (animation + tail we waited)
    const ss = Math.max(0, webmDur - animSec - TAIL_MS / 1000);
    const clip = (animSec + HOLD_END).toFixed(2);
    execFileSync(ffmpeg, [
      "-y",
      "-ss", ss.toFixed(3),
      "-i", inPath,
      "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
      "-t", clip,
      "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p",
      "-c:v", "libx264", "-crf", "20", "-preset", "veryfast",
      "-c:a", "aac", "-b:a", "128k", "-shortest",
      "-movflags", "+faststart",
      outPath,
    ], { stdio: "ignore" });
    const kb = Math.round(fs.statSync(outPath).size / 1024);
    console.log(`OK ${id}.mp4  (webm ${webmDur.toFixed(1)}s, ss ${ss.toFixed(2)}, clip ${clip}s, ${kb}KB)`);
  }
  await browser.close();
  console.log("DONE", targets.length, "shorts ->", OUT_DIR);
})().catch(e => { console.error("ERR", e); process.exit(1); });
