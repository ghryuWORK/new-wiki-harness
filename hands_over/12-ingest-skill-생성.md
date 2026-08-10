---
name: ingest-skill-생성
description: ingest-meeting-notes 스킬 개발 및 테스트 케이스 정의
metadata:
  type: project
---

# Ingest Meeting Notes 스킬 생성

**세션**: 2026-08-10 (최종 단계)  
**담당**: Claude Code (Haiku 4.5) + Skill Creator  
**산출물**: ingest-meeting-notes 스킬 + 테스트 케이스

---

## 🎯 이번 세션 작업

### 1️⃣ ingest-meeting-notes 스킬 생성
프로젝트 루트에 새로운 스킬 폴더 생성

```
new-wiki-harness/
├── CLAUDE.md
├── ingest-meeting-notes/ ← 새로 생성
│   ├── SKILL.md
│   └── evals/
│       └── evals.json
├── raw/
├── wiki/
└── hands_over/
```

### 2️⃣ SKILL.md 작성 완료
**위치**: `ingest-meeting-notes/SKILL.md`

**내용**:
- 목적: Raw 회의록 → Wiki 자동 변환
- 사용 방법: `/ingest raw/YYYY-MM-DD-회의명.md`
- 상세 작동: 7단계 (분석 → 분류 → ID 할당 → Status 결정 → Wiki 생성 → 다중 회의 처리 → 문제 감지)
- 출력 형식: 성공/문제 케이스별 보고서
- 제약사항: Raw 수정 금지, ID 순증가, Status 스키마 v1.1 준수

**크기**: ~350줄 (상세하지만 간결함)

### 3️⃣ 테스트 케이스 3개 정의
**위치**: `ingest-meeting-notes/evals/evals.json`

| # | 이름 | 목적 | 입력 |
|---|------|------|------|
| 1 | 새-회의록-ingest | 기본 기능 | 2026-05-14 회의록 하나 |
| 2 | 재ingest-상태-추적 | 다중 회의 추적 | 같은 회의록 재처리 |
| 3 | 전체-폴더-ingest | 전체 시스템 | raw/ 폴더 전체 (6개 회의) |

### 4️⃣ CLAUDE.md 중복 제거
**변경사항**: W-1 ~ W-6 섹션 제거

- ❌ **제거**: Wiki 항목 관리의 수동 작업 상세 지침
- ✅ **축약**: "ingest 스킬을 호출하세요" 간단 가이드만 남김
- ✅ **리다이렉트**: "스킬의 상세 작동 방식은 SKILL.md 참조"

**역할 분담**:
- **SKILL.md**: ingest 스킬의 구체적 작동 방식
- **CLAUDE.md**: 팀이 따를 운영 원칙 (Raw 기록, 의사결정, Follow-up 등)

---

## 📋 스킬의 핵심 기능

### 1. 회의록 분석
- YAML 메타데이터 추출
- 섹션 파싱 (안건, 결정, 액션, 기타)

### 2. 항목 분류
- Decision (D-xxx): 명시적 결정
- Action (A-xxx): 담당자 + 기한 있음
- Pending (P-xxx): 담당자/기한 미정

### 3. ID 할당
- 자동 순증가 (D-001, D-002, ...)
- 번호 재사용 금지

### 4. Status 결정
- Decision: 7개 상태값
- Action: 7개 상태값
- Pending: 3개 상태값
- 규칙 기반 자동 추론

### 5. Wiki 파일 생성
- D-xxx.md, A-xxx.md, P-xxx.md
- Front Matter + 필수 섹션

### 6. 다중 회의 처리
- 같은 항목의 상태 변화 추적
- "상태 변화" 섹션 자동 추가

### 7. 문제 감지
- 미추적, 블로킹, 리소스 충돌
- CLAUDE.md DO/DON'T 기반

---

## ✨ 스킬의 장점

### 자동화
- Raw 회의록 저장 → `/ingest` 명령 → Wiki 자동 생성
- 수동 작업 0% (템플릿 채우기, ID 관리, 상태 결정 모두 자동)

### 규칙 기반
- CLAUDE.md의 56개 규칙 자동 적용
- wiki/스키마.md v1.1 준수
- 일관성 보장

### 문제 감지
- 미추적 항목 자동 경고
- 리소스 충돌 감지
- 선행 조건 미충족 감지

### 상태 추적
- 다중 회의에 걸친 항목의 변화 자동 기록
- "상태 변화" 섹션으로 이력 관리

---

## 🔄 향후 단계

### 테스트 실행 (다음 세션)
1. **with-skill**: ingest 스킬 사용 (3개 테스트)
2. **without-skill**: 수동 작업 (기준선)
3. **eval-viewer**: 브라우저에서 결과 비교

### 스크립트 추가 (테스트 후)
- 반복되는 작업이 있으면 `scripts/` 추가
- 예: parse_meeting.py, create_wiki_items.py 등

### 설명 최적화 (완성 후)
- 스킬 설명문 최적화
- 트리거 정확도 향상

---

## 📊 현재 프로젝트 상태

### ✅ 완료
- 1차 설계 (01-06 문서)
- 1차 구현 (Wiki 10개 항목)
- 운영 규칙 (CLAUDE.md)
- 스키마 1.1 (wiki/스키마.md)
- ingest 스킬 (SKILL.md + evals)
- hands_over (12개 문서)

### ⏳ 대기 중
- ingest 스킬 테스트 실행
- eval-viewer 결과 검토
- 스킬 개선 (필요시)
- 스킬 설명 최적화

---

## 📝 파일 위치

```
new-wiki-harness/
├── CLAUDE.md (운영 규칙) ✅
├── ingest-meeting-notes/ (스킬) ✅
│   ├── SKILL.md
│   └── evals/evals.json
├── wiki/
│   ├── 스키마.md (v1.1) ✅
│   ├── 스키마-CHANGELOG.md ✅
│   ├── 결정/ (D-001~D-004)
│   ├── 액션아이템/ (A-001~A-005)
│   ├── 보류/ (P-001)
│   └── 회의/ (2026-05-14 요약)
├── raw/ (6개 회의록)
└── hands_over/ (12개 문서) ✅
```

---

**작성일**: 2026-08-10  
**상태**: 스킬 생성 완료 / 테스트 대기  
**다음 담당자**: ingest 스킬 테스트 실행 및 평가
