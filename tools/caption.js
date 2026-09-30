// 각 캐러셀 폴더에 caption.txt 생성(구매 유도 + BUYMA 링크 포함)
const fs = require("fs");
const path = require("path");
const { HANDLE, SHOP_KW, BUYMA_URL, PILLAR, ITEMS } = require("./data.js");

const ROOT = "/home/user/my-project/content/carousels_img";
const marks = ["①", "②", "③", "④", "⑤"];

ITEMS.forEach(it => {
  const p = PILLAR[it.pillar];
  const lines = it.points.map((pt, i) => marks[i] + " " + pt.c).join("\n");
  const cap = `【保存版】${it.capTitle}

${p.intro}

${lines}

${p.close}

▸ 正規品のお取り寄せはこちら
・プロフィールのリンク（${HANDLE}）から
・またはBUYMAで「${SHOP_KW}」を検索
🔗 ${BUYMA_URL}

※本投稿は一般的な知識の紹介です。

${it.tags}
`;
  fs.writeFileSync(path.join(ROOT, `${it.id}_${it.slug}`, "caption.txt"), cap);
});
console.log("caption.txt x", ITEMS.length, "updated (BUYMA link + search)");
