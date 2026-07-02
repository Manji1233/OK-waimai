<template>
  <view class="result-page">
    <view class="header" :style="{ background: currentTheme.primary }">
      <text class="title">{{ t('savedCalories') }}</text>
    </view>

    <view class="content">
      <!-- 卡路里卡片（截图区域） -->
      <view id="card-area" class="card-area" :style="cardBgStyle">
        <view class="card-inner">
          <view class="stars">⭐⭐⭐⭐⭐</view>
          <text class="super-title">超级厉害</text>
          <view class="trophy">🏆</view>
          <text class="save-label">{{ t('savedCalories') }}</text>
          <text class="save-num">{{ order?.totalCalories || 0 }} {{ t('calories') }}</text>
          <view class="shine"></view>
        </view>
      </view>

      <view class="btn-group">
        <view class="btn-primary save-btn" @tap="saveCard">💾 {{ t('saveCard') || '保存卡片' }}</view>
        <view class="btn-primary back-btn" @tap="goHome">🏠 {{ t('tab.home') }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import html2canvas from 'html2canvas'
import { t, currentTheme, state, type Order } from '../../store'

const order = ref<Order | null>(null)
const pages = getCurrentPages()
const last = pages[pages.length - 1] as any
const oid = last?.options?.id || last?.$page?.options?.id
order.value = state.orders.find(o => o.id === oid) || state.orders[0] || null

const cardBgStyle = computed(() => {
  const c = currentTheme.value.primary
  return {
    background: `linear-gradient(180deg, ${c}15 0%, #fff 50%, ${c}10 100%)`,
  }
})

async function saveCard() {
  const el = document.querySelector('#card-area') as HTMLElement
  if (!el) return
  try {
    const canvas = await html2canvas(el, {
      backgroundColor: '#ffffff',
      scale: 3,
      useCORS: true,
    })
    const dataUrl = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `ok-waimai-calories-${Date.now()}.png`
    a.click()
    uni.showToast({ title: '已保存', icon: 'success' })
  } catch (e) {
    uni.showToast({ title: '保存失败，请截图', icon: 'none' })
  }
}

function goHome() {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style scoped>
.result-page { min-height: 100vh; background: var(--bg); }
.header { padding: 90rpx 24rpx 24rpx; text-align: center; }
.title { color: #fff; font-size: 34rpx; font-weight: 700; }
.content { padding: 40rpx 24rpx; }

.card-area {
  width: 100%;
  max-width: 640rpx;
  margin: 0 auto 40rpx;
  border-radius: 28rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.08);
}
.card-inner {
  padding: 48rpx 32rpx;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.stars { font-size: 36rpx; letter-spacing: 12rpx; margin-bottom: 16rpx; }
.super-title {
  display: block;
  font-size: 48rpx;
  font-weight: 800;
  color: #c7941d;
  text-shadow: 0 2rpx 0 rgba(0,0,0,0.06);
  margin-bottom: 20rpx;
}
.trophy { font-size: 160rpx; line-height: 1; margin: 24rpx 0; }
.save-label { display: block; font-size: 28rpx; color: #b88a3a; margin-top: 16rpx; }
.save-num { display: block; font-size: 52rpx; font-weight: 800; color: var(--theme-primary); margin-top: 12rpx; }
.shine {
  position: absolute;
  top: -40%;
  left: -40%;
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
  pointer-events: none;
}

.btn-group { display: flex; flex-direction: column; gap: 20rpx; max-width: 640rpx; margin: 0 auto; }
.save-btn { padding: 26rpx 0; font-size: 30rpx; }
.back-btn { padding: 26rpx 0; font-size: 30rpx; background: #fff; color: var(--theme-primary); border: 2rpx solid var(--theme-primary); }
.back-btn::after { border: none; }
</style>
