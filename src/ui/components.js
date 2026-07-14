/**
 * UI 组件库
 * - Toast 提示
 * - Modal 弹窗
 * - Overlay 遮罩
 * - 动画辅助
 */

// ==================== Toast ====================

let toastTimer = null;

export function showToast(message, type = 'info', duration = 2500) {
  // 移除已有 toast
  const existing = document.querySelector('.toast-container');
  if (existing) existing.remove();
  if (toastTimer) clearTimeout(toastTimer);

  const container = document.createElement('div');
  container.className = 'toast-container';

  const icons = { success: '&#x2705;', error: '&#x274C;', info: '&#x2139;', warning: '&#x26A0;', star: '&#x2B50;' };
  const icon = icons[type] || icons.info;

  container.innerHTML = `
    <div class="toast toast-${type}">
      <span class="toast-icon">${icon}</span>
      <span class="toast-msg">${escapeHtml(message)}</span>
    </div>
  `;

  document.body.appendChild(container);

  // 入场动画
  requestAnimationFrame(() => {
    container.querySelector('.toast').classList.add('toast-in');
  });

  // 自动移除
  toastTimer = setTimeout(() => {
    const toast = container.querySelector('.toast');
    if (toast) {
      toast.classList.remove('toast-in');
      toast.classList.add('toast-out');
      setTimeout(() => container.remove(), 300);
    }
  }, duration);
}

export function showStarToast(stars) {
  showToast(`&#x2B50; +${stars} 颗星星！`, 'star', 2000);
}

// ==================== Modal ====================

export function showModal({ title, content, buttons = [], onClose, className = '' }) {
  // 移除已有 modal
  const existing = document.querySelector('.modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const buttonsHtml = buttons.map((btn, i) => {
    const cls = btn.cls || (i === 0 ? 'btn-secondary' : 'btn-primary');
    return `<button class="btn ${cls}" data-btn-index="${i}">${escapeHtml(btn.text)}</button>`;
  }).join('');

  overlay.innerHTML = `
    <div class="modal-container ${className}">
      ${title ? `<div class="modal-header">${escapeHtml(title)}</div>` : ''}
      <div class="modal-body">${typeof content === 'string' ? content : ''}</div>
      ${buttons.length > 0 ? `<div class="modal-footer">${buttonsHtml}</div>` : ''}
    </div>
  `;

  if (typeof content === 'object' && content.nodeType) {
    overlay.querySelector('.modal-body').appendChild(content);
  }

  // 事件绑定
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay, onClose);
    }
    const btnEl = e.target.closest('[data-btn-index]');
    if (btnEl) {
      const idx = parseInt(btnEl.dataset.btnIndex);
      const btn = buttons[idx];
      if (btn && btn.onClick) {
        const result = btn.onClick();
        if (result !== false) {
          closeModal(overlay, onClose);
        }
      } else {
        closeModal(overlay, onClose);
      }
    }
  });

  document.body.appendChild(overlay);

  // 入场动画
  requestAnimationFrame(() => {
    overlay.classList.add('modal-in');
    const container = overlay.querySelector('.modal-container');
    if (container) container.classList.add('modal-container-in');
  });

  return overlay;
}

function closeModal(overlay, onClose) {
  overlay.classList.remove('modal-in');
  const container = overlay.querySelector('.modal-container');
  if (container) container.classList.remove('modal-container-in');
  setTimeout(() => {
    overlay.remove();
    if (onClose) onClose();
  }, 250);
}

// ==================== Confirm ====================

export function showConfirm(title, message, confirmText = '确认', cancelText = '取消') {
  return new Promise((resolve) => {
    showModal({
      title,
      content: `<p style="text-align:center;margin:16px 0;">${escapeHtml(message)}</p>`,
      buttons: [
        { text: cancelText, cls: 'btn-secondary', onClick: () => resolve(false) },
        { text: confirmText, cls: 'btn-primary', onClick: () => resolve(true) },
      ],
    });
  });
}

// ==================== BlindBox Reveal Modal ====================

export function showBlindBoxReveal(box, type = 'A') {
  const rarityColors = {
    common: '#94A3B8',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B',
  };

  const rarityBg = {
    common: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
    rare: 'linear-gradient(135deg, #bfdbfe, #93c5fd)',
    epic: 'linear-gradient(135deg, #ddd6fe, #c4b5fd)',
    legendary: 'linear-gradient(135deg, #fef3c7, #fcd34d)',
  };

  const color = rarityColors[box.rarity] || '#94A3B8';
  const bg = rarityBg[box.rarity] || rarityBg.common;

  const typeLabel = type === 'B' ? '关键证据' : '日常证物';

  return new Promise((resolve) => {
    showModal({
      title: `&#x1F50E; 发现${typeLabel}！`,
      className: 'blindbox-modal',
      content: `
        <div class="blindbox-reveal" style="background:${bg};border:2px solid ${color};">
          <div class="blindbox-reveal-icon">${box.icon}</div>
          <div class="blindbox-reveal-title" style="color:${color};">${escapeHtml(box.title)}</div>
          <div class="blindbox-reveal-desc">${escapeHtml(box.desc)}</div>
          <div class="blindbox-reveal-rarity" style="background:${color};">
            ${box.rarity === 'legendary' ? '&#x1F451; 传说' : box.rarity === 'epic' ? '&#x1F48E; 史诗' : box.rarity === 'rare' ? '&#x2728; 稀有' : '普通'}
          </div>
        </div>
      `,
      buttons: [
        { text: '收入证物袋！', cls: 'btn-primary', onClick: () => resolve(true) },
      ],
    });
  });
}

