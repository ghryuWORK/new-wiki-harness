#!/usr/bin/env python3
"""
Wiki 기계 검증 스크립트
- Frontmatter YAML 검증
- 필수 필드 확인
- 파일명 규칙 검증
- Status 값 유효성
- 날짜 형식
- ID 순증가
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple
import yaml

WIKI_DIR = Path(__file__).parent.parent / "wiki"
DECISION_DIR = WIKI_DIR / "결정"
ACTION_DIR = WIKI_DIR / "액션아이템"
PENDING_DIR = WIKI_DIR / "보류"

DECISION_STATUSES = {
    "open", "closed", "pending", "pending_implementation",
    "in_progress", "unclear", "at_risk"
}
ACTION_STATUSES = {
    "open", "in_progress", "completed", "blocked",
    "on_hold", "at_risk", "untracked"
}
PENDING_STATUSES = {"pending", "stalled", "escalated"}

DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")

errors = []
warnings = []
stats = {"decisions": 0, "actions": 0, "pending": 0, "total": 0}


def extract_frontmatter(content: str) -> Tuple[bool, Dict]:
    """Extract and parse frontmatter from file content"""
    match = re.match(r"^---\n([\s\S]*?)\n---", content)
    if not match:
        return False, {}

    try:
        fm = yaml.safe_load(match.group(1))
        return True, fm if fm else {}
    except yaml.YAMLError as e:
        return False, {"error": str(e)}


def validate_decision_file(filepath: Path, content: str) -> List[str]:
    """Validate Decision (D-xxx) file"""
    issues = []
    basename = filepath.name

    # Check filename pattern
    if not re.match(r"^D-\d+\.md$", basename):
        issues.append(f"파일명 규칙 오류: {basename} (D-{{number}}.md 형식 필요)")
        return issues

    # Check frontmatter
    valid, fm = extract_frontmatter(content)
    if not valid:
        issues.append(f"Frontmatter 오류: YAML 파싱 실패")
        return issues

    # Check required fields
    required = ["id", "source", "title", "owner", "status", "created_date"]
    for field in required:
        if field not in fm or not fm[field]:
            issues.append(f"필수 필드 누락: {field}")

    # Validate ID format
    if "id" in fm and fm["id"]:
        if not re.match(r"^D-\d+$", str(fm["id"])):
            issues.append(f"ID 형식 오류: {fm['id']} (D-{{number}} 형식 필요)")

    # Validate status
    if "status" in fm and fm["status"]:
        if str(fm["status"]) not in DECISION_STATUSES:
            valid_statuses = ", ".join(sorted(DECISION_STATUSES))
            issues.append(f"Invalid status: {fm['status']} (허용값: {valid_statuses})")

    # Validate dates
    for date_field in ["created_date", "last_modified"]:
        if date_field in fm and fm[date_field]:
            if not DATE_PATTERN.match(str(fm[date_field])):
                issues.append(f"날짜 형식 오류: {date_field}={fm[date_field]} (YYYY-MM-DD 필요)")

    return issues


def validate_action_file(filepath: Path, content: str) -> List[str]:
    """Validate Action (A-xxx) file"""
    issues = []
    basename = filepath.name

    # Check filename pattern
    if not re.match(r"^A-\d+\.md$", basename):
        issues.append(f"파일명 규칙 오류: {basename} (A-{{number}}.md 형식 필요)")
        return issues

    # Check frontmatter
    valid, fm = extract_frontmatter(content)
    if not valid:
        issues.append(f"Frontmatter 오류: YAML 파싱 실패")
        return issues

    # Check required fields
    required = ["id", "source", "title", "owner", "status", "created_date", "due_date"]
    for field in required:
        if field not in fm or not fm[field]:
            issues.append(f"필수 필드 누락: {field}")

    # Validate ID format
    if "id" in fm and fm["id"]:
        if not re.match(r"^A-\d+$", str(fm["id"])):
            issues.append(f"ID 형식 오류: {fm['id']} (A-{{number}} 형식 필요)")

    # Validate status
    if "status" in fm and fm["status"]:
        if str(fm["status"]) not in ACTION_STATUSES:
            valid_statuses = ", ".join(sorted(ACTION_STATUSES))
            issues.append(f"Invalid status: {fm['status']} (허용값: {valid_statuses})")

    # Validate dates
    for date_field in ["created_date", "due_date", "completed_date"]:
        if date_field in fm and fm[date_field]:
            if not DATE_PATTERN.match(str(fm[date_field])):
                issues.append(f"날짜 형식 오류: {date_field}={fm[date_field]} (YYYY-MM-DD 필요)")

    # Check owner
    if "owner" in fm and str(fm["owner"]) == "unassigned":
        warnings.append(f"{basename}: owner가 'unassigned' (액션은 담당자 필수, P-xxx로 전환 고려)")

    return issues


def validate_pending_file(filepath: Path, content: str) -> List[str]:
    """Validate Pending (P-xxx) file"""
    issues = []
    basename = filepath.name

    # Check filename pattern
    if not re.match(r"^P-\d+\.md$", basename):
        issues.append(f"파일명 규칙 오류: {basename} (P-{{number}}.md 형식 필요)")
        return issues

    # Check frontmatter
    valid, fm = extract_frontmatter(content)
    if not valid:
        issues.append(f"Frontmatter 오류: YAML 파싱 실패")
        return issues

    # Check required fields
    required = ["id", "source", "title", "status", "created_date"]
    for field in required:
        if field not in fm or not fm[field]:
            issues.append(f"필수 필드 누락: {field}")

    # Validate ID format
    if "id" in fm and fm["id"]:
        if not re.match(r"^P-\d+$", str(fm["id"])):
            issues.append(f"ID 형식 오류: {fm['id']} (P-{{number}} 형식 필요)")

    # Validate status
    if "status" in fm and fm["status"]:
        if str(fm["status"]) not in PENDING_STATUSES:
            valid_statuses = ", ".join(sorted(PENDING_STATUSES))
            issues.append(f"Invalid status: {fm['status']} (허용값: {valid_statuses})")

    # Validate created_date
    if "created_date" in fm and fm["created_date"]:
        if not DATE_PATTERN.match(str(fm["created_date"])):
            issues.append(f"날짜 형식 오류: created_date={fm['created_date']} (YYYY-MM-DD 필요)")

    return issues


def validate_sequence(files: List[Path], prefix: str) -> List[str]:
    """Validate ID sequence (no gaps)"""
    issues = []
    numbers = []

    for f in files:
        match = re.match(rf"^{prefix}-(\d+)\.md$", f.name)
        if match:
            numbers.append(int(match.group(1)))

    numbers.sort()
    for i in range(len(numbers) - 1):
        if numbers[i + 1] - numbers[i] != 1:
            issues.append(
                f"ID 순서 불연속: {prefix}-{numbers[i]}과 {prefix}-{numbers[i + 1]} "
                f"사이에 갭 있음"
            )

    return issues


def validate_directory(dirpath: Path, validator_func, prefix: str) -> List[Dict]:
    """Validate all files in a directory"""
    issues_list = []

    if not dirpath.exists():
        print(f"⚠️  {prefix} 폴더 없음: {dirpath}")
        return []

    files = sorted(dirpath.glob("*.md"))

    for filepath in files:
        content = filepath.read_text(encoding="utf-8")
        file_issues = validator_func(filepath, content)

        if file_issues:
            issues_list.append({"file": filepath.name, "issues": file_issues})

    # Check sequence
    seq_issues = validate_sequence(files, prefix)
    if seq_issues:
        issues_list.append({"file": f"{prefix} 전체", "issues": seq_issues})

    return issues_list


def main():
    """Main validation function"""
    print("🔍 Wiki 기계 검증 시작\n")

    # Validate each type
    decision_issues = validate_directory(DECISION_DIR, validate_decision_file, "D")
    action_issues = validate_directory(ACTION_DIR, validate_action_file, "A")
    pending_issues = validate_directory(PENDING_DIR, validate_pending_file, "P")

    all_issues = decision_issues + action_issues + pending_issues

    # Print results
    if not all_issues and not warnings:
        print("✅ 모든 검증 통과\n")
    else:
        if all_issues:
            print("❌ 오류 발견 (수정 필수):\n")
            for item in all_issues:
                print(f"  📄 {item['file']}")
                for issue in item["issues"]:
                    print(f"     • {issue}")
            print()

        if warnings:
            print("⚠️  경고 (권장):\n")
            for warning in warnings:
                print(f"  • {warning}")
            print()

    # Stats
    if DECISION_DIR.exists():
        stats["decisions"] = len(list(DECISION_DIR.glob("D-*.md")))
    if ACTION_DIR.exists():
        stats["actions"] = len(list(ACTION_DIR.glob("A-*.md")))
    if PENDING_DIR.exists():
        stats["pending"] = len(list(PENDING_DIR.glob("P-*.md")))
    stats["total"] = stats["decisions"] + stats["actions"] + stats["pending"]

    print("📊 통계:")
    print(f"  • 결정(D): {stats['decisions']}")
    print(f"  • 액션(A): {stats['actions']}")
    print(f"  • 보류(P): {stats['pending']}")
    print(f"  • 합계: {stats['total']}\n")

    return 0 if not all_issues else 1


if __name__ == "__main__":
    sys.exit(main())
