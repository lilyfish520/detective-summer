# 见习侦探的暑期事件簿 -- 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于设计文档从零重建"见习侦探的暑期事件簿"应用 -- Vite + 原生 JS ES Modules，IndexedDB 存储，三层激励体系，成就徽章，音效动画。

**Architecture:** 三层分离：data/（IndexedDB + 静态数据）-> core/（纯逻辑，不碰 DOM）-> ui/（渲染 + 事件绑定）。main.js 管理全局状态，单向数据流。

**Tech Stack:** Vite + 原生 JavaScript ES Modules + 纯 CSS + Web Audio API + IndexedDB，零运行时依赖。

---

## 文件清单

| 文件 | 职责 |
|------|------|
| `index.html` | Vite 入口，HTML 骨架 |
| `package.json` | 项目配置 |
| `vite.config.js` | Vite 构建配置 |
| `src/config.js` | CONFIG 常量 |
| `src/data/db.js` | IndexedDB 封装 |
| `src/data/tasks.js` | 任务静态数据（ALL_TASKS、DAILY_TASKS、CHAPTER_REF、SPORTS） |
| `src/data/blindboxes.js` | 盲盒内容库（A/B/C 三类 + 每日挑战题库） |
| `src/core/engine.js` | 日期工具函数 |
| `src/core/progress.js` | 打卡/星星/连续天数/完成率/成就/等级 |
| `src/core/blindbox.js` | 盲盒/阶梯线索/每日挑战逻辑 |
| `src/ui/components.js` | Toast、弹窗、确认框、星星动画等通用组件 |
| `src/ui/header.js` | 顶部导航栏渲染 |
| `src/ui/tab-search.js` | Tab1 今日搜证 |
| `src/ui/tab-archive.js` | Tab2 案卷归档 |
| `src/ui/tab-stats.js` | Tab3 名侦探履历 |
| `src/audio/sounds.js` | Web Audio API 音效生成 |
| `src/styles/main.css` | 全局样式 |
| `src/main.js` | 应用入口，初始化与 Tab 切换 |

---

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/` 目录结构

- [ ] **Step 1: 创建 package.json**

```bash
cd /Users/yeting/Documents/Projects/detective-summer
```

写入 `package.json`:

```json
{
  "name": "detective-summer",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: 创建 vite.config.js**

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
  server: {
    open: true,
  },
});
```

- [ ] **Step 3: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
  <title>见习侦探的暑期事件簿</title>
  <link rel="stylesheet" href="/src/styles/main.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: 创建目录结构**

```bash
mkdir -p src/{data,core,ui,audio,styles}
```

- [ ] **Step 5: 安装依赖**

```bash
cd /Users/yeting/Documents/Projects/detective-summer && npm install
```

- [ ] **Step 6: 启动开发服务器验证脚手架**

```bash
npm run dev
```

预期：浏览器打开，显示空白页面，控制台无报错。

---

### Task 2: 配置与静态数据

**Files:**
- Create: `src/config.js`
- Create: `src/data/tasks.js`
- Create: `src/data/blindboxes.js`

- [ ] **Step 1: 创建 src/config.js**

```javascript
export const CONFIG = {
  startDate: '2026-07-13',
  endDate: '2026-08-31',
  restDays: [0],
  travelStart: '2026-08-01',
  travelEnd: '2026-08-10',
  reviewLimit: 10,
  reviewIntervals: [1, 2, 4, 7, 15],
  maxCustomTasks: 5,
  starThresholds: { copper: 3, silver: 5, gold: 8 },
  maxStarsPerDay: 20,
  dbName: 'detective_summer_v2',
  dbVersion: 1,
};

export const SUBJECTS = [
  { id: 'yw', name: '古籍破译', icon: '📖', type: 'recite', color: '#3B82F6' },
  { id: 'en', name: '密文翻译', icon: '🇬🇧', type: 'recite', color: '#3B82F6' },
  { id: 'sx', name: '密码解析', icon: '📐', type: 'chapter', color: '#64748B' },
  { id: 'wl', name: '现场重建', icon: '⚡', type: 'chapter', color: '#64748B' },
  { id: 'sp', name: '体能训练', icon: '🏃', type: 'sport', color: '#22C55E' },
  { id: 'ot', name: '特别行动', icon: '🎯', type: 'custom', color: '#94A3B8' },
];

export const SPORTS = [
  { id: 'swim', name: '游泳', icon: '🏊' },
  { id: 'stretch', name: '拉伸', icon: '🧘' },
  { id: 'run', name: '跑步', icon: '🏃' },
  { id: 'jump', name: '跳绳', icon: '🪢' },
];

export function getSubject(id) {
  return SUBJECTS.find(s => s.id === id);
}
```

- [ ] **Step 2: 创建 src/data/tasks.js**

从原有 `暑假打卡.html` 中迁移 ALL_TASKS、DAILY_TASKS、CHAPTER_REF 数据，添加 `assignSuggestedDates()` 逻辑。

```javascript
import { CONFIG } from '../config.js';
import { isSunday, isTravel, addDays } from '../core/engine.js';

export const DAILY_TASKS = {
  yw: [
    { id: 'yw_daily_read', title: '阅读理解1篇' },
    { id: 'yw_daily_book', title: '推荐书目阅读' },
  ],
  en: [
    { id: 'en_daily_news', title: '时文阅读' },
    { id: 'en_daily_read', title: '阅读理解1篇', satAlt: '作文+听力' },
  ],
};

export const ALL_TASKS = [
  // 语文背诵 27项
  { id: 'yw_11', sub: 'yw', title: '三峡', subTitle: '郦道元' },
  { id: 'yw_12a', sub: 'yw', title: '答谢中书书', subTitle: '陶弘景' },
  { id: 'yw_12b', sub: 'yw', title: '记承天寺夜游', subTitle: '苏轼' },
  { id: 'yw_13', sub: 'yw', title: '与朱元思书', subTitle: '吴均' },
  { id: 'yw_14a', sub: 'yw', title: '野望', subTitle: '王绩' },
  { id: 'yw_14b', sub: 'yw', title: '黄鹤楼', subTitle: '崔颢' },
  { id: 'yw_14c', sub: 'yw', title: '使至塞上', subTitle: '王维' },
  { id: 'yw_14d', sub: 'yw', title: '渡荆门送别', subTitle: '李白' },
  { id: 'yw_14e', sub: 'yw', title: '钱塘湖春行', subTitle: '白居易' },
  { id: 'yw_sc1', sub: 'yw', title: '庭中有奇树', subTitle: '《古诗十九首》' },
  { id: 'yw_sc2', sub: 'yw', title: '龟虽寿', subTitle: '曹操' },
  { id: 'yw_sc3', sub: 'yw', title: '赠从弟', subTitle: '刘桢' },
  { id: 'yw_sc4', sub: 'yw', title: '梁甫行', subTitle: '曹植' },
  { id: 'yw_23a', sub: 'yw', title: '得道多助，失道寡助', subTitle: '《孟子》' },
  { id: 'yw_23b', sub: 'yw', title: '富贵不能淫', subTitle: '《孟子》' },
  { id: 'yw_23c', sub: 'yw', title: '生于忧患，死于安乐', subTitle: '《孟子》' },
  { id: 'yw_24', sub: 'yw', title: '愚公移山', subTitle: '《列子》' },
  { id: 'yw_25', sub: 'yw', title: '周亚夫军细柳', subTitle: '司马迁' },
  { id: 'yw_26a', sub: 'yw', title: '饮酒（其五）', subTitle: '陶渊明' },
  { id: 'yw_26b', sub: 'yw', title: '春望', subTitle: '杜甫' },
  { id: 'yw_26c', sub: 'yw', title: '雁门太守行', subTitle: '李贺' },
  { id: 'yw_26d', sub: 'yw', title: '赤壁', subTitle: '杜牧' },
  { id: 'yw_26e', sub: 'yw', title: '渔家傲', subTitle: '李清照' },
  { id: 'yw_sc5', sub: 'yw', title: '浣溪沙', subTitle: '晏殊' },
  { id: 'yw_sc6', sub: 'yw', title: '采桑子', subTitle: '欧阳修' },
  { id: 'yw_sc7', sub: 'yw', title: '相见欢', subTitle: '朱敦儒' },
  { id: 'yw_sc8', sub: 'yw', title: '如梦令', subTitle: '李清照' },
  // 英语背诵 16项
  { id: 'en_u1a', sub: 'en', title: 'U1 Look it up! 单词(前半)+短语' },
  { id: 'en_u1b', sub: 'en', title: 'U1 Look it up! 单词(后半)' },
  { id: 'en_u2a', sub: 'en', title: 'U2 Amazing numbers 单词(前半)+短语' },
  { id: 'en_u2b', sub: 'en', title: 'U2 Amazing numbers 单词(后半)' },
  { id: 'en_u3a', sub: 'en', title: 'U3 Our digital lives 单词(前半)+短语' },
  { id: 'en_u3b', sub: 'en', title: 'U3 Our digital lives 单词(后半)' },
  { id: 'en_u4a', sub: 'en', title: 'U4 Inventions 单词(前半)+短语' },
  { id: 'en_u4b', sub: 'en', title: 'U4 Inventions 单词(后半)' },
  { id: 'en_u5a', sub: 'en', title: 'U5 Going on an exchange trip 单词(前半)+短语' },
  { id: 'en_u5b', sub: 'en', title: 'U5 Going on an exchange trip 单词(后半)' },
  { id: 'en_u6a', sub: 'en', title: 'U6 Wisdom counts 单词(前半)+短语' },
  { id: 'en_u6b', sub: 'en', title: 'U6 Wisdom counts 单词(后半)' },
  { id: 'en_u7a', sub: 'en', title: 'U7 The secret of memory 单词(前半)+短语' },
  { id: 'en_u7b', sub: 'en', title: 'U7 The secret of memory 单词(后半)' },
  { id: 'en_u8a', sub: 'en', title: 'U8 Pets and us 单词(前半)+短语' },
  { id: 'en_u8b', sub: 'en', title: 'U8 Pets and us 单词(后半)' },
];

