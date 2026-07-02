<template>
  <view class="home">
    <!-- 顶栏 -->
    <view class="topbar" :style="{ background: currentTheme.primary }">
      <view class="between" style="width:100%">
        <view class="addr">
          <text class="addr-label">{{ t('address') }}</text>
          <text class="addr-val">{{ t('defaultAddress') }}</text>
        </view>
        <view class="row">
          <view class="top-btn" @tap="showTheme = !showTheme">{{ t('theme') }}</view>
          <view class="top-btn" @tap="toggleLang()">{{ state.lang === 'zh' ? 'EN' : '中' }}</view>
        </view>
      </view>
      <view class="search" @tap="showSearch = true">
        <text class="search-icon">🔍</text>
        <text class="search-ph">{{ t('search') }}</text>
      </view>
      <!-- 主题选择 -->
      <view v-if="showTheme" class="theme-pop">
        <view
          v-for="th in themes" :key="th.id"
          class="theme-dot"
          :style="{ background: th.primary, border: th.id === state.themeId ? '3rpx solid #fff' : '3rpx solid transparent' }"
          @tap="pickTheme(th.id)"
        ><text class="theme-name">{{ tn(th) }}</text></view>
      </view>
    </view>

    <!-- 搜索弹层 -->
    <view v-if="showSearch" class="modal-mask" @tap="showSearch = false">
      <view class="search-modal" @tap.stop>
        <input class="search-input" :placeholder="t('search')" v-model="kw" focus />
        <scroll-view scroll-y class="search-result">
          <view v-for="s in searchShops" :key="s.id" class="search-item" @tap="goShop(s.id)">
            <text>🏪 {{ tn(s) }}</text>
          </view>
          <view v-for="p in searchProducts" :key="p.shop.id + p.product.id" class="search-item" @tap="goShop(p.shop.id)">
            <text>🍽️ {{ tn(p.product) }} · {{ tn(p.shop) }}</text>
          </view>
          <view v-if="!searchShops.length && !searchProducts.length" class="search-empty">{{ t('search') }}</view>
        </scroll-view>
      </view>
    </view>

    <scroll-view scroll-y class="content">
      <!-- 秒杀/砍价入口 -->
      <view class="section">
        <view class="promo-row">
          <view class="promo-card seckill-card" @tap="goSeckill">
            <view class="promo-icon">🔥</view>
            <view class="promo-info">
              <text class="promo-title">{{ t('seckill') }}</text>
              <text class="promo-sub countdown">{{ seckillCountdown }}</text>
            </view>
          </view>
          <view class="promo-card bargain-card" @tap="goBargain">
            <view class="promo-icon">✂️</view>
            <view class="promo-info">
              <text class="promo-title">{{ t('bargain') }}</text>
              <text class="promo-sub">{{ t('goBargain') }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 秒杀专区横滚 -->
      <view class="section">
        <view class="section-title">
          <text>🔥 {{ t('seckill') }}</text>
          <text class="countdown" @tap="goSeckill">{{ seckillCountdown }} ›</text>
        </view>
        <scroll-view scroll-x class="sk-scroll" enable-flex>
          <view
            v-for="item in seckillProducts" :key="item.product.id"
            class="sk-mini" @tap="goShop(item.shop.id)"
          >
            <image class="sk-mini-img" :src="item.product.image" mode="aspectFill" />
            <text class="sk-mini-name">{{ tn(item.product) }}</text>
            <view class="row">
              <text class="price sk-mini-price">¥{{ item.product.seckillPrice }}</text>
              <text class="sk-mini-orig">¥{{ item.product.price }}</text>
            </view>
            <text class="sk-mini-stock cal" v-if="stockOf(item.product.id) > 0">
              {{ t('seckillLeft', { n: stockOf(item.product.id) }) }}
            </text>
            <text class="sk-mini-stock sold" v-else>{{ t('seckillEnd') }}</text>
          </view>
          <view class="sk-more" @tap="goSeckill">
            <text class="sk-more-txt">{{ t('goSeckill') }}</text>
            <text class="sk-more-arrow">›</text>
          </view>
        </scroll-view>
      </view>

      <!-- 餐厅列表 -->
      <view class="section">
        <view class="section-title"><text>🏪 {{ t('shopList') }}</text></view>
        <view class="card shop-card" v-for="s in shops" :key="s.id" @tap="goShop(s.id)">
          <view class="row">
            <view class="shop-cover-wrap">
              <image class="shop-logo" :src="shopCover(s)" mode="aspectFill" />
            </view>
            <view class="shop-info">
              <text class="shop-name">{{ tn(s) }}</text>
              <text class="shop-slogan">{{ s.slogan || tn(s) }}</text>
              <text class="cal">{{ s.products.length }} {{ t('unit') }} · {{ t('deliveryFee') }} ¥{{ s.deliveryFee }} · {{ t('minOrder') }} ¥{{ s.minOrder }}</text>
            </view>
          </view>
        </view>
        <!-- 成为商家占位 -->
        <view class="card shop-card merchant" @tap="beMerchant">
          <view class="row between">
            <text>➕ {{ t('beMerchant') }}</text>
            <text class="cal">{{ t('comingSoon') }}</text>
          </view>
        </view>
      </view>
      <view style="height:40rpx"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { shops, themes, type Shop, type Product } from '../../data/shops'
import { t, tn, state, currentTheme, toggleLang, setTheme, applyTheme, seckillStockOf } from '../../store'

const showTheme = ref(false)
const showSearch = ref(false)
const kw = ref('')

function pickTheme(id: string) {
  setTheme(id)
  applyTheme()
  showTheme.value = false
}

function goShop(id: string) {
  uni.navigateTo({ url: '/pages/shop/shop?id=' + id })
  showSearch.value = false
}

function beMerchant() {
  uni.showToast({ title: t('comingSoon'), icon: 'none' })
}

function goSeckill() {
  uni.navigateTo({ url: '/pages/seckill/seckill' })
}
function goBargain() {
  uni.navigateTo({ url: '/pages/bargain/bargain' })
}
function stockOf(id: string) { return seckillStockOf(id) }
function shopCover(s: Shop) {
  return s.products.find(p => p.image)?.image || s.image
}

// 秒杀/砍价菜品
const seckillProducts = computed(() => {
  const list: { shop: Shop; product: Product }[] = []
  for (const s of shops) for (const p of s.products) if (p.tags.includes('seckill')) list.push({ shop: s, product: p })
  return list
})
const bargainProducts = computed(() => {
  const list: { shop: Shop; product: Product }[] = []
  for (const s of shops) for (const p of s.products) if (p.tags.includes('bargain')) list.push({ shop: s, product: p })
  return list
})

// 搜索
const searchShops = computed(() =>
  shops.filter(s => !kw.value || tn(s).includes(kw.value))
)
const searchProducts = computed(() => {
  const list: { shop: Shop; product: Product }[] = []
  for (const s of shops) for (const p of s.products) {
    if (!kw.value || tn(p).includes(kw.value)) list.push({ shop: s, product: p })
  }
  return list
})

// 秒杀倒计时（会话开始为基准，与秒杀页共享 seckillEndsAt）
const seckillCountdown = ref('03:00')
let timer: any
function fmt() {
  const remain = Math.max(0, Math.floor((state.seckillEndsAt - Date.now()) / 1000))
  const m = Math.floor(remain / 60)
  const s = remain % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
onMounted(() => {
  seckillCountdown.value = fmt()
  timer = setInterval(() => { seckillCountdown.value = fmt() }, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.home { min-height: 100vh; }
.topbar { padding: 90rpx 24rpx 24rpx; position: relative; }
.addr-label { color: rgba(255,255,255,0.8); font-size: 22rpx; }
.addr-val { color: #fff; font-weight: 600; margin-left: 8rpx; }
.top-btn { background: rgba(255,255,255,0.25); color: #fff; padding: 6rpx 18rpx; border-radius: 999rpx; font-size: 24rpx; margin-left: 12rpx; }
.search { margin-top: 20rpx; background: #fff; border-radius: 999rpx; padding: 14rpx 28rpx; display: flex; align-items: center; }
.search-icon { margin-right: 12rpx; }
.search-ph { color: var(--text-light); font-size: 26rpx; }
.theme-pop { display: flex; gap: 20rpx; margin-top: 20rpx; flex-wrap: wrap; }
.theme-dot { width: 120rpx; height: 120rpx; border-radius: 50%; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 12rpx; }
.theme-name { color: #fff; font-size: 20rpx; }

.content { height: calc(100vh - 220rpx); }
.section { padding: 0 24rpx; margin-top: 24rpx; }
.section-title { font-size: 32rpx; font-weight: 700; margin-bottom: 16rpx; display: flex; align-items: center; justify-content: space-between; }
.promo-row { display: flex; gap: 20rpx; }
.promo-card { flex: 1; background: var(--card); border-radius: 20rpx; padding: 28rpx 24rpx; display: flex; align-items: center; }
.seckill-card { background: linear-gradient(135deg, #fff5f5, #fff); border: 2rpx solid #ffccc7; }
.bargain-card { background: linear-gradient(135deg, #fff7e6, #fff); border: 2rpx solid #ffd8bf; }
.promo-icon { font-size: 52rpx; margin-right: 20rpx; }
.promo-info { flex: 1; }
.promo-title { display: block; font-size: 30rpx; font-weight: 700; color: var(--text); }
.promo-sub { display: block; font-size: 24rpx; color: #ff3b30; margin-top: 8rpx; }
.bargain-card .promo-sub { color: #ff9500; }
.countdown { color: #ff3b30; font-size: 26rpx; font-weight: 600; }

.sk-scroll { white-space: nowrap; }
.sk-mini { display: inline-flex; flex-direction: column; width: 200rpx; background: var(--card); border-radius: 16rpx; padding: 16rpx; margin-right: 16rpx; vertical-align: top; }
.sk-mini-img { width: 168rpx; height: 168rpx; border-radius: 12rpx; }
.sk-mini-name { font-size: 26rpx; font-weight: 600; margin-top: 10rpx; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sk-mini-price { font-size: 32rpx; margin-top: 6rpx; }
.sk-mini-orig { color: var(--text-light); text-decoration: line-through; font-size: 22rpx; margin-left: 8rpx; }
.sk-mini-stock { font-size: 20rpx; margin-top: 4rpx; }
.sk-mini-stock.sold { color: var(--text-light); }
.sk-more { display: inline-flex; flex-direction: column; align-items: center; justify-content: center; width: 120rpx; color: var(--theme-primary); }
.sk-more-txt { font-size: 22rpx; writing-mode: vertical-rl; }
.sk-more-arrow { font-size: 40rpx; margin-top: 8rpx; }

.shop-card { display: block; }
.shop-cover-wrap { position: relative; width: 156rpx; height: 120rpx; border-radius: 18rpx; overflow: hidden; flex-shrink: 0; background: #f0f0f0; box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.08); }
.shop-logo { width: 100%; height: 100%; display: block; }
.shop-info { margin-left: 20rpx; flex: 1; min-width: 0; }
.shop-name { font-size: 30rpx; font-weight: 600; display: block; margin-bottom: 8rpx; }
.shop-slogan { font-size: 24rpx; color: var(--text-sub); display: block; margin-bottom: 8rpx; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.merchant { border: 2rpx dashed var(--text-light); text-align: center; }

.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100; display: flex; align-items: flex-start; justify-content: center; }
.search-modal { background: #fff; width: 92%; margin-top: 120rpx; border-radius: 20rpx; padding: 24rpx; max-height: 70vh; display: flex; flex-direction: column; }
.search-input { background: var(--bg); border-radius: 12rpx; padding: 16rpx; }
.search-result { flex: 1; margin-top: 16rpx; }
.search-item { padding: 20rpx 8rpx; border-bottom: 1rpx solid var(--border); }
.search-empty { text-align: center; color: var(--text-light); padding: 40rpx; }
</style>
