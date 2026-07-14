/**
 * Web Audio API 音效系统
 * 零依赖，纯 Web Audio API 合成
 */

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // 恢复被浏览器挂起的 AudioContext
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.3) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // 静默处理音频错误
  }
}

function playMelody(notes, baseTime = 0.12) {
  notes.forEach(([freq, dur], i) => {
    setTimeout(() => playTone(freq, dur * baseTime, 'sine', 0.25), i * baseTime * 200);
  });
}

// ==================== 音效函数 ====================

export function playCompleteSound() {
  // 轻快的"叮咚"音效
  playTone(880, 0.1, 'sine', 0.3);
  setTimeout(() => playTone(1100, 0.2, 'sine', 0.25), 80);
}

export function playStarSound() {
  // 星星获得音效 - 上升音阶
  playMelody([
    [523, 1],  // C5
    [659, 1],  // E5
    [784, 1],  // G5
    [1047, 2], // C6
  ]);
}

export function playBlindBoxOpenSound() {
  // 盲盒开启 - 神秘感音效
  playTone(400, 0.15, 'triangle', 0.2);
  setTimeout(() => playTone(500, 0.1, 'triangle', 0.2), 120);
  setTimeout(() => playTone(600, 0.1, 'triangle', 0.2), 220);
  setTimeout(() => playTone(800, 0.15, 'triangle', 0.3), 300);
  // 揭晓音效
  setTimeout(() => {
    playMelody([
      [660, 1],
      [880, 1],
      [1100, 3],
    ]);
  }, 500);
}

export function playAchievementSound() {
  // 成就解锁 - 辉煌音效
  playMelody([
    [523, 1],  // C
    [659, 1],  // E
    [784, 1],  // G
    [1047, 1], // C6
    [784, 1],  // G
    [1047, 1], // C6
    [1319, 3], // E6
  ], 0.1);
}

export function playFailSound() {
  // 错误/失败音效
  playTone(300, 0.15, 'square', 0.15);
  setTimeout(() => playTone(250, 0.25, 'square', 0.15), 120);
}

export function playClickSound() {
  // 点击音效
  playTone(1000, 0.05, 'sine', 0.15);
}

export function playSuccessSound() {
  // 成功音效 - 和弦
  const ctx = getCtx();
  const now = ctx.currentTime;
  [523, 659, 784, 1047].forEach((freq, i) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.4);
    } catch (e) { /* ignore */ }
  });
}

export function playSweepSound() {
  // 扫过音效 - 用于过渡动画
  playTone(400, 0.3, 'sine', 0.12);
  setTimeout(() => playTone(800, 0.2, 'sine', 0.1), 150);
}

// ==================== 用户交互后解锁音频 ====================

export function unlockAudio() {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    // 发一个听不见的短音来解锁
    playTone(1, 0.001, 'sine', 0);
  } catch (e) { /* ignore */ }
}
