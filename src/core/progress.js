/**
 * 核心业务逻辑
 * - 任务完成/取消
 * - 连续打卡计算
 * - 统计数据汇总
 * - 成就徽章系统
 * - 侦探等级判定
 */

import { CONFIG, SUBJECTS, getSubject } from '../config.js';
import { todayStr, addDays, dayDiff, getDayOfWeek, isSunday, isTravel, isDateInRange, getDayIndex } from './engine.js';
import { TASKS, getReciteTasks, CHAPTER_REF } from '../data/tasks.js';
import * as db from '../data/db.js';

// 根据 taskId 前缀解析学科
function resolveSubjectFromId(taskId) {
  if (!taskId) return null;
  if (taskId.startsWith('sp_')) return 'sp';
  // 章节任务: ch_sx_*, ch_wl_*
  if (taskId.startsWith('ch_sx_')) return 'sx';
  if (taskId.startsWith('ch_wl_')) return 'wl';
  // 旧格式兼容
  if (taskId.startsWith('sx_ch_')) return 'sx';
  if (taskId.startsWith('wl_ch_')) return 'wl';
  if (taskId.startsWith('ot_')) return 'ot';
  if (taskId.startsWith('hw_')) return 'hw';
  // 每日固定任务: daily_yw_* -> yw, daily_en_* -> en
  if (taskId.startsWith('daily_')) {
    const parts = taskId.split('_');
    if (parts.length >= 2) {
      const subjId = parts[1];
      if (subjId === 'yw' || subjId === 'en') return subjId;
    }
    return 'daily';
  }
  return null;
}

// ==================== 星星计算 ====================

export function calcStars(task, dateStr) {
  let base = 1;
  // 背诵任务基础1星，长文本+1
  if (task.subject === 'yw') {
    base = 1;
    if (task.content && task.content.length > 100) base = 2;
  }
  if (task.subject === 'en') {
    base = 1;
    if (task.content && task.content.length > 200) base = 2;
  }
  // 周六打卡 +1 奖励星
  if (getDayOfWeek(dateStr) === 6) base += 1;
  return Math.min(base, CONFIG.maxStarsPerDay);
}

// ==================== 任务完成 ====================

export async function completeTask(taskId, dateStr, meta = {}) {
  // 支持动态任务 ID（运动 sp_*、章节 sx_ch_*/wl_ch_*、自定义 ot_*）
  const task = TASKS.find(t => t.id === taskId);
  const subjectId = meta.subjectId || (task ? task.subject : resolveSubjectFromId(taskId));

  if (!task && !meta.subjectId && !resolveSubjectFromId(taskId)) {
    throw new Error(`Task not found: ${taskId}`);
  }

  // 检查是否已完成
  const existing = await db.getProgressForDateTask(dateStr, taskId);
  if (existing) return { state: 'unchanged', events: [] };

  const stars = meta.stars || (task ? calcStars(task, dateStr) : 1);
  const record = {
    date: dateStr,
    subjectId,
    taskId,
    type: subjectId,
    stars,
    timestamp: Date.now(),
    isBlindbox: meta.isBlindbox || false,
    isChallenge: meta.isChallenge || false,
    note: meta.note || '',
    sportType: meta.sportType || '',
    customTitle: meta.customTitle || '',
    customContent: meta.customContent || '',
  };

  await db.saveProgress(record);

  const events = ['task_completed'];
  const state = { action: 'completed', taskId, stars };

  // 检查成就
  const achEvents = await checkAchievements(dateStr);
  events.push(...achEvents);

  return { state, events };
}

export async function undoTask(taskId, dateStr) {
  const existing = await db.getProgressForDateTask(dateStr, taskId);
  if (!existing) return { state: 'unchanged', events: [] };

  await db.deleteProgress(dateStr, taskId);
  return { state: { action: 'undone', taskId, stars: existing.stars }, events: ['task_undone'] };
}

// ==================== 连续打卡 ====================

