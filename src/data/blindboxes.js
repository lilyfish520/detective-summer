/**
 * 证据收集系统
 * EVIDENCE_A: 日常证物 - 18项
 * EVIDENCE_B: 关键证据 - 18项
 * DAILY_CHALLENGES: 每日密令 - 6项
 * ENCOURAGES: 侦探箴言 - 8条
 */

export const EVIDENCE_A = [
  { id: 'a01', icon: '\u{1F50D}', title: '放大镜', desc: '经典侦探工具，帮你发现隐藏的线索', rarity: 'common' },
  { id: 'a02', icon: '\u{1F4C7}', title: '便签本', desc: '记录关键信息的侦探便签', rarity: 'common' },
  { id: 'a03', icon: '\u{1F4F7}', title: '取证相机', desc: '拍下现场照片，定格关键瞬间', rarity: 'common' },
  { id: 'a04', icon: '\u{270D}', title: '铅笔头', desc: '每位侦探都有一支最顺手的铅笔', rarity: 'common' },
  { id: 'a05', icon: '\u{1F9EA}', title: '证物袋', desc: '收集并保存现场证物的专用袋', rarity: 'common' },
  { id: 'a06', icon: '\u{1F4CF}', title: '比例尺', desc: '精确测量线索，不放过任何细节', rarity: 'common' },
  { id: 'a07', icon: '\u{1F4CE}', title: '图钉', desc: '把线索钉在软木板上，串联推理', rarity: 'common' },
  { id: 'a08', icon: '\u{1F9F2}', title: '磁铁', desc: '在灰烬中寻找金属微粒的好帮手', rarity: 'common' },
  { id: 'a09', icon: '\u{1F4E5}', title: '档案袋', desc: '整理案件资料的牛皮纸档案袋', rarity: 'common' },
  { id: 'a10', icon: '\u{1F4CB}', title: '线索板', desc: '把所有线索钉在板上，拼出真相', rarity: 'rare' },
  { id: 'a11', icon: '\u{1F9EA}', title: '指纹粉', desc: '撒上粉末，隐藏的指纹立刻显现', rarity: 'rare' },
  { id: 'a12', icon: '\u{1F4E0}', title: '对讲机', desc: '与搭档保持联络的便携对讲机', rarity: 'rare' },
  { id: 'a13', icon: '\u{1F52C}', title: '显微镜', desc: '观察微观证据，发现肉眼看不到的真相', rarity: 'rare' },
  { id: 'a14', icon: '\u{1F4DC}', title: '旧报纸', desc: '泛黄的报纸里藏着尘封的往事', rarity: 'rare' },
  { id: 'a15', icon: '\u{1F9ED}', title: '指南针', desc: '在迷雾中不迷失方向', rarity: 'rare' },
  { id: 'a16', icon: '\u{1F511}', title: '万能钥匙', desc: '打开所有上锁的房间，但记得先敲门', rarity: 'epic' },
  { id: 'a17', icon: '\u{1F9F3}', title: '密码本', desc: '破译加密信息的专属密码本', rarity: 'epic' },
  { id: 'a18', icon: '\u{1F3B7}', title: '侦探口琴', desc: '布鲁斯口琴，每个名侦探都有自己的BGM', rarity: 'epic' },
];

