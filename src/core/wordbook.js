/**
 * 密文破译 — 单词书解析模块
 * 从 TASKS 中提取英文单词数据并解析为单词卡片
 */
import { TASKS } from '../data/tasks.js';

/**
 * 解析所有英文单词
 * @returns {Array<{id, word, meaning, unitId, unitTitle, category}>}
 */
export function parseWordbook() {
  const enTasks = TASKS.filter(t => t.subject === 'en');
  const words = [];

  for (const task of enTasks) {
    const lines = task.content.split('\n').filter(Boolean);
    for (const line of lines) {
      // 格式: "word 释义" 或 "word phrase 释义"
      const spaceIdx = line.indexOf(' ');
      if (spaceIdx < 0) continue;

      const word = line.slice(0, spaceIdx).trim();
      const meaning = line.slice(spaceIdx + 1).trim();

      if (word && meaning) {
        words.push({
          id: `${task.id}_${words.length}`,
          word,
          meaning,
          unitId: task.id,
          unitTitle: task.title,
          category: task.category || '',
        });
      }
    }
  }

  return words;
}

/**
 * 按单元分组
 * @returns {Array<{unitId, unitTitle, category, words: Array}>}
 */
export function getWordUnits() {
  const allWords = parseWordbook();
  const unitMap = new Map();

  for (const w of allWords) {
    if (!unitMap.has(w.unitId)) {
      unitMap.set(w.unitId, {
        unitId: w.unitId,
        unitTitle: w.unitTitle,
        category: w.category,
        words: [],
      });
    }
    unitMap.get(w.unitId).words.push(w);
  }

  return [...unitMap.values()];
}
