<template>
  <view class="mine-page">
    <view class="header" :style="{ background: currentTheme.primary }">
      <view class="avatar">OK</view>
      <text class="app-name">{{ t('app') }}</text>
    </view>

    <view class="content">
      <!-- 卡路里 -->
      <view class="card cal-card">
        <text class="cal-big-num">{{ totalSavedCalories }}</text>
        <text class="cal-label">{{ t('totalCalories') }} ({{ t('calories') }})</text>
      </view>

      <!-- 主题 -->
      <view class="card">
        <text class="block-title">🎨 {{ t('theme') }}</text>
        <view class="theme-row">
          <view
            v-for="th in themes" :key="th.id"
            class="theme-pill"
            :style="{ background: th.primary, color:'#fff', border: th.id === state.themeId ? '4rpx solid #1a1a1a' : '4rpx solid transparent' }"
            @tap="pickTheme(th.id)"
          >{{ tn(th) }}</view>
        </view>
      </view>

      <!-- 语言 -->
      <view class="card">
        <text class="block-title">🌐 {{ t('language') }}</text>
        <view class="lang-row">
          <view class="lang-btn" :class="{active: state.lang==='zh'}" @tap="setLang('zh')">中文</view>
          <view class="lang-btn" :class="{active: state.lang==='en'}" @tap="setLang('en')">English</view>
        </view>
      </view>

      <!-- 成为商家 -->
      <view class="card list-item" @tap="toast(t('comingSoon'))">
        <text>➕ {{ t('beMerchant') }}</text>
        <text class="arr">›</text>
      </view>

      <!-- 免责声明 -->
      <view class="card">
        <text class="block-title">⚠️</text>
        <text class="disclaimer">{{ t('disclaimer') }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { themes } from '../../data/shops'
import { t, tn, currentTheme, state, totalSavedCalories, setLang, setTheme, applyTheme } from '../../store'

function pickTheme(id: string) { setTheme(id); applyTheme() }
function toast(msg: string) { uni.showToast({ title: msg, icon: 'none' }) }
</script>

<style scoped>
.mine-page { min-height: 100vh; }
.header { padding: 100rpx 24rpx 40rpx; display: flex; flex-direction: column; align-items: center; }
.avatar { width: 120rpx; height: 120rpx; border-radius: 50%; background: rgba(255,255,255,0.3); color:#fff; font-size: 40rpx; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.app-name { color: #fff; font-size: 32rpx; font-weight: 700; margin-top: 16rpx; }
.content { padding: 24rpx; margin-top: -20rpx; }
.cal-card { text-align: center; }
.cal-big-num { font-size: 72rpx; font-weight: 800; color: var(--theme-primary); display: block; }
.cal-label { color: var(--text-sub); font-size: 26rpx; }
.block-title { font-size: 28rpx; font-weight: 700; display: block; margin-bottom: 16rpx; }
.theme-row { display: flex; gap: 16rpx; flex-wrap: wrap; }
.theme-pill { padding: 14rpx 28rpx; border-radius: 999rpx; font-size: 26rpx; }
.lang-row { display: flex; gap: 16rpx; }
.lang-btn { flex: 1; text-align: center; padding: 18rpx 0; border: 2rpx solid var(--border); border-radius: 12rpx; }
.lang-btn.active { border-color: var(--theme-primary); color: var(--theme-primary); background: var(--theme-primary-light); }
.list-item { display: flex; align-items: center; justify-content: space-between; font-size: 30rpx; }
.arr { color: var(--text-light); font-size: 40rpx; }
.disclaimer { font-size: 24rpx; color: var(--text-sub); line-height: 1.6; display: block; }
</style>
