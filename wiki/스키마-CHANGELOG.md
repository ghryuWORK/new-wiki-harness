---
title: "Wiki 스키마 CHANGELOG"
description: 스키마 버전 관리 및 변경 이력
---

# Wiki 스키마 CHANGELOG

Wiki 계층의 데이터 구조와 규칙 변경 기록입니다.

---

## [1.0] - 2026-08-10

### ✨ 새로 추가됨 (Initial Release)

#### Front Matter 필드

**Decision (D-xxx)**
- `id`: D-001 형식의 고유 ID
- `source`: Raw 회의록 경로 (단일 또는 다중)
- `title`: 의사결정 제목
- `owner`: 담당자/의사결정자
- `status`: open / closed / pending / unclear / at_risk
- `created_date`: 의사결정 날짜
- `last_modified`: (선택) 마지막 수정 날짜

**Action (A-xxx)**
- `id`: A-001 형식의 고유 ID
- `source`: Raw 회의록 경로
- `title`: 액션 제목
- `owner`: 담당자
- `status`: open / in_progress / completed / blocked / untracked
- `created_date`: 할당 날짜
- `due_date`: 기한
- `completed_date`: (선택) 완료 날짜

**Pending (P-xxx)**
- `id`: P-001 형식의 고유 ID
- `source`: Raw 회의록 경로
- `title`: 보류 사항 제목
- `owner`: 담당자 (unassigned 가능)
- `status`: pending / stalled / escalated
- `created_date`: 기록 날짜

#### 섹션 구조

**Decision 필수 섹션**
- 내용
- 배경
- 의사결정 세부사항
- 현재 상태
- 연관 항목

**Decision 선택 섹션**
- 선행 조건
- 리스크 또는 미흡
- 상태 변화
- 영향도

**Action 필수 섹션**
- 액션 내용
- 기한
- 진행 상황
- 영향도
- 연관 항목

**Action 선택 섹션**
- 배경
- 리스크
- 선행 조건
- 상태 변화

**Pending 필수 섹션**
- 문제 설명
- 배경
- 현재 상태
- 영향도
- 개선 필요

#### 뷰 구조

**회의 뷰** (wiki/회의/YYYY-MM-DD-회의명.md)
- 개요
- 주요 의사결정
- 액션 아이템
- 보류 사항
- 위험도 대시보드
- 연관도

**사람 뷰** (wiki/사람/{이름}.md)
- 담당 의사결정
- 담당 액션
- 보류 중인 것
- 상태 요약

**주제 뷰** (wiki/주제/{주제명}.md)
- 관련 의사결정
- 관련 액션
- 현재 상태
- 타임라인

#### 필드 규칙

**ID 체계**
- Decision: D-001, D-002, ... (같은 타입 내 순증가)
- Action: A-001, A-002, ...
- Pending: P-001, P-002, ...
- 한번 할당되면 변경되지 않음 (재사용 금지)

**Source 필드**
- 단일: `raw/YYYY-MM-DD-회의명.md`
- 다중: `raw/2026-04-16-회의명.md → raw/2026-05-14-회의명.md`

**날짜 형식**
- ISO 8601: YYYY-MM-DD
- 예: 2026-05-14, 2026-08-10

**이모지 규칙**
```
✅ completed / closed
❌ failed / untracked / stalled
🔄 in_progress
⏸️ blocked / on_hold
⏳ pending
🔴 critical / at_risk
❓ unclear
```

#### 변환 규칙

**Decision 추출 기준**
- Raw에서 "~하자", "~로 결정했다", "~로 가자" 표현 찾기
- 명시적인 의사결정이 명확해야 함

**Action 추출 기준**
- Raw에서 명확한 담당자 + 할일 + (암묵적 또는 명시적) 기한이 있는 항목
- "다음 회의까지" 같은 암묵적 기한도 포함

**Pending 추출 기준**
- 결정도 아니고 액션도 아닌 미해결 사항
- 담당자 미정 또는 기한 없음
- 향후 재논의 필요한 것

---

## 변경 이력 템플릿

### [X.Y] - YYYY-MM-DD

#### 🎉 새로 추가됨
- 새로운 필드 추가 시
- 새로운 섹션 추가 시
- 새로운 뷰 타입 추가 시

#### 📝 변경됨
- 기존 필드 수정
- 기존 상태값 변경
- 기존 규칙 변경
- 기존 섹션 이름 변경

#### ⚠️ Breaking Changes
- 마이그레이션 필요한 변경사항
- 기존 파일 수정 필요

#### 🗑️ 제거됨
- 더 이상 사용하지 않는 필드
- 더 이상 사용하지 않는 섹션
- 더 이상 사용하지 않는 상태값

#### 📚 마이그레이션 가이드
기존 파일을 수정해야 할 때 진행 방법

---

## 📋 변경사항 제출 프로세스

### 1단계: 변경 제안
스키마 변경이 필요할 때:
- 무엇을 변경하려고 하는가?
- 왜 변경이 필요한가?
- 어떤 파일들이 영향을 받는가?

