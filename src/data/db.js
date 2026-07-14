/**
 * IndexedDB 封装
 * 存储结构:
 *   - progress: { date, subjectId, taskId, type, stars, timestamp, isBlindbox, isChallenge }
 *   - suggested: { taskId, suggestedDate }
 *   - achievements: { id, title, unlockedAt }
 *   - state: { key, value }
 */

import { CONFIG } from '../config.js';

let db = null;

export function getDB() { return db; }

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(CONFIG.dbName, CONFIG.dbVersion);
    request.onerror = () => reject(request.error);
    request.onblocked = () => {
      reject(new Error('Database upgrade blocked. Please close all other tabs using this app.'));
    };
    request.onsuccess = () => { db = request.result; resolve(db); };
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('progress')) {
        const store = db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('subject', 'subjectId', { unique: false });
        store.createIndex('task', 'taskId', { unique: false });
        store.createIndex('date_task', ['date', 'taskId'], { unique: true });
      }
      if (!db.objectStoreNames.contains('suggested')) {
        db.createObjectStore('suggested', { keyPath: 'taskId' });
      }
      if (!db.objectStoreNames.contains('achievements')) {
        db.createObjectStore('achievements', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('state')) {
        db.createObjectStore('state', { keyPath: 'key' });
      }
    };
  });
}

function ensureDB() {
  if (!db) throw new Error('Database not opened');
  return db;
}

function promisify(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ==================== Progress 操作 ====================

export async function getProgressForDate(date) {
  const store = ensureDB().transaction('progress', 'readonly').objectStore('progress');
  const index = store.index('date');
  const results = await promisify(index.getAll(date));
  return results;
}

export async function getProgressForDateTask(date, taskId) {
  const store = ensureDB().transaction('progress', 'readonly').objectStore('progress');
  const index = store.index('date_task');
  return await promisify(index.get([date, taskId]));
}

export async function getAllProgress() {
  const store = ensureDB().transaction('progress', 'readonly').objectStore('progress');
  return await promisify(store.getAll());
}

export async function saveProgress(record) {
  const store = ensureDB().transaction('progress', 'readwrite').objectStore('progress');
  return await promisify(store.add(record));
}

export async function deleteProgress(date, taskId) {
  const store = ensureDB().transaction('progress', 'readwrite').objectStore('progress');
  const index = store.index('date_task');
  const record = await promisify(index.get([date, taskId]));
  if (record) {
    return await promisify(store.delete(record.id));
  }
  return null;
}

export async function getProgressRange(startDate, endDate) {
  const store = ensureDB().transaction('progress', 'readonly').objectStore('progress');
  const index = store.index('date');
  const range = IDBKeyRange.bound(startDate, endDate);
  return await promisify(index.getAll(range));
}

// ==================== Suggested 操作 ====================

export async function getSuggestedDate(taskId) {
  const store = ensureDB().transaction('suggested', 'readonly').objectStore('suggested');
  const result = await promisify(store.get(taskId));
  return result ? result.suggestedDate : null;
}

export async function getAllSuggested() {
  const store = ensureDB().transaction('suggested', 'readonly').objectStore('suggested');
  return await promisify(store.getAll());
}

export async function setSuggestedDate(taskId, suggestedDate) {
  const store = ensureDB().transaction('suggested', 'readwrite').objectStore('suggested');
  return await promisify(store.put({ taskId, suggestedDate }));
}

export async function clearSuggested() {
  const store = ensureDB().transaction('suggested', 'readwrite').objectStore('suggested');
  return await promisify(store.clear());
}

// ==================== Achievements 操作 ====================

export async function getAchievements() {
  const store = ensureDB().transaction('achievements', 'readonly').objectStore('achievements');
  return await promisify(store.getAll());
}

export async function unlockAchievement(achievement) {
  const store = ensureDB().transaction('achievements', 'readwrite').objectStore('achievements');
  return await promisify(store.put(achievement));
}

export async function isAchievementUnlocked(id) {
  const store = ensureDB().transaction('achievements', 'readonly').objectStore('achievements');
  const result = await promisify(store.get(id));
  return !!result;
}

// ==================== State 操作 ====================

export async function getState(key) {
  const store = ensureDB().transaction('state', 'readonly').objectStore('state');
  const result = await promisify(store.get(key));
  return result ? result.value : null;
}

export async function setState(key, value) {
  const store = ensureDB().transaction('state', 'readwrite').objectStore('state');
  return await promisify(store.put({ key, value }));
}

// ==================== 统计查询 ====================

export async function getTotalStars() {
  const all = await getAllProgress();
  return all.reduce((sum, r) => sum + (r.stars || 0), 0);
}

export async function getCompletedTaskIds() {
  const all = await getAllProgress();
  return [...new Set(all.map(r => r.taskId))];
}

export async function getStreakDates() {
  const all = await getAllProgress();
  return [...new Set(all.map(r => r.date))].sort();
}
