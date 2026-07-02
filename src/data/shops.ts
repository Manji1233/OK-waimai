// OK外卖 商品数据 - 10家店

export interface Flavor {
  id: string
  nameZh: string
  nameEn: string
  addPrice: number
  image?: string
}

export interface Addon {
  id: string
  nameZh: string
  nameEn: string
  addPrice: number
  image?: string
}

export interface Product {
  id: string
  nameZh: string
  nameEn: string
  price: number
  calories: number
  unit: string
  flavors: Flavor[]
  addons: Addon[]
  tags: string[]
  image?: string
  seckillPrice?: number
  bargainPrice?: number
}

export interface Shop {
  id: string
  nameZh: string
  nameEn: string
  image: string
  slogan?: string
  tags?: string[]
  deliveryFee: number
  minOrder: number
  packageFee: number
  products: Product[]
}

export const shops: Shop[] = [
  {
    id: 'shop_tehaogou', nameZh: '特好购', nameEn: 'Tehaogou',
    image: '/static/products/p_thg_chips.jpg', slogan: '零食饮料 · 快乐补给站', tags: ['零食', '秒杀', '下午茶'],
    deliveryFee: 3, minOrder: 20, packageFee: 2,
    products: [
      { id: 'p_thg_chips', nameZh: '薯片', nameEn: 'Potato Chips', price: 6.0, calories: 547, unit: '包', flavors: [], addons: [], tags: ["seckill"], image: '/static/products/p_thg_chips.jpg', seckillPrice: 3.9 },
      { id: 'p_thg_cola', nameZh: '可乐', nameEn: 'Cola', price: 1.5, calories: 108, unit: '瓶', flavors: [], addons: [], tags: [], image: '/static/products/p_thg_cola.png' },
      { id: 'p_thg_latiao', nameZh: '辣条', nameEn: 'Spicy Strip', price: 1.2, calories: 70, unit: '包', flavors: [], addons: [], tags: [], image: '/static/products/p_thg_latiao.png' },
      { id: 'p_thg_choc', nameZh: '巧克力', nameEn: 'Chocolate', price: 6.5, calories: 109, unit: '块', flavors: [], addons: [], tags: ["bargain"], image: '/static/products/p_thg_choc.jpg', bargainPrice: 3.0 },
      { id: 'p_thg_guoba', nameZh: '锅巴', nameEn: 'Rice Crust', price: 2.5, calories: 90, unit: '包', flavors: [], addons: [], tags: [], image: '/static/products/p_thg_guoba.png' },
      { id: 'p_thg_xuebing', nameZh: '旺旺雪饼', nameEn: 'Snow Cookie', price: 3.5, calories: 100, unit: '包', flavors: [], addons: [], tags: [], image: '/static/products/p_thg_xuebing.png' },
      { id: 'p_thg_oreo', nameZh: '奥利奥', nameEn: 'Oreo', price: 5.5, calories: 144, unit: '包', flavors: [], addons: [], tags: [], image: '/static/products/p_thg_oreo.png' },
      { id: 'p_thg_maodu', nameZh: '素毛肚', nameEn: 'Vegan Tripe', price: 3.0, calories: 36, unit: '包', flavors: [], addons: [], tags: [], image: '/static/products/p_thg_maodu.png' },
    ],
  },
  {
    id: 'shop_friedchicken', nameZh: '第一家炸鸡店', nameEn: 'Fried Chicken',
    image: '/static/products/p_fc_chicken.png', slogan: '酥脆炸物 · 热门套餐', tags: ['炸鸡', '热卖', '可乐搭配'],
    deliveryFee: 4, minOrder: 25, packageFee: 3,
    products: [
      { id: 'p_fc_chicken', nameZh: '炸鸡', nameEn: 'Fried Chicken', price: 21.5, calories: 560, unit: '份', flavors: [], addons: [], tags: ["seckill"], image: '/static/products/p_fc_chicken.png', seckillPrice: 12.9 },
      { id: 'p_fc_leg', nameZh: '炸鸡腿', nameEn: 'Fried Drumstick', price: 11.3, calories: 260, unit: '个', flavors: [], addons: [], tags: [], image: '/static/products/p_fc_leg.jpg' },
      { id: 'p_fc_wing', nameZh: '炸鸡翅', nameEn: 'Fried Wing', price: 15.0, calories: 290, unit: '份', flavors: [], addons: [], tags: ["bargain"], image: '/static/products/p_fc_wing.jpg', bargainPrice: 8.0 },
      { id: 'p_fc_cola', nameZh: '可乐', nameEn: 'Cola', price: 4.0, calories: 108, unit: '杯', flavors: [], addons: [], tags: [], image: '/static/products/p_fc_cola.png' },
      { id: 'p_fc_fries', nameZh: '薯条', nameEn: 'Fries', price: 10.0, calories: 312, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_fc_fries.jpg' },
      { id: 'p_fc_egg', nameZh: '蛋挞', nameEn: 'Egg Tart', price: 5.0, calories: 250, unit: '个', flavors: [], addons: [], tags: [], image: '/static/products/p_fc_egg.jpg' },
    ],
  },
  {
    id: 'shop_malatang', nameZh: '天天向上麻辣烫', nameEn: 'Malatang',
    image: '/static/products/p_ml_family.png', slogan: '荤素自选 · 暖胃一碗', tags: ['麻辣烫', '多人餐', '暖心'],
    deliveryFee: 2, minOrder: 20, packageFee: 2,
    products: [
      { id: 'p_ml_one', nameZh: '一人食麻辣烫', nameEn: 'Solo Malatang', price: 25.0, calories: 600, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_ml_one.png' },
      { id: 'p_ml_family', nameZh: '全家福麻辣烫', nameEn: 'Family Malatang', price: 52.5, calories: 1200, unit: '份', flavors: [], addons: [], tags: ["seckill"], image: '/static/products/p_ml_family.png', seckillPrice: 32.9 },
      { id: 'p_ml_10meat', nameZh: '十荤八素', nameEn: '10 Meat 8 Veg', price: 40.0, calories: 800, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_ml_10meat.png' },
      { id: 'p_ml_tomato', nameZh: '酸甜番茄麻辣烫', nameEn: 'Tomato Malatang', price: 30.0, calories: 650, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_ml_tomato.png' },
      { id: 'p_ml_herb', nameZh: '草本麻辣烫', nameEn: 'Herbal Malatang', price: 33.0, calories: 600, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_ml_herb.png' },
    ],
  },
  {
    id: 'shop_luosifen', nameZh: '广西螺蛳粉', nameEn: 'Luosifen',
    image: '/static/products/p_lsf_lsf.jpg', slogan: '酸辣鲜香 · 嗦粉专门店', tags: ['粉面', '酸辣', '人气'],
    deliveryFee: 3, minOrder: 20, packageFee: 1,
    products: [
      { id: 'p_lsf_lsf', nameZh: '螺蛳粉', nameEn: 'Luosifen', price: 20.0, calories: 750, unit: '碗', flavors: [], addons: [], tags: ["bargain"], image: '/static/products/p_lsf_lsf.jpg', bargainPrice: 10.0 },
      { id: 'p_lsf_tangshui', nameZh: '木薯糖水', nameEn: 'Cassava Soup', price: 8.0, calories: 300, unit: '碗', flavors: [], addons: [], tags: [], image: '/static/products/p_lsf_tangshui.jpg' },
      { id: 'p_lsf_ganban', nameZh: '干拌螺蛳粉', nameEn: 'Dry Luosifen', price: 21.0, calories: 700, unit: '碗', flavors: [], addons: [], tags: [], image: '/static/products/p_lsf_ganban.png' },
    ],
  },
  {
    id: 'shop_xinjiang', nameZh: '新疆馆', nameEn: 'Xinjiang Restaurant',
    image: '/static/products/p_xj_dapanji.jpg', slogan: '大盘鸡烤串 · 西域风味', tags: ['新疆菜', '大份量', '招牌'],
    deliveryFee: 5, minOrder: 30, packageFee: 4,
    products: [
      { id: 'p_xj_sheep', nameZh: '烤全羊', nameEn: 'Roast Whole Lamb', price: 1600.0, calories: 4000, unit: '只', flavors: [], addons: [], tags: ["bargain"], image: '/static/products/p_xj_sheep.jpg', bargainPrice: 800 },
      { id: 'p_xj_dapanji', nameZh: '大盘鸡', nameEn: 'Big Plate Chicken', price: 108.0, calories: 1500, unit: '份', flavors: [], addons: [], tags: ["seckill"], image: '/static/products/p_xj_dapanji.jpg', seckillPrice: 68.0 },
      { id: 'p_xj_skewer', nameZh: '羊肉串', nameEn: 'Lamb Skewer', price: 6.5, calories: 125, unit: '串', flavors: [{ id: 'f1', nameZh: '微辣', nameEn: 'Mild', addPrice: 0, image: '/static/products/p_xj_skewer.png' },
 { id: 'f2', nameZh: '中辣', nameEn: 'Medium', addPrice: 0, image: '/static/products/p_xj_skewer.png' },
 { id: 'f3', nameZh: '变态辣', nameEn: 'Extra Hot', addPrice: 0 }], addons: [{ id: 'a1', nameZh: '加孜然', nameEn: 'Extra Cumin', addPrice: 1, image: '/static/products/p_xj_skewer.png' },
 { id: 'a2', nameZh: '加芝麻', nameEn: 'Extra Sesame', addPrice: 1 }], tags: [], image: '/static/products/p_xj_skewer.png' },
      { id: 'p_xj_zhuafan', nameZh: '手抓饭', nameEn: 'Polo', price: 33.0, calories: 700, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_xj_zhuafan.jpg' },
      { id: 'p_xj_nang', nameZh: '馕', nameEn: 'Nang', price: 7.5, calories: 560, unit: '个', flavors: [], addons: [], tags: [], image: '/static/products/p_xj_nang.png' },
      { id: 'p_xj_baozi', nameZh: '烤包子', nameEn: 'Baked Bun', price: 8.0, calories: 260, unit: '个', flavors: [], addons: [], tags: [], image: '/static/products/p_xj_baozi.png' },
    ],
  },
  {
    id: 'shop_dongbei', nameZh: '东北馆', nameEn: 'Dongbei',
    image: '/static/products/p_db_guobaorou.jpg', slogan: '锅包肉铁锅炖 · 东北硬菜', tags: ['东北菜', '下饭', '家庭餐'],
    deliveryFee: 4, minOrder: 30, packageFee: 3,
    products: [
      { id: 'p_db_guobaorou', nameZh: '锅包肉', nameEn: 'Guo Bao Rou', price: 48.0, calories: 750, unit: '份', flavors: [], addons: [], tags: ["bargain"], image: '/static/products/p_db_guobaorou.jpg', bargainPrice: 28 },
      { id: 'p_db_mushroom', nameZh: '小鸡炖蘑菇', nameEn: 'Chicken & Mushroom', price: 68.0, calories: 680, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_db_mushroom.png' },
      { id: 'p_db_lapi', nameZh: '大拉皮', nameEn: 'Da La Pi', price: 23.0, calories: 450, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_db_lapi.jpg' },
      { id: 'p_db_dumpling', nameZh: '饺子', nameEn: 'Dumplings', price: 30.0, calories: 550, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_db_dumpling.jpg' },
      { id: 'p_db_tieguo', nameZh: '铁锅炖', nameEn: 'Iron Pot Stew', price: 163.0, calories: 1300, unit: '锅', flavors: [], addons: [], tags: ["seckill"], image: '/static/products/p_db_tieguo.png', seckillPrice: 99.0 },
    ],
  },
  {
    id: 'shop_hunan', nameZh: '湖南馆', nameEn: 'Hunan',
    image: '/static/products/p_hn_yutou.png', slogan: '剁椒香辣 · 湘味下饭', tags: ['湘菜', '香辣', '鱼头'],
    deliveryFee: 4, minOrder: 30, packageFee: 3,
    products: [
      { id: 'p_hn_yutou', nameZh: '剁椒鱼头', nameEn: 'Chopped Chili Fish Head', price: 83.0, calories: 480, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_hn_yutou.png' },
      { id: 'p_hn_chao', nameZh: '辣椒炒肉', nameEn: 'Chili Fried Pork', price: 43.0, calories: 660, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_hn_chao.png' },
      { id: 'p_hn_beef', nameZh: '小炒黄牛肉', nameEn: 'Stir-fried Beef', price: 58.0, calories: 600, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_hn_beef.jpg' },
      { id: 'p_hn_duck', nameZh: '酱板鸭', nameEn: 'Spicy Duck', price: 45.0, calories: 1250, unit: '只', flavors: [], addons: [], tags: ["seckill"], image: '/static/products/p_hn_duck.jpg', seckillPrice: 26.9 },
    ],
  },
  {
    id: 'shop_yue', nameZh: '粤菜馆', nameEn: 'Cantonese',
    image: '/static/products/p_yue_chicken.png', slogan: '广式烧腊 · 清鲜点心', tags: ['粤菜', '点心', '清鲜'],
    deliveryFee: 5, minOrder: 30, packageFee: 4,
    products: [
      { id: 'p_yue_chicken', nameZh: '白切鸡', nameEn: 'White Cut Chicken', price: 68.0, calories: 570, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_yue_chicken.png' },
      { id: 'p_yue_goose', nameZh: '广式烧鹅', nameEn: 'Roast Goose', price: 83.0, calories: 525, unit: '半只', flavors: [], addons: [], tags: [], image: '/static/products/p_yue_goose.jpg' },
      { id: 'p_yue_xiajiao', nameZh: '虾饺', nameEn: 'Shrimp Dumpling', price: 33.0, calories: 200, unit: '笼', flavors: [], addons: [], tags: [], image: '/static/products/p_yue_xiajiao.png' },
      { id: 'p_yue_fotiao', nameZh: '佛跳墙', nameEn: 'Buddha Jumps Over Wall', price: 128.0, calories: 300, unit: '位', flavors: [], addons: [], tags: ["seckill"], image: '/static/products/p_yue_fotiao.png', seckillPrice: 78.0 },
      { id: 'p_yue_wonton', nameZh: '云吞面', nameEn: 'Wonton Noodle', price: 30.0, calories: 560, unit: '碗', flavors: [], addons: [], tags: [], image: '/static/products/p_yue_wonton.jpg' },
      { id: 'p_yue_shuangpi', nameZh: '双皮奶', nameEn: 'Milk Pudding', price: 18.5, calories: 240, unit: '碗', flavors: [], addons: [], tags: [], image: '/static/products/p_yue_shuangpi.jpg' },
      { id: 'p_yue_baozai', nameZh: '煲仔饭', nameEn: 'Claypot Rice', price: 38.5, calories: 750, unit: '份', flavors: [], addons: [], tags: ["bargain"], image: '/static/products/p_yue_baozai.jpg', bargainPrice: 20 },
    ],
  },
  {
    id: 'shop_chuanyu', nameZh: '川渝馆', nameEn: 'Sichuan',
    image: '/static/products/p_cy_huoguo.jpg', slogan: '麻辣鲜香 · 川渝热辣', tags: ['川菜', '火锅', '麻辣'],
    deliveryFee: 5, minOrder: 30, packageFee: 4,
    products: [
      { id: 'p_cy_huoguo', nameZh: '火锅', nameEn: 'Hot Pot', price: 100.0, calories: 1500, unit: '人', flavors: [], addons: [], tags: ["seckill"], image: '/static/products/p_cy_huoguo.jpg', seckillPrice: 59.0 },
      { id: 'p_cy_gongbao', nameZh: '宫保鸡丁', nameEn: 'Kung Pao Chicken', price: 37.0, calories: 440, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_cy_gongbao.jpg' },
      { id: 'p_cy_shuizhu', nameZh: '水煮鱼', nameEn: 'Boiled Fish', price: 83.0, calories: 720, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_cy_shuizhu.jpg' },
      { id: 'p_cy_mapo', nameZh: '麻婆豆腐', nameEn: 'Mapo Tofu', price: 27.0, calories: 300, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_cy_mapo.jpg' },
      { id: 'p_cy_feipian', nameZh: '夫妻肺片', nameEn: 'Fuqi Feipian', price: 43.0, calories: 400, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_cy_feipian.jpg' },
    ],
  },
  {
    id: 'shop_anhui', nameZh: '安徽馆', nameEn: 'Anhui',
    image: '/static/products/p_ah_guiyu.jpg', slogan: '徽州风味 · 汤鲜菜香', tags: ['徽菜', '烧饼', '汤品'],
    deliveryFee: 3, minOrder: 25, packageFee: 2,
    products: [
      { id: 'p_ah_guiyu', nameZh: '黄山臭鳜鱼', nameEn: 'Stinky Mandarin Fish', price: 93.0, calories: 450, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_ah_guiyu.jpg' },
      { id: 'p_ah_doufu', nameZh: '毛豆腐', nameEn: 'Hairy Tofu', price: 30.0, calories: 270, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_ah_doufu.png' },
      { id: 'p_ah_chicken', nameZh: '黄山炖鸡', nameEn: 'Stewed Chicken', price: 78.0, calories: 600, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_ah_chicken.png' },
      { id: 'p_ah_niurou', nameZh: '牛肉锅子', nameEn: 'Beef Pot', price: 108.0, calories: 800, unit: '份', flavors: [], addons: [], tags: ["seckill"], image: '/static/products/p_ah_niurou.png', seckillPrice: 66.0 },
      { id: 'p_ah_shaobing', nameZh: '黄山烧饼', nameEn: 'Huangshan Biscuit', price: 12.5, calories: 350, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_ah_shaobing.png' },
      { id: 'p_ah_jitang', nameZh: '肥西老母鸡汤', nameEn: 'Old Hen Soup', price: 68.0, calories: 400, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_ah_jitang.png' },
    ],
  },
  {
    id: 'shop_guizhou', nameZh: '贵州馆', nameEn: 'Guizhou',
    image: '/static/products/p_gz_yutang.png', slogan: '酸汤开胃 · 黔味小吃', tags: ['贵州菜', '酸汤', '小吃'],
    deliveryFee: 3, minOrder: 25, packageFee: 2,
    products: [
      { id: 'p_gz_yutang', nameZh: '酸汤鱼', nameEn: 'Sour Soup Fish', price: 93.0, calories: 650, unit: '份', flavors: [], addons: [], tags: ["seckill"], image: '/static/products/p_gz_yutang.png', seckillPrice: 56.0 },
      { id: 'p_gz_siwawa', nameZh: '丝娃娃', nameEn: 'Siwawa', price: 33.0, calories: 300, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_gz_siwawa.png' },
      { id: 'p_gz_duoduofen', nameZh: '夺夺粉', nameEn: 'Duo Duo Fen', price: 30.0, calories: 450, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_gz_duoduofen.png' },
      { id: 'p_gz_laziji', nameZh: '贵州辣子鸡', nameEn: 'Guizhou Spicy Chicken', price: 58.0, calories: 750, unit: '份', flavors: [], addons: [], tags: ["bargain"], image: '/static/products/p_gz_laziji.png', bargainPrice: 30 },
      { id: 'p_gz_midoufu', nameZh: '米豆腐', nameEn: 'Rice Tofu', price: 15.0, calories: 200, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_gz_midoufu.jpg' },
      { id: 'p_gz_yuanzi', nameZh: '豆腐圆子', nameEn: 'Tofu Ball', price: 18.5, calories: 370, unit: '份', flavors: [], addons: [], tags: [], image: '/static/products/p_gz_yuanzi.png' },
    ],
  },
]

export const DEFAULT_ADDRESS = '北京市朝阳区森林路1号'

export const carriers = [
  { id: 'rabbit', nameZh: '兔子', nameEn: 'Rabbit', scene: 'forest', image: '/static/rabbit-courier.png' },
  { id: 'haaland', nameZh: '哈兰德', nameEn: 'Haaland', scene: 'football', image: '/static/haaland.png' },
  { id: 'ronaldo', nameZh: 'C罗', nameEn: 'Ronaldo', scene: 'football', image: '/static/ronaldo.jpg' },
  { id: 'messi', nameZh: '梅西', nameEn: 'Messi', scene: 'football', image: '/static/messi.png' },
  { id: 'mbappe', nameZh: '姆巴佩', nameEn: 'Mbappé', scene: 'football', image: '/static/mbappe.jpg' },
  { id: 'neymar', nameZh: '内马尔', nameEn: 'Neymar', scene: 'football', image: '/static/neymar.png' },
  { id: 'rice', nameZh: '赖斯', nameEn: 'Rice', scene: 'football', image: '/static/rice.png' },
]

export const themes = [
  { id: 'orange', nameZh: '橙色', nameEn: 'Orange', primary: '#FF6A00' },
  { id: 'purple', nameZh: '紫色', nameEn: 'Purple', primary: '#7C4DFF' },
  { id: 'blue', nameZh: '蓝色', nameEn: 'Blue', primary: '#2196F3' },
  { id: 'mint', nameZh: '薄荷', nameEn: 'Mint', primary: '#26A69A' },
]