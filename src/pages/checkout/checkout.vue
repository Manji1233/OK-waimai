<template>
  <view class="checkout-page">
    <view class="header" :style="{ background: currentTheme.primary }">
      <view class="back" @tap="back">‹</view>
      <text class="title">{{ t('checkout') }}</text>
    </view>

    <scroll-view scroll-y class="content" v-if="shop">
      <!-- 地址信息 -->
      <view class="card">
        <view class="field">
          <text class="field-label">{{ t('name') }}</text>
          <input class="field-input" :placeholder="t('namePh')" v-model="form.name" />
        </view>
        <view class="field">
          <text class="field-label">{{ t('phone') }}</text>
          <input class="field-input" :placeholder="t('phonePh')" v-model="form.phone" />
        </view>
        <view class="field">
          <text class="field-label">{{ t('addressLabel') }}</text>
          <input class="field-input" :placeholder="t('addressPh')" v-model="form.address" />
        </view>
        <view class="field">
          <text class="field-label">{{ t('remark') }}</text>
          <input class="field-input" :placeholder="t('remarkPh')" v-model="form.remark" />
        </view>
        <text class="cal hint">{{ t('defaultAddress') }}</text>
      </view>

      <!-- 配送员 -->
      <view class="card">
        <text class="block-title">{{ t('selectCarrier') }}</text>
        <view class="carrier-grid">
          <view
            v-for="c in carriers" :key="c.id"
            class="carrier" :class="{ active: form.carrierId === c.id }"
            @tap="form.carrierId = c.id"
          >
            <image class="carrier-photo" :src="c.image" mode="aspectFit" />
            <text class="carrier-name">{{ tn(c) }}</text>
          </view>
        </view>
      </view>

      <!-- 支付方式 -->
      <view class="card">
        <text class="block-title">{{ t('payMethod') }}</text>
        <view class="pay-grid">
          <view
            v-for="pm in payMethods" :key="pm.id"
            class="pay-opt" :class="{ active: form.payMethod === pm.id }"
            @tap="form.payMethod = pm.id"
          >
            <text class="pay-emoji">{{ pm.emoji }}</text>
            <text class="pay-name">{{ t(pm.labelKey) }}</text>
            <text v-if="form.payMethod === pm.id" class="pay-check">✓</text>
          </view>
        </view>
      </view>

      <!-- 订单明细 -->
      <view class="card">
        <text class="block-title">{{ tn(shop) }}</text>
        <view class="row item" v-for="it in sub.items" :key="it.key">
          <text class="item-name">{{ tn(it) }} ×{{ it.qty }}</text>
          <text class="price">¥{{ (it.unitPrice * it.qty).toFixed(1) }}</text>
        </view>
        <view class="row fee"><text>{{ t('deliveryFee') }}</text><text>¥{{ sub.deliveryFee }}</text></view>
        <view class="row fee"><text>{{ t('packageFee') }}</text><text>¥{{ sub.packageFee }}</text></view>
        <view class="row fee total"><text>{{ t('subtotal') }}</text><text class="price">¥{{ sub.total.toFixed(1) }}</text></view>
        <view class="row fee"><text class="cal">🔥 {{ t('savedCalories') }}</text><text class="cal">{{ sub.calories }} {{ t('calories') }}</text></view>
      </view>
      <view style="height:160rpx"></view>
    </scroll-view>

    <view class="bottom-bar" v-if="shop">
      <view>
        <text class="price" style="font-size:40rpx">¥{{ sub.total.toFixed(1) }}</text>
      </view>
      <view class="btn-primary submit" @tap="submit">{{ t('checkout') }}</view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { shops, carriers, DEFAULT_ADDRESS } from '../../data/shops'
import { t, tn, currentTheme, shopSubtotal, createOrder } from '../../store'

const shop = ref(shops[0])
const pages = getCurrentPages()
const last = pages[pages.length - 1] as any
const sid = last?.options?.shop || last?.$page?.options?.shop
shop.value = shops.find(s => s.id === sid) || shops[0]

