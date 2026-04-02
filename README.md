# EY보컬스튜디오 홈페이지

이천 소재 프리미엄 1:1 보컬 레슨 스튜디오의 공식 홈페이지입니다.

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
| `logo-horizontal-white.png` | 푸터 로고 (흰색) |
| `logo-stacked-black.png` | OG 이미지, 일반용 (검정) |
| `logo-stacked-white.png` | 히어로 섹션 로고 (흰색) |
| `logo-icon-black.png` | 파비콘 (검정) |
| `logo-icon-white.png` | 다크 배경용 아이콘 |
| `logo-text-black.png` | 텍스트만 (검정) |
| `logo-text-white.png` | 텍스트만 (흰색) |

원본 출처: `디자인 원본파일/PNG (투명배경)/`

### 스튜디오 사진 (`assets/images/`)

| 파일 | 원본 | 용도 |
|------|------|------|
| `studio-hero.jpg` | 이천 M보컬학원26.JPG | 히어로 배경 |
| `studio-lesson-room.jpg` | 이천 M보컬학원20.JPG | 갤러리 — 레슨룸 |
| `studio-production.jpg` | 이천 M보컬학원25.JPG | 갤러리 — 작업실 |
| `studio-equipment.jpg` | 이천 M보컬학원28.JPG | 갤러리 — 장비 |
| `studio-lobby.jpg` | 이천 M보컬학원3.JPG | 갤러리 — 로비 |
| `studio-waiting.jpg` | 이천 M보컬학원30.JPG | 갤러리 — 대기 공간 |
| `studio-corridor.jpg` | 이천 M보컬학원10.JPG | 갤러리 — 복도 |
| `studio-desk.jpg` | 이천 M보컬학원35.JPG | 강사 섹션 이미지 |

원본 출처: `EY보컬스튜디오 사진/`
모든 사진은 웹용으로 리사이즈됨 (갤러리 1200px, 히어로 1920px).

## 남은 플레이스홀더

아래 항목은 실제 정보 확인 후 `index.html`에서 업데이트해야 합니다:

- **강사명** — 강사 섹션 `<h3>대표 강사</h3>` 앞에 이름 추가
- **강사 자격/경력** — 현재 일반적 문구, 실제 이력으로 교체
- **전화번호** — `tel:031-000-0000` 및 표시 텍스트
- **상세 주소** — 경기도 이천시 이후 상세 주소
- **대중교통 정보** — 정류장명, 도보 시간
- **사업자 정보** — 대표명, 사업자등록번호
- **카카오톡 채널 링크** — 상담 버튼 및 플로팅 CTA의 `href="#"`
- **SNS 링크** — 인스타그램, 유튜브 `href="#"`
- **지도** — 카카오맵 또는 네이버 지도 embed 코드
- **강사 사진** — 현재 스튜디오 사진 사용 중, 실제 프로필 사진으로 교체 권장

## 기술 스택

- HTML5 + CSS3 + Vanilla JavaScript
- 외부 프레임워크 없음
- 폰트: Pretendard (CDN) + Cormorant Garamond (Google Fonts)
- 애니메이션: IntersectionObserver 기반 (라이브러리 없음)

## 배포

정적 파일만으로 구성되어 어디서든 배포 가능합니다.

- **GitHub Pages**: `main` 브랜치 push 후 Pages 설정
- **Netlify / Vercel**: 레포 연결, 설정 없이 배포
- **일반 웹호스팅**: FTP 업로드