export const CHAPTER_REF = {
  sx: [
    { chapter: '第十三章 三角形', items: ['13.1 三角形的概念', '13.2 与三角形有关的线段', '13.3 三角形的内角与外角'] },
    { chapter: '第十四章 全等三角形', items: ['14.1 全等三角形及其性质', '14.2 三角形全等的判定', '14.3 角的平分线'] },
    { chapter: '第十五章 轴对称', items: ['15.1 图形的轴对称', '15.2 画轴对称的图形', '15.3 等腰三角形'] },
    { chapter: '第十六章 整式的乘法', items: ['16.1 幂的运算', '16.2 整式的乘法', '16.3 乘法公式'] },
    { chapter: '第十七章 因式分解', items: ['17.1 用提公因式法分解因式', '17.2 用公式法分解因式'] },
    { chapter: '第十八章 分式', items: ['18.1 分式及其基本性质', '18.2 分式的乘法与除法', '18.3 分式的加法与减法', '18.4 整数指数幂', '18.5 分式方程'] },
  ],
  wl: [
    { chapter: '第1章 机械运动', items: ['1.1 长度和时间的测量', '1.2 运动的描述', '1.3 运动的快慢', '1.4 速度的测量'] },
    { chapter: '第2章 声现象', items: ['2.1 声音的产生与传播', '2.2 声音的特性', '2.3 声的利用', '2.4 噪声的危害和控制', '2.5 制作隔音房间模型'] },
    { chapter: '第3章 物态变化', items: ['3.1 温度', '3.2 熔化和凝固', '3.3 汽化和液化', '3.4 升华和凝华', '3.5 探索厨房物态变化'] },
    { chapter: '第4章 光现象', items: ['4.1 光的直线传播', '4.2 光的反射', '4.3 平面镜成像', '4.4 光的折射', '4.5 光的色散'] },
    { chapter: '第5章 透镜及其应用', items: ['5.1 透镜', '5.2 生活中的透镜', '5.3 凸透镜成像的规律', '5.4 眼睛和眼镜', '5.5 制作望远镜'] },
    { chapter: '第6章 质量与密度', items: ['6.1 质量', '6.2 密度', '6.3 测量液体和固体的密度', '6.4 密度的应用'] },
  ],
};

export function assignSuggestedDates() {
  const learningDays = [];
  let d = CONFIG.startDate;
  while (d <= CONFIG.endDate) {
    if (!isSunday(d) && !isTravel(d)) learningDays.push(d);
    d = addDays(d, 1);
  }
  const reciteDays = learningDays.filter((_, i) => i % 2 === 0);
  const ywTasks = ALL_TASKS.filter(t => t.sub === 'yw');
  const enTasks = ALL_TASKS.filter(t => t.sub === 'en');

  for (let i = 0; i < ywTasks.length; i++) {
    const idx = Math.min(Math.floor(i * reciteDays.length / ywTasks.length), reciteDays.length - 1);
    ywTasks[i].suggestedDate = reciteDays[idx];
  }
  for (let i = 0; i < enTasks.length; i++) {
    const idx = Math.min(Math.floor(i * reciteDays.length / enTasks.length), reciteDays.length - 1);
    enTasks[i].suggestedDate = reciteDays[idx];
  }
}

export function getTaskMeta(id) {
  return ALL_TASKS.find(t => t.id === id);
}

export function getTasksBySubject(subId) {
  return ALL_TASKS.filter(t => t.sub === subId);
}
```

- [ ] **Step 3: 创建 src/data/blindboxes.js**

从原有代码迁移盲盒内容库，添加每日挑战题库。

```javascript
export const BLIND_BOX_A = [
  { q: '一个人死在沙漠中，身边只有一个背包和一根断了的火柴棍。他是怎么死的？', a: '他从热气球上跳下来，抽签抽到了最短的火柴棍，不得已被推下摔死。' },
  { q: '死者倒在密闭房间里，地上有一摊水和一根针。死因是什么？', a: '死者是被冰锥刺死的。凶手用冰做成锥子，杀人后冰融化，只剩下一摊水。针是误导。' },
  // ... 保持原有18条内容 ...
];

export const BLIND_BOX_B = [
  { q: '鲁米诺反应是什么？', a: '鲁米诺（Luminol）是一种化学试剂，与血液中的铁元素反应会发出蓝绿色荧光...' },
  // ... 保持原有18条内容 ...
];

export const DAILY_CHALLENGES = [
  { id: 'ch_first_en', desc: '今天第一个完成英语背诵', reward: 3, check: (state, date) => { /* 检查逻辑 */ } },
  { id: 'ch_early_math', desc: '今天在10:00前完成全部数学章节', reward: 3 },
  { id: 'ch_long_diary', desc: '今天写超过50字的办案笔记', reward: 3 },
  { id: 'ch_full_sport', desc: '今天完成全部4项体能训练', reward: 3 },
  { id: 'ch_three_subjects', desc: '今天完成3个不同科目的任务', reward: 3 },
  { id: 'ch_custom_three', desc: '今天完成3项特别行动', reward: 3 },
];

export const ENCOURAGES = [
  '真相就在眼前，继续追查！',
  '线索正在汇聚…',
  '干得好，侦探！',
  '每一份证据都在逼近真相！',
  '保持节奏，名侦探！',
];
```

> 注：盲盒A/B完整内容（各18条）从原有 `暑假打卡.html` 中完整迁移。

---

### Task 3: 日期引擎

**Files:**
- Create: `src/core/engine.js`

- [ ] **Step 1: 创建 src/core/engine.js**

```javascript
import { CONFIG } from '../config.js';

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function dayDiff(a, b) {
  return Math.floor((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
}

export function getDayOfWeek(dateStr) {
  return new Date(dateStr + 'T00:00:00').getDay();
}

export function isSunday(dateStr) {
  return CONFIG.restDays.includes(getDayOfWeek(dateStr));
}

export function isSaturday(dateStr) {
  return getDayOfWeek(dateStr) === 6;
}

export function isTravel(dateStr) {
  return dateStr >= CONFIG.travelStart && dateStr <= CONFIG.travelEnd;
}

export function isDateInRange(dateStr) {
  return dateStr >= CONFIG.startDate && dateStr <= todayStr();
}

export function fmtDate(dateStr) {
  const dt = new Date(dateStr + 'T00:00:00');
  const week = ['日', '一', '二', '三', '四', '五', '六'][dt.getDay()];
  return `${parseInt(dateStr.slice(5, 7))}月${parseInt(dateStr.slice(8, 10))}日 周${week}`;
}

export function getDayIndex(dateStr) {
  return dayDiff(CONFIG.startDate, dateStr);
}

export function getNextReviewDate(learnedDate, reviewCount) {
  if (reviewCount >= CONFIG.reviewIntervals.length) return null;
  return addDays(learnedDate, CONFIG.reviewIntervals[reviewCount]);
}

export function getAllLearningDays() {
  const days = [];
  let d = CONFIG.startDate;
  while (d <= CONFIG.endDate) {
    if (!isSunday(d) && !isTravel(d)) days.push(d);
    d = addDays(d, 1);
  }
  return days;
}

export function now() {
  return new Date();
}

export function isEarlyMorning() {
  return new Date().getHours() < 8;
}
```

---

### Task 4: IndexedDB 存储层

**Files:**
- Create: `src/data/db.js`

- [ ] **Step 1: 创建 src/data/db.js**

```javascript
import { CONFIG } from '../config.js';

let db = null;

export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(CONFIG.dbName, CONFIG.dbVersion);

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains('state')) {
        database.createObjectStore('state', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('backups')) {
        const backupStore = database.createObjectStore('backups', { autoIncrement: true });
        backupStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

const DEFAULT_STATE = {
  id: 'current',
  tasks: {},
  activeDays: [],
  customTasks: {},
  dailyDone: {},
  chapterDone: {},
  sportDone: {},
  blindboxes: {},
  dailyBlindboxes: {},
  diary: {},
  stars: {},
  badges: [],
  _version: 1,
};

function getStore(mode) {
  const tx = db.transaction('state', mode);
  return tx.objectStore('state');
}

export function loadState() {
  return new Promise((resolve, reject) => {
    try {
      const store = getStore('readonly');
      const request = store.get('current');
      request.onsuccess = () => {
        const data = request.result;
        if (data) {
          // 合并默认值，确保新字段存在
          const merged = { ...DEFAULT_STATE, ...data };
          resolve(merged);
        } else {
          resolve({ ...DEFAULT_STATE });
        }
      };
      request.onerror = () => reject(request.error);
    } catch (e) {
      reject(e);
    }
  });
}

export function saveState(state) {
  return new Promise((resolve, reject) => {
    try {
      const store = getStore('readwrite');
      const request = store.put({ ...state, id: 'current' });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    } catch (e) {
      reject(e);
    }
  });
}

export function backupState() {
  return new Promise((resolve, reject) => {
    loadState().then(state => {
      const tx = db.transaction('backups', 'readwrite');
      const store = tx.objectStore('backups');
      const data = { timestamp: Date.now(), data: state };
      const request = store.add(data);
      request.onsuccess = () => {
        // 清理旧备份，保留最近7天
        cleanupBackups();
        resolve();
      };
      request.onerror = () => reject(request.error);
    }).catch(reject);
  });
}

function cleanupBackups() {
  const tx = db.transaction('backups', 'readwrite');
  const store = tx.objectStore('backups');
  const index = store.index('timestamp');
  const request = index.openCursor(null, 'prev');
  let count = 0;
  request.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      count++;
      if (count > 7) {
        store.delete(cursor.primaryKey);
      }
      cursor.continue();
    }
  };
}

export function exportJSON() {
  return loadState().then(state => JSON.stringify(state, null, 2));
}

export function importJSON(json) {
  return new Promise((resolve, reject) => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed.tasks || !parsed.activeDays) {
        reject(new Error('数据格式不匹配'));
        return;
      }
      saveState({ ...DEFAULT_STATE, ...parsed, id: 'current' }).then(resolve).catch(reject);
    } catch (e) {
      reject(new Error('JSON解析失败'));
    }
  });
}
```

- [ ] **Step 2: 验证 IndexedDB**

在浏览器 console 中测试：

```javascript
import { initDB, loadState, saveState } from './src/data/db.js';
await initDB();
const state = await loadState();
console.log(state); // 应输出默认 state 对象
```

---

### Task 5: 核心进度逻辑

**Files:**
- Create: `src/core/progress.js`

此模块是业务逻辑核心，处理所有打卡操作、星星计算、成就检测、等级判定。

- [ ] **Step 1: 创建 src/core/progress.js -- 基础函数**

```javascript
import { CONFIG } from '../config.js';
import { todayStr, addDays, isSunday, isTravel } from './engine.js';
import { ALL_TASKS, getTaskMeta, getTasksBySubject, DAILY_TASKS, CHAPTER_REF } from '../data/tasks.js';
import { getSubject, SPORTS } from '../config.js';

