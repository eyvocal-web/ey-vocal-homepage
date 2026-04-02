# EY보컬스튜디오 Homepage — Final Design Direction

> **Design Lead 최종 결정문서**
> 이 문서는 PLAN-IA-UX.md, PLAN-VISUAL.md, TECH-RECOMMENDATION.md, QA-PLAN-REVIEW.md의 모든 모순을 해결하고 빌더가 따라야 할 유일한 기준을 정의합니다.
> Date: 2026-03-20

---

## 1. Audience Priority (타겟 우선순위)

**1차: 입시생 + 학부모** — 이 사이트의 전환 가치가 가장 높은 세그먼트. 모든 디자인/카피 결정에서 이 그룹의 신뢰 확보를 최우선으로 한다.

**2차: 취미 성인 (20~40대)** — 볼륨 확보를 위한 세그먼트. 부담 없는 톤과 명확한 프로그램 안내로 진입장벽을 낮춘다.

**3차: 전문 보컬리스트/유튜버** — 별도의 섹션을 두지 않되, 레슨 프로그램 카드 중 "전문반"으로 커버한다.

**설계 원칙:** 학부모가 자녀 대신 탐색하는 시나리오를 상정하고, 강사 경력·합격 실적·수업 환경이 스크롤 상단부에 노출되도록 한다.

---

## 2. Final Section Order (최종 섹션 순서)

**9개 섹션, 단일 페이지 스크롤.** IA-UX 문서의 9섹션 구조를 canonical로 확정한다. VISUAL/TECH 문서의 7섹션 구조는 폐기.

```
1. NAV (고정 상단)
2. HERO — 관심 끌기 + 1차 CTA
3. ABOUT (스튜디오 소개) — 핵심 가치 3개, 신뢰 시작
4. INSTRUCTOR (강사 프로필) — 전문성 확인, 학부모 신뢰 핵심
5. PROGRAMS (레슨 프로그램) — 입시반/취미반/전문반 카드
6. TESTIMONIALS (수강생 후기) — 사회적 증거
7. GALLERY (시설 갤러리) — 환경 확인
8. LOCATION (위치 & 오시는 길) — 물리적 접근성
9. CONTACT CTA (상담 신청) — 최종 전환
10. FOOTER — 사업자 정보, SNS
+ 플로팅 카카오톡 버튼 (항상 우하단 고정)
```

**결정 근거:** ABOUT과 INSTRUCTOR를 별도 섹션으로 유지한다. 학부모 시나리오에서 강사 프로필은 독립적 신뢰 요소이며 스튜디오 소개에 묻히면 안 된다. LOCATION과 CONTACT CTA도 별도로 유지한다 — 위치 정보는 실용 정보이고, CTA 섹션은 감성적 전환 블록이다. 성격이 다르므로 합치지 않는다.

---

## 3. Final Visual Direction (최종 비주얼 방향)

### 3.1 Color Palette — 확정

| Token | HEX | 용도 |
|-------|-----|------|
| `--color-primary-dark` | `#1A1A2E` | 주요 텍스트, 히어로 배경, 네비 |
| `--color-accent` | `#C8A96E` | CTA 버튼 배경, 강조 보더/아이콘. **텍스트 색상으로 사용 금지** |
| `--color-bg-main` | `#FAF6F0` | 메인 배경 (Soft Cream) |
| `--color-text-secondary` | `#6B6B7B` | 본문 보조 텍스트 (Warm Gray) |
| `--color-bg-card` | `#FFFFFF` | 카드 배경 |
| `--color-bg-alt` | `#F0EBE3` | 교대 섹션 배경 (Light Sand) |
| `--color-accent-secondary` | `#B8868B` | 보조 강조, 호버 (Muted Rose) |

