# EY보컬스튜디오 Google Search Console 등록 가이드

대상 사이트:
- 현재 기본 주소: `https://ey-vocal-homepage.vercel.app/`
- 커스텀 도메인 연결 후에는 대표 도메인 기준으로 다시 점검

## 1. 등록 전에 준비할 것

- 사이트가 실제로 배포되어 있어야 합니다.
- 대표 도메인이 정해져 있어야 합니다.
- `sitemap.xml`, `robots.txt`가 배포본에서 열려야 합니다.

현재 생성 예정 파일:
- `/sitemap.xml`
- `/robots.txt`

## 2. 어떤 속성으로 등록할지 결정

### 옵션 A. URL 접두어 속성

권장 상황:
- 빠르게 등록하고 싶을 때
- HTML 메타태그 방식으로 검증하고 싶을 때

예시:
- `https://ey-vocal-homepage.vercel.app/`
- `https://대표도메인/`

### 옵션 B. 도메인 속성

권장 상황:
- 루트/`www`/서브도메인을 한 번에 관리하고 싶을 때
- DNS 관리자 권한이 있을 때

주의:
- DNS TXT 검증이 필요합니다.

## 3. 가장 쉬운 등록 흐름

1. Google Search Console 접속
2. `속성 추가`
3. 가능하면 최종 대표 도메인으로 등록
4. URL 접두어 또는 도메인 속성 중 하나 선택

권장:
- 커스텀 도메인이 확정되면 그 도메인으로 등록
- 임시로는 `vercel.app` 주소로 먼저 확인 가능

## 4. 소유권 확인 방법

### 방법 A. HTML 메타태그

Search Console이 제공하는 메타태그를 `index.html`의 `<head>`에 넣는 방식입니다.

형태 예시:

```html
<meta name="google-site-verification" content="발급받은_값">
```

주의:
- 실제 값은 Search Console이 발급한 값을 그대로 사용
- 값 발급 전에는 코드에 미리 넣지 않음
- 삽입 후 재배포가 필요할 수 있음

### 방법 B. DNS TXT 레코드

도메인 관리자 화면에서 TXT 레코드를 추가하는 방식입니다.

권장 상황:
- 도메인 속성 등록 시
- 코드 수정 없이 검증하고 싶을 때

## 5. 사이트맵 제출

Search Console 속성 등록이 끝나면 사이트맵을 제출합니다.

제출 경로:
- `https://대표도메인/sitemap.xml`

임시 도메인 사용 시:
- `https://ey-vocal-homepage.vercel.app/sitemap.xml`

중요:
- 커스텀 도메인 연결 후 대표 도메인이 바뀌면 사이트맵 URL도 다시 점검해야 합니다.

## 6. 등록 후 확인할 항목

- URL 검사에서 홈 URL이 정상인지
- 사이트맵 제출 성공 여부
- 색인 생성 상태
- 모바일 사용성 경고 여부

## 7. robots.txt 확인

배포 후 아래 주소가 열려야 합니다.

- `/robots.txt`
- `/sitemap.xml`

`robots.txt`에는 Sitemap 경로가 포함되어 있어야 합니다.

## 8. 네이버 서치어드바이저도 함께 준비할 항목

Search Console과 동일하게 아래를 같이 준비하면 됩니다.

- 대표 도메인 확정
- 사이트맵 URL 확인
- 소유권 확인 수단 확보

## 9. 성표님 체크리스트

- 대표 도메인 기준으로 Search Console 속성 생성
- 메타태그 또는 DNS 방식 중 하나 선택
- 검증 완료
- 사이트맵 제출
- 색인 상태 첫 확인
