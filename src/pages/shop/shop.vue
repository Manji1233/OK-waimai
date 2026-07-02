<template>
  <view class="shop-page">
    <view class="header" :style="{ background: currentTheme.primary }">
      <view class="back" @tap="back">‹</view>
      <text class="title">{{ shop ? tn(shop) : '' }}</text>
    </view>
    <view v-if="shop" class="shop-meta">
      <text class="cal">{{ t('deliveryFee') }} ¥{{ shop.deliveryFee }} · {{ t('packageFee') }} ¥{{ shop.packageFee }} · {{ t('minOrder') }} ¥{{ shop.minOrder }}</text>
    </view>

    <scroll-view scroll-y class="list" v-if="shop">
      <view class="card prod" v-for="p in shop.products" :key="p.id">
        <view class="row">
          <image class="prod-img" :src="p.image" mode="aspectFill" />
          <view class="prod-info">
            <view class="row">
              <text class="prod-name">{{ tn(p) }}</text>
              <text v-if="p.tags.includes('seckill')" class="tag-seckill">{{ t('seckill') }}</text>
              <text v-else-if="p.tags.includes('bargain')" class="tag-bargain">{{ t('bargain') }}</text>
            </view>
            <text class="cal">{{ p.calories }} {{ t('calories') }} · {{ p.unit }}</text>
            <view class="between" style="margin-top:8rpx">
              <view class="row">
                <text class="price" v-if="p.tags.includes('seckill')">¥{{ p.seckillPrice }}</text>
                <text class="price" v-else-if="p.tags.includes('bargain')">¥{{ p.bargainPrice }}</text>
                <text class="price" v-else>¥{{ p.price }}</text>
                <text v-if="p.tags.includes('seckill') || p.tags.includes('bargain')" class="sk-orig">¥{{ p.price }}</text>
              </view>
              <view class="btn-primary add-btn" @tap="openSpec(p)">+</view>
            </view>
          </view>
        </view>
      </view>
      <view style="height:160rpx"></view>
    </scroll-view>

    <!-- 加购弹层 -->
    <view v-if="cur" class="modal-mask" @tap="cur = null">
      <view class="spec-modal" @tap.stop>
        <view class="between">
          <text class="spec-title">{{ tn(cur) }}</text>
          <text class="close" @tap="cur = null">✕</text>
        </view>
        <text class="price" style="font-size:36rpx">¥{{ curPrice }}</text>

        <view v-if="cur.flavors.length" class="spec-block">
          <text class="spec-label">{{ t('flavor') }}</text>
          <view class="opts">
            <text
              v-for="f in cur.flavors" :key="f.id"
              class="opt" :class="{ active: flavorId === f.id }"
              @tap="flavorId = f.id"
            >{{ tn(f) }}<text v-if="f.addPrice" class="cal">+¥{{ f.addPrice }}</text></text>
          </view>
        </view>

        <view v-if="cur.addons.length" class="spec-block">
          <text class="spec-label">{{ t('addon') }}</text>
          <view class="opts">
            <text
              v-for="a in cur.addons" :key="a.id"
              class="opt" :class="{ active: addonIds.includes(a.id) }"
              @tap="toggleAddon(a.id)"
            >{{ tn(a) }}+¥{{ a.addPrice }}</text>
          </view>
        </view>

        <view class="between spec-block">
          <text class="spec-label">{{ t('qty') }}</text>
          <view class="row qty-ctrl">
            <text class="qty-btn" @tap="qty = Math.max(1, qty - 1)">−</text>
            <text class="qty-num">{{ qty }}</text>
            <text class="qty-btn" @tap="qty++">+</text>
          </view>
        </view>

        <view class="btn-primary confirm-btn" @tap="confirmAdd">{{ t('addToCart') }} · ¥{{ curPrice * qty }}</view>
      </view>
    </view>

    <!-- 底部悬浮导航 -->
    <BottomNav activePath="/pages/index/index" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { shops, type Product } from '../../data/shops'
import { t, tn, currentTheme, addToCart, cartCount } from '../../store'
import BottomNav from '../../components/BottomNav.vue'

const shop = ref(shops[0])
const cur = ref<Product | null>(null)
const flavorId = ref('')
const addonIds = ref<string[]>([])
const qty = ref(1)

// 接收参数
const pages = getCurrentPages()
const last = pages[pages.length - 1] as any
const id = last?.options?.id || last?.$page?.options?.id || shops[0].id
shop.value = shops.find(s => s.id === id) || shops[0]