// ==================== Achievement Modal ====================

export function showAchievementModal(achievement) {
  showModal({
    title: '&#x1F3C6; 成就解锁！',
    className: 'achievement-modal',
    content: `
      <div class="achievement-reveal">
        <div class="achievement-reveal-icon">${achievement.icon}</div>
        <div class="achievement-reveal-title">${escapeHtml(achievement.title)}</div>
        <div class="achievement-reveal-desc">${escapeHtml(achievement.desc)}</div>
      </div>
    `,
    buttons: [
      { text: '继续探索', cls: 'btn-primary' },
    ],
  });
}

// ==================== 动画 ====================

export function animateElement(el, keyframes, duration = 300) {
  if (!el) return;
  return el.animate(keyframes, {
    duration,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fill: 'forwards',
  });
}

export function bounceIn(el) {
  return animateElement(el, [
    { transform: 'scale(0.3)', opacity: 0 },
    { transform: 'scale(1.05)', opacity: 0.8, offset: 0.5 },
    { transform: 'scale(0.95)', opacity: 0.9, offset: 0.7 },
    { transform: 'scale(1)', opacity: 1 },
  ], 400);
}

export function fadeIn(el, duration = 300) {
  return animateElement(el, [
    { opacity: 0, transform: 'translateY(8px)' },
    { opacity: 1, transform: 'translateY(0)' },
  ], duration);
}

export function shake(el) {
  return animateElement(el, [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-6px)', offset: 0.2 },
    { transform: 'translateX(6px)', offset: 0.4 },
    { transform: 'translateX(-4px)', offset: 0.6 },
    { transform: 'translateX(4px)', offset: 0.8 },
    { transform: 'translateX(0)' },
  ], 400);
}

export function pulse(el) {
  return animateElement(el, [
    { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
    { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)' },
    { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' },
  ], 800);
}

export function slideDown(el) {
  return animateElement(el, [
    { height: 0, opacity: 0 },
    { height: el.scrollHeight + 'px', opacity: 1 },
  ], 300);
}

// ==================== 工具 ====================

export function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

export function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') el.className = value;
    else if (key === 'innerHTML') el.innerHTML = value;
    else if (key === 'textContent') el.textContent = value;
    else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === 'style' && typeof value === 'object') Object.assign(el.style, value);
    else el.setAttribute(key, value);
  }
  for (const child of children) {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child && child.nodeType) el.appendChild(child);
  }
  return el;
}

export function clearElement(el) {
  if (!el) return;
  while (el.firstChild) el.removeChild(el.firstChild);
}

// ==================== Loading ====================

export function showLoading(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">调查中...</p>
    </div>
  `;
}

export function showError(container, message, onRetry) {
  if (!container) return;
  container.innerHTML = `
    <div class="error-container">
      <div class="error-icon">&#x1F50D;</div>
      <p class="error-text">${escapeHtml(message)}</p>
      ${onRetry ? '<button class="btn btn-primary retry-btn">重新加载</button>' : ''}
    </div>
  `;
  if (onRetry) {
    const btn = container.querySelector('.retry-btn');
    if (btn) btn.addEventListener('click', onRetry);
  }
}

// ==================== Star Fly Animation ====================

export function showStarFly(x, y, count = 1) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'star-fly';
    el.textContent = '⭐';
    el.style.cssText = `
      position: fixed;
      left: ${x + (Math.random() - 0.5) * 30}px;
      top: ${y}px;
      font-size: ${18 + Math.random() * 8}px;
      pointer-events: none;
      z-index: 2000;
      animation: starFlyUp 1s ease-out forwards;
    `;
    document.body.appendChild(el);
    stars.push(el);
    setTimeout(() => el.remove(), 1000);
  }
  return stars;
}

// ==================== CASE CLOSED Stamp ====================

export function showCaseClosedStamp() {
  const overlay = document.createElement('div');
  overlay.className = 'case-closed-overlay';
  overlay.innerHTML = `
    <div class="case-closed-stamp">
      <div class="stamp-inner">
        <div class="stamp-label">CASE</div>
        <div class="stamp-label">CLOSED</div>
        <div class="stamp-badge">&#x1F36C; 结案</div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 500);
  }, 1800);
}

// ==================== Streak Glow ====================

export function applyStreakGlow(streak) {
  document.body.classList.remove('streak-fire', 'streak-gold', 'streak-star');
  if (streak >= 21) {
    document.body.classList.add('streak-star');
  } else if (streak >= 14) {
    document.body.classList.add('streak-gold');
  } else if (streak >= 7) {
    document.body.classList.add('streak-fire');
  }
}

export function showEmpty(container, message = '暂无数据') {
  if (!container) return;
  container.innerHTML = `
    <div class="empty-container">
      <div class="empty-icon">&#x1F9D0;</div>
      <p class="empty-text">${escapeHtml(message)}</p>
    </div>
  `;
}
