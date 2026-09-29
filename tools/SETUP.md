# tools — 콘텐츠 생성 파이프라인

`data.js`(콘텐츠 데이터) → `gen.js`(캐러셀+세로릴 HTML) → `rec.js`(릴→MP4 녹화).

## 환경 준비 (컨테이너 1회)
```bash
npm i -g playwright            # 또는 로컬 설치
npm i ffmpeg-static @fontsource/shippori-mincho-b1 @fontsource/noto-sans-jp @fontsource/cormorant-garamond
# fonts/ 폴더에 woff2 배치: mincho-800/700, noto-400/500, cormorant-600/500i
```
Chromium은 컨테이너 프리인스톨(PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers) 사용.

## 실행
```bash
node gen.js                    # content/carousels/*.html + reels/*.html 생성
NODE_PATH=$(npm root -g) node rec.js        # 전체 MP4
NODE_PATH=$(npm root -g) node rec.js 003 007 # 특정 항목만
```

## 새 배치 추가
`data.js`의 ITEMS 배열에 항목 추가(id/slug/pillar/brand/points 5개/reel 3개/caption). 기둥은 PILLAR(P1~P5) 참고.
- 규칙: JS 문자열 안에서 큰따옴표 금지(「」사용), 줄바꿈은 `<br>`.
- 컴플라이언스: 일반지식·공식이미지 미사용·프로필 유도만.
