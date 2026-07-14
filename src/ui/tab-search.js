/**
 * 打卡主标签页 - MOST CRITICAL
 * 渲染所有任务类型: 背诵、章节、运动、自定义
 * 支持完成/撤销、盲盒触发、建议任务
 */

import { CONFIG, SUBJECTS, SPORTS, getSubject } from '../config.js';
import { todayStr, fmtDate, isSunday, isTravel, isSaturday, isDateInRange, getDayIndex } from '../core/engine.js';
import { TASKS, getReciteTasks, getChapterTasks, DAILY_TASKS, getDailyTasksForSubject } from '../data/tasks.js';
import { ENCOURAGES, MOODS, DAILY_QUOTES } from '../data/blindboxes.js';
import { HOMEWORK } from '../data/homework.js';
import * as db from '../data/db.js';
import * as progress from '../core/progress.js';
import * as blindbox from '../core/blindbox.js';
import * as mystery from '../core/mystery.js';
import { getCurrentDateForHeader, renderHeaderStats } from './header.js';
import {
  showToast, showStarToast, showBlindBoxReveal, showAchievementModal,
  showConfirm, showModal, showCaseClosedStamp, showStarFly, applyStreakGlow,
  escapeHtml, $, $$, createElement, clearElement,
  showLoading, showError, showEmpty, animateElement, bounceIn, shake
} from './components.js';
import { playCompleteSound, playStarSound, playBlindBoxOpenSound, playAchievementSound, playFailSound } from '../audio/sounds.js';

// ==================== 主渲染 ====================

