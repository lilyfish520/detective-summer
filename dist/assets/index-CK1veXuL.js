(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const O={startDate:"2026-07-13",endDate:"2026-08-31",restDays:[0],travelStart:"2026-08-01",travelEnd:"2026-08-10",maxCustomTasks:5,maxStarsPerDay:20,dbName:"detective_summer_v3",dbVersion:2},le=[{id:"yw",name:"古籍破译",icon:"📖",type:"recite",color:"#3B82F6"},{id:"en",name:"密文翻译",icon:"🇬🇧",type:"recite",color:"#3B82F6"},{id:"sx",name:"密码解析",icon:"📐",type:"chapter",color:"#64748B"},{id:"wl",name:"现场重建",icon:"⚡",type:"chapter",color:"#64748B"},{id:"sp",name:"体能训练",icon:"🏃",type:"sport",color:"#22C55E"},{id:"ot",name:"特别行动",icon:"🎯",type:"custom",color:"#94A3B8"}],Lt=[{id:"swim",name:"游泳",icon:"🏊"},{id:"stretch",name:"拉伸",icon:"🧘"},{id:"run",name:"跑步",icon:"🏃"},{id:"jump",name:"跳绳",icon:"🪢"}];function Qe(e){return le.find(t=>t.id===e)}function Nt(e){const t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${t}-${n}-${s}`}function W(){return Nt(new Date)}function ce(e,t){const n=e.split("-"),s=new Date(+n[0],+n[1]-1,+n[2]);return s.setDate(s.getDate()+t),Nt(s)}function Et(e,t){const n=e.split("-"),s=t.split("-");return Math.floor((new Date(+s[0],+s[1]-1,+s[2])-new Date(+n[0],+n[1]-1,+n[2]))/864e5)}function Ze(e){const t=e.split("-");return new Date(+t[0],+t[1]-1,+t[2]).getDay()}function I(e){return O.restDays.includes(Ze(e))}function rs(e){return Ze(e)===6}function Q(e){return e>=O.travelStart&&e<=O.travelEnd}function V(e){return e>=O.startDate&&e<=W()}function oe(e){const t=e.split("-"),n=new Date(+t[0],+t[1]-1,+t[2]),s=["日","一","二","三","四","五","六"][n.getDay()];return`${+t[1]}月${+t[2]}日 周${s}`}function ds(e){return Et(O.startDate,e)}let Fe=null;function ls(){return Fe}function us(){return new Promise((e,t)=>{const n=indexedDB.open(O.dbName,O.dbVersion);n.onerror=()=>t(n.error),n.onblocked=()=>{t(new Error("Database upgrade blocked. Please close all other tabs using this app."))},n.onsuccess=()=>{Fe=n.result,e(Fe)},n.onupgradeneeded=s=>{const a=s.target.result;if(!a.objectStoreNames.contains("progress")){const i=a.createObjectStore("progress",{keyPath:"id",autoIncrement:!0});i.createIndex("date","date",{unique:!1}),i.createIndex("subject","subjectId",{unique:!1}),i.createIndex("task","taskId",{unique:!1}),i.createIndex("date_task",["date","taskId"],{unique:!0})}a.objectStoreNames.contains("suggested")||a.createObjectStore("suggested",{keyPath:"taskId"}),a.objectStoreNames.contains("achievements")||a.createObjectStore("achievements",{keyPath:"id"}),a.objectStoreNames.contains("state")||a.createObjectStore("state",{keyPath:"key"})}})}function ee(){if(!Fe)throw new Error("Database not opened");return Fe}function X(e){return new Promise((t,n)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>n(e.error)})}async function et(e){const n=ee().transaction("progress","readonly").objectStore("progress").index("date");return await X(n.getAll(e))}async function qt(e,t){const s=ee().transaction("progress","readonly").objectStore("progress").index("date_task");return await X(s.get([e,t]))}async function re(){const e=ee().transaction("progress","readonly").objectStore("progress");return await X(e.getAll())}async function ps(e){const t=ee().transaction("progress","readwrite").objectStore("progress");return await X(t.add(e))}async function vs(e,t){const n=ee().transaction("progress","readwrite").objectStore("progress"),s=n.index("date_task"),a=await X(s.get([e,t]));return a?await X(n.delete(a.id)):null}async function tt(){const e=ee().transaction("suggested","readonly").objectStore("suggested");return await X(e.getAll())}async function mt(e,t){const n=ee().transaction("suggested","readwrite").objectStore("suggested");return await X(n.put({taskId:e,suggestedDate:t}))}async function je(){const e=ee().transaction("achievements","readonly").objectStore("achievements");return await X(e.getAll())}async function ys(e){const t=ee().transaction("achievements","readwrite").objectStore("achievements");return await X(t.put(e))}async function E(e){const t=ee().transaction("state","readonly").objectStore("state"),n=await X(t.get(e));return n?n.value:null}async function q(e,t){const n=ee().transaction("state","readwrite").objectStore("state");return await X(n.put({key:e,value:t}))}const ue=[{id:"yw_01",subject:"yw",title:"三峡",author:"郦道元",content:`自三峡七百里中，两岸连山，略无阙处。重岩叠嶂，隐天蔽日，自非亭午夜分，不见曦月。

至于夏水襄陵，沿溯阻绝。或王命急宣，有时朝发白帝，暮到江陵，其间千二百里，虽乘奔御风，不以疾也。

春冬之时，则素湍绿潭，回清倒影，绝巘多生怪柏，悬泉瀑布，飞漱其间，清荣峻茂，良多趣味。

每至晴初霜旦，林寒涧肃，常有高猿长啸，属引凄异，空谷传响，哀转久绝。故渔者歌曰："巴东三峡巫峡长，猿鸣三声泪沾裳。"`,category:"文言文"},{id:"yw_02",subject:"yw",title:"答谢中书书",author:"陶弘景",content:"山川之美，古来共谈。高峰入云，清流见底。两岸石壁，五色交辉。青林翠竹，四时俱备。晓雾将歇，猿鸟乱鸣；夕日欲颓，沉鳞竞跃。实是欲界之仙都。自康乐以来，未复有能与其奇者。",category:"文言文"},{id:"yw_03",subject:"yw",title:"记承天寺夜游",author:"苏轼",content:"元丰六年十月十二日夜，解衣欲睡，月色入户，欣然起行。念无与为乐者，遂至承天寺寻张怀民。怀民亦未寝，相与步于中庭。庭下如积水空明，水中藻、荇交横，盖竹柏影也。何夜无月？何处无竹柏？但少闲人如吾两人者耳。",category:"文言文"},{id:"yw_04",subject:"yw",title:"与朱元思书",author:"吴均",content:`风烟俱净，天山共色。从流飘荡，任意东西。自富阳至桐庐一百许里，奇山异水，天下独绝。

水皆缥碧，千丈见底。游鱼细石，直视无碍。急湍甚箭，猛浪若奔。

夹岸高山，皆生寒树，负势竞上，互相轩邈，争高直指，千百成峰。泉水激石，泠泠作响；好鸟相鸣，嘤嘤成韵。蝉则千转不穷，猿则百叫无绝。鸢飞戾天者，望峰息心；经纶世务者，窥谷忘反。横柯上蔽，在昼犹昏；疏条交映，有时见日。`,category:"文言文"},{id:"yw_05",subject:"yw",title:"野望",author:"王绩",content:`东皋薄暮望，徙倚欲何依。
树树皆秋色，山山唯落晖。
牧人驱犊返，猎马带禽归。
相顾无相识，长歌怀采薇。`,category:"诗歌"},{id:"yw_06",subject:"yw",title:"黄鹤楼",author:"崔颢",content:`昔人已乘黄鹤去，此地空余黄鹤楼。
黄鹤一去不复返，白云千载空悠悠。
晴川历历汉阳树，芳草萋萋鹦鹉洲。
日暮乡关何处是？烟波江上使人愁。`,category:"诗歌"},{id:"yw_07",subject:"yw",title:"使至塞上",author:"王维",content:`单车欲问边，属国过居延。
征蓬出汉塞，归雁入胡天。
大漠孤烟直，长河落日圆。
萧关逢候骑，都护在燕然。`,category:"诗歌"},{id:"yw_08",subject:"yw",title:"渡荆门送别",author:"李白",content:`渡远荆门外，来从楚国游。
山随平野尽，江入大荒流。
月下飞天镜，云生结海楼。
仍怜故乡水，万里送行舟。`,category:"诗歌"},{id:"yw_09",subject:"yw",title:"钱塘湖春行",author:"白居易",content:`孤山寺北贾亭西，水面初平云脚低。
几处早莺争暖树，谁家新燕啄春泥。
乱花渐欲迷人眼，浅草才能没马蹄。
最爱湖东行不足，绿杨阴里白沙堤。`,category:"诗歌"},{id:"yw_10",subject:"yw",title:"庭中有奇树",author:"《古诗十九首》",content:`庭中有奇树，绿叶发华滋。
攀条折其荣，将以遗所思。
馨香盈怀袖，路远莫致之。
此物何足贵？但感别经时。`,category:"诗歌"},{id:"yw_11",subject:"yw",title:"龟虽寿",author:"曹操",content:`神龟虽寿，犹有竟时；
腾蛇乘雾，终为土灰。
老骥伏枥，志在千里；
烈士暮年，壮心不已。
盈缩之期，不但在天；
养怡之福，可得永年。
幸甚至哉，歌以咏志。`,category:"诗歌"},{id:"yw_12",subject:"yw",title:"赠从弟（其二）",author:"刘桢",content:`亭亭山上松，瑟瑟谷中风。
风声一何盛，松枝一何劲！
冰霜正惨凄，终岁常端正。
岂不罹凝寒？松柏有本性。`,category:"诗歌"},{id:"yw_13",subject:"yw",title:"梁甫行",author:"曹植",content:`八方各异气，千里殊风雨。
剧哉边海民，寄身于草野。
妻子象禽兽，行止依林阻。
柴门何萧条，狐兔翔我宇。`,category:"诗歌"},{id:"yw_14",subject:"yw",title:"得道多助，失道寡助",author:"《孟子》",content:"天时不如地利，地利不如人和。三里之城，七里之郭，环而攻之而不胜。夫环而攻之，必有得天时者矣，然而不胜者，是天时不如地利也。城非不高也，池非不深也，兵革非不坚利也，米粟非不多也，委而去之，是地利不如人和也。故曰：域民不以封疆之界，固国不以山溪之险，威天下不以兵革之利。得道者多助，失道者寡助。寡助之至，亲戚畔之；多助之至，天下顺之。以天下之所顺，攻亲戚之所畔，故君子有不战，战必胜矣。",category:"文言文"},{id:"yw_15",subject:"yw",title:"富贵不能淫",author:"《孟子》",content:`景春曰："公孙衍、张仪岂不诚大丈夫哉？一怒而诸侯惧，安居而天下熄。"孟子曰："是焉得为大丈夫乎？子未学礼乎？丈夫之冠也，父命之；女子之嫁也，母命之，往送之门，戒之曰：'往之女家，必敬必戒，无违夫子！'以顺为正者，妾妇之道也。居天下之广居，立天下之正位，行天下之大道。得志，与民由之；不得志，独行其道。富贵不能淫，贫贱不能移，威武不能屈。此之谓大丈夫。"`,category:"文言文"},{id:"yw_16",subject:"yw",title:"生于忧患，死于安乐",author:"《孟子》",content:`舜发于畎亩之中，傅说举于版筑之间，胶鬲举于鱼盐之中，管夷吾举于士，孙叔敖举于海，百里奚举于市。故天将降大任于是人也，必先苦其心志，劳其筋骨，饿其体肤，空乏其身，行拂乱其所为，所以动心忍性，曾益其所不能。

人恒过，然后能改；困于心，衡于虑，而后作；征于色，发于声，而后喻。入则无法家拂士，出则无敌国外患者，国恒亡。然后知生于忧患而死于安乐也。`,category:"文言文"},{id:"yw_17",subject:"yw",title:"愚公移山",author:"《列子》",content:`太行、王屋二山，方七百里，高万仞，本在冀州之南，河阳之北。北山愚公者，年且九十，面山而居。惩山北之塞，出入之迂也，聚室而谋曰："吾与汝毕力平险，指通豫南，达于汉阴，可乎？"杂然相许。其妻献疑曰："以君之力，曾不能损魁父之丘，如太行、王屋何？且焉置土石？"杂曰："投诸渤海之尾，隐土之北。"遂率子孙荷担者三夫，叩石垦壤，箕畚运于渤海之尾。邻人京城氏之孀妻有遗男，始龀，跳往助之。寒暑易节，始一反焉。

河曲智叟笑而止之曰："甚矣，汝之不惠！以残年余力，曾不能毁山之一毛，其如土石何？"北山愚公长息曰："汝心之固，固不可彻，曾不若孀妻弱子。虽我之死，有子存焉。子又生孙，孙又生子；子又有子，子又有孙；子子孙孙无穷匮也，而山不加增，何苦而不平？"河曲智叟亡以应。操蛇之神闻之，惧其不已也，告之于帝。帝感其诚，命夸娥氏二子负二山，一厝朔东，一厝雍南。自此，冀之南，汉之阴，无陇断焉。`,category:"文言文"},{id:"yw_18",subject:"yw",title:"周亚夫军细柳",author:"司马迁",content:`文帝之后六年，匈奴大入边。乃以宗正刘礼为将军，军霸上；祝兹侯徐厉为将军，军棘门；以河内守亚夫为将军，军细柳：以备胡。上自劳军。至霸上及棘门军，直驰入，将以下骑送迎。已而之细柳军，军士吏被甲，锐兵刃，彀弓弩，持满。天子先驱至，不得入。先驱曰："天子且至！"军门都尉曰："将军令曰'军中闻将军令，不闻天子之诏'。"居无何，上至，又不得入。于是上乃使使持节诏将军："吾欲入劳军。"亚夫乃传言开壁门。壁门士吏谓从属车骑曰："将军约，军中不得驱驰。"于是天子乃按辔徐行。至营，将军亚夫持兵揖曰："介胄之士不拜，请以军礼见。"天子为动，改容式车。使人称谢："皇帝敬劳将军。"成礼而去。既出军门，群臣皆惊。文帝曰："嗟乎，此真将军矣！曩者霸上、棘门军，若儿戏耳，其将固可袭而虏也。至于亚夫，可得而犯邪！"称善者久之。`,category:"文言文"},{id:"yw_19",subject:"yw",title:"饮酒（其五）",author:"陶渊明",content:`结庐在人境，而无车马喧。
问君何能尔？心远地自偏。
采菊东篱下，悠然见南山。
山气日夕佳，飞鸟相与还。
此中有真意，欲辨已忘言。`,category:"诗歌"},{id:"yw_20",subject:"yw",title:"春望",author:"杜甫",content:`国破山河在，城春草木深。
感时花溅泪，恨别鸟惊心。
烽火连三月，家书抵万金。
白头搔更短，浑欲不胜簪。`,category:"诗歌"},{id:"yw_21",subject:"yw",title:"雁门太守行",author:"李贺",content:`黑云压城城欲摧，甲光向日金鳞开。
角声满天秋色里，塞上燕脂凝夜紫。
半卷红旗临易水，霜重鼓寒声不起。
报君黄金台上意，提携玉龙为君死。`,category:"诗歌"},{id:"yw_22",subject:"yw",title:"赤壁",author:"杜牧",content:`折戟沉沙铁未销，自将磨洗认前朝。
东风不与周郎便，铜雀春深锁二乔。`,category:"诗歌"},{id:"yw_23",subject:"yw",title:"渔家傲",author:"李清照",content:`天接云涛连晓雾，星河欲转千帆舞。仿佛梦魂归帝所，闻天语，殷勤问我归何处。

我报路长嗟日暮，学诗谩有惊人句。九万里风鹏正举。风休住，蓬舟吹取三山去！`,category:"宋词"},{id:"yw_24",subject:"yw",title:"浣溪沙",author:"晏殊",content:`一曲新词酒一杯，去年天气旧亭台。夕阳西下几时回？

无可奈何花落去，似曾相识燕归来。小园香径独徘徊。`,category:"宋词"},{id:"yw_25",subject:"yw",title:"采桑子",author:"欧阳修",content:`轻舟短棹西湖好，绿水逶迤，芳草长堤。隐隐笙歌处处随。

无风水面琉璃滑，不觉船移，微动涟漪。惊起沙禽掠岸飞。`,category:"宋词"},{id:"yw_26",subject:"yw",title:"相见欢",author:"朱敦儒",content:`金陵城上西楼，倚清秋。万里夕阳垂地大江流。

中原乱，簪缨散，几时收？试倩悲风吹泪过扬州。`,category:"宋词"},{id:"yw_27",subject:"yw",title:"如梦令",author:"李清照",content:"常记溪亭日暮，沉醉不知归路。兴尽晚回舟，误入藕花深处。争渡，争渡，惊起一滩鸥鹭。",category:"宋词"},{id:"en_01",subject:"en",title:"七下 U1",content:`advice 建议
encourage 鼓励；激励
retire （令）退职；（使）退休
cheerful 快乐的；高兴的
community 社区
medical 医学的；医疗的
fried 油炸的；油煎的；油炒的
wherever 各处；处处
future 将来；未来
soon 很快；马上；不久
smart 聪明的；机敏的
attention 专心；注意力
seldom 不常；很少；难得
bored （对某人/事物）厌倦的；烦闷的
strict 要求严格的；严厉的
relative 亲戚；亲属
uniform 制服；校服
personality 性格；个性
characteristic 特点；品质
topic 话题；标题
active 忙碌的；活跃的
smartphone 智能手机
wisely 聪明地；明智地
competition 比赛；竞赛
shower 淋浴
online 在线的
site 建筑工地
narrow 狭窄的；窄小的
superman 超人
give up 认输；放弃
used to 曾经
in the future 在未来
be strict about 对……要求严格
be worried about 担心`,category:"七下词汇"},{id:"en_02",subject:"en",title:"七下 U2",content:`wine 葡萄酒
match 配对
rich 丰富多彩的
lie 位于；坐落在
cafe 咖啡馆；小餐馆
excellent 优秀的；极好的
coast 海岸；海滨
perfect 正合适
mostly 主要地；通常
receive 接待；招待；拿到；接到；收到
key 主要的；关键的
remain 仍然是；保持不变
lift 电梯；升降机
step 台阶
stair 楼梯
motorcycle 摩托车
sightseeing 观光；游览
imagine 想象；设想
destination 目的地；终点
address 住址；地址
government 政府
unique 独特的；罕见的
endangered 濒危的
stretch 延伸；绵延
huge 巨大的；极多的
wild 野的；野生的；自然环境
discover 了解到；查明
volcano 火山
range 山脉
snowmobile 雪地机动车
wolf 狼
department store 百货商店
prefer to 更喜欢
by hand 用手工
go sightseeing 去观光
go on a trip 去旅行
set up 建立
giant panda 大熊猫
in the wild 在野外
all year round 全年
golden monkey 金丝猴
go hiking 去远足
hot spring 温泉`,category:"七下词汇"},{id:"en_03",subject:"en",title:"七下 U3",content:`branch 树枝
root 根；根茎
silent 不说话的；沉默的
overlook 忽略；未注意到
human 人
oxygen 氧；氧气
create 创造
environment 自然环境
convenient 便利的；方便的
furniture （可移动的）家具
wood 木；木头
treat 以……态度对待
communicate 交流；沟通
species 种；物种
product 产品；制品
side 一面
borrow 借；借用
dig 掘（地）；凿（洞）；挖（土）
hole 洞；孔；坑
stick 棍；条
accident 意外；偶然的事
knowledge 知识；学问
character 文字
spread 传播
translation 译文；译本
take in 吸收；摄入
greenhouse gas 温室气体
to begin with 首先；第一点
come from 来自
look around 环视；环顾；四下察看
be made of 由……制成
for example 例如；譬如
communicate with 与……沟通
call on 号召；动员；要求
according to 据（……所说）；按（……所报道）
by accident 偶然；意外地`,category:"七下词汇"},{id:"en_04",subject:"en",title:"七下 U4",content:`dolphin 海豚
hen 母鸡
blind 瞎的；失明的
wool （羊等的）毛
sir 先生
receptionist 接待员
allow 允许进入（或出去、通过）
apologize 道歉
asleep 睡着
smoke 烟
fireman 消防队员
type 类型；种类
search-and-rescue 搜索救援
service 服务
disaster 灾难；灾害
guest 旅客；房客
team 组；班
transport 运输；运送
guard 守卫；保卫
honey 蜂蜜
material 材料；原料
either 也
shark 鲨鱼
scared 害怕；恐惧
grey 灰色的
somewhere 在某处；到某处
probably 很可能；大概
source 来源；出处
sometime 在某时
extinct 已灭绝的；绝种的
effort 艰难的尝试；试图
lead (somebody) to 带着（某人）到
fall asleep 入睡；睡着
get down 俯身；趴下；跪下
fire engine 消防车`,category:"七下词汇"},{id:"en_05",subject:"en",title:"七下 U5",content:`everyday 每天的；日常的
form 类型；种类
journey （尤指长途）旅行
drop 滴；水珠
tap 水龙头
voice 说话声
eventually 最后；终于
pipe 管子
return 回去；返回
rush 迅速移动
bath 洗澡；洗浴
salt 含盐的；咸的
brain 脑
fix 修理
public 公共的；公开的
population 人口
agriculture 农业
trade 贸易；买卖
industry 工业；生产制造
role 角色
goods 商品；货品
overseas 在国外；向海外
global 全球的；全世界的
income 收入；收益；所得
nearly 几乎；差不多；将近
business 买卖；生意
leisure 闲暇；空闲；休闲
throughout 自始至终；贯穿整个时期
duty 责任；义务
a bit 有点儿；稍微
at once 立即；马上
drinking water 饮用水
play a role in 在……起作用
steam engine 蒸汽机
as a result 作为结果；因此
make sure 确保；设法保证`,category:"七下词汇"},{id:"en_06",subject:"en",title:"七下 U6",content:`battery 电池
electricity 电；电能
switch-off 关闭（电灯、机器等）的
task 任务；活动
while 一段时间；一会儿
tablet 平板电脑
fridge 冰箱
yogurt 酸奶
apartment 公寓套房
household 家庭的
against 紧靠；碰；撞
speed 速度；速率
safety 安全；平安
instruction 用法说明；操作指南
connect （使）连接
device 装置；设备
rule 规则；条例
climate 气候
amount 数量；数额
power 驱动；推动（机器或车辆）
television set 电视机
landmark 地标
have something in common 有相同的特征
light bulb 电灯泡
air conditioner 空调机
video game 电子游戏
run out of 用完；耗尽
go bad 变质
electric car 电动汽车
electrical appliance 电器
care about 关注；担忧
climate change 气候变化
join in 参加；加入`,category:"七下词汇"},{id:"en_07",subject:"en",title:"七下 U7",content:`contribution 贡献
hero 英雄
pioneer 先锋；先驱
technology 科技
receive 接待；招待；拿到；接到；收到
engineering 工程学
award 授予；奖励；奖
education 教育
spend 花（时间）；度过
research 研究；调查
achieve （凭长期努力）达到
well-respected 受尊敬的
found 建立（城镇或国家）
eager 热切的；渴望的
raise 增加；提高
mission 使命
approval 赞成；同意
praise 赞扬；称赞；赞美
society 社会
female 女的；女性的
admire 钦佩；仰慕
inspire 激励；鼓舞
regular 通常的；平常的
feed 养活；提供食物
smokejumper 空降消防员
thick 茂密的
certain 某个；特定的
kill 杀死；导致死亡
tool 工具
dead 失去生命的；枯萎的
brave 勇敢的；无畏的
tough 健壮的；坚韧不拔的
fit 健壮的；健康的
otherwise 否则；不然
survive 生存；存活
proud 骄傲的；自豪的
role model 楷模；行为榜样
in the field of 在……领域
devote yourself to 献身；致力
college entrance examination 大学入学考试
look up to 敬仰；钦佩
sugar pill 糖丸
chief engineer 总工程师
put out 熄灭；扑灭
be able to 能够
be proud of 为……而自豪`,category:"七下词汇"},{id:"en_08",subject:"en",title:"七下 U8",content:`possible 可能
athlete 运动员
biologist 生物学家
instrument 乐器；仪器
interest 兴趣；业余爱好
career 生涯；职业
lifetime 一生；终身
diamond 钻石
belt 腰带
shoot 冲；奔；飞驰
extremely 极其；极端；非常
curious 求知欲强的；好奇的
increase 增长；增多；增加
host 主持
beyond 在另一边；在（或向）更远处
audience 观众；听众
lively 充满趣味的；令人兴奋的
actually 事实上
sale 驾驶（或乘坐）帆船航行
ability 才能；本领
review 评论
perform 演出；表演
kiss 吻
hug 拥抱；搂抱
method 方法；办法
compare 将……比作
nowadays 现今；现在；目前
human being 人
lecture 讲座；讲课；演讲
go outside 外出
more and more 越来越多
body language 肢体语言
dream of 梦想
come true 实现；成为现实`,category:"七下词汇"},{id:"en_09",subject:"en",title:"八上 U1",content:`dinosaur 恐龙
intelligent 有才智的；聪明的
talented 有才能的；天才的
artistic 有艺术天赋的；（尤指）有美术才能的
perhaps 可能；大概；也许
notebook 笔记本
vehicle 交通工具；车辆
prehistoric 史前的
completely 完全地；彻底地
original 原来的；起初的
birth 出生
suffering 苦难；疼痛
artist 艺术家；（尤指）画家
death 死；死亡
whole 全部的；所有的
piece 一首，一篇（作品）
editor （书籍的）编辑
organize 安排；组织
order 顺序
record 记录
die out 灭绝
a type of 一种
be related to 与......... 属于同一种类
general education 通识教育
go back a long way 历史悠久
be similar to 与...................相似
alphabetical order 字母顺序
play an important role 起到重要作用`,category:"八上词汇"},{id:"en_10",subject:"en",title:"八上 U2",content:`flight （尤指乘飞机的）航程
schedule 日程安排
everywhere 到处；各个地方
challenge 向（某人）挑战
prize 奖赏；奖励
promise 承诺；保证
chessboard 国际象棋棋盘
silver 银
reply 回复；答复
hesitation 犹豫
wonder 想知道；琢磨
agree 同意；赞成
per cent 百分之............
currently 目前；当前
check 检查；核查
budget 预算
province 省份
sharply 急剧地；突然大幅度地
count 计算（或清点）总数
system 系统
symbol 符号；记号
represent 代表
exactly 准确地；确切地
flight schedule 航班时刻表
price tag 价格标签
for a moment 片刻；一会儿
without hesitation 毫不犹豫
go up 上升
go down 下降
write down 写下；记下
instead of 代替；作为...........的替换`,category:"八上词汇"},{id:"en_11",subject:"en",title:"八上 U3",content:`network 网络
flood 洪水；水灾
multimedia 多媒体
expert 专家
mobile 可移动的
payment 付款；支付
warn 提醒注意；警告
treatment 治疗；疗法
data 数据
company 公司
traffic 路上行驶的车辆；交通
flow （人或事物）涌流；流动
smoothly 平稳地；连续而流畅地
laptop 笔记本电脑
screen 屏幕
weight 重量
digital 数码的
social 社交的
message （书面或口头的）信息
interview 采访
positive 正面的；积极的
negative 消极的
effect 影响
opinion 意见；看法
novel （长篇）小说
comment 评论
basis 基础
microprocessor 微处理器
microchip 微芯片；芯片
major 主要的；重要的
breakthrough 突破；重大进展
electronic 电子的
software 软件
app （application 的缩写）应用程序；应用软件
era 时代；纪元
download 下载
tiny 微小的
connect to 连接
bring big changes to 给……带来重大变化
mobile payment 移动支付
take ....... for example 以……为例
rubbish bin 垃圾箱
social media 社交媒体
in person 亲自；亲身
the general public 公众；大众`,category:"八上词汇"},{id:"en_12",subject:"en",title:"八上 U4",content:`balloon 气球
wheel 轮；车轮
central 在中心的
although 虽然；尽管；即使
attach 把..... 固定；把..................附（在……上）
pull 拉；拽；扯；拖
international 国际的
path 小路；小径
technique 技巧；技艺
depend 需要；依靠
doubt 疑惑；疑问
personally 就个人意见
prediction 预言；预测
statement 说明
benefit 益处；优势
wing （飞行器的）翅膀；机翼
distance 距离
petrol 汽油
avoid 避免；防止
anywhere 在（或去）任何地方
notice 看（或听）到；注意到
type （印刷用的）活字
mixture 混合物
heat 加热；变热
press （被）压
metal 金属
steam locomotive 蒸汽机车
crewed spacecraft 载人航天器
on foot 步行
a number of 几个；若干
take place 发生；进行
for instance 例如；比如
large amounts of 大量
international trade 国际贸易
depend on 依靠；依赖
without doubt 毫无疑问
of all time 自古以来；有史以来
make fun of 取笑；拿...........开玩笑
traffic jam 堵车；交通阻塞`,category:"八上词汇"},{id:"en_13",subject:"en",title:"八上 U5",content:`exchange 交流
nervous 焦虑的；担忧的
grateful 感激的
chopstick 筷子
tour 旅行；旅游
tai chi 太极（拳）
yet 尚（未）；还；仍
independent 自主的
content 内容
feeling 感觉；感情
shock 震惊；令人震惊的事
foreign 外国的
confused 糊涂的；迷惑的
anxious 焦虑的；忧虑的
phase 阶段；时期
honeymoon 蜜月
unfamiliar 陌生的；不熟悉的
homesick 想家的
lonely 孤独的
deal 对付；应付
expect 期待；盼望
situation 情况
accept 接受
adaptation 适应
Beijing opera 京剧
host family 寄宿家庭
snake its way 蜿蜒
culture shock 文化冲击
deal with 解决；处理
feel at home 感到舒适自在`,category:"八上词汇"},{id:"en_14",subject:"en",title:"八上 U6",content:`author 作者；作家
remains 遗迹；遗址
locate 把........安置在（或建造于）
soldier 士兵
captain 首领；领导者
empty 空的
victory 胜利；成功
joke 笑话；玩笑
midnight 午夜
except 除........... 之外
hide 藏；隐蔽
secretly 秘密地
enter 进来；进入
succeed 达到目的；成功
trick 诡计
beat 打败（某人）
pretend 假装；佯装
enemy 敌人
fail 失败；未能（做到）
therefore 因此；所以
within 在（某段时间）之内
fill （使）充满；（使）装满
towards 向；朝；对着
attack 袭击；攻击
fog 雾
make jokes about 开............的玩笑
succeed in 在................方面成功
be tired of 厌烦
go on board 上船
be jealous of 嫉妒
be full of 装满；充满`,category:"八上词汇"},{id:"en_15",subject:"en",title:"八上 U7",content:`regularly 有规律地
repeat 重复
note 笔记；记录
visual 视觉的
mentally 精神上
link 联系；相联系
list 清单
especially 尤其
diet 日常饮食
maintain 维持；保持
nut 坚果
relax 放松；休息
stressed 心力交瘁的；焦虑不安的
tend 往往会；常常就
normal 正常的
loss 丧失；损失
fork 餐叉
onion 洋葱
ant 蚂蚁
context 上下文；语境
image 图像
sense 感觉官能（即视、听、嗅、味、触五觉）
summary 总结；概括
contain 包含；含有
particular 专指的；特指的
chemistry 化学性质；化学
flash card 识字卡片
make a point of doing something （因重要或必要）保证做
last but not least 最后但同样重要的
natural disaster 自然灾害
figure out 弄懂；弄清楚`,category:"八上词汇"},{id:"en_16",subject:"en",title:"八上 U8",content:`attack 袭击；攻击
faithful 忠实的；忠诚的
hold 抱着；拿着
responsible 可信任的；可信赖的
awake 醒着
flat 公寓
choice 选择
advise 劝告；建议
cause 引起；造成；导致
complain 抱怨；投诉
litter 垃圾
unlikely 不大可能发生的
relieve 方便；解手
indoors 在室内
magical 有魔力的
wealth 钱财；财富
queen 女王；王后
servant 仆人；佣人
pride 自豪；骄傲
among 在............. 中
relationship 关系
grow up 长大；成熟
care for 照顾；照料
in short 总之；简言之
have no choice but to do 别无选择；只能..............................
run free 四处自由走动
lie around 懒散度日；游手好闲
complain about 抱怨
in addition 除..............以外（还）
catch the eye of somebody 引起某人的注意`,category:"八上词汇"}];function st(){return ue.filter(e=>e.subject==="yw"||e.subject==="en")}const Mt={yw:[{id:"yw_daily_read",title:"阅读理解1篇",icon:"📖"},{id:"yw_daily_book",title:"推荐书目阅读",icon:"📚"}],en:[{id:"en_daily_news",title:"时文阅读",icon:"📰"},{id:"en_daily_read",title:"阅读理解1篇",icon:"📝",satAlt:"作文+听力",satIcon:"🎧"}]};function hs(e,t,n){return(Mt[e]||[]).map(a=>{const i=n&&a.satAlt;return{id:i?a.id+"_sat":a.id,title:i?a.satAlt:a.title,icon:i&&a.satIcon||a.icon,isSatVariant:i,originalId:a.id}})}const nt={sx:[{chapter:"第十三章 三角形",items:["13.1 三角形的概念","13.2 与三角形有关的线段","13.3 三角形的内角与外角"]},{chapter:"第十四章 全等三角形",items:["14.1 全等三角形及其性质","14.2 三角形全等的判定","14.3 角的平分线"]},{chapter:"第十五章 轴对称",items:["15.1 图形的轴对称","15.2 画轴对称的图形","15.3 等腰三角形"]},{chapter:"第十六章 整式的乘法",items:["16.1 幂的运算","16.2 整式的乘法","16.3 乘法公式"]},{chapter:"第十七章 因式分解",items:["17.1 用提公因式法分解因式","17.2 用公式法分解因式"]},{chapter:"第十八章 分式",items:["18.1 分式及其基本性质","18.2 分式的乘法与除法","18.3 分式的加法与减法","18.4 整数指数幂","18.5 分式方程"]}],wl:[{chapter:"第一章 机械运动",items:["1.1 长度和时间的测量","1.2 运动的描述","1.3 运动的快慢","1.4 测量平均速度"]},{chapter:"第二章 声现象",items:["2.1 声音的产生与传播","2.2 声音的特性","2.3 声的利用","2.4 噪声的危害和控制"]},{chapter:"第三章 物态变化",items:["3.1 温度","3.2 熔化和凝固","3.3 汽化和液化","3.4 升华和凝华"]},{chapter:"第四章 光现象",items:["4.1 光的直线传播","4.2 光的反射","4.3 平面镜成像","4.4 光的折射","4.5 光的色散"]},{chapter:"第五章 透镜及其应用",items:["5.1 透镜","5.2 生活中的透镜","5.3 凸透镜成像的规律","5.4 眼睛和眼镜","5.5 显微镜和望远镜"]},{chapter:"第六章 质量与密度",items:["6.1 质量","6.2 密度","6.3 测量物质的密度","6.4 密度与社会生活"]}]};function bt(e){if(!e)return null;if(e.startsWith("sp_"))return"sp";if(e.startsWith("ch_sx_"))return"sx";if(e.startsWith("ch_wl_"))return"wl";if(e.startsWith("sx_ch_"))return"sx";if(e.startsWith("wl_ch_"))return"wl";if(e.startsWith("ot_"))return"ot";if(e.startsWith("hw_"))return"hw";if(e.startsWith("daily_")){const t=e.split("_");if(t.length>=2){const n=t[1];if(n==="yw"||n==="en")return n}return"daily"}return null}function fs(e,t){let n=1;return e.subject==="yw"&&(n=1,e.content&&e.content.length>100&&(n=2)),e.subject==="en"&&(n=1,e.content&&e.content.length>200&&(n=2)),Ze(t)===6&&(n+=1),Math.min(n,O.maxStarsPerDay)}async function Ne(e,t,n={}){const s=ue.find(d=>d.id===e),a=n.subjectId||(s?s.subject:bt(e));if(!s&&!n.subjectId&&!bt(e))throw new Error(`Task not found: ${e}`);if(await qt(t,e))return{state:"unchanged",events:[]};const o=n.stars||(s?fs(s,t):1),v={date:t,subjectId:a,taskId:e,type:a,stars:o,timestamp:Date.now(),isBlindbox:n.isBlindbox||!1,isChallenge:n.isChallenge||!1,note:n.note||"",sportType:n.sportType||"",customTitle:n.customTitle||"",customContent:n.customContent||""};await ps(v);const l=["task_completed"],c={action:"completed",taskId:e,stars:o},r=await ws(t);return l.push(...r),{state:c,events:l}}async function Ee(e,t){const n=await qt(t,e);return n?(await vs(t,e),{state:{action:"undone",taskId:e,stars:n.stars},events:["task_undone"]}):{state:"unchanged",events:[]}}async function ms(){const e=await re(),t=new Set(e.map(i=>i.date)),n=W();let s=0,a=n;for(;V(a);){if(I(a)||Q(a)){a=ce(a,-1);continue}if(t.has(a))s++,a=ce(a,-1);else break}return s}async function bs(){const e=await re(),t=[...new Set(e.map(i=>i.date))].sort();let n=0,s=0,a=null;for(const i of t){if(!a)s=1;else{ce(a,1);const o=Et(a,i);let v=!0,l=ce(a,1);for(;l<i;){if(!I(l)&&!Q(l)){v=!1;break}l=ce(l,1)}o===1||o>1&&v?s++:s=1}s>n&&(n=s),a=i}return n}async function pe(){const e=await re(),t=W(),n=e.filter(p=>p.date===t),s=n.reduce((p,y)=>p+y.stars,0),a=e.reduce((p,y)=>p+y.stars,0),i=e.length,o=[...new Set(e.map(p=>p.taskId))],v={};for(const p of le){const y=e.filter($=>$.subjectId===p.id),b=[...new Set(y.map($=>$.taskId))];let k=ue.filter($=>$.subject===p.id).length;k===0&&p.type==="chapter"&&(k=$s(p.id).length),v[p.id]={name:p.name,icon:p.icon,color:p.color,records:y.length,stars:y.reduce(($,S)=>$+S.stars,0),completedUnique:b.length,totalTasks:k,percentage:k>0?Math.round(b.length/k*100):0}}const l=await ms(),c=await bs(),r=[...new Set(e.map(p=>p.date))].length,d=st(),f=d.filter(p=>o.includes(p.id)).length;return{todayStars:s,totalStars:a,totalRecords:i,activeDays:r,streak:l,maxStreak:c,completedTaskIds:o.length,reciteCompleted:f,reciteTotal:d.length,subjectStats:v,todayProgress:n}}const gs=[{id:"first_blood",title:"初次登场",desc:"完成第一次任务打卡",icon:"🕵",check:e=>e.totalRecords>=1},{id:"ten_tasks",title:"见习侦探",desc:"累计完成10次打卡",icon:"🔍",check:e=>e.totalRecords>=10},{id:"thirty_tasks",title:"初级探员",desc:"累计完成30次打卡",icon:"📋",check:e=>e.totalRecords>=30},{id:"fifty_tasks",title:"中级探员",desc:"累计完成50次打卡",icon:"💼",check:e=>e.totalRecords>=50},{id:"hundred_tasks",title:"高级探长",desc:"累计完成100次打卡",icon:"🏅",check:e=>e.totalRecords>=100},{id:"two_hundred",title:"重案组组长",desc:"累计完成200次打卡",icon:"💪",check:e=>e.totalRecords>=200},{id:"three_hundred",title:"警界之光",desc:"累计完成300次打卡",icon:"🌎",check:e=>e.totalRecords>=300},{id:"streak_3",title:"三日追踪",desc:"连续打卡3天",icon:"🔥",check:e=>e.streak>=3},{id:"streak_5",title:"五日搜证",desc:"连续打卡5天",icon:"🧐",check:e=>e.streak>=5},{id:"streak_7",title:"七日连环案",desc:"连续打卡7天",icon:"💿",check:e=>e.streak>=7},{id:"streak_14",title:"半月大追捕",desc:"连续打卡14天",icon:"🌍",check:e=>e.streak>=14},{id:"streak_21",title:"夏洛克之魂",desc:"连续打卡21天",icon:"🧥",check:e=>e.streak>=21},{id:"streak_30",title:"侦探之王",desc:"连续打卡30天",icon:"👑",check:e=>e.streak>=30},{id:"star_25",title:"证物碎片",desc:"累计获得25颗星星",icon:"⭐",check:e=>e.totalStars>=25},{id:"star_50",title:"铜星侦探",desc:"累计获得50颗星星",icon:"🥇",check:e=>e.totalStars>=50},{id:"star_100",title:"银星侦探",desc:"累计获得100颗星星",icon:"🥈",check:e=>e.totalStars>=100},{id:"star_200",title:"金星侦探",desc:"累计获得200颗星星",icon:"🥉",check:e=>e.totalStars>=200},{id:"star_350",title:"钻石侦探",desc:"累计获得350颗星星",icon:"💎",check:e=>e.totalStars>=350},{id:"star_500",title:"传奇侦探",desc:"累计获得500颗星星",icon:"🌟",check:e=>e.totalStars>=500},{id:"five_star_day",title:"重大发现",desc:"单日获得5颗以上星星",icon:"✨",check:e=>e.todayStars>=5},{id:"eight_star_day",title:"线索井喷",desc:"单日获得8颗以上星星",icon:"💥",check:e=>e.todayStars>=8},{id:"ten_star_day",title:"证据确凿",desc:"单日获得10颗以上星星",icon:"📦",check:e=>e.todayStars>=10},{id:"fifteen_star_day",title:"案发现场",desc:"单日获得15颗以上星星",icon:"🚨",check:e=>e.todayStars>=15},{id:"yw_half",title:"古籍研究员",desc:"完成50%的古籍破译任务",icon:"📖",check:e=>e.subjectStats.yw&&e.subjectStats.yw.percentage>=50},{id:"yw_master",title:"古籍破译大师",desc:"完成全部古籍破译任务",icon:"🏛",check:e=>e.subjectStats.yw&&e.subjectStats.yw.percentage>=100},{id:"en_half",title:"密码学见习",desc:"完成50%的密文翻译任务",icon:"📩",check:e=>e.subjectStats.en&&e.subjectStats.en.percentage>=50},{id:"en_master",title:"密码学专家",desc:"完成全部密文翻译任务",icon:"🔐",check:e=>e.subjectStats.en&&e.subjectStats.en.percentage>=100},{id:"sx_half",title:"逻辑分析",desc:"完成50%的数学章节",icon:"📐",check:e=>e.subjectStats.sx&&e.subjectStats.sx.percentage>=50},{id:"wl_half",title:"现场重建",desc:"完成50%的物理章节",icon:"🔬",check:e=>e.subjectStats.wl&&e.subjectStats.wl.percentage>=50},{id:"days_10",title:"十天足迹",desc:"累计活跃10天",icon:"📅",check:e=>e.activeDays>=10},{id:"days_20",title:"二十天行动",desc:"累计活跃20天",icon:"📆",check:e=>e.activeDays>=20},{id:"days_35",title:"全勤侦探",desc:"累计活跃35天",icon:"🏃",check:e=>e.activeDays>=35},{id:"days_45",title:"风雨无阻",desc:"累计活跃45天",icon:"☂",check:e=>e.activeDays>=45},{id:"first_poem",title:"古诗破译入门",desc:"完成任意一篇古诗背诵",icon:"🖋",check:e=>e.subjectStats.yw&&e.subjectStats.yw.records>=1},{id:"first_eng",title:"密电初解",desc:"完成任意一组英文单词背诵",icon:"📨",check:e=>e.subjectStats.en&&e.subjectStats.en.records>=1},{id:"weekend_warrior",title:"周末探员",desc:"周六打卡获得3颗以上星星",icon:"🎢",check:e=>e.todayStars>=3}];async function ws(e){const t=await pe(),n=await je(),s=new Set(n.map(i=>i.id)),a=[];for(const i of gs)if(!s.has(i.id))try{i.check(t)&&(await ys({id:i.id,title:i.title,desc:i.desc,icon:i.icon,unlockedAt:e||W()}),a.push("achievement_unlocked"))}catch(o){console.error("Achievement check failed:",i.id,o)}return a}async function Bt(){const e=await pe(),{totalStars:t,totalRecords:n,streak:s,maxStreak:a}=e;if(n===0)return{level:0,title:"见习侦探",icon:"🕵",color:"#94A3B8",nextTitle:"初级侦探",nextNeed:1};const i=t+n*.5+a*2;return i<10?{level:1,title:"见习侦探",icon:"🕵",color:"#94A3B8",progress:i/10,nextTitle:"初级侦探",nextNeed:10}:i<25?{level:2,title:"初级侦探",icon:"🕵‍♂",color:"#22C55E",progress:(i-10)/15,nextTitle:"中级侦探",nextNeed:25}:i<50?{level:3,title:"中级侦探",icon:"🔍",color:"#3B82F6",progress:(i-25)/25,nextTitle:"高级侦探",nextNeed:50}:i<100?{level:4,title:"高级侦探",icon:"🧐",color:"#8B5CF6",progress:(i-50)/50,nextTitle:"名侦探",nextNeed:100}:i<200?{level:5,title:"名侦探",icon:"🏅",color:"#F59E0B",progress:(i-100)/100,nextTitle:"传奇侦探",nextNeed:200}:{level:6,title:"传奇侦探",icon:"👑",color:"#EF4444",progress:1,nextTitle:null,nextNeed:null}}async function ks(){const e=await re(),t=new Set(e.map(l=>l.taskId)),n=await tt();for(const l of n)t.has(l.taskId)&&await mt(l.taskId,null);const a=st().filter(l=>!t.has(l.id));if(a.length===0)return[];const i=[];let o=W();for(;o<=O.endDate;)!I(o)&&!Q(o)&&i.push(o),o=ce(o,1);if(i.length===0)return[];const v=[];a.forEach((l,c)=>{const r=Math.floor(c*i.length/a.length),d=i[Math.min(r,i.length-1)];v.push({taskId:l.id,suggestedDate:d})});for(const l of v)await mt(l.taskId,l.suggestedDate);return v}async function xs(){const e=await re(),t={};for(const a of e)t[a.date]||(t[a.date]={stars:0,count:0,tasks:[]}),t[a.date].stars+=a.stars,t[a.date].count++,t[a.date].tasks.push(a);const n=[];let s=O.startDate;for(;s<=O.endDate;){const a=t[s]||null;n.push({date:s,isSunday:I(s),isTravel:Q(s),isToday:s===W(),stars:a?a.stars:0,count:a?a.count:0,hasActivity:!!a}),s=ce(s,1)}return n}function Fs(e,t){return(nt[e]||[]).map((s,a)=>({chapterIndex:a,chapterTitle:s.chapter,items:s.items.map((i,o)=>({id:`ch_${e}_${a}_${o}`,title:i,subject:e,chapterIndex:a,itemIndex:o}))}))}function $s(e){const t=nt[e]||[],n=[];return t.forEach((s,a)=>{s.items.forEach((i,o)=>{n.push({id:`ch_${e}_${a}_${o}`,title:i,subject:e,chapterIndex:a,itemIndex:o})})}),n}const at=[{id:"c01",title:"失踪的暑假作业",desc:"暑假作业本离奇失踪，现场只留下一张神秘纸条",cluesNeeded:2,icon:"📝",clues:["作业本最后一页有半枚蓝色墨水指纹，指纹纹路较浅，像是孩子的手","同桌小明最近总是躲躲闪闪，他的铅笔盒里多了一支同样的蓝色钢笔"],question:"暑假作业最可能是谁拿走的？",options:["同桌小明想借作业抄","被家里的宠物狗叼到院子里了","自己做完后忘记放哪了"],answer:0,explanation:"蓝色墨水指纹和同桌小明包里的钢笔对上了！原来是小明偷偷拿走了作业本想抄，结果还没来得及还就被发现了。"},{id:"c02",title:"图书馆的午夜灯光",desc:"连续三晚，闭馆后的图书馆总有一盏灯亮着",cluesNeeded:2,icon:"📚",clues:["亮灯的位置是图书馆角落的自然科学区，桌上的书堆里夹着一张手绘的星图","管理员说最近总有一个戴眼镜的男生在闭馆铃响后磨磨蹭蹭不走"],question:"午夜灯光是谁留下的？",options:["管理员忘记关灯了","天文社的学长在偷偷研究星图","图书馆闹鬼了"],answer:1,explanation:"星图和戴眼镜的男生线索串起来了！天文社的学长为了准备天文竞赛，每晚躲在图书馆研究星图，他是从后窗翻进去的。"},{id:"c03",title:"食堂失窃案",desc:"食堂冰箱里的布丁不翼而飞，目击者称看到可疑黑影",cluesNeeded:2,icon:"🍦",clues:["冰箱把手上残留着面粉痕迹，旁边地上有几粒面包屑","食堂后门监控拍到一只橘猫叼着白色物体跑过"],question:"布丁到底去哪了？",options:["被面包房师傅拿去研究配方了","橘猫从没关好的冰箱里叼走了","值日生当垃圾扔掉了"],answer:1,explanation:"面粉痕迹是猫咪踩过面包房留下的脚印，而监控里橘猫叼走的白色物体正是布丁杯！这家伙已经是食堂惯犯了。"},{id:"c04",title:"神秘的信件",desc:"连续一周收到没有署名的信件，每封都写着不同的密码",cluesNeeded:3,icon:"✉",clues:["每封信的邮戳都是学校附近的邮局，寄出时间都在周三下午3点","密码破译后发现是摩斯电码，内容都是在描述一道数学题的不同解法","周三下午3点正是数学竞赛辅导班的课间休息时间"],question:"神秘信件是谁寄的？",options:["数学竞赛班的某个同学在偷偷传递答案","一个想交笔友的匿名同学","有人在恶作剧"],answer:0,explanation:"周三下午3点+邮戳+摩斯电码数学题——数学竞赛班的学霸在用这种酷炫的方式给暗恋的同学传纸条，结果被当成谜案了！"},{id:"c05",title:"实验室的异常声响",desc:"放学后的物理实验室传来奇怪的嗡嗡声",cluesNeeded:3,icon:"🔬",clues:["声音来源是一台被改装过的老式收音机，天线被加长了两倍","收音机旁有一本写满频率数字的笔记本，笔迹很工整",'笔记本最后一页写着"如果能收到空间站的信号就好了"'],question:"嗡嗡声是谁弄出来的？",options:["物理老师在测试新设备","某个学生想接收国际空间站的无线电信号","收音机坏了自己乱响"],answer:1,explanation:"长天线+频率笔记本+空间站愿望——一个无线电爱好者同学改装了收音机，每天放学后来实验室搜索来自太空的信号！"},{id:"c06",title:"消失的运动会奖牌",desc:"上届运动会的金牌在展柜中凭空消失",cluesNeeded:3,icon:"🏅",clues:["展柜玻璃没有被撬的痕迹，是用钥匙正常打开的","体育办公室的钥匙柜少了一把备用钥匙","上一届百米冠军李明最近情绪低落，他的金牌是他已故父亲唯一看过他得到的奖"],question:"奖牌为什么消失了？",options:["有贼偷走卖钱","李明自己拿去擦洗保养了","有人恶作剧藏起来了"],answer:1,explanation:"李明用自己偷偷配的备用钥匙取走了金牌，因为金牌上有一块污渍他想擦干净。他太珍视这枚奖牌了，所以想自己悄悄保养。"},{id:"c07",title:"教室里的涂鸦",desc:"周一早上发现黑板上画满了奇怪符号，值日生发誓昨晚擦干净了",cluesNeeded:3,icon:"🎨",clues:["符号全是古希腊字母，排列方式和星座图一模一样","黑板下方的粉笔槽里留着一根荧光粉笔，普通学生没有这种笔","美术社的活动记录显示，周末有人借用过美术教室"],question:"谁在黑板上画了这些符号？",options:["想用星座图给班上同学惊喜的美术社成员","外星人真的来过","数学老师准备的课前谜题"],answer:0,explanation:"美术社成员周末借了美术教室，用社团的荧光粉笔画了这幅星座图，想给周一来上课的同学们一个惊喜——他们班下周正学天文学。"},{id:"c08",title:"校长室的访客",desc:"监控拍到深夜有人进入校长室，但第二天什么都没少",cluesNeeded:3,icon:"🚪",clues:["校长室门口的盆栽被挪动过位置，花盆底下藏着一把老式钥匙","校长办公桌上多了一份没有署名的建议书，字迹有些歪歪扭扭","建议书的内容是关于改善学校午餐质量的，还画了很多可爱的小插图"],question:"深夜访客是谁？",options:["有贼踩点但没找到值钱东西","一个害羞的学生趁夜递交午餐改善建议","副校长加班忘记关门了"],answer:1,explanation:"一个太害羞不敢当面说话的学生，鼓起勇气趁夜把建议书放到了校长桌上。那把钥匙是他用零花钱从老教师那求来的旧钥匙。"},{id:"c09",title:"诡异的天气预报",desc:"有人提前一周准确预测了每天的天气，甚至精确到分钟",cluesNeeded:3,icon:"⛈",clues:["预测者使用的数据来源全部是公开气象网站的数据",'预测者的草稿纸上画满了复杂的统计图表，封面上写着"2026年初中数学建模大赛"',"气象局的数据恰好验证：这一周没有异常天气，非常规律，模型预测成功率本来就在70%以上"],question:"天气预报是怎么做到的？",options:["有人有未卜先知的超能力","一个参加数学建模比赛的同学做的科学预测","纯粹是巧合猜中了"],answer:1,explanation:"这不是超能力，而是一个参加数学建模大赛的同学，用回归分析和概率模型做了一个天气预测系统，恰好这周天气规律，被他算准了！"},{id:"c10",title:"垃圾桶里的密码本",desc:"在垃圾桶发现一本写满密码的笔记本，似乎隐藏着重大秘密",cluesNeeded:4,icon:"📓",clues:["密码破译第一层后是凯撒密码，内容是一串看似杂乱的人名和日期","每个人名都是学校文学社的成员，日期恰好是他们发表作品的日期",'继续破译，发现那些"日期"其实是图书编号',"按编号在图书馆找到对应的书，每本书里都夹着一篇社员的获奖作文"],question:"这本密码本是谁的？",options:["间谍在学校秘密传递情报","文学社社长用密码记录社团的优秀作品","有人在设计密室逃脱游戏"],answer:1,explanation:'文学社社长用密码本记录社团所有获奖作品的位置，这样就算被偷看也不会泄露社团的"宝藏"。这位社长将来肯定是个好侦探！'},{id:"c11",title:"田径场的地下通道",desc:"田径场跑道下方发现了一条不为人知的通道",cluesNeeded:4,icon:"🏃",clues:["通道墙壁上有1950年代的老式电灯开关，还能用","通道尽头是一个干燥的小房间，里面有旧课桌和黑板",'黑板上写着一行字："1968届初三(2)班防空洞纪念"',"翻阅校史，1968年学校确实有过一个地下防空洞项目"],question:"这个地下通道是什么？",options:["坏人的秘密基地","上世纪60年代修建的防空洞","施工队留下的废弃管道"],answer:1,explanation:"这是上世纪60年代全校师生一起挖的防空洞！当时的初三(2)班在这个小房间里上过课，黑板上的字就是他们毕业时留下的纪念。"},{id:"c12",title:"音乐教室的幽灵钢琴",desc:"半夜路过音乐教室的人都说听到了钢琴声，但琴凳上没人",cluesNeeded:4,icon:"🎹",clues:["钢琴是一台带自动演奏功能的电钢琴，型号是Yamaha Clavinova","音乐老师最近请了病假，走之前忘了关掉自动演奏的定时播放功能","定时播放设置的是每天晚上8点，播放的是肖邦的《夜曲》","调查云端的教学记录，音乐老师原计划用这首曲子帮同学们放松心情"],question:"幽灵钢琴的真相是什么？",options:["真的闹鬼了","音乐老师的电钢琴定时播放没关","有人在恶作剧"],answer:1,explanation:"音乐老师本想每天晚自习后给同学们放音乐放松，结果忘记关了，每晚8点自动播放《夜曲》。没有幽灵，只有一位好心的音乐老师！"},{id:"c13",title:"花坛里的神秘植物",desc:"校园花坛里长出了一株从没见过的植物，生长速度快得惊人",cluesNeeded:4,icon:"🌿",clues:["植物叶片形状和普通豆芽相似，但茎干上有一层绒毛","花坛土壤检测出高浓度有机肥料，是市面上买不到的发酵配方","生物社实验记录显示，他们在测试一种新的有机催芽液","催芽液的原料包括咖啡渣、蛋壳粉和糖蜜，按特殊比例发酵一周"],question:"这株神秘植物是怎么来的？",options:["外星植物入侵地球","生物社的实验催芽液让普通豆子疯长","有学生从亚马逊带回来的"],answer:1,explanation:'生物社的同学用自制的咖啡渣催芽液浇灌了一颗普通豆子，结果生长速度惊人！这就是科学的力量——虽然实验记录最后写着"配方需进一步优化"。'},{id:"c14",title:"食堂阿姨的秘密菜单",desc:"食堂阿姨总是在特定时间端出一份谁都没见过的菜",cluesNeeded:4,icon:"🍲",clues:["这道菜只在周二中午和周四下午出现，每次都放在最左边的窗口","菜的味道每周都在微调，甜度、辣度有细微变化",'食堂阿姨的笔记本里夹着一张泛黄的菜谱，上面写着"妈妈的糖醋排骨——实验版"',"阿姨的女儿在外地上大学，最大的遗憾是没教会女儿做这道家传菜"],question:"秘密菜单的真相是什么？",options:["食堂在研究新菜品",'阿姨在用同学们当"试吃员"完善家传菜谱',"这是给老师开的小灶"],answer:1,explanation:"食堂阿姨的女儿最爱吃妈妈做的糖醋排骨，但上大学前没学会。阿姨决定把菜谱标准化，用同学们的反馈来调出最佳配方，好教给远方的女儿。"},{id:"c15",title:"天文台的信号",desc:"学校天文台的设备接收到了一组规律性的无线电信号",cluesNeeded:4,icon:"🔭",clues:["信号的频率是1420MHz，恰好是宇宙中氢原子的特征频率（SETI项目常用频段）","信号每隔7分23秒重复一次，内容是一个递增的数字序列：1, 1, 2, 3, 5, 8, 13...","这个序列是斐波那契数列——地球上最基础的自然数列之一","进一步分析发现，信号源方向正好对着3公里外市电视台的信号塔"],question:"这组信号真的是外星人发的吗？",options:["外星人在联系我们","市电视台在测试新设备时意外产生了干扰信号","同学做的科学恶作剧"],answer:1,explanation:"市电视台新装了数字信号发射器，在测试时意外产生了一个谐波落在1420MHz频段上。斐波那契数列恰好是测试工程师最喜欢的基准测试模式之一！"},{id:"c16",title:"消失的校史",desc:"校史馆中关于建校前20年的记录全部消失了",cluesNeeded:4,icon:"🏛",clues:["校史馆的档案编号有缺失，跳过了D-001到D-020整整20盒","老教师王老师回忆，学校建于1958年，但官方记录从1978年才开始",'1978年之前的资料都盖着"已移交市教育局档案室"的章',"联系教育局确认，这批档案因年代久远，三年前被借去数字化扫描，还没归还"],question:"消失的校史去哪了？",options:["有人故意销毁历史记录","档案被借去数字化扫描还没还回来","那20年根本不存在"],answer:1,explanation:"不是阴谋，是教育局三年前借走做数字化扫描，因为项目排队排到现在还没扫描完。那20年的校史正安静地躺在教育局的档案室里呢！"},{id:"c17",title:"双胞胎的互换日记",desc:"一对双胞胎举报对方的日记被调包，两人都声称自己才是真的",cluesNeeded:4,icon:"📔",clues:["两本日记封面完全相同，都是蓝色硬壳本，购自同一家文具店",'姐姐的日记里频繁出现"数学考试"的焦虑，妹妹的日记则充满了篮球比赛的兴奋',"调包当天正好是期中成绩公布的日子",'后来发现姐姐数学其实考了全班第三，她在日记里写的是"比妹妹考得好"的开心'],question:"日记被调包了吗？",options:["有人恶作剧调换了她们的本子","两人自己拿错了，因为封面一模一样","她们故意换着写的"],answer:1,explanation:'其实根本没被调包！两人买了一模一样的本子，期中那天都太紧张拿错了对方桌上的。姐姐那本"数学焦虑"是之前写的，考得好之后早就换心情了。'},{id:"c18",title:"后山的石碑密码",desc:"后山发现一块刻满古文字的石碑，似乎指向某个隐藏地点",cluesNeeded:5,icon:"🗿",clues:["石碑上的文字经鉴定是小篆体，内容是李白的《静夜思》","每句诗的第一个字被刻意刻得更深：床、疑、举、低","按笔画数转换：床(7画)、疑(14画)、举(9画)、低(7画)——得到一个四位数","这个数字是学校老教学楼一楼的教室编号走廊，7149教室早就不在了","实地探访发现，7149的位置现在是图书馆的一个小隔间，里面藏着一个2000届毕业生的时光胶囊"],question:"石碑密码指向什么？",options:["古代人留下的藏宝图","2000届校友埋下的时光胶囊","有人在设计寻宝游戏"],answer:1,explanation:'2000届毕业生在离校前埋了一个时光胶囊，用石碑密码留给后人这个线索。胶囊里有2000年的校服、饭票、手写同学录，还有一封信写着"希望25年后有人找到它"。'},{id:"c19",title:"机房里的黑客",desc:"学校官网被篡改，首页变成了一张藏宝图",cluesNeeded:5,icon:"💻",clues:["藏宝图标注的地点全是校园里的真实位置：喷泉、梧桐树、老钟楼","网站后台日志显示，篡改来自校内IP，时间是周六下午3点","这不是恶意攻击——原网站内容被完整备份到了/admin/backup目录下",'藏宝图底部有一行小字："信息课课代表和他的朋友们"','按藏宝图的路线走，每个点都藏着一张卡片，集齐拼出："欢迎新生"'],question:'"黑客"是谁？',options:["外网骇客攻击学校","信息课代表用学校官网给新生准备的欢迎惊喜","系统bug导致的错误"],answer:1,explanation:"信息课代表想给即将入学的新生一个特别的欢迎仪式。他完整备份了原网站，然后把首页改成了互动藏宝图——技术好又会设计，学校捡到宝了！"},{id:"c20",title:"游泳馆的水怪",desc:"多名学生声称在游泳馆看到了不明生物",cluesNeeded:5,icon:"🏊",clues:["所有目击报告都发生在周四下午4点到5点之间",'"水怪"被描述为黑色、细长、大约1.5米、在水中快速游动',"游泳馆的排水口滤网最近被拆走了，物业说送去维修","周四下午4点正是游泳队训练时间，队里有一个常年穿黑色长泳裤的队员","该队员擅长蝶泳，游动时双腿并拢打水，从水下看确实像一条黑色带子"],question:"水怪的真相是什么？",options:["真的有不明水生物","游泳队员的黑泳裤+蝶泳动作在远处看像水怪","有人放了条大黑鱼"],answer:1,explanation:"游泳队的蝶泳健将在训练时，他的黑色长泳裤在池底光影折射下，加上蝶泳的波浪式游动，远远看去就像一条游动的水怪！排水口滤网被拆也让池水有些浑浊助长了错觉。"},{id:"c21",title:"美术室的画中人",desc:"美术室一幅人物肖像的表情似乎在每天变化",cluesNeeded:5,icon:"🖼",clues:["画作是一个女生的侧脸，技法上用了渐变的暖色调","每天早上8点到9点，阳光恰好从东窗照进来，落在画的右侧","9点以后阳光消失，画作回到正常状态","不同光照角度下，暖色调中的微妙阴影会产生不同的视觉感受",'美术老师在画作背面贴了张纸条："试试早上看，会有惊喜"'],question:"画中人的表情为什么会变化？",options:["画活了过来","阳光角度变化造成的光影错觉","有人每天偷偷在改画"],answer:1,explanation:"美术老师巧妙地利用了东方窗户的光照。早上8-9点阳光从特定角度照射时，暖色调中的阴影渲染会让嘴角看起来微微上扬——一幅会用光的杰作！"},{id:"c22",title:"宿管阿姨的猫",desc:"宿管阿姨的猫叼回了一只带有血迹的徽章",cluesNeeded:5,icon:"🐈",clues:['徽章是铜质的，上面刻着"SHS 1988"，血迹经检测不是人血','"SHS"是学校英文名的缩写，1988年正是学校建校30周年',"猫咪平时活动的范围在校园后山，那里有一片老旧的教师宿舍区","血迹检测结果是鸡血——后山有退休老教师在院子里养了几只鸡","1988届校友通讯录显示，一位退休的物理老师住在后山，正是那栋养鸡的房子"],question:"徽章和猫的故事是什么？",options:["发生了一起严重案件","猫从退休老教师院子叼走了他珍藏的校庆纪念徽章","徽章是假的，血是番茄酱"],answer:1,explanation:"猫咪溜进退休物理老师家的院子，在鸡窝旁叼走了老师珍藏的1988年校庆纪念徽章。鸡血是碰巧蹭上的。老师还以为徽章弄丢了，难过了好几天。"},{id:"c23",title:"考古社的惊天发现",desc:"考古社在校园角落挖出了一件疑似文物的东西",cluesNeeded:5,icon:"⛏",clues:["出土物品是一个陶罐，表面有简单的几何纹样","经学校历史老师初步判断，纹样风格属于汉代","学校校址在汉代确实是一个小型聚落的边缘地带","送去市博物馆做碳14检测","检测结果：这个陶罐制作于——2003年。底部有极小的模具编号：2003-AT-047。原来是一个现代仿古陶罐"],question:'这个"文物"的真相是什么？',options:["发现了汉代遗址","2003年一个陶艺兴趣班留下的仿古作品","有人故意埋的假文物"],answer:1,explanation:'2003年学校办过一个陶艺兴趣班，老师让同学们模仿汉代风格做陶罐。一个同学做得太逼真，后来被埋在了花坛里做"时间胶囊"。20多年后，考古社挖出来以为是真文物！'},{id:"c24",title:"广播站的加密广播",desc:"午间广播中夹杂着一段加密语音，只有特定设备能解码",cluesNeeded:5,icon:"📢",clues:["加密语音的频谱分析显示，信号被调制在18kHz以上的高频段，人耳听不到",'解码后发现内容是："放学后天台见——x"','广播站设备上贴了一张手写便利贴："勿调18k频段，测试中"','广播站站长最近在捣鼓一个"超声波传信"项目',"超声波通信原理：把声音信号调制到20kHz附近，可以被手机APP解码"],question:"加密广播是什么？",options:["间谍在传递情报","广播站站长在测试超声波通信","设备坏了产生杂音"],answer:1,explanation:'广播站站长是个技术宅，他在测试超声波通信——把人声编码到高频段，只有装有解码APP的同学能听到。那句"天台见"是在约副站长开会。'},{id:"c25",title:"屋顶的无人机",desc:"一架不明无人机每晚准时悬停在教学楼屋顶",cluesNeeded:5,icon:"🛩",clues:["无人机型号是DJI Mini 3，挂载了一台GoPro相机","每晚悬停时间恰好8分钟，然后自动返航","无人机降落在距离学校2公里的一个居民小区阳台上","找到了机主：一个初二男生，他的房间贴满了城市夜景照片",'他每天用无人机拍屋顶落日，准备做一本"城市之巅"摄影集参赛'],question:"无人机为什么每晚悬停在教学楼？",options:["有人在偷拍学校","一个同学用无人机拍摄夕阳城市风光","无人机失控了"],answer:1,explanation:'这位同学发现教学楼屋顶是拍摄城市夕阳的最佳角度，每晚用无人机定点拍摄8分钟。他的摄影集"城市之巅——屋顶看世界"已经入选了市青少年摄影大赛！'},{id:"c26",title:"化学老师的隐退",desc:"最受欢迎的化学老师突然请假，学生们决定找出真相",cluesNeeded:5,icon:"🧪",clues:['请假条上只写了"个人原因"，但办公桌上有一本翻开的《有机合成进阶》','老师的实验日志停在上周五，最后一页写着"样品送到市检科院"',"有同学在市区偶遇化学老师，她背着一个大包走进了科技馆",'科技馆正在布展"小小科学家"展览，展期覆盖整个暑假','科技馆的展讯海报上写着："特别感谢：各参赛学校化学教师团队"'],question:"化学老师为什么请假？",options:["老师生病了","老师去做科技馆青少年化学展的评委和指导","老师辞职了"],answer:1,explanation:'化学老师被请去科技馆做"小小科学家"化学展的指导老师，负责评审和布展指导。她想给大家一个惊喜——因为班上好几个同学的作品入选了！'},{id:"c27",title:"大钟楼的时间谜题",desc:"校园钟楼的指针开始倒着走，每次指向午夜都会有怪事发生",cluesNeeded:5,icon:"🕐",clues:["钟楼的机芯最后一次维护记录是在三周前",'维修师傅在维护日志中写道："顺便加了倒走功能——日常备用测试——下月回来校准"','"怪事"其实是学校在办一个夜间天文观测活动，每次都在午夜开始','天文社的活动海报上写着"钟声敲响时，望远镜对准天空"',"活动完全正常——只是钟倒着走的时间恰好和观星活动的开始时间重合了"],question:"钟楼时间谜题的真相是？",options:["时光倒流了","维修师傅测试倒走功能+天文社午夜观星活动的巧合","有人在搞破坏"],answer:1,explanation:"维修师傅为了测试钟的逆向功能临时设了倒走，还没来得及调回来。天文社恰好在那几晚办午夜观星活动——钟声是他们的开始信号。两件无关的事同时发生创造了都市传说！"},{id:"c28",title:"围墙外的涂鸦艺术家",desc:"围墙上每晚出现新的涂鸦，但监控里看不到任何人",cluesNeeded:5,icon:"🎨",clues:['涂鸦内容每天不同：周一"考试加油"、周二"别迟到"、周三画了一只猫',"所有涂鸦的高度都在2米左右，监控死角恰好在那一段围墙","涂鸦用的颜料是一种特制夜光漆，白天几乎看不见，晚上发光","夜光漆可以在美术用品店买到，记录显示一个月前有人买过5罐","购买人是上一届的毕业生，他考上美术学院后就一直想给母校留点东西"],question:"涂鸦艺术家是谁？",options:["不知名的街头艺术家","考上美术学院的校友在给母校留夜光祝福","调皮的小学生在乱画"],answer:1,explanation:"一位刚考上美术学院的校友，想用自己能做的方式给母校和学弟学妹们留下祝福。他研究好监控死角，用夜光漆在围墙上画了每天的鼓励语——白天低调，晚上发光。"},{id:"c29",title:"食堂的数学密码",desc:"食堂菜单价格里隐藏着一道数学谜题，解开的人可以获得免单",cluesNeeded:5,icon:"🧮",clues:["价格标签上的数字都是质数：鸡腿饭17元、牛肉面13元、炒青菜7元","如果把价格按菜名首字母排序：C7、J17、N13，连起来就是7-17-13",'7、17、13这三个数字恰好是最小的三个"幸运质数对"',"把三个数字相加：7+17+13=37，食堂的收银台编号正是37号","食堂经理说：只有发现这个规律并主动报出来的同学能得到免单"],question:"免单密码是什么？",options:["说出三个质数的和37",'喊"老板免单"',"背诵一串随机数字"],answer:0,explanation:'食堂经理是个数学爱好者，用这个好玩的密码给爱思考的同学发福利。只要告诉收银台"7+17+13=37"，今天的午餐就免单啦！'},{id:"c30",title:"传说中的第七栋楼",desc:"校园地图上标注了六栋教学楼，但所有老生都说还有第七栋",cluesNeeded:6,icon:"🏢",clues:["校园规划图上确实只有6栋教学楼：A到F","但老地图（1958年建校版）上还有一栋标注为G的建筑，后来被划掉了","G楼的位置现在是操场东边的一片小树林","那片小树林里有几块水泥地基的残骸，说明确实建过楼","校史记录：G楼是一座两层的临时板房，1965年建成，2000年拆除，因为它只是过渡建筑","所有在2000年前入学的校友，记忆中都有一栋G楼——它是当年的实验楼"],question:"第七栋楼的真相是什么？",options:["平行世界的大楼","2000年拆除的临时实验楼G楼，只有老校友记得","那个位置从来没建过楼"],answer:1,explanation:"G楼是1965年为缓解教室紧张而建的临时两层实验楼。2000年新实验楼建成后，G楼完成了历史使命被拆除，原址变成了小树林。它不是传说，它只是退休了。"},{id:"c31",title:"生物角的变色龙",desc:"班里生物角养的变色龙，每天早上颜色都不一样",cluesNeeded:3,icon:"🦎",clues:["变色龙旁边的温度计显示，每晚教室的温度都会降到20度以下","变色龙在低温时会自然变成深色，这是它的正常生理反应","值日生每天放学都会把空调定时设到凌晨4点自动关，教室后半夜会变冷"],question:"变色龙为什么每天变色？",options:["它生病了","教室后半夜降温，变色龙的自然反应","有人在晚上偷偷换了一只"],answer:1,explanation:"变色龙在温度低时会变深色来吸收更多热量。教室空调凌晨关掉后温度下降，它自然变色。早上大家进教室开空调后温度回升，它又变回来。"},{id:"c32",title:"自习室的敲击声",desc:"每天晚自习第二节，总能听到有规律的敲击声",cluesNeeded:3,icon:"💢",clues:['声音来自最后一排靠窗的位置，节奏是"哒-哒哒-哒-哒-哒哒"',"那个座位上坐的是一个正在准备编程竞赛的男生","他在桌面上用手指敲的是莫尔斯电码练习——他比赛里要用到"],question:"敲击声是什么？",options:["桌腿松了","同学在练习莫尔斯电码","有人在偷偷发暗号"],answer:1,explanation:'编程竞赛有一项是莫尔斯电码解码，这位同学在利用自习时间练习指法。节奏"哒-哒哒"就是摩斯电码中最基本的点划节奏。'},{id:"c33",title:"食堂菜单预言家",desc:"有人在校园论坛上每周五精准预言下周食堂菜单，从不失手",cluesNeeded:4,icon:"📅",clues:["预言帖总是在周五下午4点发布，比食堂公布时间早3天","食堂经理的电脑没有入侵痕迹，菜单文件也没有外泄","预言帖的语言风格轻松幽默，经常带颜文字和括号吐槽","食堂经理的女儿恰好在这个学校读初三，她的写作风格和预言帖一模一样"],question:"菜单预言家是谁？",options:["食堂经理自己发的","经理女儿偷看了爸爸的菜单草稿提前发出来","有黑客入侵"],answer:1,explanation:'食堂经理在家写菜单时被女儿看到，她觉得提前"剧透"很好玩，就开了个匿名账号每周提前发布。经理其实早就发现了，觉得女儿写得比自己公布的好玩，就装作不知道。'},{id:"c34",title:"更衣室的神秘香水",desc:"体育课后，女生更衣室里总有一股淡淡的茉莉花香",cluesNeeded:3,icon:"🌸",clues:["香味只在每周三和周五的体育课后出现","周三和周五的体育课，田径队和舞蹈队共用更衣室","舞蹈队的一个队员习惯在训练前往手腕上涂茉莉花味的护手霜——是她奶奶送她的生日礼物"],question:"香味从哪来的？",options:["学校放了空气清新剂","舞蹈队队员的茉莉花护手霜","外面飘进来的花香"],answer:1,explanation:"舞蹈队队员用的是奶奶送的茉莉花护手霜，训练前涂在手腕上，体育课换衣服时香味留在更衣室。只有周三和周五有，因为这两天舞蹈队和普通体育课共用更衣室。"},{id:"c35",title:"自动售货机的幽灵",desc:"教学楼自动售货机里的饮料，每天早上都少一瓶",cluesNeeded:3,icon:"🗱",clues:["售货机的交易记录里没有缺失饮料的扣款记录","机器没有撬痕，但投币口下方有一根细小的发卡碎片","管理员翻看监控，发现凌晨5点有一只流浪猫从机器背后的维修口钻了进去——维修口的盖子松了"],question:"饮料是谁拿的？",options:["有学生偷饮料","流浪猫钻进了售货机碰掉了一瓶","管理员自己喝了"],answer:1,explanation:'售货机背后的维修口盖子松了，凌晨时一只流浪猫钻进去取暖，不小心碰掉了一瓶饮料。饮料滚到取物口外面，猫出不来又出不来。每天早上管理员开门放它出去，它已经成了售货机的"深夜租客"。'},{id:"c36",title:"旗杆上的风筝",desc:"周一早上升旗时，发现旗杆顶上挂着一只红色风筝",cluesNeeded:3,icon:"🪁",clues:['风筝线上系着一张纸条，写着"对不起，我不是故意的——小风"',"上周日有校外人员来学校操场放风筝，保安有登记记录",'"小风"是一个8岁小男孩的昵称，他爸爸是学校的体育老师，周日带他来学校玩'],question:"风筝是谁的？",options:["不知谁恶作剧","体育老师的儿子放风筝时不慎挂上去的","风筝自己飞上去的"],answer:1,explanation:'体育老师周日带儿子来学校操场玩，儿子放风筝时线断了，风筝挂到了旗杆顶上。小家伙吓坏了，写了道歉纸条系在风筝线上，希望"升旗的叔叔"能看到。'},{id:"c37",title:"计算机教室的入侵者",desc:"计算机教室的鼠标和键盘每周都被重新排列过",cluesNeeded:4,icon:"🖥",clues:["所有设备被摆放成完全对称的格局，每排每列间距精确到毫米","监控显示每周四晚上8点有人进入计算机教室","进入的人穿着校服，走路的姿势一板一眼，进出都会把门把手擦干净","这个学生是计算机课代表，但他有轻微的强迫症——每次上完课看到设备不整齐就难受"],question:"谁在排列设备？",options:["清洁工不小心弄乱的","有强迫症的计算机课代表每周四来整理","恶作剧学生"],answer:1,explanation:'课代表有轻微的整理强迫症，看到设备不整齐就睡不好。他用计算机教室的钥匙每周四晚自习后来摆正所有设备，擦干净门把手。老师后来给他配了把新钥匙，专门表扬他"责任心强"。'},{id:"c38",title:"体育器材室的深夜灯光",desc:"保安巡逻时发现体育器材室凌晨还亮着灯，但门锁着",cluesNeeded:3,icon:"💡",clues:["器材室的管理员说每晚都关了灯才走","灯的开关附近有一个篮球架，篮球滚落时偶尔会碰到开关","器材室里有几只老鼠，每天夜里在篮球架上跑动，恰好会碰开灯"],question:"灯为什么会亮？",options:["管理员忘记关灯","老鼠在篮球架上跑动碰到了开关","有人在里面"],answer:1,explanation:"器材室的老鼠每天夜里在篮球架上跑动，篮球晃动碰到墙壁上的灯开关。这个开关位置装得比较低，刚好在篮球滚动轨迹的末端。管理员后来把开关加了个防护罩就解决了。"},{id:"c39",title:"值周生的秘密",desc:"每周五的值周总结本上，总会出现一行陌生的字迹",cluesNeeded:4,icon:"📓",clues:["字迹用铅笔写的，笔画圆润，和全班同学的字迹都对不上",'内容每次都是鼓励的话，比如"今天大家都表现很好"、"走廊很干净"',"这行字总是出现在值周生写完总结离开之后","班主任承认是她写的——她每次等大家都走了，回教室悄悄加一行鼓励"],question:"神秘字迹是谁的？",options:["隔壁班的恶作剧","班主任等大家走后悄悄加的鼓励","有同学偷偷回来写的"],answer:1,explanation:"班主任觉得值周总结太冷冰冰了，每次等值周生写完离开后回教室，用铅笔加一句暖心的鼓励。她故意用铅笔而不是红笔，就是不想让学生发现是老师写的。"},{id:"c40",title:"丢失的班费",desc:"收齐的班费在班长课桌里放了一晚后不翼而飞",cluesNeeded:4,icon:"💰",clues:["班长发誓把钱锁在了课桌里，但第二天早上锁是开着的","课桌的锁完好无损，说明是用钥匙打开的","班长的课桌钥匙只有两把——他自己一把，班主任保管备用钥匙","班主任前一天晚上接到教务处紧急通知，来教室取了班费去交——忘了告诉班长"],question:"班费去哪了？",options:["有小偷偷走了","班主任用备用钥匙取走去交费了，忘了通知班长","班长自己弄丢了"],answer:1,explanation:"教务处临时通知提前交费，班主任用备用钥匙取了班费去交，想着第二天告诉班长。结果第二天一早班长就发现钱没了，全班炸锅，班主任才一拍脑门想起来。"},{id:"c41",title:"图书馆的乱架书",desc:"图书馆的小说区每天都被翻得乱七八糟，但借阅记录里没人借过",cluesNeeded:3,icon:"📚",clues:["被翻乱的都是同一排书架——东野圭吾和阿加莎·克里斯蒂的全部作品","书没有被偷，只是顺序被打乱，有的还夹着饼干屑","图书馆管理员调取监控发现，每天午休时间一只橘猫从窗户溜进来，跳上书架睡觉——它恰好最喜欢悬疑小说区的位置"],question:"谁弄乱了书架？",options:["学生偷偷看了没借","橘猫每天来悬疑小说区睡午觉","管理员整理不够勤快"],answer:1,explanation:"图书馆的橘猫每天都从窗户进来，跳到最暖和的小说区书架上睡午觉。翻来翻去找舒服位置时把书弄乱了。饼干屑是它从食堂顺来的零食。这只猫还是个悬疑小说爱好者——至少它选的区域品味不错。"},{id:"c42",title:"自行车棚的连锁反应",desc:"放学时发现一排骨牌效应——12辆自行车全部倒了",cluesNeeded:3,icon:"🚲",clues:["倒下的顺序是从最东边开始，一辆接一辆向西倒","最东边那辆车的车筐里有一个篮球","篮球的主人上体育课时把球随手放在车筐里，风吹动篮球滚出来撞倒了第一辆车"],question:"自行车为什么全倒了？",options:["有人故意推倒的","篮球从车筐滚落撞倒第一辆，引发连锁反应","大风刮倒的"],answer:1,explanation:"最东边车筐里的篮球被风吹落，滚出来撞倒了旁边的车。这辆车倒了又撞倒下一辆，就像多米诺骨牌一样12辆车全倒了。物理课刚学完力学，这简直是活教材。"},{id:"c43",title:"花名册上的幽灵学生",desc:"教务系统的花名册上多了一个不存在的学生",cluesNeeded:4,icon:"👥",clues:['这个"学生"的名字叫"张新来"，学号是空的，所有科目都没有成绩','"张新来"只在系统里存在了三天就被删除了',"教务处说那三天正好在测试新教务系统的数据导入功能",'"张新来"是技术员随手打的测试数据——他的真名叫张新来，是软件开发公司的程序员'],question:"幽灵学生是怎么回事？",options:["系统bug","软件公司的程序员用自己名字做了测试数据","真有这个学生但转学了"],answer:1,explanation:'新教务系统上线前需要测试数据导入功能，程序员随手打了自己的名字"张新来"作为测试数据。测试完成后忘记清理，三天后才被教务老师发现并删除。程序员本人听说后笑了半天。'},{id:"c44",title:"课桌里的时间胶囊",desc:"一张旧课桌抽屉底部发现了一个密封的铁盒",cluesNeeded:4,icon:"📦",clues:['铁盒上刻着"2019届初三(5)班 十年后打开"','铁盒里有一封手写信、一张全班合影和一张2029年的"未来预测表"','预测表上写着："2029年我们班肯定有人当上了医生"——正好对应今年毕业的医学院学生名单',"照片里站在最后一排的男生，现在刚好回母校当实习老师"],question:"铁盒的意义是什么？",options:["有人恶作剧放的","2019届学生埋的时间胶囊，约定十年后回来打开","不小心掉进去的旧物"],answer:1,explanation:"2019届初三(5)班在毕业前埋了一个时间胶囊，约定2029年回母校一起打开。今年正好是2029年！当年的实习老师就是照片里的学生，他回来履行这个约定。"},{id:"c45",title:"操场上的粉笔线",desc:"每个周一早上，操场上都有一条新的彩色粉笔线",cluesNeeded:3,icon:"🏃",clues:["粉笔线从教学楼门口画到操场，拐了好几个弯","每个拐弯处都画了一个箭头和一个科目的图标：数学、语文、英语...",'体育老师承认是他画的——他用这种方式给初一新生做"校园定向越野"，让他们在找路中熟悉校园'],question:"粉笔线是谁画的？",options:["学生在恶作剧","体育老师设计的新生定向越野路线","施工队留下的标记"],answer:1,explanation:"体育老师设计了趣味定向越野，用粉笔线引导初一新生跑遍校园的每个角落。每个箭头标记了不同学科相关的校园地点——数学对应图书馆，英语对应语音教室，比发地图有意思多了。"},{id:"c46",title:"鼓号队的失踪乐器",desc:"鼓号队排练前发现小号少了一把",cluesNeeded:3,icon:"🎺",clues:["乐器室的锁是好的，其他乐器一件不少",'小号手李明上周说自己那把号"声音不对"，想换一把',"后来发现李明的小号在音乐老师办公室里——老师帮李明拿去清洗和调音了，忘了告诉他"],question:"小号去哪了？",options:["有人偷了","音乐老师拿去清洗调音忘了告诉学生","李明自己藏起来了"],answer:1,explanation:'李明跟音乐老师反映号声不对，老师就把小号拿回办公室清洗调音。忙起来忘了跟李明说，第二天排练时大家都在找"失踪"的小号。'},{id:"c47",title:"饮水机旁的排队之谜",desc:"总有同学在饮水机旁排队，但走近看水是满的",cluesNeeded:3,icon:"💧",clues:["排队的人手里都拿着空杯子，但就是不接水","排队的人都往饮水机上方的布告栏看，上面贴着一张手绘漫画","漫画是美术课代表每周更新的校园搞笑四格，饮水机旁恰好是唯一能看清的角度"],question:"为什么排队不接水？",options:["饮水机坏了","大家在看布告栏上的漫画，假装排队","在等热水烧开"],answer:1,explanation:'美术课代表在布告栏上每周更新四格漫画，成了全班追更的"连载"。大家课间假装来接水，其实是来看最新一期漫画。饮水机旁因此成了学校最受欢迎的"休闲区"。'},{id:"c48",title:"荣誉墙上的陌生面孔",desc:"学校荣誉墙上多了一张谁都不认识的照片",cluesNeeded:4,icon:"🏆",clues:['照片里是一个戴眼镜的老先生，下面的名牌写的是"终身荣誉教师"',"全校老师都不认识这个人，教务系统里也查不到",'照片的相框背后贴着一张纸条："王建国老师，1978-2018，四十年如一日"',"校长看了照片沉默了很久——王建国是学校第一任数学教研组长，去年退休回老家了，学生偷偷把他的照片挂上去的"],question:"陌生面孔是谁？",options:["贴错了照片","退休的老教师，学生偷偷挂上去致敬的","校外人士误入的"],answer:1,explanation:"王建国老师在学校教了四十年数学，去年默默退休回了老家。他的往届学生们觉得学校欠王老师一个正式的荣誉，就偷偷印了照片做了名牌挂上了荣誉墙。校长发现后没有拿下来，而是加了个正式的荣誉框。"},{id:"c49",title:"操场上空的孔明灯",desc:"连续三晚有人在操场放孔明灯，每个灯上都写着不同的愿望",cluesNeeded:5,icon:"🏮",clues:['第一个灯写："希望数学及格"——笔迹歪歪扭扭','第二个灯写："希望妈妈的病快点好"——笔迹很工整','第三个灯写："希望我们都考上理想的高中"——三种不同笔迹',"三个灯都是在晚上9点放的，正好是晚自习放学后十分钟","三个放灯的同学分别来自初三的三个不同班级，他们约好一起放灯祈福，每人写了一个愿望"],question:"孔明灯是谁放的？",options:["校外人员","三个初三学生约好一起放灯为中考祈福","学校组织的活动"],answer:1,explanation:"三个即将面临中考的初三学生，晚自习后约在操场放孔明灯。虽然来自不同班级，但都有一个共同的心愿——考上理想的学校。第三个灯上的三种笔迹就是他们三个人各自的愿望。"},{id:"c50",title:"毕业季的最后一案",desc:"初三毕业生离校后，每个空教室的黑板上都有一段话",cluesNeeded:6,icon:"🎓",clues:["每段话的结尾都画了一个小侦探的简笔画——和本应用 Logo 一模一样",'第一个教室写："三年前我第一次走进这里，现在我要走了"','第二个教室写："谢谢食堂阿姨每次给我多打一勺菜"','第三个教室写："谢谢保安大叔每天在校门口跟我打招呼"','第四个教室写："谢谢保洁阿姨把教室擦得比我家还干净"','第五个教室写："谢谢所有老师，你们是我们遇到过最好的侦探导师"'],question:"黑板上这段话是谁写的？",options:["老师写的送别信","毕业班学生留给母校的感谢信","清洁工写的工作日志"],answer:1,explanation:"毕业班的学生们离校前，在每个教室的黑板上给学校写了一封情书。他们用了本应用的侦探主题——因为在过去三年里，他们就像侦探一样，在这所学校里探索知识、发现世界、找到自己。这不是案子，这是一封写给青春的情书。"}],Cs=.4;function fe(e){return at[e]||null}function It(){return at.length}async function qe(){const e=await E("active_case");if(!e){const n=at[0],s={caseIndex:0,caseId:n.id,caseTitle:n.title,cluesCollected:0,cluesNeeded:n.cluesNeeded,collectedClueIndices:[],readyForDeduction:!1};return await q("active_case",s),s}if(e.readyForDeduction===void 0||(!e.collectedClueIndices||e.collectedClueIndices.length===0)&&e.cluesCollected>0){const n=fe(e.caseIndex),s=n&&n.clues?n.clues.length:e.cluesNeeded||0;if(e.cluesCollected>=e.cluesNeeded&&s>0){const a=Math.min(e.cluesCollected,s);e.collectedClueIndices=Array.from({length:a},(i,o)=>o),e.cluesCollected=a,e.readyForDeduction=!0}else e.collectedClueIndices=[],e.readyForDeduction=!1;await q("active_case",e)}return e}async function Le(){return await E("solved_cases")||[]}async function Ss(){const e=await qe();if(e.readyForDeduction)return{dropped:!1};if(Math.random()>Cs)return{dropped:!1};const t=fe(e.caseIndex);if(!t||!t.clues)return{dropped:!1};const n=[];for(let l=0;l<t.clues.length;l++)e.collectedClueIndices.includes(l)||n.push(l);if(n.length===0)return{dropped:!1};const s=n[Math.floor(Math.random()*n.length)],a=[...e.collectedClueIndices,s],i=a.length,o=i>=e.cluesNeeded,v={...e,cluesCollected:i,collectedClueIndices:a,readyForDeduction:o};return await q("active_case",v),{dropped:!0,clueCount:i,clueNeeded:e.cluesNeeded,clueText:t.clues[s],readyForDeduction:o,caseTitle:e.caseTitle,caseIcon:t.icon||"🔍"}}async function Ts(e){const t=await qe(),n=fe(t.caseIndex);return n?e===n.answer?(await Ds(t),{correct:!0,explanation:n.explanation,caseTitle:n.caseTitle}):{correct:!1}:{correct:!1,error:"案件数据丢失"}}async function As(){const e=await qe();if(!e.readyForDeduction)return null;const t=fe(e.caseIndex);if(!t)return null;const n=e.collectedClueIndices.sort((s,a)=>s-a).map(s=>t.clues[s]).filter(Boolean);return{caseData:t,collectedClueTexts:n}}async function Ds(e){const t=await Le();t.push({caseId:e.caseId,caseTitle:e.caseTitle,solvedAt:new Date().toISOString()}),await q("solved_cases",t);const n=e.caseIndex+1,s=fe(n);s?await q("active_case",{caseIndex:n,caseId:s.id,caseTitle:s.title,cluesCollected:0,cluesNeeded:s.cluesNeeded,collectedClueIndices:[],readyForDeduction:!1}):await q("active_case",{...e,caseIndex:n,allSolved:!0,readyForDeduction:!1}),await _s(e.caseTitle)}async function _s(e){const n={solved:(await E("case_closed")||{solved:0}).solved+1,total:It(),lastSolved:e,timestamp:Date.now()};return await q("case_closed",n),n}async function it(){const e=await qe(),t=await Le(),n=e.allSolved||!1,s=n?null:fe(e.caseIndex)||null;return{activeCase:s?{...s,cluesCollected:e.cluesCollected,progress:e.cluesCollected/e.cluesNeeded,readyForDeduction:e.readyForDeduction||!1}:null,solvedCount:t.length,totalCases:It(),allSolved:n}}let Ue=null;function _(e,t="info",n=2500){const s=document.querySelector(".toast-container");s&&s.remove(),Ue&&clearTimeout(Ue);const a=document.createElement("div");a.className="toast-container";const i={success:"&#x2705;",error:"&#x274C;",info:"&#x2139;",warning:"&#x26A0;",star:"&#x2B50;"},o=i[t]||i.info;a.innerHTML=`
    <div class="toast toast-${t}">
      <span class="toast-icon">${o}</span>
      <span class="toast-msg">${h(e)}</span>
    </div>
  `,document.body.appendChild(a),requestAnimationFrame(()=>{a.querySelector(".toast").classList.add("toast-in")}),Ue=setTimeout(()=>{const v=a.querySelector(".toast");v&&(v.classList.remove("toast-in"),v.classList.add("toast-out"),setTimeout(()=>a.remove(),300))},n)}function ct(e){_(`&#x2B50; +${e} 颗星星！`,"star",2e3)}function me({title:e,content:t,buttons:n=[],onClose:s,className:a=""}){const i=document.querySelector(".modal-overlay");i&&i.remove();const o=document.createElement("div");o.className="modal-overlay";const v=n.map((l,c)=>`<button class="btn ${l.cls||(c===0?"btn-secondary":"btn-primary")}" data-btn-index="${c}">${h(l.text)}</button>`).join("");return o.innerHTML=`
    <div class="modal-container ${a}">
      ${e?`<div class="modal-header">${h(e)}</div>`:""}
      <div class="modal-body">${typeof t=="string"?t:""}</div>
      ${n.length>0?`<div class="modal-footer">${v}</div>`:""}
    </div>
  `,typeof t=="object"&&t.nodeType&&o.querySelector(".modal-body").appendChild(t),o.addEventListener("click",l=>{l.target===o&&ze(o,s);const c=l.target.closest("[data-btn-index]");if(c){const r=parseInt(c.dataset.btnIndex),d=n[r];d&&d.onClick?d.onClick()!==!1&&ze(o,s):ze(o,s)}}),document.body.appendChild(o),requestAnimationFrame(()=>{o.classList.add("modal-in");const l=o.querySelector(".modal-container");l&&l.classList.add("modal-container-in")}),o}function ze(e,t){e.classList.remove("modal-in");const n=e.querySelector(".modal-container");n&&n.classList.remove("modal-container-in"),setTimeout(()=>{e.remove(),t&&t()},250)}function Ht(e,t,n="确认",s="取消"){return new Promise(a=>{me({title:e,content:`<p style="text-align:center;margin:16px 0;">${h(t)}</p>`,buttons:[{text:s,cls:"btn-secondary",onClick:()=>a(!1)},{text:n,cls:"btn-primary",onClick:()=>a(!0)}]})})}function Pt(e,t="A"){const n={common:"#94A3B8",rare:"#3B82F6",epic:"#8B5CF6",legendary:"#F59E0B"},s={common:"linear-gradient(135deg, #e2e8f0, #cbd5e1)",rare:"linear-gradient(135deg, #bfdbfe, #93c5fd)",epic:"linear-gradient(135deg, #ddd6fe, #c4b5fd)",legendary:"linear-gradient(135deg, #fef3c7, #fcd34d)"},a=n[e.rarity]||"#94A3B8",i=s[e.rarity]||s.common,o=t==="B"?"关键证据":"日常证物";return new Promise(v=>{me({title:`&#x1F50E; 发现${o}！`,className:"blindbox-modal",content:`
        <div class="blindbox-reveal" style="background:${i};border:2px solid ${a};">
          <div class="blindbox-reveal-icon">${e.icon}</div>
          <div class="blindbox-reveal-title" style="color:${a};">${h(e.title)}</div>
          <div class="blindbox-reveal-desc">${h(e.desc)}</div>
          <div class="blindbox-reveal-rarity" style="background:${a};">
            ${e.rarity==="legendary"?"&#x1F451; 传说":e.rarity==="epic"?"&#x1F48E; 史诗":e.rarity==="rare"?"&#x2728; 稀有":"普通"}
          </div>
        </div>
      `,buttons:[{text:"收入证物袋！",cls:"btn-primary",onClick:()=>v(!0)}]})})}function js(e){me({title:"&#x1F3C6; 成就解锁！",className:"achievement-modal",content:`
      <div class="achievement-reveal">
        <div class="achievement-reveal-icon">${e.icon}</div>
        <div class="achievement-reveal-title">${h(e.title)}</div>
        <div class="achievement-reveal-desc">${h(e.desc)}</div>
      </div>
    `,buttons:[{text:"继续探索",cls:"btn-primary"}]})}function ot(e,t,n=300){if(e)return e.animate(t,{duration:n,easing:"cubic-bezier(0.4, 0, 0.2, 1)",fill:"forwards"})}function Ls(e){return ot(e,[{transform:"scale(0.3)",opacity:0},{transform:"scale(1.05)",opacity:.8,offset:.5},{transform:"scale(0.95)",opacity:.9,offset:.7},{transform:"scale(1)",opacity:1}],400)}function Ns(e){return ot(e,[{transform:"translateX(0)"},{transform:"translateX(-6px)",offset:.2},{transform:"translateX(6px)",offset:.4},{transform:"translateX(-4px)",offset:.6},{transform:"translateX(4px)",offset:.8},{transform:"translateX(0)"}],400)}function h(e){if(!e)return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}function M(e,t=document){return t.querySelector(e)}function Ge(e,t=document){return Array.from(t.querySelectorAll(e))}function u(e,t={},...n){const s=document.createElement(e);for(const[a,i]of Object.entries(t))a==="className"?s.className=i:a==="innerHTML"?s.innerHTML=i:a==="textContent"?s.textContent=i:a.startsWith("on")?s.addEventListener(a.slice(2).toLowerCase(),i):a==="style"&&typeof i=="object"?Object.assign(s.style,i):s.setAttribute(a,i);for(const a of n)typeof a=="string"?s.appendChild(document.createTextNode(a)):a&&a.nodeType&&s.appendChild(a);return s}function Es(e){if(e)for(;e.firstChild;)e.removeChild(e.firstChild)}function Me(e){e&&(e.innerHTML=`
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">调查中...</p>
    </div>
  `)}function Be(e,t,n){if(e&&(e.innerHTML=`
    <div class="error-container">
      <div class="error-icon">&#x1F50D;</div>
      <p class="error-text">${h(t)}</p>
      ${n?'<button class="btn btn-primary retry-btn">重新加载</button>':""}
    </div>
  `,n)){const s=e.querySelector(".retry-btn");s&&s.addEventListener("click",n)}}function qs(e,t,n=1){const s=[];for(let a=0;a<n;a++){const i=document.createElement("div");i.className="star-fly",i.textContent="⭐",i.style.cssText=`
      position: fixed;
      left: ${e+(Math.random()-.5)*30}px;
      top: ${t}px;
      font-size: ${18+Math.random()*8}px;
      pointer-events: none;
      z-index: 2000;
      animation: starFlyUp 1s ease-out forwards;
    `,document.body.appendChild(i),s.push(i),setTimeout(()=>i.remove(),1e3)}return s}function Ms(){const e=document.createElement("div");e.className="case-closed-overlay",e.innerHTML=`
    <div class="case-closed-stamp">
      <div class="stamp-inner">
        <div class="stamp-label">CASE</div>
        <div class="stamp-label">CLOSED</div>
        <div class="stamp-badge">&#x1F36C; 结案</div>
      </div>
    </div>
  `,document.body.appendChild(e),setTimeout(()=>{e.classList.add("fade-out"),setTimeout(()=>e.remove(),500)},1800)}function Bs(e){document.body.classList.remove("streak-fire","streak-gold","streak-star"),e>=21?document.body.classList.add("streak-star"):e>=14?document.body.classList.add("streak-gold"):e>=7&&document.body.classList.add("streak-fire")}function Ot(e,t="暂无数据"){e&&(e.innerHTML=`
    <div class="empty-container">
      <div class="empty-icon">&#x1F9D0;</div>
      <p class="empty-text">${h(t)}</p>
    </div>
  `)}let H=W(),$e=null;function Is(e,t){if(!e)return;$e=t,e.innerHTML=`
    <div class="date-nav">
      <button class="date-nav-btn date-nav-prev" title="前一天">&larr;</button>
      <div class="date-nav-display">
        <span class="date-nav-text">${oe(H)}</span>
        <span class="date-nav-badges"></span>
      </div>
      <button class="date-nav-btn date-nav-today" title="回到今天">&#x1F4C5;</button>
      <button class="date-nav-btn date-nav-next" title="后一天">&rarr;</button>
    </div>
  `;const n=e.querySelector(".date-nav-prev"),s=e.querySelector(".date-nav-next"),a=e.querySelector(".date-nav-today");n&&n.addEventListener("click",()=>gt(-1)),s&&s.addEventListener("click",()=>gt(1)),a&&a.addEventListener("click",()=>Hs()),rt(e),dt(e)}function gt(e){let t=ce(H,e);if(t<O.startDate&&(t=O.startDate),t>W()&&(t=W()),t===H)return;H=t;const n=document.querySelector("#dateNav");n&&(rt(n),dt(n)),$e&&$e(H)}function Hs(){const e=W();if(H===e)return;H=e;const t=document.querySelector("#dateNav");t&&(rt(t),dt(t)),$e&&$e(H)}function rt(e){if(!e)return;const t=e.querySelector(".date-nav-text"),n=e.querySelector(".date-nav-prev"),s=e.querySelector(".date-nav-next");if(t){const a=H===W();t.innerHTML=`${oe(H)}${a?' <span class="today-badge">今天</span>':""}`}n&&(n.disabled=H<=O.startDate),s&&(s.disabled=H>=W())}async function dt(e){if(!e)return;const t=e.querySelector(".date-nav-badges");if(t)try{const s=(await pe()).todayProgress.filter(l=>l.date===H),a=I(H),i=Q(H),o=V(H);let v="";if(a&&(v+='<span class="date-badge badge-rest">休息日</span>'),i&&(v+='<span class="date-badge badge-travel">旅行中</span>'),o||(v+='<span class="date-badge badge-future">未开始</span>'),s.length>0){const l=s.reduce((c,r)=>c+r.stars,0);v+=`<span class="date-badge badge-stars">&#x2B50; ${l}</span>`,v+=`<span class="date-badge badge-count">${s.length}项</span>`}t.innerHTML=v}catch{t.innerHTML=""}}async function ie(e){if(e)try{const t=await pe(),n=await Bt(),s=await it();let a="";if(s.allSolved)a=`
        <div class="mystery-bar mystery-all-solved">
          <span class="mystery-bar-icon">&#x1F3C6;</span>
          <span class="mystery-bar-text">全部 ${s.totalCases} 起案件已侦破！传奇侦探！</span>
        </div>`;else if(s.activeCase){const i=s.activeCase,o=Math.round(i.progress*100);a=`
        <div class="mystery-bar">
          <span class="mystery-bar-icon">${i.icon}</span>
          <div class="mystery-bar-info">
            <div class="mystery-bar-title">${h(i.title)}</div>
            <div class="mystery-bar-track">
              <div class="mystery-bar-fill" style="width:${o}%;"></div>
            </div>
            <div class="mystery-bar-hint">线索 ${i.cluesCollected}/${i.cluesNeeded} · 已破 ${s.solvedCount}/${s.totalCases} 案</div>
          </div>
        </div>`}e.innerHTML=`
      <div class="header-stats">
        <div class="stat-card stat-rank" style="border-color:${n.color};">
          <div class="stat-rank-icon">${n.icon}</div>
          <div class="stat-rank-info">
            <div class="stat-rank-title" style="color:${n.color};">${h(n.title)}</div>
            ${n.nextTitle?`
              <div class="stat-rank-progress">
                <div class="stat-rank-bar">
                  <div class="stat-rank-bar-fill" style="width:${(n.progress||0)*100}%;background:${n.color};"></div>
                </div>
                <span class="stat-rank-next">下一级: ${n.nextTitle}</span>
              </div>
            `:'<div class="stat-rank-max">最高等级</div>'}
          </div>
        </div>
        ${a}
        <div class="stat-card stat-streak">
          <div class="stat-value">${t.streak}</div>
          <div class="stat-label">连续打卡</div>
        </div>
        <div class="stat-card stat-stars">
          <div class="stat-value">${t.totalStars}</div>
          <div class="stat-label">累计星星</div>
        </div>
        <div class="stat-card stat-days">
          <div class="stat-value">${t.activeDays}</div>
          <div class="stat-label">活跃天数</div>
        </div>
      </div>
    `}catch(t){console.error("renderHeaderStats failed:",t),e.innerHTML='<div class="header-stats-error">统计加载失败</div>'}}function Wt(){return H}const Ps=[{id:"a01",icon:"🔍",title:"放大镜",desc:"经典侦探工具，帮你发现隐藏的线索",rarity:"common"},{id:"a02",icon:"📇",title:"便签本",desc:"记录关键信息的侦探便签",rarity:"common"},{id:"a03",icon:"📷",title:"取证相机",desc:"拍下现场照片，定格关键瞬间",rarity:"common"},{id:"a04",icon:"✍",title:"铅笔头",desc:"每位侦探都有一支最顺手的铅笔",rarity:"common"},{id:"a05",icon:"🧪",title:"证物袋",desc:"收集并保存现场证物的专用袋",rarity:"common"},{id:"a06",icon:"📏",title:"比例尺",desc:"精确测量线索，不放过任何细节",rarity:"common"},{id:"a07",icon:"📎",title:"图钉",desc:"把线索钉在软木板上，串联推理",rarity:"common"},{id:"a08",icon:"🧲",title:"磁铁",desc:"在灰烬中寻找金属微粒的好帮手",rarity:"common"},{id:"a09",icon:"📥",title:"档案袋",desc:"整理案件资料的牛皮纸档案袋",rarity:"common"},{id:"a10",icon:"📋",title:"线索板",desc:"把所有线索钉在板上，拼出真相",rarity:"rare"},{id:"a11",icon:"🧪",title:"指纹粉",desc:"撒上粉末，隐藏的指纹立刻显现",rarity:"rare"},{id:"a12",icon:"📠",title:"对讲机",desc:"与搭档保持联络的便携对讲机",rarity:"rare"},{id:"a13",icon:"🔬",title:"显微镜",desc:"观察微观证据，发现肉眼看不到的真相",rarity:"rare"},{id:"a14",icon:"📜",title:"旧报纸",desc:"泛黄的报纸里藏着尘封的往事",rarity:"rare"},{id:"a15",icon:"🧭",title:"指南针",desc:"在迷雾中不迷失方向",rarity:"rare"},{id:"a16",icon:"🔑",title:"万能钥匙",desc:"打开所有上锁的房间，但记得先敲门",rarity:"epic"},{id:"a17",icon:"🧳",title:"密码本",desc:"破译加密信息的专属密码本",rarity:"epic"},{id:"a18",icon:"🎷",title:"侦探口琴",desc:"布鲁斯口琴，每个名侦探都有自己的BGM",rarity:"epic"}],Os=[{id:"b01",icon:"💿",title:"监控录像",desc:"案发当晚的监控画面，画面中有一个背影",rarity:"common"},{id:"b02",icon:"📨",title:"神秘信件",desc:'没有署名，信纸上只有一行字："明天下午三点"',rarity:"common"},{id:"b03",icon:"☕",title:"半杯咖啡",desc:"还温热的咖啡，嫌疑人刚刚离开不久",rarity:"common"},{id:"b04",icon:"👟",title:"泥泞的鞋印",desc:"43码运动鞋，鞋底有独特的菱形花纹",rarity:"common"},{id:"b05",icon:"📱",title:"未接来电",desc:"通话记录显示凌晨2:15有一个陌生号码来电",rarity:"common"},{id:"b06",icon:"📄",title:"半张纸条",desc:'被撕掉一半的纸条，剩余部分写着："...藏在钟楼..."',rarity:"common"},{id:"b07",icon:"🎲",title:"一枚骰子",desc:"特制骰子，六个面都是同样的点数",rarity:"common"},{id:"b08",icon:"🧤",title:"断裂的钥匙",desc:"青铜材质，断口处有撬动的痕迹",rarity:"common"},{id:"b09",icon:"💍",title:"吊坠项链",desc:"银质吊坠，内侧刻着两个字母",rarity:"common"},{id:"b10",icon:"📰",title:"剪报",desc:"三年前的新闻剪报，报道了一起未破的盗窃案",rarity:"rare"},{id:"b11",icon:"🎤",title:"录音带",desc:"老式磁带，播放后有30秒的奇怪录音",rarity:"rare"},{id:"b12",icon:"💰",title:"外国纸币",desc:"一张不在市面流通的外币，序列号被红笔圈出",rarity:"rare"},{id:"b13",icon:"🧮",title:"数字密码",desc:'一张写着"8-15-23"的便条，是什么意思？',rarity:"rare"},{id:"b14",icon:"🏞",title:"老照片",desc:"褪色照片中的建筑，似乎就在学校附近",rarity:"rare"},{id:"b15",icon:"🏹",title:"监控照片",desc:"抓拍到一辆未挂车牌的黑色轿车",rarity:"rare"},{id:"b16",icon:"📦",title:"匿名包裹",desc:"快递盒里只有一个U盘和一封打印的信",rarity:"epic"},{id:"b17",icon:"📔",title:"嫌疑人日记",desc:"日记中记录了连续一周的异常行踪",rarity:"epic"},{id:"b18",icon:"🏆",title:"决定性证据",desc:"铁证如山！这个证据足以让案件水落石出",rarity:"legendary"}],wt=[{id:"dc01",icon:"🔎",title:"观察力试炼",desc:"留意今天身边3个不同的细节，像侦探一样观察世界"},{id:"dc02",icon:"🧠",title:"推理力试炼",desc:'对今天学到的一个知识点，问三个"为什么"'},{id:"dc03",icon:"💪",title:"毅力试炼",desc:"坚持完成今天的所有任务，不半途而废"},{id:"dc04",icon:"📝",title:"记忆力试炼",desc:"睡前回忆今天解锁的3个新知识，默记于心"},{id:"dc05",icon:"💬",title:"沟通力试炼",desc:"向家人讲述一个你今天学到的有趣知识"},{id:"dc06",icon:"🧩",title:"解谜试炼",desc:"尝试解开一个谜题：数独、字谜或数学题都可以"}],kt=[{id:"ec01",text:"真相往往藏在最不起眼的细节里，保持你的观察力。",icon:"🔍"},{id:"ec02",text:"每个名侦探都是从第一个案子起步的，你做得很好。",icon:"💪"},{id:"ec03",text:"排除所有不可能，剩下的即使再不可思议，那也是真相。",icon:"💡"},{id:"ec04",text:"线索不会自己上门，需要你用每一天的坚持去寻找。",icon:"🔎"},{id:"ec05",text:'华生说："你每天都有新的进步。"福尔摩斯点了点头。',icon:"🧐"},{id:"ec06",text:"今天的努力，是明天破案时最锋利的武器。",icon:"⚔"},{id:"ec07",text:'侦探从不说"放弃"，他们说"换个角度"。',icon:"🔄"},{id:"ec08",text:"世界上最厉害的侦探，是那个从不停止学习的人。",icon:"🌍"}],Xe=["🔍 细节之中，藏着世界的秘密。","💡 好奇心是侦探的第一把钥匙。","💪 今天的坚持，是明天的超能力。","🌟 你不是在完成任务，你是在收集改变自己的力量。","🧐 真正的侦探不是最聪明的，而是最专注的。","🔥 点燃你的热情，比点燃一支蜡烛更有用。","📚 书页之间，藏着你还没发现的宝藏。","✏ 每一个单词都是一块拼图，别停下来。","🔄 失败了？换个角度，再来一次。","🌍 你今天学到的，会让明天的世界更清晰。","🎯 设定目标，然后像狙击手一样瞄准它。","🌈 暴风雨后才有彩虹，努力过后才有惊喜。","⛰ 每座高山都是从第一块石头开始的。","💪 没有天生的名侦探，只有不断练习的普通人。","🌞 早起的人，先看到真相。","🌿 成长就像植物，看不见变化，但它一直在长。","💧 滴水穿石，不是因为力量，而是因为坚持。","🏃 跑得慢没关系，只要不停下来。","💭 想法不值钱，执行才值钱。今天你执行了吗？","🎉 进步不分大小，每一步都值得庆祝。","📍 把大目标切成小块，一口一口吃掉它。","🌀 昨天的你无法改变，但今天可以。","🐌 蚂蚁虽小，能搬动比它重几十倍的东西。","🌟 你就是自己故事里的主角，别让主角偷懒。","🎵 学习像弹琴，练得越多，旋律越美。","🌙 即使月亮有时不圆，但它从未停止发光。","☁ 不要让坏心情遮住你的天空。","💪 你的潜力比你想象的大得多。","🔎 发现自己的弱点，是变强的第一步。","💤 累了就休息，休息好了再出发。","⚔ 知识是你最锋利的武器，每天磨一磨。","🌟 没人能随随便便成功，但你可以一步步接近。","📖 书是侦探最好的朋友，别冷落它。","🎯 专注比聪明更重要，今天专注了吗？","🌞 阳光总在风雨后，先完成今天的任务再说。","📣 大声告诉自己：我可以！","🧠 脑子越用越灵，跟肌肉一样需要锻炼。","🌊 海浪从不停止拍打岸边，你也别停下脚步。","🐬 龟兔赛跑告诉我们：坚持比速度更重要。","🌟 做最好的自己，而不是别人的复制品。","💎 压力是碳变成钻石的唯一途径。","💪 自信不是天生的，是一个个小胜利累积的。","🌸 像花一样慢慢开，你的时间会来的。","🌌 星空之所以美，是因为每颗星都在发光。你也是一颗星。","⚡ 行动是消除焦虑的唯一办法。","🏆 冠军不是一场比赛诞生的，是每一次训练堆出来的。","💡 不懂就问，这是侦探的基本素养。","🔄 用不同的方法试试，总有一条路能通。","🌍 这个世界不缺聪明人，缺的是坚持到底的人。","🌟 今天的你，比昨天更厉害了一点。","🌸 每朵花都有自己的花期，你也是。","🦋 蝴蝶破茧前，也是一只不起眼的毛毛虫。","⛵ 风平浪静造就不了优秀的水手。","💪 你比你想象的更强大。","🎯 成功是一步步瞄准，一次次射击。","📖 每天多读一页书，一年就多了365页的智慧。","🌟 发光不是太阳的专利，你也可以。","💡 好主意往往在努力之后才出现。","🧠 脑子越用越灵光，今天你动脑了吗？","🌈 风雨过后不一定有彩虹，但一定有晴天。","🏃 不要跟别人比速度，要跟自己比进步。","🌱 成长像小树苗，看不见变化，却一直在扎根。","📍 把大目标切成小块，一口一口吃掉。","🌞 每一个清晨都是重新开始的机会。","💎 压力让碳变成钻石，让你变得更强。","🔥 热情是最好的老师，保持你的好奇心。","🌊 浪潮退去才知道谁在裸泳，努力的人从不怕考验。","🏆 没有人能随随便便成功，但你可以踏踏实实进步。","🧘 累了就歇一会儿，休息好了再出发。","💤 充足的睡眠是超能力，别熬夜。",'💬 说"我可以"比说"我不行"多用不了多少力气。',"🌟 你是独一无二的，没人能替代你发光。","🐩 像兔子一样敏捷思考，像乌龟一样坚持到底。","💪 今天多努力一点，明天就少后悔一点。"],Rt=[{id:"happy",icon:"😊",label:"开心"},{id:"excited",icon:"🤩",label:"兴奋"},{id:"confident",icon:"😎",label:"自信"},{id:"calm",icon:"😌",label:"平静"},{id:"curious",icon:"🤔",label:"好奇"},{id:"enlightened",icon:"💡",label:"开窍"},{id:"tired",icon:"😴",label:"疲惫"},{id:"annoyed",icon:"😤",label:"烦躁"},{id:"determined",icon:"💪",label:"加油"}],xt=Ps,Ft=Os,Ye=[{id:"hw_yw_01",subject:"语文",title:"背诵八上古诗文并默写",desc:"篇目见附录1",detail:"理解古诗文大意后熟读成诵，并默写在本子上。篇目包含八上全部古诗文（三峡、答谢中书书、记承天寺夜游、与朱元思书、野望、黄鹤楼、使至塞上、渡荆门送别、钱塘湖春行、庭中有奇树、龟虽寿、赠从弟、梁甫行、得道多助失道寡助、富贵不能淫、生于忧患死于安乐、愚公移山、周亚夫军细柳、饮酒、春望、雁门太守行、赤壁、渔家傲、浣溪沙、采桑子、相见欢、如梦令）。开学后课堂检测。"},{id:"hw_yw_02",subject:"语文",title:"文创设计三选一",desc:"书签 / 扇面 / 帆布包",detail:`选项A·书签设计：选取6句最喜欢的诗句，设计一套3张主题书签。正面为诗句+意境插画，背面为出处、释义，尺寸6×15cm。建议围绕同一主题选句（如"山水""边塞""家国情怀"）。
选项B·扇面创作：选一首最喜欢的诗词，在折扇或团扇上题诗并配画。
选项C·帆布包封面设计：选一首最喜欢的诗词，为其设计帆布包封面。A4尺寸竖版构图，图文结合，色彩协调。绘画方式不限，不可使用AI，开学提交纸质版。`},{id:"hw_yw_03",subject:"语文",title:"红色经典阅读：《红星照耀中国》",desc:"每周3-4章 + 阅读任务卡（附录2）",detail:'围绕"红色经典的时代回响"主题完成深度阅读。按每周3-4章速度推进，完成阅读任务卡（详见附录2）。阅读任务卡包含：每章内容概括、人物分析、精彩片段摘抄、阅读感悟。开学后课堂交流讨论。'},{id:"hw_yw_04",subject:"语文",title:"红色经典阅读：《红岩》",desc:"每周3-4章 + 阅读任务卡（附录3）",detail:'围绕"红色经典的时代回响"主题完成深度阅读。按每周3-4章速度推进，完成阅读任务卡（详见附录3）。阅读任务卡包含：每章内容概括、人物分析、精彩片段摘抄、阅读感悟。开学后课堂交流讨论。'},{id:"hw_yw_05",subject:"语文",title:"人物肖像创作",desc:"两本书各选一位人物 + 150字说明",detail:"从《红星照耀中国》和《红岩》中各选一位最受触动的人物，为他/她创作人物肖像。人物形象须符合书中描写，可添加能体现人物身份或精神品质的细节元素。手绘（拍照）或数位板绘制均可，须为原创，不可使用AI。开学统一提交A4纸质版，附一段150字以内的文字说明，阐释设计思路。"},{id:"hw_yw_06",subject:"语文",title:"手绘长征路线图",desc:"A4横版，标注起点终点、重大事件、地形",detail:"以《红星照耀中国》为主要依据，结合历史与地理知识。标注长征的起点与终点、途中关键地点及重大事件，每个事件须标注发生时间。运用地理知识用不同颜色标注地形地势或自然环境。地图须包含图例、比例尺、方向标，可适当配插图（如雪山、泸定桥等小图标）。开学提交A4横版纸质版。"},{id:"hw_yw_07",subject:"语文",title:"整理个人作文作品集",desc:"精选8篇 + 修改 + 设计装订",detail:"从七年级作文中精选8篇认真修改——订正错别字、打磨语言、完善结构。设计封面，自拟书名，写篇序言，编排目录，打印装订。A4尺寸。开学提交纸质版。"},{id:"hw_sx_01",subject:"数学",title:"基础训练 第1-4套",desc:"七下：相交线与平行线、实数",detail:"每天安排30分钟左右学习数学，不堆积不突击。每套训练标注完成日期，循序渐进完成。规范书写，作图题使用直尺、铅笔规范绘制。做完核对参考答案，错题整理在错题本并标注错误原因。"},{id:"hw_sx_02",subject:"数学",title:"基础训练 第5-8套",desc:"七下：平面直角坐标系、二元一次方程组",detail:"每天安排30分钟左右学习数学。每套训练标注完成日期。独立思考，计算题步骤完整，遇到难题先自主思考，实在无法解决做好标记。做完核对参考答案，错题整理在错题本。"},{id:"hw_sx_03",subject:"数学",title:"基础训练 第9-13套",desc:"七下+八上：不等式、数据统计、三角形",detail:"每天安排30分钟左右学习数学。不等式与不等式组、数据统计为七下内容；三角形为八上预习内容。规范书写，逐步推进，错题及时复盘。做完核对参考答案。"},{id:"hw_sx_04",subject:"数学",title:"基础训练 第14-17套",desc:"八上：全等三角形判定与尺规作图",detail:"每天安排30分钟左右学习数学。八上预习内容，注意全等三角形的五种判定方法（SSS、SAS、ASA、AAS、HL）。尺规作图需使用直尺和圆规规范绘制。做完核对参考答案。"},{id:"hw_sx_05",subject:"数学",title:"综合实践：小区位置探究",desc:"结合平面直角坐标系实地观察",detail:"结合平面直角坐标系、方位角知识实地观察小区建筑布局。绘制小区平面图，标注各建筑的坐标位置，用方位角描述建筑之间的相对位置关系。数形结合理解坐标知识。鼓励和家长一起实地测量。"},{id:"hw_sx_06",subject:"数学",title:"综合实践：暑期家庭支出统计",desc:"连续4周记录开销 + 绘制统计图",detail:"连续4周记录家庭开销（食品、交通、教育、娱乐等分类）。运用数据收集整理知识，绘制条形统计图、扇形统计图或折线统计图。分析家庭消费结构，写出简短的消费分析报告。鼓励和家长一起统计家庭开支。"},{id:"hw_sx_07",subject:"数学",title:"综合实践：四边形重心实验",desc:"动手操作探索图形重心",detail:"结合几何与简单物理知识，动手裁剪纸板做四边形。用悬挂法或支撑法找到四边形（平行四边形、梯形、不规则四边形等）的重心位置。记录实验过程和发现。锻炼动手与探究思维。鼓励和家长一起做实验。"},{id:"hw_en_01",subject:"英语",title:"听说训练（E听说）",desc:"登录E听说平台完成",detail:"登录E听说平台，按平台要求完成暑假听说训练任务。具体内容见E听说登录页面。建议每周完成2-3次，保持英语听力和口语的日常训练。"},{id:"hw_en_02",subject:"英语",title:"基础训练（假期练习计划）",desc:"配套试题和答题卡",detail:"完成《2026假期练习计划》配套试题和答题卡。按计划进度推进，不要集中突击。注意书写规范，做完核对答案，分析错题原因。"},{id:"hw_en_03",subject:"英语",title:"创新作业四选一",desc:"手抄报 / Vlog / 小册子 / 剪报集",detail:`选项A·手抄报：从课本8个单元主题中选择至少4个单元主题进行融合，完成A3手抄报创作，要求图文结合，语句以课本句型为主并适当拓展。
选项B·英语原创短视频Vlog：任选一至两个课本单元主题拍摄，时长1分半到3分钟。视频需实景拍摄、全程用课本核心句型英文口述，内容涵盖爱好、身边好人、自然节水、用电安全、榜样、旅行感悟六大类选题。
选项C·英语主题成长小册子：自制名为My English Summer Journal的10页英文小册子。含封面、目录各1页，8页正文分别对应课本单元核心话题，每页撰写3-5句精简英文段落。
选项D·《21世纪英文报》创意剪报集：使用初一版21世纪英文报制作创意剪报集，挑选6至8篇感兴趣文章剪贴成册，每篇任选英文感悟、短文评论、词汇积累拓展其中一项配套创作。`},{id:"hw_dd_01",subject:"道法",title:"思维导图：生活在法治社会",desc:"A4纸手绘 + 右下角标注班级姓名学号",detail:"绘制第四单元《生活在法治社会》思维导图。统一使用A4纸张，竖向或横向均可。纯手绘完成，禁止打印、复印、临摹网络成品，鼓励自主构思、原创设计。整体版面整洁美观、布局合理，图文搭配协调，主次分明。重点知识点可通过色彩、符号、图案进行标注区分。可结合法治主题绘制简约边框和法治元素小图案（法徽、天平、书本、盾牌等）。开学第一周统一上交。特等奖10%、一等奖20%、二等奖20%。"},{id:"hw_ls_01",subject:"历史",title:"近代中国风云变迁——历史报纸特刊",desc:"八开大小 + 1840-1949选一年/时期 + ≥3处手绘插图",detail:"从1840-1949年之间任选某一年或某一段时期，以报纸特刊形式呈现该时期的重大历史事件。每份报纸需包含：事件起因、经过、结果（或历史影响）；图文结合，文字报道搭配手绘插图、地图或人物肖像；史实准确，参考八年级上册历史教材。纸张规格：八开大小（约390mm×270mm）。报头位于第一版正上方居中，写清报纸名称。出版日期标注所选年份的真实日期。报头旁边写本期内容提要。至少3处手绘插图，内容须与报道事件相关。报纸背面右下角注明班级、姓名、学号。开学第一周提交手抄报纸原件（手写+手绘），不接收打印版。"},{id:"hw_ty_01",subject:"体育",title:"每日锻炼20天记录",desc:"模块1体能 + 模块2球类，如实填写记录表",detail:`每日分为两大模块，各选1项完成，每日总训练时长30-40分钟。暑期需完整记录20天锻炼情况。
模块1·体能基础训练（三选一）：长跑（1000米匀速跑/400m×3组间歇）、游泳（200米连续游/25m速游4组）、跳绳（30秒快速跳×6组/1分钟连续跳×4组）、力量素质（俯卧撑+深蹲跳/弓步跳+仰卧起坐）。
模块2·球类专项练习（任选一项30-40分钟）：足球（颠球、传球、射门）、篮球（运球、投篮、传球）、排球（垫球、传球、发球）、乒乓球、羽毛球、网球。
完整流程：准备热身→动态热身→基础体能→球类专项→拉伸放松。打印作业文档，每日如实记录，禁止空白填写和事后补填。开学第一周由体育委员统一收集，附运动轨迹截图或照片。`},{id:"hw_ty_02",subject:"体育",title:"足球文化拓展作业",desc:"科普短文350字 / 世界杯手抄报A4（二选一）",detail:"查阅资料了解足球起源、现代足球发展历程，学习正规比赛基础规则（比赛时长、得分规则、界外球、点球、红黄牌犯规判定、换人规则）。成果提交二选一：①撰写350字左右足球知识科普短文或世界杯比赛赏析文章；②绘制A4世界杯手抄报，内容可包含自己喜欢的球队和球星。开学第一周提交。"}];function $t(){const e=Math.floor(Math.random()*xt.length);return xt[e]}function Ws(){const e=Math.floor(Math.random()*Ft.length);return Ft[e]}function Rs(){const e=Math.floor(Math.random()*kt.length);return kt[e]}async function Ut(e){const t=await et(e),n=e||W(),s=t.filter(d=>d.date===n),a=[];new Set(s.map(d=>d.subjectId)).size>=3&&a.push({type:"box_a",reason:"今日完成3类以上任务",box:$t()}),s.reduce((d,f)=>d+f.stars,0)>=5&&a.push({type:"box_b",reason:"今日获得5颗以上星星",box:Ws()});const l=(await tt()).filter(d=>d.suggestedDate===n).map(d=>d.taskId),c=s.map(d=>d.taskId);return l.length>0&&l.every(d=>c.includes(d))&&a.push({type:"bonus",reason:"完成今日所有建议任务",box:$t()}),a}function Us(e){return wt[e%wt.length]}async function zt(){return await E("blindbox_history")||[]}async function Gt(e){const t=await zt();return t.unshift({...e,openedAt:new Date().toISOString()}),t.length>50&&(t.length=50),await q("blindbox_history",t),t}let ke=null,Ke=null;async function Xt(){return ke||(ke=new(window.AudioContext||window.webkitAudioContext)),ke.state==="suspended"&&await ke.resume(),ke}async function Yt(){return Ke||(Ke=Xt()),Ke}async function ae(e,t,n="sine",s=.3){try{const a=await Xt(),i=a.createOscillator(),o=a.createGain();i.type=n,i.frequency.value=e,o.gain.setValueAtTime(s,a.currentTime),o.gain.exponentialRampToValueAtTime(.001,a.currentTime+t),i.connect(o),o.connect(a.destination),i.start(a.currentTime),i.stop(a.currentTime+t)}catch{}}async function Kt(e,t=.12){await Yt(),e.forEach(([n,s],a)=>{setTimeout(()=>ae(n,s*t,"sine",.25),a*t*200)})}function Ie(){ae(880,.1,"sine",.3),setTimeout(()=>ae(1100,.2,"sine",.25),80)}function Vt(){ae(400,.15,"triangle",.2),setTimeout(()=>ae(500,.1,"triangle",.2),120),setTimeout(()=>ae(600,.1,"triangle",.2),220),setTimeout(()=>ae(800,.15,"triangle",.3),300),setTimeout(()=>{Kt([[660,1],[880,1],[1100,3]])},500)}function Jt(){Kt([[523,1],[659,1],[784,1],[1047,1],[784,1],[1047,1],[1319,3]],.1)}function He(){ae(300,.15,"square",.15),setTimeout(()=>ae(250,.25,"square",.15),120)}async function zs(){try{await Yt(),await ae(1,.001,"sine",0)}catch{}}async function z(e,t,n=!1){if(!e)return;const s=t||Wt()||W(),a=n?window.scrollY:0;try{Me(e);const i=await et(s),o=new Set(i.map(c=>c.taskId)),v=Us(ds(s));e.innerHTML="";const l=u("div",{className:"search-header"});if(l.innerHTML=`
      <h2 class="search-date-title">${oe(s)}</h2>
      ${I(s)?'<div class="search-day-badge badge-rest">&#x1F4A4; 休息日</div>':""}
      ${Q(s)?'<div class="search-day-badge badge-travel">&#x2708; 旅途中</div>':""}
      ${V(s)?"":'<div class="search-day-badge badge-future">未开始</div>'}
    `,e.appendChild(l),I(s)){const c=u("div",{className:"sunday-page"});try{const r=await pe(),d=await E("diary")||{},f=Object.keys(d).sort().reverse().slice(0,3);c.innerHTML=`
          <div class="sunday-icon">&#x1F3D6;</div>
          <h2 class="sunday-title">侦探休息日</h2>
          <p class="sunday-subtitle">今天是周日，好好休息，养精蓄锐！</p>
          <div class="sunday-stats-grid">
            <div class="sunday-stat">
              <div class="sunday-stat-value">${r.streak}</div>
              <div class="sunday-stat-label">连续打卡</div>
            </div>
            <div class="sunday-stat">
              <div class="sunday-stat-value">${r.totalStars}</div>
              <div class="sunday-stat-label">累计星星</div>
            </div>
            <div class="sunday-stat">
              <div class="sunday-stat-value">${r.activeDays}</div>
              <div class="sunday-stat-label">活跃天数</div>
            </div>
            <div class="sunday-stat">
              <div class="sunday-stat-value">${r.reciteCompleted}/${r.reciteTotal}</div>
              <div class="sunday-stat-label">背诵完成</div>
            </div>
          </div>
          ${f.length>0?`
            <div class="sunday-diary-section">
              <h3>&#x1F4DD; 最近探案笔记</h3>
              ${f.map(p=>{var y,b;return`
                <div class="sunday-diary-item">
                  <div class="sunday-diary-date">${oe(p)}</div>
                  <div class="sunday-diary-text">${h((((y=d[p])==null?void 0:y.text)||"").slice(0,100))}${(((b=d[p])==null?void 0:b.text)||"").length>100?"...":""}</div>
                </div>
              `}).join("")}
            </div>
          `:""}
          <p class="sunday-encourage">&#x1F31F; 休息是为了走更远的路，明天继续加油！</p>
        `}catch{c.innerHTML=`
          <div class="sunday-icon">&#x1F3D6;</div>
          <h2 class="sunday-title">侦探休息日</h2>
          <p class="sunday-subtitle">今天是周日，好好休息，养精蓄锐！</p>
        `}e.appendChild(c);return}if(V(s)&&!I(s)){const c=await E("avatar")||"",r=u("div",{className:"search-section avatar-section"});r.innerHTML=`
        <div class="avatar-wrapper" id="avatarWrapper" title="点击上传你的画像">
          ${c?`<img src="${c}" class="avatar-img" alt="我的画像">`:'<div class="avatar-placeholder">&#x1F575;</div>'}
          <div class="avatar-edit-hint">&#x270F;</div>
        </div>
        <input type="file" accept="image/*" id="avatarInput" style="display:none;">
      `,e.appendChild(r);const d=r.querySelector("#avatarWrapper"),f=r.querySelector("#avatarInput");d.addEventListener("click",()=>f.click()),f.addEventListener("change",async p=>{const y=p.target.files[0];if(!y)return;const b=new FileReader;b.onload=async()=>{await q("avatar",b.result),d.innerHTML=`
            <img src="${b.result}" class="avatar-img" alt="我的画像">
            <div class="avatar-edit-hint">&#x270F;</div>
          `},b.readAsDataURL(y)})}if(V(s)&&!I(s)){const c=await E("daily_quotes")||{},r=c[s],d=await E("moods")||{},f=d[s],p=u("div",{className:"search-section"});p.innerHTML=`
        <div class="daily-row">
          <!-- 抽签区 -->
          <div class="daily-quote-draw ${r?"drawn":""}" id="quoteDraw">
            ${r?`
              <div class="quote-fortune-paper">
                <div class="quote-fortune-label">&#x1F340; 今日好运</div>
                <div class="quote-fortune-text">${h(r)}</div>
              </div>
            `:`
              <div class="quote-draw-prompt">
                <div class="quote-draw-icon">&#x1F3F7;</div>
                <div class="quote-draw-label">今日好运</div>
                <button class="btn btn-primary btn-draw-quote" id="btnDrawQuote">&#x1F331; 抽签</button>
              </div>
            `}
          </div>
          <!-- 心情区 -->
          <div class="daily-mood-panel" id="moodPanel">
            <div class="mood-label">&#x1F3AD; 今日心情</div>
            <div class="mood-options">
              ${Rt.map(b=>`
                <button class="mood-btn ${f===b.id?"mood-selected":""}" data-mood="${b.id}">
                  <span class="mood-btn-icon">${b.icon}</span>
                  <span class="mood-btn-label">${b.label}</span>
                </button>
              `).join("")}
            </div>
          </div>
        </div>
      `,e.appendChild(p);const y=p.querySelector("#btnDrawQuote");y&&y.addEventListener("click",async()=>{const b=await E("drawn_quote_indices")||[];let k=[];for(let N=0;N<Xe.length;N++)b.includes(N)||k.push(N);if(k.length===0){b.length=0;for(let N=0;N<Xe.length;N++)k.push(N)}const $=k[Math.floor(Math.random()*k.length)];b.push($),await q("drawn_quote_indices",b);const S=Xe[$];c[s]=S,await q("daily_quotes",c);const A=p.querySelector("#quoteDraw");A.classList.add("drawn"),A.innerHTML=`
            <div class="quote-fortune-paper" style="animation: fortuneReveal 0.5s ease;">
              <div class="quote-fortune-label">&#x1F3F7; 今日金句</div>
              <div class="quote-fortune-text">${h(S)}</div>
            </div>
          `}),p.querySelectorAll(".mood-btn").forEach(b=>{b.addEventListener("click",async()=>{const k=b.dataset.mood;d[s]=k,await q("moods",d),p.querySelectorAll(".mood-btn").forEach($=>$.classList.remove("mood-selected")),b.classList.add("mood-selected")})})}if(v&&V(s)&&!I(s)&&!Q(s)){const c=u("div",{className:"search-section challenge-section"});c.innerHTML=`
        <div class="section-title">&#x1F3AF; 今日密令</div>
        <div class="challenge-card">
          <div class="challenge-icon">${v.icon}</div>
          <div class="challenge-info">
            <div class="challenge-title">${h(v.title)}</div>
            <div class="challenge-desc">${h(v.desc)}</div>
          </div>
        </div>
      `,e.appendChild(c)}if(!I(s)){const c=u("div",{className:"search-section search-recite"});c.innerHTML='<div class="section-title">&#x1F4D6; 背诵任务</div>';const r=le.filter(p=>p.type==="recite"),d=rs(s),f=Q(s);for(const p of r){const y=st().filter(T=>T.subject===p.id),b=y.filter(T=>o.has(T.id)).length,k=u("div",{className:"subject-block"});k.innerHTML=`
          <div class="subject-header" style="border-left: 4px solid ${p.color};">
            <span class="subject-icon">${p.icon}</span>
            <span class="subject-name">${h(p.name)}</span>
            <span class="subject-progress">${b}/${y.length}</span>
          </div>
        `;const $=u("div",{className:"task-list"}),S=3,A=y.filter(T=>!o.has(T.id)),N=A.slice(0,S),R=A.slice(S);for(const T of N)$.appendChild(Ct(T,!1,s));if(R.length>0){const T=u("div",{className:"task-collapse-content",style:{display:"none"}});for(const x of R)T.appendChild(Ct(x,!1,s));const L=u("button",{className:"btn-task-expand",onClick:function(){const x=T.style.display!=="none";T.style.display=x?"none":"block",this.innerHTML=x?`展开全部 (${R.length}条) ▼`:"收起 ▲"}},`展开全部 (${R.length}条) ▼`);$.appendChild(T),$.appendChild(L)}if(!f||p.id==="en"){const T=hs(p.id,s,d);for(const L of T){const x=`daily_${L.id}`,B=o.has(x),te=Xs(L,B,s,p);B&&te.classList.add("task-done"),$.appendChild(te)}}k.appendChild($),c.appendChild(k)}e.appendChild(c)}if(!I(s)&&!Q(s)){const c=u("div",{className:"search-section"});c.innerHTML='<div class="section-title">&#x1F3C3; 体能训练</div>';const r=u("div",{className:"task-list horizontal-list"});for(const d of Lt){const f=`sp_${d.id}`,p=o.has(f),y=Gs(d,p,s);r.appendChild(y)}c.appendChild(r),e.appendChild(c)}if(!I(s)&&!Q(s)){const c=u("div",{className:"search-section"});c.innerHTML='<div class="section-title">&#x1F4D0; 学科任务</div>';const r=le.filter(d=>d.type==="chapter");for(const d of r){const f=Fs(d.id,s);if(!f||f.length===0)continue;let p=0,y=0;for(const k of f)for(const $ of k.items)p++,o.has($.id)&&y++;const b=u("div",{className:"subject-block chapter-subject-block"});b.innerHTML=`
          <div class="subject-header chapter-subject-header" style="border-left: 4px solid ${d.color};">
            <span class="subject-icon">${d.icon}</span>
            <span class="subject-name">${h(d.name)}</span>
            <span class="subject-progress">${y}/${p}节</span>
          </div>
        `;for(const k of f){const $=k.items.filter(x=>o.has(x.id)).length,S=k.items.length,A=u("div",{className:"chapter-group"});A.innerHTML=`
            <div class="chapter-group-header" data-chapter-group="${d.id}_${k.chapterIndex}">
              <span class="chapter-group-arrow">&#9654;</span>
              <span class="chapter-group-title">${h(k.chapterTitle)}</span>
              <span class="chapter-group-progress">${$}/${S}</span>
            </div>
            <div class="chapter-group-items" id="ch_group_${d.id}_${k.chapterIndex}" style="display:none;">
              ${k.items.map(x=>{const B=o.has(x.id);return`
                  <div class="chapter-item ${B?"chapter-item-done":""}" data-task-id="${x.id}">
                    <div class="chapter-item-check ${B?"checked":""}">
                      ${B?"&#x2705;":""}
                    </div>
                    <span class="chapter-item-title">${h(x.title)}</span>
                    ${B?'<span class="chapter-item-date">已完成</span>':""}
                  </div>
                `}).join("")}
            </div>
          `;const N=A.querySelector(".chapter-group-header"),R=A.querySelector(".chapter-group-items"),T=A.querySelector(".chapter-group-arrow");N.addEventListener("click",()=>{const x=R.style.display!=="none";R.style.display=x?"none":"block",T.textContent=x?"▶":"▼"}),A.querySelectorAll(".chapter-item").forEach(x=>{x.addEventListener("click",async()=>{const B=x.dataset.taskId,te=o.has(B),be={id:B,subject:d.id,title:x.querySelector(".chapter-item-title").textContent,content:""};await Pe(be,te,s,x)})}),b.appendChild(A)}c.appendChild(b)}e.appendChild(c)}if(V(s)&&!I(s))try{const c=await As();if(c){const r=u("div",{className:"search-section deduction-ready-section"});r.innerHTML=`
            <div class="section-title">&#x1F50E; 推理准备就绪</div>
            <div class="deduction-ready-card">
              <div class="deduction-ready-icon">${c.caseData.icon}</div>
              <div class="deduction-ready-info">
                <div class="deduction-ready-title">${h(c.caseData.title)}</div>
                <div class="deduction-ready-desc">${h(c.caseData.desc)}</div>
                <div class="deduction-ready-clues">已收集 ${c.collectedClueTexts.length}/${c.caseData.cluesNeeded} 条线索</div>
              </div>
              <button class="btn btn-deduction-start">&#x1F50D; 开始推理</button>
            </div>
          `,r.querySelector(".btn-deduction-start").addEventListener("click",async()=>{await Vs(c.caseData,c.collectedClueTexts,s),await z(e,s,!0);const f=document.querySelector("#headerStats");f&&ie(f);const p=document.querySelector("#sideStats");p&&ie(p)}),e.appendChild(r)}}catch(c){console.error("Deduction check failed:",c)}if(V(s)&&!I(s)){const c=await re(),r=new Set(c.filter(S=>S.taskId&&S.taskId.startsWith("hw_")).map(S=>S.taskId)),d=Ye.filter(S=>r.has(S.id)).length,f=Ye.length,p=u("div",{className:"search-section"}),y={语文:"#EF4444",数学:"#3B82F6",英语:"#8B5CF6",道法:"#F59E0B",历史:"#10B981",体育:"#06B6D4"},b=["语文","数学","英语","道法","历史","体育"],k=f>0?Math.round(d/f*100):0;p.innerHTML=`
        <div class="section-title" style="cursor:pointer;" id="hwSectionTitle">
          &#x1F4DA; 暑假作业 <span class="hw-progress-badge">${d}/${f}</span>
          <span style="font-size:11px;color:var(--color-text-muted);margin-left:6px;">&#x25BC; 点击学科展开</span>
        </div>
        <div class="hw-progress-bar"><div class="hw-progress-fill" style="width:${k}%;"></div></div>
      `;const $=u("div",{className:"hw-list"});for(const S of b){const A=Ye.filter(x=>x.subject===S);if(A.length===0)continue;const N=A.filter(x=>r.has(x.id)).length,R=u("div",{className:"hw-subject-group"}),T=u("div",{className:`hw-subject-header ${N===A.length?"hw-subject-all-done":""}`,style:`border-left:3px solid ${y[S]};`});T.innerHTML=`
          <span class="hw-subj-dot" style="background:${y[S]};"></span>
          <span class="hw-subj-name">${S}</span>
          <span class="hw-subj-count">${N}/${A.length}</span>
          <span class="hw-subj-arrow">&#x25B6;</span>
        `;const L=u("div",{className:"hw-subject-items",style:"display:none;"});for(const x of A){const B=r.has(x.id),te=u("div",{className:`hw-item ${B?"hw-done":""}`,"data-task-id":x.id});te.innerHTML=`
            <div class="hw-item-dot" style="background:${y[S]};"></div>
            <div class="hw-item-body">
              <div class="hw-item-title">${h(x.title)}</div>
              <div class="hw-item-desc">${h(x.desc)}</div>
            </div>
            <button class="btn-task-toggle ${B?"btn-task-undo":"btn-task-do"}">
              ${B?"&#x2705;":"&#x2B50;"}
            </button>
          `,te.addEventListener("click",()=>{me({title:x.subject+" - "+x.title,content:`<div style="font-size:13px;line-height:1.8;white-space:pre-wrap;color:var(--color-text);">${h(x.detail||x.desc)}</div>`,buttons:[{text:"关闭",cls:"btn-secondary"}]})}),te.querySelector(".btn-task-toggle").addEventListener("click",async ge=>{ge.stopPropagation(),B?(await Ee(x.id,s),_("已撤销"),await z(e,s,!0)):(await Ne(x.id,s,{customTitle:x.title,customContent:x.desc,subjectId:x.subject})).state.action==="completed"&&(Ie(),ct(1),await z(e,s,!0))}),L.appendChild(te)}T.addEventListener("click",()=>{const x=L.style.display!=="none";L.style.display=x?"none":"block",T.querySelector(".hw-subj-arrow").innerHTML=x?"&#x25B6;":"&#x25BC;"}),R.appendChild(T),R.appendChild(L),$.appendChild(R)}p.appendChild($),e.appendChild(p)}if(V(s)){const c=u("div",{className:"search-section"});c.innerHTML='<div class="section-title">&#x1F3AF; 特别行动</div>';const r=u("div",{className:"task-list"}),d=i.filter(p=>p.subjectId==="ot");for(const p of d){const y=Ys(p,s);r.appendChild(y)}const f=u("button",{className:"btn btn-add-custom",onClick:async()=>{await Js(s,e)}},"+ 添加特别行动");r.appendChild(f),c.appendChild(r),e.appendChild(c)}if(i.length>0){const c=u("div",{className:"search-section summary-section"}),r=i.reduce((d,f)=>d+f.stars,0);c.innerHTML=`
        <div class="section-title">&#x2705; 今日已完成 (${i.length}项 / &#x2B50;${r}星)</div>
      `;try{const d=await Ut(s);if(d.length>0){const f=u("div",{className:"blindbox-triggers"});for(const p of d){const y=u("button",{className:"btn btn-blindbox",onClick:async()=>{Vt(),await Gt(p.box),await Pt(p.box,p.type==="box_b"?"B":"A"),z(e,s,!0)}},`${p.type==="box_b"?"&#x1F50E; 关键证据":p.type==="bonus"?"&#x1F3C6; 额外发现":"&#x1F50D; 日常证物"} - ${h(p.reason)}`);f.appendChild(y)}c.appendChild(f)}}catch(d){console.error("Blindbox trigger check failed:",d)}e.appendChild(c)}if(V(s)&&!I(s)){const c=u("div",{className:"search-section diary-write-section"});c.innerHTML='<div class="section-title">&#x1F4DD; 探案笔记</div>';const r=await E("diary")||{},d=r[s],f=s===W();if(d&&d.text){c.innerHTML+=`
          <div class="diary-write-card diary-written">
            <div class="diary-write-text">${h(d.text)}</div>
            ${d.stars?`<div class="diary-write-stars">&#x2B50; 当天获得 ${d.stars} 星</div>`:""}
            <button class="btn btn-secondary diary-edit-btn" style="margin-top:8px;">&#x270F; 修改笔记</button>
          </div>
          <div class="diary-edit-area" style="display:none;">
            <textarea class="diary-textarea" rows="3" maxlength="500">${h(d.text)}</textarea>
            <div class="diary-edit-btns">
              <button class="btn btn-primary diary-save-btn">&#x1F4BE; 保存</button>
              <button class="btn btn-secondary diary-cancel-btn">取消</button>
            </div>
          </div>
        `,e.appendChild(c);const p=c.querySelector(".diary-edit-btn"),y=c.querySelector(".diary-edit-area"),b=c.querySelector(".diary-written"),k=c.querySelector(".diary-save-btn"),$=c.querySelector(".diary-cancel-btn"),S=c.querySelector(".diary-textarea");p.addEventListener("click",()=>{b.style.display="none",y.style.display="block"}),$.addEventListener("click",()=>{b.style.display="",y.style.display="none",S.value=d.text}),k.addEventListener("click",async()=>{const A=S.value.trim();A&&(r[s]={text:A,stars:d.stars},await q("diary",r),_("笔记已保存"),await z(e,s,!0))})}else if(f){const p=i.reduce((k,$)=>k+$.stars,0);c.innerHTML+=`
          <div class="diary-write-card">
            <textarea class="diary-textarea" id="diaryTextarea" rows="3" maxlength="500" placeholder="记录今天的收获或心得..."></textarea>
            <div class="diary-edit-btns">
              <button class="btn btn-primary diary-save-btn">&#x1F4BE; 记入探案笔记</button>
            </div>
          </div>
        `,e.appendChild(c);const y=c.querySelector(".diary-save-btn"),b=c.querySelector("#diaryTextarea");y.addEventListener("click",async()=>{const k=b.value.trim();if(!k){_("请写点什么吧","warning");return}r[s]={text:k,stars:p},await q("diary",r),_("&#x1F4DD; 笔记已记录！"),await z(e,s,!0)})}e.appendChild(c)}if(i.length===0&&V(s)&&!I(s)&&!Q(s)){const c=Rs(),r=u("div",{className:"search-section encourage-section"});r.innerHTML=`
        <div class="encourage-card">
          <div class="encourage-icon">${c.icon}</div>
          <div class="encourage-text">${h(c.text)}</div>
        </div>
      `,e.appendChild(r)}n&&a>0&&requestAnimationFrame(()=>{requestAnimationFrame(()=>{window.scrollTo(0,a)})})}catch(i){console.error("renderTabSearch failed:",i),Be(e,`页面加载失败: ${i.message}`,()=>z(e,s))}}function Ct(e,t,n){const s=Qe(e.subject),a=u("div",{className:"task-card ","data-task-id":e.id}),i=e.content?`<div class="task-card-preview">${h(e.content.slice(0,50))}${e.content.length>50?"...":""}</div>`:"";a.innerHTML=`
    <div class="task-card-left">
      <div class="task-card-subject" style="background:${s?s.color:"#94A3B8"};">
        ${s?s.icon:""}
      </div>
    </div>
    <div class="task-card-body">
      <div class="task-card-title">${h(e.title)}</div>
      ${e.author?`<div class="task-card-author">${h(e.author)}</div>`:""}
      ${e.category?`<div class="task-card-category">${h(e.category)}</div>`:""}
      ${i}
    </div>
    <div class="task-card-right">
      <button class="btn-task-toggle btn-task-do" title="完成">
        &#x2B50;
      </button>
    </div>
  `;const o=a.querySelector(".btn-task-toggle");return o&&o.addEventListener("click",async v=>{v.stopPropagation(),await Pe(e,t,n,a)}),a.addEventListener("click",()=>{Ks(e,t,n)}),ot(a,[{opacity:0,transform:"translateY(10px)"},{opacity:1,transform:"translateY(0)"}],200),a}function Gs(e,t,n){const s=`sp_${e.id}`,a=u("div",{className:`task-card sport-card ${t?"task-card-done":""}`,"data-task-id":s});a.innerHTML=`
    <div class="sport-icon">${e.icon}</div>
    <div class="sport-name">${h(e.name)}</div>
    <button class="btn-task-toggle ${t?"btn-task-undo":"btn-task-do"}">
      ${t?"&#x2705;":"&#x2B50;"}
    </button>
  `;const i=a.querySelector(".btn-task-toggle");return i&&i.addEventListener("click",async o=>{o.stopPropagation();const v={id:s,subject:"sp",title:e.name,content:""};await Pe(v,t,n,a)}),a}function Xs(e,t,n,s){const a=`daily_${e.id}`,i=u("div",{className:`task-card daily-task-card ${t?"task-card-done":""}`,"data-task-id":a});i.innerHTML=`
    <div class="task-card-left">
      <div class="task-card-subject" style="background:#94A3B8;">
        ${e.icon||"&#x1F4CB;"}
      </div>
    </div>
    <div class="task-card-body">
      <div class="task-card-title">
        ${h(e.title)}
        <span class="task-badge-daily">每日</span>
        ${e.isSatVariant?'<span class="task-badge-sat">周六</span>':""}
      </div>
      <div class="task-card-category">${h(s.name)} · 每日固定</div>
    </div>
    <div class="task-card-right">
      <button class="btn-task-toggle ${t?"btn-task-undo":"btn-task-do"}" title="${t?"撤销":"完成"}">
        ${t?"&#x2705;":"&#x2B50;"}
      </button>
    </div>
  `;const o=i.querySelector(".btn-task-toggle");return o&&o.addEventListener("click",async v=>{v.stopPropagation();const l={id:a,subject:"daily",title:e.title,content:""};await Pe(l,t,n,i)}),i}function Ys(e,t){const n=u("div",{className:"task-card custom-card task-card-done","data-task-id":e.taskId});n.innerHTML=`
    <div class="task-card-left">
      <div class="task-card-subject" style="background:#94A3B8;">&#x1F3AF;</div>
    </div>
    <div class="task-card-body">
      <div class="task-card-title">${h(e.customTitle||"特别行动")}</div>
      <div class="task-card-category">${h(e.customContent||"")}</div>
    </div>
    <div class="task-card-right">
      <button class="btn-task-toggle btn-task-undo" title="撤销">&#x2705;</button>
    </div>
  `;const s=n.querySelector(".btn-task-toggle");return s&&s.addEventListener("click",async a=>{if(a.stopPropagation(),(await Ee(e.taskId,t)).state.action==="undone"){He(),_("已撤销");const o=n.closest(".tab-content");o&&z(o,t,!0)}}),n}async function Pe(e,t,n,s){try{if(t){if(!await Ht("撤销确认",`确定要撤销「${e.title}」的完成记录吗？星星也将被收回。`))return;if((await Ee(e.id,n)).state.action==="undone"){He(),_(`已撤销「${e.title}」`);const o=document.querySelector("#tabSearch");o&&z(o,n,!0)}}else{const a=await Ne(e.id,n);if(a.state.action==="completed"){Ie();const i=a.state.stars;if(ct(i),s){const r=s.getBoundingClientRect();qs(r.left+r.width/2,r.top,i),s.classList.add("task-card-done");const d=s.querySelector(".btn-task-toggle");d&&(d.innerHTML="&#x2705;",d.className="btn-task-toggle btn-task-undo"),Ls(s)}try{const r=await Ss();if(r.dropped&&!r.readyForDeduction){const d=document.createElement("div");d.className="clue-toast",d.innerHTML=`🔍 发现线索！(${r.clueCount}/${r.clueNeeded})<br><small>「${r.caseTitle}」</small>`,d.style.cssText=`
              position:fixed;top:80px;left:50%;transform:translateX(-50%);
              background:#1E293B;color:#F59E0B;padding:10px 18px;border-radius:12px;
              z-index:2000;text-align:center;font-size:14px;font-weight:600;
              animation:cluePopIn 0.4s ease, clueFadeOut 0.5s 1.5s ease forwards;
              pointer-events:none;white-space:nowrap;
            `,document.body.appendChild(d),setTimeout(()=>d.remove(),2200)}r.readyForDeduction&&_(`🔍 线索集齐！准备推理「${r.caseTitle}」`,"info",3e3)}catch(r){console.error("Clue drop failed:",r)}if(a.events.includes("achievement_unlocked")){const r=await je(),d=r[r.length-1];d&&(Jt(),await js(d))}const o=await Ut(n);if(o.length>0)for(const r of o)Vt(),await Gt(r.box),await Pt(r.box,r.type==="box_b"?"B":"A");const v=document.querySelector("#tabSearch");v&&await z(v,n,!0);const l=document.querySelector("#headerStats");l&&ie(l);const c=document.querySelector("#sideStats");c&&ie(c);try{const r=await pe();Bs(r.streak)}catch{}}}}catch(a){console.error("Task toggle failed:",a),_(`操作失败: ${a.message}`,"error")}}function Ks(e,t,n){const s=Qe(e.subject);let a=`
    <div class="task-detail">
      <div class="task-detail-header">
        <span style="color:${s?s.color:"#94A3B8"}; font-size: 24px;">${s?s.icon:""}</span>
        <h3>${h(e.title)}</h3>
      </div>
  `;e.author&&(a+=`<div class="task-detail-author">作者: ${h(e.author)}</div>`),e.content&&(a+=`
      <div class="task-detail-content">
        <div class="task-detail-label">全文:</div>
        <div class="task-detail-text">${h(e.content)}</div>
      </div>
    `),a+=`
      <div class="task-detail-status">
        状态: &#x2B50; 待完成
      </div>
    </div>
  `,me({title:"",content:a,buttons:[{text:"关闭",cls:"btn-secondary"},{text:"完成",cls:"btn-primary",onClick:async()=>{{const o=await Ne(e.id,n);Ie(),ct(o.state.stars)}const i=document.querySelector("#tabSearch");i&&z(i,n,!0)}}]})}async function Vs(e,t,n){return new Promise(s=>{let a=-1,i=!1;function o(){return`
        <div class="deduction-modal-content">
          <div class="deduction-case-header">
            <span class="deduction-case-icon">${e.icon}</span>
            <div>
              <div class="deduction-case-title">${h(e.title)}</div>
              <div class="deduction-case-desc">${h(e.desc)}</div>
            </div>
          </div>
          <div class="deduction-clues-section">
            <div class="deduction-section-label">&#x1F4CB; 已收集的线索</div>
            <div class="deduction-clues-list">
              ${t.map((c,r)=>`
                <div class="deduction-clue-card">
                  <span class="deduction-clue-num">${r+1}</span>
                  <span class="deduction-clue-text">${h(c)}</span>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="deduction-question-section">
            <div class="deduction-section-label">&#x2753; 请做出推理</div>
            <div class="deduction-question">${h(e.question)}</div>
            <div class="deduction-options" id="deductionOptions">
              ${e.options.map((c,r)=>`
                <button class="deduction-option" data-answer="${r}">
                  <span class="deduction-option-letter">${String.fromCharCode(65+r)}</span>
                  <span class="deduction-option-text">${h(c)}</span>
                </button>
              `).join("")}
            </div>
            <div class="deduction-feedback" style="display:none;"></div>
          </div>
        </div>
      `}const v=me({title:"",className:"deduction-modal",content:o(),buttons:[{text:"&#x1F50D; 提交推理",cls:"btn-primary btn-submit-deduction",onClick:()=>i?!1:a<0?(_("请先选择一个答案","warning"),!1):(l(),!1)}],onClose:()=>s(null)});v.querySelectorAll(".deduction-option").forEach(c=>{c.addEventListener("click",()=>{i||(a=parseInt(c.dataset.answer),v.querySelectorAll(".deduction-option").forEach(r=>r.classList.remove("selected")),c.classList.add("selected"))})});async function l(){i=!0;const c=await Ts(a),r=v.querySelector(".deduction-feedback"),d=v.querySelector(".btn-submit-deduction");if(c.correct){Jt();const f=v.querySelector(`.deduction-option[data-answer="${e.answer}"]`);f&&f.classList.add("correct"),r.style.display="block",r.className="deduction-feedback feedback-correct",r.innerHTML=`&#x2705; 推理正确！${h(c.explanation)}`,d&&(d.innerHTML="&#x1F36C; 案件告破！",d.disabled=!0),setTimeout(()=>{Ms(),v.classList.remove("modal-in");const p=v.querySelector(".modal-container");p&&p.classList.remove("modal-container-in"),setTimeout(()=>{v.remove(),s(!0)},300)},1200)}else{He();const f=v.querySelector(`.deduction-option[data-answer="${a}"]`);f&&(Ns(f),f.classList.add("wrong")),r.style.display="block",r.className="deduction-feedback feedback-wrong",r.innerHTML="&#x274C; 推理不对，再看看线索，换个答案试试！",i=!1,setTimeout(()=>{f&&f.classList.remove("wrong")},600)}}})}async function Js(e,t){if((await et(e)).filter(v=>v.subjectId==="ot").length>=O.maxCustomTasks){_(`每天最多添加${O.maxCustomTasks}个特别行动`,"warning");return}const s=prompt("特别行动名称:");if(!s||!s.trim())return;const a=prompt("备注（可选）:")||"",i=`ot_${Date.now()}`;if(s.trim(),a.trim(),(await Ne(i,e,{note:a.trim(),customTitle:s.trim(),customContent:a.trim()})).state.action==="completed"){Ie(),_(`特别行动「${s}」已记录`),z(t,e,!0);const v=document.querySelector("#headerStats");v&&ie(v);const l=document.querySelector("#sideStats");l&&ie(l)}}async function lt(e){if(e)try{Me(e);const t=await re();e.innerHTML="";const n=u("div",{className:"archive-header"}),s=t.reduce((y,b)=>y+(b.stars||0),0),a=[...new Set(t.map(y=>y.date))];n.innerHTML=`
      <h2 class="archive-title">&#x1F4DA; 探案档案</h2>
      <div class="archive-summary">
        <span class="archive-stat">&#x2705; ${t.length} 项</span>
        <span class="archive-stat">&#x2B50; ${s} 星</span>
        <span class="archive-stat">&#x1F4C5; ${a.length} 天</span>
      </div>
    `,e.appendChild(n);const i=u("div",{className:"archive-overview"}),o=ue||[];for(const y of le){const b=t.filter(S=>S.subjectId===y.id),k=o.filter(S=>S.subject===y.id).length,$=new Set(b.map(S=>S.taskId)).size;if(k>0){const S=Math.round($/k*100);i.innerHTML+=`
          <div class="archive-overview-item">
            <span class="archive-overview-icon">${y.icon}</span>
            <span class="archive-overview-name">${y.name}</span>
            <span class="archive-overview-count">${$}/${k}</span>
            <span class="archive-overview-bar"><span class="archive-overview-fill" style="width:${S}%;background:${y.color};"></span></span>
          </div>`}}e.appendChild(i);const v=u("div",{className:"archive-filter-bar"});v.innerHTML=`
      <input type="text" class="archive-search-input" placeholder="搜索任务...">
      <select class="archive-filter-select">
        <option value="">全部学科</option>
        ${le.map(y=>`<option value="${y.id}">${y.icon} ${y.name}</option>`).join("")}
      </select>
      <select class="archive-sort-select">
        <option value="date-desc">最新优先</option>
        <option value="date-asc">最早优先</option>
        <option value="stars-desc">星星最多</option>
      </select>
    `,e.appendChild(v);const l=u("div",{className:"archive-list"});e.appendChild(l),_e(l,t,"","","date-desc");const c=v.querySelector(".archive-search-input"),r=v.querySelector(".archive-filter-select"),d=v.querySelector(".archive-sort-select");c&&c.addEventListener("input",()=>{_e(l,t,c.value,r.value,d.value)}),r&&r.addEventListener("change",()=>{_e(l,t,c.value,r.value,d.value)}),d&&d.addEventListener("change",()=>{_e(l,t,c.value,r.value,d.value)});const f=await zt(),p=u("div",{className:"archive-section"});if(p.innerHTML='<div class="section-title">&#x1F381; 证物记录</div>',f.length===0){const y=u("div",{className:"achievements-empty"});y.innerHTML="<p>还没有收集到证物，多完成任务来发现线索吧！</p>",p.appendChild(y)}else{const y=u("div",{className:"achievements-grid"});for(const b of f.slice(0,24)){const k=u("div",{className:"achievement-badge"});k.innerHTML=`
          <div class="achievement-badge-icon">${b.icon||"&#x1F381;"}</div>
          <div class="achievement-badge-title">${h(b.title||"神秘证物")}</div>
          <div class="achievement-badge-desc">${h(b.desc||"")}</div>
          <div class="achievement-badge-date">${b.openedAt?b.openedAt.slice(0,10):""}</div>
        `,y.appendChild(k)}p.appendChild(y)}e.appendChild(p)}catch(t){console.error("renderTabArchive failed:",t),Be(e,`档案加载失败: ${t.message}`,()=>lt(e))}}function St(e){const t=e.taskId;if(t.startsWith("ot_"))return e.customTitle||"特别行动";if(t.startsWith("sp_")){const s=t.replace("sp_",""),a=Lt.find(i=>i.id===s);return a?a.name:t}if(t.startsWith("daily_")){const s=t.split("_");if(s.length>=3){const a=s[1],i=s.slice(2).join("_"),o=Mt[a];if(o){const v=o.find(l=>l.id===i);if(v)return v.title}}return t}if(t.startsWith("ch_")){const s=t.split("_");if(s.length>=4){const a=s[1],i=parseInt(s[2],10),o=parseInt(s[3],10),v=nt[a];if(v&&v[i]&&v[i].items[o])return v[i].items[o]}return t}const n=ue.find(s=>s.id===t);return n?n.title:e.customTitle||t}function _e(e,t,n="",s="",a="date-desc"){if(!e)return;Es(e);let i=[...t];if(s&&(i=i.filter(l=>l.subjectId===s)),n){const l=n.toLowerCase();i=i.filter(c=>St(c).toLowerCase().includes(l))}if(i.sort((l,c)=>a==="date-asc"?l.date.localeCompare(c.date):a==="stars-desc"&&c.stars-l.stars||c.date.localeCompare(l.date)),i.length===0){Ot(e,"没有找到匹配的记录");return}let o="",v=null;for(const l of i){if(l.date!==o){o=l.date,v=u("div",{className:"archive-date-card"});const p=i.filter(y=>y.date===o).reduce((y,b)=>y+(b.stars||0),0);v.innerHTML=`
        <div class="archive-date-card-header">
          <span class="archive-date-label">${oe(l.date)}</span>
          <span class="archive-date-stars">&#x2B50; ${p} 星</span>
        </div>
        <div class="archive-date-card-grid"></div>
      `,e.appendChild(v)}ue.find(p=>p.id===l.taskId);const c=Qe(l.subjectId),r=St(l),d=u("div",{className:"archive-item"});d.innerHTML=`
      <div class="archive-item-dot" style="background:${c?c.color:"#94A3B8"};"></div>
      <div class="archive-item-info">
        <div class="archive-item-title">${h(r)}</div>
        <div class="archive-item-meta">
          <span style="color:${c?c.color:"#94A3B8"};">${c?c.icon+" "+c.name:"🎯 特别行动"}</span>
          ${l.stars>0?`<span>&#x2B50; ${l.stars}</span>`:""}
        </div>
      </div>
      <div class="archive-item-undo" title="撤回">&#x21A9;</div>
    `,d.addEventListener("click",async()=>{if(await Ht("撤回确认",`确定要撤回「${r}」的打卡记录吗？星星也将被收回。`))try{if((await Ee(l.taskId,l.date)).state.action==="undone"){He(),_(`已撤回「${r}」`);const b=document.querySelector("#tabArchive");b&&lt(b)}}catch(y){_(`撤回失败: ${y.message}`,"error")}});const f=v.querySelector(".archive-date-card-grid");f&&f.appendChild(d)}}async function Qt(e){if(e)try{let $=function(m,g,F){const C=u("div",{className:"cal-split-col"}),j=u("div",{className:"cal-split-header"}),U=F.reduce((w,Y)=>w+Y.stars,0),G=F.filter(w=>w.hasActivity).length;j.textContent=`${g}  ${U}星 ${G}天`,C.appendChild(j);const se=u("div",{className:"cal-split-week"});b.forEach(w=>se.appendChild(u("span",{},w))),C.appendChild(se);let D=u("div",{className:"cal-split-row"});const de=new Date(F[0].date+"T00:00:00").getDay();for(let w=0;w<de;w++)D.appendChild(u("div",{className:"cal-s2-cell cal-s2-empty"}));for(const w of F){if(new Date(w.date+"T00:00:00").getDay()===0&&D.children.length>0){for(;D.children.length<7;)D.appendChild(u("div",{className:"cal-s2-cell cal-s2-empty"}));C.appendChild(D),D=u("div",{className:"cal-split-row"})}const P=["cal-s2-cell"];w.isToday&&P.push("cal-s2-today"),w.isSunday&&P.push("cal-s2-sun"),w.isTravel&&P.push("cal-s2-travel"),w.hasActivity&&P.push("cal-s2-on");const K=u("div",{className:P.join(" "),title:`${oe(w.date)}  ${w.stars}星 ${w.count}项`}),ht=w.date.slice(8).replace(/^0/,""),ft=r[w.date],we=ft?Rt.find(De=>De.id===ft):null;if(w.hasActivity){const De=Math.min(Math.floor(w.stars/8*(k.length-1)),k.length-1),[is,cs,os]=k[De];K.style.background=`rgb(${is},${cs},${os})`,K.style.color=De>=4?"#fff":"#374151"}else w.isSunday?(K.style.background="#F1F5F9",K.style.color="#94A3B8"):w.isTravel?(K.style.background="#FEF9C3",K.style.color="#B45309"):(K.style.background="#F8FAFC",K.style.color="#9CA3AF");K.innerHTML=we?`<span class="cal-date-num">${ht}</span><span class="cal-mood-emoji">${we.icon}</span><span class="cal-mood-label">${we.label}</span>`:`<span class="cal-date-num">${ht}</span>`,K.title=`${oe(w.date)}${w.hasActivity?"  "+w.stars+"星 "+w.count+"项":""}${we?"  "+we.label:""}`,D.appendChild(K)}for(;D.children.length<7;)D.appendChild(u("div",{className:"cal-s2-cell cal-s2-empty"}));return C.appendChild(D),C};var t=$;Me(e);const n=await pe(),s=await Bt(),a=await je(),i=await xs();e.innerHTML="";const o=u("div",{className:"stats-rank-card"});o.innerHTML=`
      <div class="stats-rank-icon" style="background:${s.color}20; color:${s.color};">
        ${s.icon}
      </div>
      <div class="stats-rank-info">
        <div class="stats-rank-name" style="color:${s.color};">${h(s.title)}</div>
        ${s.nextTitle?`
          <div class="stats-rank-bar-container">
            <div class="stats-rank-bar">
              <div class="stats-rank-bar-fill" style="width:${(s.progress||0)*100}%; background:${s.color};"></div>
            </div>
            <span class="stats-rank-bar-label">距离 ${s.nextTitle} 还需努力</span>
          </div>
        `:'<div class="stats-rank-max-label">&#x1F451; 已达最高等级！</div>'}
      </div>
    `,e.appendChild(o);const v=u("div",{className:"stats-key-row"});v.innerHTML=`
      <div class="stats-key-item">
        <div class="stats-key-value">${n.totalStars}</div>
        <div class="stats-key-label">累计星星</div>
      </div>
      <div class="stats-key-item">
        <div class="stats-key-value">${n.activeDays}</div>
        <div class="stats-key-label">活跃天数</div>
      </div>
      <div class="stats-key-item">
        <div class="stats-key-value">${n.streak}</div>
        <div class="stats-key-label">连续打卡</div>
      </div>
      <div class="stats-key-item">
        <div class="stats-key-value">${n.maxStreak}</div>
        <div class="stats-key-label">最长连续</div>
      </div>
    `,e.appendChild(v);const l=await it(),c=await Le();if(c.length>0||l.activeCase){const m=u("div",{className:"stats-section"});if(m.innerHTML='<div class="section-title">🕵️‍♂️ 谜案侦破</div>',l.activeCase){const g=l.activeCase,F=Math.round(g.progress*100),C=u("div",{className:"mystery-card mystery-card-active"});C.innerHTML=`
          <div class="mystery-card-header">
            <span class="mystery-card-icon">${g.icon}</span>
            <span class="mystery-card-title">${h(g.title)}</span>
            <span class="mystery-card-badge">侦办中</span>
          </div>
          <div class="mystery-card-desc">${h(g.desc)}</div>
          <div class="mystery-card-track">
            <div class="mystery-card-fill" style="width:${F}%;"></div>
          </div>
          <div class="mystery-card-hint">线索收集：${g.cluesCollected}/${g.cluesNeeded}（每次打卡有${Math.round(40)}%概率获得线索）</div>
        `,m.appendChild(C)}if(c.length>0){const g=u("div",{className:"mystery-solved-title"});g.innerHTML=`已侦破案件 (${c.length}/${l.totalCases})`,m.appendChild(g);const F=u("div",{className:"mystery-solved-list"}),C=c.slice(-8).reverse();for(const j of C){const U=u("div",{className:"mystery-solved-item"});U.innerHTML=`
            <span class="mystery-solved-icon">✅</span>
            <span class="mystery-solved-name">${h(j.caseTitle)}</span>
            <span class="mystery-solved-date">${j.solvedAt?j.solvedAt.slice(0,10):""}</span>
          `,F.appendChild(U)}m.appendChild(F)}if(l.allSolved){const g=u("div",{className:"mystery-all-done"});g.innerHTML="🏆 全部案件已侦破！你是真正的传奇侦探！",m.appendChild(g)}e.appendChild(m)}const r=await E("moods")||{},d=u("div",{className:"stats-section"});d.innerHTML='<div class="section-title">&#x1F4C5; 侦探之旅</div>';const f=i.filter(m=>m.hasActivity).length,p=i.reduce((m,g)=>m+g.stars,0),y=u("div",{className:"journey-bar"});y.innerHTML=`
      <span>${i.length}天旅程</span>
      <span class="journey-bar-sep">|</span>
      <span>${f}天打卡</span>
      <span class="journey-bar-sep">|</span>
      <span>${p}星</span>
    `,d.appendChild(y);const b=["日","一","二","三","四","五","六"],k=[[235,250,240],[187,247,208],[134,224,167],[74,200,120],[34,170,80],[139,92,246]],S=i.filter(m=>m.date.startsWith("2026-07")),A=i.filter(m=>m.date.startsWith("2026-08")),N=u("div",{className:"calendar-split"});N.appendChild($("07","七月",S)),N.appendChild($("08","八月",A)),d.appendChild(N);const R=u("div",{className:"cal-split-legend"});R.innerHTML=`
      <span>少</span>
      <span class="cal-split-dot" style="background:rgb(187,247,208)"></span>
      <span class="cal-split-dot" style="background:rgb(134,224,167)"></span>
      <span class="cal-split-dot" style="background:rgb(74,200,120)"></span>
      <span class="cal-split-dot" style="background:rgb(34,170,80)"></span>
      <span class="cal-split-dot" style="background:rgb(139,92,246)"></span>
      <span>多</span>
    `,d.appendChild(R),e.appendChild(d);const T=u("div",{className:"stats-section"});T.innerHTML='<div class="section-title">&#x1F4C6; 每周小结</div>';const L={};for(const m of i){const g=new Date(m.date+"T00:00:00"),F=g.getDay(),C=new Date(g);C.setDate(g.getDate()-(F===0?6:F-1));const j=C.toISOString().slice(0,10);L[j]||(L[j]={start:j,days:[],stars:0,active:0}),L[j].days.push(m),m.hasActivity&&(L[j].stars+=m.stars,L[j].active++)}const x=await E("case_closed")||{},B=await Le(),be=Object.keys(L).sort().filter(m=>L[m].active>0||L[m].days.some(g=>g.isToday));if(be.length>0){const m=u("div",{className:"week-summary-grid"});for(const g of be.slice(-6)){const F=L[g];if(F.active===0&&!F.days.some(D=>D.isToday))continue;const C=new Date(g);C.setDate(C.getDate()+6);const j=C.toISOString().slice(0,10),U=B.filter(D=>D.solvedAt&&D.solvedAt.slice(0,10)>=g&&D.solvedAt.slice(0,10)<=j).length,G=u("div",{className:"week-card"}),se=F.days.some(D=>D.isToday);G.innerHTML=`
          <div class="week-card-header ${se?"week-current":""}">
            ${g.slice(5)} 起
            ${se?'<span class="week-current-badge">本周</span>':""}
          </div>
          <div class="week-card-stats">
            <div class="week-stat">
              <div class="week-stat-val">${F.active}</div>
              <div class="week-stat-lbl">打卡天</div>
            </div>
            <div class="week-stat">
              <div class="week-stat-val">${F.stars}</div>
              <div class="week-stat-lbl">星星</div>
            </div>
            <div class="week-stat">
              <div class="week-stat-val">${U}</div>
              <div class="week-stat-lbl">破案</div>
            </div>
          </div>
        `,m.appendChild(G)}T.appendChild(m)}else{const m=u("div",{className:"achievements-empty"});m.innerHTML="<p>开始打卡后这里会显示每周小结</p>",T.appendChild(m)}e.appendChild(T);const ge=u("div",{className:"stats-section"});ge.innerHTML='<div class="section-title">&#x1F4CA; 学科进度</div>';const Oe=u("div",{className:"skill-rings"}),We=2*Math.PI*36;for(const m of le){const g=n.subjectStats[m.id];if(!g)continue;const F=g.percentage||0,C=We*(1-F/100),j=F>0,U=u("div",{className:"skill-ring-card"});U.innerHTML=`
        <svg class="skill-ring-svg ${j?"skill-ring-glow":""}" viewBox="0 0 80 80">
          <defs>
            <filter id="glow_${m.id}">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <circle cx="40" cy="40" r="34" fill="none" stroke="#E2E8F0" stroke-width="5"/>
          ${j?`
          <circle cx="40" cy="40" r="34" fill="none" stroke="${m.color}"
            stroke-width="5" stroke-linecap="round" opacity="0.25"
            stroke-dasharray="${We}" stroke-dashoffset="${C}"
            transform="rotate(-90 40 40)" filter="url(#glow_${m.id})"/>
          `:""}
          <circle cx="40" cy="40" r="34" fill="none" stroke="${m.color}"
            stroke-width="5" stroke-linecap="round"
            stroke-dasharray="${We}" stroke-dashoffset="${C}"
            transform="rotate(-90 40 40)"
            style="transition: stroke-dashoffset 0.8s ease;"/>
          <text x="40" y="38" text-anchor="middle" font-size="18" fill="#374151">${m.icon}</text>
          <text x="40" y="54" text-anchor="middle" font-size="10" font-weight="700" fill="${m.color}">
            ${g.totalTasks>0?F+"%":""}
          </text>
        </svg>
        <div class="skill-ring-info">
          <div class="skill-ring-name">${h(m.name)}</div>
          <div class="skill-ring-stats">
            ${g.totalTasks>0?`<span>${g.completedUnique}/${g.totalTasks} 项</span>`:`<span>打卡${g.records}次</span>`}
            <span>${g.stars} 星</span>
            ${g.totalTasks>0?`<span>${F}%</span>`:""}
          </div>
        </div>
      `,Oe.appendChild(U)}ge.appendChild(Oe),e.appendChild(ge);const Ce=u("div",{className:"stats-section"});if(Ce.innerHTML='<div class="section-title">&#x1F3C6; 成就徽章</div>',a.length===0){const m=u("div",{className:"achievements-empty"});m.innerHTML="<p>还没有解锁任何成就，继续努力吧！</p>",Ce.appendChild(m)}else{const m=u("div",{className:"achievements-grid"});for(const g of a){const F=u("div",{className:"achievement-badge"});F.innerHTML=`
          <div class="achievement-badge-icon">${g.icon}</div>
          <div class="achievement-badge-title">${h(g.title)}</div>
          <div class="achievement-badge-desc">${h(g.desc)}</div>
          <div class="achievement-badge-date">${g.unlockedAt||""}</div>
        `,m.appendChild(F)}Ce.appendChild(m)}e.appendChild(Ce);const Se=u("div",{className:"stats-section"});Se.innerHTML='<div class="section-title">&#x1F4DD; 探案笔记（学习日记）</div>';const pt=await E("diary")||{},vt=Object.keys(pt).sort().reverse();if(vt.length===0){const m=u("div",{className:"achievements-empty"});m.innerHTML="<p>还没有写过探案笔记，完成一天的所有任务后可以记录心得哦！</p>",Se.appendChild(m)}else{const m=u("div",{className:"diary-list"});for(const g of vt.slice(0,14)){const F=pt[g];if(!F||!F.text)continue;const C=u("div",{className:"diary-item"});C.innerHTML=`
          <div class="diary-item-date">${oe(g)}</div>
          <div class="diary-item-text">${h(F.text)}</div>
          ${F.stars?'<div class="diary-item-stars">&#x2B50; +'+F.stars+"</div>":""}
        `,m.appendChild(C)}Se.appendChild(m)}e.appendChild(Se);const ss=u("div",{className:"stats-section"});ss.innerHTML='<div class="section-title">&#x1F4C1; 数据管理</div>';const Te=u("div",{className:"backup-actions"});Te.innerHTML=`
      <p class="backup-hint">定期备份数据，防止丢失。数据仅存储在本设备浏览器中。</p>
      <div class="backup-buttons">
        <button class="btn btn-primary backup-btn-export">&#x1F4E5; 导出备份</button>
        <button class="btn btn-secondary backup-btn-import">&#x1F4E4; 导入恢复</button>
      <input type="file" id="backupFileInput" accept=".json" style="display:none;">
    `;const ns=Te.querySelector(".backup-btn-export"),as=Te.querySelector(".backup-btn-import"),Re=Te.querySelector("#backupFileInput");ns.addEventListener("click",async()=>{try{const m=await re(),g=await je(),F=await tt(),C=await E("diary")||{},j=await E("blindbox_history")||[],U=await E("case_closed")||{},G={version:1,exportedAt:new Date().toISOString(),progress:m,achievements:g,suggested:F,diary:C,blindboxHistory:j,caseClosed:U},se=JSON.stringify(G,null,2),D=new Blob([se],{type:"application/json"}),de=URL.createObjectURL(D),w=document.createElement("a");w.href=de,w.download=`detective_backup_${W()}.json`,w.click(),URL.revokeObjectURL(de),_("备份文件已下载！","success")}catch(m){_("导出失败: "+m.message,"error")}}),as.addEventListener("click",()=>{Re.click()}),Re.addEventListener("change",async m=>{const g=m.target.files[0];if(g)try{const F=await g.text(),C=JSON.parse(F);if(!C.version||!C.progress)throw new Error("备份文件格式不正确");if(!await new Promise(w=>{confirm("导入将覆盖当前所有数据，确定继续吗？")?w(!0):w(!1)})){Re.value="";return}const U=ls();if(!U)throw new Error("数据库未初始化");const G=U.transaction(["progress","achievements","suggested","state"],"readwrite"),se=G.objectStore("progress");await new Promise((w,Y)=>{const P=se.clear();P.onsuccess=w,P.onerror=Y});for(const w of C.progress){const{id:Y,...P}=w;se.add(P)}const D=G.objectStore("achievements");await new Promise((w,Y)=>{const P=D.clear();P.onsuccess=w,P.onerror=Y});for(const w of C.achievements||[])D.add(w);const de=G.objectStore("suggested");await new Promise((w,Y)=>{const P=de.clear();P.onsuccess=w,P.onerror=Y});for(const w of C.suggested||[])de.add(w);await new Promise((w,Y)=>{G.oncomplete=w,G.onerror=Y}),C.diary&&await q("diary",C.diary),C.blindboxHistory&&await q("blindbox_history",C.blindboxHistory),C.caseClosed&&await q("case_closed",C.caseClosed),_("数据恢复成功！页面即将刷新...","success"),setTimeout(()=>location.reload(),1500)}catch(F){console.error("Import failed:",F),_("导入失败: "+F.message,"error")}});const Ae=u("div",{className:"stats-section"});Ae.innerHTML='<div class="section-title">&#x1F381; 证据陈列室</div>';const yt=await E("blindbox_history")||[];if(yt.length===0){const m=u("div",{className:"achievements-empty"});m.innerHTML="<p>还没有收集到证物，多完成任务来发现线索吧！</p>",Ae.appendChild(m)}else{const m=u("div",{className:"achievements-grid"});for(const g of yt.slice(0,12)){const F=u("div",{className:"achievement-badge"});F.innerHTML=`
          <div class="achievement-badge-icon">${g.icon||"&#x1F381;"}</div>
          <div class="achievement-badge-title">${h(g.title||"神秘证物")}</div>
          <div class="achievement-badge-desc">${h(g.desc||"")}</div>
        `,m.appendChild(F)}Ae.appendChild(m)}e.appendChild(Ae)}catch(n){console.error("renderTabStats failed:",n),Be(e,`统计加载失败: ${n.message}`,()=>Qt(e))}}function Qs(){const e=ue.filter(n=>n.subject==="en"),t=[];for(const n of e){const s=n.content.split(`
`).filter(Boolean);for(const a of s){const i=a.indexOf(" ");if(i<0)continue;const o=a.slice(0,i).trim(),v=a.slice(i+1).trim();o&&v&&t.push({id:`${n.id}_${t.length}`,word:o,meaning:v,unitId:n.id,unitTitle:n.title,category:n.category||""})}}return t}function Zs(){const e=Qs(),t=new Map;for(const n of e)t.has(n.unitId)||t.set(n.unitId,{unitId:n.unitId,unitTitle:n.unitTitle,category:n.category,words:[]}),t.get(n.unitId).words.push(n);return[...t.values()]}let he=0,Z=0,xe=!1,Tt=0,At=0,ne=!0,J=[];async function Zt(e){if(e)try{Me(e);const t=Zs();if(t.length===0){Ot(e,"还没有英文单词数据");return}J=await E("mastered_words")||[];const n=new Set(J);e.innerHTML="";const s=u("div",{className:"word-toolbar"}),a=u("select",{className:"word-select"});t.forEach((c,r)=>{const d=document.createElement("option");d.value=r;const f=c.words.filter(p=>n.has(p.id)).length;d.textContent=`${c.unitTitle} (${f}/${c.words.length})`,r===he&&(d.selected=!0),a.appendChild(d)}),a.addEventListener("change",()=>{he=parseInt(a.value),Z=Ve(t,0),xe=!1,ve(e,t)}),s.appendChild(a);const i=u("button",{className:`word-filter-btn ${ne?"active":""}`,onClick:()=>{ne=!ne,i.classList.toggle("active",ne),i.textContent=ne?"未掌握":"全部",Z=ne?Ve(t,0):0,ve(e,t)}},ne?"未掌握":"全部");s.appendChild(i),e.appendChild(s);const o=u("div",{className:"word-card-area",id:"wordCardArea"});e.appendChild(o);const v=u("div",{className:"word-actions",id:"wordActions"});e.appendChild(v);const l=u("div",{className:"word-nav"});e.appendChild(l),ne&&(Z=Ve(t,0)),ve(e,t)}catch(t){console.error("renderTabWords failed:",t),Be(e,`加载失败: ${t.message}`,()=>Zt(e))}}function Ve(e,t){const n=e[he];if(!n)return t;const s=new Set(J);for(let a=t;a<n.words.length;a++)if(!s.has(n.words[a].id))return a;return t}function ut(e){if(!e)return[];if(!ne)return e.words;const t=new Set(J);return e.words.filter(n=>!t.has(n.id))}async function ve(e,t){const n=t[he];if(!n||n.words.length===0)return;const s=ut(n);if(s.length===0){const r=e.querySelector("#wordCardArea");r&&(r.innerHTML='<div class="word-all-mastered">🎉 本单元单词已全部掌握！</div>');const d=e.querySelector(".word-nav");d&&(d.innerHTML="");const f=e.querySelector("#wordActions");f&&(f.innerHTML="");return}Z>=s.length&&(Z=0);const a=s[Z];if(!a)return;const i=e.querySelector("#wordCardArea"),o=e.querySelector(".word-nav"),v=e.querySelector("#wordActions");if(!i||!o||!v)return;const l=J.includes(a.id);xe=!1,i.innerHTML=`
    <div class="word-card-container" id="wordCard">
      <div class="word-card ${l?"word-mastered":""}">
        <div class="word-card-front">
          <div class="word-card-unit">${h(a.unitTitle)}</div>
          <div class="word-card-word">${h(a.word)}</div>
          <div class="word-card-hint">点击翻转查看释义</div>
        </div>
        <div class="word-card-back">
          <div class="word-card-unit">${h(a.unitTitle)}</div>
          <div class="word-card-word-sm">${h(a.word)}</div>
          <div class="word-card-meaning">${h(a.meaning)}</div>
          <div class="word-card-hint">点击翻回</div>
        </div>
      </div>
    </div>
  `;const c=i.querySelector("#wordCard");c&&(c.addEventListener("click",()=>{xe=!xe,c.querySelector(".word-card").classList.toggle("flipped",xe)}),c.addEventListener("touchstart",r=>{Tt=r.touches[0].clientX,At=r.touches[0].clientY},{passive:!0}),c.addEventListener("touchend",r=>{const d=r.changedTouches[0].clientX-Tt,f=r.changedTouches[0].clientY-At;Math.abs(d)>50&&Math.abs(d)>Math.abs(f)&&(d<0?Je(e,t):Dt(e,t))})),v.innerHTML=`
    <button class="word-action-btn word-action-know" id="wordKnow">
      ${l?"✅ 已掌握":"💡 我会了"}
    </button>
  `,v.querySelector("#wordKnow").addEventListener("click",async()=>{l?(J=J.filter(d=>d!==a.id),_("已取消标记")):(J.push(a.id),_("已标记为掌握")),await q("mastered_words",J);const r=e.querySelector(".word-select");if(r){const d=new Set(J);Array.from(r.options).forEach((f,p)=>{if(t[p]){const y=t[p].words.filter(b=>d.has(b.id)).length;f.textContent=`${t[p].unitTitle} (${y}/${t[p].words.length})`}})}ne&&J.includes(a.id)?Je(e,t):ve(e,t)}),o.innerHTML=`
    <button class="word-nav-btn" id="wordPrev">&#9664; 上一词</button>
    <span class="word-nav-progress">${Z+1} / ${s.length}</span>
    <button class="word-nav-btn" id="wordNext">下一词 &#9654;</button>
  `,o.querySelector("#wordPrev").addEventListener("click",()=>Dt(e,t)),o.querySelector("#wordNext").addEventListener("click",()=>Je(e,t))}function Dt(e,t){const n=t[he],s=ut(n);s.length!==0&&(Z=(Z-1+s.length)%s.length,ve(e,t))}function Je(e,t){const n=t[he],s=ut(n);s.length!==0&&(Z=(Z+1)%s.length,ve(e,t))}let ye="search",_t=!1;function en(){const e=M("#app");if(!e){console.error("FATAL: #app element not found"),document.body.innerHTML='<div style="padding:40px;text-align:center;color:red;">应用初始化失败：找不到根元素 #app</div>';return}e.innerHTML=`
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
  `}function tn(e){if(ye===e)return;ye=e,Ge(".tab-btn").forEach(a=>{a.classList.toggle("active",a.dataset.tab===e)}),Ge(".side-nav-btn").forEach(a=>{a.classList.toggle("active",a.dataset.tab===e)}),Ge(".tab-content").forEach(a=>{a.classList.toggle("active",a.id===`tab${es(e)}`)}),ts()}function es(e){return e.charAt(0).toUpperCase()+e.slice(1)}async function ts(){try{const e=Wt();switch(ye){case"search":{const t=M("#tabSearch");t&&await z(t,e);break}case"archive":{const t=M("#tabArchive");t&&await lt(t);break}case"stats":{const t=M("#tabStats");t&&await Qt(t);break}case"words":{const t=M("#tabWords");t&&await Zt(t);break}}}catch(e){console.error(`Failed to render tab ${ye}:`,e);const t=M(`#tab${es(ye)}`);t&&(t.innerHTML=`
        <div class="error-container">
          <div class="error-icon">&#x1F50D;</div>
          <p class="error-text">页面渲染失败: ${e.message}</p>
          <button class="btn btn-primary" onclick="location.reload()">刷新页面</button>
        </div>
      `)}}function sn(){const e=s=>{const a=s.target.closest(".tab-btn, .side-nav-btn");if(!a)return;const i=a.dataset.tab;i&&tn(i)},t=M("#tabNav");t&&t.addEventListener("click",e);const n=M("#sideNav");n&&n.addEventListener("click",e),document.addEventListener("click",()=>{zs()},{once:!0}),document.addEventListener("keydown",s=>{var a,i;if(ye==="search"){if(s.key==="ArrowLeft"){s.preventDefault();const o=(a=M("#dateNav"))==null?void 0:a.querySelector(".date-nav-prev");o&&!o.disabled&&o.click()}else if(s.key==="ArrowRight"){s.preventDefault();const o=(i=M("#dateNav"))==null?void 0:i.querySelector(".date-nav-next");o&&!o.disabled&&o.click()}}})}async function jt(){try{console.log("[App] Starting initialization..."),en(),console.log("[App] Skeleton rendered"),sn(),console.log("[App] Events bound");try{await us(),_t=!0,console.log("[App] Database opened")}catch(e){console.error("[App] Database open failed:",e),_("数据库初始化失败，部分功能不可用","error",4e3)}if(_t)try{await ks(),console.log("[App] Suggested dates assigned")}catch(e){console.warn("[App] Suggested dates assignment failed:",e)}await an(),console.log("[App] Initialization complete")}catch(e){console.error("[App] Fatal initialization error:",e);const t=M("#app");t&&(t.innerHTML=`
        <div class="error-container" style="padding:60px 20px;">
          <div class="error-icon" style="font-size:60px;">&#x1F6AB;</div>
          <h2 style="margin:16px 0;color:#EF4444;">应用启动失败</h2>
          <p class="error-text">${e.message||"未知错误"}</p>
          <p style="font-size:12px;color:#94A3B8;margin-top:8px;">
            请检查浏览器是否支持 IndexedDB。<br>
            推荐使用 Chrome、Edge 或 Safari 最新版本。
          </p>
          <button class="btn btn-primary" style="margin-top:16px;" onclick="location.reload()">
            重新加载
          </button>
        </div>
      `)}}async function nn(){try{const e=M("#sideStats");if(e)try{await ie(e)}catch{}const t=M("#sideMystery");if(t)try{const n=await it();if(n.allSolved)t.innerHTML='<div class="side-mystery side-mystery-done">🏆 全部案件已侦破！</div>';else if(n.activeCase){const s=n.activeCase,a=Math.round(s.progress*100);t.innerHTML=`
            <div class="side-mystery">
              <div class="side-mystery-header">🔍 当前谜案</div>
              <div class="side-mystery-title">${s.icon} ${h(s.title)}</div>
              <div class="side-mystery-track"><div class="side-mystery-fill" style="width:${a}%"></div></div>
              <div class="side-mystery-hint">线索 ${s.cluesCollected}/${s.cluesNeeded} · 已破 ${n.solvedCount}/${n.totalCases}</div>
            </div>`}}catch{t.innerHTML=""}}catch(e){console.error("[App] Sidebar render failed:",e)}}async function an(){try{await nn();const e=M("#headerStats");if(e)try{await ie(e)}catch(n){console.error("[App] Header stats render failed:",n),e.innerHTML='<div class="header-stats-error">统计加载失败</div>'}const t=M("#dateNav");if(t)try{Is(t,async n=>{try{const s=M("#tabSearch");s&&await z(s,n);const a=M("#headerStats");if(a)try{await ie(a)}catch{}const i=M("#sideStats");if(i)try{await ie(i)}catch{}}catch(s){console.error("[App] Date change render failed:",s)}})}catch(n){console.error("[App] Date nav render failed:",n)}await ts()}catch(e){console.error("[App] Render failed:",e),_("页面渲染失败，请刷新重试","error",4e3)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",jt):jt();
