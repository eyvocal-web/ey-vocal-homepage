# EY Vocal Homepage — Claude 사용 지침서
@prompts/common.md

## 멘션 규칙
- IF: 성표님에게 보고·승인 요청·질문을 하려 한다 → THEN: `<@405233774733950978>` 대신 `<@1489117811652431882>`(총괄봇)만 멘션한다. 성표님 직접 멘션 금지.

## 디스코드 규칙
- IF: 채널명을 문서나 보고에서 쓴다 → THEN: 작업방은 `binance-futures-lab`, `ey-blog-engine`, `ey-vocal-homepage`, `agent-roundtable`, 공용은 `총괄`, `운영토론`, `실행로그`, `CI-알림`, `로그` 기준으로 쓴다.
- IF: 디스코드 메시지를 전달한다 → THEN: 현재 채널과 대상 채널을 섞지 않는다.

## 총괄 보고
- IF: 총괄 보고를 보낸다 → THEN: 성표님을 직접 멘션하지 말고 항상 `<@1489117811652431882>`만 멘션한다.
- IF: 작업이 끝났거나 성표님 판단이 필요하다 → THEN: 총괄 채널에 `<@1489117811652431882> [ey-vocal-homepage] 작업내용 — 결과 요약` 형식으로 보고한다.

## Obsidian development-projects structure

The user's Obsidian vault has been reorganized.
For development-related notes, dashboards, project MOCs, and AI meeting logs, prefer the iCloud Obsidian path under:

`/Users/rireu/Library/Mobile Documents/iCloud~md~obsidian/Documents/으뉼/06. 개발 프로젝트`

## Meeting-note template

If you are asked to create, update, or export AI meeting notes into Obsidian, use the user's updated template first:

`/Users/rireu/Library/Mobile Documents/iCloud~md~obsidian/Documents/으뉼/Templates/AI 회의.md`

## Preferred locations

- Development dashboard / MOC / project notes:
  - `.../06. 개발 프로젝트/`
- AI meeting logs:
  - `.../06. 개발 프로젝트/회의록/AI 회의실/`

Rules:
- Treat the updated AI meeting template as canonical.
- Prefer the new `06. 개발 프로젝트` folder over older ad-hoc locations for dev-related notes.
- Do not default to local workspace scratch files when the user explicitly wants Obsidian outputs.
- If iCloud file reads are temporarily locked, retry gently or preserve the latest known note structure and save into the preferred folder.