export async function renderTabSearch(container, dateStr, keepScroll = false) {
  if (!container) return;
  const date = dateStr || getCurrentDateForHeader() || todayStr();
  const scrollY = keepScroll ? window.scrollY : 0;

  try {
    showLoading(container);

    const dateProgress = await db.getProgressForDate(date);
    const completedTaskIds = new Set(dateProgress.map(r => r.taskId));

    // 获取今日密令
    const challenge = blindbox.getDailyChallenge(getDayIndex(date));

    container.innerHTML = '';

    // 日期标题
    const header = createElement('div', { className: 'search-header' });
    header.innerHTML = `
      <h2 class="search-date-title">${fmtDate(date)}</h2>
      ${isSunday(date) ? '<div class="search-day-badge badge-rest">&#x1F4A4; 休息日</div>' : ''}
      ${isTravel(date) ? '<div class="search-day-badge badge-travel">&#x2708; 旅途中</div>' : ''}
      ${!isDateInRange(date) ? '<div class="search-day-badge badge-future">未开始</div>' : ''}
    `;
    container.appendChild(header);

    // 周日休息页面
    if (isSunday(date)) {
      const sundayPage = createElement('div', { className: 'sunday-page' });
      try {
        const stats = await progress.getStats();
        const recentDiary = await db.getState('diary') || {};
        const recentDates = Object.keys(recentDiary).sort().reverse().slice(0, 3);

        sundayPage.innerHTML = `
          <div class="sunday-icon">&#x1F3D6;</div>
          <h2 class="sunday-title">侦探休息日</h2>
          <p class="sunday-subtitle">今天是周日，好好休息，养精蓄锐！</p>
          <div class="sunday-stats-grid">
            <div class="sunday-stat">
              <div class="sunday-stat-value">${stats.streak}</div>
              <div class="sunday-stat-label">连续打卡</div>
            </div>
            <div class="sunday-stat">
              <div class="sunday-stat-value">${stats.totalStars}</div>
              <div class="sunday-stat-label">累计星星</div>
            </div>
            <div class="sunday-stat">
              <div class="sunday-stat-value">${stats.activeDays}</div>
              <div class="sunday-stat-label">活跃天数</div>
            </div>
            <div class="sunday-stat">
              <div class="sunday-stat-value">${stats.reciteCompleted}/${stats.reciteTotal}</div>
              <div class="sunday-stat-label">背诵完成</div>
            </div>
          </div>
          ${recentDates.length > 0 ? `
            <div class="sunday-diary-section">
              <h3>&#x1F4DD; 最近探案笔记</h3>
              ${recentDates.map(d => `
                <div class="sunday-diary-item">
                  <div class="sunday-diary-date">${fmtDate(d)}</div>
                  <div class="sunday-diary-text">${escapeHtml((recentDiary[d]?.text || '').slice(0, 100))}${(recentDiary[d]?.text || '').length > 100 ? '...' : ''}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          <p class="sunday-encourage">&#x1F31F; 休息是为了走更远的路，明天继续加油！</p>
        `;
      } catch (e) {
        sundayPage.innerHTML = `
          <div class="sunday-icon">&#x1F3D6;</div>
          <h2 class="sunday-title">侦探休息日</h2>
          <p class="sunday-subtitle">今天是周日，好好休息，养精蓄锐！</p>
        `;
      }
      container.appendChild(sundayPage);
      return; // 周日不渲染其他内容
    }

    // 头像（可上传自定义画像）
    if (isDateInRange(date) && !isSunday(date)) {
      const avatar = await db.getState('avatar') || '';
      const avatarSection = createElement('div', { className: 'search-section avatar-section' });
      avatarSection.innerHTML = `
        <div class="avatar-wrapper" id="avatarWrapper" title="点击上传你的画像">
          ${avatar
            ? `<img src="${avatar}" class="avatar-img" alt="我的画像">`
            : '<div class="avatar-placeholder">&#x1F575;</div>'
          }
          <div class="avatar-edit-hint">&#x270F;</div>
        </div>
        <input type="file" accept="image/*" id="avatarInput" style="display:none;">
      `;
      container.appendChild(avatarSection);

      const avatarWrapper = avatarSection.querySelector('#avatarWrapper');
      const avatarInput = avatarSection.querySelector('#avatarInput');

      avatarWrapper.addEventListener('click', () => avatarInput.click());
      avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
          await db.setState('avatar', reader.result);
          avatarWrapper.innerHTML = `
            <img src="${reader.result}" class="avatar-img" alt="我的画像">
            <div class="avatar-edit-hint">&#x270F;</div>
          `;
        };
        reader.readAsDataURL(file);
      });
    }

    // 每日金句 + 情绪（并排）
    if (isDateInRange(date) && !isSunday(date)) {
      const dailyQuotes = await db.getState('daily_quotes') || {};
      const drawnQuote = dailyQuotes[date];
      const moodData = await db.getState('moods') || {};
      const todayMood = moodData[date];

      const row = createElement('div', { className: 'search-section' });
      row.innerHTML = `
        <div class="daily-row">
          <!-- 抽签区 -->
          <div class="daily-quote-draw ${drawnQuote ? 'drawn' : ''}" id="quoteDraw">
            ${drawnQuote ? `
              <div class="quote-fortune-paper">
                <div class="quote-fortune-label">&#x1F340; 今日好运</div>
                <div class="quote-fortune-text">${escapeHtml(drawnQuote)}</div>
              </div>
            ` : `
              <div class="quote-draw-prompt">
                <div class="quote-draw-icon">&#x1F3F7;</div>
                <div class="quote-draw-label">今日好运</div>
                <button class="btn btn-primary btn-draw-quote" id="btnDrawQuote">&#x1F331; 抽签</button>
              </div>
            `}
          </div>
          <!-- 心情区 -->
          <div class="daily-mood-panel" id="moodPanel">
            <div class="mood-label">&#x1F3AD; 今日心情</div>
            <div class="mood-options">
              ${MOODS.map(m => `
                <button class="mood-btn ${todayMood === m.id ? 'mood-selected' : ''}" data-mood="${m.id}">
                  <span class="mood-btn-icon">${m.icon}</span>
                  <span class="mood-btn-label">${m.label}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      container.appendChild(row);

      // 抽签按钮
      const drawBtn = row.querySelector('#btnDrawQuote');
      if (drawBtn) {
        drawBtn.addEventListener('click', async () => {
          // 不重复抽签：记录已抽索引，抽完一轮后自动重置
          const drawnIndices = await db.getState('drawn_quote_indices') || [];
          let available = [];
          for (let i = 0; i < DAILY_QUOTES.length; i++) {
            if (!drawnIndices.includes(i)) available.push(i);
          }
          // 全部抽完，重置签筒
          if (available.length === 0) {
            drawnIndices.length = 0;
            for (let i = 0; i < DAILY_QUOTES.length; i++) available.push(i);
          }
          const picked = available[Math.floor(Math.random() * available.length)];
          drawnIndices.push(picked);
          await db.setState('drawn_quote_indices', drawnIndices);

          const randomQuote = DAILY_QUOTES[picked];
          dailyQuotes[date] = randomQuote;
          await db.setState('daily_quotes', dailyQuotes);

          // 动画替换
          const drawArea = row.querySelector('#quoteDraw');
          drawArea.classList.add('drawn');
          drawArea.innerHTML = `
            <div class="quote-fortune-paper" style="animation: fortuneReveal 0.5s ease;">
              <div class="quote-fortune-label">&#x1F3F7; 今日金句</div>
              <div class="quote-fortune-text">${escapeHtml(randomQuote)}</div>
            </div>
          `;
        });
      }

      // 情绪按钮
      row.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const moodId = btn.dataset.mood;
          moodData[date] = moodId;
          await db.setState('moods', moodData);
          row.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('mood-selected'));
          btn.classList.add('mood-selected');
        });
      });
    }

    // 每日挑战
    if (challenge && isDateInRange(date) && !isSunday(date) && !isTravel(date)) {
      const challengeSection = createElement('div', { className: 'search-section challenge-section' });
      challengeSection.innerHTML = `
        <div class="section-title">&#x1F3AF; 今日密令</div>
        <div class="challenge-card">
          <div class="challenge-icon">${challenge.icon}</div>
          <div class="challenge-info">
            <div class="challenge-title">${escapeHtml(challenge.title)}</div>
            <div class="challenge-desc">${escapeHtml(challenge.desc)}</div>
          </div>
        </div>
      `;
      container.appendChild(challengeSection);
    }

    // 背诵任务 + 每日固定任务 - 按学科分组（旅游期也显示，周日隐藏）
    if (!isSunday(date)) {
      const reciteSection = createElement('div', { className: 'search-section search-recite' });
      reciteSection.innerHTML = `<div class="section-title">&#x1F4D6; 背诵任务</div>`;

      const reciteSubjects = SUBJECTS.filter(s => s.type === 'recite');
      const saturday = isSaturday(date);
      const travel = isTravel(date);

      for (const subj of reciteSubjects) {
        const tasks = getReciteTasks().filter(t => t.subject === subj.id);
        const doneCount = tasks.filter(t => completedTaskIds.has(t.id)).length;

        const subjBlock = createElement('div', { className: 'subject-block' });
        subjBlock.innerHTML = `
          <div class="subject-header" style="border-left: 4px solid ${subj.color};">
            <span class="subject-icon">${subj.icon}</span>
            <span class="subject-name">${escapeHtml(subj.name)}</span>
            <span class="subject-progress">${doneCount}/${tasks.length}</span>
          </div>
        `;

        const taskList = createElement('div', { className: 'task-list' });
        const INITIAL_SHOW = 3;

        // 只显示前 N 条未完成任务，已完成的不显示
        const pendingTasks = tasks.filter(t => !completedTaskIds.has(t.id));
        const visiblePending = pendingTasks.slice(0, INITIAL_SHOW);
        const hiddenPending = pendingTasks.slice(INITIAL_SHOW);

        for (const task of visiblePending) {
          taskList.appendChild(createTaskCard(task, false, date));
        }

        if (hiddenPending.length > 0) {
          const collapseContent = createElement('div', { className: 'task-collapse-content', style: { display: 'none' } });
          for (const task of hiddenPending) {
            collapseContent.appendChild(createTaskCard(task, false, date));
          }

          const expandBtn = createElement('button', {
            className: 'btn-task-expand',
            onClick: function () {
              const isOpen = collapseContent.style.display !== 'none';
              collapseContent.style.display = isOpen ? 'none' : 'block';
              this.innerHTML = isOpen ? `展开全部 (${hiddenPending.length}条) ▼` : `收起 ▲`;
            }
          }, `展开全部 (${hiddenPending.length}条) ▼`);

          taskList.appendChild(collapseContent);
          taskList.appendChild(expandBtn);
        }

        // 每日固定任务（旅游期仅显示英语每日任务）
        if (!travel || subj.id === 'en') {
          const dailyTasks = getDailyTasksForSubject(subj.id, date, saturday);
          for (const dt of dailyTasks) {
            const dailyTaskId = `daily_${dt.id}`;
            const isDone = completedTaskIds.has(dailyTaskId);
            const card = createDailyTaskCard(dt, isDone, date, subj);
            if (isDone) card.classList.add('task-done');
            taskList.appendChild(card);
          }
        }

        subjBlock.appendChild(taskList);
        reciteSection.appendChild(subjBlock);
      }

      container.appendChild(reciteSection);
    }

    // 体能训练
    if (!isSunday(date) && !isTravel(date)) {
      const sportSection = createElement('div', { className: 'search-section' });
      sportSection.innerHTML = `<div class="section-title">&#x1F3C3; 体能训练</div>`;
      const sportList = createElement('div', { className: 'task-list horizontal-list' });

      for (const sport of SPORTS) {
        const sportTaskId = `sp_${sport.id}`;
        const isDone = completedTaskIds.has(sportTaskId);
        const card = createSportCard(sport, isDone, date);
        sportList.appendChild(card);
      }

      sportSection.appendChild(sportList);
      container.appendChild(sportSection);
    }

    // 章节任务 (数学/物理) - 旅游期隐藏
    if (!isSunday(date) && !isTravel(date)) {
      const chapterSection = createElement('div', { className: 'search-section' });
      chapterSection.innerHTML = `<div class="section-title">&#x1F4D0; 学科任务</div>`;

      const chapterSubjects = SUBJECTS.filter(s => s.type === 'chapter');
      for (const subj of chapterSubjects) {
        const chapterGroups = progress.getChapterTasksForSubject(subj.id, date);
        if (!chapterGroups || chapterGroups.length === 0) continue;

        // 计算总完成度
        let totalItems = 0;
        let doneItems = 0;
        for (const group of chapterGroups) {
          for (const item of group.items) {
            totalItems++;
            if (completedTaskIds.has(item.id)) doneItems++;
          }
        }

        const subjBlock = createElement('div', { className: 'subject-block chapter-subject-block' });
        subjBlock.innerHTML = `
          <div class="subject-header chapter-subject-header" style="border-left: 4px solid ${subj.color};">
            <span class="subject-icon">${subj.icon}</span>
            <span class="subject-name">${escapeHtml(subj.name)}</span>
            <span class="subject-progress">${doneItems}/${totalItems}节</span>
          </div>
        `;

        // 渲染每个章节组（可折叠）
        for (const group of chapterGroups) {
          const groupDone = group.items.filter(it => completedTaskIds.has(it.id)).length;
          const groupTotal = group.items.length;
          const groupEl = createElement('div', { className: 'chapter-group' });
          groupEl.innerHTML = `
            <div class="chapter-group-header" data-chapter-group="${subj.id}_${group.chapterIndex}">
              <span class="chapter-group-arrow">&#9654;</span>
              <span class="chapter-group-title">${escapeHtml(group.chapterTitle)}</span>
              <span class="chapter-group-progress">${groupDone}/${groupTotal}</span>
            </div>
            <div class="chapter-group-items" id="ch_group_${subj.id}_${group.chapterIndex}" style="display:none;">
              ${group.items.map(item => {
                const isItemDone = completedTaskIds.has(item.id);
                return `
                  <div class="chapter-item ${isItemDone ? 'chapter-item-done' : ''}" data-task-id="${item.id}">
                    <div class="chapter-item-check ${isItemDone ? 'checked' : ''}">
                      ${isItemDone ? '&#x2705;' : ''}
                    </div>
                    <span class="chapter-item-title">${escapeHtml(item.title)}</span>
                    ${isItemDone ? '<span class="chapter-item-date">已完成</span>' : ''}
                  </div>
                `;
              }).join('')}
            </div>
          `;

          // 点击章节标题展开/折叠
          const header = groupEl.querySelector('.chapter-group-header');
          const itemsContainer = groupEl.querySelector('.chapter-group-items');
          const arrow = groupEl.querySelector('.chapter-group-arrow');
          header.addEventListener('click', () => {
            const isOpen = itemsContainer.style.display !== 'none';
            itemsContainer.style.display = isOpen ? 'none' : 'block';
            arrow.textContent = isOpen ? '▶' : '▼';
          });

          // 点击具体小节
          const itemEls = groupEl.querySelectorAll('.chapter-item');
          itemEls.forEach(itemEl => {
            itemEl.addEventListener('click', async () => {
              const taskId = itemEl.dataset.taskId;
              const isDone = completedTaskIds.has(taskId);
              const fakeTask = {
                id: taskId,
                subject: subj.id,
                title: itemEl.querySelector('.chapter-item-title').textContent,
                content: '',
              };
              await handleTaskToggle(fakeTask, isDone, date, itemEl);
            });
          });

          subjBlock.appendChild(groupEl);
        }

        chapterSection.appendChild(subjBlock);
      }

      container.appendChild(chapterSection);
    }

    // 推理按钮：线索集齐，等待侦探来破案
    if (isDateInRange(date) && !isSunday(date)) {
      try {
        const readyCase = await mystery.getReadyCase();
        if (readyCase) {
          const deductionSection = createElement('div', { className: 'search-section deduction-ready-section' });
          deductionSection.innerHTML = `
            <div class="section-title">&#x1F50E; 推理准备就绪</div>
            <div class="deduction-ready-card">
              <div class="deduction-ready-icon">${readyCase.caseData.icon}</div>
              <div class="deduction-ready-info">
                <div class="deduction-ready-title">${escapeHtml(readyCase.caseData.title)}</div>
                <div class="deduction-ready-desc">${escapeHtml(readyCase.caseData.desc)}</div>
                <div class="deduction-ready-clues">已收集 ${readyCase.collectedClueTexts.length}/${readyCase.caseData.cluesNeeded} 条线索</div>
              </div>
              <button class="btn btn-deduction-start">&#x1F50D; 开始推理</button>
            </div>
          `;
          const startBtn = deductionSection.querySelector('.btn-deduction-start');
          startBtn.addEventListener('click', async () => {
            await showDeductionModal(readyCase.caseData, readyCase.collectedClueTexts, date);
            await renderTabSearch(container, date, true);
            const headerStats = document.querySelector('#headerStats');
            if (headerStats) renderHeaderStats(headerStats);
            const sideStats = document.querySelector('#sideStats');
            if (sideStats) renderHeaderStats(sideStats);
          });
          container.appendChild(deductionSection);
        }
      } catch (e) {
        console.error('Deduction check failed:', e);
      }
    }

    // 暑假作业清单（折叠式，按学科展开）
    if (isDateInRange(date) && !isSunday(date)) {
      const allProgress = await db.getAllProgress();
      const hwCompletedIds = new Set(allProgress.filter(r => r.taskId && r.taskId.startsWith('hw_')).map(r => r.taskId));
      const hwDone = HOMEWORK.filter(h => hwCompletedIds.has(h.id)).length;
      const hwTotal = HOMEWORK.length;

      const hwSection = createElement('div', { className: 'search-section' });
      const subjColors = { '语文': '#EF4444', '数学': '#3B82F6', '英语': '#8B5CF6', '道法': '#F59E0B', '历史': '#10B981', '体育': '#06B6D4' };
      const subjects = ['语文', '数学', '英语', '道法', '历史', '体育'];

      // 总进度条
      const pct = hwTotal > 0 ? Math.round(hwDone / hwTotal * 100) : 0;
      hwSection.innerHTML = `
        <div class="section-title" style="cursor:pointer;" id="hwSectionTitle">
          &#x1F4DA; 暑假作业 <span class="hw-progress-badge">${hwDone}/${hwTotal}</span>
          <span style="font-size:11px;color:var(--color-text-muted);margin-left:6px;">&#x25BC; 点击学科展开</span>
        </div>
        <div class="hw-progress-bar"><div class="hw-progress-fill" style="width:${pct}%;"></div></div>
      `;

      const hwList = createElement('div', { className: 'hw-list' });

      for (const subj of subjects) {
        const items = HOMEWORK.filter(h => h.subject === subj);
        if (items.length === 0) continue;
        const subjDone = items.filter(h => hwCompletedIds.has(h.id)).length;

        const subjGroup = createElement('div', { className: 'hw-subject-group' });
        const subjHeader = createElement('div', {
          className: `hw-subject-header ${subjDone === items.length ? 'hw-subject-all-done' : ''}`,
          style: `border-left:3px solid ${subjColors[subj]};`,
        });
        subjHeader.innerHTML = `
          <span class="hw-subj-dot" style="background:${subjColors[subj]};"></span>
          <span class="hw-subj-name">${subj}</span>
          <span class="hw-subj-count">${subjDone}/${items.length}</span>
          <span class="hw-subj-arrow">&#x25B6;</span>
        `;

        const subjItems = createElement('div', { className: 'hw-subject-items', style: 'display:none;' });

        for (const hw of items) {
          const isDone = hwCompletedIds.has(hw.id);
          const item = createElement('div', {
            className: `hw-item ${isDone ? 'hw-done' : ''}`,
            'data-task-id': hw.id,
          });
          item.innerHTML = `
            <div class="hw-item-dot" style="background:${subjColors[subj]};"></div>
            <div class="hw-item-body">
              <div class="hw-item-title">${escapeHtml(hw.title)}</div>
              <div class="hw-item-desc">${escapeHtml(hw.desc)}</div>
            </div>
            <button class="btn-task-toggle ${isDone ? 'btn-task-undo' : 'btn-task-do'}">
              ${isDone ? '&#x2705;' : '&#x2B50;'}
            </button>
          `;

          item.addEventListener('click', () => {
            showModal({
              title: hw.subject + ' - ' + hw.title,
              content: `<div style="font-size:13px;line-height:1.8;white-space:pre-wrap;color:var(--color-text);">${escapeHtml(hw.detail || hw.desc)}</div>`,
              buttons: [{ text: '关闭', cls: 'btn-secondary' }],
            });
          });

          const toggleBtn = item.querySelector('.btn-task-toggle');
          toggleBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (isDone) {
              await progress.undoTask(hw.id, date);
              showToast('已撤销');
              await renderTabSearch(container, date, true);
            } else {
              const result = await progress.completeTask(hw.id, date, { customTitle: hw.title, customContent: hw.desc, subjectId: hw.subject });
              if (result.state.action === 'completed') {
                playCompleteSound();
                showStarToast(1);
                await renderTabSearch(container, date, true);
              }
            }
          });

          subjItems.appendChild(item);
        }

        // 折叠/展开
        subjHeader.addEventListener('click', () => {
          const isOpen = subjItems.style.display !== 'none';
          subjItems.style.display = isOpen ? 'none' : 'block';
          subjHeader.querySelector('.hw-subj-arrow').innerHTML = isOpen ? '&#x25B6;' : '&#x25BC;';
        });

        subjGroup.appendChild(subjHeader);
        subjGroup.appendChild(subjItems);
        hwList.appendChild(subjGroup);
      }

      hwSection.appendChild(hwList);
      container.appendChild(hwSection);
    }

    // 特别行动（自定义任务）
    if (isDateInRange(date)) {
      const customSection = createElement('div', { className: 'search-section' });
      customSection.innerHTML = `<div class="section-title">&#x1F3AF; 特别行动</div>`;
      const customList = createElement('div', { className: 'task-list' });

      // 显示当日已完成的自定义任务
      const customDone = dateProgress.filter(r => r.subjectId === 'ot');
      for (const record of customDone) {
        const card = createCustomDoneCard(record, date);
        customList.appendChild(card);
      }

      // 添加新任务按钮
      const addBtn = createElement('button', {
        className: 'btn btn-add-custom',
        onClick: async () => {
          await handleAddCustomTask(date, container);
        }
      }, '+ 添加特别行动');
      customList.appendChild(addBtn);

      customSection.appendChild(customList);
      container.appendChild(customSection);
    }

    // 今日已完成摘要
    if (dateProgress.length > 0) {
      const summarySection = createElement('div', { className: 'search-section summary-section' });
      const todayStars = dateProgress.reduce((s, r) => s + r.stars, 0);
      summarySection.innerHTML = `
        <div class="section-title">&#x2705; 今日已完成 (${dateProgress.length}项 / &#x2B50;${todayStars}星)</div>
      `;

      // 检查盲盒触发
      try {
        const triggers = await blindbox.checkBlindBoxTrigger(date);
        if (triggers.length > 0) {
          const bbContainer = createElement('div', { className: 'blindbox-triggers' });
          for (const trigger of triggers) {
            const btn = createElement('button', {
              className: 'btn btn-blindbox',
              onClick: async () => {
                playBlindBoxOpenSound();
                await blindbox.addBlindBoxHistory(trigger.box);
                await showBlindBoxReveal(trigger.box, trigger.type === 'box_b' ? 'B' : 'A');
                renderTabSearch(container, date, true);
              }
            }, `${trigger.type === 'box_b' ? '&#x1F50E; 关键证据' : trigger.type === 'bonus' ? '&#x1F3C6; 额外发现' : '&#x1F50D; 日常证物'} - ${escapeHtml(trigger.reason)}`);
            bbContainer.appendChild(btn);
          }
          summarySection.appendChild(bbContainer);
        }
      } catch (e) {
        console.error('Blindbox trigger check failed:', e);
      }

      container.appendChild(summarySection);
    }

    // 探案笔记（学习日记）
    if (isDateInRange(date) && !isSunday(date)) {
      const diarySection = createElement('div', { className: 'search-section diary-write-section' });
      diarySection.innerHTML = '<div class="section-title">&#x1F4DD; 探案笔记</div>';

      const diaryData = await db.getState('diary') || {};
      const todayDiary = diaryData[date];
      const isToday = date === todayStr();

      if (todayDiary && todayDiary.text) {
        // 已有笔记，展示 + 可编辑
        diarySection.innerHTML += `
          <div class="diary-write-card diary-written">
            <div class="diary-write-text">${escapeHtml(todayDiary.text)}</div>
            ${todayDiary.stars ? `<div class="diary-write-stars">&#x2B50; 当天获得 ${todayDiary.stars} 星</div>` : ''}
            <button class="btn btn-secondary diary-edit-btn" style="margin-top:8px;">&#x270F; 修改笔记</button>
          </div>
          <div class="diary-edit-area" style="display:none;">
            <textarea class="diary-textarea" rows="3" maxlength="500">${escapeHtml(todayDiary.text)}</textarea>
            <div class="diary-edit-btns">
              <button class="btn btn-primary diary-save-btn">&#x1F4BE; 保存</button>
              <button class="btn btn-secondary diary-cancel-btn">取消</button>
            </div>
          </div>
        `;
        container.appendChild(diarySection);

        // 事件绑定
        const editBtn = diarySection.querySelector('.diary-edit-btn');
        const editArea = diarySection.querySelector('.diary-edit-area');
        const writtenCard = diarySection.querySelector('.diary-written');
        const saveBtn = diarySection.querySelector('.diary-save-btn');
        const cancelBtn = diarySection.querySelector('.diary-cancel-btn');
        const textarea = diarySection.querySelector('.diary-textarea');

        editBtn.addEventListener('click', () => {
          writtenCard.style.display = 'none';
          editArea.style.display = 'block';
        });

        cancelBtn.addEventListener('click', () => {
          writtenCard.style.display = '';
          editArea.style.display = 'none';
          textarea.value = todayDiary.text;
        });

        saveBtn.addEventListener('click', async () => {
          const text = textarea.value.trim();
          if (!text) return;
          diaryData[date] = { text, stars: todayDiary.stars };
          await db.setState('diary', diaryData);
          showToast('笔记已保存');
          await renderTabSearch(container, date, true);
        });
      } else if (isToday) {
        // 今天还没写，显示输入框
        const todayStars = dateProgress.reduce((s, r) => s + r.stars, 0);
        diarySection.innerHTML += `
          <div class="diary-write-card">
            <textarea class="diary-textarea" id="diaryTextarea" rows="3" maxlength="500" placeholder="记录今天的收获或心得..."></textarea>
            <div class="diary-edit-btns">
              <button class="btn btn-primary diary-save-btn">&#x1F4BE; 记入探案笔记</button>
            </div>
          </div>
        `;
        container.appendChild(diarySection);

        const saveBtn = diarySection.querySelector('.diary-save-btn');
        const textarea = diarySection.querySelector('#diaryTextarea');
        saveBtn.addEventListener('click', async () => {
          const text = textarea.value.trim();
          if (!text) {
            showToast('请写点什么吧', 'warning');
            return;
          }
          diaryData[date] = { text, stars: todayStars };
          await db.setState('diary', diaryData);
          showToast('&#x1F4DD; 笔记已记录！');
          await renderTabSearch(container, date, true);
        });
      }

      container.appendChild(diarySection);
    }

    // 鼓励语
    if (dateProgress.length === 0 && isDateInRange(date) && !isSunday(date) && !isTravel(date)) {
      const enc = blindbox.drawRandomEncourage();
      const encSection = createElement('div', { className: 'search-section encourage-section' });
      encSection.innerHTML = `
        <div class="encourage-card">
          <div class="encourage-icon">${enc.icon}</div>
          <div class="encourage-text">${escapeHtml(enc.text)}</div>
        </div>
      `;
      container.appendChild(encSection);
    }

    // 恢复滚动位置（双层 rAF 确保 DOM 布局完成后再滚动）
    if (keepScroll && scrollY > 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY);
        });
      });
    }

  } catch (e) {
    console.error('renderTabSearch failed:', e);
    showError(container, `页面加载失败: ${e.message}`, () => renderTabSearch(container, date));
  }
}

// ==================== 任务卡片创建 ====================

function createTaskCard(task, isDone, dateStr) {
  const subj = getSubject(task.subject);
  const card = createElement('div', {
    className: `task-card ${isDone ? 'task-card-done' : ''}`,
    'data-task-id': task.id,
  });

  const contentPreview = task.content
    ? `<div class="task-card-preview">${escapeHtml(task.content.slice(0, 50))}${task.content.length > 50 ? '...' : ''}</div>`
    : '';

  card.innerHTML = `
    <div class="task-card-left">
      <div class="task-card-subject" style="background:${subj ? subj.color : '#94A3B8'};">
        ${subj ? subj.icon : ''}
      </div>
    </div>
    <div class="task-card-body">
      <div class="task-card-title">${escapeHtml(task.title)}</div>
      ${task.author ? `<div class="task-card-author">${escapeHtml(task.author)}</div>` : ''}
      ${task.category ? `<div class="task-card-category">${escapeHtml(task.category)}</div>` : ''}
      ${contentPreview}
    </div>
    <div class="task-card-right">
      <button class="btn-task-toggle ${isDone ? 'btn-task-undo' : 'btn-task-do'}" title="${isDone ? '撤销' : '完成'}">
        ${isDone ? '&#x2705;' : '&#x2B50;'}
      </button>
    </div>
  `;

  // 点击切换
  const toggleBtn = card.querySelector('.btn-task-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await handleTaskToggle(task, isDone, dateStr, card);
    });
  }

  // 点击卡片查看详情
  card.addEventListener('click', () => {
    showTaskDetail(task, isDone, dateStr);
  });

  // 入场动画
  animateElement(card, [
    { opacity: 0, transform: 'translateY(10px)' },
    { opacity: 1, transform: 'translateY(0)' },
  ], 200);

  return card;
}

function createSportCard(sport, isDone, dateStr) {
  const taskId = `sp_${sport.id}`;
  const card = createElement('div', {
    className: `task-card sport-card ${isDone ? 'task-card-done' : ''}`,
    'data-task-id': taskId,
  });

  card.innerHTML = `
    <div class="sport-icon">${sport.icon}</div>
    <div class="sport-name">${escapeHtml(sport.name)}</div>
    <button class="btn-task-toggle ${isDone ? 'btn-task-undo' : 'btn-task-do'}">
      ${isDone ? '&#x2705;' : '&#x2B50;'}
    </button>
  `;

  const toggleBtn = card.querySelector('.btn-task-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const fakeTask = { id: taskId, subject: 'sp', title: sport.name, content: '' };
      await handleTaskToggle(fakeTask, isDone, dateStr, card);
    });
  }

  return card;
}

function createChapterCard(chapter, isDone, dateStr) {
  const subj = getSubject(chapter.subject);
  const card = createElement('div', {
    className: `task-card chapter-card ${isDone ? 'task-card-done' : ''}`,
    'data-task-id': chapter.id,
  });

  card.innerHTML = `
    <div class="task-card-left">
      <div class="task-card-subject" style="background:${subj ? subj.color : '#64748B'};">
        ${subj ? subj.icon : '&#x1F4D0;'}
      </div>
    </div>
    <div class="task-card-body">
      <div class="task-card-title">${escapeHtml(chapter.title)}</div>
      <div class="task-card-category">${escapeHtml(subj ? subj.name : '')}</div>
    </div>
    <div class="task-card-right">
      <button class="btn-task-toggle ${isDone ? 'btn-task-undo' : 'btn-task-do'}">
        ${isDone ? '&#x2705;' : '&#x2B50;'}
      </button>
    </div>
  `;

  const toggleBtn = card.querySelector('.btn-task-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const fakeTask = { id: chapter.id, subject: chapter.subject, title: chapter.title, content: '' };
      await handleTaskToggle(fakeTask, isDone, dateStr, card);
    });
  }

  return card;
}

function createDailyTaskCard(dailyTask, isDone, dateStr, subject) {
  const taskId = `daily_${dailyTask.id}`;
  const card = createElement('div', {
    className: `task-card daily-task-card ${isDone ? 'task-card-done' : ''}`,
    'data-task-id': taskId,
  });

  card.innerHTML = `
    <div class="task-card-left">
      <div class="task-card-subject" style="background:#94A3B8;">
        ${dailyTask.icon || '&#x1F4CB;'}
      </div>
    </div>
    <div class="task-card-body">
      <div class="task-card-title">
        ${escapeHtml(dailyTask.title)}
        <span class="task-badge-daily">每日</span>
        ${dailyTask.isSatVariant ? '<span class="task-badge-sat">周六</span>' : ''}
      </div>
      <div class="task-card-category">${escapeHtml(subject.name)} · 每日固定</div>
    </div>
    <div class="task-card-right">
      <button class="btn-task-toggle ${isDone ? 'btn-task-undo' : 'btn-task-do'}" title="${isDone ? '撤销' : '完成'}">
        ${isDone ? '&#x2705;' : '&#x2B50;'}
      </button>
    </div>
  `;

  const toggleBtn = card.querySelector('.btn-task-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const fakeTask = { id: taskId, subject: 'daily', title: dailyTask.title, content: '' };
      await handleTaskToggle(fakeTask, isDone, dateStr, card);
    });
  }

  return card;
}

function createCustomDoneCard(record, dateStr) {
  const card = createElement('div', {
    className: 'task-card custom-card task-card-done',
    'data-task-id': record.taskId,
  });

  card.innerHTML = `
    <div class="task-card-left">
      <div class="task-card-subject" style="background:#94A3B8;">&#x1F3AF;</div>
    </div>
    <div class="task-card-body">
      <div class="task-card-title">${escapeHtml(record.customTitle || '特别行动')}</div>
      <div class="task-card-category">${escapeHtml(record.customContent || '')}</div>
    </div>
    <div class="task-card-right">
      <button class="btn-task-toggle btn-task-undo" title="撤销">&#x2705;</button>
    </div>
  `;

  const toggleBtn = card.querySelector('.btn-task-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const result = await progress.undoTask(record.taskId, dateStr);
      if (result.state.action === 'undone') {
        playFailSound();
        showToast('已撤销');
        // 重新渲染
        const container = card.closest('.tab-content');
        if (container) renderTabSearch(container, dateStr, true);
      }
    });
  }

  return card;
}

// ==================== 任务操作 ====================

async function handleTaskToggle(task, isDone, dateStr, cardElement) {
  try {
    if (isDone) {
      // 撤销
      const confirmed = await showConfirm('撤销确认', `确定要撤销「${task.title}」的完成记录吗？星星也将被收回。`);
      if (!confirmed) return;

      const result = await progress.undoTask(task.id, dateStr);
      if (result.state.action === 'undone') {
        playFailSound();
        showToast(`已撤销「${task.title}」`);
        // 重新渲染当前 tab
        const container = document.querySelector('#tabSearch');
        if (container) renderTabSearch(container, dateStr, true);
      }
    } else {
      // 完成
      const result = await progress.completeTask(task.id, dateStr);
      if (result.state.action === 'completed') {
        playCompleteSound();
        const stars = result.state.stars;
        showStarToast(stars);

        // 星星飞行动画
        if (cardElement) {
          const rect = cardElement.getBoundingClientRect();
          showStarFly(rect.left + rect.width / 2, rect.top, stars);

          cardElement.classList.add('task-card-done');
          const toggleBtn = cardElement.querySelector('.btn-task-toggle');
          if (toggleBtn) {
            toggleBtn.innerHTML = '&#x2705;';
            toggleBtn.className = 'btn-task-toggle btn-task-undo';
          }
          bounceIn(cardElement);
        }

        // 线索掉落判定
        try {
          const clueResult = await mystery.tryDropClue();
          if (clueResult.dropped && !clueResult.readyForDeduction) {
            const clueToast = document.createElement('div');
            clueToast.className = 'clue-toast';
            clueToast.innerHTML = `🔍 发现线索！(${clueResult.clueCount}/${clueResult.clueNeeded})<br><small>「${clueResult.caseTitle}」</small>`;
            clueToast.style.cssText = `
              position:fixed;top:80px;left:50%;transform:translateX(-50%);
              background:#1E293B;color:#F59E0B;padding:10px 18px;border-radius:12px;
              z-index:2000;text-align:center;font-size:14px;font-weight:600;
              animation:cluePopIn 0.4s ease, clueFadeOut 0.5s 1.5s ease forwards;
              pointer-events:none;white-space:nowrap;
            `;
            document.body.appendChild(clueToast);
            setTimeout(() => clueToast.remove(), 2200);
          }
          if (clueResult.readyForDeduction) {
            showToast(`🔍 线索集齐！准备推理「${clueResult.caseTitle}」`, 'info', 3000);
          }
        } catch (e) {
          console.error('Clue drop failed:', e);
        }

        // 检查成就
        if (result.events.includes('achievement_unlocked')) {
          const achievements = await db.getAchievements();
          const latest = achievements[achievements.length - 1];
          if (latest) {
            playAchievementSound();
            await showAchievementModal(latest);
          }
        }

        // 检查 CASE CLOSED 和盲盒触发
        const triggers = await blindbox.checkBlindBoxTrigger(dateStr);
        if (triggers.length > 0) {
          for (const trigger of triggers) {
            playBlindBoxOpenSound();
            await blindbox.addBlindBoxHistory(trigger.box);
            await showBlindBoxReveal(trigger.box, trigger.type === 'box_b' ? 'B' : 'A');
          }
        }

        // 即时刷新页面（无延迟）
        const container = document.querySelector('#tabSearch');
        if (container) await renderTabSearch(container, dateStr, true);
        // 更新头部统计和侧边栏
        const headerStats = document.querySelector('#headerStats');
        if (headerStats) renderHeaderStats(headerStats);
        const sideStats = document.querySelector('#sideStats');
        if (sideStats) renderHeaderStats(sideStats);
        // 连击光效
        try {
          const stats = await progress.getStats();
          applyStreakGlow(stats.streak);
        } catch (e) { /* ignore */ }
      }
    }
  } catch (e) {
    console.error('Task toggle failed:', e);
    showToast(`操作失败: ${e.message}`, 'error');
  }
}

// ==================== 任务详情 ====================

function showTaskDetail(task, isDone, dateStr) {
  const subj = getSubject(task.subject);

  let detailHtml = `
    <div class="task-detail">
      <div class="task-detail-header">
        <span style="color:${subj ? subj.color : '#94A3B8'}; font-size: 24px;">${subj ? subj.icon : ''}</span>
        <h3>${escapeHtml(task.title)}</h3>
      </div>
  `;

  if (task.author) {
    detailHtml += `<div class="task-detail-author">作者: ${escapeHtml(task.author)}</div>`;
  }

  if (task.content) {
    detailHtml += `
      <div class="task-detail-content">
        <div class="task-detail-label">全文:</div>
        <div class="task-detail-text">${escapeHtml(task.content)}</div>
      </div>
    `;
  }

  detailHtml += `
      <div class="task-detail-status">
        状态: ${isDone ? '&#x2705; 已完成' : '&#x2B50; 待完成'}
      </div>
    </div>
  `;

  showModal({
    title: '',
    content: detailHtml,
    buttons: [
      { text: '关闭', cls: 'btn-secondary' },
      {
        text: isDone ? '撤销' : '完成',
        cls: isDone ? 'btn-secondary' : 'btn-primary',
        onClick: async () => {
          if (isDone) {
            await progress.undoTask(task.id, dateStr);
            showToast('已撤销');
          } else {
            const result = await progress.completeTask(task.id, dateStr);
            playCompleteSound();
            showStarToast(result.state.stars);
          }
          const container = document.querySelector('#tabSearch');
          if (container) renderTabSearch(container, dateStr, true);
        }
      },
    ],
  });
}

// ==================== 推理弹窗 ====================

async function showDeductionModal(caseData, collectedClueTexts, dateStr) {
  return new Promise((resolve) => {
    let selectedAnswer = -1;
    let submitted = false;

    function buildContent() {
      return `
        <div class="deduction-modal-content">
          <div class="deduction-case-header">
            <span class="deduction-case-icon">${caseData.icon}</span>
            <div>
              <div class="deduction-case-title">${escapeHtml(caseData.title)}</div>
              <div class="deduction-case-desc">${escapeHtml(caseData.desc)}</div>
            </div>
          </div>
          <div class="deduction-clues-section">
            <div class="deduction-section-label">&#x1F4CB; 已收集的线索</div>
            <div class="deduction-clues-list">
              ${collectedClueTexts.map((clue, i) => `
                <div class="deduction-clue-card">
                  <span class="deduction-clue-num">${i + 1}</span>
                  <span class="deduction-clue-text">${escapeHtml(clue)}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="deduction-question-section">
            <div class="deduction-section-label">&#x2753; 请做出推理</div>
            <div class="deduction-question">${escapeHtml(caseData.question)}</div>
            <div class="deduction-options" id="deductionOptions">
              ${caseData.options.map((opt, i) => `
                <button class="deduction-option" data-answer="${i}">
                  <span class="deduction-option-letter">${String.fromCharCode(65 + i)}</span>
                  <span class="deduction-option-text">${escapeHtml(opt)}</span>
                </button>
              `).join('')}
            </div>
            <div class="deduction-feedback" style="display:none;"></div>
          </div>
        </div>
      `;
    }

    const overlay = showModal({
      title: '',
      className: 'deduction-modal',
      content: buildContent(),
      buttons: [
        {
          text: '&#x1F50D; 提交推理',
          cls: 'btn-primary btn-submit-deduction',
          onClick: () => {
            if (submitted) return false;
            if (selectedAnswer < 0) {
              showToast('请先选择一个答案', 'warning');
              return false; // 不关闭弹窗
            }
            handleSubmit();
            return false; // 不关闭弹窗
          },
        },
      ],
      onClose: () => resolve(null),
    });

    // 绑定选项点击
    overlay.querySelectorAll('.deduction-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (submitted) return;
        selectedAnswer = parseInt(btn.dataset.answer);
        overlay.querySelectorAll('.deduction-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    async function handleSubmit() {
      submitted = true;
      const result = await mystery.submitDeduction(selectedAnswer);

      const feedback = overlay.querySelector('.deduction-feedback');
      const submitBtn = overlay.querySelector('.btn-submit-deduction');

      if (result.correct) {
        playAchievementSound();

        const correctBtn = overlay.querySelector(`.deduction-option[data-answer="${caseData.answer}"]`);
        if (correctBtn) correctBtn.classList.add('correct');

        feedback.style.display = 'block';
        feedback.className = 'deduction-feedback feedback-correct';
        feedback.innerHTML = `&#x2705; 推理正确！${escapeHtml(result.explanation)}`;

        if (submitBtn) {
          submitBtn.innerHTML = '&#x1F36C; 案件告破！';
          submitBtn.disabled = true;
        }

        setTimeout(() => {
          showCaseClosedStamp();
          overlay.classList.remove('modal-in');
          const container = overlay.querySelector('.modal-container');
          if (container) container.classList.remove('modal-container-in');
          setTimeout(() => {
            overlay.remove();
            resolve(true);
          }, 300);
        }, 1200);
      } else {
        playFailSound();

        const wrongBtn = overlay.querySelector(`.deduction-option[data-answer="${selectedAnswer}"]`);
        if (wrongBtn) {
          shake(wrongBtn);
          wrongBtn.classList.add('wrong');
        }

        feedback.style.display = 'block';
        feedback.className = 'deduction-feedback feedback-wrong';
        feedback.innerHTML = '&#x274C; 推理不对，再看看线索，换个答案试试！';

        submitted = false;
        setTimeout(() => {
          if (wrongBtn) wrongBtn.classList.remove('wrong');
        }, 600);
      }
    }
  });
}

// ==================== 添加自定义任务 ====================

async function handleAddCustomTask(dateStr, container) {
  const customCount = (await db.getProgressForDate(dateStr)).filter(r => r.subjectId === 'ot').length;
  if (customCount >= CONFIG.maxCustomTasks) {
    showToast(`每天最多添加${CONFIG.maxCustomTasks}个特别行动`, 'warning');
    return;
  }

  // 简单的 prompt 输入
  const title = prompt('特别行动名称:');
  if (!title || !title.trim()) return;
  const note = prompt('备注（可选）:') || '';

  const taskId = `ot_${Date.now()}`;
  const fakeTask = {
    id: taskId,
    subject: 'ot',
    title: title.trim(),
    content: note.trim(),
  };

  const result = await progress.completeTask(taskId, dateStr, {
    note: note.trim(),
    customTitle: title.trim(),
    customContent: note.trim(),
  });

  if (result.state.action === 'completed') {
    playCompleteSound();
    showToast(`特别行动「${title}」已记录`);
    renderTabSearch(container, dateStr, true);
    // 更新头部和侧边栏
    const headerStats = document.querySelector('#headerStats');
    if (headerStats) renderHeaderStats(headerStats);
    const sideStats = document.querySelector('#sideStats');
    if (sideStats) renderHeaderStats(sideStats);
  }
}

// ==================== 搜索/筛选 ====================

export async function filterTasks(searchText, container, dateStr) {
  if (!container) return;
  const cards = container.querySelectorAll('.task-card');
  const lower = searchText.toLowerCase();

  cards.forEach(card => {
    const title = (card.querySelector('.task-card-title')?.textContent || '').toLowerCase();
    const author = (card.querySelector('.task-card-author')?.textContent || '').toLowerCase();
    if (!searchText || title.includes(lower) || author.includes(lower)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}
