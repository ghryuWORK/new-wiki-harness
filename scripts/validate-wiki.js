#!/usr/bin/env node
/**
 * Wiki 기계 검증 스크립트
 * - Frontmatter YAML 검증
 * - 필수 필드 확인
 * - 파일명 규칙 검증
 * - Status 값 유효성
 * - 날짜 형식
 * - ID 순증가
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const WIKI_DIR = path.join(__dirname, '../wiki');
const DECISION_DIR = path.join(WIKI_DIR, '결정');
const ACTION_DIR = path.join(WIKI_DIR, '액션아이템');
const PENDING_DIR = path.join(WIKI_DIR, '보류');

const DECISION_STATUSES = ['open', 'closed', 'pending', 'pending_implementation', 'in_progress', 'unclear', 'at_risk'];
const ACTION_STATUSES = ['open', 'in_progress', 'completed', 'blocked', 'on_hold', 'at_risk', 'untracked'];
const PENDING_STATUSES = ['pending', 'stalled', 'escalated'];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

let errors = [];
let warnings = [];
let stats = {
  decisions: 0,
  actions: 0,
  pending: 0,
  total: 0,
};

function validateFrontmatter(content, type) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return { valid: false, error: 'Frontmatter 없음' };
  }

  try {
    const fm = yaml.load(frontmatterMatch[1]);
    return { valid: true, data: fm };
  } catch (e) {
    return { valid: false, error: `YAML 파싱 실패: ${e.message}` };
  }
}

function validateDecisionFile(filePath, content) {
  const issues = [];
  const basename = path.basename(filePath);
  const match = basename.match(/^D-(\d+)\.md$/);

  if (!match) {
    issues.push(`파일명 규칙 오류: ${basename} (D-{number}.md 형식 필요)`);
    return issues;
  }

  const fm = validateFrontmatter(content, 'D');
  if (!fm.valid) {
    issues.push(`Frontmatter 오류: ${fm.error}`);
    return issues;
  }

  const data = fm.data;
  const requiredFields = ['id', 'source', 'title', 'owner', 'status', 'created_date'];

  requiredFields.forEach(field => {
    if (!data[field]) {
      issues.push(`필수 필드 누락: ${field}`);
    }
  });

  if (data.id && !data.id.match(/^D-\d+$/)) {
    issues.push(`ID 형식 오류: ${data.id} (D-{number} 형식 필요)`);
  }

  if (data.status && !DECISION_STATUSES.includes(data.status)) {
    issues.push(`Invalid status: ${data.status} (허용값: ${DECISION_STATUSES.join(', ')})`);
  }

  ['created_date', 'last_modified'].forEach(field => {
    if (data[field] && !DATE_PATTERN.test(data[field])) {
      issues.push(`날짜 형식 오류: ${field}=${data[field]} (YYYY-MM-DD 형식 필요)`);
    }
  });

  return issues;
}

function validateActionFile(filePath, content) {
  const issues = [];
  const basename = path.basename(filePath);
  const match = basename.match(/^A-(\d+)\.md$/);

  if (!match) {
    issues.push(`파일명 규칙 오류: ${basename} (A-{number}.md 형식 필요)`);
    return issues;
  }

  const fm = validateFrontmatter(content, 'A');
  if (!fm.valid) {
    issues.push(`Frontmatter 오류: ${fm.error}`);
    return issues;
  }

  const data = fm.data;
  const requiredFields = ['id', 'source', 'title', 'owner', 'status', 'created_date', 'due_date'];

  requiredFields.forEach(field => {
    if (!data[field]) {
      issues.push(`필수 필드 누락: ${field}`);
    }
  });

  if (data.id && !data.id.match(/^A-\d+$/)) {
    issues.push(`ID 형식 오류: ${data.id} (A-{number} 형식 필요)`);
  }

  if (data.status && !ACTION_STATUSES.includes(data.status)) {
    issues.push(`Invalid status: ${data.status} (허용값: ${ACTION_STATUSES.join(', ')})`);
  }

  ['created_date', 'due_date', 'completed_date'].forEach(field => {
    if (data[field] && !DATE_PATTERN.test(data[field])) {
      issues.push(`날짜 형식 오류: ${field}=${data[field]} (YYYY-MM-DD 형식 필요)`);
    }
  });

  // Check owner
  if (data.owner === 'unassigned') {
    warnings.push(`${basename}: owner가 'unassigned' (액션은 담당자 필수, P-xxx로 전환 고려)`);
  }

  return issues;
}

function validatePendingFile(filePath, content) {
  const issues = [];
  const basename = path.basename(filePath);
  const match = basename.match(/^P-(\d+)\.md$/);

  if (!match) {
    issues.push(`파일명 규칙 오류: ${basename} (P-{number}.md 형식 필요)`);
    return issues;
  }

  const fm = validateFrontmatter(content, 'P');
  if (!fm.valid) {
    issues.push(`Frontmatter 오류: ${fm.error}`);
    return issues;
  }

  const data = fm.data;
  const requiredFields = ['id', 'source', 'title', 'status', 'created_date'];

  requiredFields.forEach(field => {
    if (!data[field]) {
      issues.push(`필수 필드 누락: ${field}`);
    }
  });

  if (data.id && !data.id.match(/^P-\d+$/)) {
    issues.push(`ID 형식 오류: ${data.id} (P-{number} 형식 필요)`);
  }

  if (data.status && !PENDING_STATUSES.includes(data.status)) {
    issues.push(`Invalid status: ${data.status} (허용값: ${PENDING_STATUSES.join(', ')})`);
  }

  if (data.created_date && !DATE_PATTERN.test(data.created_date)) {
    issues.push(`날짜 형식 오류: created_date=${data.created_date} (YYYY-MM-DD 형식 필요)`);
  }

  return issues;
}

function validateSequence(files, prefix) {
  const numbers = files
    .map(f => {
      const match = path.basename(f).match(new RegExp(`^${prefix}-(\\d+)\\.md$`));
      return match ? parseInt(match[1]) : null;
    })
    .filter(n => n !== null)
    .sort((a, b) => a - b);

  const issues = [];
  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i + 1] - numbers[i] !== 1) {
      issues.push(`ID 순서 불연속: ${prefix}-${numbers[i]}과 ${prefix}-${numbers[i + 1]} 사이에 갭 있음`);
    }
  }
  return issues;
}

function validateDirectory(dir, validator, type) {
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️ ${type} 폴더 없음: ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  const issues = [];

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileIssues = validator(filePath, content);

    if (fileIssues.length > 0) {
      issues.push({ file: path.basename(filePath), issues: fileIssues });
    }
  });

  // Check sequence
  const seqIssues = validateSequence(files.map(f => path.join(dir, f)), type.charAt(0));
  if (seqIssues.length > 0) {
    issues.push({ file: `${type} 전체`, issues: seqIssues });
  }

  return issues;
}

function main() {
  console.log('🔍 Wiki 기계 검증 시작\n');

  // Validate each type
  const decisionIssues = validateDirectory(DECISION_DIR, validateDecisionFile, 'D');
  const actionIssues = validateDirectory(ACTION_DIR, validateActionFile, 'A');
  const pendingIssues = validateDirectory(PENDING_DIR, validatePendingFile, 'P');

  errors = [...decisionIssues, ...actionIssues, ...pendingIssues];

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ 모든 검증 통과\n');
  } else {
    if (errors.length > 0) {
      console.log('❌ 오류 발견 (수정 필수):\n');
      errors.forEach(({ file, issues }) => {
        console.log(`  📄 ${file}`);
        issues.forEach(issue => console.log(`     • ${issue}`));
      });
      console.log();
    }

    if (warnings.length > 0) {
      console.log('⚠️ 경고 (권장):\n');
      warnings.forEach(w => console.log(`  • ${w}`));
      console.log();
    }
  }

  // Stats
  if (fs.existsSync(DECISION_DIR)) {
    stats.decisions = fs.readdirSync(DECISION_DIR).filter(f => f.endsWith('.md')).length;
  }
  if (fs.existsSync(ACTION_DIR)) {
    stats.actions = fs.readdirSync(ACTION_DIR).filter(f => f.endsWith('.md')).length;
  }
  if (fs.existsSync(PENDING_DIR)) {
    stats.pending = fs.readdirSync(PENDING_DIR).filter(f => f.endsWith('.md')).length;
  }
  stats.total = stats.decisions + stats.actions + stats.pending;

  console.log('📊 통계:');
  console.log(`  • 결정(D): ${stats.decisions}`);
  console.log(`  • 액션(A): ${stats.actions}`);
  console.log(`  • 보류(P): ${stats.pending}`);
  console.log(`  • 합계: ${stats.total}\n`);

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
