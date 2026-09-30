const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { ITEMS } = require("./data.js");

const SLIDE_DIR = path.join(__dirname, "slides");
const OUT_ROOT = "/home/user/my-project/content/carousels_img";
fs.mkdirSync(OUT_ROOT, { recursive: true });

const ids = process.argv.slice(2);
const targets = ITEMS.filter(it => !ids.length || ids.includes(it.id));

(async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (const it of targets) {
    const html = path.join(SLIDE_DIR, `${it.id}.html`);
    await page.goto("file://" + html);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    const dir = path.join(OUT_ROOT, `${it.id}_${it.slug}`);
    fs.mkdirSync(dir, { recursive: true });
    const slides = await page.$$(".slide");
    const names = ["01_cover", "02_point1", "03_point2", "04_point3", "05_point4", "06_point5", "07_cta"];
    for (let i = 0; i < slides.length; i++) {
      await slides[i].screenshot({ path: path.join(dir, `${names[i] || ("s" + i)}.png`) });
    }
    console.log(`OK ${it.id} -> ${slides.length} images`);
  }
  await browser.close();
  console.log("DONE", targets.length, "carousels ->", OUT_ROOT);
})().catch(e => { console.error("ERR", e); process.exit(1); });