**Gold 사용 규칙 (QA 지적 해결):**
- `#C8A96E`는 **배경색, 보더색, 아이콘색**으로만 사용한다.
- Gold 위의 텍스트는 반드시 `#FFFFFF`(White).
- Cream(`#FAF6F0`) 배경 위에 Gold 텍스트를 절대 쓰지 않는다 (대비율 2.5:1, WCAG AA 미달).
- Gold를 텍스트로 써야 할 경우 반드시 `#1A1A2E` 배경 위에서만 사용한다 (대비율 7.2:1+).

**섹션 배경 교대 패턴:**
```
HERO        → #1A1A2E (다크 그라디언트)
ABOUT       → #FAF6F0 (Cream)
INSTRUCTOR  → #FFFFFF (White)
PROGRAMS    → #FAF6F0 (Cream)
TESTIMONIALS→ #FFFFFF (White)
GALLERY     → #FAF6F0 (Cream)
LOCATION    → #FFFFFF (White)
CONTACT CTA → #1A1A2E (다크, 시선 전환 + 최종 CTA 강조)
FOOTER      → #1A1A2E (다크 연속)
```

### 3.2 Typography — 확정

**Font: Pretendard (self-hosted, Korean subset)**

TECH 문서의 Noto Sans KR 제안을 폐기한다. Pretendard를 최종 서체로 확정.

- 이유: Pretendard가 더 가볍고(subset ~200KB vs Noto Sans KR ~1MB+), CDN 의존성을 피하며, 더 현대적인 글꼴이다.
- Google Fonts CDN 사용하지 않는다. Pretendard woff2 파일을 `assets/fonts/`에 self-host.
- 영문 악센트 서체(Cormorant Garamond)는 **사용하지 않는다**. 단일 서체로 통일하여 로딩 속도와 일관성을 확보한다. 프리미엄 느낌은 서체 혼합이 아닌 여백과 타이포 스케일로 구현한다.

**Type Scale:**
```css
--text-display:  clamp(2rem, 5vw, 3.5rem);    /* Hero 타이틀 */
--text-h1:       clamp(1.75rem, 3.5vw, 2.5rem); /* 섹션 제목 */
--text-h2:       clamp(1.25rem, 2.5vw, 1.75rem); /* 서브 제목 */
--text-h3:       clamp(1.1rem, 2vw, 1.25rem);   /* 카드 제목 */
--text-body:     clamp(0.938rem, 1.5vw, 1rem);   /* 본문 (15~16px) */
--text-small:    0.875rem;                        /* 캡션 */
--text-xs:       0.75rem;                         /* 라벨 */
```

**Line Heights:**
```css
--leading-tight:   1.3;  /* 제목 */
--leading-normal:  1.6;  /* 본문 */
--leading-relaxed: 1.8;  /* 후기 인용문 */
```

**Font Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) — 4개 weight만 로드.

### 3.3 Spacing — 확정

8px 기반. VISUAL 문서의 spacing system을 그대로 사용.

```css
--section-padding-y: clamp(4rem, 8vw, 6rem);  /* 섹션 상하 */
--container-max: 1200px;
--container-padding-x: clamp(1rem, 4vw, 1.5rem);
```

---

## 4. Final UX & CTA Decisions (최종 UX/CTA 결정)

### 4.1 CTA 전략 — 확정

| 위치 | CTA 텍스트 | 스타일 | 연결 대상 |
|------|-----------|--------|----------|
| 히어로 | 무료 상담 신청하기 | Primary 버튼 (Gold bg, White text) | 카카오톡 채널 |
| 프로그램 카드 | 자세히 상담받기 | Secondary 버튼 (Gold border, Gold text on White) | 카카오톡 채널 |
| 플로팅 FAB | 카카오톡 상담 | 원형/둥근 FAB, 우하단 고정 | 카카오톡 채널 |
| CONTACT CTA | 지금 바로 상담하기 | Primary 버튼 (크게, Gold bg) | 카카오톡 채널 |
| 네비게이션 | 상담 신청 | Primary 버튼 (작게) | #contact 앵커 스크롤 |

