/**
 * 头部组件
 * - 日期导航
 * - 星星/连击统计
 * - 侦探等级显示
 */

import { CONFIG } from '../config.js';
import { todayStr, addDays, fmtDate, isSunday, isTravel, isDateInRange } from '../core/engine.js';
import * as progress from '../core/progress.js';
import * as mystery from '../core/mystery.js';
import { escapeHtml, $ } from './components.js';

let currentDate = todayStr();
let onDateChange = null;

// ==================== 日期导航 ====================

export function renderDateNav(container, dateChangeCallback) {
  if (!container) return;
  onDateChange = dateChangeCallback;

  container.innerHTML = `
    <div class="date-nav">
      <button class="date-nav-btn date-nav-prev" title="前一天">&larr;</button>
      <div class="date-nav-display">
        <span class="date-nav-text">${fmtDate(currentDate)}</span>
        <span class="date-nav-badges"></span>
      </div>
      <button class="date-nav-btn date-nav-today" title="回到今天">&#x1F4C5;</button>
      <button class="date-nav-btn date-nav-next" title="后一天">&rarr;</button>
    </div>
  `;

  // 事件绑定
  const prevBtn = container.querySelector('.date-nav-prev');
  const nextBtn = container.querySelector('.date-nav-next');
  const todayBtn = container.querySelector('.date-nav-today');

  if (prevBtn) prevBtn.addEventListener('click', () => navigateDate(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateDate(1));
  if (todayBtn) todayBtn.addEventListener('click', () => navigateToToday());

  updateDateNavState(container);
  updateDateBadges(container);
}

function navigateDate(delta) {
  let newDate = addDays(currentDate, delta);
  // 限制在范围内
  if (newDate < CONFIG.startDate) newDate = CONFIG.startDate;
  if (newDate > todayStr()) newDate = todayStr();
  if (newDate === currentDate) return;

  currentDate = newDate;
  const container = document.querySelector('#dateNav');
  if (container) {
    updateDateNavState(container);
    updateDateBadges(container);
  }
  if (onDateChange) onDateChange(currentDate);
}

function navigateToToday() {
  const today = todayStr();
  if (currentDate === today) return;
  currentDate = today;
  const container = document.querySelector('#dateNav');
  if (container) {
    updateDateNavState(container);
    updateDateBadges(container);
  }
  if (onDateChange) onDateChange(currentDate);
}

function updateDateNavState(container) {
  if (!container) return;
  const textEl = container.querySelector('.date-nav-text');
  const prevBtn = container.querySelector('.date-nav-prev');
  const nextBtn = container.querySelector('.date-nav-next');

  if (textEl) {
    const isToday = currentDate === todayStr();
    textEl.innerHTML = `${fmtDate(currentDate)}${isToday ? ' <span class="today-badge">今天</span>' : ''}`;
  }

  if (prevBtn) prevBtn.disabled = currentDate <= CONFIG.startDate;
  if (nextBtn) nextBtn.disabled = currentDate >= todayStr();
}

async function updateDateBadges(container) {
  if (!container) return;
  const badgesEl = container.querySelector('.date-nav-badges');
  if (!badgesEl) return;

  try {
    const dateProgress = await progress.getStats();
    const dayProgress = dateProgress.todayProgress.filter(r => r.date === currentDate);

    const isSundayDate = isSunday(currentDate);
    const isTravelDate = isTravel(currentDate);
    const inRange = isDateInRange(currentDate);

    let badges = '';
    if (isSundayDate) badges += '<span class="date-badge badge-rest">休息日</span>';
    if (isTravelDate) badges += '<span class="date-badge badge-travel">旅行中</span>';
    if (!inRange) badges += '<span class="date-badge badge-future">未开始</span>';

    if (dayProgress.length > 0) {
      const stars = dayProgress.reduce((s, r) => s + r.stars, 0);
      badges += `<span class="date-badge badge-stars">&#x2B50; ${stars}</span>`;
      badges += `<span class="date-badge badge-count">${dayProgress.length}项</span>`;
    }

    badgesEl.innerHTML = badges;
  } catch (e) {
    badgesEl.innerHTML = '';
  }
}

export function getCurrentDate() {
  return currentDate;
}

export function setCurrentDate(dateStr) {
  currentDate = dateStr;
  const container = document.querySelector('#dateNav');
  if (container) {
    updateDateNavState(container);
    updateDateBadges(container);
  }
}

// ==================== 头部统计 ====================

export async function renderHeaderStats(container) {
  if (!container) return;

  try {
    const stats = await progress.getStats();
    const rank = await progress.getDetectiveRank();
    const caseSummary = await mystery.getMysterySummary();

    // 构建案件进度 HTML
    let caseHtml = '';
    if (caseSummary.allSolved) {
      caseHtml = `
        <div class="mystery-bar mystery-all-solved">
          <span class="mystery-bar-icon">&#x1F3C6;</span>
          <span class="mystery-bar-text">全部 ${caseSummary.totalCases} 起案件已侦破！传奇侦探！</span>
        </div>`;
    } else if (caseSummary.activeCase) {
      const ac = caseSummary.activeCase;
      const pct = Math.round(ac.progress * 100);
      caseHtml = `
        <div class="mystery-bar">
          <span class="mystery-bar-icon">${ac.icon}</span>
          <div class="mystery-bar-info">
            <div class="mystery-bar-title">${escapeHtml(ac.title)}</div>
            <div class="mystery-bar-track">
              <div class="mystery-bar-fill" style="width:${pct}%;"></div>
            </div>
            <div class="mystery-bar-hint">线索 ${ac.cluesCollected}/${ac.cluesNeeded} · 已破 ${caseSummary.solvedCount}/${caseSummary.totalCases} 案</div>
          </div>
        </div>`;
    }

    container.innerHTML = `
      <div class="header-stats">
        <div class="stat-card stat-rank" style="border-color:${rank.color};">
          <div class="stat-rank-icon">${rank.icon}</div>
          <div class="stat-rank-info">
            <div class="stat-rank-title" style="color:${rank.color};">${escapeHtml(rank.title)}</div>
            ${rank.nextTitle ? `
              <div class="stat-rank-progress">
                <div class="stat-rank-bar">
                  <div class="stat-rank-bar-fill" style="width:${(rank.progress || 0) * 100}%;background:${rank.color};"></div>
                </div>
                <span class="stat-rank-next">下一级: ${rank.nextTitle}</span>
              </div>
            ` : '<div class="stat-rank-max">最高等级</div>'}
          </div>
        </div>
        ${caseHtml}
        <div class="stat-card stat-streak">
          <div class="stat-value">${stats.streak}</div>
          <div class="stat-label">连续打卡</div>
        </div>
        <div class="stat-card stat-stars">
          <div class="stat-value">${stats.totalStars}</div>
          <div class="stat-label">累计星星</div>
        </div>
        <div class="stat-card stat-days">
          <div class="stat-value">${stats.activeDays}</div>
          <div class="stat-label">活跃天数</div>
        </div>
      </div>
    `;
  } catch (e) {
    console.error('renderHeaderStats failed:', e);
    container.innerHTML = '<div class="header-stats-error">统计加载失败</div>';
  }
}

export function getCurrentDateForHeader() {
  return currentDate;
}
