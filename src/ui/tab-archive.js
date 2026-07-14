/**
 * 档案/过滤标签页
 * - 按学科/日期查看已完成任务
 * - 搜索和过滤
 * - 证物记录
 */

import { CONFIG, SUBJECTS, SPORTS, getSubject } from '../config.js';
import { todayStr, fmtDate, getAllLearningDays } from '../core/engine.js';
import { TASKS, DAILY_TASKS, CHAPTER_REF } from '../data/tasks.js';
import * as db from '../data/db.js';
import * as progress from '../core/progress.js';
import * as blindbox from '../core/blindbox.js';
import {
  escapeHtml, showToast, showConfirm, showLoading, showError, showEmpty,
  createElement, clearElement, $, $$, animateElement
} from './components.js';
import { playFailSound } from '../audio/sounds.js';

export async function renderTabArchive(container) {
  if (!container) return;

  try {
    showLoading(container);

    const allProgress = await db.getAllProgress();

    container.innerHTML = '';

    // 标题 + 统计概览
    const header = createElement('div', { className: 'archive-header' });
    const totalStars = allProgress.reduce((s, r) => s + (r.stars || 0), 0);
    const doneDates = [...new Set(allProgress.map(r => r.date))];
    header.innerHTML = `
      <h2 class="archive-title">&#x1F4DA; 探案档案</h2>
      <div class="archive-summary">
        <span class="archive-stat">&#x2705; ${allProgress.length} 项</span>
        <span class="archive-stat">&#x2B50; ${totalStars} 星</span>
        <span class="archive-stat">&#x1F4C5; ${doneDates.length} 天</span>
      </div>
    `;
    container.appendChild(header);

    // 学科完成概览
    const overviewBar = createElement('div', { className: 'archive-overview' });
    const tasks = TASKS || [];
    for (const subj of SUBJECTS) {
      const subjRecords = allProgress.filter(r => r.subjectId === subj.id);
      const total = tasks.filter(t => t.subject === subj.id).length;
      const done = new Set(subjRecords.map(r => r.taskId)).size;
      if (total > 0) {
        const pct = Math.round(done / total * 100);
        overviewBar.innerHTML += `
          <div class="archive-overview-item">
            <span class="archive-overview-icon">${subj.icon}</span>
            <span class="archive-overview-name">${subj.name}</span>
            <span class="archive-overview-count">${done}/${total}</span>
            <span class="archive-overview-bar"><span class="archive-overview-fill" style="width:${pct}%;background:${subj.color};"></span></span>
          </div>`;
      }
    }
    container.appendChild(overviewBar);

    // 筛选栏
    const filterBar = createElement('div', { className: 'archive-filter-bar' });
    filterBar.innerHTML = `
      <input type="text" class="archive-search-input" placeholder="搜索任务...">
      <select class="archive-filter-select">
        <option value="">全部学科</option>
        ${SUBJECTS.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('')}
      </select>
      <select class="archive-sort-select">
        <option value="date-desc">最新优先</option>
        <option value="date-asc">最早优先</option>
        <option value="stars-desc">星星最多</option>
      </select>
    `;
    container.appendChild(filterBar);

    // 任务列表容器
    const listContainer = createElement('div', { className: 'archive-list' });
    container.appendChild(listContainer);

    // 渲染列表
    renderArchiveList(listContainer, allProgress, '', '', 'date-desc');

    // 事件绑定
    const searchInput = filterBar.querySelector('.archive-search-input');
    const filterSelect = filterBar.querySelector('.archive-filter-select');
    const sortSelect = filterBar.querySelector('.archive-sort-select');

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderArchiveList(listContainer, allProgress, searchInput.value, filterSelect.value, sortSelect.value);
      });
    }
    if (filterSelect) {
      filterSelect.addEventListener('change', () => {
        renderArchiveList(listContainer, allProgress, searchInput.value, filterSelect.value, sortSelect.value);
      });
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        renderArchiveList(listContainer, allProgress, searchInput.value, filterSelect.value, sortSelect.value);
      });
    }

    // 证物记录
    const bbHistory = await blindbox.getBlindBoxHistory();
    const bbSection = createElement('div', { className: 'archive-section' });
    bbSection.innerHTML = '<div class="section-title">&#x1F381; 证物记录</div>';

    if (bbHistory.length === 0) {
      const emptyBB = createElement('div', { className: 'achievements-empty' });
      emptyBB.innerHTML = '<p>还没有收集到证物，多完成任务来发现线索吧！</p>';
      bbSection.appendChild(emptyBB);
    } else {
      const bbGrid = createElement('div', { className: 'achievements-grid' });
      for (const item of bbHistory.slice(0, 24)) {
        const bbBadge = createElement('div', { className: 'achievement-badge' });
        bbBadge.innerHTML = `
          <div class="achievement-badge-icon">${item.icon || '&#x1F381;'}</div>
          <div class="achievement-badge-title">${escapeHtml(item.title || '神秘证物')}</div>
          <div class="achievement-badge-desc">${escapeHtml(item.desc || '')}</div>
          <div class="achievement-badge-date">${item.openedAt ? item.openedAt.slice(0, 10) : ''}</div>
        `;
        bbGrid.appendChild(bbBadge);
      }
      bbSection.appendChild(bbGrid);
    }

    container.appendChild(bbSection);

  } catch (e) {
    console.error('renderTabArchive failed:', e);
    showError(container, `档案加载失败: ${e.message}`, () => renderTabArchive(container));
  }
}

