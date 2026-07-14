/**
 * 全部任务定义
 * 古籍破译(yw): 27篇八上古诗文背诵
 * 密文翻译(en): 16组（七下U1-U8 + 八上U1-U8，共265词）
 * 密码解析(sx): 章节任务
 * 现场重建(wl): 章节任务
 * 体能训练(sp): 运动任务
 * 特别行动(ot): 自定义任务
 */

export const TASKS = [
  // ==================== 古籍破译 (yw) - 27篇（八上） ====================
  { id: 'yw_01', subject: 'yw', title: '三峡', author: '郦道元', content: '自三峡七百里中，两岸连山，略无阙处。重岩叠嶂，隐天蔽日，自非亭午夜分，不见曦月。\n\n至于夏水襄陵，沿溯阻绝。或王命急宣，有时朝发白帝，暮到江陵，其间千二百里，虽乘奔御风，不以疾也。\n\n春冬之时，则素湍绿潭，回清倒影，绝巘多生怪柏，悬泉瀑布，飞漱其间，清荣峻茂，良多趣味。\n\n每至晴初霜旦，林寒涧肃，常有高猿长啸，属引凄异，空谷传响，哀转久绝。故渔者歌曰："巴东三峡巫峡长，猿鸣三声泪沾裳。"', category: '文言文' },
  { id: 'yw_02', subject: 'yw', title: '答谢中书书', author: '陶弘景', content: '山川之美，古来共谈。高峰入云，清流见底。两岸石壁，五色交辉。青林翠竹，四时俱备。晓雾将歇，猿鸟乱鸣；夕日欲颓，沉鳞竞跃。实是欲界之仙都。自康乐以来，未复有能与其奇者。', category: '文言文' },
  { id: 'yw_03', subject: 'yw', title: '记承天寺夜游', author: '苏轼', content: '元丰六年十月十二日夜，解衣欲睡，月色入户，欣然起行。念无与为乐者，遂至承天寺寻张怀民。怀民亦未寝，相与步于中庭。庭下如积水空明，水中藻、荇交横，盖竹柏影也。何夜无月？何处无竹柏？但少闲人如吾两人者耳。', category: '文言文' },
  { id: 'yw_04', subject: 'yw', title: '与朱元思书', author: '吴均', content: '风烟俱净，天山共色。从流飘荡，任意东西。自富阳至桐庐一百许里，奇山异水，天下独绝。\n\n水皆缥碧，千丈见底。游鱼细石，直视无碍。急湍甚箭，猛浪若奔。\n\n夹岸高山，皆生寒树，负势竞上，互相轩邈，争高直指，千百成峰。泉水激石，泠泠作响；好鸟相鸣，嘤嘤成韵。蝉则千转不穷，猿则百叫无绝。鸢飞戾天者，望峰息心；经纶世务者，窥谷忘反。横柯上蔽，在昼犹昏；疏条交映，有时见日。', category: '文言文' },
  { id: 'yw_05', subject: 'yw', title: '野望', author: '王绩', content: '东皋薄暮望，徙倚欲何依。\n树树皆秋色，山山唯落晖。\n牧人驱犊返，猎马带禽归。\n相顾无相识，长歌怀采薇。', category: '诗歌' },
  { id: 'yw_06', subject: 'yw', title: '黄鹤楼', author: '崔颢', content: '昔人已乘黄鹤去，此地空余黄鹤楼。\n黄鹤一去不复返，白云千载空悠悠。\n晴川历历汉阳树，芳草萋萋鹦鹉洲。\n日暮乡关何处是？烟波江上使人愁。', category: '诗歌' },
  { id: 'yw_07', subject: 'yw', title: '使至塞上', author: '王维', content: '单车欲问边，属国过居延。\n征蓬出汉塞，归雁入胡天。\n大漠孤烟直，长河落日圆。\n萧关逢候骑，都护在燕然。', category: '诗歌' },
  { id: 'yw_08', subject: 'yw', title: '渡荆门送别', author: '李白', content: '渡远荆门外，来从楚国游。\n山随平野尽，江入大荒流。\n月下飞天镜，云生结海楼。\n仍怜故乡水，万里送行舟。', category: '诗歌' },
  { id: 'yw_09', subject: 'yw', title: '钱塘湖春行', author: '白居易', content: '孤山寺北贾亭西，水面初平云脚低。\n几处早莺争暖树，谁家新燕啄春泥。\n乱花渐欲迷人眼，浅草才能没马蹄。\n最爱湖东行不足，绿杨阴里白沙堤。', category: '诗歌' },
  { id: 'yw_10', subject: 'yw', title: '庭中有奇树', author: '《古诗十九首》', content: '庭中有奇树，绿叶发华滋。\n攀条折其荣，将以遗所思。\n馨香盈怀袖，路远莫致之。\n此物何足贵？但感别经时。', category: '诗歌' },
  { id: 'yw_11', subject: 'yw', title: '龟虽寿', author: '曹操', content: '神龟虽寿，犹有竟时；\n腾蛇乘雾，终为土灰。\n老骥伏枥，志在千里；\n烈士暮年，壮心不已。\n盈缩之期，不但在天；\n养怡之福，可得永年。\n幸甚至哉，歌以咏志。', category: '诗歌' },
  { id: 'yw_12', subject: 'yw', title: '赠从弟（其二）', author: '刘桢', content: '亭亭山上松，瑟瑟谷中风。\n风声一何盛，松枝一何劲！\n冰霜正惨凄，终岁常端正。\n岂不罹凝寒？松柏有本性。', category: '诗歌' },
  { id: 'yw_13', subject: 'yw', title: '梁甫行', author: '曹植', content: '八方各异气，千里殊风雨。\n剧哉边海民，寄身于草野。\n妻子象禽兽，行止依林阻。\n柴门何萧条，狐兔翔我宇。', category: '诗歌' },
  { id: 'yw_14', subject: 'yw', title: '得道多助，失道寡助', author: '《孟子》', content: '天时不如地利，地利不如人和。三里之城，七里之郭，环而攻之而不胜。夫环而攻之，必有得天时者矣，然而不胜者，是天时不如地利也。城非不高也，池非不深也，兵革非不坚利也，米粟非不多也，委而去之，是地利不如人和也。故曰：域民不以封疆之界，固国不以山溪之险，威天下不以兵革之利。得道者多助，失道者寡助。寡助之至，亲戚畔之；多助之至，天下顺之。以天下之所顺，攻亲戚之所畔，故君子有不战，战必胜矣。', category: '文言文' },
  { id: 'yw_15', subject: 'yw', title: '富贵不能淫', author: '《孟子》', content: '景春曰："公孙衍、张仪岂不诚大丈夫哉？一怒而诸侯惧，安居而天下熄。"孟子曰："是焉得为大丈夫乎？子未学礼乎？丈夫之冠也，父命之；女子之嫁也，母命之，往送之门，戒之曰：\'往之女家，必敬必戒，无违夫子！\'以顺为正者，妾妇之道也。居天下之广居，立天下之正位，行天下之大道。得志，与民由之；不得志，独行其道。富贵不能淫，贫贱不能移，威武不能屈。此之谓大丈夫。"', category: '文言文' },
  { id: 'yw_16', subject: 'yw', title: '生于忧患，死于安乐', author: '《孟子》', content: '舜发于畎亩之中，傅说举于版筑之间，胶鬲举于鱼盐之中，管夷吾举于士，孙叔敖举于海，百里奚举于市。故天将降大任于是人也，必先苦其心志，劳其筋骨，饿其体肤，空乏其身，行拂乱其所为，所以动心忍性，曾益其所不能。\n\n人恒过，然后能改；困于心，衡于虑，而后作；征于色，发于声，而后喻。入则无法家拂士，出则无敌国外患者，国恒亡。然后知生于忧患而死于安乐也。', category: '文言文' },
  { id: 'yw_17', subject: 'yw', title: '愚公移山', author: '《列子》', content: '太行、王屋二山，方七百里，高万仞，本在冀州之南，河阳之北。北山愚公者，年且九十，面山而居。惩山北之塞，出入之迂也，聚室而谋曰："吾与汝毕力平险，指通豫南，达于汉阴，可乎？"杂然相许。其妻献疑曰："以君之力，曾不能损魁父之丘，如太行、王屋何？且焉置土石？"杂曰："投诸渤海之尾，隐土之北。"遂率子孙荷担者三夫，叩石垦壤，箕畚运于渤海之尾。邻人京城氏之孀妻有遗男，始龀，跳往助之。寒暑易节，始一反焉。\n\n河曲智叟笑而止之曰："甚矣，汝之不惠！以残年余力，曾不能毁山之一毛，其如土石何？"北山愚公长息曰："汝心之固，固不可彻，曾不若孀妻弱子。虽我之死，有子存焉。子又生孙，孙又生子；子又有子，子又有孙；子子孙孙无穷匮也，而山不加增，何苦而不平？"河曲智叟亡以应。操蛇之神闻之，惧其不已也，告之于帝。帝感其诚，命夸娥氏二子负二山，一厝朔东，一厝雍南。自此，冀之南，汉之阴，无陇断焉。', category: '文言文' },
  { id: 'yw_18', subject: 'yw', title: '周亚夫军细柳', author: '司马迁', content: '文帝之后六年，匈奴大入边。乃以宗正刘礼为将军，军霸上；祝兹侯徐厉为将军，军棘门；以河内守亚夫为将军，军细柳：以备胡。上自劳军。至霸上及棘门军，直驰入，将以下骑送迎。已而之细柳军，军士吏被甲，锐兵刃，彀弓弩，持满。天子先驱至，不得入。先驱曰："天子且至！"军门都尉曰："将军令曰\'军中闻将军令，不闻天子之诏\'。"居无何，上至，又不得入。于是上乃使使持节诏将军："吾欲入劳军。"亚夫乃传言开壁门。壁门士吏谓从属车骑曰："将军约，军中不得驱驰。"于是天子乃按辔徐行。至营，将军亚夫持兵揖曰："介胄之士不拜，请以军礼见。"天子为动，改容式车。使人称谢："皇帝敬劳将军。"成礼而去。既出军门，群臣皆惊。文帝曰："嗟乎，此真将军矣！曩者霸上、棘门军，若儿戏耳，其将固可袭而虏也。至于亚夫，可得而犯邪！"称善者久之。', category: '文言文' },
  { id: 'yw_19', subject: 'yw', title: '饮酒（其五）', author: '陶渊明', content: '结庐在人境，而无车马喧。\n问君何能尔？心远地自偏。\n采菊东篱下，悠然见南山。\n山气日夕佳，飞鸟相与还。\n此中有真意，欲辨已忘言。', category: '诗歌' },
  { id: 'yw_20', subject: 'yw', title: '春望', author: '杜甫', content: '国破山河在，城春草木深。\n感时花溅泪，恨别鸟惊心。\n烽火连三月，家书抵万金。\n白头搔更短，浑欲不胜簪。', category: '诗歌' },
  { id: 'yw_21', subject: 'yw', title: '雁门太守行', author: '李贺', content: '黑云压城城欲摧，甲光向日金鳞开。\n角声满天秋色里，塞上燕脂凝夜紫。\n半卷红旗临易水，霜重鼓寒声不起。\n报君黄金台上意，提携玉龙为君死。', category: '诗歌' },
  { id: 'yw_22', subject: 'yw', title: '赤壁', author: '杜牧', content: '折戟沉沙铁未销，自将磨洗认前朝。\n东风不与周郎便，铜雀春深锁二乔。', category: '诗歌' },
  { id: 'yw_23', subject: 'yw', title: '渔家傲', author: '李清照', content: '天接云涛连晓雾，星河欲转千帆舞。仿佛梦魂归帝所，闻天语，殷勤问我归何处。\n\n我报路长嗟日暮，学诗谩有惊人句。九万里风鹏正举。风休住，蓬舟吹取三山去！', category: '宋词' },
  { id: 'yw_24', subject: 'yw', title: '浣溪沙', author: '晏殊', content: '一曲新词酒一杯，去年天气旧亭台。夕阳西下几时回？\n\n无可奈何花落去，似曾相识燕归来。小园香径独徘徊。', category: '宋词' },
  { id: 'yw_25', subject: 'yw', title: '采桑子', author: '欧阳修', content: '轻舟短棹西湖好，绿水逶迤，芳草长堤。隐隐笙歌处处随。\n\n无风水面琉璃滑，不觉船移，微动涟漪。惊起沙禽掠岸飞。', category: '宋词' },
  { id: 'yw_26', subject: 'yw', title: '相见欢', author: '朱敦儒', content: '金陵城上西楼，倚清秋。万里夕阳垂地大江流。\n\n中原乱，簪缨散，几时收？试倩悲风吹泪过扬州。', category: '宋词' },
  { id: 'yw_27', subject: 'yw', title: '如梦令', author: '李清照', content: '常记溪亭日暮，沉醉不知归路。兴尽晚回舟，误入藕花深处。争渡，争渡，惊起一滩鸥鹭。', category: '宋词' },

  // ==================== 密文翻译 (en) - 16组（七下+八上单词） ====================
  { id: 'en_01', subject: 'en', title: '七下 U1', content: 'advice 建议\nencourage 鼓励；激励\nretire （令）退职；（使）退休\ncheerful 快乐的；高兴的\ncommunity 社区\nmedical 医学的；医疗的\nfried 油炸的；油煎的；油炒的\nwherever 各处；处处\nfuture 将来；未来\nsoon 很快；马上；不久\nsmart 聪明的；机敏的\nattention 专心；注意力\nseldom 不常；很少；难得\nbored （对某人/事物）厌倦的；烦闷的\nstrict 要求严格的；严厉的\nrelative 亲戚；亲属\nuniform 制服；校服\npersonality 性格；个性\ncharacteristic 特点；品质\ntopic 话题；标题\nactive 忙碌的；活跃的\nsmartphone 智能手机\nwisely 聪明地；明智地\ncompetition 比赛；竞赛\nshower 淋浴\nonline 在线的\nsite 建筑工地\nnarrow 狭窄的；窄小的\nsuperman 超人\ngive up 认输；放弃\nused to 曾经\nin the future 在未来\nbe strict about 对……要求严格\nbe worried about 担心', category: '七下词汇' },
  { id: 'en_02', subject: 'en', title: '七下 U2', content: 'wine 葡萄酒\nmatch 配对\nrich 丰富多彩的\nlie 位于；坐落在\ncafe 咖啡馆；小餐馆\nexcellent 优秀的；极好的\ncoast 海岸；海滨\nperfect 正合适\nmostly 主要地；通常\nreceive 接待；招待；拿到；接到；收到\nkey 主要的；关键的\nremain 仍然是；保持不变\nlift 电梯；升降机\nstep 台阶\nstair 楼梯\nmotorcycle 摩托车\nsightseeing 观光；游览\nimagine 想象；设想\ndestination 目的地；终点\naddress 住址；地址\ngovernment 政府\nunique 独特的；罕见的\nendangered 濒危的\nstretch 延伸；绵延\nhuge 巨大的；极多的\nwild 野的；野生的；自然环境\ndiscover 了解到；查明\nvolcano 火山\nrange 山脉\nsnowmobile 雪地机动车\nwolf 狼\ndepartment store 百货商店\nprefer to 更喜欢\nby hand 用手工\ngo sightseeing 去观光\ngo on a trip 去旅行\nset up 建立\ngiant panda 大熊猫\nin the wild 在野外\nall year round 全年\ngolden monkey 金丝猴\ngo hiking 去远足\nhot spring 温泉', category: '七下词汇' },
  { id: 'en_03', subject: 'en', title: '七下 U3', content: 'branch 树枝\nroot 根；根茎\nsilent 不说话的；沉默的\noverlook 忽略；未注意到\nhuman 人\noxygen 氧；氧气\ncreate 创造\nenvironment 自然环境\nconvenient 便利的；方便的\nfurniture （可移动的）家具\nwood 木；木头\ntreat 以……态度对待\ncommunicate 交流；沟通\nspecies 种；物种\nproduct 产品；制品\nside 一面\nborrow 借；借用\ndig 掘（地）；凿（洞）；挖（土）\nhole 洞；孔；坑\nstick 棍；条\naccident 意外；偶然的事\nknowledge 知识；学问\ncharacter 文字\nspread 传播\ntranslation 译文；译本\ntake in 吸收；摄入\ngreenhouse gas 温室气体\nto begin with 首先；第一点\ncome from 来自\nlook around 环视；环顾；四下察看\nbe made of 由……制成\nfor example 例如；譬如\ncommunicate with 与……沟通\ncall on 号召；动员；要求\naccording to 据（……所说）；按（……所报道）\nby accident 偶然；意外地', category: '七下词汇' },
  { id: 'en_04', subject: 'en', title: '七下 U4', content: 'dolphin 海豚\nhen 母鸡\nblind 瞎的；失明的\nwool （羊等的）毛\nsir 先生\nreceptionist 接待员\nallow 允许进入（或出去、通过）\napologize 道歉\nasleep 睡着\nsmoke 烟\nfireman 消防队员\ntype 类型；种类\nsearch-and-rescue 搜索救援\nservice 服务\ndisaster 灾难；灾害\nguest 旅客；房客\nteam 组；班\ntransport 运输；运送\nguard 守卫；保卫\nhoney 蜂蜜\nmaterial 材料；原料\neither 也\nshark 鲨鱼\nscared 害怕；恐惧\ngrey 灰色的\nsomewhere 在某处；到某处\nprobably 很可能；大概\nsource 来源；出处\nsometime 在某时\nextinct 已灭绝的；绝种的\neffort 艰难的尝试；试图\nlead (somebody) to 带着（某人）到\nfall asleep 入睡；睡着\nget down 俯身；趴下；跪下\nfire engine 消防车', category: '七下词汇' },
  { id: 'en_05', subject: 'en', title: '七下 U5', content: 'everyday 每天的；日常的\nform 类型；种类\njourney （尤指长途）旅行\ndrop 滴；水珠\ntap 水龙头\nvoice 说话声\neventually 最后；终于\npipe 管子\nreturn 回去；返回\nrush 迅速移动\nbath 洗澡；洗浴\nsalt 含盐的；咸的\nbrain 脑\nfix 修理\npublic 公共的；公开的\npopulation 人口\nagriculture 农业\ntrade 贸易；买卖\nindustry 工业；生产制造\nrole 角色\ngoods 商品；货品\noverseas 在国外；向海外\nglobal 全球的；全世界的\nincome 收入；收益；所得\nnearly 几乎；差不多；将近\nbusiness 买卖；生意\nleisure 闲暇；空闲；休闲\nthroughout 自始至终；贯穿整个时期\nduty 责任；义务\na bit 有点儿；稍微\nat once 立即；马上\ndrinking water 饮用水\nplay a role in 在……起作用\nsteam engine 蒸汽机\nas a result 作为结果；因此\nmake sure 确保；设法保证', category: '七下词汇' },
  { id: 'en_06', subject: 'en', title: '七下 U6', content: 'battery 电池\nelectricity 电；电能\nswitch-off 关闭（电灯、机器等）的\ntask 任务；活动\nwhile 一段时间；一会儿\ntablet 平板电脑\nfridge 冰箱\nyogurt 酸奶\napartment 公寓套房\nhousehold 家庭的\nagainst 紧靠；碰；撞\nspeed 速度；速率\nsafety 安全；平安\ninstruction 用法说明；操作指南\nconnect （使）连接\ndevice 装置；设备\nrule 规则；条例\nclimate 气候\namount 数量；数额\npower 驱动；推动（机器或车辆）\ntelevision set 电视机\nlandmark 地标\nhave something in common 有相同的特征\nlight bulb 电灯泡\nair conditioner 空调机\nvideo game 电子游戏\nrun out of 用完；耗尽\ngo bad 变质\nelectric car 电动汽车\nelectrical appliance 电器\ncare about 关注；担忧\nclimate change 气候变化\njoin in 参加；加入', category: '七下词汇' },
  { id: 'en_07', subject: 'en', title: '七下 U7', content: 'contribution 贡献\nhero 英雄\npioneer 先锋；先驱\ntechnology 科技\nreceive 接待；招待；拿到；接到；收到\nengineering 工程学\naward 授予；奖励；奖\neducation 教育\nspend 花（时间）；度过\nresearch 研究；调查\nachieve （凭长期努力）达到\nwell-respected 受尊敬的\nfound 建立（城镇或国家）\neager 热切的；渴望的\nraise 增加；提高\nmission 使命\napproval 赞成；同意\npraise 赞扬；称赞；赞美\nsociety 社会\nfemale 女的；女性的\nadmire 钦佩；仰慕\ninspire 激励；鼓舞\nregular 通常的；平常的\nfeed 养活；提供食物\nsmokejumper 空降消防员\nthick 茂密的\ncertain 某个；特定的\nkill 杀死；导致死亡\ntool 工具\ndead 失去生命的；枯萎的\nbrave 勇敢的；无畏的\ntough 健壮的；坚韧不拔的\nfit 健壮的；健康的\notherwise 否则；不然\nsurvive 生存；存活\nproud 骄傲的；自豪的\nrole model 楷模；行为榜样\nin the field of 在……领域\ndevote yourself to 献身；致力\ncollege entrance examination 大学入学考试\nlook up to 敬仰；钦佩\nsugar pill 糖丸\nchief engineer 总工程师\nput out 熄灭；扑灭\nbe able to 能够\nbe proud of 为……而自豪', category: '七下词汇' },
  { id: 'en_08', subject: 'en', title: '七下 U8', content: 'possible 可能\nathlete 运动员\nbiologist 生物学家\ninstrument 乐器；仪器\ninterest 兴趣；业余爱好\ncareer 生涯；职业\nlifetime 一生；终身\ndiamond 钻石\nbelt 腰带\nshoot 冲；奔；飞驰\nextremely 极其；极端；非常\ncurious 求知欲强的；好奇的\nincrease 增长；增多；增加\nhost 主持\nbeyond 在另一边；在（或向）更远处\naudience 观众；听众\nlively 充满趣味的；令人兴奋的\nactually 事实上\nsale 驾驶（或乘坐）帆船航行\nability 才能；本领\nreview 评论\nperform 演出；表演\nkiss 吻\nhug 拥抱；搂抱\nmethod 方法；办法\ncompare 将……比作\nnowadays 现今；现在；目前\nhuman being 人\nlecture 讲座；讲课；演讲\ngo outside 外出\nmore and more 越来越多\nbody language 肢体语言\ndream of 梦想\ncome true 实现；成为现实', category: '七下词汇' },

  // ==================== 密文翻译 (en) - 8组（八上单词） ====================
  { id: 'en_09', subject: 'en', title: '八上 U1', content: 'dinosaur 恐龙\nintelligent 有才智的；聪明的\ntalented 有才能的；天才的\nartistic 有艺术天赋的；（尤指）有美术才能的\nperhaps 可能；大概；也许\nnotebook 笔记本\nvehicle 交通工具；车辆\nprehistoric 史前的\ncompletely 完全地；彻底地\noriginal 原来的；起初的\nbirth 出生\nsuffering 苦难；疼痛\nartist 艺术家；（尤指）画家\ndeath 死；死亡\nwhole 全部的；所有的\npiece 一首，一篇（作品）\neditor （书籍的）编辑\norganize 安排；组织\norder 顺序\nrecord 记录\ndie out 灭绝\na type of 一种\nbe related to 与......... 属于同一种类\ngeneral education 通识教育\ngo back a long way 历史悠久\nbe similar to 与...................相似\nalphabetical order 字母顺序\nplay an important role 起到重要作用', category: '八上词汇' },
  { id: 'en_10', subject: 'en', title: '八上 U2', content: 'flight （尤指乘飞机的）航程\nschedule 日程安排\neverywhere 到处；各个地方\nchallenge 向（某人）挑战\nprize 奖赏；奖励\npromise 承诺；保证\nchessboard 国际象棋棋盘\nsilver 银\nreply 回复；答复\nhesitation 犹豫\nwonder 想知道；琢磨\nagree 同意；赞成\nper cent 百分之............\ncurrently 目前；当前\ncheck 检查；核查\nbudget 预算\nprovince 省份\nsharply 急剧地；突然大幅度地\ncount 计算（或清点）总数\nsystem 系统\nsymbol 符号；记号\nrepresent 代表\nexactly 准确地；确切地\nflight schedule 航班时刻表\nprice tag 价格标签\nfor a moment 片刻；一会儿\nwithout hesitation 毫不犹豫\ngo up 上升\ngo down 下降\nwrite down 写下；记下\ninstead of 代替；作为...........的替换', category: '八上词汇' },
  { id: 'en_11', subject: 'en', title: '八上 U3', content: 'network 网络\nflood 洪水；水灾\nmultimedia 多媒体\nexpert 专家\nmobile 可移动的\npayment 付款；支付\nwarn 提醒注意；警告\ntreatment 治疗；疗法\ndata 数据\ncompany 公司\ntraffic 路上行驶的车辆；交通\nflow （人或事物）涌流；流动\nsmoothly 平稳地；连续而流畅地\nlaptop 笔记本电脑\nscreen 屏幕\nweight 重量\ndigital 数码的\nsocial 社交的\nmessage （书面或口头的）信息\ninterview 采访\npositive 正面的；积极的\nnegative 消极的\neffect 影响\nopinion 意见；看法\nnovel （长篇）小说\ncomment 评论\nbasis 基础\nmicroprocessor 微处理器\nmicrochip 微芯片；芯片\nmajor 主要的；重要的\nbreakthrough 突破；重大进展\nelectronic 电子的\nsoftware 软件\napp （application 的缩写）应用程序；应用软件\nera 时代；纪元\ndownload 下载\ntiny 微小的\nconnect to 连接\nbring big changes to 给……带来重大变化\nmobile payment 移动支付\ntake ....... for example 以……为例\nrubbish bin 垃圾箱\nsocial media 社交媒体\nin person 亲自；亲身\nthe general public 公众；大众', category: '八上词汇' },
  { id: 'en_12', subject: 'en', title: '八上 U4', content: 'balloon 气球\nwheel 轮；车轮\ncentral 在中心的\nalthough 虽然；尽管；即使\nattach 把..... 固定；把..................附（在……上）\npull 拉；拽；扯；拖\ninternational 国际的\npath 小路；小径\ntechnique 技巧；技艺\ndepend 需要；依靠\ndoubt 疑惑；疑问\npersonally 就个人意见\nprediction 预言；预测\nstatement 说明\nbenefit 益处；优势\nwing （飞行器的）翅膀；机翼\ndistance 距离\npetrol 汽油\navoid 避免；防止\nanywhere 在（或去）任何地方\nnotice 看（或听）到；注意到\ntype （印刷用的）活字\nmixture 混合物\nheat 加热；变热\npress （被）压\nmetal 金属\nsteam locomotive 蒸汽机车\ncrewed spacecraft 载人航天器\non foot 步行\na number of 几个；若干\ntake place 发生；进行\nfor instance 例如；比如\nlarge amounts of 大量\ninternational trade 国际贸易\ndepend on 依靠；依赖\nwithout doubt 毫无疑问\nof all time 自古以来；有史以来\nmake fun of 取笑；拿...........开玩笑\ntraffic jam 堵车；交通阻塞', category: '八上词汇' },
  { id: 'en_13', subject: 'en', title: '八上 U5', content: 'exchange 交流\nnervous 焦虑的；担忧的\ngrateful 感激的\nchopstick 筷子\ntour 旅行；旅游\ntai chi 太极（拳）\nyet 尚（未）；还；仍\nindependent 自主的\ncontent 内容\nfeeling 感觉；感情\nshock 震惊；令人震惊的事\nforeign 外国的\nconfused 糊涂的；迷惑的\nanxious 焦虑的；忧虑的\nphase 阶段；时期\nhoneymoon 蜜月\nunfamiliar 陌生的；不熟悉的\nhomesick 想家的\nlonely 孤独的\ndeal 对付；应付\nexpect 期待；盼望\nsituation 情况\naccept 接受\nadaptation 适应\nBeijing opera 京剧\nhost family 寄宿家庭\nsnake its way 蜿蜒\nculture shock 文化冲击\ndeal with 解决；处理\nfeel at home 感到舒适自在', category: '八上词汇' },
  { id: 'en_14', subject: 'en', title: '八上 U6', content: 'author 作者；作家\nremains 遗迹；遗址\nlocate 把........安置在（或建造于）\nsoldier 士兵\ncaptain 首领；领导者\nempty 空的\nvictory 胜利；成功\njoke 笑话；玩笑\nmidnight 午夜\nexcept 除........... 之外\nhide 藏；隐蔽\nsecretly 秘密地\nenter 进来；进入\nsucceed 达到目的；成功\ntrick 诡计\nbeat 打败（某人）\npretend 假装；佯装\nenemy 敌人\nfail 失败；未能（做到）\ntherefore 因此；所以\nwithin 在（某段时间）之内\nfill （使）充满；（使）装满\ntowards 向；朝；对着\nattack 袭击；攻击\nfog 雾\nmake jokes about 开............的玩笑\nsucceed in 在................方面成功\nbe tired of 厌烦\ngo on board 上船\nbe jealous of 嫉妒\nbe full of 装满；充满', category: '八上词汇' },
  { id: 'en_15', subject: 'en', title: '八上 U7', content: 'regularly 有规律地\nrepeat 重复\nnote 笔记；记录\nvisual 视觉的\nmentally 精神上\nlink 联系；相联系\nlist 清单\nespecially 尤其\ndiet 日常饮食\nmaintain 维持；保持\nnut 坚果\nrelax 放松；休息\nstressed 心力交瘁的；焦虑不安的\ntend 往往会；常常就\nnormal 正常的\nloss 丧失；损失\nfork 餐叉\nonion 洋葱\nant 蚂蚁\ncontext 上下文；语境\nimage 图像\nsense 感觉官能（即视、听、嗅、味、触五觉）\nsummary 总结；概括\ncontain 包含；含有\nparticular 专指的；特指的\nchemistry 化学性质；化学\nflash card 识字卡片\nmake a point of doing something （因重要或必要）保证做\nlast but not least 最后但同样重要的\nnatural disaster 自然灾害\nfigure out 弄懂；弄清楚', category: '八上词汇' },
  { id: 'en_16', subject: 'en', title: '八上 U8', content: 'attack 袭击；攻击\nfaithful 忠实的；忠诚的\nhold 抱着；拿着\nresponsible 可信任的；可信赖的\nawake 醒着\nflat 公寓\nchoice 选择\nadvise 劝告；建议\ncause 引起；造成；导致\ncomplain 抱怨；投诉\nlitter 垃圾\nunlikely 不大可能发生的\nrelieve 方便；解手\nindoors 在室内\nmagical 有魔力的\nwealth 钱财；财富\nqueen 女王；王后\nservant 仆人；佣人\npride 自豪；骄傲\namong 在............. 中\nrelationship 关系\ngrow up 长大；成熟\ncare for 照顾；照料\nin short 总之；简言之\nhave no choice but to do 别无选择；只能..............................\nrun free 四处自由走动\nlie around 懒散度日；游手好闲\ncomplain about 抱怨\nin addition 除..............以外（还）\ncatch the eye of somebody 引起某人的注意', category: '八上词汇' },
];

