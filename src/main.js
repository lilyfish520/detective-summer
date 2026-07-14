/**
 * 见习侦探的暑期事件簿 - 应用入口
 * Zero dependencies, vanilla JS with ES modules
 *
 * 数据流: db.js <-> progress.js -> main.js -> ui/*.js
 * 事件流: 用户操作 -> main.js -> progress.js -> db.js
 *                        -> sounds.js -> UI update
 */

import { CONFIG, SUBJECTS } from './config.js';
import { todayStr, fmtDate } from './core/engine.js';
import * as db from './data/db.js';
import * as progress from './core/progress.js';
import { assignSuggestedDates } from './core/progress.js';
import { renderDateNav, renderHeaderStats, getCurrentDateForHeader } from './ui/header.js';
import { renderTabSearch } from './ui/tab-search.js';
import { renderTabArchive } from './ui/tab-archive.js';
import { renderTabStats } from './ui/tab-stats.js';
import { renderTabWords } from './ui/tab-words.js';
import { showToast, escapeHtml, $, $$ } from './ui/components.js';
import { unlockAudio } from './audio/sounds.js';
import * as mystery from './core/mystery.js';

// ==================== 全局状态 ====================
let currentTab = 'search';
let dbReady = false;

// ==================== 应用骨架 ====================

function renderAppSkeleton() {
  const app = $('#app');
  if (!app) {
    console.error('FATAL: #app element not found');
    document.body.innerHTML = '<div style="padding:40px;text-align:center;color:red;">应用初始化失败：找不到根元素 #app</div>';
    return;
  }

  app.innerHTML = `
    <!-- 顶部导航栏（桌面端深色 + 移动端浅色） -->
    <header id="topBar">
      <div class="topbar-brand">&#x1F575;&#xFE0F; 见习侦探的暑期事件簿</div>
      <div id="dateNav"></div>
    </header>

    <!-- 主体区域 -->
    <div id="appBody">
      <!-- 左侧边栏 (仅桌面端可见) -->
      <aside id="sidebar">
        <div id="sideStats"></div>
        <div id="sideMystery"></div>
        <nav id="sideNav">
          <button class="side-nav-btn active" data-tab="search">
            <span class="side-nav-icon">&#x1F50D;</span>今日搜证
          </button>
          <button class="side-nav-btn" data-tab="archive">
            <span class="side-nav-icon">&#x1F4DA;</span>案卷归档
          </button>
          <button class="side-nav-btn" data-tab="stats">
            <span class="side-nav-icon">&#x1F4CA;</span>名侦探履历
          </button>
          <button class="side-nav-btn" data-tab="words">
            <span class="side-nav-icon">&#x1F4AC;</span>密文破译
          </button>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main id="main">
        <div id="headerStats"></div>
        <nav class="tabs" id="tabNav">
          <button class="tab-btn active" data-tab="search">&#x1F50D; 今日搜证</button>
          <button class="tab-btn" data-tab="archive">&#x1F4DA; 案卷归档</button>
          <button class="tab-btn" data-tab="stats">&#x1F4CA; 名侦探履历</button>
          <button class="tab-btn" data-tab="words">&#x1F4AC; 密文破译</button>
        </nav>
        <div class="tab-content active" id="tabSearch"></div>
        <div class="tab-content" id="tabArchive"></div>
        <div class="tab-content" id="tabStats"></div>
        <div class="tab-content" id="tabWords"></div>
      </main>
    </div>
  `;
}

// ==================== Tab 切换 ====================

function switchTab(tabName) {
  if (currentTab === tabName) return;

  currentTab = tabName;

  // 更新移动端标签按钮状态
  const buttons = $$('.tab-btn');
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // 更新侧边栏按钮状态
  const sideBtns = $$('.side-nav-btn');
  sideBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // 更新内容显示
  const contents = $$('.tab-content');
  contents.forEach(content => {
    content.classList.toggle('active', content.id === `tab${capitalize(tabName)}`);
  });

  // 渲染对应标签页
  renderCurrentTab();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==================== 渲染当前标签页 ====================

async function renderCurrentTab() {
  try {
    const date = getCurrentDateForHeader();

    switch (currentTab) {
      case 'search': {
        const container = $('#tabSearch');
        if (container) await renderTabSearch(container, date);
        break;
      }
      case 'archive': {
        const container = $('#tabArchive');
        if (container) await renderTabArchive(container);
        break;
      }
      case 'stats': {
        const container = $('#tabStats');
        if (container) await renderTabStats(container);
        break;
      }
      case 'words': {
        const container = $('#tabWords');
        if (container) await renderTabWords(container);
        break;
      }
    }
  } catch (e) {
    console.error(`Failed to render tab ${currentTab}:`, e);
    const container = $(`#tab${capitalize(currentTab)}`);
    if (container) {
      container.innerHTML = `
        <div class="error-container">
          <div class="error-icon">&#x1F50D;</div>
          <p class="error-text">页面渲染失败: ${e.message}</p>
          <button class="btn btn-primary" onclick="location.reload()">刷新页面</button>
        </div>
      `;
    }
  }
}

// ==================== 全局事件绑定（事件委托） ====================

function bindGlobalEvents() {
  // Tab 切换 (移动端 + 侧边栏)
  const handleTabClick = (e) => {
    const btn = e.target.closest('.tab-btn, .side-nav-btn');
    if (!btn) return;
    const tabName = btn.dataset.tab;
    if (tabName) switchTab(tabName);
  };

  const tabNav = $('#tabNav');
  if (tabNav) tabNav.addEventListener('click', handleTabClick);

  const sideNav = $('#sideNav');
  if (sideNav) sideNav.addEventListener('click', handleTabClick);

  // 全局点击 - 解锁音频
  document.addEventListener('click', () => {
    unlockAudio();
  }, { once: true });

  // 键盘导航
  document.addEventListener('keydown', (e) => {
    // 左右箭头切换日期（在打卡页）
    if (currentTab === 'search') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevBtn = $('#dateNav')?.querySelector('.date-nav-prev');
        if (prevBtn && !prevBtn.disabled) prevBtn.click();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextBtn = $('#dateNav')?.querySelector('.date-nav-next');
        if (nextBtn && !nextBtn.disabled) nextBtn.click();
      }
    }
  });
}

