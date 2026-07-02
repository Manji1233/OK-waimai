<template>
  <view class="cart-page">
    <view class="header" :style="{ background: currentTheme.primary }">
      <text class="title">{{ t('tab.cart') }}</text>
    </view>

    <scroll-view scroll-y class="list" v-if="shopsIds.length">
      <view class="section" v-for="sid in shopsIds" :key="sid">
        <view class="card">
          <text class="shop-name">{{ tn(shopMap[sid]) }}</text>
          <view class="cart-item row" v-for="it in shopMap[sid].__items" :key="it.key">
            <image v-if="productImage(it)" class="ci-img" :src="productImage(it)" mode="aspectFill" />
            <view v-else class="ph-img ci-img">img</view>
            <view class="ci-info">
              <text class="ci-name">{{ tn(it) }}</text>
              <text class="ci-spec cal" v-if="it.flavorNameZh || it.addonNameZh">{{ it.flavorNameZh }} {{ it.addonNameZh }}</text>
              <text class="ci-spec cal" v-else>{{ it.unit }}</text>
              <view class="between">
                <text class="price">¥{{ it.unitPrice }}</text>
                <view class="row qty-ctrl">
                  <text class="qty-btn" @tap="changeQty(it.key, -1)">−</text>
                  <text class="qty-num">{{ it.qty }}</text>
                  <text class="qty-btn" @tap="changeQty(it.key, 1)">+</text>
                </view>
              </view>
            </view>
          </view>
          <!-- 店铺合计 -->
          <view class="shop-foot between">
            <view>
              <text class="cal">{{ t('deliveryFee') }} ¥{{ shopMap[sid].deliveryFee }} · {{ t('packageFee') }} ¥{{ shopMap[sid].packageFee }}</text>
            </view>
            <view class="row">
              <text v-if="subtotal(sid).productTotal < shopMap[sid].minOrder" class="not-enough">{{ t('notEnoughMin', { gap: (shopMap[sid].minOrder - subtotal(sid).productTotal).toFixed(1) }) }}</text>
              <text v-else class="btn-primary order-btn" @tap="goCheckout(sid)">{{ t('placeOrder') }} ¥{{ subtotal(sid).total.toFixed(1) }}</text>
            </view>
          </view>
        </view>
      </view>
      <view style="height:60rpx"></view>
    </scroll-view>

    <view v-else class="empty">
      <text class="empty-icon">🛒</text>
      <text class="cal">{{ t('emptyCart') }}</text>
      <view class="btn-primary go-shop" @tap="goHome">{{ t('goShopping') }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { shops, type Shop } from '../../data/shops'
import { t, tn, currentTheme, cartByShop, changeQty, shopSubtotal, state, type CartItem } from '../../store'

const shopMap = computed(() => {
  const map: Record<string, Shop & { __items: any[] }> = {}
  for (const s of shops) {
    const items = cartByShop.value[s.id] || []
    if (items.length) map[s.id] = { ...s, __items: items }
  }
  return map
})
const shopsIds = computed(() => Object.keys(shopMap.value))

function subtotal(sid: string) {
  return shopSubtotal(sid, shopMap.value[sid])
}
function productImage(it: CartItem) {
  const shop = shops.find(s => s.id === it.shopId)
  return shop?.products.find(p => p.id === it.productId)?.image || shop?.image || ''
}
function goCheckout(sid: string) {
  const sub = subtotal(sid)
  if (sub.productTotal < shopMap.value[sid].minOrder) return
  uni.navigateTo({ url: '/pages/checkout/checkout?shop=' + sid })
}
function goHome() { uni.switchTab({ url: '/pages/index/index' }) }
</script>

<style scoped>
.cart-page { min-height: 100vh; }
.header { padding: 90rpx 24rpx 24rpx; }
.title { color: #fff; font-size: 34rpx; font-weight: 700; }
.list { height: calc(100vh - 160rpx); }
.section { padding: 0 24rpx; margin-top: 20rpx; }
.shop-name { font-size: 30rpx; font-weight: 700; display: block; margin-bottom: 16rpx; }
.cart-item { padding: 16rpx 0; border-top: 1rpx solid var(--border); }
.ci-img { width: 120rpx; height: 120rpx; flex-shrink: 0; border-radius: 14rpx; }
.ci-info { margin-left: 20rpx; flex: 1; }
.ci-name { font-size: 28rpx; font-weight: 600; display: block; }
.ci-spec { display: block; margin: 6rpx 0; }
.qty-ctrl { gap: 24rpx; align-items: center; }
.qty-btn { width: 48rpx; height: 48rpx; line-height: 48rpx; text-align: center; border: 2rpx solid var(--border); border-radius: 50%; font-size: 32rpx; }
.qty-num { min-width: 36rpx; text-align: center; }
.shop-foot { margin-top: 16rpx; padding-top: 16rpx; border-top: 1rpx solid var(--border); }
.not-enough { color: #ff9500; font-size: 24rpx; }
.order-btn { padding: 12rpx 28rpx; font-size: 26rpx; }
.empty { display: flex; flex-direction: column; align-items: center; padding-top: 200rpx; }
.empty-icon { font-size: 100rpx; margin-bottom: 20rpx; }
.go-shop { margin-top: 30rpx; padding: 16rpx 48rpx; }
</style>
