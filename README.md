# EY보컬스튜디오 홈페이지

이천 1:1 보컬 레슨 스튜디오의 공식 홈페이지입니다.

## 로컬 실행

빌드 과정 없이 바로 실행할 수 있습니다.

### Python (macOS 기본 탑재)

```bash
cd ey-vocal-homepage
python3 -m http.server 8000
# http://localhost:8000 접속
```

### Node.js

```bash
npx serve .
```

### VS Code

Live Server 확장 설치 → `index.html` 우클릭 → Open with Live Server

## 파일 구조

```
├── index.html          # 메인 페이지 (싱글 페이지)
├── css/
│   ├── reset.css       # CSS 리셋
│   ├── variables.css   # 디자인 토큰 (색상, 간격, 타이포)
│   ├── global.css      # 전역 스타일, 버튼, 유틸리티
│   └── sections.css    # 섹션별 스타일
├── js/
│   └── main.js         # 네비게이션, 스크롤 애니메이션, 라이트박스
├── assets/
│   ├── brand/          # 로고 파일 (PNG, 투명 배경)
│   └── images/         # 스튜디오 사진
└── README.md
```

## 통합된 에셋

### 브랜드 로고 (`assets/brand/`)

| 파일 | 용도 |
|------|------|
| `logo-horizontal-black.png` | 내비게이션 바 로고 (검정) |
| `logo-horizontal-white.png` | 히어로/푸터 로고 (흰색) |
| `logo-icon-black.png` | 파비콘 (검정) |

원본 출처: `디자인 원본파일/PNG (투명배경)/`

### 스튜디오 사진 (`assets/images/`)

스튜디오 실사 사진은 `assets/images/studio/`에 있습니다(2026-09-28·10-07 촬영본, 2026-10 반영). 페이지에서는 `<picture>`로 WebP를 우선 로드하고 JPG를 fallback으로 사용합니다. 가로 사진은 640/1280px, 세로 사진은 480/960px WebP와 JPG 한 장씩입니다.

| 파일 | 원본(바탕화면 `이천 보컬학원 (비사이드단독)/`) | 위치 |
|------|------|------|
| `studio/lesson-room` | 04. 공간_레슨룸 `…녹음 책상·모니터암·에어컨_20251202_캐논28` (최근 컷은 책상 선 정리가 안 돼 교체) | 수업 방식 · 레슨실 |
| `studio/lesson-mic` | 05. 장비 클로즈업 `…슈어 마이크·KRK 스피커_20260928_224555` | 수업 방식 · 레슨실 |
| `studio/lesson-interface` | 05. 장비 클로즈업 `…오디오인터페이스 아폴로 트윈X_20260928_224539` | 수업 방식 · 레슨실 |
| `studio/practice-room` | 08. 공간_연습실 `…연습실4번_책상·모니터·전신거울 전경_20260928_224127` | 수업 방식 · 연습실 |
| `studio/entrance-sign` | 01. 공간_입구·현관 `…교습소 간판 정면_20261007_140308` | 오시는 길 |
| `studio/hallway` | 09. 공간_복도·룸 표지판 `…복도 전경·ROOM 01·04 표지판_20261007_140350` | 오시는 길 |
| `studio/lounge` | 02. 공간_대기실·라운지 `…주간 통창·소파·유리테이블 전경_20261007_135850` (창밖 간판·탁자 위 종이는 흐림 처리) | 체험 예약 |
| `og-image-2026-10.jpg` | `studio/lesson-room` 원본 + 로고 배지, 1200×630 | Open Graph / 공유 썸네일 |

가구 들이기 전(2025-12) 빈 공간 사진(`studio-hero*`)과 어두운 디자인 시절 `og-image.png`는 2026-10에 지웠습니다. 창밖 다른 가게 간판·결제 QR·가사지·수강생 얼굴이 크게 보이는 사진은 쓰지 않습니다.

## 콘텐츠 확정 상태

### 추가 확인 필요

| 항목 | 현재 처리 | 위치 |
|------|-----------|------|
| 지도 시각 자료 | 지도 임베드 없이 주소 + 외부 지도 링크 버튼으로 대체 | `index.html` `.location__map-placeholder[data-placeholder="true"]` |

### 현재 반영 완료

- 강사 섹션: 일반 안내 문구와 현재 이미지 구성을 최종 콘텐츠로 확정
- 대중교통 안내: `이천종합버스터미널 인근입니다. 시내버스를 이용할 수 있습니다.`
- 전화번호: `0507-1377-4624`, `tel:+82-507-1377-4624`
- 주소: `경기도 이천시 어재연로 37 3층`
- 사업자 정보: 대표 `이성표`, 사업자등록번호 `105-92-10088`
- 카카오톡 링크: `https://open.kakao.com/o/seso1YLg`
- 인스타그램 링크: `https://www.instagram.com/eyvocalstudio/`

## index.html 임시 처리 위치

실제 콘텐츠 확정 전까지 아래 요소에 `data-placeholder="true"`를 유지합니다.

- 위치 섹션 지도 플레이스홀더

## 기술 스택

- HTML5 + CSS3 + Vanilla JavaScript
- 외부 프레임워크 없음
- 폰트: Pretendard (`assets/fonts/PretendardVariable.subset.woff2`, self-hosted)
- 애니메이션: IntersectionObserver 기반 (라이브러리 없음)

## 배포

정적 파일만으로 구성되어 어디서든 배포 가능합니다.

- **GitHub Pages**: `main` 브랜치 push 후 Pages 설정
- **Netlify / Vercel**: 레포 연결, 설정 없이 배포
- **일반 웹호스팅**: FTP 업로드

### 새 홈페이지 시안 v16 (Draft)

`codex/apple-redesign-2026-10`은 최신 main에서 칸별 방문 기록기(#7)와 실사 사진 브랜치를 merge한 미리보기입니다. 734px 이하에는 폰 시안, 1069px 이상에는 PC 시안을 적용하고 중간 폭에는 PC 레이아웃과 접이식 메뉴를 씁니다. 화면 원본은 `index.html`·`css/sections.css`이며 JS 기록기는 #7 계약을 유지합니다. 수정 후 `node scripts/build-minified-assets.mjs`로 배포 파일을 갱신합니다.

시험 근거·시안 비교·미리보기 확인 목록은 `/Users/eylocal/Documents/Codex/2026-10-21/새 홈페이지 구현/RESULT.md`와 같은 폴더의 `work/`에 있습니다. main 반영 전에는 Claude의 독립 검토와 #7의 DB 선행 조건 확인이 필요합니다. 이 작업에서는 운영 DB를 조회하거나 변경하지 않았습니다.
