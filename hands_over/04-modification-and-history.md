# 4. 수정/정정 및 History 관리

## 수정의 종류와 처리 방식

| **유형** | **예시** | **처리 방식** | **History 기록** |
|---------|--------|-----------|---------|
| **오기 정정** | 날짜, 이름, 단순 오타 | 즉시 수정 가능 | 선택적 |
| **누락 추가** | 빠진 참석자, 결정사항 | 즉시 추가 가능 | 기록 권장 (minor) |
| **의미 변경** | 결정 번복, 중요 내용 수정 | History 표기 필수 | 필수 (major) |
| **Action 추가/변경** | 새로운 액션, 담당자 변경 | SSOT Maintainer 승인 | 필수 |

## History 기록 방식

### Raw 회의록 내 History 섹션 (선택사항)

**Raw 계층은 원본 형식을 유지하므로, History 메타데이터는 선택사항입니다.**

필요시 아래와 같이 추가 가능:

```markdown
---
출처: Notion
회의일: 2026-08-10
가져온시점: 2026-08-08
참석: 이지혜(PM), 박준서(개발)
history:
  - 2026-08-11: 결정 D-001의 담당자 변경 (이지혜 → 박준서)
  - 2026-08-12: 액션 A-002 완료 표시
---
```

또는 자유로운 텍스트 형식:

```markdown
## 수정 기록
- 2026-08-11 09:30 — 결정 D-001 담당자 수정 (bob)
- 2026-08-12 14:00 — 액션 A-002 상태 업데이트 (alice)
```

### Git Commit 메시지 규칙

**Minor 수정** (오타, 누락):
```
meetings: Fix typo in 2026-08-10 meeting (corrected "Alice" → "alice")
```

**Major 수정** (의미 변경, 중요 결정):
```
meetings: Update 2026-08-10 meeting record (D-001 status change)

- Changed D-001 status from open to closed
- Team agreed to discuss follow-up in next week's sync
- See: history section for full audit trail
```

## 수정 권한 정책

### Raw 회의록 수정
- **누가 수정할 수 있는가**: ssot_maintainers + 관련 Item Owner
- **승인 필요 여부**: major 수정은 SSOT Maintainer 최소 1인 이상 승인
- **예외**: 오타/오기는 즉시 수정 가능

### Wiki Layer 동기화
- Raw 회의록 수정 후 Wiki 데이터가 outdated되면 자동/수동 재생성
- 동기화 주기: 회의 후 24시간 내 완료

## Immutability 정책

**Raw 회의록의 특성:**
- Immutable하지 않음 (수정 가능)
- 하지만 완전히 trackable (모든 변경 기록)
- 과거 기록 삭제 불가능 (Git history 유지)

**원칙:**
- 기록의 신뢰성 > 절대적 불변성
- 팀이 책임지고 유지하는 "canonical record"

## 변경 추적 워크플로우

1. Raw 회의록에서 수정 필요 발견
2. 수정 유형 판단 (minor / major)
3. Major인 경우 SSOT Maintainer에 승인 요청
4. 수정 후 Git commit (history section + commit message)
5. Wiki Layer 재동기화 검토
