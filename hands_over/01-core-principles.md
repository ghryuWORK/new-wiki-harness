# 1. 핵심 원칙

## SSOT 정의

**Raw Meeting Note = SSOT (유일한 권위)**

- 실제 회의에서 기록된 내용이 최상위 원본 데이터
- 팀이 공동으로 관리하는 canonical meeting record
- Immutable하지 않지만 trackable (수정은 가능하되 history 남김)

## 데이터 계층 구조

### Raw Layer (SSOT)
- 위치: `raw/`
- 내용: 원본 회의록 파일들
- 소유: 팀 전체
- 변경: 팀 멤버 누구나 (기록 필수)
- 삭제: 불가능

### Wiki Layer (Derived Data - 파생물)
- 위치: `wiki/`
- 내용: Raw에서 추출/조립한 구조화 정보
- 특징: **통째로 삭제 가능** (Raw에서 재생성 가능)
- 구성:
  - **원자 레코드**: 결정/, 보류/, 액션아이템/ (1파일 1건)
  - **뷰**: 회의/, 사람/, 주제/ (레코드에서 조립)

## 충돌 해결 원칙

**Raw 회의록을 항상 기준으로 판단**

- Wiki의 결정/액션/보류와 Raw 회의록이 충돌 → Raw 기준으로 수정
- 파생 데이터는 항상 Raw의 최신 상태를 반영해야 함
- Raw 회의록의 수정사항이 발생하면 Wiki는 재동기화
- **Raw는 원본 형식 유지**: Notion 내보내기 또는 직접 기록한 자유 형식 그대로 보존

## 팀 운영 원칙

- 회의록은 팀 자산 (개인 소유 아님)
- 각 Decision/Action/Open Question에는 개별 Owner 존재 가능
- SSOT Owner (팀)와 Item Owner (개인)는 분리하여 관리