**카카오톡 연결 방식 (QA 지적 해결):**
- 카카오톡 채널 URL 링크 (`https://pf.kakao.com/XXXXX`)를 사용한다.
- JS SDK 플러그인은 사용하지 않는다 (외부 의존성 금지 원칙).
- 버튼 클릭 시 새 탭에서 카카오톡 채널 페이지로 이동. 모바일에서는 카카오톡 앱이 자동 실행된다.

**전화 CTA:**
- CONTACT CTA 섹션에 전화번호를 `tel:` 링크로 노출.
- 운영시간 함께 표기.

### 4.2 Navigation — 확정

**데스크톱 (≥1024px):**
- 상단 고정(sticky), 높이 72px
- 좌: 로고 ("EY보컬스튜디오")
- 우: 소개 | 강사 | 레슨 | 후기 | 위치 | **[상담 신청]** (Primary 버튼)
- 초기 배경 transparent → 스크롤 시 `rgba(250,246,240,0.95)` + `backdrop-filter: blur(12px)`

**모바일/태블릿 (<1024px):**
- 좌: 로고, 우: 햄버거 아이콘
- 햄버거 클릭 → 풀스크린 오버레이 (Dark 배경 `#1A1A2E`)
- 메뉴 항목 세로 나열, 하단에 CTA 버튼
- 키보드 접근성: `Enter`/`Space` 토글, `Escape` 닫기, 포커스 트랩

### 4.3 폼 — 사용하지 않음

VISUAL 문서의 폼 요소 스펙(Section 5.5)은 **폐기한다**. 전환 채널은 카카오톡과 전화 두 가지만 사용. 별도 문의 폼은 만들지 않는다. (QA 지적 해결)

### 4.4 플로팅 카카오톡 버튼

- 우하단 고정, `position: fixed`
- 하단에서 24px, 우측에서 24px
- 둥근 모서리 (`border-radius: 50px`)
- Gold 배경 + 카카오톡 아이콘(SVG) + "상담하기" 텍스트
- 모바일에서는 아이콘만 표시 (공간 절약), 48x48px 이상 터치 타겟
- 히어로 섹션에서는 숨김 (히어로 자체에 CTA 있으므로 중복 방지)
- 스크롤 100vh 이후 페이드인

---

## 5. Concrete Homepage Content Structure (구체적 콘텐츠 구조)

### Section 1: NAV
```
[EY보컬스튜디오 로고]     소개 | 강사 | 레슨 | 후기 | 위치     [상담 신청]
```

### Section 2: HERO
- **배경:** 스튜디오 내부 또는 레슨 장면 사진 (없으면 `#1A1A2E` → `#2D2D44` 그라디언트 + 사운드 웨이브 SVG 패턴)
- **오버레이:** `rgba(26, 26, 46, 0.55)` (사진 사용 시)
- **헤드카피:** "당신의 목소리, 달라질 수 있습니다" (결과 중심, 감성적)
- **서브카피:** "이천 프리미엄 1:1 보컬 레슨 — EY보컬스튜디오" (지역성 + 차별화)
  - 주의: "이천 유일"은 과장 표현이므로 사용 금지 (톤 가이드 위반, QA 지적 해결)
- **CTA:** `[ 무료 상담 신청하기 ]` — Primary 버튼, 카카오톡 채널 링크
- **레이아웃:** 텍스트 중앙 정렬, 수직 중앙, `min-height: 100svh`

### Section 3: ABOUT (스튜디오 소개)
- **섹션 제목:** "EY보컬스튜디오"
- **소개문:** 2~3문장. 1:1 맞춤 레슨의 가치, 이천 소재, 체계적 커리큘럼.
- **차별점 아이콘 3개:** 가로 배열 (모바일: 세로)
  - 🎤 1:1 맞춤 레슨
  - 📋 체계적 커리큘럼
  - 🎧 녹음 피드백 시스템
- 아이콘은 SVG로 제작, 이모지 사용 금지 (실제 구현 시).