// 获取或创建任务记录
function ensureTask(state, id) {
  if (!state.tasks[id]) {
    state.tasks[id] = { status: 'pending' };
  }
  return state.tasks[id];
}

// 记录打卡日期
function addActiveDay(state, date) {
  if (!state.activeDays.includes(date)) {
    state.activeDays.push(date);
    state.activeDays.sort();
  }
}

// 获取当日星星数
function getStarsForDate(state, date) {
  return state.stars[date] || 0;
}

// 增加星星
function addStars(state, date, amount) {
  if (!state.stars[date]) state.stars[date] = 0;
  const current = state.stars[date];
  const max = CONFIG.maxStarsPerDay;
  const actual = Math.min(amount, max - current);
  state.stars[date] = current + actual;
  return actual;
}
```

- [ ] **Step 2: 创建打卡函数**

```javascript
// 完成新背诵任务
export function completeNewTask(state, id, date) {
  const task = ensureTask(state, id);
  if (task.status !== 'pending') return { state, events: [] };

  task.status = 'reviewing';
  task.learnedDate = date;
  task.reviewCount = 0;
  task.nextReviewDate = addDays(date, CONFIG.reviewIntervals[0]);

  addActiveDay(state, date);
  addStars(state, date, 1);

  const events = [{ type: 'task_complete', id }];
  const newBadges = checkBadges(state);
  newBadges.forEach(b => events.push({ type: 'badge', badge: b }));

  return { state, events };
}

// 完成复习任务
export function completeReviewTask(state, id, date) {
  const task = state.tasks[id];
  if (!task || task.status !== 'reviewing') return { state, events: [] };

  task.reviewCount = (task.reviewCount || 0) + 1;
  if (task.reviewCount >= 5) {
    task.status = 'mastered';
    task.nextReviewDate = null;
  } else {
    task.nextReviewDate = addDays(date, CONFIG.reviewIntervals[task.reviewCount]);
  }

  addActiveDay(state, date);
  addStars(state, date, 1);

  const events = [{ type: 'review_complete', id }];
  const newBadges = checkBadges(state);
  newBadges.forEach(b => events.push({ type: 'badge', badge: b }));

  return { state, events };
}

// 完成每日固定任务
export function completeDailyTask(state, taskId, date) {
  const key = `daily_${taskId}_${date}`;
  const wasDone = state.dailyDone[key] || false;
  state.dailyDone[key] = !wasDone;

  if (!wasDone) {
    addActiveDay(state, date);
    addStars(state, date, 1);
  } else {
    // 取消完成，扣星
    if (state.stars[date]) state.stars[date] = Math.max(0, state.stars[date] - 1);
  }

  return { state, events: [{ type: 'daily_toggle', taskId, done: !wasDone }] };
}

// 完成章节（数学/物理）
export function completeChapter(state, subId, chapterIdx, itemIdx, date) {
  const chapter = CHAPTER_REF[subId][chapterIdx];
  const itemName = chapter.items[itemIdx];
  const key = `ch_${subId}_${chapterIdx}_${itemIdx}_${date}`;
  const wasDone = state.chapterDone[key] || false;
  state.chapterDone[key] = !wasDone;

  if (!wasDone) {
    addActiveDay(state, date);
    addStars(state, date, 1);
  } else {
    if (state.stars[date]) state.stars[date] = Math.max(0, state.stars[date] - 1);
  }

  return { state, events: [{ type: 'chapter_toggle', subId, chapterIdx, itemIdx, done: !wasDone }] };
}

// 完成体育运动
export function completeSport(state, sportId, date) {
  const key = `sport_${sportId}_${date}`;
  const wasDone = state.sportDone[key] || false;
  state.sportDone[key] = !wasDone;

  if (!wasDone) {
    addActiveDay(state, date);
    addStars(state, date, 1);
  } else {
    if (state.stars[date]) state.stars[date] = Math.max(0, state.stars[date] - 1);
  }

  return { state, events: [{ type: 'sport_toggle', sportId, done: !wasDone }] };
}

// 完成特别行动
export function completeCustomTask(state, index, date) {
  const key = date;
  if (!state.customTasks[key]) state.customTasks[key] = [];
  const customs = state.customTasks[key];
  if (index < 0 || index >= customs.length) return { state, events: [] };

  const wasDone = customs[index].done;
  customs[index].done = !wasDone;

  if (!wasDone) {
    addActiveDay(state, date);
    addStars(state, date, 1);
  } else {
    if (state.stars[date]) state.stars[date] = Math.max(0, state.stars[date] - 1);
  }

  return { state, events: [{ type: 'custom_toggle', index, done: !wasDone }] };
}

// 添加特别行动
export function addCustomTask(state, desc, date) {
  const key = date;
  if (!state.customTasks[key]) state.customTasks[key] = [];
  if (state.customTasks[key].length >= CONFIG.maxCustomTasks) {
    return { state, events: [], error: '每天最多添加5项特别行动' };
  }
  state.customTasks[key].push({ desc: desc.trim(), done: false });
  return { state, events: [{ type: 'custom_added', desc }] };
}

// 保存学习日记
export function saveDiary(state, text, date) {
  if (!state.diary[date]) {
    state.diary[date] = { text: '', stars: 0 };
  }
  const wasEmpty = !state.diary[date].text;
  state.diary[date].text = text;
  if (wasEmpty && text.trim()) {
    addStars(state, date, 1);
    return { state, events: [{ type: 'diary_saved' }] };
  }
  return { state, events: [] };
}

// CASE CLOSED 奖励
export function awardCaseClosed(state, date) {
  addStars(state, date, 5);
  return { state, events: [{ type: 'case_closed' }] };
}
```

- [ ] **Step 3: 创建统计函数**

```javascript
// 连续打卡天数
export function calcStreak(state) {
  const days = new Set(state.activeDays);
  let cur = 0;
  let d = todayStr();
  while (days.has(d)) { cur++; d = addDays(d, -1); }

  let longest = 0;
  for (const day of state.activeDays) {
    let c = 1;
    let nd = day;
    while (days.has(addDays(nd, 1))) { c++; nd = addDays(nd, 1); }
    if (c > longest) longest = c;
  }
  return { current: cur, longest: Math.max(longest, cur) };
}

// 总进度（仅背诵任务）
export function calcProgress(state) {
  const total = ALL_TASKS.length;
  let done = 0;
  for (const [id, t] of Object.entries(state.tasks)) {
    if (t.status === 'mastered') done++;
  }
  return total > 0 ? (done / total) * 100 : 0;
}

// 单科进度
export function calcSubProgress(state, subId) {
  const tasks = getTasksBySubject(subId);
  let done = 0;
  for (const t of tasks) {
    const td = state.tasks[t.id];
    if (td && td.status === 'mastered') done++;
  }
  return { done, total: tasks.length };
}

// 当日可视任务总数
export function countTodayVisible(state, date) {
  let count = 0;
  // 复习任务（上限内）
  const reviewDue = getReviewDueTasks(state, date);
  count += Math.min(reviewDue.length, CONFIG.reviewLimit);
  // 各科目新任务
  for (const sub of SUBJECTS) {
    if (sub.type === 'recite') {
      count += getNewTasksForSubject(state, sub.id, date).length;
      const dl = DAILY_TASKS[sub.id];
      if (dl) count += dl.length;
    } else if (sub.type === 'chapter') {
      if (!isTravel(date)) count += 1; // 章节面板算1个区域
    } else if (sub.type === 'sport') {
      count += SPORTS.length;
    } else if (sub.type === 'custom') {
      const customs = state.customTasks[date] || [];
      count += customs.length;
    }
  }
  return count;
}
```

- [ ] **Step 4: 创建复习相关函数**

```javascript
// 获取到期复习任务
export function getReviewDueTasks(state, date) {
  const due = [];
  for (const [id, t] of Object.entries(state.tasks)) {
    if (t.status === 'reviewing' && t.nextReviewDate && t.nextReviewDate <= date && (t.reviewCount || 0) < 5) {
      const meta = getTaskMeta(id);
      if (meta) due.push({ id, ...t, meta });
    }
  }
  due.sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
  return due;
}