export async function calcStreak() {
  const allProgress = await db.getAllProgress();
  const dateSet = new Set(allProgress.map(r => r.date));
  const today = todayStr();

  let streak = 0;
  let d = today;

  while (true) {
    if (!isDateInRange(d)) break;
    if (isSunday(d) || isTravel(d)) {
      d = addDays(d, -1);
      continue; // 休息日不打断连续
    }
    if (dateSet.has(d)) {
      streak++;
      d = addDays(d, -1);
    } else {
      break;
    }
  }

  return streak;
}

export async function getMaxStreak() {
  const allProgress = await db.getAllProgress();
  const dates = [...new Set(allProgress.map(r => r.date))].sort();

  let maxStreak = 0;
  let currentStreak = 0;
  let prevDate = null;

  for (const date of dates) {
    if (!prevDate) {
      currentStreak = 1;
    } else {
      const expected = addDays(prevDate, 1);
      const gap = dayDiff(prevDate, date);
      // 检查间隔中是否有有效学习日
      let allRestOrTravel = true;
      let d = addDays(prevDate, 1);
      while (d < date) {
        if (!isSunday(d) && !isTravel(d)) { allRestOrTravel = false; break; }
        d = addDays(d, 1);
      }
      if (gap === 1 || (gap > 1 && allRestOrTravel)) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }
    if (currentStreak > maxStreak) maxStreak = currentStreak;
    prevDate = date;
  }

  return maxStreak;
}

// ==================== 统计数据 ====================

export async function getStats() {
  const allProgress = await db.getAllProgress();
  const today = todayStr();

  const todayProgress = allProgress.filter(r => r.date === today);
  const todayStars = todayProgress.reduce((s, r) => s + r.stars, 0);
  const totalStars = allProgress.reduce((s, r) => s + r.stars, 0);
  const totalRecords = allProgress.length;
  const completedTaskIds = [...new Set(allProgress.map(r => r.taskId))];

  // 各学科统计
  const subjectStats = {};
  for (const subj of SUBJECTS) {
    const records = allProgress.filter(r => r.subjectId === subj.id);
    const completedIds = [...new Set(records.map(r => r.taskId))];

    // 背诵类: TASKS; 章节类: CHAPTER_REF; 体育: SPORTS; 特别行动: 无固定总数
    let totalTasks = TASKS.filter(t => t.subject === subj.id).length;
    if (totalTasks === 0 && subj.type === 'chapter') {
      const items = getAllChapterItems(subj.id);
      totalTasks = items.length;
    }

    subjectStats[subj.id] = {
      name: subj.name,
      icon: subj.icon,
      color: subj.color,
      records: records.length,
      stars: records.reduce((s, r) => s + r.stars, 0),
      completedUnique: completedIds.length,
      totalTasks,
      percentage: totalTasks > 0 ? Math.round(completedIds.length / totalTasks * 100) : 0,
    };
  }

  const streak = await calcStreak();
  const maxStreak = await getMaxStreak();
  const activeDays = [...new Set(allProgress.map(r => r.date))].length;

  // 完成率
  const reciteTasks = getReciteTasks();
  const reciteCompleted = reciteTasks.filter(t => completedTaskIds.includes(t.id)).length;

  return {
    todayStars,
    totalStars,
    totalRecords,
    activeDays,
    streak,
    maxStreak,
    completedTaskIds: completedTaskIds.length,
    reciteCompleted,
    reciteTotal: reciteTasks.length,
    subjectStats,
    todayProgress,
  };
}

// ==================== 成就系统 ====================