### 2단계: 검토
- [ ] 기존 규칙과의 충돌은 없는가?
- [ ] Breaking change인가?
- [ ] 마이그레이션 계획이 있는가?
- [ ] 실제 wiki 파일들에 반영되었는가?

### 3단계: CHANGELOG 기록
- 버전 번호 업데이트
- 변경사항 분류 (추가/변경/제거)
- 마이그레이션 가이드 추가 (필요시)

### 4단계: 팀 공유
- Wiki 정책 회의에서 공유
- 모든 팀원에게 공지
- 실제 적용 시간 설정

---

## 🔍 주요 변경사항 추적

### Decision (D-xxx) 필드 이력

| 필드 | 추가 버전 | 필수 | 설명 |
|------|--------|------|------|
| `id` | 1.0 | ✅ | 고유 ID |
| `source` | 1.0 | ✅ | Raw 출처 |
| `title` | 1.0 | ✅ | 제목 |
| `owner` | 1.0 | ✅ | 담당자 |
| `status` | 1.0 | ✅ | 상태 |
| `created_date` | 1.0 | ✅ | 생성일 |
| `last_modified` | 1.0 | ❌ | 수정일 |

### Action (A-xxx) 필드 이력

| 필드 | 추가 버전 | 필수 | 설명 |
|------|--------|------|------|
| `id` | 1.0 | ✅ | 고유 ID |
| `source` | 1.0 | ✅ | Raw 출처 |
| `title` | 1.0 | ✅ | 제목 |
| `owner` | 1.0 | ✅ | 담당자 |
| `status` | 1.0 | ✅ | 상태 |
| `created_date` | 1.0 | ✅ | 할당일 |
| `due_date` | 1.0 | ✅ | 기한 |
| `completed_date` | 1.0 | ❌ | 완료일 |

### Pending (P-xxx) 필드 이력

| 필드 | 추가 버전 | 필수 | 설명 |
|------|--------|------|------|
| `id` | 1.0 | ✅ | 고유 ID |
| `source` | 1.0 | ✅ | Raw 출처 |
| `title` | 1.0 | ✅ | 제목 |
| `owner` | 1.0 | ✅ | 담당자 |
| `status` | 1.0 | ✅ | 상태 |
| `created_date` | 1.0 | ✅ | 기록일 |

### Status 값 이력

**Decision Status**
| 상태 | 추가 버전 | 의미 |
|------|--------|------|
| open | 1.0 | 진행 중 |
| closed | 1.0 | 완료됨 |
| pending | 1.0 | 대기 중 |
| unclear | 1.0 | 상태 불명 |
| at_risk | 1.0 | 위험 상태 |

**Action Status**
| 상태 | 추가 버전 | 의미 |
|------|--------|------|
| open | 1.0 | 미시작 |
| in_progress | 1.0 | 진행 중 |
| completed | 1.0 | 완료됨 |
| blocked | 1.0 | 블로킹 |
| untracked | 1.0 | 미추적 |

**Pending Status**
| 상태 | 추가 버전 | 의미 |
|------|--------|------|
| pending | 1.0 | 대기 중 |
| stalled | 1.0 | 진행 안 됨 |
| escalated | 1.0 | 상위 보고 |

---

## 🎯 향후 고려 사항

### 잠재적 추가 필드 (아직 1.0에 미포함)

**Decision에 추가될 수 있는 것**
- `priority`: 중요도 (높음/중간/낮음)
- `cost`: 비용 영향
- `timeline`: 예상 기간
- `reviewer`: 검수자

**Action에 추가될 수 있는 것**
- `priority`: 우선순위
- `estimated_hours`: 예상 시간
- `completed_percentage`: 진행률
- `blocker`: 블로킹 원인

**공통으로 추가될 수 있는 것**
- `tags`: 분류 태그 (예: urgent, customer, technical)
- `related_tickets`: Jira/Linear 티켓 연결
- `meeting_url`: 녹화 또는 회의 자료

### 잠재적 변경사항

**Status 값 확대**
- 현재: 5-6개
- 향후: 세분화된 상태 추가 가능

**섹션 표준화**
- 현재: 선택적 섹션 존재
- 향후: 모든 항목이 가져야 할 필수 섹션 재정의

**이모지 규칙 확대**
- 현재: 기본 이모지만 정의
- 향후: 더 세부적인 이모지 규칙

---

## 📞 스키마 변경 요청 양식

스키마 변경이 필요할 때 다음 정보를 제공해주세요:

```
변경 유형: [ ] 새 필드 추가 [ ] 기존 필드 수정 [ ] 필드 제거
대상: [ ] Decision [ ] Action [ ] Pending [ ] Views
필드명 또는 섹션명: 
현재 값/규칙: 
변경 후 값/규칙: 
변경 사유: 
영향받는 wiki 파일 개수: 
마이그레이션 필요: [ ] 네 [ ] 아니오
긴급성: [ ] 높음 [ ] 중간 [ ] 낮음
```

---

**최신 버전**: 1.0  
**마지막 업데이트**: 2026-08-10  
**관리자**: Claude Code