// 获取某科当日应出现的新任务
export function getNewTasksForSubject(state, subId, date) {
  const tasks = getTasksBySubject(subId);
  return tasks.filter(t => {
    const td = state.tasks[t.id];
    if (td && td.status !== 'pending') return false;
    const sd = t.suggestedDate || CONFIG.startDate;
    return sd <= date;
  });
}
```

- [ ] **Step 5: 创建成就检测**

```javascript
export const BADGES = [
  { id: 'streak_7', name: '初露锋芒', icon: '🔥', desc: '连续打卡7天', check: (s) => calcStreak(s).longest >= 7 },
  { id: 'streak_14', name: '稳步前进', icon: '⭐', desc: '连续打卡14天', check: (s) => calcStreak(s).longest >= 14 },
  { id: 'streak_21', name: '坚如磐石', icon: '💎', desc: '连续打卡21天', check: (s) => calcStreak(s).longest >= 21 },
  { id: 'streak_30', name: '传奇侦探', icon: '👑', desc: '连续打卡30天', check: (s) => calcStreak(s).longest >= 30 },
  { id: 'yw_all', name: '古籍大师', icon: '📖', desc: '完成全部27项语文背诵', check: (s) => calcSubProgress(s, 'yw').done >= 27 },
  { id: 'en_all', name: '密文专家', icon: '🇬🇧', desc: '完成全部16项英语背诵', check: (s) => calcSubProgress(s, 'en').done >= 16 },
  { id: 'sx_all', name: '密码破解者', icon: '📐', desc: '完成全部19节数学', check: (s) => countChapterDone(s, 'sx') >= 19 },
  { id: 'wl_all', name: '现场重建者', icon: '⚡', desc: '完成全部29节物理', check: (s) => countChapterDone(s, 'wl') >= 29 },
  { id: 'sport_30', name: '体能达人', icon: '🏃', desc: '累计完成30次体育运动', check: (s) => countSportDone(s) >= 30 },
  { id: 'active_40', name: '全勤侦探', icon: '🎯', desc: '累计打卡40天以上', check: (s) => s.activeDays.length >= 40 },
  { id: 'stars_100', name: '星星收藏家', icon: '🌟', desc: '累计获得100颗星', check: (s) => countTotalStars(s) >= 100 },
  { id: 'custom_30', name: '行动派', icon: '🏃', desc: '完成30项以上特别行动', check: (s) => countCustomDone(s) >= 30 },
  { id: 'blindbox_20', name: '盲盒猎人', icon: '🎁', desc: '解锁20个以上盲盒', check: (s) => Object.keys(s.blindboxes).length >= 20 },
  // 隐藏成就
  { id: 'early_bird', name: '黎明侦探', icon: '🌅', desc: '早上8:00前完成第一项打卡', hidden: true },
  { id: 'diary_7', name: '日记达人', icon: '📝', desc: '连续7天写学习日记', hidden: true },
  { id: 'perfect_week', name: '完美一周', icon: '🎪', desc: '一周内每天都CASE CLOSED', hidden: true },
];

export function checkBadges(state) {
  const unlocked = [];
  for (const badge of BADGES) {
    if (state.badges.includes(badge.id)) continue;
    if (badge.check && badge.check(state)) {
      state.badges.push(badge.id);
      unlocked.push(badge);
    }
  }
  return unlocked;
}

function countChapterDone(state, subId) {
  let count = 0;
  for (const key of Object.keys(state.chapterDone)) {
    if (key.startsWith(`ch_${subId}_`) && state.chapterDone[key]) count++;
  }
  return count;
}

function countSportDone(state) {
  let count = 0;
  for (const key of Object.keys(state.sportDone)) {
    if (state.sportDone[key]) count++;
  }
  return count;
}

function countTotalStars(state) {
  return Object.values(state.stars).reduce((sum, n) => sum + n, 0);
}

function countCustomDone(state) {
  let count = 0;
  for (const customs of Object.values(state.customTasks)) {
    count += customs.filter(c => c.done).length;
  }
  return count;
}
```

- [ ] **Step 6: 创建等级函数**

```javascript
// 侦探等级
export function getDetectiveRank(streak) {
  const n = streak.longest;
  if (n >= 30) return { level: 4, title: '名侦探', icon: '🎖️' };
  if (n >= 21) return { level: 3, title: '高级侦探', icon: '🕵️' };
  if (n >= 14) return { level: 2, title: '探员', icon: '🔎' };
  if (n >= 7) return { level: 1, title: '见习侦探', icon: '🔍' };
  return { level: 0, title: '新手', icon: '🆕' };
}

// 星星阶梯
export function getStarTier(starsToday) {
  if (starsToday >= CONFIG.starThresholds.gold) return 'gold';
  if (starsToday >= CONFIG.starThresholds.silver) return 'silver';
  if (starsToday >= CONFIG.starThresholds.copper) return 'copper';
  return null;
}

// 本周星星趋势
export function calcStarsWeek(state) {
  const result = [];
  let d = todayStr();
  const dow = getDayOfWeek(d);
  const monday = addDays(d, -(dow === 0 ? 6 : dow - 1));
  for (let i = 0; i < 7; i++) {
    const date = addDays(monday, i);
    result.push({ date, stars: state.stars[date] || 0 });
  }
  return result;
}
```

> 注：需在 `getDayOfWeek` 的 import 中添加该函数引用。

---

### Task 6: 盲盒/挑战逻辑

**Files:**
- Create: `src/core/blindbox.js`

- [ ] **Step 1: 创建 src/core/blindbox.js**

```javascript
import { BLIND_BOX_A, BLIND_BOX_B, DAILY_CHALLENGES } from '../data/blindboxes.js';
import { getDayIndex, isSunday } from './engine.js';
import { countTodayVisible } from './progress.js';

// 每日盲盒（页面打开时触发）
export function checkDailyBlindbox(state, date) {
  if (isSunday(date)) return null;
  const dayIdx = getDayIndex(date);
  const bbKey = `daily_${dayIdx}`;
  if (state.dailyBlindboxes[bbKey]) return null;

  const pool = Math.random() < 0.5 ? BLIND_BOX_A : BLIND_BOX_B;
  const idx = dayIdx % pool.length;
  const item = pool[idx];

  state.dailyBlindboxes[bbKey] = { date, q: item.q, a: item.a || '' };
  return { state, blindbox: { type: 'daily', ...item, dayIdx } };
}

// 获取今日挑战
export function getTodayChallenge(state, date) {
  const dayIdx = getDayIndex(date);
  const challenge = DAILY_CHALLENGES[dayIdx % DAILY_CHALLENGES.length];
  return { ...challenge, date };
}

// 检查挑战是否完成
export function checkChallengeComplete(state, challenge, date) {
  // 简化实现：部分挑战需要运行时判断
  const stars = state.stars[date] || 0;
  if (challenge.id === 'ch_full_sport') {
    const sports = ['swim', 'stretch', 'run', 'jump'];
    return sports.every(s => state.sportDone[`sport_${s}_${date}`]);
  }
  // 默认：当日星星 >= 5 视为完成挑战（简化判断）
  return stars >= 5;
}

// 判断是否可以结案
export function canCaseClose(state, date) {
  if (isSunday(date)) return false;
  const visibleCount = countTodayVisible(state, date);
  const doneCount = countTodayDone(state, date);
  return visibleCount > 0 && doneCount >= visibleCount;
}

function countTodayDone(state, date) {
  let count = 0;
  // 自定义任务
  const customs = state.customTasks[date] || [];
  count += customs.filter(c => c.done).length;
  // 每日任务
  for (const key of Object.keys(state.dailyDone)) {
    if (key.endsWith(`_${date}`) && state.dailyDone[key]) count++;
  }
  // 章节
  for (const key of Object.keys(state.chapterDone)) {
    if (key.endsWith(`_${date}`) && state.chapterDone[key]) count++;
  }
  // 体育
  for (const key of Object.keys(state.sportDone)) {
    if (key.endsWith(`_${date}`) && state.sportDone[key]) count++;
  }
  // 背诵（新学+复习）
  for (const [id, t] of Object.entries(state.tasks)) {
    if (t.learnedDate === date) count++;
    if (t.status === 'reviewing' && t.reviewCount > 0) {
      // 检查最近一次复习日期
      const lastReviewDate = getLastReviewDate(t);
      if (lastReviewDate === date) count++;
    }
  }
  return count;
}

function getLastReviewDate(task) {
  // 根据 reviewCount 推算最近一次复习的日期
  if (!task.learnedDate || task.reviewCount <= 0) return null;
  const { CONFIG } = require('../config.js');
  const intervals = CONFIG.reviewIntervals;
  let d = task.learnedDate;
  for (let i = 0; i < task.reviewCount; i++) {
    d = addDays(d, intervals[i]);
  }
  return d;
}
```

> 注：此模块的 `addDays` 需从 engine.js 导入。

---

### Task 7: 音效模块

**Files:**
- Create: `src/audio/sounds.js`

- [ ] **Step 1: 创建 src/audio/sounds.js**

```javascript
let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.3) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // 静默处理，音效失败不影响功能
  }
}

