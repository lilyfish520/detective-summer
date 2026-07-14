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
  dbName: 'detective_summer_v3',
  dbVersion: 2,
};

export const SUBJECTS = [
  { id: 'yw', name: '古籍破译', icon: '\u{1F4D6}', type: 'recite', color: '#3B82F6' },
  { id: 'en', name: '密文翻译', icon: '\u{1F1EC}\u{1F1E7}', type: 'recite', color: '#3B82F6' },
  { id: 'sx', name: '密码解析', icon: '\u{1F4D0}', type: 'chapter', color: '#64748B' },
  { id: 'wl', name: '现场重建', icon: '⚡', type: 'chapter', color: '#64748B' },
  { id: 'sp', name: '体能训练', icon: '\u{1F3C3}', type: 'sport', color: '#22C55E' },
  { id: 'ot', name: '特别行动', icon: '\u{1F3AF}', type: 'custom', color: '#94A3B8' },
];

export const SPORTS = [
  { id: 'swim', name: '游泳', icon: '\u{1F3CA}' },
  { id: 'stretch', name: '拉伸', icon: '\u{1F9D8}' },
  { id: 'run', name: '跑步', icon: '\u{1F3C3}' },
  { id: 'jump', name: '跳绳', icon: '\u{1FAA2}' },
];

export function getSubject(id) {
  return SUBJECTS.find(s => s.id === id);
}
