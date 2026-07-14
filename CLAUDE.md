# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

见习侦探的暑期事件簿 — 侦探主题暑假学习打卡应用，初一升初二学生使用。iPad 移动端优先（max-width 480px），周期 2026.07.13 ~ 2026.08.31。

**技术栈**: Vite + 原生 JavaScript ES Modules + 纯 CSS，零运行时依赖。数据存储在 IndexedDB。

## 常用命令

```bash
npm run dev       # 启动开发服务器（自动打开浏览器）
npm run build     # 生产构建到 dist/ 并同步到 docs/（GitHub Pages）
npm run preview   # 预览生产构建
```

## 架构

```
src/
├── main.js          # 应用入口：骨架渲染、Tab 切换、全局事件绑定
├── config.js        # CONFIG 常量、SUBJECTS、SPORTS 定义
├── data/
│   ├── db.js        # IndexedDB 封装（progress/suggested/achievements/state 四个 store）
│   ├── tasks.js     # TASKS（43项背诵：27语文八上 + 16英语七下+八上）、CHAPTER_REF、DAILY_TASKS
│   └── blindboxes.js # 盲盒内容库、每日挑战、鼓励语
├── core/
│   ├── engine.js    # 日期工具（todayStr、addDays、isSunday、isTravel 等）
│   ├── progress.js  # 核心业务：completeTask、calcStreak、getStats、成就检测、等级计算
│   └── blindbox.js  # 盲盒抽取/触发、每日挑战、CASE CLOSED 检测
├── ui/
│   ├── components.js # Toast、Modal、Confirm、星星飞行/CASE CLOSED 动画
│   ├── header.js     # 日期导航栏 + 头部统计
│   ├── tab-search.js # Tab1 今日搜证（最核心渲染模块）
│   ├── tab-archive.js # Tab2 案卷归档（筛选+历史）
│   └── tab-stats.js  # Tab3 名侦探履历（日历热力、成就墙、备份恢复）
├── audio/sounds.js   # Web Audio API 音效合成
└── styles/main.css   # 全局样式（CSS 变量、动画、响应式）
```

**数据流（单向）**: 用户操作 → UI 层调用 `core/progress.js` → 更新 `data/db.js` → 返回事件 → UI 重渲染 + 音效

## 关键设计

### 任务 ID 命名约定

| 前缀 | 类型 | 示例 |
|------|------|------|
| `yw_*` / `en_*` | 背诵任务（TASKS 静态数据） | `yw_01`, `en_u1a` |
| `daily_<sub>_*` | 每日固定任务 | `daily_yw_daily_read` |
| `ch_<sub>_<ch>_<item>` | 章节小节 | `ch_sx_0_1` |
| `sp_*` | 体育运动 | `sp_swim` |
| `ot_<ts>` | 特别行动（自定义） | `ot_1700000000000` |

`progress.js` 的 `resolveSubjectFromId()` 通过 ID 前缀自动解析学科，新增动态任务类型时需在此函数注册。

### 特殊日期逻辑

- **周日** (`isSunday`): 全休，Tab1 展示休息页，不渲染任何任务
- **旅游期** (8/1-8/10, `isTravel`): 数学物理章节隐藏，背诵+每日固定+体育继续显示
- **周六**: 英语每日任务「阅读理解」自动替换为「作文+听力」
- **不可操作未来日期** (`isDateInRange` 为 false)

### IndexedDB 存储

数据库名 `detective_summer_v2`，四个 object store：
- `progress` — 打卡记录（date、subjectId、taskId、stars），索引 `date` 和 `date_task`
- `suggested` — 背诵任务建议日期（taskId → suggestedDate）
- `achievements` — 已解锁成就
- `state` — 键值存储（diary、blindbox_history、case_closed 等）

### 配置常量 (config.js)

所有可调参数集中在 `CONFIG` 对象：日期范围、复习间隔 `[1,2,4,7,15]`、每日复习上限 10、星星阶梯阈值 `{copper:3, silver:5, gold:8}`、每日星星上限 20。