export function playComplete() {
  playTone(800, 0.1, 'sine', 0.3);
}

export function playReview() {
  playTone(500, 0.15, 'sine', 0.25);
}

export function playStar() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  [523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.08);
    gain.gain.setValueAtTime(0.2, now + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.15);
  });
}

export function playCaseClosed() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  // 号角声：两个低音 + 渐强
  [330, 440].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + i * 0.3);
    gain.gain.setValueAtTime(0.1, now + i * 0.3);
    gain.gain.linearRampToValueAtTime(0.5, now + i * 0.3 + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.3 + 1.0);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.3);
    osc.stop(now + i * 0.3 + 1.0);
  });
}

export function playLevelUp() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  [262, 330, 392, 523].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + i * 0.15);
    gain.gain.setValueAtTime(0.3, now + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.3);
  });
}

export function playBadge() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(2400, now + 0.3);
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.5);
}
```

---

### Task 8: UI 通用组件

**Files:**
- Create: `src/ui/components.js`

- [ ] **Step 1: 创建 src/ui/components.js**

```javascript
// Toast 通知
export function showToast(msg, duration = 2000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

// 确认对话框
export function showConfirm(msg) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('overlayContainer');
    if (!overlay) { resolve(false); return; }
    overlay.innerHTML = `
      <div class="confirm-dialog">
        <div class="confirm-box">
          <p>${msg}</p>
          <button class="btn-yes" id="confirmYes">确认</button>
          <button class="btn-no" id="confirmNo">取消</button>
        </div>
      </div>
    `;
    document.getElementById('confirmYes').onclick = () => { overlay.innerHTML = ''; resolve(true); };
    document.getElementById('confirmNo').onclick = () => { overlay.innerHTML = ''; resolve(false); };
  });
}

// 遮罩层
export function showOverlay(html) {
  const overlay = document.getElementById('overlayContainer');
  if (!overlay) return;
  overlay.innerHTML = html;
}

export function clearOverlay() {
  const overlay = document.getElementById('overlayContainer');
  if (overlay) overlay.innerHTML = '';
}

// CASE CLOSED 印章动画
export function showCaseClosedStamp() {
  const overlay = document.getElementById('overlayContainer');
  if (!overlay) return;
  overlay.innerHTML = `
    <div class="overlay" id="stampOverlay">
      <div class="stamp">CASE<br>CLOSED</div>
    </div>
  `;
  setTimeout(() => {
    const stampEl = document.getElementById('stampOverlay');
    if (stampEl) stampEl.remove();
  }, 1500);
}

// 盲盒弹窗
export function showBlindboxModal(blindbox, onClose) {
  const overlay = document.getElementById('overlayContainer');
  if (!overlay) return;
  overlay.innerHTML = `
    <div class="blindbox-modal" onclick="if(event.target===this)this.remove()">
      <div class="blindbox-card">
        <h3>🎁 侦探盲盒</h3>
        <div class="bb-type">🔍 ${blindbox.type || '线索'}</div>
        <div class="bb-content">${blindbox.q}</div>
        ${blindbox.a ? `
          <button class="bb-btn" id="bbToggleBtn">🔎 查看侦探推论</button>
          <div class="bb-answer" id="bbAnswer">${blindbox.a}</div>
        ` : ''}
        <button class="bb-close" id="bbClose">关闭案卷</button>
      </div>
    </div>
  `;

  if (blindbox.a) {
    const btn = document.getElementById('bbToggleBtn');
    const ans = document.getElementById('bbAnswer');
    btn.onclick = () => {
      ans.classList.toggle('show');
      btn.textContent = ans.classList.contains('show') ? '🔍 收起推论' : '🔎 查看侦探推论';
    };
  }
  document.getElementById('bbClose').onclick = () => {
    overlay.innerHTML = '';
    if (onClose) onClose();
  };
}

// 升级动画
export function showLevelUpAnimation(rank, onComplete) {
  const overlay = document.getElementById('overlayContainer');
  if (!overlay) { if (onComplete) onComplete(); return; }
  overlay.innerHTML = `
    <div class="overlay levelup-overlay">
      <div class="levelup-card">
        <div class="levelup-icon">${rank.icon}</div>
        <div class="levelup-title">晋升为</div>
        <div class="levelup-rank">${rank.title}</div>
      </div>
    </div>
  `;
  setTimeout(() => {
    overlay.innerHTML = '';
    if (onComplete) onComplete();
  }, 2000);
}