const ALL_ACHIEVEMENTS = [
  // ---- 打卡里程碑 ----
  { id: 'first_blood', title: '初次登场', desc: '完成第一次任务打卡', icon: '\u{1F575}', check: (s) => s.totalRecords >= 1 },
  { id: 'ten_tasks', title: '见习侦探', desc: '累计完成10次打卡', icon: '\u{1F50D}', check: (s) => s.totalRecords >= 10 },
  { id: 'thirty_tasks', title: '初级探员', desc: '累计完成30次打卡', icon: '\u{1F4CB}', check: (s) => s.totalRecords >= 30 },
  { id: 'fifty_tasks', title: '中级探员', desc: '累计完成50次打卡', icon: '\u{1F4BC}', check: (s) => s.totalRecords >= 50 },
  { id: 'hundred_tasks', title: '高级探长', desc: '累计完成100次打卡', icon: '\u{1F3C5}', check: (s) => s.totalRecords >= 100 },
  { id: 'two_hundred', title: '重案组组长', desc: '累计完成200次打卡', icon: '\u{1F4AA}', check: (s) => s.totalRecords >= 200 },
  { id: 'three_hundred', title: '警界之光', desc: '累计完成300次打卡', icon: '\u{1F30E}', check: (s) => s.totalRecords >= 300 },
  // ---- 连续打卡 ----
  { id: 'streak_3', title: '三日追踪', desc: '连续打卡3天', icon: '\u{1F525}', check: (s) => s.streak >= 3 },
  { id: 'streak_5', title: '五日搜证', desc: '连续打卡5天', icon: '\u{1F9D0}', check: (s) => s.streak >= 5 },
  { id: 'streak_7', title: '七日连环案', desc: '连续打卡7天', icon: '\u{1F4BF}', check: (s) => s.streak >= 7 },
  { id: 'streak_14', title: '半月大追捕', desc: '连续打卡14天', icon: '\u{1F30D}', check: (s) => s.streak >= 14 },
  { id: 'streak_21', title: '夏洛克之魂', desc: '连续打卡21天', icon: '\u{1F9E5}', check: (s) => s.streak >= 21 },
  { id: 'streak_30', title: '侦探之王', desc: '连续打卡30天', icon: '\u{1F451}', check: (s) => s.streak >= 30 },
  // ---- 星星收集 ----
  { id: 'star_25', title: '证物碎片', desc: '累计获得25颗星星', icon: '\u{2B50}', check: (s) => s.totalStars >= 25 },
  { id: 'star_50', title: '铜星侦探', desc: '累计获得50颗星星', icon: '\u{1F947}', check: (s) => s.totalStars >= 50 },
  { id: 'star_100', title: '银星侦探', desc: '累计获得100颗星星', icon: '\u{1F948}', check: (s) => s.totalStars >= 100 },
  { id: 'star_200', title: '金星侦探', desc: '累计获得200颗星星', icon: '\u{1F949}', check: (s) => s.totalStars >= 200 },
  { id: 'star_350', title: '钻石侦探', desc: '累计获得350颗星星', icon: '\u{1F48E}', check: (s) => s.totalStars >= 350 },
  { id: 'star_500', title: '传奇侦探', desc: '累计获得500颗星星', icon: '\u{1F31F}', check: (s) => s.totalStars >= 500 },
  // ---- 单日高光 ----
  { id: 'five_star_day', title: '重大发现', desc: '单日获得5颗以上星星', icon: '\u{2728}', check: (s) => s.todayStars >= 5 },
  { id: 'eight_star_day', title: '线索井喷', desc: '单日获得8颗以上星星', icon: '\u{1F4A5}', check: (s) => s.todayStars >= 8 },
  { id: 'ten_star_day', title: '证据确凿', desc: '单日获得10颗以上星星', icon: '\u{1F4E6}', check: (s) => s.todayStars >= 10 },
  { id: 'fifteen_star_day', title: '案发现场', desc: '单日获得15颗以上星星', icon: '\u{1F6A8}', check: (s) => s.todayStars >= 15 },
  // ---- 学科成就 ----
  { id: 'yw_half', title: '古籍研究员', desc: '完成50%的古籍破译任务', icon: '\u{1F4D6}', check: (s) => s.subjectStats.yw && s.subjectStats.yw.percentage >= 50 },
  { id: 'yw_master', title: '古籍破译大师', desc: '完成全部古籍破译任务', icon: '\u{1F3DB}', check: (s) => s.subjectStats.yw && s.subjectStats.yw.percentage >= 100 },
  { id: 'en_half', title: '密码学见习', desc: '完成50%的密文翻译任务', icon: '\u{1F4E9}', check: (s) => s.subjectStats.en && s.subjectStats.en.percentage >= 50 },
  { id: 'en_master', title: '密码学专家', desc: '完成全部密文翻译任务', icon: '\u{1F510}', check: (s) => s.subjectStats.en && s.subjectStats.en.percentage >= 100 },
  { id: 'sx_half', title: '逻辑分析', desc: '完成50%的数学章节', icon: '\u{1F4D0}', check: (s) => s.subjectStats.sx && s.subjectStats.sx.percentage >= 50 },
  { id: 'wl_half', title: '现场重建', desc: '完成50%的物理章节', icon: '\u{1F52C}', check: (s) => s.subjectStats.wl && s.subjectStats.wl.percentage >= 50 },
  // ---- 活跃度 ----
  { id: 'days_10', title: '十天足迹', desc: '累计活跃10天', icon: '\u{1F4C5}', check: (s) => s.activeDays >= 10 },
  { id: 'days_20', title: '二十天行动', desc: '累计活跃20天', icon: '\u{1F4C6}', check: (s) => s.activeDays >= 20 },
  { id: 'days_35', title: '全勤侦探', desc: '累计活跃35天', icon: '\u{1F3C3}', check: (s) => s.activeDays >= 35 },
  { id: 'days_45', title: '风雨无阻', desc: '累计活跃45天', icon: '\u{2602}', check: (s) => s.activeDays >= 45 },
  // ---- 趣味成就 ----
  { id: 'first_poem', title: '古诗破译入门', desc: '完成任意一篇古诗背诵', icon: '\u{1F58B}', check: (s) => s.subjectStats.yw && s.subjectStats.yw.records >= 1 },
  { id: 'first_eng', title: '密电初解', desc: '完成任意一组英文单词背诵', icon: '\u{1F4E8}', check: (s) => s.subjectStats.en && s.subjectStats.en.records >= 1 },
  { id: 'weekend_warrior', title: '周末探员', desc: '周六打卡获得3颗以上星星', icon: '\u{1F3A2}', check: (s) => s.todayStars >= 3 }, // relies on Saturday being checked
];

