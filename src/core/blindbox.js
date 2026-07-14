/**
 * 盲盒系统逻辑
 * - 盲盒抽取
 * - 每日挑战检测
 * - 案件告破检测
 */

import { BLIND_BOX_A, BLIND_BOX_B, DAILY_CHALLENGES, ENCOURAGES } from '../data/blindboxes.js';
import * as db from '../data/db.js';
import { todayStr } from './engine.js';

// ==================== 盲盒抽取 ====================

export function drawBlindBoxA() {
  const index = Math.floor(Math.random() * BLIND_BOX_A.length);
  return BLIND_BOX_A[index];
}

export function drawBlindBoxB() {
  const index = Math.floor(Math.random() * BLIND_BOX_B.length);
  return BLIND_BOX_B[index];
}

export function drawRandomEncourage() {
  const index = Math.floor(Math.random() * ENCOURAGES.length);
  return ENCOURAGES[index];
}

// ==================== 抽盲盒触发条件 ====================

export async function checkBlindBoxTrigger(dateStr) {
  const progress = await db.getProgressForDate(dateStr);
  const date = dateStr || todayStr();
  const todayProgress = progress.filter(r => r.date === date);

  const triggers = [];

  // 条件1: 当日完成3个以上不同任务 - 触发A盲盒
  const uniqueSubjects = new Set(todayProgress.map(r => r.subjectId));
  if (uniqueSubjects.size >= 3) {
    triggers.push({ type: 'box_a', reason: '今日完成3类以上任务', box: drawBlindBoxA() });
  }

  // 条件2: 当日获得5星以上 - 触发B盲盒
  const todayStars = todayProgress.reduce((s, r) => s + r.stars, 0);
  if (todayStars >= 5) {
    triggers.push({ type: 'box_b', reason: '今日获得5颗以上星星', box: drawBlindBoxB() });
  }

  // 条件3: 完成所有建议的当日背诵任务
  const allSuggested = await db.getAllSuggested();
  const suggestedTaskIds = allSuggested
    .filter(s => s.suggestedDate === date)
    .map(s => s.taskId);
  const completedTodayIds = todayProgress.map(r => r.taskId);
  const allSuggestedDone = suggestedTaskIds.length > 0 &&
    suggestedTaskIds.every(id => completedTodayIds.includes(id));
  if (allSuggestedDone) {
    triggers.push({ type: 'bonus', reason: '完成今日所有建议任务', box: drawBlindBoxA() });
  }

  return triggers;
}

// ==================== 每日挑战 ====================

export function getDailyChallenge(dayIndex) {
  return DAILY_CHALLENGES[dayIndex % DAILY_CHALLENGES.length];
}

export function getTodayChallenge() {
  const dayOfYear = Math.floor((Date.now() - new Date('2026-01-01').getTime()) / 86400000);
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
}

// ==================== 案件告破检测 ====================

export async function checkCaseClosed() {
  const stats = await db.getState('case_closed');
  return stats || { solved: 0, total: 0, lastSolved: null };
}

export async function markCaseClosed(caseName) {
  const current = await checkCaseClosed();
  const updated = {
    solved: current.solved + 1,
    total: Math.max(current.total, current.solved + 1),
    lastSolved: caseName,
    timestamp: Date.now(),
  };
  await db.setState('case_closed', updated);
  return updated;
}

// ==================== 盲盒历史 ====================

export async function getBlindBoxHistory() {
  return await db.getState('blindbox_history') || [];
}

export async function addBlindBoxHistory(item) {
  const history = await getBlindBoxHistory();
  history.unshift({ ...item, openedAt: new Date().toISOString() });
  // 只保留最近50条
  if (history.length > 50) history.length = 50;
  await db.setState('blindbox_history', history);
  return history;
}