// 星星飘动动画
export function showStarAnimation(x, y, count = 1) {
  const el = document.createElement('div');
  el.className = 'star-float';
  el.textContent = '⭐';
  el.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:20px;pointer-events:none;z-index:300;animation:starFly 1s ease-out forwards`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// 渲染任务勾选框
export function renderCheckbox(done, type = 'normal') {
  let cls = 'task-check';
  if (done) cls += ' done';
  if (type === 'review') cls += ' review';
  return `<div class="${cls}">${done ? '✓' : ''}</div>`;
}

// 渲染徽章标签
export function renderBadge(text, type = 'new') {
  const clsMap = { new: 'badge-new', review: 'badge-review', done: 'badge-done', custom: 'badge-custom', daily: 'badge-custom' };
  const cls = clsMap[type] || 'badge-custom';
  return `<span class="task-badge ${cls}">${text}</span>`;
}
```

---

### Task 9: 全局样式

**Files:**
- Create: `src/styles/main.css`

- [ ] **Step 1: 创建 src/styles/main.css**

从原有 `暑假打卡.html` 的 `<style>` 标签中迁移 CSS，并添加 v2 新增动画样式。

```css
/* 基础重置 */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #F1F5F9;
  color: #1E293B;
  line-height: 1.6;
  -webkit-tap-highlight-color: transparent;
}

.app { max-width: 680px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; }

/* Header */
.header { background: #1E293B; color: #fff; padding: 14px 20px; position: sticky; top: 0; z-index: 100; }
.header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.header-top h1 { font-size: 20px; font-weight: 700; letter-spacing: 1px; }
.date-nav { display: flex; align-items: center; gap: 12px; font-size: 17px; }
.date-nav button { background: none; border: none; color: #94A3B8; font-size: 20px; cursor: pointer; padding: 4px 8px; }
.date-nav button:active { color: #fff; }
.date-nav .today-btn { font-size: 12px; color: #60A5FA; border: 1px solid #60A5FA; border-radius: 12px; padding: 2px 10px; }
.header-stats { display: flex; gap: 16px; font-size: 13px; color: #94A3B8; }
.header-stats span { display: flex; align-items: center; gap: 4px; }

/* Tabs */
.tabs { display: flex; background: #fff; border-bottom: 1px solid #E2E8F0; }
.tab { flex: 1; text-align: center; padding: 12px 8px; font-size: 15px; font-weight: 600; color: #64748B; cursor: pointer; border-bottom: 2px solid transparent; transition: all .2s; }
.tab.active { color: #1E293B; border-bottom-color: #DC2626; }

/* Main */
.main { flex: 1; padding: 12px; overflow-y: auto; }

/* Cards & Panels */
.panel { margin-bottom: 12px; }
.panel-title { font-size: 16px; font-weight: 700; color: #1E293B; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.panel-sub { font-size: 12px; color: #94A3B8; font-weight: 400; }
.card { background: #fff; border-radius: 10px; padding: 16px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }

/* Task Rows */
.task-row { display: flex; align-items: center; padding: 14px 0; border-bottom: 1px solid #F1F5F9; gap: 10px; cursor: pointer; }
.task-row:last-child { border-bottom: none; }
.task-check { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #CBD5E1; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all .2s; }
.task-check.done { background: #22C55E; border-color: #22C55E; color: #fff; font-size: 12px; }
.task-check.review { background: #F97316; border-color: #F97316; color: #fff; font-size: 12px; }
.task-info { flex: 1; min-width: 0; }
.task-name { font-size: 17px; color: #1E293B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.task-meta { font-size: 13px; color: #94A3B8; margin-top: 2px; }

/* Badges */
.task-badge { font-size: 10px; padding: 1px 6px; border-radius: 8px; flex-shrink: 0; }
.badge-new { background: #DBEAFE; color: #3B82F6; }
.badge-review { background: #FFF7ED; color: #F97316; }
.badge-done { background: #DCFCE7; color: #22C55E; }
.badge-custom { background: #F1F5F9; color: #64748B; }

/* Subject Headers */
.subject-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: #F8FAFC; border-radius: 10px; cursor: pointer; margin-bottom: 4px; }
.subject-header .icon { font-size: 18px; }
.subject-header .name { font-size: 16px; font-weight: 600; flex: 1; margin-left: 8px; }
.subject-header .count { font-size: 13px; color: #94A3B8; }
.subject-body { padding: 0 4px; }
.subject-body.collapsed { display: none; }

/* Sports Grid */
.sport-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 8px 0; }
.sport-item { display: flex; align-items: center; gap: 8px; padding: 12px; border: 1px solid #E2E8F0; border-radius: 10px; cursor: pointer; transition: all .2s; }
.sport-item.done { background: #DCFCE7; border-color: #22C55E; }
.sport-item .sport-icon { font-size: 24px; }
.sport-item .sport-name { font-size: 15px; font-weight: 500; }

/* Chapter List */
.chapter-group { margin-bottom: 8px; }
.chapter-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #F8FAFC; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; }
.chapter-items { padding: 4px 8px; }
.chapter-items.collapsed { display: none; }
.chapter-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; cursor: pointer; border-radius: 8px; transition: background .15s; }
.chapter-item:active { background: #F1F5F9; }
.chapter-item.done { color: #22C55E; }
.chapter-item .ch-check { width: 22px; height: 22px; border-radius: 50%; border: 2px solid #CBD5E1; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; transition: all .2s; }
.chapter-item.done .ch-check { background: #22C55E; border-color: #22C55E; color: #fff; }
.chapter-item .ch-name { font-size: 14px; flex: 1; }
.chapter-item .ch-date { font-size: 11px; color: #94A3B8; }

/* Float Bar */
.float-bar { position: sticky; bottom: 0; background: #1E293B; color: #fff; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; border-radius: 12px 12px 0 0; font-size: 13px; }
.float-bar .progress-text { font-weight: 600; }
.encourage { font-size: 12px; color: #94A3B8; text-align: center; padding: 8px; }

/* Sunday Page */
.sunday-page { text-align: center; padding: 40px 20px; }
.sunday-page .sunday-icon { font-size: 64px; margin-bottom: 16px; }
.sunday-page h2 { font-size: 24px; color: #1E293B; margin-bottom: 8px; }
.sunday-page p { color: #64748B; font-size: 14px; margin-bottom: 20px; }
.sunday-stats { background: #fff; border-radius: 10px; padding: 16px; display: inline-block; text-align: center; }

/* Challenge Card */
.challenge-card { background: linear-gradient(135deg, #FEF3C7, #FDE68A); border-radius: 10px; padding: 12px 16px; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
.challenge-card .ch-icon { font-size: 24px; }
.challenge-card .ch-info { flex: 1; }
.challenge-card .ch-desc { font-size: 14px; font-weight: 600; color: #92400E; }
.challenge-card .ch-reward { font-size: 12px; color: #B45309; }

/* Overlays & Modals */
.overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,.7); z-index: 200; display: flex; align-items: center; justify-content: center; animation: fadeIn .3s; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* CASE CLOSED Stamp */
.stamp { width: 160px; height: 160px; border: 6px solid #DC2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-align: center; color: #DC2626; font-weight: 900; font-size: 22px; transform: rotate(-15deg) scale(0); animation: stampIn .6s .2s forwards; }
@keyframes stampIn { 0% { transform: rotate(-15deg) scale(0); } 60% { transform: rotate(-15deg) scale(1.2); } 100% { transform: rotate(-15deg) scale(1); } }

/* Blindbox */
.blindbox-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,.6); z-index: 200; display: flex; align-items: center; justify-content: center; animation: fadeIn .2s; }
.blindbox-card { background: #fff; border-radius: 16px; padding: 24px; margin: 20px; max-width: 380px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,.3); }
.blindbox-card h3 { font-size: 18px; margin-bottom: 4px; }
.blindbox-card .bb-type { font-size: 11px; color: #DC2626; font-weight: 600; margin-bottom: 12px; }
.blindbox-card .bb-content { font-size: 14px; color: #334155; line-height: 1.8; margin-bottom: 16px; }
.blindbox-card .bb-answer { background: #F8FAFC; border-radius: 8px; padding: 12px; font-size: 15px; color: #64748B; margin-top: 8px; display: none; }
.blindbox-card .bb-answer.show { display: block; }
.blindbox-card .bb-btn { display: block; width: 100%; padding: 10px; border: 1px solid #E2E8F0; border-radius: 8px; background: #fff; font-size: 13px; cursor: pointer; margin-top: 8px; text-align: center; color: #3B82F6; }
.blindbox-card .bb-close { display: block; width: 100%; padding: 12px; background: #1E293B; color: #fff; border: none; border-radius: 10px; font-size: 14px; cursor: pointer; margin-top: 12px; }

/* Level Up */
.levelup-overlay { background: rgba(0,0,0,.8); }
.levelup-card { text-align: center; color: #fff; animation: levelBounce .8s ease-out; }
@keyframes levelBounce { 0% { transform: scale(0); } 60% { transform: scale(1.3); } 100% { transform: scale(1); } }
.levelup-icon { font-size: 60px; margin-bottom: 8px; }
.levelup-title { font-size: 16px; color: #FCD34D; }
.levelup-rank { font-size: 36px; font-weight: 900; margin-top: 4px; }

/* Star Float */
@keyframes starFly { 0% { opacity: 1; transform: translate(0,0) scale(0.5); } 50% { opacity: 1; transform: translate(-30px,-60px) scale(1.2); } 100% { opacity: 0; transform: translate(-10px,-120px) scale(0.8); } }

/* Toast */
.toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: #1E293B; color: #fff; padding: 10px 20px; border-radius: 20px; font-size: 13px; z-index: 300; animation: toastIn .3s; }
@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

/* Confirm */
.confirm-dialog { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,.5); z-index: 200; display: flex; align-items: center; justify-content: center; }
.confirm-box { background: #fff; border-radius: 14px; padding: 20px; margin: 20px; max-width: 300px; width: 100%; text-align: center; }
.confirm-box p { font-size: 14px; margin-bottom: 16px; }
.confirm-box button { padding: 8px 20px; margin: 0 6px; border-radius: 8px; font-size: 14px; cursor: pointer; border: none; }
.confirm-box .btn-yes { background: #DC2626; color: #fff; }
.confirm-box .btn-no { background: #F1F5F9; color: #64748B; }

/* Achievement Wall */
.achievement-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.achievement-item { text-align: center; padding: 12px 8px; background: #F8FAFC; border-radius: 10px; transition: all .3s; }
.achievement-item.locked { opacity: 0.35; filter: grayscale(1); }
.achievement-item.unlocked { background: #FFF7ED; border: 1px solid #FCD34D; }
.achievement-item .ach-icon { font-size: 28px; }
.achievement-item .ach-name { font-size: 11px; font-weight: 600; margin-top: 4px; }
.achievement-item .ach-date { font-size: 10px; color: #94A3B8; }

/* Stats Grid */
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
.stat-card { background: #fff; border-radius: 10px; padding: 16px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
.stat-card .stat-value { font-size: 32px; font-weight: 700; color: #1E293B; }
.stat-card .stat-label { font-size: 13px; color: #94A3B8; margin-top: 4px; }

/* Badge Row */
.badge-row { display: flex; gap: 8px; justify-content: center; margin: 12px 0; }
.badge-item { text-align: center; opacity: 0.3; transition: all .3s; }
.badge-item.earned { opacity: 1; }
.badge-item .badge-icon { font-size: 28px; }
.badge-item .badge-label { font-size: 10px; color: #64748B; margin-top: 2px; }

/* Calendar */
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; margin: 12px 0; }
.calendar-cell { aspect-ratio: 1; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; transition: all .1s; }
.calendar-cell:active { transform: scale(.9); }
.calendar-label { font-size: 10px; color: #94A3B8; text-align: center; padding: 4px 0; }

/* Filter Bar */
.filter-bar { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.filter-bar select, .filter-bar input { padding: 6px 10px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 12px; background: #fff; outline: none; }
.filter-bar input { flex: 1; min-width: 120px; }

/* Backup */
.backup-section { padding: 16px; text-align: center; }
.backup-section button { padding: 10px 20px; margin: 4px; border: 1px solid #E2E8F0; border-radius: 8px; background: #fff; font-size: 13px; cursor: pointer; }
.backup-section .warning { font-size: 12px; color: #94A3B8; margin-bottom: 8px; }

/* Other Input */
.other-section { margin-top: 8px; }
.other-input { display: flex; gap: 8px; margin-bottom: 8px; }
.other-input input { flex: 1; padding: 12px 16px; border: 1px dashed #CBD5E1; border-radius: 10px; font-size: 15px; outline: none; }
.other-input input:focus { border-color: #3B82F6; }
.other-input button { background: #1E293B; color: #fff; border: none; border-radius: 10px; padding: 14px 20px; font-size: 15px; cursor: pointer; white-space: nowrap; }

/* Diary */
.diary-input-area { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
.diary-input-area textarea { width: 100%; padding: 12px; border: 1px dashed #CBD5E1; border-radius: 10px; font-size: 14px; outline: none; resize: vertical; min-height: 60px; font-family: inherit; }
.diary-input-area textarea:focus { border-color: #3B82F6; }
.diary-input-area button { align-self: flex-end; background: #1E293B; color: #fff; border: none; border-radius: 10px; padding: 8px 16px; font-size: 13px; cursor: pointer; }

/* Star Bar Chart */
.star-chart { display: flex; align-items: flex-end; gap: 4px; height: 100px; padding: 8px 0; }
.star-bar { flex: 1; background: #FCD34D; border-radius: 4px 4px 0 0; transition: height .3s; min-height: 2px; }
.star-bar-label { text-align: center; font-size: 10px; color: #94A3B8; margin-top: 4px; }

/* Edge glow for streaks */
@keyframes edgeGlow { 0%, 100% { box-shadow: inset 0 0 30px transparent; } 50% { box-shadow: inset 0 0 30px var(--glow-color); } }
body.streak-fire { --glow-color: rgba(239,68,68,.3); animation: edgeGlow 2s infinite; }
body.streak-gold { --glow-color: rgba(251,191,36,.3); animation: edgeGlow 2s infinite; }
body.streak-star { --glow-color: rgba(59,130,246,.3); animation: edgeGlow 2s infinite; }

/* Utility */
.hidden { display: none !important; }
```

---

### Task 10: 头部导航 UI

**Files:**
- Create: `src/ui/header.js`

- [ ] **Step 1: 创建 src/ui/header.js**

```javascript
import { fmtDate, isSunday, isTravel, todayStr, isDateInRange, addDays } from '../core/engine.js';
import { calcStreak } from '../core/progress.js';
import { CONFIG } from '../config.js';

export function renderHeader(state, date) {
  const isSun = isSunday(date);
  const isTrav = isTravel(date);
  let tag = '';
  if (isSun) tag = ' <span style="color:#FCD34D">🌴 休息日</span>';
  else if (isTrav) tag = ' <span style="color:#60A5FA">✈️ 旅途中</span>';

  const streak = calcStreak(state);
  const todayStars = state.stars[date] || 0;

  document.getElementById('dateNav').innerHTML = `
    <button id="btnPrev">←</button>
    <span>${fmtDate(date)}${tag}</span>
    <button id="btnNext">→</button>
    <button class="today-btn" id="btnToday">今天</button>
  `;

  document.getElementById('headerStats').innerHTML = `
    <span>🏅 连续${streak.current}天</span>
    <span>⭐ 今日${todayStars}星</span>
  `;
}
```

---

### Task 11: Tab1 今日搜证 UI

**Files:**
- Create: `src/ui/tab-search.js`

此文件负责渲染当日完整的打卡界面，是页面最核心的渲染模块。

- [ ] **Step 1: 创建渲染框架函数**

```javascript
import { CONFIG, SUBJECTS, SPORTS, getSubject } from '../config.js';
import {
  isSunday, isTravel, isSaturday, fmtDate, todayStr,
} from '../core/engine.js';
import {
  getReviewDueTasks, getNewTasksForSubject, countTodayVisible,
  calcStreak, calcProgress,
} from '../core/progress.js';
import { canCaseClose, getTodayChallenge } from '../core/blindbox.js';
import { DAILY_TASKS, CHAPTER_REF, getTaskMeta } from '../data/tasks.js';
import { ENCOURAGES } from '../data/blindboxes.js';
import { renderCheckbox, renderBadge } from './components.js';

export function renderTabSearch(state, date, callbacks) {
  const main = document.getElementById('main');
  const isSun = isSunday(date);
  const isFuture = date > todayStr();

  if (isSun) {
    main.innerHTML = renderSundayPage(state, date);
    updateProgressBar(state, date);
    return;
  }

  let html = '';

  // ① 今日挑战卡片
  const challenge = getTodayChallenge(state, date);
  html += renderChallengeCard(challenge, state, date);

  // ② 痕迹重温（复习面板）
  html += renderReviewPanel(state, date, isFuture, callbacks);

  // ③ 核心线索（按科目）
  const isTrav = isTravel(date);
  const visibleSubjects = SUBJECTS.filter(s => {
    if (s.id === 'ot') return true;
    if (s.id === 'sp') return true; // 体育始终可见
    if (s.type === 'chapter' && isTrav) return false;
    return true;
  });

  for (const sub of visibleSubjects) {
    if (sub.type === 'recite') {
      html += renderRecitePanel(state, sub, date, isFuture, callbacks);
    } else if (sub.type === 'chapter') {
      html += renderChapterPanel(state, sub, date, isFuture, callbacks);
    } else if (sub.type === 'sport') {
      html += renderSportPanel(state, date, callbacks);
    } else if (sub.type === 'custom') {
      html += renderCustomPanel(state, date, callbacks);
    }
  }

  main.innerHTML = html;
  updateProgressBar(state, date);
  bindSearchEvents(state, date, callbacks);
}
```

- [ ] **Step 2: 创建子渲染函数**

各子渲染函数（`renderReviewPanel`、`renderRecitePanel`、`renderChapterPanel`、`renderSportPanel`、`renderCustomPanel`、`renderSundayPage`、`renderChallengeCard`、`updateProgressBar`、`bindSearchEvents`）需要在此文件中逐一实现。

核心逻辑概述：
- **renderReviewPanel**: 显示到期复习任务（上限10项），排队提示
- **renderRecitePanel**: 科目折叠面板内渲染背诵任务 + 每日固定任务，灰色"每日"标签 vs 蓝色"核心线索"标签
- **renderChapterPanel**: 数学/物理章节折叠列表，每项勾选，显示完成日期
- **renderSportPanel**: 2x2 运动网格，四个运动项目
- **renderCustomPanel**: 特别行动列表 + 添加输入框
- **updateProgressBar**: 底部悬浮进度条（含星星数）
- **bindSearchEvents**: 绑定所有点击事件（通过事件委托 + callbacks）

> 完整代码在新文件中实现，从原有 `暑假打卡.html` 迁移渲染逻辑并适配新的模块化 API。

---

### Task 12: Tab2 案卷归档 UI

**Files:**
- Create: `src/ui/tab-archive.js`

- [ ] **Step 1: 创建 src/ui/tab-archive.js**

```javascript
import { SUBJECTS, getSubject } from '../config.js';
import { ALL_TASKS } from '../data/tasks.js';
import { renderBadge } from './components.js';

export function renderTabArchive(state) {
  const main = document.getElementById('main');
  let html = renderFilterBar();
  html += renderTaskList(state);
  main.innerHTML = html;
  bindArchiveEvents(state);
}

function renderFilterBar() {
  const subOptions = SUBJECTS
    .filter(s => s.id !== 'ot' && s.id !== 'sp')
    .map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`)
    .join('');

  return `
    <div class="filter-bar">
      <select id="filterSub" onchange="window._renderArchive()">
        <option value="">全部科目</option>
        ${subOptions}
      </select>
      <select id="filterStatus" onchange="window._renderArchive()">
        <option value="">全部状态</option>
        <option value="pending">未开启</option>
        <option value="reviewing">追查中</option>
        <option value="done">已归档</option>
      </select>
      <input id="filterSearch" placeholder="搜索线索..." oninput="window._renderArchive()">
    </div>
  `;
}