// ==================== 主初始化 ====================

async function init() {
  try {
    console.log('[App] Starting initialization...');

    // Step 1: 渲染应用骨架
    renderAppSkeleton();
    console.log('[App] Skeleton rendered');

    // Step 2: 绑定全局事件
    bindGlobalEvents();
    console.log('[App] Events bound');

    // Step 3: 打开数据库
    try {
      await db.openDB();
      dbReady = true;
      console.log('[App] Database opened');
    } catch (dbErr) {
      console.error('[App] Database open failed:', dbErr);
      showToast('数据库初始化失败，部分功能不可用', 'error', 4000);
    }

    // Step 4: 分配建议日期
    if (dbReady) {
      try {
        await assignSuggestedDates();
        console.log('[App] Suggested dates assigned');
      } catch (assignErr) {
        console.warn('[App] Suggested dates assignment failed:', assignErr);
      }
    }

    // Step 5: 渲染头部
    await renderApp();

    console.log('[App] Initialization complete');
  } catch (e) {
    console.error('[App] Fatal initialization error:', e);
    const app = $('#app');
    if (app) {
      app.innerHTML = `
        <div class="error-container" style="padding:60px 20px;">
          <div class="error-icon" style="font-size:60px;">&#x1F6AB;</div>
          <h2 style="margin:16px 0;color:#EF4444;">应用启动失败</h2>
          <p class="error-text">${e.message || '未知错误'}</p>
          <p style="font-size:12px;color:#94A3B8;margin-top:8px;">
            请检查浏览器是否支持 IndexedDB。<br>
            推荐使用 Chrome、Edge 或 Safari 最新版本。
          </p>
          <button class="btn btn-primary" style="margin-top:16px;" onclick="location.reload()">
            重新加载
          </button>
        </div>
      `;
    }
  }
}

// ==================== 渲染应用 ====================

async function renderSidebar() {
  try {
    // 侧边栏统计
    const sideStatsEl = $('#sideStats');
    if (sideStatsEl) {
      try { await renderHeaderStats(sideStatsEl); } catch (e) { /* ignore */ }
    }
    // 侧边栏谜案进度
    const sideMysteryEl = $('#sideMystery');
    if (sideMysteryEl) {
      try {
        const summary = await mystery.getMysterySummary();
        if (summary.allSolved) {
          sideMysteryEl.innerHTML = `<div class="side-mystery side-mystery-done">\u{1F3C6} 全部案件已侦破！</div>`;
        } else if (summary.activeCase) {
          const ac = summary.activeCase;
          const pct = Math.round(ac.progress * 100);
          sideMysteryEl.innerHTML = `
            <div class="side-mystery">
              <div class="side-mystery-header">\u{1F50D} 当前谜案</div>
              <div class="side-mystery-title">${ac.icon} ${escapeHtml(ac.title)}</div>
              <div class="side-mystery-track"><div class="side-mystery-fill" style="width:${pct}%"></div></div>
              <div class="side-mystery-hint">线索 ${ac.cluesCollected}/${ac.cluesNeeded} · 已破 ${summary.solvedCount}/${summary.totalCases}</div>
            </div>`;
        }
      } catch (e) { sideMysteryEl.innerHTML = ''; }
    }
  } catch (e) { console.error('[App] Sidebar render failed:', e); }
}

async function renderApp() {
  try {
    // 渲染侧边栏
    await renderSidebar();

    // 渲染头部统计
    const headerStatsEl = $('#headerStats');
    if (headerStatsEl) {
      try {
        await renderHeaderStats(headerStatsEl);
      } catch (e) {
        console.error('[App] Header stats render failed:', e);
        headerStatsEl.innerHTML = '<div class="header-stats-error">统计加载失败</div>';
      }
    }

    // 渲染日期导航
    const dateNavEl = $('#dateNav');
    if (dateNavEl) {
      try {
        renderDateNav(dateNavEl, async (newDate) => {
          // 日期变化回调
          try {
            const searchContainer = $('#tabSearch');
            if (searchContainer) {
              await renderTabSearch(searchContainer, newDate);
            }
            const hsEl = $('#headerStats');
            if (hsEl) {
              try { await renderHeaderStats(hsEl); } catch (e) { /* ignore */ }
            }
            // 刷新侧边栏统计
            const ssEl = $('#sideStats');
            if (ssEl) {
              try { await renderHeaderStats(ssEl); } catch (e) { /* ignore */ }
            }
          } catch (e) {
            console.error('[App] Date change render failed:', e);
          }
        });
      } catch (e) {
        console.error('[App] Date nav render failed:', e);
      }
    }

    // 渲染当前标签页
    await renderCurrentTab();

  } catch (e) {
    console.error('[App] Render failed:', e);
    showToast('页面渲染失败，请刷新重试', 'error', 4000);
  }
}

// ==================== 启动 ====================

// DOM 加载完成后启动
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ==================== 导出（供调试） ====================
export { dbReady, currentTab, switchTab, renderApp, renderCurrentTab };
