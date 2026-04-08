# EY보컬스튜디오 Vercel 자동 배포 조사

대상 프로젝트: `ey-vocal-homepage`

현재 확인 범위:
- Git 원격 저장소는 `https://github.com/eyvocal-web/ey-vocal-homepage.git` 입니다.
- `.vercel/project.json`은 로컬 CLI 연결 상태만 보여주며, GitHub 연동 여부 자체를 증명하지는 않습니다.
- 실제 Vercel 대시보드 변경, 토큰 발급, Deploy Hook 생성은 성표님이 직접 진행해야 합니다.

## 1. 비교 기준

- 봇 워크플로 적합성
- 시크릿 관리 부담
- 실패 가시성과 롤백 편의성
- 정적 사이트 적합도
- 운영 난이도

## 2. 후보 비교

| 방식 | 트리거 | 시크릿 관리 | 실패 가시성 | 롤백/복구 | 정적 사이트 적합도 | 총평 |
|---|---|---|---|---|---|---|
| GitHub 연동 | `main` push | 낮음 | 높음 | 높음 | 매우 높음 | 1순위 |
| Deploy Hook | URL 호출 | 중간 | 중간 | 중간 | 높음 | 2순위 |
| Vercel CLI + 토큰 | 봇 명령 | 높음 | 중간 | 중간 | 높음 | 토큰 부담 큼 |
| GitHub Actions 경유 | 워크플로 실행 | 높음 | 높음 | 높음 | 높음 | 설정 복잡 |
| REST API 직접 호출 | 봇/서버 호출 | 높음 | 중간 | 중간 | 높음 | 직접 구현 부담 |

## 3. 권장안 1순위

### GitHub 연동

권장 이유:
- 정적 사이트 배포 흐름과 가장 자연스럽게 맞습니다.
- 봇은 `main` 브랜치에 코드 반영만 하면 되고, 별도 배포 토큰을 직접 다루지 않아도 됩니다.
- Vercel이 preview/production 배포를 자동으로 구분해 줍니다.

트리거 흐름:
1. 봇이 `codex/*` 브랜치에서 작업합니다.
2. 리뷰 후 `main`에 머지합니다.
3. `main`에 새 커밋이 반영되면 Vercel이 production deployment를 자동 생성합니다.

성표님 확인 항목:
- Vercel 프로젝트가 GitHub 저장소와 연결되어 있는지
- Production Branch가 `main`으로 설정되어 있는지
- 필요한 환경변수가 있다면 Vercel 프로젝트에 등록되어 있는지

## 4. 권장안 2순위

### Deploy Hook

권장 이유:
- GitHub 연동이 안 되어 있어도 바로 붙일 수 있습니다.
- 단순한 `POST` 요청만으로 production 배포를 트리거할 수 있습니다.

주의:
- Hook URL 자체가 배포 권한입니다.
- URL 유출 시 누구나 배포를 트리거할 수 있으므로 비밀값처럼 보관해야 합니다.

트리거 흐름:
1. 성표님이 Vercel에서 Deploy Hook을 생성합니다.
2. Hook URL을 안전한 시크릿 저장소에 넣습니다.
3. 봇 또는 CI가 승인된 시점에 `POST` 요청으로 배포를 호출합니다.

## 5. 비권장 우선순위

### Vercel CLI + 토큰

단점:
- Vercel 토큰을 봇 환경에 안전하게 주입해야 합니다.
- 토큰 범위 관리와 교체 주기를 별도로 운영해야 합니다.
- 단순 정적 사이트 기준으로는 GitHub 연동보다 이점이 적습니다.

### REST API 직접 호출

단점:
- 구현 복잡도만 높고, Deploy Hook 대비 장점이 크지 않습니다.
- 인증 토큰과 요청 스키마까지 직접 관리해야 합니다.

### GitHub Actions 경유

장점:
- 로그와 실패 가시성은 좋습니다.

단점:
- 현재 프로젝트 규모 대비 설정이 과합니다.
- GitHub 시크릿과 Actions 유지보수가 추가됩니다.

## 6. 시크릿 관리 방안

GitHub 연동 1순위 기준:
- 별도 배포 토큰 없이 운영하는 구성이 가장 안전합니다.
- Vercel 프로젝트 환경변수만 성표님이 대시보드에서 직접 관리합니다.

Deploy Hook 2순위 기준:
- Hook URL은 평문 커밋 금지
- GitHub Secrets 또는 로컬 비밀 저장소에만 보관
- 유출 의심 시 즉시 폐기 후 재발급

CLI/API 방식 기준:
- 개인 토큰 대신 프로젝트 범위 최소 권한 토큰 사용 검토
- `.env`, repo 파일, 문서에 직접 기록 금지
- 발급과 회수는 성표님이 직접 수행

## 7. 연결 상태 확인 메모

로컬에서 확인한 항목:
- `git remote -v`는 GitHub 저장소를 가리킵니다.
- `.vercel/project.json`은 Vercel 프로젝트 ID/팀 ID를 가리킵니다.

로컬에서 확인 불가한 항목:
- Vercel 대시보드의 실제 GitHub 연동 여부
- Production Branch 추적 설정
- Deploy Hook 생성 여부

성표님 확인 절차:
1. Vercel 대시보드 → 프로젝트 선택
2. `Settings` → `Git`에서 GitHub 연결 여부 확인
3. `Settings` → `Environments`에서 Production Branch가 `main`인지 확인
4. 필요 시 `Settings` → `Deploy Hooks`에서 Hook 생성

## 8. 봇 권한 흐름

- 코드 반영: 봇 가능
- `main` 머지: 봇 가능 범위로 설계 가능
- Vercel 연결/토큰 발급/Hook 생성: 성표님 직접
- 실제 production deploy 승인: 성표님 정책에 따라 유지

## 9. 현재 권장 결론

- 1순위: GitHub 연동 기반 `main` push 자동 배포
- 2순위: Deploy Hook 기반 수동 승인형 자동 배포

봇 트리거 1줄:
- GitHub 연동이면 `main` 반영 자체가 배포 트리거이고, Hook 방식이면 승인 후 `POST` 한 번으로 배포를 시작하는 구조가 가장 단순합니다.