export async function checkAchievements(dateStr) {
  const stats = await getStats();
  const unlocked = await db.getAchievements();
  const unlockedIds = new Set(unlocked.map(a => a.id));
  const events = [];

  for (const ach of ALL_ACHIEVEMENTS) {
    if (unlockedIds.has(ach.id)) continue;
    try {
      if (ach.check(stats)) {
        await db.unlockAchievement({
          id: ach.id,
          title: ach.title,
          desc: ach.desc,
          icon: ach.icon,
          unlockedAt: dateStr || todayStr(),
        });
        events.push('achievement_unlocked');
      }
    } catch (e) {
      console.error('Achievement check failed:', ach.id, e);
    }
  }

  return events;
}

// ==================== 侦探等级 ====================

export async function getDetectiveRank() {
  const stats = await getStats();
  const { totalStars, totalRecords, streak, maxStreak } = stats;

  if (totalRecords === 0) {
    return { level: 0, title: '见习侦探', icon: '\u{1F575}', color: '#94A3B8', nextTitle: '初级侦探', nextNeed: 1 };
  }

  // 等级计算: 综合考虑星星、完成数、连续天数
  const score = totalStars + totalRecords * 0.5 + maxStreak * 2;

  if (score < 10) return { level: 1, title: '见习侦探', icon: '\u{1F575}', color: '#94A3B8', progress: score / 10, nextTitle: '初级侦探', nextNeed: 10 };
  if (score < 25) return { level: 2, title: '初级侦探', icon: '\u{1F575}\u{200D}\u{2642}', color: '#22C55E', progress: (score - 10) / 15, nextTitle: '中级侦探', nextNeed: 25 };
  if (score < 50) return { level: 3, title: '中级侦探', icon: '\u{1F50D}', color: '#3B82F6', progress: (score - 25) / 25, nextTitle: '高级侦探', nextNeed: 50 };
  if (score < 100) return { level: 4, title: '高级侦探', icon: '\u{1F9D0}', color: '#8B5CF6', progress: (score - 50) / 50, nextTitle: '名侦探', nextNeed: 100 };
  if (score < 200) return { level: 5, title: '名侦探', icon: '\u{1F3C5}', color: '#F59E0B', progress: (score - 100) / 100, nextTitle: '传奇侦探', nextNeed: 200 };
  return { level: 6, title: '传奇侦探', icon: '\u{1F451}', color: '#EF4444', progress: 1, nextTitle: null, nextNeed: null };
}