export function getTask(id) {
  return TASKS.find(t => t.id === id);
}

export function getTasksBySubject(subjectId) {
  return TASKS.filter(t => t.subject === subjectId);
}

export function getReciteTasks() {
  return TASKS.filter(t => t.subject === 'yw' || t.subject === 'en');
}

export function getChapterTasks() {
  return TASKS.filter(t => t.subject === 'sx' || t.subject === 'wl');
}

export const DAILY_TASKS = {
  yw: [
    { id: 'yw_daily_read', title: '阅读理解1篇', icon: '\u{1F4D6}' },
    { id: 'yw_daily_book', title: '推荐书目阅读', icon: '\u{1F4DA}' },
  ],
  en: [
    { id: 'en_daily_news', title: '时文阅读', icon: '\u{1F4F0}' },
    { id: 'en_daily_read', title: '阅读理解1篇', icon: '\u{1F4DD}', satAlt: '作文+听力', satIcon: '\u{1F3A7}' },
  ],
};

export function getDailyTasksForSubject(subjectId, dateStr, isSaturday) {
  const tasks = DAILY_TASKS[subjectId] || [];
  return tasks.map(t => {
    const isSat = isSaturday && t.satAlt;
    return {
      id: isSat ? t.id + '_sat' : t.id,
      title: isSat ? t.satAlt : t.title,
      icon: isSat ? (t.satIcon || t.icon) : t.icon,
      isSatVariant: isSat,
      originalId: t.id,
    };
  });
}

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
    { chapter: '第一章 机械运动', items: ['1.1 长度和时间的测量', '1.2 运动的描述', '1.3 运动的快慢', '1.4 测量平均速度'] },
    { chapter: '第二章 声现象', items: ['2.1 声音的产生与传播', '2.2 声音的特性', '2.3 声的利用', '2.4 噪声的危害和控制'] },
    { chapter: '第三章 物态变化', items: ['3.1 温度', '3.2 熔化和凝固', '3.3 汽化和液化', '3.4 升华和凝华'] },
    { chapter: '第四章 光现象', items: ['4.1 光的直线传播', '4.2 光的反射', '4.3 平面镜成像', '4.4 光的折射', '4.5 光的色散'] },
    { chapter: '第五章 透镜及其应用', items: ['5.1 透镜', '5.2 生活中的透镜', '5.3 凸透镜成像的规律', '5.4 眼睛和眼镜', '5.5 显微镜和望远镜'] },
    { chapter: '第六章 质量与密度', items: ['6.1 质量', '6.2 密度', '6.3 测量物质的密度', '6.4 密度与社会生活'] },
  ],
};