function renderTaskList(state) {
  const subFilter = document.getElementById('filterSub')?.value || '';
  const statusFilter = document.getElementById('filterStatus')?.value || '';
  const searchFilter = (document.getElementById('filterSearch')?.value || '').toLowerCase();

  let tasks = [...ALL_TASKS];
  if (subFilter) tasks = tasks.filter(t => t.sub === subFilter);
  if (searchFilter) {
    tasks = tasks.filter(t =>
      t.title.toLowerCase().includes(searchFilter) ||
      (t.subTitle || '').toLowerCase().includes(searchFilter)
    );
  }

  let html = '<div class="archive-list">';
  for (const t of tasks) {
    const td = state.tasks[t.id];
    const status = td ? td.status : 'pending';

    if (statusFilter && statusFilter !== 'done') {
      if (statusFilter === 'reviewing' && !['reviewing'].includes(status)) continue;
      if (statusFilter === 'pending' && status !== 'pending') continue;
    }
    if (statusFilter === 'done' && !['mastered', 'done'].includes(status)) continue;

    let statusLabel = '';
    let statusClass = '';
    if (status === 'pending') { statusLabel = '未开启'; statusClass = 'badge-custom'; }
    else if (status === 'reviewing') { statusLabel = `重温${td.reviewCount || 0}/5`; statusClass = 'badge-review'; }
    else if (status === 'mastered' || status === 'done') { statusLabel = '已归档'; statusClass = 'badge-done'; }

    const sub = getSubject(t.sub);
    html += `
      <div class="task-row">
        <div class="task-info">
          <div class="task-name">${sub.icon} ${t.title}</div>
          <div class="task-meta">${t.subTitle || ''} · ${sub.name}</div>
        </div>
        <span class="task-badge ${statusClass}">${statusLabel}</span>
      </div>
    `;
  }
  html += '</div>';
  return html;
}

function bindArchiveEvents(state) {
  window._renderArchive = () => {
    const main = document.getElementById('main');
    const filterHtml = renderFilterBar();
    const listHtml = renderTaskList(state);
    main.innerHTML = filterHtml + listHtml;
    bindArchiveEvents(state);
  };
}
```

---

### Task 13: Tab3 名侦探履历 UI

**Files:**
- Create: `src/ui/tab-stats.js`

- [ ] **Step 1: 创建 src/ui/tab-stats.js**

渲染统计面板：统计卡片、侦探等级、成就墙、各科完成率、日历热力图、星星趋势、日记入口、盲盒回顾、备份恢复。

核心函数：
- `renderTabStats(state, date, callbacks)`
- `renderStatsGrid(state, date)`
- `renderDetectiveRank(state)`
- `renderAchievementWall(state)`
- `renderSubProgress(state)`
- `renderCalendarHeatmap(state)`
- `renderStarChart(state)`
- `renderDiarySection(state)`
- `renderBackupSection(state, callbacks)`

> 从原有代码迁移 Tab3 渲染逻辑，新增成就墙、星星趋势、日记回看等 v2 组件。

---

### Task 14: 主入口文件集成

**Files:**
- Create: `src/main.js`

- [ ] **Step 1: 创建 src/main.js**

```javascript
import { initDB, loadState, saveState, backupState, exportJSON, importJSON } from './data/db.js';
import { assignSuggestedDates } from './data/tasks.js';
import { todayStr, isSunday } from './core/engine.js';
import {
  completeNewTask, completeReviewTask, completeDailyTask,
  completeChapter, completeSport, completeCustomTask, addCustomTask,
  saveDiary, awardCaseClosed, checkBadges, getDetectiveRank,
  calcStarsWeek, calcProgress, calcStreak, calcSubProgress,
  getReviewDueTasks, getNewTasksForSubject, countTodayVisible, BADGES,
} from './core/progress.js';
import { checkDailyBlindbox, canCaseClose } from './core/blindbox.js';
import { renderHeader } from './ui/header.js';
import { renderTabSearch } from './ui/tab-search.js';
import { renderTabArchive } from './ui/tab-archive.js';
import { renderTabStats } from './ui/tab-stats.js';
import { showToast, showBlindboxModal, showCaseClosedStamp, showLevelUpAnimation, showStarAnimation } from './ui/components.js';
import * as sounds from './audio/sounds.js';

