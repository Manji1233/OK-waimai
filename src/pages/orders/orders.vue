<template>
  <view class="orders-page">
    <view class="header" :style="{ background: currentTheme.primary }">
      <text class="title">{{ t('orderHistory') }}</text>
    </view>

    <!-- 卡路里累计 -->
    <view class="cal-banner" :style="{ background: currentTheme.primary }">
      <text class="cal-num">{{ totalSavedCalories }}</text>
      <text class="cal-text">{{ t('totalCalories') }} ({{ t('calories') }})</text>
    </view>

    <scroll-view scroll-y class="list">
      <view v-if="state.orders.length === 0" class="empty">
        <text class="empty-icon">📦</text>
        <text class="cal">{{ t('noOrders') }}</text>
      </view>
      <view class="card order-card" v-for="o in state.orders" :key="o.id">
        <view class="between">
          <text class="shop-name">{{ tn({ nameZh: o.shopNameZh, nameEn: o.shopNameEn }) }}</text>
          <text class="cal">{{ formatTime(o.createdAt) }}</text>
        </view>
        <text class="items-text">{{ o.items.map(i => tn(i)).join('、') }}</text>
        <view class="between" style="margin-top:12rpx">
          <text class="price">¥{{ o.totalPrice.toFixed(1) }}</text>
          <view class="row">
            <text class="cal">🔥{{ o.totalCalories }}{{ t('calories') }}</text>
            <view class="btn-primary replay-btn" @tap="replay(o.id)">{{ t('replay') }}</view>
          </view>
        </view>
      </view>
      <view style="height:60rpx"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { t, tn, currentTheme, state, totalSavedCalories } from '../../store'

function formatTime(ts: number) {
  const d = new Date(ts)
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`
}
function replay(id: string) {
  uni.navigateTo({ url: '/pages/tracking/tracking?id=' + id })
}
</script>

<style scoped>
.orders-page { min-height: 100vh; }
.header { padding: 90rpx 24rpx 24rpx; }
.title { color: #fff; font-size: 34rpx; font-weight: 700; }
.cal-banner { margin: 20rpx 24rpx; padding: 32rpx; border-radius: 20rpx; text-align: center; }
.cal-num { font-size: 64rpx; font-weight: 800; color: #fff; display: block; }
.cal-text { color: rgba(255,255,255,0.9); font-size: 24rpx; }
.list { height: calc(100vh - 360rpx); padding: 0 24rpx; }
.order-card { margin-top: 20rpx; }
.shop-name { font-weight: 700; font-size: 28rpx; }
.items-text { display: block; margin-top: 8rpx; color: var(--text-sub); font-size: 24rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.replay-btn { margin-left: 16rpx; padding: 8rpx 20rpx; font-size: 24rpx; }
.empty { text-align: center; padding-top: 120rpx; }
.empty-icon { font-size: 100rpx; display: block; margin-bottom: 20rpx; }
</style>
