<template>
  <view class="bargain-page">
    <view class="header" :style="{ background: currentTheme.primary }">
      <view class="back" @tap="back">‹</view>
      <text class="title">✂️ {{ t('bargain') }}</text>
    </view>

    <view class="banner">
      <text class="banner-txt">{{ t('bargainBanner') }}</text>
    </view>

    <scroll-view scroll-y class="list">
      <view class="section-title"><text>{{ t('bargainList') }}</text></view>

      <view v-for="item in bargainProducts" :key="item.product.id" class="card bg-item">
        <view class="row">
          <image class="bg-img" :src="item.product.image" mode="aspectFill" />
          <view class="bg-info">
            <text class="bg-name">{{ tn(item.product) }}</text>
            <text class="cal">{{ tn(item.shop) }} · {{ item.product.calories }} {{ t('calories') }}</text>
            <view class="row" style="margin-top:8rpx">
              <text class="price">{{ t('bargainTarget') }} ¥{{ item.product.bargainPrice }}</text>
              <text class="sk-orig">¥{{ item.product.price }}</text>
            </view>
            <view v-if="bargainedOf(item.product.id) != null" class="bargained-tag">
              ✅ {{ t('bargainedAt') }} ¥{{ bargainedOf(item.product.id) }}
            </view>
          </view>
        </view>
        <view class="bg-actions">
          <view
            v-if="bargainedOf(item.product.id) == null"
            class="btn-primary bg-btn" @tap="openBargain(item)"
          >{{ t('goBargain') }}</view>
          <view v-else class="row" style="gap:16rpx">
            <view class="btn-primary bg-btn ghost" @tap="openBargain(item)">{{ t('bargainAgain') }}</view>
            <view class="btn-primary bg-btn" @tap="addBargained(item)">{{ t('addCart') }}</view>
          </view>
        </view>
      </view>
      <view style="height:60rpx"></view>
    </scroll-view>

    <!-- 砍价弹层 -->
    <view v-if="cur" class="modal-mask" @tap="closeBargain">
      <view class="bg-modal" @tap.stop>
        <view class="between">
          <text class="spec-title">{{ tn(cur.product) }}</text>
          <text class="close" @tap="closeBargain">✕</text>
        </view>

        <!-- 当前价 -->
        <view class="price-row">
          <text class="cur-price">¥{{ curPrice.toFixed(1) }}</text>
          <text class="sk-orig">¥{{ cur.product.price }}</text>
        </view>
        <text class="target-hint cal">{{ t('bargainTarget') }} ¥{{ cur.product.bargainPrice }}</text>

        <!-- 进度条 -->
        <view class="prog-wrap">
          <view class="prog-bar">
            <view class="prog-fill" :style="{ width: progress + '%' }"></view>
            <view class="prog-flag">🎯</view>
          </view>
          <text class="prog-txt">{{ progress }}%</text>
        </view>

        <!-- 好友列表 -->
        <scroll-view scroll-y class="friend-list" v-if="friends.length">
          <view v-for="(f, i) in friends" :key="i" class="friend" :class="{ show: i < shownFriends }">
            <text class="friend-avatar">{{ f.avatar }}</text>
            <text class="friend-name">{{ tn(f) }}</text>
            <text class="friend-cut">-¥{{ f.cut.toFixed(2) }}</text>
          </view>
        </scroll-view>
        <view v-else class="friend-empty cal">{{ t('bargainEmpty') }}</view>

        <!-- 操作按钮 -->
        <view class="btn-primary big-btn" :class="{ disabled: cutting }" @tap="inviteFriends">
          {{ cutting ? t('bargaining') : (friends.length ? t('bargainAgain') : t('bargainHelp')) }}
        </view>
        <view class="btn-primary big-btn success" :class="{ disabled: friends.length === 0 }" @tap="finishBargain">
          {{ t('bargainSuccess') }} · {{ t('addCart') }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { shops, type Shop, type Product } from '../../data/shops'
import { t, tn, currentTheme, bargainPriceOf, setBargainPrice, addToCart, cartCount } from '../../store'

function back() { uni.navigateBack() }

const bargainProducts = computed(() => {
  const list: { shop: Shop; product: Product }[] = []
  for (const s of shops) for (const p of s.products) if (p.tags.includes('bargain')) list.push({ shop: s, product: p })
  return list
})

function bargainedOf(id: string) { return bargainPriceOf(id) }

// ---------- 砍价弹层 ----------
const cur = ref<{ shop: Shop; product: Product } | null>(null)
const curPrice = ref(0)
const friends = ref<Friend[]>([])
const shownFriends = ref(0)
const cutting = ref(false)

interface Friend { nameZh: string; nameEn: string; avatar: string; cut: number }

const FRIEND_POOL = [
  { nameZh: '小白', nameEn: 'Bai', avatar: '🐰' },
  { nameZh: '阿强', nameEn: 'Qiang', avatar: '🐯' },
  { nameZh: '阿珍', nameEn: 'Zhen', avatar: '🐱' },
  { nameZh: '大毛', nameEn: 'Mao', avatar: '🐶' },
  { nameZh: '二丫', nameEn: 'Yaya', avatar: '🦊' },
  { nameZh: '老王', nameEn: 'Wang', avatar: '🐻' },
  { nameZh: '翠花', nameEn: 'Cuihua', avatar: '🐼' },
  { nameZh: 'Tony', nameEn: 'Tony', avatar: '🦁' },
]

const progress = computed(() => {
  if (!cur.value) return 0
  const total = cur.value.product.price - (cur.value.product.bargainPrice || 0)
  if (total <= 0) return 100
  const done = cur.value.product.price - curPrice.value
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)))
})

