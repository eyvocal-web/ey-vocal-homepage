# EY보컬스튜디오 — Visual Design Spec

> 프리미엄하지만 따뜻한 1:1 보컬 레슨 스튜디오의 홈페이지 디자인 방향

---

## 1. Visual Direction (비주얼 방향)

**키워드:** 고급스러움 · 따뜻함 · 신뢰 · 음악적 감성

- 깔끔한 여백 중심의 레이아웃으로 프리미엄 느낌 전달
- 차가운 럭셔리가 아닌, 사람 냄새 나는 따뜻한 고급감
- 음악/보컬이라는 주제를 직접적 아이콘보다 리듬감 있는 레이아웃과 타이포로 표현
- 1:1 레슨의 "개인 맞춤" 가치를 시각적으로 강조 (대비되는 큰 여백 + 집중 요소)

---

## 2. Color Palette (컬러 팔레트)

### Primary

| 이름 | HEX | 용도 |
|------|-----|------|
| Deep Charcoal | `#1A1A2E` | 주요 텍스트, 헤더 배경 |
| Warm Gold | `#C8A96E` | CTA 버튼, 강조 포인트, 로고 악센트 |
| Soft Cream | `#FAF6F0` | 메인 배경색 |

### Secondary

| 이름 | HEX | 용도 |
|------|-----|------|
| Muted Rose | `#B8868B` | 보조 강조, 호버 상태 |
| Warm Gray | `#6B6B7B` | 본문 텍스트, 캡션 |
| Light Sand | `#F0EBE3` | 카드 배경, 섹션 구분 |

### Functional

| 이름 | HEX | 용도 |
|------|-----|------|
| White | `#FFFFFF` | 카드, 오버레이 |
| Success | `#5B8C6A` | 성공 알림 |
| Error | `#C45B5B` | 에러 상태 |

### 그라디언트

- Hero 영역: `linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)`
- Gold 악센트: `linear-gradient(90deg, #C8A96E 0%, #D4B87A 100%)`

---

## 3. Typography (타이포그래피)

시스템 폰트 + Google Fonts 기반 (외부 라이브러리 없이 CSS `@import` 사용).

### 한글 (Primary)

- **제목:** Pretendard (Bold 700, SemiBold 600)
- **본문:** Pretendard (Regular 400, Medium 500)
- 대체: `"Apple SD Gothic Neo", "Malgun Gothic", sans-serif`

### 영문/숫자 (Accent)

- **제목 악센트:** Cormorant Garamond (세리프, 고급 느낌)
- **본문:** Pretendard와 동일 적용

### Type Scale

```
--text-display:  3.5rem  (56px)  — Hero 타이틀
--text-h1:       2.5rem  (40px)  — 섹션 제목
--text-h2:       1.75rem (28px)  — 서브 제목
--text-h3:       1.25rem (20px)  — 카드 제목
--text-body:     1rem    (16px)  — 본문
--text-small:    0.875rem(14px)  — 캡션, 메타
--text-xs:       0.75rem (12px)  — 라벨, 뱃지

--leading-tight:   1.3
--leading-normal:  1.6
--leading-relaxed: 1.8
```

---

## 4. Spacing System (간격 체계)

8px 기반 그리드 시스템.

```
--space-1:   0.25rem  (4px)
--space-2:   0.5rem   (8px)
--space-3:   0.75rem  (12px)
--space-4:   1rem     (16px)
--space-6:   1.5rem   (24px)
--space-8:   2rem     (32px)
--space-10:  2.5rem   (40px)
--space-12:  3rem     (48px)
--space-16:  4rem     (64px)
--space-20:  5rem     (80px)
--space-24:  6rem     (96px)
--space-32:  8rem     (128px)
```

### 섹션 간격

- 섹션 간 상하 패딩: `--space-24` (96px) / 모바일 `--space-16` (64px)
- 컨테이너 최대 너비: `1200px`
- 컨테이너 좌우 패딩: `--space-6` (24px) / 모바일 `--space-4` (16px)

---

## 5. Component Styles (컴포넌트 스타일)

### 5.1 버튼

```
Primary CTA:
  배경: Warm Gold (#C8A96E)
  텍스트: White
  패딩: 16px 40px
  border-radius: 4px
  font-weight: 600
  letter-spacing: 0.02em
  hover: 밝기 +10%, 미세한 위로 이동 (translateY -2px)
  transition: all 0.3s ease

Secondary:
  배경: transparent
  테두리: 1px solid #C8A96E
  텍스트: #C8A96E
  hover: 배경 Gold, 텍스트 White

Ghost (어두운 배경용):
  배경: transparent
  테두리: 1px solid rgba(255,255,255,0.3)
  텍스트: White
  hover: 테두리 White
```

### 5.2 카드