### Section 4: INSTRUCTOR (강사 프로필)
- **레이아웃:** 좌측 사진 + 우측 텍스트 (모바일: 사진 위, 텍스트 아래)
- **구성:**
  - 강사 사진 (원형 또는 둥근 사각형)
  - 이름 + 한 줄 소개
  - 주요 경력 3~5개 (불릿 리스트)
  - [▾ 더 보기] 아코디언 (전체 이력)
- **비고:** 이 섹션은 학부모 신뢰의 핵심. 학력, 지도 실적(합격 실적), 활동 경력을 명확히.

### Section 5: PROGRAMS (레슨 프로그램)
- **섹션 제목:** "레슨 프로그램"
- **카드 3개, 가로 배열 (모바일: 세로 스택)**

| 카드 | 대상 | 주요 내용 | 주 횟수 |
|------|------|----------|---------|
| 입시반 | 입시생 (고2~재수) | 발성 기초, 곡 해석, 실전 연습 | 주 2~3회 |
| 취미반 | 성인 (20~40대) | 발성 교정, 원하는 곡, 자신감 향상 | 주 1~2회 |
| 전문반 | 보컬리스트/유튜버 | 고급 테크닉, 녹음 세션, 퍼포먼스 | 주 1회~ |

- 가격 미표시 → 각 카드 하단 `[ 자세히 상담받기 ]` Secondary 버튼
- 카드 스타일: White 배경, `border-radius: 8px`, 미세 그림자

### Section 6: TESTIMONIALS (수강생 후기)
- **섹션 제목:** "수강생 후기"
- 3~5개 후기 카드
- **카드 구성:** 좌측 Gold 세로선(3px) + 인용문 + 하단 "— 김○○ / 입시반"
- **레이아웃:**
  - 데스크톱: CSS scroll-snap 가로 슬라이더 (JS 라이브러리 없음)
  - 모바일: 세로 스택
- 이름은 이니셜 처리 (개인정보 보호)

### Section 7: GALLERY (시설 갤러리)
- **섹션 제목:** "스튜디오"
- 4~6장 사진, 그리드 레이아웃 (데스크톱 3열, 태블릿 2열, 모바일 2열)
- 클릭 시 라이트박스 확대 (Vanilla JS로 직접 구현)
- `loading="lazy"` 적용

### Section 8: LOCATION (오시는 길)
- **섹션 제목:** "오시는 길"
- **좌측:** 지도 (카카오맵 또는 네이버맵 정적 이미지 + 외부 링크)
  - iframe embed는 사용하지 않음 (성능, 의존성)
  - 클릭 시 카카오맵/네이버맵 앱/웹으로 이동
- **우측:** 주소, 주차 안내, 대중교통 한 줄

### Section 9: CONTACT CTA (상담 신청)
- **배경:** Dark (`#1A1A2E`), 시선 전환 + 긴급성
- **카피:** "지금 바로 무료 상담을 받아보세요."
- **CTA 버튼:** `[ 카카오톡으로 상담하기 ]` — Primary 버튼 (Gold)
- **전화:** 📞 031-XXX-XXXX (`tel:` 링크)
- **운영시간:** 평일 10:00~21:00 / 토 10:00~18:00

### Section 10: FOOTER
- 배경: `#1A1A2E` (CONTACT과 연속)
- 상호명, 대표자, 사업자등록번호, 주소
- Instagram / YouTube 아이콘 링크
- © 2026 EY보컬스튜디오. All rights reserved.

---

## 6. Must-Have Components (필수 구현 컴포넌트)

빌더가 반드시 구현해야 하는 컴포넌트 목록. 우선순위 순.

### Critical (없으면 사이트 기능 불가)
1. **Sticky Navigation** — 로고, 섹션 앵커 링크, CTA 버튼, 모바일 햄버거
2. **Hero Section** — 풀스크린, 오버레이 텍스트, Primary CTA
3. **Floating KakaoTalk FAB** — `position: fixed`, 100vh 이후 표시
4. **Program Cards** — 3개 카드, 반응형 그리드
5. **Contact CTA Block** — 카카오톡 버튼 + 전화 링크