function openBargain(item: { shop: Shop; product: Product }) {
  cur.value = item
  // 已砍过则从砍后价继续，否则从原价开始
  const existing = bargainPriceOf(item.product.id)
  curPrice.value = existing != null ? existing : item.product.price
  friends.value = []
  shownFriends.value = 0
  cutting.value = false
}

function closeBargain() { cur.value = null }

function inviteFriends() {
  if (cutting.value || !cur.value) return
  cutting.value = true
  const p = cur.value.product
  const target = p.bargainPrice || 0
  // 还需砍多少才能到目标价（curPrice 从原价向 target 递减）
  const gap = curPrice.value - target
  // 这一轮砍掉剩余差距的 80%~92%
  const roundRatio = 0.80 + Math.random() * 0.12
  let roundCut = Math.max(0, gap * roundRatio)
  if (roundCut <= 0) roundCut = 0

  // 随机 3~5 位好友
  const n = 3 + Math.floor(Math.random() * 3)
  const picked = [...FRIEND_POOL].sort(() => Math.random() - 0.5).slice(0, n)
  // 分配每人砍价额度（随机权重）
  const weights = picked.map(() => 0.5 + Math.random())
  const wSum = weights.reduce((a, b) => a + b, 0)
  const newFriends: Friend[] = picked.map((f, i) => ({
    nameZh: f.nameZh, nameEn: f.nameEn, avatar: f.avatar,
    cut: +(roundCut * weights[i] / wSum).toFixed(2),
  }))

  const startPrice = curPrice.value
  const startLen = friends.value.length
  friends.value = [...friends.value, ...newFriends]

  // 逐个揭示好友 + 价格递减动画，总时长 ~1.8s
  let idx = 0
  const step = () => {
    if (idx >= newFriends.length) {
      cutting.value = false
      // 兜底对齐（防止浮点误差导致没到目标）
      return
    }
    shownFriends.value = startLen + idx + 1
    // 累计砍到当前
    const acc = newFriends.slice(0, idx + 1).reduce((s, f) => s + f.cut, 0)
    curPrice.value = +(startPrice - acc).toFixed(2)
    idx++
    setTimeout(step, 320)
  }
  setTimeout(step, 200)
}

function finishBargain() {
  if (!cur.value || friends.value.length === 0) return
  // 再砍一刀彩蛋：结算前再砍剩余差距的 5%（若尚未到目标）
  const p = cur.value.product
  const target = p.bargainPrice || 0
  if (curPrice.value > target) {
    const extra = (curPrice.value - target) * 0.05
    curPrice.value = +Math.max(target, curPrice.value - extra).toFixed(2)
  }
  const finalPrice = curPrice.value
  setBargainPrice(p.id, finalPrice)
  addBargained(cur.value, finalPrice)
  cur.value = null
}

