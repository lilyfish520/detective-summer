/**
 * 统计仪表盘
 * - 日历热力图
 * - 成就徽章展示
 * - 学科进度图
 * - 侦探等级
 */

import { CONFIG, SUBJECTS } from '../config.js';
import { todayStr, addDays, fmtDate, isSunday, isTravel, isDateInRange, getDayIndex } from '../core/engine.js';
import { TASKS } from '../data/tasks.js';
import { MOODS } from '../data/blindboxes.js';
import * as db from '../data/db.js';
import * as progress from '../core/progress.js';
import * as mystery from '../core/mystery.js';
import {
  escapeHtml, showToast, showLoading, showError, showEmpty,
  createElement, clearElement, $, animateElement
} from './components.js';

export async function renderTabStats(container) {
  if (!container) return;

  try {
    showLoading(container);

    const stats = await progress.getStats();
    const rank = await progress.getDetectiveRank();
    const achievements = await db.getAchievements();
    const calendarData = await progress.getCalendarData();

    container.innerHTML = '';

    // ==================== 侦探等级卡片 ====================
    const rankCard = createElement('div', { className: 'stats-rank-card' });
    rankCard.innerHTML = `
      <div class="stats-rank-icon" style="background:${rank.color}20; color:${rank.color};">
        ${rank.icon}
      </div>
      <div class="stats-rank-info">
        <div class="stats-rank-name" style="color:${rank.color};">${escapeHtml(rank.title)}</div>
        ${rank.nextTitle ? `
          <div class="stats-rank-bar-container">
            <div class="stats-rank-bar">
              <div class="stats-rank-bar-fill" style="width:${(rank.progress || 0) * 100}%; background:${rank.color};"></div>
            </div>
            <span class="stats-rank-bar-label">距离 ${rank.nextTitle} 还需努力</span>
          </div>
        ` : '<div class="stats-rank-max-label">&#x1F451; 已达最高等级！</div>'}
      </div>
    `;
    container.appendChild(rankCard);

    // ==================== 关键数据 ====================
    const keyStats = createElement('div', { className: 'stats-key-row' });
    keyStats.innerHTML = `
      <div class="stats-key-item">
        <div class="stats-key-value">${stats.totalStars}</div>
        <div class="stats-key-label">累计星星</div>
      </div>
      <div class="stats-key-item">
        <div class="stats-key-value">${stats.activeDays}</div>
        <div class="stats-key-label">活跃天数</div>
      </div>
      <div class="stats-key-item">
        <div class="stats-key-value">${stats.streak}</div>
        <div class="stats-key-label">连续打卡</div>
      </div>
      <div class="stats-key-item">
        <div class="stats-key-value">${stats.maxStreak}</div>
        <div class="stats-key-label">最长连续</div>
      </div>
    `;
    container.appendChild(keyStats);

    // ==================== 谜案侦破 ====================
    const caseSummary = await mystery.getMysterySummary();
    const solvedCases = await mystery.getSolvedCases();

    if (solvedCases.length > 0 || caseSummary.activeCase) {
      const mysterySection = createElement('div', { className: 'stats-section' });
      mysterySection.innerHTML = '<div class="section-title">\u{1F575}️‍♂️ 谜案侦破</div>';

      // 当前侦办中
      if (caseSummary.activeCase) {
        const ac = caseSummary.activeCase;
        const pct = Math.round(ac.progress * 100);
        const activeCard = createElement('div', { className: 'mystery-card mystery-card-active' });
        activeCard.innerHTML = `
          <div class="mystery-card-header">
            <span class="mystery-card-icon">${ac.icon}</span>
            <span class="mystery-card-title">${escapeHtml(ac.title)}</span>
            <span class="mystery-card-badge">侦办中</span>
          </div>
          <div class="mystery-card-desc">${escapeHtml(ac.desc)}</div>
          <div class="mystery-card-track">
            <div class="mystery-card-fill" style="width:${pct}%;"></div>
          </div>
          <div class="mystery-card-hint">线索收集：${ac.cluesCollected}/${ac.cluesNeeded}（每次打卡有${Math.round(40)}%概率获得线索）</div>
        `;
        mysterySection.appendChild(activeCard);
      }

      // 已破案件列表
      if (solvedCases.length > 0) {
        const solvedTitle = createElement('div', { className: 'mystery-solved-title' });
        solvedTitle.innerHTML = `已侦破案件 (${solvedCases.length}/${caseSummary.totalCases})`;
        mysterySection.appendChild(solvedTitle);

        const solvedList = createElement('div', { className: 'mystery-solved-list' });
        // 只显示最近8个
        const recentSolved = solvedCases.slice(-8).reverse();
        for (const sc of recentSolved) {
          const item = createElement('div', { className: 'mystery-solved-item' });
          item.innerHTML = `
            <span class="mystery-solved-icon">✅</span>
            <span class="mystery-solved-name">${escapeHtml(sc.caseTitle)}</span>
            <span class="mystery-solved-date">${sc.solvedAt ? sc.solvedAt.slice(0, 10) : ''}</span>
          `;
          solvedList.appendChild(item);
        }
        mysterySection.appendChild(solvedList);
      }

      if (caseSummary.allSolved) {
        const allDone = createElement('div', { className: 'mystery-all-done' });
        allDone.innerHTML = '\u{1F3C6} 全部案件已侦破！你是真正的传奇侦探！';
        mysterySection.appendChild(allDone);
      }

      container.appendChild(mysterySection);
    }

    // ==================== 打卡日历（双月并排 + 心情叠加） ====================
    const moods = await db.getState('moods') || {};
    const calSection = createElement('div', { className: 'stats-section' });
    calSection.innerHTML = '<div class="section-title">&#x1F4C5; 侦探之旅</div>';

    // 概览条
    const totalActiveDays = calendarData.filter(d => d.hasActivity).length;
    const totalStars = calendarData.reduce((s, d) => s + d.stars, 0);
    const journeyBar = createElement('div', { className: 'journey-bar' });
    journeyBar.innerHTML = `
      <span>${calendarData.length}天旅程</span>
      <span class="journey-bar-sep">|</span>
      <span>${totalActiveDays}天打卡</span>
      <span class="journey-bar-sep">|</span>
      <span>${totalStars}星</span>
    `;
    calSection.appendChild(journeyBar);

    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const colorStops = [
      [235, 250, 240], [187, 247, 208], [134, 224, 167],
      [74, 200, 120], [34, 170, 80], [139, 92, 246],
    ];

    function buildMonthGrid(monthKey, monthLabel, days) {
      const col = createElement('div', { className: 'cal-split-col' });

      // 月头
      const header = createElement('div', { className: 'cal-split-header' });
      const mStars = days.reduce((s, d) => s + d.stars, 0);
      const mActive = days.filter(d => d.hasActivity).length;
      header.textContent = `${monthLabel}  ${mStars}星 ${mActive}天`;
      col.appendChild(header);

      // 星期头
      const wh = createElement('div', { className: 'cal-split-week' });
      weekDays.forEach(d => wh.appendChild(createElement('span', {}, d)));
      col.appendChild(wh);

      // 填充月初空白
      let row = createElement('div', { className: 'cal-split-row' });
      const firstDow = new Date(days[0].date + 'T00:00:00').getDay();
      for (let i = 0; i < firstDow; i++) {
        row.appendChild(createElement('div', { className: 'cal-s2-cell cal-s2-empty' }));
      }

      for (const day of days) {
        const dow = new Date(day.date + 'T00:00:00').getDay();
        if (dow === 0 && row.children.length > 0) {
          while (row.children.length < 7) row.appendChild(createElement('div', { className: 'cal-s2-cell cal-s2-empty' }));
          col.appendChild(row);
          row = createElement('div', { className: 'cal-split-row' });
        }

        const cls = ['cal-s2-cell'];
        if (day.isToday) cls.push('cal-s2-today');
        if (day.isSunday) cls.push('cal-s2-sun');
        if (day.isTravel) cls.push('cal-s2-travel');
        if (day.hasActivity) cls.push('cal-s2-on');

        const cell = createElement('div', {
          className: cls.join(' '),
          title: `${fmtDate(day.date)}  ${day.stars}星 ${day.count}项`,
        });

        // 日期数字 + 心情（分层显示）
        const dayNum = day.date.slice(8).replace(/^0/, '');
        const moodId = moods[day.date];
        const mood = moodId ? MOODS.find(m => m.id === moodId) : null;

        if (day.hasActivity) {
          const idx = Math.min(Math.floor(day.stars / 8 * (colorStops.length - 1)), colorStops.length - 1);
          const [r, g, b] = colorStops[idx];
          cell.style.background = `rgb(${r},${g},${b})`;
          cell.style.color = idx >= 4 ? '#fff' : '#374151';
        } else if (day.isSunday) {
          cell.style.background = '#F1F5F9';
          cell.style.color = '#94A3B8';
        } else if (day.isTravel) {
          cell.style.background = '#FEF9C3';
          cell.style.color = '#B45309';
        } else {
          cell.style.background = '#F8FAFC';
          cell.style.color = '#9CA3AF';
        }

        // 心情（中间）+ 日期（底部）
        cell.innerHTML = mood
          ? `<span class="cal-date-num">${dayNum}</span><span class="cal-mood-emoji">${mood.icon}</span><span class="cal-mood-label">${mood.label}</span>`
          : `<span class="cal-date-num">${dayNum}</span>`;

        cell.title = `${fmtDate(day.date)}${day.hasActivity ? '  ' + day.stars + '星 ' + day.count + '项' : ''}${mood ? '  ' + mood.label : ''}`;

        row.appendChild(cell);
      }

      while (row.children.length < 7) row.appendChild(createElement('div', { className: 'cal-s2-cell cal-s2-empty' }));
      col.appendChild(row);
      return col;
    }

    // 按月拆分数据
    const month07 = calendarData.filter(d => d.date.startsWith('2026-07'));
    const month08 = calendarData.filter(d => d.date.startsWith('2026-08'));

    const splitCard = createElement('div', { className: 'calendar-split' });
    splitCard.appendChild(buildMonthGrid('07', '七月', month07));
    splitCard.appendChild(buildMonthGrid('08', '八月', month08));
    calSection.appendChild(splitCard);

    // 图例
    const legend = createElement('div', { className: 'cal-split-legend' });
    legend.innerHTML = `
      <span>少</span>
      <span class="cal-split-dot" style="background:rgb(187,247,208)"></span>
      <span class="cal-split-dot" style="background:rgb(134,224,167)"></span>
      <span class="cal-split-dot" style="background:rgb(74,200,120)"></span>
      <span class="cal-split-dot" style="background:rgb(34,170,80)"></span>
      <span class="cal-split-dot" style="background:rgb(139,92,246)"></span>
      <span>多</span>
    `;
    calSection.appendChild(legend);

    container.appendChild(calSection);

    // ==================== 每周小结 ====================
    const weeklySection = createElement('div', { className: 'stats-section' });
    weeklySection.innerHTML = '<div class="section-title">&#x1F4C6; 每周小结</div>';

    // 按周分组
    const weeks = {};
    for (const day of calendarData) {
      const d = new Date(day.date + 'T00:00:00');
      // 以周一为每周起始
      const dayOfWeek = d.getDay();
      const monday = new Date(d);
      monday.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      const weekKey = monday.toISOString().slice(0, 10);
      if (!weeks[weekKey]) weeks[weekKey] = { start: weekKey, days: [], stars: 0, active: 0 };
      weeks[weekKey].days.push(day);
      if (day.hasActivity) {
        weeks[weekKey].stars += day.stars;
        weeks[weekKey].active++;
      }
    }

    // 获取破案记录
    const caseClosed = await db.getState('case_closed') || {};
    const weeklyCaseList = await mystery.getSolvedCases();

    const weekKeys = Object.keys(weeks).sort();
    // 只显示有活动的周或有数据的周
    const activeWeeks = weekKeys.filter(k => weeks[k].active > 0 || weeks[k].days.some(d => d.isToday));

    if (activeWeeks.length > 0) {
      const weekGrid = createElement('div', { className: 'week-summary-grid' });

      for (const wk of activeWeeks.slice(-6)) { // 最近6周
        const w = weeks[wk];
        if (w.active === 0 && !w.days.some(d => d.isToday)) continue;

        // 计算这周破案数
        const weekEnd = new Date(wk);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const weekEndStr = weekEnd.toISOString().slice(0, 10);
        const weekSolved = weeklyCaseList.filter(c => c.solvedAt && c.solvedAt.slice(0, 10) >= wk && c.solvedAt.slice(0, 10) <= weekEndStr).length;

        const weekCard = createElement('div', { className: 'week-card' });
        const isCurrentWeek = w.days.some(d => d.isToday);
        weekCard.innerHTML = `
          <div class="week-card-header ${isCurrentWeek ? 'week-current' : ''}">
            ${wk.slice(5)} 起
            ${isCurrentWeek ? '<span class="week-current-badge">本周</span>' : ''}
          </div>
          <div class="week-card-stats">
            <div class="week-stat">
              <div class="week-stat-val">${w.active}</div>
              <div class="week-stat-lbl">打卡天</div>
            </div>
            <div class="week-stat">
              <div class="week-stat-val">${w.stars}</div>
              <div class="week-stat-lbl">星星</div>
            </div>
            <div class="week-stat">
              <div class="week-stat-val">${weekSolved}</div>
              <div class="week-stat-lbl">破案</div>
            </div>
          </div>
        `;
        weekGrid.appendChild(weekCard);
      }

      weeklySection.appendChild(weekGrid);
    } else {
      const emptyW = createElement('div', { className: 'achievements-empty' });
      emptyW.innerHTML = '<p>开始打卡后这里会显示每周小结</p>';
      weeklySection.appendChild(emptyW);
    }

    container.appendChild(weeklySection);

    // ==================== 学科技能环 ====================
    const subjSection = createElement('div', { className: 'stats-section' });
    subjSection.innerHTML = '<div class="section-title">&#x1F4CA; 学科进度</div>';

    const ringsGrid = createElement('div', { className: 'skill-rings' });
    const circumference = 2 * Math.PI * 36; // r=36

    for (const subj of SUBJECTS) {
      const ss = stats.subjectStats[subj.id];
      if (!ss) continue;

      const pct = ss.percentage || 0;
      const offset = circumference * (1 - pct / 100);
      const hasProgress = pct > 0;

      const card = createElement('div', { className: 'skill-ring-card' });

      card.innerHTML = `
        <svg class="skill-ring-svg ${hasProgress ? 'skill-ring-glow' : ''}" viewBox="0 0 80 80">
          <defs>
            <filter id="glow_${subj.id}">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <circle cx="40" cy="40" r="34" fill="none" stroke="#E2E8F0" stroke-width="5"/>
          ${hasProgress ? `
          <circle cx="40" cy="40" r="34" fill="none" stroke="${subj.color}"
            stroke-width="5" stroke-linecap="round" opacity="0.25"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
            transform="rotate(-90 40 40)" filter="url(#glow_${subj.id})"/>
          ` : ''}
          <circle cx="40" cy="40" r="34" fill="none" stroke="${subj.color}"
            stroke-width="5" stroke-linecap="round"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
            transform="rotate(-90 40 40)"
            style="transition: stroke-dashoffset 0.8s ease;"/>
          <text x="40" y="38" text-anchor="middle" font-size="18" fill="#374151">${subj.icon}</text>
          <text x="40" y="54" text-anchor="middle" font-size="10" font-weight="700" fill="${subj.color}">
            ${ss.totalTasks > 0 ? pct + '%' : ''}
          </text>
        </svg>
        <div class="skill-ring-info">
          <div class="skill-ring-name">${escapeHtml(subj.name)}</div>
          <div class="skill-ring-stats">
            ${ss.totalTasks > 0 ? `<span>${ss.completedUnique}/${ss.totalTasks} 项</span>` : `<span>打卡${ss.records}次</span>`}
            <span>${ss.stars} 星</span>
            ${ss.totalTasks > 0 ? `<span>${pct}%</span>` : ''}
          </div>
        </div>
      `;
      ringsGrid.appendChild(card);
    }

    subjSection.appendChild(ringsGrid);
    container.appendChild(subjSection);

    // ==================== 成就徽章 ====================
    const achSection = createElement('div', { className: 'stats-section' });
    achSection.innerHTML = '<div class="section-title">&#x1F3C6; 成就徽章</div>';

    if (achievements.length === 0) {
      const emptyHint = createElement('div', { className: 'achievements-empty' });
      emptyHint.innerHTML = '<p>还没有解锁任何成就，继续努力吧！</p>';
      achSection.appendChild(emptyHint);
    } else {
      const achGrid = createElement('div', { className: 'achievements-grid' });
      for (const ach of achievements) {
        const badge = createElement('div', { className: 'achievement-badge' });
        badge.innerHTML = `
          <div class="achievement-badge-icon">${ach.icon}</div>
          <div class="achievement-badge-title">${escapeHtml(ach.title)}</div>
          <div class="achievement-badge-desc">${escapeHtml(ach.desc)}</div>
          <div class="achievement-badge-date">${ach.unlockedAt || ''}</div>
        `;
        achGrid.appendChild(badge);
      }
      achSection.appendChild(achGrid);
    }

    container.appendChild(achSection);

    // ==================== 学习日记 ====================
    const diarySection = createElement('div', { className: 'stats-section' });
    diarySection.innerHTML = '<div class="section-title">&#x1F4DD; 探案笔记（学习日记）</div>';

    const diary = await db.getState('diary') || {};
    const diaryKeys = Object.keys(diary).sort().reverse();

    if (diaryKeys.length === 0) {
      const emptyDiary = createElement('div', { className: 'achievements-empty' });
      emptyDiary.innerHTML = '<p>还没有写过探案笔记，完成一天的所有任务后可以记录心得哦！</p>';
      diarySection.appendChild(emptyDiary);
    } else {
      const diaryList = createElement('div', { className: 'diary-list' });
      for (const d of diaryKeys.slice(0, 14)) {
        const entry = diary[d];
        if (!entry || !entry.text) continue;
        const diaryItem = createElement('div', { className: 'diary-item' });
        diaryItem.innerHTML = `
          <div class="diary-item-date">${fmtDate(d)}</div>
          <div class="diary-item-text">${escapeHtml(entry.text)}</div>
          ${entry.stars ? '<div class="diary-item-stars">&#x2B50; +' + entry.stars + '</div>' : ''}
        `;
        diaryList.appendChild(diaryItem);
      }
      diarySection.appendChild(diaryList);
    }

    container.appendChild(diarySection);

    // ==================== 数据备份/恢复 ====================
    const backupSection = createElement('div', { className: 'stats-section' });
    backupSection.innerHTML = '<div class="section-title">&#x1F4C1; 数据管理</div>';

    const backupActions = createElement('div', { className: 'backup-actions' });
    backupActions.innerHTML = `
      <p class="backup-hint">定期备份数据，防止丢失。数据仅存储在本设备浏览器中。</p>
      <div class="backup-buttons">
        <button class="btn btn-primary backup-btn-export">&#x1F4E5; 导出备份</button>
        <button class="btn btn-secondary backup-btn-import">&#x1F4E4; 导入恢复</button>
      <input type="file" id="backupFileInput" accept=".json" style="display:none;">
    `;

    const exportBtn = backupActions.querySelector('.backup-btn-export');
    const importBtn = backupActions.querySelector('.backup-btn-import');
    const fileInput = backupActions.querySelector('#backupFileInput');

    exportBtn.addEventListener('click', async () => {
      try {
        const allProgress = await db.getAllProgress();
        const achievements = await db.getAchievements();
        const suggested = await db.getAllSuggested();
        const diary = await db.getState('diary') || {};
        const blindboxHistory = await db.getState('blindbox_history') || [];
        const caseClosed = await db.getState('case_closed') || {};

        const backup = {
          version: 1,
          exportedAt: new Date().toISOString(),
          progress: allProgress,
          achievements,
          suggested,
          diary,
          blindboxHistory,
          caseClosed,
        };

        const json = JSON.stringify(backup, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `detective_backup_${todayStr()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('备份文件已下载！', 'success');
      } catch (e) {
        showToast('导出失败: ' + e.message, 'error');
      }
    });

    importBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const backup = JSON.parse(text);

        if (!backup.version || !backup.progress) {
          throw new Error('备份文件格式不正确');
        }

        const confirmed = await new Promise(resolve => {
          if (confirm('导入将覆盖当前所有数据，确定继续吗？')) {
            resolve(true);
          } else {
            resolve(false);
          }
        });

        if (!confirmed) {
          fileInput.value = '';
          return;
        }

        // 清空现有数据并导入
        const dbi = db.getDB();
        if (!dbi) throw new Error('数据库未初始化');
        const tx = dbi.transaction(['progress', 'achievements', 'suggested', 'state'], 'readwrite');

        // 清空 progress
        const progressStore = tx.objectStore('progress');
        await new Promise((resolve, reject) => {
          const req = progressStore.clear();
          req.onsuccess = resolve;
          req.onerror = reject;
        });

        // 重新导入 progress
        for (const record of backup.progress) {
          const { id, ...rest } = record;
          progressStore.add(rest);
        }

        // 清空并导入 achievements
        const achStore = tx.objectStore('achievements');
        await new Promise((resolve, reject) => {
          const req = achStore.clear();
          req.onsuccess = resolve;
          req.onerror = reject;
        });
        for (const ach of (backup.achievements || [])) {
          achStore.add(ach);
        }

        // 清空并导入 suggested
        const sugStore = tx.objectStore('suggested');
        await new Promise((resolve, reject) => {
          const req = sugStore.clear();
          req.onsuccess = resolve;
          req.onerror = reject;
        });
        for (const sug of (backup.suggested || [])) {
          sugStore.add(sug);
        }

        await new Promise((resolve, reject) => {
          tx.oncomplete = resolve;
          tx.onerror = reject;
        });

        // 恢复 state 数据
        if (backup.diary) await db.setState('diary', backup.diary);
        if (backup.blindboxHistory) await db.setState('blindbox_history', backup.blindboxHistory);
        if (backup.caseClosed) await db.setState('case_closed', backup.caseClosed);

        showToast('数据恢复成功！页面即将刷新...', 'success');
        setTimeout(() => location.reload(), 1500);
      } catch (e) {
        console.error('Import failed:', e);
        showToast('导入失败: ' + e.message, 'error');
      }
    });

    const blindboxSection = createElement('div', { className: 'stats-section' });
    blindboxSection.innerHTML = '<div class="section-title">&#x1F381; 证据陈列室</div>';

    const bbHistory = await db.getState('blindbox_history') || [];
    if (bbHistory.length === 0) {
      const emptyBB = createElement('div', { className: 'achievements-empty' });
      emptyBB.innerHTML = '<p>还没有收集到证物，多完成任务来发现线索吧！</p>';
      blindboxSection.appendChild(emptyBB);
    } else {
      const bbGrid = createElement('div', { className: 'achievements-grid' });
      for (const bb of bbHistory.slice(0, 12)) {
        const bbBadge = createElement('div', { className: 'achievement-badge' });
        bbBadge.innerHTML = `
          <div class="achievement-badge-icon">${bb.icon || '&#x1F381;'}</div>
          <div class="achievement-badge-title">${escapeHtml(bb.title || '神秘证物')}</div>
          <div class="achievement-badge-desc">${escapeHtml(bb.desc || '')}</div>
        `;
        bbGrid.appendChild(bbBadge);
      }
      blindboxSection.appendChild(bbGrid);
    }

    container.appendChild(blindboxSection);

  } catch (e) {
    console.error('renderTabStats failed:', e);
    showError(container, `统计加载失败: ${e.message}`, () => renderTabStats(container));
  }
}