### Important (없으면 신뢰/전환 저하)
6. **Instructor Profile** — 사진 + 경력 + 아코디언
7. **Testimonial Cards** — 최소 3개, Gold 세로선 스타일
8. **Gallery Grid + Lightbox** — 4~6장, 클릭 확대
9. **Location Section** — 지도 이미지 + 주소 정보
10. **Skip Link** — "본문 바로가기" (접근성)

### Enhancement (출시 후 추가 가능)
11. **SEO Meta Tags** — title, description, OG tags, JSON-LD LocalBusiness
12. **Analytics** — GA4 또는 경량 대안 (Plausible)
13. **Favicon + OG Image** — 512x512 favicon, 1200x630 OG image

---

## 7. Animation Rules (애니메이션 규칙)

### 원칙
1. **의미 있는 모션만.** 장식적 애니메이션 금지. 모든 애니메이션은 사용자의 시선을 유도하거나 상태 변화를 전달해야 한다.
2. **GPU 속성만 애니메이트.** `transform`과 `opacity`만 사용. `width`, `height`, `margin`, `top` 등은 애니메이트하지 않는다.
3. **`prefers-reduced-motion` 필수 존중.** 해당 미디어쿼리 활성 시 모든 animation/transition을 `none`으로.

### 구현 방식 — AOS 사용 금지 (최종 결정)

**외부 라이브러리를 사용하지 않는다.** AOS(14KB)를 폐기하고 Vanilla IntersectionObserver 래퍼를 직접 작성한다 (~20줄). "외부 의존성 없음" 원칙을 관철한다.

```javascript
// 구현 참고 (animations.js)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
```

CSS에서 `.is-visible` 클래스로 트랜지션을 처리한다.

### 구체적 애니메이션 목록

| 요소 | 효과 | 트리거 | duration | easing |
|------|------|--------|----------|--------|
| 섹션 제목 | fade-up (opacity + translateY 20px→0) | 스크롤 진입 | 0.6s | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| 카드 (프로그램, 후기) | staggered fade-up (형제 간 0.1s 딜레이) | 스크롤 진입 | 0.6s | 동일 |
| 히어로 텍스트 | 순차 페이드인 (제목→부제→CTA, 각 0.15s 간격) | 페이지 로드 | 0.6s | 동일 |
| 네비게이션 배경 | opacity 0→1 | 스크롤 (>50px) | 0.3s | ease |
| 버튼 호버 | translateY(-2px) + shadow 강화 | hover/focus | 0.3s | ease |
| 플로팅 FAB | fade-in | 스크롤 (>100vh) | 0.3s | ease |
| 모바일 메뉴 | 오버레이 fade-in | 토글 | 0.3s | ease |
| 갤러리 이미지 | fade-in | lazy load 완료 | 0.4s | ease |

**히어로 애니메이션은 CSS-only로 구현한다** (QA 지적 해결). `@keyframes`와 `animation-delay`로 순차 페이드인을 처리하여 JS 의존성을 제거한다.

### Easing 함수
```css
--ease-out:    cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
```

`ease-spring` (바운스)는 사용하지 않는다. 프리미엄 톤에 바운스는 어울리지 않음.

---

## 8. Implementation Guidance (빌더 구현 지침)

### 8.1 기술 스택 — 최종 확정

| 항목 | 결정 |
|------|------|
| Stack | Vanilla HTML + CSS + JS |
| 외부 의존성 | **제로. CDN 포함 없음.** |
| Font | Pretendard self-hosted (woff2, 400/500/600/700) |
| 빌드 도구 | 없음. 파일 편집 → 브라우저 새로고침 |
| 배포 | GitHub Pages, Netlify, 또는 아무 정적 호스팅 |

### 8.2 파일 구조

