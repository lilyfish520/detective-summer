import { CONFIG } from '../config.js';

/** 将 Date 对象转为 YYYY-MM-DD 本地日期字符串（避免 UTC 时区偏移） */
function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayStr() { return toDateStr(new Date()); }

export function addDays(dateStr, n) {
  const parts = dateStr.split('-');
  const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

export function dayDiff(a, b) {
  const pa = a.split('-'), pb = b.split('-');
  return Math.floor((new Date(+pb[0], +pb[1] - 1, +pb[2]) - new Date(+pa[0], +pa[1] - 1, +pa[2])) / 86400000);
}

export function getDayOfWeek(dateStr) {
  const parts = dateStr.split('-');
  return new Date(+parts[0], +parts[1] - 1, +parts[2]).getDay();
}
export function isSunday(dateStr) { return CONFIG.restDays.includes(getDayOfWeek(dateStr)); }
export function isSaturday(dateStr) { return getDayOfWeek(dateStr) === 6; }
export function isTravel(dateStr) { return dateStr >= CONFIG.travelStart && dateStr <= CONFIG.travelEnd; }
export function isDateInRange(dateStr) { return dateStr >= CONFIG.startDate && dateStr <= todayStr(); }

export function fmtDate(dateStr) {
  const parts = dateStr.split('-');
  const dt = new Date(+parts[0], +parts[1] - 1, +parts[2]);
  const week = ['日','一','二','三','四','五','六'][dt.getDay()];
  return `${+parts[1]}月${+parts[2]}日 周${week}`;
}

export function getDayIndex(dateStr) { return dayDiff(CONFIG.startDate, dateStr); }

export function getNextReviewDate(learnedDate, reviewCount) {
  if (reviewCount >= CONFIG.reviewIntervals.length) return null;
  return addDays(learnedDate, CONFIG.reviewIntervals[reviewCount]);
}

export function getAllLearningDays() {
  const days = [];
  let d = CONFIG.startDate;
  while (d <= CONFIG.endDate) {
    if (!isSunday(d) && !isTravel(d)) days.push(d);
    d = addDays(d, 1);
  }
  return days;
}

export function now() { return new Date(); }
export function isEarlyMorning() { return new Date().getHours() < 8; }
