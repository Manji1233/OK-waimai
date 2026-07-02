import { reactive, computed } from 'vue'
import { messages, type Lang } from '../locales'
import { themes, shops } from '../data/shops'

// ============ 全局状态（会话级，刷新重置） ============

export interface CartItem {
  shopId: string
  productId: string
  nameZh: string
  nameEn: string
  flavorId: string
  flavorNameZh: string
  flavorNameEn: string
  addonIds: string[]
  addonNameZh: string
  addonNameEn: string
  unitPrice: number // 含口味+配料加价
  calories: number
  unit: string
  qty: number
  // 行唯一键：shopId + productId + flavorId + addons排序hash
  key: string
  source: 'normal' | 'seckill' | 'bargain'
}

export interface Order {
  id: string
  shopId: string
  shopNameZh: string
  shopNameEn: string
  items: CartItem[]
  deliveryFee: number
  packageFee: number
  totalPrice: number
  totalCalories: number
  carrierId: string
  payMethod: string
  name: string
  phone: string
  address: string
  remark: string
  createdAt: number
}

interface State {
  lang: Lang
  themeId: string
  cart: CartItem[]
  orders: Order[]
  // 秒杀库存（会话级，刷新重置）：productId -> 剩余份数
  seckillStock: Record<string, number>
  // 砍价进度（会话级）：productId -> 已砍到的价格（null=未砍）
  bargainPrices: Record<string, number>
  // 秒杀结束时间戳（会话开始 + 3 分钟，刷新重置）
  seckillEndsAt: number
}

// 秒杀初始库存：基于 productId 字符码取 6~15，会话内稳定
function initSeckillStock(): Record<string, number> {
  const map: Record<string, number> = {}
  for (const shop of shops) {
    for (const p of shop.products) {
      if (!p.tags.includes('seckill')) continue
      let sum = 0
      for (let i = 0; i < p.id.length; i++) sum += p.id.charCodeAt(i)
      map[p.id] = 6 + (sum % 10) // 6 ~ 15
    }
  }
  return map
}

const state = reactive<State>({
  lang: 'zh',
  themeId: 'orange',
  cart: [],
  orders: [],
  seckillStock: initSeckillStock(),
  bargainPrices: {},
  seckillEndsAt: Date.now() + 3 * 60 * 1000,
})

// ---------- i18n ----------
export function t(key: string, vars?: Record<string, string | number>) {
  const keys = key.split('.')
  let val: any = messages[state.lang]
  for (const k of keys) val = val?.[k]
  if (val == null) return key
  if (vars && typeof val === 'string') {
    for (const [k, v] of Object.entries(vars)) {
      val = val.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
    }
  }
  return val
}

export function tn(item: { nameZh: string; nameEn: string }) {
  return state.lang === 'zh' ? item.nameZh : item.nameEn
}

export function updateTabBarLang() {
  const tabs = ['home', 'cart', 'orders', 'mine']
  tabs.forEach((key, index) => {
    uni.setTabBarItem({ index, text: t(`tab.${key}`) }).catch(() => {})
  })
}
export function setLang(l: Lang) {
  state.lang = l
  updateTabBarLang()
}
export function toggleLang() {
  state.lang = state.lang === 'zh' ? 'en' : 'zh'
  updateTabBarLang()
}

// ---------- 主题 ----------
export const lang = computed(() => state.lang)
export const themeId = computed(() => state.themeId)
export const currentTheme = computed(() => themes.find(t => t.id === state.themeId) || themes[0])
export function setTheme(id: string) { state.themeId = id }
export function applyTheme() {
  const c = currentTheme.value.primary
  // 兼容 H5/APP，直接写 CSS 变量到根元素
  // #ifdef H5
  document.documentElement.style.setProperty('--theme-primary', c)
  // #endif
  return c
}

// ---------- 购物车 ----------
function makeKey(shopId: string, productId: string, flavorId: string, addonIds: string[]) {
  return [shopId, productId, flavorId, [...addonIds].sort().join('+')].join('|')
}

export function addToCart(item: Omit<CartItem, 'key'>) {
  const key = makeKey(item.shopId, item.productId, item.flavorId, item.addonIds)
  const exist = state.cart.find(c => c.key === key)
  if (exist) {
    exist.qty += item.qty
  } else {
    state.cart.push({ ...item, key })
  }
}

export function changeQty(key: string, delta: number) {
  const it = state.cart.find(c => c.key === key)
  if (!it) return
  it.qty += delta
  if (it.qty <= 0) {
    state.cart = state.cart.filter(c => c.key !== key)
  }
}

export function removeItem(key: string) {
  state.cart = state.cart.filter(c => c.key !== key)
}

export function clearShopCart(shopId: string) {
  state.cart = state.cart.filter(c => c.shopId !== shopId)
}

// 按店铺分组
export const cartByShop = computed(() => {
  const map: Record<string, CartItem[]> = {}
  for (const it of state.cart) {
    ;(map[it.shopId] ||= []).push(it)
  }
  return map
})

export const cartCount = computed(() => state.cart.reduce((s, c) => s + c.qty, 0))

// 计算某店铺小计
export function shopSubtotal(shopId: string, shop: { deliveryFee: number; packageFee: number }) {
  const items = state.cart.filter(c => c.shopId === shopId)
  const productTotal = items.reduce((s, c) => s + c.unitPrice * c.qty, 0)
  const calories = items.reduce((s, c) => s + c.calories * c.qty, 0)
  const deliveryFee = items.length ? shop.deliveryFee : 0
  const packageFee = items.length ? shop.packageFee : 0
  return {
    items,
    productTotal,
    calories,
    deliveryFee,
    packageFee,
    total: productTotal + deliveryFee + packageFee,
  }
}

// ---------- 订单 ----------
export function createOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
  const o: Order = { ...order, id: 'o' + Date.now(), createdAt: Date.now() }
  state.orders.unshift(o)
  // 清空该店购物车
  clearShopCart(order.shopId)
  return o
}

export const totalSavedCalories = computed(() =>
  state.orders.reduce((s, o) => s + o.totalCalories, 0)
)

// ---------- 秒杀 ----------
export function seckillStockOf(productId: string): number {
  return state.seckillStock[productId] ?? 0
}
// 抢购：库存 -1，返回是否成功
export function grabSeckill(productId: string): boolean {
  const left = state.seckillStock[productId] ?? 0
  if (left <= 0) return false
  state.seckillStock[productId] = left - 1
  return true
}

// ---------- 砍价 ----------
export function bargainPriceOf(productId: string): number | null {
  return state.bargainPrices[productId] ?? null
}
export function setBargainPrice(productId: string, price: number) {
  state.bargainPrices[productId] = price
}

export { state }