function addBargained(item: { shop: Shop; product: Product }, price?: number) {
  const unitPrice = price ?? bargainPriceOf(item.product.id) ?? item.product.bargainPrice ?? item.product.price
  addToCart({
    shopId: item.shop.id,
    productId: item.product.id,
    nameZh: item.product.nameZh, nameEn: item.product.nameEn,
    flavorId: '',
    flavorNameZh: '', flavorNameEn: '',
    addonIds: [],
    addonNameZh: '', addonNameEn: '',
    unitPrice,
    calories: item.product.calories,
    unit: item.product.unit,
    qty: 1,
    source: 'bargain',
  })
  uni.showToast({ title: t('addToCart'), icon: 'success' })
  uni.setTabBarBadge({ index: 1, text: String(cartCount.value) }).catch(() => {})
}
</script>

<style scoped>
.bargain-page { min-height: 100vh; }
.header { padding: 90rpx 24rpx 24rpx; display: flex; align-items: center; }
.back { color: #fff; font-size: 56rpx; margin-right: 20rpx; }
.title { color: #fff; font-size: 34rpx; font-weight: 700; }

.banner { margin: 16rpx 24rpx 0; background: linear-gradient(135deg, #fff7e6, #ffe8cc); border: 2rpx solid #ffd8bf; border-radius: 16rpx; padding: 20rpx 24rpx; }
.banner-txt { color: #ff7a00; font-size: 26rpx; }

.list { height: calc(100vh - 240rpx); padding: 24rpx; }
.section-title { font-size: 32rpx; font-weight: 700; margin-bottom: 16rpx; }

.bg-item { display: block; }
.bg-img { width: 180rpx; height: 180rpx; flex-shrink: 0; border-radius: 12rpx; }
.bg-info { margin-left: 20rpx; flex: 1; }
.bg-name { font-size: 30rpx; font-weight: 600; display: block; }
.sk-orig { color: var(--text-light); text-decoration: line-through; font-size: 24rpx; margin-left: 10rpx; }
.bargained-tag { margin-top: 10rpx; display: inline-block; background: #e6f9ee; color: #1aar4a; font-size: 22rpx; padding: 4rpx 12rpx; border-radius: 8rpx; }
.bg-actions { margin-top: 18rpx; display: flex; justify-content: flex-end; }
.bg-btn { padding: 14rpx 32rpx; font-size: 26rpx; }
.bg-btn.ghost { background: #fff; color: var(--theme-primary); border: 2rpx solid var(--theme-primary); }

.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: flex-end; }
.bg-modal { background: #fff; width: 100%; border-radius: 28rpx 28rpx 0 0; padding: 32rpx; max-height: 86vh; overflow-y: auto; }
.spec-title { font-size: 34rpx; font-weight: 700; }
.close { font-size: 36rpx; color: var(--text-light); }

.price-row { margin-top: 18rpx; display: flex; align-items: baseline; }
.cur-price { font-size: 56rpx; font-weight: 800; color: #ff3b30; }
.target-hint { display: block; margin-top: 4rpx; }

.prog-wrap { margin-top: 24rpx; }
.prog-bar { height: 28rpx; background: #ffe9d6; border-radius: 999rpx; position: relative; overflow: visible; }
.prog-fill { height: 100%; background: linear-gradient(90deg, #ff9500, #ff3b30); border-radius: 999rpx; transition: width 0.3s; }
.prog-flag { position: absolute; right: -6rpx; top: -10rpx; font-size: 28rpx; }
.prog-txt { font-size: 24rpx; color: #ff7a00; margin-top: 8rpx; display: block; text-align: right; }

.friend-list { max-height: 280rpx; margin-top: 20rpx; }
.friend { display: flex; align-items: center; padding: 14rpx 0; border-bottom: 1rpx solid var(--border); opacity: 0; transform: translateY(10rpx); }
.friend.show { opacity: 1; transform: translateY(0); transition: all 0.25s; }
.friend-avatar { font-size: 40rpx; margin-right: 16rpx; }
.friend-name { flex: 1; font-size: 28rpx; }
.friend-cut { color: #ff3b30; font-weight: 700; }
.friend-empty { text-align: center; padding: 30rpx; font-size: 26rpx; }

.big-btn { margin-top: 20rpx; padding: 24rpx 0; font-size: 30rpx; }
.big-btn.success { background: #1aar4a; }
.big-btn.disabled { background: #ccc; }
</style>