```
배경: #FFFFFF
border-radius: 8px
box-shadow: 0 2px 16px rgba(26, 26, 46, 0.06)
패딩: --space-8 (32px)
hover: shadow 강화, 미세 상승 (translateY -4px)
transition: all 0.4s ease
```

### 5.3 네비게이션

```
배경: transparent → 스크롤 시 Soft Cream + backdrop-blur(12px)
높이: 72px
로고: 왼쪽 정렬
메뉴: 오른쪽 정렬, 수평 배치
CTA 버튼: 메뉴 우측 끝
모바일: 햄버거 메뉴 → 풀스크린 오버레이
```

### 5.4 섹션 구분

```
교대 배경: Soft Cream (#FAF6F0) ↔ White (#FFFFFF)
선택적: 미세한 상단 라인 (1px, Light Sand)
```

### 5.5 폼 요소

```
입력 필드:
  border: 1px solid #E0DCD6
  border-radius: 4px
  패딩: 14px 16px
  focus: border-color → Warm Gold, 미세 glow
  font-size: 16px (모바일 줌 방지)
```

### 5.6 후기/리뷰 카드

```
왼쪽 Gold 세로선 (3px)
이탤릭 인용문
하단: 수강생 이름 + 수강 기간
```

---

## 6. Imagery Direction (이미지 방향)

실제 사진 촬영 또는 고품질 스톡 사용 시 가이드:

- **톤:** 따뜻한 자연광, 약간의 필름 느낌 (살짝 낮은 채도, 웜톤 그레이딩)
- **주제:** 레슨 중인 모습, 마이크/피아노 디테일 샷, 스튜디오 공간
- **구도:** 여백 충분, 피사체 한쪽 정렬 (텍스트 오버레이 공간 확보)
- **인물:** 자연스러운 표정, 과도한 포즈 지양
- **오버레이:** 어두운 이미지 위 텍스트 시 `rgba(26, 26, 46, 0.5)` 오버레이

### 대체 (사진 없을 경우)

- 추상적 사운드 웨이브 SVG 패턴
- 미니멀한 음표/건반 일러스트 (선화 스타일, Gold 색상)
- 그라디언트 배경 + 타이포 중심 레이아웃

---

## 7. Motion & Animation (모션 가이드)

### 원칙

- 과하지 않게, 우아하게
- 의미 있는 모션만 사용 (장식적 애니메이션 지양)
- `prefers-reduced-motion` 미디어 쿼리 존중

### 구체적 모션

```
페이드 인 (스크롤 진입):
  opacity: 0 → 1
  translateY: 20px → 0
  duration: 0.6s
  easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
  stagger: 자식 요소 간 0.1s 딜레이

Hero 텍스트:
  순차적 페이드인 (제목 → 부제 → CTA)
  각 0.15s 간격

네비게이션 스크롤:
  배경 전환: opacity 0 → 1
  duration: 0.3s

버튼 호버:
  transform + shadow 변화
  duration: 0.3s ease

페이지 전환 (SPA 시):
  crossfade, duration: 0.4s
```

### Easing 함수

```
--ease-out:    cubic-bezier(0.25, 0.46, 0.45, 0.94)
--ease-in-out: cubic-bezier(0.42, 0, 0.58, 1)
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)  /* 버튼 바운스 */
```

---

## 8. Responsive Principles (반응형 원칙)

### Breakpoints

```
--bp-mobile:   0 ~ 639px
--bp-tablet:   640px ~ 1023px
--bp-desktop:  1024px ~ 1439px
--bp-wide:     1440px+
```

### 접근법

- **Mobile-first** CSS 작성
- 컨텐츠 우선: 모바일에서 핵심 정보가 먼저 보이도록 구성
- 터치 타겟 최소 44x44px

### 반응형 변화 요약

| 요소 | Mobile | Tablet | Desktop |
|------|--------|--------|---------|
| Hero 타이틀 | 2rem | 2.75rem | 3.5rem |
| 섹션 패딩 | 64px | 80px | 96px |
| 그리드 열 | 1col | 2col | 3col |
| 네비 | 햄버거 | 햄버거 | 수평 메뉴 |
| 카드 | 풀 너비 | 2열 | 3열 |
| 폰트 본문 | 15px | 16px | 16px |

---

## 9. 페이지 섹션 구성 (참고)

1. **Hero** — 풀 화면, 핵심 메시지 + CTA
2. **소개** — 스튜디오/강사 소개
3. **레슨 안내** — 커리큘럼, 1:1 장점
4. **수강 후기** — 리뷰 카드 슬라이더
5. **시설/갤러리** — 스튜디오 사진
6. **상담 신청** — 연락 폼 + 위치 정보
7. **Footer** — 연락처, SNS, 사업자 정보

---

*이 문서는 구현 전 디자인 방향을 정의하는 스펙입니다. 실제 구현 시 CSS custom properties로 토큰화하여 적용합니다.*
