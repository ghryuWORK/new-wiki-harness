# 3. Ownership 및 거버넌스 구조

## Ownership 계층

### SSOT Level Ownership (팀 차원)

**책임**: 회의록 전체의 품질, 최신성, 접근성 보장

**주체**: 회의 진행자, 기록자, 팀 리드 등
- 전형적으로 2~3명
- 메타데이터에 `참석` 필드로 명시됨
- 또는 별도의 SSOT Maintainer 역할 정의 가능

**권한 및 책임**:
- 회의록 수정/정정의 최종 승인
- 필요시 수정 기록 남기기 (History 섹션)
- Wiki Layer의 동기화 감시
- Raw 회의록의 정확성과 충분한 맥락 유지

### Item Level Ownership (개별 항목)

**Decision Owner**:
- 결정의 의도와 배경 설명 책임
- Follow-up 필요 여부 판단
- Status 업데이트

**Action Item Owner**:
- 진행 상황 업데이트
- 완료 또는 연기 판단
- 장애물 보고

**Open Question Owner**:
- 답변 수집 및 정리
- 해결 완료 판단

## 역할 분담 패턴

| 역할 | 책임 | 권한 범위 |
|------|------|---------|
| **SSOT Maintainer** | Raw 회의록 전체 품질 | 모든 회의록 수정/정정 승인 |
| **Item Owner** | 개별 항목 진행 | 자신의 D/A/Q 상태 업데이트 |
| **Team Member** | 회의 참석, 기록 참여 | Raw 회의록에 내용 추가 (maintainer 승인 필수) |
| **Meeting Organizer** | 다음 회의 준비 | Agenda 생성/관리 |

## 충돌 해결

**원칙**: SSOT Owner의 판단을 우선

- Wiki 데이터와 Raw 회의록 충돌 → Raw 기준으로 재동기화
- Action/Decision Owner와 SSOT Owner의 불일치 → Raw 회의록의 기록을 근거로 협의

## 책임 vs 권한

- **SSOT Owner**: "이 회의가 정확하게 기록되었는가?" (기록의 충실성)
- **Item Owner**: "내 담당 항목이 진행되고 있는가?" (실행의 추진)

두 역할은 독립적으로 작동하며, 충돌 시 SSOT 데이터(Raw)를 기준으로 판단
