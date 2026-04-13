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
| `logo-horizontal-white.png` | 히어로/푸터 로고 (흰색) |
| `logo-icon-black.png` | 파비콘 (검정) |

원본 출처: `디자인 원본파일/PNG (투명배경)/`

### 스튜디오 사진 (`assets/images/`)

현재 운영 자산은 히어로 원본/800px 파생본과 OG 이미지로 정리되어 있습니다. 페이지에서는 `<picture>`로 WebP를 우선 로드하고 JPG를 fallback으로 사용합니다.

| 파일 | 원본 | 용도 |
|------|------|------|
| `studio-hero.jpg` | 이천 M보컬학원26.JPG | 히어로 배경 |
| `studio-hero-800.jpg` | `studio-hero.jpg` 리사이즈 | 모바일용 히어로 변형 |
| `og-image.png` | 브랜드 배경 + 로고 합성 | Open Graph / 공유 썸네일 |

원본 출처: `EY보컬스튜디오 사진/`
모든 사진은 웹용으로 리사이즈됨 (히어로 1600px, 모바일 800px).

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
