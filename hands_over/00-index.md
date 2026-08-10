# 회의록 SSOT 하네스 - 1차 설계 핸즈오버

## 📋 문서 목록

### 핵심 개념
- **[01-core-principles.md](01-core-principles.md)**: SSOT 정의, 데이터 계층 구조, 충돌 해결 원칙
  
### 데이터 구조
- **[02-data-structure.md](02-data-structure.md)**: Raw 회의록의 최소 schema (메타데이터, 필수 섹션)
  
### 조직 구조
- **[03-ownership-and-governance.md](03-ownership-and-governance.md)**: Team SSOT Owner vs Item Owner, 역할 정의

### 운영 정책
- **[04-modification-and-history.md](04-modification-and-history.md)**: 수정/정정 방식, History 기록, Git commit 규칙
  
### 아젠다 관리
- **[05-agenda-generation.md](05-agenda-generation.md)**: Agenda 생성 규칙, 우선순위, 워크플로우

### 기술 구조
- **[06-repository-structure.md](06-repository-structure.md)**: 저장소 폴더 구조, 파일 배치, 접근 패턴

### 세션 기록
- **[07-session-log.md](07-session-log.md)**: 세션별 진행 상황, 마일스톤, 다음 단계 추적

---

## 🎯 핵심 요약

### Raw = SSOT
```
raw/ → 원본 회의록만 (팀이 공동 관리, 삭제 불가)
```

### Wiki = 파생물 (통째로 삭제 가능)
```
wiki/
├── 결정/    } 원자 레코드 (1파일 1건)
├── 액션아이템/
├── 보류/
├── 회의/    } 뷰 (레코드에서 조립)
├── 사람/
└── 주제/
```

### Ownership 분리
```
SSOT Owner (팀)      → 회의록 전체의 신뢰성 책임
Item Owner (개인)     → 결정/액션/질문 진행 책임
```

### 수정/변경 추적
```
Raw 회의록 수정 → Git history + 메타데이터 history section
```

### Agenda 생성
```
Raw 회의록 여러 개 → 우선순위 정렬 → Agenda 생성
(미해결 결정, 기한 임박 액션, 오픈 질문 등)
```

---

## 📌 다음 단계

1. **CLAUDE.md 작성**: 전체 운영 원칙 문서화
2. **템플릿 생성**: 회의록, 결정/액션/질문 템플릿
3. **기존 회의록 마이그레이션**: 별도 보유 파일 → raw/ 폴더로 이동
4. **Wiki 자동화 검토**: Raw → Wiki 레코드 추출 자동화 방식 결정
5. **팀 교육**: 사용 가이드 및 운영 정책 공유

---

## 📝 설계 검토 체크리스트

- ✅ Raw 회의록을 SSOT로 정의
- ✅ Derived Data (Wiki)와 SSOT의 경계 명확화
- ✅ Ownership 구조 (Team vs Item) 분리
- ✅ History 추적 및 수정 정책 정의
- ✅ Agenda 생성 규칙 명확화
- ✅ 저장소 구조 설계 (Raw, Wiki 계층)

---

## 📂 파일 위치

모든 문서는 다음 경로에 위치합니다:
```
meetings-ssot/hands_over/
├── 00-index.md
├── 01-core-principles.md
├── 02-data-structure.md
├── 03-ownership-and-governance.md
├── 04-modification-and-history.md
├── 05-agenda-generation.md
└── 06-repository-structure.md
```

---

**작성일**: 2026-08-10  
**상태**: 1차 설계 완료 (구현 전 단계)