function back() { uni.navigateBack() }

function openSpec(p: Product) {
  cur.value = p
  flavorId.value = p.flavors[0]?.id || ''
  addonIds.value = []
  qty.value = 1
}
function toggleAddon(id: string) {
  const i = addonIds.value.indexOf(id)
  if (i >= 0) addonIds.value.splice(i, 1)
  else addonIds.value.push(id)
}

const curPrice = computed(() => {
  if (!cur.value) return 0
  const p = cur.value
  let base = p.price
  if (p.tags.includes('seckill') && p.seckillPrice != null) base = p.seckillPrice
  else if (p.tags.includes('bargain') && p.bargainPrice != null) base = p.bargainPrice
  const f = p.flavors.find(x => x.id === flavorId.value)
  const aSum = p.addons.filter(x => addonIds.value.includes(x.id)).reduce((s, x) => s + x.addPrice, 0)
  return base + (f?.addPrice || 0) + aSum
})

function confirmAdd() {
  const p = cur.value!
  const f = p.flavors.find(x => x.id === flavorId.value)
  const addons = p.addons.filter(x => addonIds.value.includes(x.id))
  const base = p.tags.includes('seckill') ? (p.seckillPrice || p.price)
    : p.tags.includes('bargain') ? (p.bargainPrice || p.price) : p.price
  addToCart({
    shopId: shop.value.id,
    productId: p.id,
    nameZh: p.nameZh, nameEn: p.nameEn,
    flavorId: flavorId.value,
    flavorNameZh: f?.nameZh || '', flavorNameEn: f?.nameEn || '',
    addonIds: addonIds.value,
    addonNameZh: addons.map(a => a.nameZh).join('/'),
    addonNameEn: addons.map(a => a.nameEn).join('/'),
    unitPrice: curPrice.value,
    calories: p.calories,
    unit: p.unit,
    qty: qty.value,
    source: p.tags.includes('seckill') ? 'seckill' : p.tags.includes('bargain') ? 'bargain' : 'normal',
  })
  uni.showToast({ title: t('addToCart'), icon: 'success' })
  cur.value = null
  uni.setTabBarBadge({ index: 1, text: String(cartCount.value) }).catch(() => {})
}
</script>

<style scoped>
.shop-page { min-height: 100vh; }
.header { padding: 90rpx 24rpx 24rpx; display: flex; align-items: center; }
.back { color: #fff; font-size: 56rpx; margin-right: 20rpx; }
.title { color: #fff; font-size: 34rpx; font-weight: 700; }
.shop-meta { padding: 16rpx 24rpx; }
.list { height: calc(100vh - 180rpx); padding: 0 24rpx 140rpx 24rpx; }
.prod-img { width: 160rpx; height: 120rpx; flex-shrink: 0; }
.prod-info { margin-left: 20rpx; flex: 1; }
.prod-name { font-size: 28rpx; font-weight: 600; }
.sk-orig { color: var(--text-light); text-decoration: line-through; font-size: 22rpx; margin-left: 8rpx; }
.add-btn { width: 56rpx; height: 56rpx; line-height: 56rpx; border-radius: 50%; font-size: 40rpx; }

.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100; display: flex; align-items: flex-end; }
.spec-modal { background: #fff; width: 100%; border-radius: 28rpx 28rpx 0 0; padding: 32rpx; max-height: 80vh; overflow-y: auto; }
.spec-title { font-size: 34rpx; font-weight: 700; }
.close { font-size: 36rpx; color: var(--text-light); }
.spec-block { margin-top: 28rpx; }
.spec-label { font-size: 26rpx; color: var(--text-sub); display: block; margin-bottom: 14rpx; }
.opts { display: flex; flex-wrap: wrap; gap: 16rpx; }
.opt { border: 2rpx solid var(--border); border-radius: 12rpx; padding: 12rpx 20rpx; font-size: 26rpx; }
.opt.active { border-color: var(--theme-primary); color: var(--theme-primary); background: var(--theme-primary-light); }
.qty-ctrl { gap: 30rpx; }
.qty-btn { width: 56rpx; height: 56rpx; line-height: 56rpx; text-align: center; border: 2rpx solid var(--border); border-radius: 50%; font-size: 36rpx; }
.qty-num { font-size: 32rpx; min-width: 40rpx; text-align: center; }
.confirm-btn { margin-top: 36rpx; padding: 24rpx 0; font-size: 30rpx; }
</style>
