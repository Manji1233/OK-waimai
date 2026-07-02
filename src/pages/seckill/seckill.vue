<template>
  <view class="seckill-page">
    <view class="header" :style="{ background: currentTheme.primary }">
      <view class="back" @tap="back">‹</view>
      <text class="title">🔥 {{ t('seckill') }}</text>
    </view>

    <!-- 倒计时条 -->
    <view class="countdown-bar" :style="{ background: currentTheme.primary }">
      <text class="cd-label">{{ t('seckillIng') }}</text>
      <view class="cd-boxes">
        <view class="cd-box">{{ mm[0] }}</view>
        <view class="cd-box">{{ mm[1] }}</view>
        <text class="cd-colon">:</text>
        <view class="cd-box">{{ ss[0] }}</view>
        <view class="cd-box">{{ ss[1] }}</view>
      </view>
      <text class="cd-label">{{ t('seckillTip') }}</text>
    </view>

    <scroll-view scroll-y class="list">
      <view class="section-title">
        <text>{{ t('seckillList') }}</text>
        <text class="cal">{{ seckillProducts.length }} {{ t('unit') }}</text>
      </view>

      <view
        v-for="item in seckillProducts" :key="item.product.id"
        class="card sk-item"
      >
        <view class="row">
          <image class="sk-img" :src="item.product.image" mode="aspectFill" />
          <view class="sk-info">
            <text class="sk-name">{{ tn(item.product) }}</text>
            <text class="cal">{{ tn(item.shop) }} · {{ item.product.calories }} {{ t('calories') }}</text>
            <view class="row" style="margin-top:8rpx">
              <text class="price sk-price">¥{{ item.product.seckillPrice }}</text>
              <text class="sk-orig">¥{{ item.product.price }}</text>
            </view>
            <!-- 库存条 -->
            <view class="stock-wrap">
              <view class="stock-bar">
                <view class="stock-fill" :style="{ width: stockPct(item.product.id) + '%' }"></view>
              </view>
              <text class="stock-txt" v-if="stockOf(item.product.id) > 0">
                {{ t('seckillLeft', { n: stockOf(item.product.id) }) }}
              </text>
              <text class="stock-txt sold" v-else>{{ t('seckillEnd') }}</text>
            </view>
          </view>
          <view
            class="btn-primary grab-btn"
            :class="{ disabled: stockOf(item.product.id) <= 0 || ended }"
            @tap="grab(item)"
          >
            <text>{{ stockOf(item.product.id) <= 0 ? t('seckillEnd') : (ended ? t('seckillEnd') : t('goSeckill')) }}</text>
          </view>
        </view>
      </view>
      <view style="height:60rpx"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { shops, type Shop, type Product } from '../../data/shops'
import { t, tn, currentTheme, state, grabSeckill, seckillStockOf, addToCart, cartCount } from '../../store'

function back() { uni.navigateBack() }

const seckillProducts = computed(() => {
  const list: { shop: Shop; product: Product }[] = []
  for (const s of shops) for (const p of s.products) if (p.tags.includes('seckill')) list.push({ shop: s, product: p })
  return list
})

function stockOf(id: string) { return seckillStockOf(id) }
function stockPct(id: string) {
  const left = seckillStockOf(id)
  // 初始库存同 store 的取值规则反推近似比例
  let sum = 0
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i)
  const init = 6 + (sum % 10)
  return Math.max(0, Math.min(100, Math.round((left / init) * 100)))
}

// 倒计时
const remain = ref(Math.max(0, Math.floor((state.seckillEndsAt - Date.now()) / 1000)))
const mm = computed(() => String(Math.floor(remain.value / 60)).padStart(2, '0'))
const ss = computed(() => String(remain.value % 60).padStart(2, '0'))
const ended = computed(() => remain.value <= 0)
let timer: any
onMounted(() => {
  timer = setInterval(() => {
    remain.value = Math.max(0, Math.floor((state.seckillEndsAt - Date.now()) / 1000))
  }, 1000)
})
onUnmounted(() => clearInterval(timer))

function grab(item: { shop: Shop; product: Product }) {
  if (ended.value) {
    uni.showToast({ title: t('seckillEnd'), icon: 'none' })
    return
  }
  if (stockOf(item.product.id) <= 0) {
    uni.showToast({ title: t('seckillEnd'), icon: 'none' })
    return
  }
  const ok = grabSeckill(item.product.id)
  if (!ok) {
    uni.showToast({ title: t('seckillEnd'), icon: 'none' })
    return
  }
  addToCart({
    shopId: item.shop.id,
    productId: item.product.id,
    nameZh: item.product.nameZh, nameEn: item.product.nameEn,
    flavorId: '',
    flavorNameZh: '', flavorNameEn: '',
    addonIds: [],
    addonNameZh: '', addonNameEn: '',
    unitPrice: item.product.seckillPrice || item.product.price,
    calories: item.product.calories,
    unit: item.product.unit,
    qty: 1,
    source: 'seckill',
  })
  uni.showToast({ title: t('addToCart'), icon: 'success' })
  uni.setTabBarBadge({ index: 1, text: String(cartCount.value) }).catch(() => {})
}
</script>

<style scoped>
.seckill-page { min-height: 100vh; }
.header { padding: 90rpx 24rpx 24rpx; display: flex; align-items: center; }
.back { color: #fff; font-size: 56rpx; margin-right: 20rpx; }
.title { color: #fff; font-size: 34rpx; font-weight: 700; }

.countdown-bar { margin: 0 24rpx; margin-top: -20rpx; border-radius: 16rpx; padding: 20rpx 24rpx; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.12); }
.cd-label { color: #fff; font-size: 24rpx; }
.cd-boxes { display: flex; align-items: center; gap: 6rpx; }
.cd-box { background: rgba(0,0,0,0.28); color: #fff; font-size: 30rpx; font-weight: 700; width: 40rpx; height: 48rpx; line-height: 48rpx; text-align: center; border-radius: 8rpx; }
.cd-colon { color: #fff; font-weight: 700; font-size: 30rpx; }

.list { height: calc(100vh - 240rpx); padding: 24rpx; }
.section-title { font-size: 32rpx; font-weight: 700; margin-bottom: 16rpx; display: flex; align-items: center; justify-content: space-between; }

.sk-item { display: block; }
.sk-img { width: 180rpx; height: 180rpx; flex-shrink: 0; border-radius: 12rpx; }
.sk-info { margin-left: 20rpx; flex: 1; }
.sk-name { font-size: 30rpx; font-weight: 600; display: block; }
.sk-price { font-size: 38rpx; }
.sk-orig { color: var(--text-light); text-decoration: line-through; font-size: 24rpx; margin-left: 10rpx; }
.stock-wrap { margin-top: 14rpx; }
.stock-bar { height: 14rpx; background: #ffe0db; border-radius: 999rpx; overflow: hidden; }
.stock-fill { height: 100%; background: linear-gradient(90deg, #ff3b30, #ff9500); border-radius: 999rpx; transition: width 0.3s; }
.stock-txt { font-size: 22rpx; color: #ff3b30; margin-top: 6rpx; display: block; }
.stock-txt.sold { color: var(--text-light); }
.grab-btn { width: 150rpx; padding: 18rpx 0; font-size: 26rpx; align-self: center; }
.grab-btn.disabled { background: #ccc; }
</style>