function resolveTaskTitle(record) {
  const taskId = record.taskId;

  // 特别行动（自定义任务）
  if (taskId.startsWith('ot_')) {
    return record.customTitle || '特别行动';
  }

  // 体育运动
  if (taskId.startsWith('sp_')) {
    const sportId = taskId.replace('sp_', '');
    const sport = SPORTS.find(s => s.id === sportId);
    return sport ? sport.name : taskId;
  }

  // 每日固定任务: daily_<subject>_<subId>
  if (taskId.startsWith('daily_')) {
    const parts = taskId.split('_');
    if (parts.length >= 3) {
      const subjId = parts[1];
      const dailyId = parts.slice(2).join('_');
      const list = DAILY_TASKS[subjId];
      if (list) {
        const dt = list.find(d => d.id === dailyId);
        if (dt) return dt.title;
      }
    }
    return taskId;
  }

  // 章节任务: ch_<subject>_<chIdx>_<itemIdx>
  if (taskId.startsWith('ch_')) {
    const parts = taskId.split('_');
    if (parts.length >= 4) {
      const subjId = parts[1];
      const chIdx = parseInt(parts[2], 10);
      const itemIdx = parseInt(parts[3], 10);
      const chapters = CHAPTER_REF[subjId];
      if (chapters && chapters[chIdx] && chapters[chIdx].items[itemIdx]) {
        return chapters[chIdx].items[itemIdx];
      }
    }
    return taskId;
  }

  // 背诵任务（TASKS）
  const task = TASKS.find(t => t.id === taskId);
  if (task) return task.title;

  return record.customTitle || taskId;
}

function renderArchiveList(container, allProgress, search = '', filter = '', sort = 'date-desc') {
  if (!container) return;
  clearElement(container);

  let filtered = [...allProgress];

  if (filter) {
    filtered = filtered.filter(r => r.subjectId === filter);
  }

  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(r => {
      const title = resolveTaskTitle(r);
      return title.toLowerCase().includes(lower);
    });
  }

  filtered.sort((a, b) => {
    if (sort === 'date-asc') return a.date.localeCompare(b.date);
    if (sort === 'stars-desc') return b.stars - a.stars || b.date.localeCompare(a.date);
    return b.date.localeCompare(a.date);
  });

  if (filtered.length === 0) {
    showEmpty(container, '没有找到匹配的记录');
    return;
  }

  // 按日期分组
  let currentDate = '';
  let dateGroup = null;
  for (const record of filtered) {
    if (record.date !== currentDate) {
      currentDate = record.date;
      // 日期卡片
      dateGroup = createElement('div', { className: 'archive-date-card' });
      const dayStars = filtered.filter(r => r.date === currentDate).reduce((s, r) => s + (r.stars || 0), 0);
      dateGroup.innerHTML = `
        <div class="archive-date-card-header">
          <span class="archive-date-label">${fmtDate(record.date)}</span>
          <span class="archive-date-stars">&#x2B50; ${dayStars} 星</span>
        </div>
        <div class="archive-date-card-grid"></div>
      `;
      container.appendChild(dateGroup);
    }

    const task = TASKS.find(t => t.id === record.taskId);
    const subj = getSubject(record.subjectId);
    const title = resolveTaskTitle(record);

    const item = createElement('div', { className: 'archive-item' });
    item.innerHTML = `
      <div class="archive-item-dot" style="background:${subj ? subj.color : '#94A3B8'};"></div>
      <div class="archive-item-info">
        <div class="archive-item-title">${escapeHtml(title)}</div>
        <div class="archive-item-meta">
          <span style="color:${subj ? subj.color : '#94A3B8'};">${subj ? subj.icon + ' ' + subj.name : '🎯 特别行动'}</span>
          ${record.stars > 0 ? `<span>&#x2B50; ${record.stars}</span>` : ''}
        </div>
      </div>
      <div class="archive-item-undo" title="撤回">&#x21A9;</div>
    `;

    item.addEventListener('click', async () => {
      const confirmed = await showConfirm('撤回确认', `确定要撤回「${title}」的打卡记录吗？星星也将被收回。`);
      if (!confirmed) return;
      try {
        const result = await progress.undoTask(record.taskId, record.date);
        if (result.state.action === 'undone') {
          playFailSound();
          showToast(`已撤回「${title}」`);
          const archiveContainer = document.querySelector('#tabArchive');
          if (archiveContainer) renderTabArchive(archiveContainer);
        }
      } catch (e) {
        showToast(`撤回失败: ${e.message}`, 'error');
      }
    });

    const grid = dateGroup.querySelector('.archive-date-card-grid');
    if (grid) grid.appendChild(item);
  }
}