// 应用状态
let state = null;
let currentDate = todayStr();
let currentTab = 0;

// 初始化
async function init() {
  await initDB();
  state = await loadState();
  assignSuggestedDates();
  renderApp();
  checkDailyBlindboxOnLoad();
}

// 渲染 HTML 骨架
function renderAppSkeleton() {
  document.getElementById('app').innerHTML = `
    <div class="app">
      <div class="header">
        <div class="header-top">
          <h1>🔍 见习侦探的暑期事件簿</h1>
        </div>
        <div class="date-nav" id="dateNav"></div>
        <div class="header-stats" id="headerStats"></div>
      </div>
      <div class="tabs">
        <div class="tab active" data-tab="0">🔍 今日搜证</div>
        <div class="tab" data-tab="1">📁 案卷归档</div>
        <div class="tab" data-tab="2">🏆 名侦探履历</div>
      </div>
      <div class="main" id="main"></div>
    </div>
    <div id="overlayContainer"></div>
    <div id="toastContainer"></div>
  `;
}

// 渲染整个应用
function renderApp() {
  renderHeader(state, currentDate);
  renderCurrentTab();
}

function renderCurrentTab() {
  if (currentTab === 0) {
    renderTabSearch(state, currentDate, getCallbacks());
  } else if (currentTab === 1) {
    renderTabArchive(state);
  } else {
    renderTabStats(state, currentDate, getCallbacks());
  }
}

// 回调函数集合
function getCallbacks() {
  return {
    onCompleteNew: (id) => handleAction(() => {
      const result = completeNewTask(state, id, currentDate);
      state = result.state;
      return result;
    }),
    onCompleteReview: (id) => handleAction(() => {
      const result = completeReviewTask(state, id, currentDate);
      state = result.state;
      return result;
    }),
    onToggleDaily: (taskId) => handleAction(() => {
      const result = completeDailyTask(state, taskId, currentDate);
      state = result.state;
      return result;
    }),
    onToggleChapter: (subId, chIdx, itemIdx) => handleAction(() => {
      const result = completeChapter(state, subId, chIdx, itemIdx, currentDate);
      state = result.state;
      return result;
    }),
    onToggleSport: (sportId) => handleAction(() => {
      const result = completeSport(state, sportId, currentDate);
      state = result.state;
      return result;
    }),
    onToggleCustom: (index) => handleAction(() => {
      const result = completeCustomTask(state, index, currentDate);
      state = result.state;
      return result;
    }),
    onAddCustom: (desc) => handleAction(() => {
      const result = addCustomTask(state, desc, currentDate);
      state = result.state;
      return result;
    }),
    onSaveDiary: (text) => handleAction(() => {
      const result = saveDiary(state, text, currentDate);
      state = result.state;
      return result;
    }),
    onBackup: async () => {
      const json = await exportJSON();
      try {
        await navigator.clipboard.writeText(json);
        showToast('备份数据已复制到剪贴板');
      } catch {
        // 降级：下载文件
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `detective_backup_${currentDate}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('备份文件已下载');
      }
    },
    onRestore: async () => {
      // 由 tab-stats 处理文件选择
    },
    onChangeDate: (dir) => {
      const next = addDays(currentDate, dir);
      if (next < CONFIG.startDate || next > todayStr()) return;
      currentDate = next;
      renderApp();
    },
    onGoToday: () => {
      currentDate = todayStr();
      renderApp();
    },
    onChangeTab: (tab) => {
      currentTab = tab;
      document.querySelectorAll('.tab').forEach((t, i) => {
        t.classList.toggle('active', i === tab);
      });
      renderCurrentTab();
    },
  };
}

async function handleAction(actionFn) {
  try {
    const { state: newState, events = [], error } = actionFn();
    if (error) {
      showToast(error);
      return;
    }
    state = newState;
    await saveState(state);
    await backupState();

    // 处理事件
    for (const evt of events) {
      if (evt.type === 'task_complete' || evt.type === 'chapter_toggle' || evt.type === 'sport_toggle' || evt.type === 'custom_toggle') {
        sounds.playComplete();
      } else if (evt.type === 'review_complete') {
        sounds.playReview();
      } else if (evt.type === 'badge') {
        sounds.playBadge();
        showToast(`🏆 成就解锁：${evt.badge.name}`);
      } else if (evt.type === 'case_closed') {
        sounds.playCaseClosed();
      }
    }

    renderApp();

    // 检查结案
    if (canCaseClose(state, currentDate)) {
      setTimeout(() => {
        showCaseClosedStamp();
        sounds.playCaseClosed();
        setTimeout(() => {
          // 学习日记弹窗
          if (!state.diary[currentDate]?.text) {
            showDiaryPrompt();
          }
        }, 1600);
      }, 500);
    }
  } catch (e) {
    console.error('Action failed:', e);
    showToast('操作失败，请重试');
  }
}

function showDiaryPrompt() {
  const overlay = document.getElementById('overlayContainer');
  overlay.innerHTML = `
    <div class="blindbox-modal">
      <div class="blindbox-card">
        <h3>📝 侦探办案笔记</h3>
        <div class="bb-type">记录今天的收获</div>
        <div class="diary-input-area">
          <textarea id="diaryInput" placeholder="今天学了什么？有什么心得？"></textarea>
          <button id="diarySave">记录（+1星）</button>
        </div>
        <button class="bb-close" id="diarySkip">跳过</button>
      </div>
    </div>
  `;
  document.getElementById('diarySave').onclick = () => {
    const text = document.getElementById('diaryInput').value;
    handleAction(() => saveDiary(state, text, currentDate));
    overlay.innerHTML = '';
  };
  document.getElementById('diarySkip').onclick = () => {
    overlay.innerHTML = '';
  };
}

function checkDailyBlindboxOnLoad() {
  if (isSunday(currentDate)) return;
  const dayIdx = getDayIndex(currentDate);
  const bbKey = `daily_${dayIdx}`;
  if (state.dailyBlindboxes[bbKey]) return;

  setTimeout(() => {
    const result = checkDailyBlindbox(state, currentDate);
    if (result) {
      state = result.state;
      saveState(state);
      showBlindboxModal(result.blindbox);
    }
  }, 500);
}

// 绑定 Tab 切换和日期导航事件
function bindGlobalEvents() {
  document.querySelector('.tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    const idx = parseInt(tab.dataset.tab);
    const cbs = getCallbacks();
    cbs.onChangeTab(idx);
  });
}

// 启动
renderAppSkeleton();
bindGlobalEvents();
init().then(() => {
  renderApp();
});
```

> 注：需要补充 import（`addDays`, `getDayIndex` from engine.js, `CONFIG` from config.js）。

---

### Task 15: 集成测试与验证

- [ ] **Step 1: 启动开发服务器**

```bash
cd /Users/yeting/Documents/Projects/detective-summer && npm run dev
```

- [ ] **Step 2: 测试基础打卡流程**

1. 打开浏览器，应看到今日日期和打卡界面
2. 点击一个背诵任务的勾选框，应完成并播放音效、星星 +1
3. 确认 IndexedDB 中有数据：DevTools > Application > IndexedDB > detective_summer_v2

- [ ] **Step 3: 测试边界情况**

| 场景 | 预期 |
|------|------|
| 切换到周日 | 显示休息页 |
| 切换到旅游期 | 数学/物理面板隐藏，背诵和体育正常 |
| 未来日期 | 任务显示但不可操作 |
| 过去日期 | 正常查看历史记录 |
| 切换日期再切回 | 数据持久化保留 |

- [ ] **Step 4: 测试三层激励**

1. 完成3项任务 → 确认弹出铜质线索
2. 完成当天所有任务 → 确认 CASE CLOSED 动画 + 学习日记弹窗
3. 连续打卡7天 → 确认成就解锁提示

- [ ] **Step 5: 测试备份恢复**

1. Tab3 点击备份 → 确认 JSON 复制到剪贴板
2. 清除 IndexedDB 数据 → 刷新页面 → 确认初始状态
3. Tab3 恢复 → 粘贴备份 JSON → 确认数据恢复

- [ ] **Step 6: 构建验证**

```bash
npm run build
```

确认 `dist/` 目录生成，`index.html` 可在浏览器直接打开（file:// 协议）。

---

## 实现顺序与依赖

```
Task 1 (脚手架)
  ↓
Task 2 (配置+静态数据) → Task 3 (日期引擎)
  ↓                          ↓
Task 4 (IndexedDB)      Task 5 (进度逻辑) → Task 6 (盲盒逻辑)
  ↓                          ↓                  ↓
Task 7 (音效)          Task 8 (通用组件)
  ↓                          ↓
Task 9 (样式)
  ↓
Task 10 (Header UI) → Task 11 (Tab1) → Task 12 (Tab2) → Task 13 (Tab3)
  ↓                          ↓            ↓               ↓
Task 14 (main.js 集成)
  ↓
Task 15 (测试验证)
```

关键依赖：
- Task 2、3 可并行
- Task 5 依赖 Task 2（数据）和 Task 3（引擎）
- Task 11-13 依赖 Task 5、6、8（逻辑 + 组件）
- Task 14 依赖所有模块完成后集成
