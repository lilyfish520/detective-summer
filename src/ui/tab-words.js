/**
 * 密文破译 — 单词背诵卡片（含已掌握标记）
 * - 翻转卡片 (CSS 3D)
 * - 单元选择
 * - 左右切换
 * - "我会了"标记，已掌握的自动跳过
 */
import { getWordUnits } from '../core/wordbook.js';
import * as db from '../data/db.js';
import {
  escapeHtml, createElement, showLoading, showError, showEmpty, showToast,
} from './components.js';

let currentUnitIdx = 0;
let currentWordIdx = 0;
let isFlipped = false;
let touchStartX = 0;
let touchStartY = 0;
let onlyUnmastered = true; // 默认只显示未掌握的
let masteredWords = [];

export async function renderTabWords(container) {
  if (!container) return;

  try {
    showLoading(container);
    const units = getWordUnits();

    if (units.length === 0) {
      showEmpty(container, '还没有英文单词数据');
      return;
    }

    // 加载已掌握单词
    masteredWords = await db.getState('mastered_words') || [];
    const masteredSet = new Set(masteredWords);

    container.innerHTML = '';

    // ===== 工具栏 =====
    const toolbar = createElement('div', { className: 'word-toolbar' });

    // 单元选择器
    const selectEl = createElement('select', { className: 'word-select' });
    units.forEach((u, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      const uMastered = u.words.filter(w => masteredSet.has(w.id)).length;
      opt.textContent = `${u.unitTitle} (${uMastered}/${u.words.length})`;
      if (i === currentUnitIdx) opt.selected = true;
      selectEl.appendChild(opt);
    });

    selectEl.addEventListener('change', () => {
      currentUnitIdx = parseInt(selectEl.value);
      currentWordIdx = findNextUnmastered(units, 0);
      isFlipped = false;
      renderCard(container, units);
    });

    toolbar.appendChild(selectEl);

    // 筛选开关
    const filterBtn = createElement('button', {
      className: `word-filter-btn ${onlyUnmastered ? 'active' : ''}`,
      onClick: () => {
        onlyUnmastered = !onlyUnmastered;
        filterBtn.classList.toggle('active', onlyUnmastered);
        filterBtn.textContent = onlyUnmastered ? '未掌握' : '全部';
        currentWordIdx = onlyUnmastered ? findNextUnmastered(units, 0) : 0;
        renderCard(container, units);
      }
    }, onlyUnmastered ? '未掌握' : '全部');
    toolbar.appendChild(filterBtn);

    container.appendChild(toolbar);

    // ===== 卡片区域 =====
    const cardArea = createElement('div', { className: 'word-card-area', id: 'wordCardArea' });
    container.appendChild(cardArea);

    // ===== 底部操作栏 =====
    const actions = createElement('div', { className: 'word-actions', id: 'wordActions' });
    container.appendChild(actions);

    // ===== 导航栏 =====
    const nav = createElement('div', { className: 'word-nav' });
    container.appendChild(nav);

    // 初始化位置
    if (onlyUnmastered) currentWordIdx = findNextUnmastered(units, 0);
    renderCard(container, units);

  } catch (e) {
    console.error('renderTabWords failed:', e);
    showError(container, `加载失败: ${e.message}`, () => renderTabWords(container));
  }
}

function findNextUnmastered(units, startIdx) {
  const unit = units[currentUnitIdx];
  if (!unit) return startIdx;
  const set = new Set(masteredWords);
  for (let i = startIdx; i < unit.words.length; i++) {
    if (!set.has(unit.words[i].id)) return i;
  }
  return startIdx; // all mastered, stay at start
}

function getFilteredWords(unit) {
  if (!unit) return [];
  if (!onlyUnmastered) return unit.words;
  const set = new Set(masteredWords);
  return unit.words.filter(w => !set.has(w.id));
}

