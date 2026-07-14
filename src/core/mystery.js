/**
 * 谜案侦破系统
 * - 线索掉落机制（追踪具体线索索引）
 * - 推理判定（线索集齐后需正确回答推理问题才能破案）
 * - 案件进度追踪
 */
import { CASES, CLUE_DROP_RATE, getCaseByIndex, getTotalCases } from '../data/cases.js';
import * as db from '../data/db.js';

// ==================== 当前案件状态 ====================

/** 获取当前正在侦办的案件信息 */
export async function getActiveCase() {
  const data = await db.getState('active_case');
  if (!data) {
    const firstCase = CASES[0];
    const init = {
      caseIndex: 0,
      caseId: firstCase.id,
      caseTitle: firstCase.title,
      cluesCollected: 0,
      cluesNeeded: firstCase.cluesNeeded,
      collectedClueIndices: [],   // 已收集的线索索引
      readyForDeduction: false,   // 是否准备好推理
    };
    await db.setState('active_case', init);
    return init;
  }
  // 兼容/修复旧数据：将数字计数转换为具体线索索引
  // 条件：readyForDeduction 未定义（从未迁移），或 indices 为空但计数 > 0（之前错误迁移）
  const needsMigration = data.readyForDeduction === undefined ||
    (!data.collectedClueIndices || data.collectedClueIndices.length === 0) && data.cluesCollected > 0;

  if (needsMigration) {
    const caseData = getCaseByIndex(data.caseIndex);
    const totalClues = caseData && caseData.clues ? caseData.clues.length : (data.cluesNeeded || 0);
    if (data.cluesCollected >= data.cluesNeeded && totalClues > 0) {
      const fillCount = Math.min(data.cluesCollected, totalClues);
      data.collectedClueIndices = Array.from({ length: fillCount }, (_, i) => i);
      data.cluesCollected = fillCount;
      data.readyForDeduction = true;
    } else {
      data.collectedClueIndices = [];
      data.readyForDeduction = false;
    }
    await db.setState('active_case', data);
  }
  return data;
}

/** 获取已破案件列表 */
export async function getSolvedCases() {
  return await db.getState('solved_cases') || [];
}

// ==================== 线索掉落 ====================

/**
 * 完成一个任务后尝试掉落线索
 * @returns {{ dropped: boolean, clueCount?: number, clueNeeded?: number, readyForDeduction?: boolean, caseTitle?: string, clueText?: string }}
 */
export async function tryDropClue() {
  const active = await getActiveCase();

  // 如果已经准备好推理，不再掉落线索
  if (active.readyForDeduction) {
    return { dropped: false };
  }

  // 随机判定是否掉落线索
  if (Math.random() > CLUE_DROP_RATE) {
    return { dropped: false };
  }

  const caseData = getCaseByIndex(active.caseIndex);
  if (!caseData || !caseData.clues) {
    return { dropped: false };
  }

  // 找到一条尚未收集的线索索引
  const uncollected = [];
  for (let i = 0; i < caseData.clues.length; i++) {
    if (!active.collectedClueIndices.includes(i)) {
      uncollected.push(i);
    }
  }
  if (uncollected.length === 0) {
    return { dropped: false };
  }

  // 随机选一条
  const picked = uncollected[Math.floor(Math.random() * uncollected.length)];
  const newIndices = [...active.collectedClueIndices, picked];
  const newCount = newIndices.length;
  const allCollected = newCount >= active.cluesNeeded;

  const updated = {
    ...active,
    cluesCollected: newCount,
    collectedClueIndices: newIndices,
    readyForDeduction: allCollected,
  };
  await db.setState('active_case', updated);

  return {
    dropped: true,
    clueCount: newCount,
    clueNeeded: active.cluesNeeded,
    clueText: caseData.clues[picked],
    readyForDeduction: allCollected,
    caseTitle: active.caseTitle,
    caseIcon: caseData.icon || '\u{1F50D}',
  };
}

// ==================== 推理判定 ====================

/**
 * 提交推理答案
 * @param {number} answerIndex - 用户选择的选项索引
 * @returns {{ correct: boolean, explanation?: string, caseTitle?: string }}
 */
export async function submitDeduction(answerIndex) {
  const active = await getActiveCase();
  const caseData = getCaseByIndex(active.caseIndex);

  if (!caseData) {
    return { correct: false, error: '案件数据丢失' };
  }

  if (answerIndex === caseData.answer) {
    // 正确！破案
    await solveCase(active);
    return {
      correct: true,
      explanation: caseData.explanation,
      caseTitle: caseData.caseTitle,
    };
  }

  return { correct: false };
}

/**
 * 获取已准备好推理的案件数据（含已收集的线索文本）
 * @returns {{ caseData, collectedClueTexts: string[] } | null}
 */
export async function getReadyCase() {
  const active = await getActiveCase();
  if (!active.readyForDeduction) return null;

  const caseData = getCaseByIndex(active.caseIndex);
  if (!caseData) return null;

  const collectedClueTexts = active.collectedClueIndices
    .sort((a, b) => a - b)
    .map(i => caseData.clues[i])
    .filter(Boolean);

  return { caseData, collectedClueTexts };
}

// ==================== 破案 ====================

async function solveCase(activeCase) {
  const solved = await getSolvedCases();
  solved.push({
    caseId: activeCase.caseId,
    caseTitle: activeCase.caseTitle,
    solvedAt: new Date().toISOString(),
  });
  await db.setState('solved_cases', solved);

  // 推进到下一个案件
  const nextIndex = activeCase.caseIndex + 1;
  const nextCase = getCaseByIndex(nextIndex);
  if (nextCase) {
    await db.setState('active_case', {
      caseIndex: nextIndex,
      caseId: nextCase.id,
      caseTitle: nextCase.title,
      cluesCollected: 0,
      cluesNeeded: nextCase.cluesNeeded,
      collectedClueIndices: [],
      readyForDeduction: false,
    });
  } else {
    // 全部破完
    await db.setState('active_case', {
      ...activeCase,
      caseIndex: nextIndex,
      allSolved: true,
      readyForDeduction: false,
    });
  }

  await markCaseClosed(activeCase.caseTitle);
}

/** 记录破案统计（兼容旧接口） */
async function markCaseClosed(caseTitle) {
  const current = await db.getState('case_closed') || { solved: 0, total: getTotalCases(), lastSolved: null };
  const updated = {
    solved: current.solved + 1,
    total: getTotalCases(),
    lastSolved: caseTitle,
    timestamp: Date.now(),
  };
  await db.setState('case_closed', updated);
  return updated;
}

// ==================== 破案进度展示 ====================

export async function getMysterySummary() {
  const active = await getActiveCase();
  const solved = await getSolvedCases();

  const allSolved = active.allSolved || false;
  const caseInfo = allSolved ? null : (getCaseByIndex(active.caseIndex) || null);

  return {
    activeCase: caseInfo ? {
      ...caseInfo,
      cluesCollected: active.cluesCollected,
      progress: active.cluesCollected / active.cluesNeeded,
      readyForDeduction: active.readyForDeduction || false,
    } : null,
    solvedCount: solved.length,
    totalCases: getTotalCases(),
    allSolved,
  };
}
