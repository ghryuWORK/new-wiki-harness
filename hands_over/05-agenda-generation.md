# 5. Agenda 생성 규칙

## Agenda의 정의

**다음 회의의 사전 준비 문서**

- 출처: 여러 raw 회의록에서 추출한 정보
- 목적: 팀이 다음 회의에서 다루어야 할 항목들을 사전에 인지
- 형식: 마크다운 파일 (wiki/회의/ 디렉토리에 배치)

## Agenda 구성 원칙

```markdown
# Agenda: 2026-08-17 Engineering Team Sync

## 1. Carryover from Previous Meetings
(우선순위 높음 - 꼭 다뤄야 할 항목)

### Unresolved Decisions
- [출처] [D-001] Title
  - Status: open (7일 경과)
  - Raw source: meetings/2026-08-10-sync.md#decisions

### Pending Action Items
- [출처] [A-001] Title
  - Owner: bob, Due: 2026-08-12, Status: not completed
  - Raw source: meetings/2026-08-10-sync.md#actions

### Open Questions
- [출처] [Q-001] Title
  - Owner: alice, Status: pending answer
  - Raw source: meetings/2026-08-10-sync.md#questions

## 2. Urgent / Deadline Items
(Due date 기준으로 7일 이내)

## 3. Follow-ups by Explicit Decision
(이전 회의에서 "다음 회의에서 논의하기로 함" 명시된 항목)

## 4. New Agenda Items
(팀 멤버들이 새로 추가한 항목)
```

## Agenda 생성 규칙

### 우선순위 자동 정렬

1. **Unresolved + 오래된 것** (지연 위험)
2. **Pending + 마감 임박** (긴급도)
3. **Open Questions + 블로킹 중인 것** (의존도)
4. **Explicit Follow-ups** (팀 약속)
5. **New Agenda Items** (새로운 안건)

### 정보 추적성 규칙

- **필수**: 각 항목마다 원본 Raw 회의록 링크
- **형식**: `raw/YYYY-MM-DD-회의명.md#{섹션명}`
- **예시**: `raw/2026-04-16-제품주간회의.md#결정`, `raw/2026-06-25-온보딩개선회의.md#액션-아이템`

### 중복 제거 규칙

- 같은 Owner + 유사한 내용 → 최신 것만 표시
- 중복 감지: 여러 회의에 걸친 같은 Action/Decision
- 처리: 최신 상태를 기준으로 통합

### 상태 반영 규칙

- Raw 회의록의 현재 상태를 기준 (Wiki 파생 데이터 아님)
- Agenda 생성 직전 Raw 회의록 최종 확인
- Status 필드 업데이트 확인

## Agenda 생성 워크플로우

### 준비 단계 (회의 일주일 전)
1. 지난 N개 회의의 raw 파일 검토
2. Unresolved Decision 수집
3. Pending Action Item 수집
4. Open Question 수집

### 생성 단계
1. 우선순위순 정렬
2. 중복 제거
3. 원본 링크 추가
4. 새로운 안건 섹션 추가

### 확정 단계 (회의 1~2일 전)
1. SSOT Maintainer 검수
2. Meeting Organizer 최종 승인
3. 팀 공개 (회의 24시간 전)

## Agenda 파일 이름

```
wiki/회의/YYYY-MM-DD-{회의명}.md
예: wiki/회의/2026-08-17-제품주간회의.md
```

## 메타데이터

```yaml
---
회의일: 2026-08-17
제목: "제품 주간회의"
생성기준: ["raw/2026-08-10-제품주간회의.md", "raw/2026-08-03-제품주간회의.md"]
진행자: "이지혜"
상태: "draft" | "finalized"
---
```