export const EVIDENCE_B = [
  { id: 'b01', icon: '\u{1F4BF}', title: '监控录像', desc: '案发当晚的监控画面，画面中有一个背影', rarity: 'common' },
  { id: 'b02', icon: '\u{1F4E8}', title: '神秘信件', desc: '没有署名，信纸上只有一行字："明天下午三点"', rarity: 'common' },
  { id: 'b03', icon: '\u{2615}', title: '半杯咖啡', desc: '还温热的咖啡，嫌疑人刚刚离开不久', rarity: 'common' },
  { id: 'b04', icon: '\u{1F45F}', title: '泥泞的鞋印', desc: '43码运动鞋，鞋底有独特的菱形花纹', rarity: 'common' },
  { id: 'b05', icon: '\u{1F4F1}', title: '未接来电', desc: '通话记录显示凌晨2:15有一个陌生号码来电', rarity: 'common' },
  { id: 'b06', icon: '\u{1F4C4}', title: '半张纸条', desc: '被撕掉一半的纸条，剩余部分写着："...藏在钟楼..."', rarity: 'common' },
  { id: 'b07', icon: '\u{1F3B2}', title: '一枚骰子', desc: '特制骰子，六个面都是同样的点数', rarity: 'common' },
  { id: 'b08', icon: '\u{1F9E4}', title: '断裂的钥匙', desc: '青铜材质，断口处有撬动的痕迹', rarity: 'common' },
  { id: 'b09', icon: '\u{1F48D}', title: '吊坠项链', desc: '银质吊坠，内侧刻着两个字母', rarity: 'common' },
  { id: 'b10', icon: '\u{1F4F0}', title: '剪报', desc: '三年前的新闻剪报，报道了一起未破的盗窃案', rarity: 'rare' },
  { id: 'b11', icon: '\u{1F3A4}', title: '录音带', desc: '老式磁带，播放后有30秒的奇怪录音', rarity: 'rare' },
  { id: 'b12', icon: '\u{1F4B0}', title: '外国纸币', desc: '一张不在市面流通的外币，序列号被红笔圈出', rarity: 'rare' },
  { id: 'b13', icon: '\u{1F9EE}', title: '数字密码', desc: '一张写着"8-15-23"的便条，是什么意思？', rarity: 'rare' },
  { id: 'b14', icon: '\u{1F3DE}', title: '老照片', desc: '褪色照片中的建筑，似乎就在学校附近', rarity: 'rare' },
  { id: 'b15', icon: '\u{1F3F9}', title: '监控照片', desc: '抓拍到一辆未挂车牌的黑色轿车', rarity: 'rare' },
  { id: 'b16', icon: '\u{1F4E6}', title: '匿名包裹', desc: '快递盒里只有一个U盘和一封打印的信', rarity: 'epic' },
  { id: 'b17', icon: '\u{1F4D4}', title: '嫌疑人日记', desc: '日记中记录了连续一周的异常行踪', rarity: 'epic' },
  { id: 'b18', icon: '\u{1F3C6}', title: '决定性证据', desc: '铁证如山！这个证据足以让案件水落石出', rarity: 'legendary' },
];

export const DAILY_CHALLENGES = [
  { id: 'dc01', icon: '\u{1F50E}', title: '观察力试炼', desc: '留意今天身边3个不同的细节，像侦探一样观察世界' },
  { id: 'dc02', icon: '\u{1F9E0}', title: '推理力试炼', desc: '对今天学到的一个知识点，问三个"为什么"' },
  { id: 'dc03', icon: '\u{1F4AA}', title: '毅力试炼', desc: '坚持完成今天的所有任务，不半途而废' },
  { id: 'dc04', icon: '\u{1F4DD}', title: '记忆力试炼', desc: '睡前回忆今天解锁的3个新知识，默记于心' },
  { id: 'dc05', icon: '\u{1F4AC}', title: '沟通力试炼', desc: '向家人讲述一个你今天学到的有趣知识' },
  { id: 'dc06', icon: '\u{1F9E9}', title: '解谜试炼', desc: '尝试解开一个谜题：数独、字谜或数学题都可以' },
];