```
ey-vocal-homepage/
├── index.html
├── css/
│   ├── reset.css         # box-sizing, margin 리셋
│   ├── variables.css     # 모든 CSS custom properties (색상, 간격, 폰트, easing)
│   ├── global.css        # 기본 타이포, 유틸리티, 공통 컴포넌트 (버튼, 카드)
│   └── sections.css      # 섹션별 스타일 (hero, about, instructor, ...)
├── js/
│   └── main.js           # 네비 토글, 스무스 스크롤, 라이트박스, 스크롤 애니메이션, FAB 표시
├── assets/
│   ├── images/           # WebP + JPEG fallback, srcset 적용
│   ├── icons/            # SVG (인라인 또는 스프라이트)
│   └── fonts/            # Pretendard woff2 파일
└── favicon.ico
```

**JS 파일은 1개로 통합한다.** animations.js를 별도로 두지 않는다. IntersectionObserver 코드가 20줄 미만이므로 main.js에 포함한다.

### 8.3 Breakpoints — 최종 확정

```
Mobile:  0 ~ 639px
Tablet:  640px ~ 1023px
Desktop: 1024px+
```

IA-UX 문서의 768px 제안을 폐기한다. 640px/1024px을 사용한다. (QA 권고 수용)

```css
/* Mobile-first: 기본 스타일은 모바일 */
@media (min-width: 640px)  { /* 태블릿 */ }
@media (min-width: 1024px) { /* 데스크톱 */ }
```

### 8.4 반응형 변화 요약

| 요소 | Mobile (<640) | Tablet (640~1023) | Desktop (1024+) |
|------|--------------|-------------------|-----------------|
| 네비게이션 | 햄버거 메뉴 | 햄버거 메뉴 | 수평 메뉴 |
| 히어로 타이틀 | 2rem | 2.75rem | 3.5rem |
| 섹션 패딩 | 64px | 80px | 96px |
| 프로그램 카드 | 1열 세로 | 2열 | 3열 |
| 갤러리 그리드 | 2열 | 2열 | 3열 |
| 강사 프로필 | 세로 (사진→텍스트) | 가로 (사진 좌·텍스트 우) | 가로 |
| 본문 크기 | 15px | 16px | 16px |
| 컨테이너 패딩 | 16px | 24px | 24px |

### 8.5 HTML 마크업 규칙

- `<html lang="ko">`
- 시맨틱 태그 필수: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- 각 섹션에 `id` 부여 (네비 앵커 링크용): `#about`, `#instructor`, `#programs`, `#testimonials`, `#gallery`, `#location`, `#contact`
- 헤딩 계층: `<h1>` 히어로 타이틀 (1개만), 나머지 섹션 제목은 `<h2>`, 카드 내부는 `<h3>`
- 이미지: `<picture>` + `srcset` + `loading="lazy"` (히어로 제외) + 한국어 `alt` 텍스트
- Skip link: `<a href="#main" class="skip-link">본문 바로가기</a>` — 최상단, focus 시 표시
- `aria-expanded` on 햄버거 버튼
- `aria-label` on 아이콘 전용 버튼

### 8.6 성능 목표

| 항목 | 목표 |
|------|------|
| Lighthouse Performance | 95+ |
| Lighthouse Accessibility | 95+ |
| Lighthouse Best Practices | 95+ |
| Lighthouse SEO | 90+ |
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Total Page Weight | < 500KB (이미지 제외) |

### 8.7 개발 순서

1. `index.html` — 전체 9섹션 시맨틱 마크업
2. `css/reset.css` + `css/variables.css` — 리셋 + 모든 토큰
3. `css/global.css` — 기본 타이포, 버튼, 카드 컴포넌트
4. `css/sections.css` — 섹션별 스타일링, 모바일 퍼스트
5. 반응형 패스 (tablet → desktop 미디어쿼리 추가)
6. `js/main.js` — 네비 토글, 스무스 스크롤, 라이트박스, IntersectionObserver 애니메이션, FAB 로직
7. 접근성 + 성능 감사 (Lighthouse, 키보드 테스트)
8. SEO 메타태그, OG 태그, JSON-LD 추가
9. 실기기 테스트 (iPhone Safari, Android Chrome, Samsung Internet)

