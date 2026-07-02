<template>
  <view class="bottom-nav">
    <view
      v-for="item in tabs" :key="item.path"
      class="nav-item" :class="{ active: activePath === item.path }"
      @tap="switchTab(item)"
    >
      <text class="nav-icon">{{ item.icon }}</text>
      <text class="nav-text">{{ item.label }}</text>
      <view v-if="item.badge" class="badge">{{ item.badge }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { t, cartCount } from '../store'

const props = defineProps<{ activePath: string }>()

const tabs = computed(() => [
  { path: '/pages/index/index', label: t('tab.home'), icon: '🏠', badge: 0 },
  { path: '/pages/cart/cart', label: t('tab.cart'), icon: '🛒', badge: cartCount.value > 0 ? cartCount.value : 0 },
  { path: '/pages/orders/orders', label: t('tab.orders'), icon: '📦', badge: 0 },
  { path: '/pages/mine/mine', label: t('tab.mine'), icon: '👤', badge: 0 },
])

function switchTab(item: typeof tabs.value[0]) {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1] as any
  const route = current?.route ? '/' + current.route : ''
  if (props.activePath === item.path && route === item.path) return
  uni.switchTab({ url: item.path })
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(100rpx + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1rpx solid #eee;
  z-index: 99;
}
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  position: relative;
}
.nav-icon { font-size: 40rpx; line-height: 1; }
.nav-text { font-size: 20rpx; color: #888; margin-top: 6rpx; }
.nav-item.active .nav-text { color: var(--theme-primary); }
.badge {
  position: absolute;
  top: 4rpx;
  right: calc(50% - 30rpx);
  min-width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  background: #ff3b30;
  color: #fff;
  font-size: 20rpx;
  border-radius: 16rpx;
  text-align: center;
  padding: 0 8rpx;
}
</style>