export const ENCOURAGES = [
  { id: 'ec01', text: '真相往往藏在最不起眼的细节里，保持你的观察力。', icon: '\u{1F50D}' },
  { id: 'ec02', text: '每个名侦探都是从第一个案子起步的，你做得很好。', icon: '\u{1F4AA}' },
  { id: 'ec03', text: '排除所有不可能，剩下的即使再不可思议，那也是真相。', icon: '\u{1F4A1}' },
  { id: 'ec04', text: '线索不会自己上门，需要你用每一天的坚持去寻找。', icon: '\u{1F50E}' },
  { id: 'ec05', text: '华生说："你每天都有新的进步。"福尔摩斯点了点头。', icon: '\u{1F9D0}' },
  { id: 'ec06', text: '今天的努力，是明天破案时最锋利的武器。', icon: '\u{2694}' },
  { id: 'ec07', text: '侦探从不说"放弃"，他们说"换个角度"。', icon: '\u{1F504}' },
  { id: 'ec08', text: '世界上最厉害的侦探，是那个从不停止学习的人。', icon: '\u{1F30D}' },
];

// ==================== 每日金句 ====================
export const DAILY_QUOTES = [
  '\u{1F50D} 细节之中，藏着世界的秘密。',
  '\u{1F4A1} 好奇心是侦探的第一把钥匙。',
  '\u{1F4AA} 今天的坚持，是明天的超能力。',
  '\u{1F31F} 你不是在完成任务，你是在收集改变自己的力量。',
  '\u{1F9D0} 真正的侦探不是最聪明的，而是最专注的。',
  '\u{1F525} 点燃你的热情，比点燃一支蜡烛更有用。',
  '\u{1F4DA} 书页之间，藏着你还没发现的宝藏。',
  '\u{270F} 每一个单词都是一块拼图，别停下来。',
  '\u{1F504} 失败了？换个角度，再来一次。',
  '\u{1F30D} 你今天学到的，会让明天的世界更清晰。',
  '\u{1F3AF} 设定目标，然后像狙击手一样瞄准它。',
  '\u{1F308} 暴风雨后才有彩虹，努力过后才有惊喜。',
  '\u{26F0} 每座高山都是从第一块石头开始的。',
  '\u{1F4AA} 没有天生的名侦探，只有不断练习的普通人。',
  '\u{1F31E} 早起的人，先看到真相。',
  '\u{1F33F} 成长就像植物，看不见变化，但它一直在长。',
  '\u{1F4A7} 滴水穿石，不是因为力量，而是因为坚持。',
  '\u{1F3C3} 跑得慢没关系，只要不停下来。',
  '\u{1F4AD} 想法不值钱，执行才值钱。今天你执行了吗？',
  '\u{1F389} 进步不分大小，每一步都值得庆祝。',
  '\u{1F4CD} 把大目标切成小块，一口一口吃掉它。',
  '\u{1F300} 昨天的你无法改变，但今天可以。',
  '\u{1F40C} 蚂蚁虽小，能搬动比它重几十倍的东西。',
  '\u{1F31F} 你就是自己故事里的主角，别让主角偷懒。',
  '\u{1F3B5} 学习像弹琴，练得越多，旋律越美。',
  '\u{1F319} 即使月亮有时不圆，但它从未停止发光。',
  '\u{2601} 不要让坏心情遮住你的天空。',
  '\u{1F4AA} 你的潜力比你想象的大得多。',
  '\u{1F50E} 发现自己的弱点，是变强的第一步。',
  '\u{1F4A4} 累了就休息，休息好了再出发。',
  '\u{2694} 知识是你最锋利的武器，每天磨一磨。',
  '\u{1F31F} 没人能随随便便成功，但你可以一步步接近。',
  '\u{1F4D6} 书是侦探最好的朋友，别冷落它。',
  '\u{1F3AF} 专注比聪明更重要，今天专注了吗？',
  '\u{1F31E} 阳光总在风雨后，先完成今天的任务再说。',
  '\u{1F4E3} 大声告诉自己：我可以！',
  '\u{1F9E0} 脑子越用越灵，跟肌肉一样需要锻炼。',
  '\u{1F30A} 海浪从不停止拍打岸边，你也别停下脚步。',
  '\u{1F42C} 龟兔赛跑告诉我们：坚持比速度更重要。',
  '\u{1F31F} 做最好的自己，而不是别人的复制品。',
  '\u{1F48E} 压力是碳变成钻石的唯一途径。',
  '\u{1F4AA} 自信不是天生的，是一个个小胜利累积的。',
  '\u{1F338} 像花一样慢慢开，你的时间会来的。',
  '\u{1F30C} 星空之所以美，是因为每颗星都在发光。你也是一颗星。',
  '\u{26A1} 行动是消除焦虑的唯一办法。',
  '\u{1F3C6} 冠军不是一场比赛诞生的，是每一次训练堆出来的。',
  '\u{1F4A1} 不懂就问，这是侦探的基本素养。',
  '\u{1F504} 用不同的方法试试，总有一条路能通。',
  '\u{1F30D} 这个世界不缺聪明人，缺的是坚持到底的人。',
  '\u{1F31F} 今天的你，比昨天更厉害了一点。',
  '\u{1F338} 每朵花都有自己的花期，你也是。',
  '\u{1F98B} 蝴蝶破茧前，也是一只不起眼的毛毛虫。',
  '\u{26F5} 风平浪静造就不了优秀的水手。',
  '\u{1F4AA} 你比你想象的更强大。',
  '\u{1F3AF} 成功是一步步瞄准，一次次射击。',
  '\u{1F4D6} 每天多读一页书，一年就多了365页的智慧。',
  '\u{1F31F} 发光不是太阳的专利，你也可以。',
  '\u{1F4A1} 好主意往往在努力之后才出现。',
  '\u{1F9E0} 脑子越用越灵光，今天你动脑了吗？',
  '\u{1F308} 风雨过后不一定有彩虹，但一定有晴天。',
  '\u{1F3C3} 不要跟别人比速度，要跟自己比进步。',
  '\u{1F331} 成长像小树苗，看不见变化，却一直在扎根。',
  '\u{1F4CD} 把大目标切成小块，一口一口吃掉。',
  '\u{1F31E} 每一个清晨都是重新开始的机会。',
  '\u{1F48E} 压力让碳变成钻石，让你变得更强。',
  '\u{1F525} 热情是最好的老师，保持你的好奇心。',
  '\u{1F30A} 浪潮退去才知道谁在裸泳，努力的人从不怕考验。',
  '\u{1F3C6} 没有人能随随便便成功，但你可以踏踏实实进步。',
  '\u{1F9D8} 累了就歇一会儿，休息好了再出发。',
  '\u{1F4A4} 充足的睡眠是超能力，别熬夜。',
  '\u{1F4AC} 说"我可以"比说"我不行"多用不了多少力气。',
  '\u{1F31F} 你是独一无二的，没人能替代你发光。',
  '\u{1F429} 像兔子一样敏捷思考，像乌龟一样坚持到底。',
  '\u{1F4AA} 今天多努力一点，明天就少后悔一点。',
];

/** 按日期获取每日金句（同一天始终返回同一条） */
export function getDailyQuote(dateStr) {
  const dayNum = parseInt(dateStr.replace(/-/g, ''), 10);
  return DAILY_QUOTES[dayNum % DAILY_QUOTES.length];
}

// ==================== 每日情绪 ====================
export const MOODS = [
  { id: 'happy', icon: '\u{1F60A}', label: '开心' },
  { id: 'excited', icon: '\u{1F929}', label: '兴奋' },
  { id: 'confident', icon: '\u{1F60E}', label: '自信' },
  { id: 'calm', icon: '\u{1F60C}', label: '平静' },
  { id: 'curious', icon: '\u{1F914}', label: '好奇' },
  { id: 'enlightened', icon: '\u{1F4A1}', label: '开窍' },
  { id: 'tired', icon: '\u{1F634}', label: '疲惫' },
  { id: 'annoyed', icon: '\u{1F624}', label: '烦躁' },
  { id: 'determined', icon: '\u{1F4AA}', label: '加油' },
];

// 向后兼容别名
export const BLIND_BOX_A = EVIDENCE_A;
export const BLIND_BOX_B = EVIDENCE_B;