const payMethods = [
  { id: 'bank', labelKey: 'payBankCard', emoji: '💳' },
  { id: 'credit', labelKey: 'payCreditCard', emoji: '💳' },
  { id: 'alipay', labelKey: 'payAlipay', emoji: '🔵' },
  { id: 'wechat', labelKey: 'payWechat', emoji: '🟢' },
]

const form = reactive({
  name: '', phone: '', address: '', remark: '',
  carrierId: 'rabbit',
  payMethod: 'alipay',
})

const sub = computed(() => shopSubtotal(shop.value.id, shop.value))

function back() { uni.navigateBack() }

function submit() {
  const o = createOrder({
    shopId: shop.value.id,
    shopNameZh: shop.value.nameZh, shopNameEn: shop.value.nameEn,
    items: sub.value.items,
    deliveryFee: sub.value.deliveryFee,
    packageFee: sub.value.packageFee,
    totalPrice: sub.value.total,
    totalCalories: sub.value.calories,
    carrierId: form.carrierId,
    payMethod: form.payMethod,
    name: form.name || t('namePh'),
    phone: form.phone || t('phonePh'),
    address: form.address || DEFAULT_ADDRESS,
    remark: form.remark,
  })
  uni.redirectTo({ url: '/pages/tracking/tracking?id=' + o.id })
}
</script>

<style scoped>
.checkout-page { min-height: 100vh; padding-bottom: 140rpx; }
.header { padding: 90rpx 24rpx 24rpx; display: flex; align-items: center; }
.back { color: #fff; font-size: 56rpx; margin-right: 20rpx; }
.title { color: #fff; font-size: 34rpx; font-weight: 700; }
.content { height: calc(100vh - 140rpx); padding: 0 24rpx; }
.content .card { margin-top: 20rpx; }
.field { display: flex; align-items: center; padding: 18rpx 0; border-bottom: 1rpx solid var(--border); }
.field-label { width: 140rpx; color: var(--text-sub); flex-shrink: 0; }
.field-input { flex: 1; }
.hint { display: block; margin-top: 16rpx; font-size: 22rpx; }
.block-title { font-size: 28rpx; font-weight: 700; display: block; margin-bottom: 16rpx; }
.carrier-grid { display: flex; flex-wrap: wrap; gap: 16rpx; }
.carrier { width: calc(25% - 12rpx); border: 2rpx solid var(--border); border-radius: 16rpx; padding: 16rpx 0; text-align: center; }
.carrier.active { border-color: var(--theme-primary); background: var(--theme-primary-light); }
.carrier-photo { width: 80rpx; height: 80rpx; border-radius: 50%; object-fit: cover; }
.carrier-name { font-size: 22rpx; display: block; margin-top: 6rpx; }
.item { justify-content: space-between; padding: 12rpx 0; }
.item-name { flex: 1; }
.fee { justify-content: space-between; padding: 8rpx 0; color: var(--text-sub); font-size: 26rpx; }
.fee.total { font-weight: 700; color: var(--text); padding-top: 16rpx; border-top: 1rpx solid var(--border); margin-top: 8rpx; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 20rpx 24rpx; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.06); }
.submit { padding: 20rpx 56rpx; font-size: 30rpx; }
.pay-grid { display: flex; flex-wrap: wrap; gap: 16rpx; }
.pay-opt { width: calc(50% - 8rpx); border: 2rpx solid var(--border); border-radius: 16rpx; padding: 24rpx 20rpx; display: flex; align-items: center; position: relative; }
.pay-opt.active { border-color: var(--theme-primary); background: var(--theme-primary-light); }
.pay-emoji { font-size: 40rpx; margin-right: 16rpx; }
.pay-name { font-size: 28rpx; flex: 1; }
.pay-check { position: absolute; top: 8rpx; right: 12rpx; width: 32rpx; height: 32rpx; line-height: 32rpx; text-align: center; background: var(--theme-primary); color: #fff; border-radius: 50%; font-size: 20rpx; }
</style>
