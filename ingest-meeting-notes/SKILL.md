---
name: ingest-meeting-notes
description: Raw 회의록을 Wiki에 자동 적재합니다. /ingest raw/2026-06-25-온보딩개선회의.md (단일 파일) 또는 /ingest raw/ (전체) 실행 시, D/A/P 항목을 자동 추출하여 wiki 폴더에 생성합니다. CLAUDE.md 규칙과 wiki/스키마.md v1.1을 따릅니다.
---

# Ingest: Raw → Wiki 자동 적재

회의록을 읽고 결정(D)/액션(A)/보류(P) 항목을 자동 추출하여 Wiki에 적재합니다.

## 사용 방법

```bash
/ingest raw/2026-06-25-온보딩개선회의.md    # 단일 파일
/ingest raw/                              # 전체 폴더
```

---

## 실행 절차

### 1단계: 회의록 분석

**메타데이터 추출**:
```yaml
회의일: 2026-06-25
참석: 이지혜(PM), 박준서(개발)
```

**섹션 파싱** (아래 중 찾이는 것들):
- `## 결정` 또는 명시적 결정문 → D-xxx
- `## 액션 아이템` 또는 `- [ ] 이름 — 할일` → A-xxx
- `## 기타` 또는 담당자/기한 없는 항목 → P-xxx

### 2단계: 항목 분류 및 ID 할당

| 분류 | 조건 | 예시 |
|------|------|------|
| **D-xxx** | 명시적 결정, 의사결정자 명확 | "A안 채택했다" |
| **A-xxx** | 담당자 명확 + 기한 (대부분) | "박준서 ~ 스펙 작성 (~6/30)" |
| **P-xxx** | 담당자 미정 OR 기한 없음 | "~확인 필요" (담당자 없음) |

**ID 결정** (기존 파일 확인):
- 마지막 D 파일이 D-007 → 새 항목은 D-008
- 마지막 A 파일이 A-007 → 새 항목은 A-008

### 3단계: Status 결정 (스키마 v1.1)

**Decision**: open | closed | pending | pending_implementation | in_progress | unclear | at_risk

**Action**: open | in_progress | completed | blocked | on_hold | at_risk | untracked

**Pending**: pending | stalled | escalated

**규칙**:
- 회의에서 "~했다" = 완료 → `completed` (A) 또는 `closed` (D)
- "~할 예정" = 아직 안 함 → `open` (A) 또는 `pending_implementation` (D)
- "~가 필요" (담당자/기한 미정) = 보류 → `P-xxx`

### 4단계: Wiki 파일 생성

**최소 구조** (각 유형별):

**D-xxx.md**:
```yaml
---
id: D-008
source: raw/2026-06-25-온보딩개선회의.md
title: "의사결정 제목"
owner: 의사결정자명
status: pending_implementation
created_date: 2026-06-25
---

## 내용
1-2문장 요약

## 배경
왜 이 결정이 필요했는가?

## 의사결정 세부사항
- 의사결정자: 
- 근거:
- 날짜: 2026-06-25

## 현재 상태
- 진행 여부:
- 마지막 업데이트:

## 선행 조건
(필요시)

## 연관 항목
- [[A-008]]: ...
```

**A-xxx.md**:
```yaml
---
id: A-008
source: raw/2026-06-25-온보딩개선회의.md
title: "할일 제목"
owner: 담당자명
status: open
created_date: 2026-06-25
due_date: 2026-06-30
---

## 액션 내용
구체적으로 무엇을 해야 하는가?

## 기한
- 할당일: 2026-06-25
- 기한: 2026-06-30

## 진행 상황
- 현재: 미시작 / 진행 중 / 완료
- 마지막 업데이트:

## 연관 항목
- [[D-008]]: ...
```

**P-xxx.md**:
```yaml
---
id: P-001
source: raw/2026-06-25-온보딩개선회의.md
title: "미해결 사항"
owner: unassigned
status: pending
created_date: 2026-06-25
---

## 문제 설명
무엇이 미해결되었는가?

## 현재 상태
- 담당자: unassigned
- 기한: 미정
```

### 5단계: 문제 감지 및 리포트

**자동 감지** (CLAUDE.md 기반):

| 문제 | 대응 |
|------|------|
| A-xxx인데 owner 없음 | P-xxx로 전환 제안 |
| A-xxx인데 due_date 없음 | P-xxx로 전환 제안 |
| 다중 회의 항목 | "상태 변화" 섹션 추가 |
| 리소스 충돌 감지 | "리소스/의존성" 섹션 필수 표시 |

**출력 예시**:
```
✅ ingest 완료: raw/2026-06-25-온보딩개선회의.md

📊 생성된 항목 (3개):
  ✓ D-008: 온보딩 개선 (owner: 이지혜)
  ✓ A-008: 축소 화면 최종안 (owner: 최민아, due: 2026-06-30)
  ✓ A-009: 전환 로깅 추가 (owner: 박준서, due: 2026-06-30)

⚠️ 감지된 문제 (0개):
  (없음)
```

---

## 핵심 규칙

1. **Raw는 절대 수정하지 말 것**
2. **ID는 순증가만 가능** (재사용 금지)
3. **Status는 스키마 v1.1 값만 사용**
4. **담당자 + 기한이 없으면 P-xxx**
5. **source는 항상 명시** (원본 회의록)

---

## 다음 단계

적재 후:
1. `python scripts/check.py` (기계 검증)
2. `/wiki-content-review wiki/` (컨텐츠 검증)

---

**참고**: wiki/스키마.md (상세 필드), CLAUDE.md (운영 규칙)
