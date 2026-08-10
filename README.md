# 회의록 SSOT 하네스

LLM wiki 패턴 기반 회의록 관리 시스템

## 📌 프로젝트 개요

조직의 회의록을 단일 진실 공급원(SSOT: Single Source of Truth)으로 관리하고, 이를 바탕으로 구조화된 wiki를 자동 생성하는 하네스입니다.

## 📂 폴더 구조

```
new-wiki-harness/
├── raw/                    # 원본 회의록 (SSOT)
├── wiki/                   # 파생 데이터 (결정, 액션, 보류 등)
│   ├── 결정/
│   ├── 액션아이템/
│   ├── 보류/
│   ├── 회의/
│   ├── 사람/
│   └── 주제/
├── hands_over/            # 설계 문서 및 핸즈오버 기록
├── .obsidian/             # Obsidian 설정
└── README.md              # 이 파일
```

## 🎯 핵심 원칙

- **Raw = SSOT**: `raw/` 폴더의 회의록이 유일한 진실 공급원
- **Wiki = 파생물**: `wiki/` 폴더는 Raw에서 생성되므로 언제든 재생성 가능
- **불가역성**: Raw 회의록은 삭제 불가, 수정 가능 (History 추적)
- **역할 분담**: SSOT Owner (팀) vs Item Owner (개인)

## 📖 설계 문서

상세한 설계 문서는 `hands_over/` 폴더에 있습니다:

- `00-index.md`: 문서 목록 및 핵심 요약
- `01-core-principles.md`: 핵심 개념 및 원칙
- `02-data-structure.md`: Raw 회의록 스키마
- `03-ownership-and-governance.md`: 역할 및 책임 정의
- `04-modification-and-history.md`: 수정 및 History 추적
- `05-agenda-generation.md`: Agenda 생성 규칙
- `06-repository-structure.md`: 저장소 구조 상세
- `07-session-log.md`: 세션별 진행 기록

## 🚀 다음 단계

- [ ] CLAUDE.md 작성: 전체 운영 원칙 문서화
- [ ] 템플릿 생성: 회의록, 결정/액션/질문 템플릿
- [ ] 기존 회의록 마이그레이션: 산재 파일 → raw/ 폴더로 이동
- [ ] Wiki 자동화 검토: Raw → Wiki 레코드 추출 자동화
- [ ] 팀 교육: 사용 가이드 및 운영 정책 공유

## 📝 사용법

(구현 단계에서 추가 예정)

---

**상태**: 1차 설계 완료 (구현 전 단계)  
**마지막 업데이트**: 2026-08-10