// ==================== 建议日期分配 ====================

export async function assignSuggestedDates() {
  const allProgress = await db.getAllProgress();
  const completedIds = new Set(allProgress.map(r => r.taskId));
  const suggested = await db.getAllSuggested();

  // 清除不再需要的建议
  for (const s of suggested) {
    if (completedIds.has(s.taskId)) {
      await db.setSuggestedDate(s.taskId, null);
    }
  }

  const reciteTasks = getReciteTasks();
  const pendingTasks = reciteTasks.filter(t => !completedIds.has(t.id));

  if (pendingTasks.length === 0) return [];

  // 简单均匀分配：将待背任务分配到剩余的学习日
  const allDays = [];
  let d = todayStr();
  while (d <= CONFIG.endDate) {
    if (!isSunday(d) && !isTravel(d)) allDays.push(d);
    d = addDays(d, 1);
  }

  if (allDays.length === 0) return [];

  const assignments = [];
  pendingTasks.forEach((task, i) => {
    const dayIndex = Math.floor(i * allDays.length / pendingTasks.length);
    const assignedDate = allDays[Math.min(dayIndex, allDays.length - 1)];
    assignments.push({ taskId: task.id, suggestedDate: assignedDate });
  });

  // 保存到数据库
  for (const a of assignments) {
    await db.setSuggestedDate(a.taskId, a.suggestedDate);
  }

  return assignments;
}

export async function getSuggestedTasks(dateStr) {
  const allSuggested = await db.getAllSuggested();
  const allProgress = await db.getAllProgress();
  const completedIds = new Set(allProgress.map(r => r.taskId));

  return allSuggested
    .filter(s => s.suggestedDate === dateStr && !completedIds.has(s.taskId))
    .map(s => TASKS.find(t => t.id === s.taskId))
    .filter(Boolean);
}

// ==================== 日历数据 ====================

export async function getCalendarData() {
  const allProgress = await db.getAllProgress();
  const dateMap = {};
  for (const r of allProgress) {
    if (!dateMap[r.date]) dateMap[r.date] = { stars: 0, count: 0, tasks: [] };
    dateMap[r.date].stars += r.stars;
    dateMap[r.date].count++;
    dateMap[r.date].tasks.push(r);
  }

  const calendar = [];
  let d = CONFIG.startDate;
  while (d <= CONFIG.endDate) {
    const data = dateMap[d] || null;
    calendar.push({
      date: d,
      isSunday: isSunday(d),
      isTravel: isTravel(d),
      isToday: d === todayStr(),
      stars: data ? data.stars : 0,
      count: data ? data.count : 0,
      hasActivity: !!data,
    });
    d = addDays(d, 1);
  }
  return calendar;
}

// ==================== 本章任务生成 ====================

export function getChapterTasksForSubject(subjectId, dateStr) {
  // 返回该学科的章节结构，用于渲染可折叠章节列表
  const chapters = CHAPTER_REF[subjectId] || [];
  return chapters.map((ch, chIdx) => ({
    chapterIndex: chIdx,
    chapterTitle: ch.chapter,
    items: ch.items.map((itemName, itemIdx) => ({
      id: `ch_${subjectId}_${chIdx}_${itemIdx}`,
      title: itemName,
      subject: subjectId,
      chapterIndex: chIdx,
      itemIndex: itemIdx,
    })),
  }));
}

export function getAllChapterItems(subjectId) {
  const chapters = CHAPTER_REF[subjectId] || [];
  const items = [];
  chapters.forEach((ch, chIdx) => {
    ch.items.forEach((itemName, itemIdx) => {
      items.push({
        id: `ch_${subjectId}_${chIdx}_${itemIdx}`,
        title: itemName,
        subject: subjectId,
        chapterIndex: chIdx,
        itemIndex: itemIdx,
      });
    });
  });
  return items;
}