### 8.8 콘텐츠 체크리스트 (빌더가 실제 콘텐츠 투입 전 placeholder 사용)

빌더는 아래 항목이 준비될 때까지 placeholder 텍스트/이미지를 사용한다:

- [ ] 강사 프로필 사진
- [ ] 강사 경력/이력 텍스트
- [ ] 수강생 후기 3~5개
- [ ] 스튜디오 사진 4~6장
- [ ] 카카오톡 채널 URL
- [ ] 전화번호
- [ ] 주소 (정확한 도로명)
- [ ] 사업자등록번호
- [ ] 대표자명
- [ ] 운영시간
- [ ] Instagram/YouTube URL (있는 경우)
- [ ] 로고 이미지 또는 텍스트 로고 확정
- [ ] Favicon (512x512)

### 8.9 톤 & 보이스 규칙 (빌더 참고)

- **존칭:** 합쇼체 (ㅂ니다/습니다)
- **문장:** 짧게, 20자 내외
- **금지 표현:** "최고", "독보적", "유일", "대한민국 최고" 등 과장 표현
- **허용 표현:** 구체적 수치/실적 기반 ("○○대 합격 ○명", "레슨 경력 ○년")
- **보컬 용어:** 괄호 설명 병기. 예) 믹스보이스(혼합 발성)
- **지역성:** "이천"을 자연스럽게 노출하되 "이천 유일", "이천 최고" 등은 사용 금지

---

## Appendix: Resolved Contradictions

| # | 모순 | 결정 | 근거 |
|---|------|------|------|
| 1 | 외부 의존성 zero vs AOS + Google Fonts CDN | **Zero 의존성. AOS 폐기, Google Fonts CDN 폐기.** | IA-UX 원칙 관철. IntersectionObserver로 대체 가능. Pretendard self-host. |
| 2 | Pretendard vs Noto Sans KR | **Pretendard self-hosted** | 더 가볍고, CDN 불필요, 더 현대적 |
| 3 | Breakpoint 768px vs 640px | **640px / 1024px** | 640px이 더 많은 태블릿을 커버하며 현대적 관행 |
| 4 | 9섹션 vs 7섹션 | **9섹션 (IA-UX 기준)** | 가장 상세하고, 강사/위치/CTA 분리가 UX적으로 타당 |
| 5 | Lighthouse 90+ vs 95+ | **95+** | 높은 기준 채택 |
| 6 | 히어로 애니메이션 CSS vs JS | **CSS-only (@keyframes + animation-delay)** | JS 불필요, 로드 성능 우수 |
| 7 | 갤러리 "슬라이더" vs CSS scroll-snap | **후기: CSS scroll-snap (데스크톱), 세로 스택 (모바일). 갤러리: 그리드 + 라이트박스** | 후기와 갤러리는 다른 패턴. 후기는 슬라이더, 갤러리는 그리드가 적합. |
| 8 | 폼 스펙 존재 vs 폼 없음 | **폼 없음. 폼 스펙 폐기.** | 전환은 카카오톡/전화만 사용 |
| 9 | "이천 유일" 사용 vs 과장 금지 | **"이천 유일" 사용 금지** | 톤 가이드의 과장 금지 원칙 위반 |
| 10 | Cormorant Garamond 사용 여부 | **사용 안 함. Pretendard 단일 서체** | 외부 폰트 로딩 최소화, 일관성 확보 |

---

*이 문서가 빌더의 유일한 기준입니다. PLAN-IA-UX.md, PLAN-VISUAL.md, TECH-RECOMMENDATION.md와 이 문서가 충돌할 경우, 이 문서를 따르십시오.*