async function renderCard(container, units) {
  const unit = units[currentUnitIdx];
  if (!unit || unit.words.length === 0) return;

  const filtered = getFilteredWords(unit);
  if (filtered.length === 0) {
    const cardArea = container.querySelector('#wordCardArea');
    if (cardArea) {
      cardArea.innerHTML = '<div class="word-all-mastered">🎉 本单元单词已全部掌握！</div>';
    }
    const nav = container.querySelector('.word-nav');
    if (nav) nav.innerHTML = '';
    const actions = container.querySelector('#wordActions');
    if (actions) actions.innerHTML = '';
    return;
  }

  if (currentWordIdx >= filtered.length) currentWordIdx = 0;
  const word = filtered[currentWordIdx];
  if (!word) return;

  const cardArea = container.querySelector('#wordCardArea');
  const nav = container.querySelector('.word-nav');
  const actions = container.querySelector('#wordActions');
  if (!cardArea || !nav || !actions) return;

  const isMastered = masteredWords.includes(word.id);
  isFlipped = false;

  // 卡片
  cardArea.innerHTML = `
    <div class="word-card-container" id="wordCard">
      <div class="word-card ${isMastered ? 'word-mastered' : ''}">
        <div class="word-card-front">
          <div class="word-card-unit">${escapeHtml(word.unitTitle)}</div>
          <div class="word-card-word">${escapeHtml(word.word)}</div>
          <div class="word-card-hint">点击翻转查看释义</div>
        </div>
        <div class="word-card-back">
          <div class="word-card-unit">${escapeHtml(word.unitTitle)}</div>
          <div class="word-card-word-sm">${escapeHtml(word.word)}</div>
          <div class="word-card-meaning">${escapeHtml(word.meaning)}</div>
          <div class="word-card-hint">点击翻回</div>
        </div>
      </div>
    </div>
  `;

  // 翻转
  const card = cardArea.querySelector('#wordCard');
  if (card) {
    card.addEventListener('click', () => {
      isFlipped = !isFlipped;
      card.querySelector('.word-card').classList.toggle('flipped', isFlipped);
    });

    card.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) nextWord(container, units);
        else prevWord(container, units);
      }
    });
  }

  // 操作按钮
  actions.innerHTML = `
    <button class="word-action-btn word-action-know" id="wordKnow">
      ${isMastered ? '✅ 已掌握' : '💡 我会了'}
    </button>
  `;

  actions.querySelector('#wordKnow').addEventListener('click', async () => {
    if (isMastered) {
      masteredWords = masteredWords.filter(id => id !== word.id);
      showToast('已取消标记');
    } else {
      masteredWords.push(word.id);
      showToast('已标记为掌握');
    }
    await db.setState('mastered_words', masteredWords);
    // Refresh selector counts
    const sel = container.querySelector('.word-select');
    if (sel) {
      const set = new Set(masteredWords);
      Array.from(sel.options).forEach((opt, i) => {
        if (units[i]) {
          const m = units[i].words.filter(w => set.has(w.id)).length;
          opt.textContent = `${units[i].unitTitle} (${m}/${units[i].words.length})`;
        }
      });
    }
    // If onlyUnmastered and now mastered, move to next
    if (onlyUnmastered && masteredWords.includes(word.id)) {
      nextWord(container, units);
    } else {
      renderCard(container, units);
    }
  });

  // 导航
  nav.innerHTML = `
    <button class="word-nav-btn" id="wordPrev">&#9664; 上一词</button>
    <span class="word-nav-progress">${currentWordIdx + 1} / ${filtered.length}</span>
    <button class="word-nav-btn" id="wordNext">下一词 &#9654;</button>
  `;

  nav.querySelector('#wordPrev').addEventListener('click', () => prevWord(container, units));
  nav.querySelector('#wordNext').addEventListener('click', () => nextWord(container, units));
}

function prevWord(container, units) {
  const unit = units[currentUnitIdx];
  const filtered = getFilteredWords(unit);
  if (filtered.length === 0) return;
  currentWordIdx = (currentWordIdx - 1 + filtered.length) % filtered.length;
  renderCard(container, units);
}

function nextWord(container, units) {
  const unit = units[currentUnitIdx];
  const filtered = getFilteredWords(unit);
  if (filtered.length === 0) return;
  currentWordIdx = (currentWordIdx + 1) % filtered.length;
  renderCard(container, units);
}
