<template>
  <view class="track-page">
    <view class="header" :style="{ background: currentTheme.primary }">
      <view class="back" @tap="back">‹</view>
      <text class="title">{{ t('orderPlaced') }}</text>
    </view>

    <view v-if="order" class="track-body">
      <!-- 地图区 -->
      <view class="map-wrap" :class="{ 'football-wrap': !isRabbit }">
        <!-- 森林地图 -->
        <image
          v-if="isRabbit"
          class="map-img"
          :src="staticUrl('forest-map.png')"
          mode="aspectFill"
        />

        <!-- 精细足球场背景（球星模式） -->
        <view v-else class="football-field">
          <view class="stadium-top">
            <text class="scoreboard">OK DELIVERY CUP</text>
            <text class="scoreboard time">{{ countdown }}</text>
          </view>
          <view class="pitch-lines border-line"></view>
          <view class="pitch-lines half-line"></view>
          <view class="pitch-lines center-circle"></view>
          <view class="pitch-lines center-dot"></view>
          <view class="pitch-lines penalty-box left"></view>
          <view class="pitch-lines goal-box left"></view>
          <view class="pitch-lines penalty-box right"></view>
          <view class="pitch-lines goal-box right"></view>
          <view class="goal-net left">
            <view class="net-line" v-for="n in 5" :key="'left-net-v-' + n" :style="{ left: `${n * 18}%` }"></view>
            <view class="net-row" v-for="n in 3" :key="'left-net-h-' + n" :style="{ top: `${n * 25}%` }"></view>
          </view>
          <view class="goal-net right">
            <view class="net-line" v-for="n in 5" :key="'right-net-v-' + n" :style="{ left: `${n * 18}%` }"></view>
            <view class="net-row" v-for="n in 3" :key="'right-net-h-' + n" :style="{ top: `${n * 25}%` }"></view>
          </view>
          <text class="field-label start-label">KICK OFF</text>
          <text class="field-label goal-label left">GOAL</text>
          <text class="field-label goal-label right">GOAL</text>
        </view>

        <!-- 兔子配送员：按路线方向切换三视图 -->
        <image
          v-if="isRabbit"
          class="courier-img rabbit-img"
          :style="rabbitCourierStyle"
          :src="rabbitSprite"
          mode="aspectFit"
        />

        <!-- 球星配送员 + 足球射门 -->
        <template v-else>
          <image
            class="courier-img athlete-img"
            :style="athleteStyle"
            :src="carrier.image"
            mode="aspectFit"
          />
          <view class="football-ball" :style="ballStyle">⚽</view>
          <view v-if="showGoal" class="goal-toast">
            <text class="goal-title">{{ t('goalDelivered') }}</text>
          </view>
          <view v-if="showGoal" class="celebration-layer">
            <view
              v-for="i in confettiPieces"
              :key="'confetti-' + i"
              class="confetti"
              :style="confettiStyle(i)"
            ></view>
            <view class="firework firework-a"></view>
            <view class="firework firework-b"></view>
          </view>
        </template>
      </view>

      <!-- 状态 -->
      <view class="card status-card">
        <view class="status-row">
          <view class="step" :class="{ done: step >= 0, active: step === 0 }">
            <view class="dot"></view><text>{{ t('making') }}</text>
          </view>
          <view class="line" :class="{ done: step >= 1 }"></view>
          <view class="step" :class="{ done: step >= 1, active: step === 1 }">
            <view class="dot"></view><text>{{ t('delivering') }}</text>
          </view>
          <view class="line" :class="{ done: step >= 2 }"></view>
          <view class="step" :class="{ done: step >= 2, active: step === 2 }">
            <view class="dot"></view><text>{{ t('arrived') }}</text>
          </view>
        </view>
        <view class="countdown-wrap">
          <text class="cd-label">{{ t('deliveryTime', { min: showMin }) }}</text>
          <text class="cd-time">{{ countdown }}</text>
        </view>
        <view v-if="step < 2" class="interaction-panel">
          <text class="interaction-title">{{ t('trackingInteractTitle') }}</text>
          <view class="interaction-actions">
            <text class="interaction-btn" @tap="sendInteraction('cheer')">{{ t('cheerCourier') }}</text>
            <text class="interaction-btn" @tap="sendInteraction('eta')">{{ t('askEta') }}</text>
            <text class="interaction-btn" @tap="sendInteraction('safe')">{{ t('remindSafe') }}</text>
          </view>
          <text class="interaction-msg" :class="{ pulse: interactionPulse }">{{ interactionMsg }}</text>
        </view>
      </view>

      <!-- 订单摘要 -->
      <view class="card">
        <text class="block-title">{{ tn({ nameZh: order.shopNameZh, nameEn: order.shopNameEn }) }}</text>
        <view class="row item" v-for="it in order.items" :key="it.key">
          <text class="item-name">{{ tn(it) }} ×{{ it.qty }}</text>
          <text class="price">¥{{ (it.unitPrice * it.qty).toFixed(1) }}</text>
        </view>
        <view class="row fee total"><text>{{ t('subtotal') }}</text><text class="price">¥{{ order.totalPrice.toFixed(1) }}</text></view>
      </view>

      <view v-if="step >= 2" class="card">
        <text class="cal-big">{{ t('orderPlaced') }}</text>
        <text class="cal">{{ t('savedCalories') }}: {{ order.totalCalories }} {{ t('calories') }}</text>
      </view>
    </view>

    <!-- 底部悬浮导航 -->
    <BottomNav activePath="/pages/orders/orders" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { carriers } from '../../data/shops'
import { t, tn, currentTheme, state, type Order } from '../../store'
import BottomNav from '../../components/BottomNav.vue'

const order = ref<Order | null>(null)
const pages = getCurrentPages()
const last = pages[pages.length - 1] as any
const oid = last?.options?.id || last?.$page?.options?.id
order.value = state.orders.find(o => o.id === oid) || state.orders[0] || null

const carrier = computed(() => carriers.find(c => c.id === order.value?.carrierId) || carriers[0])

// 步骤 0制作 1配送 2送达
const step = ref(0)
const progress = ref(0) // 0~1 配送员移动进度
const countdown = ref('40:00')
const deliveryRatio = ref(0) // 0~1 整体倒计时进度，用于足球射门阶段
const confettiPieces = Array.from({ length: 20 }, (_, i) => i)
const interactionMsg = ref('')
const interactionPulse = ref(false)
let interactionTimer: any

// 兔子: 显示40分钟/实际40秒. 球星: 显示30分钟/实际20秒
const isRabbit = computed(() => carrier.value.id === 'rabbit')
const totalSec = computed(() => isRabbit.value ? 40 : 20)
const showMin = computed(() => isRabbit.value ? 40 : 30)
let timer: any
let redirectTimer: any

// ===== 森林地图蜿蜒路径点（百分比坐标） =====
// 从 START(左上) → DESTINATION(右下)
const forestPath = [
  { x: 18, y: 18 },
  { x: 30, y: 20 },
  { x: 30, y: 35 },
  { x: 42, y: 38 },
  { x: 50, y: 42 },
  { x: 55, y: 30 },
  { x: 70, y: 32 },
  { x: 72, y: 55 },
  { x: 55, y: 65 },
  { x: 38, y: 72 },
  { x: 55, y: 78 },
  { x: 78, y: 82 },
]

function staticUrl(path: string) {
  return `${import.meta.env.BASE_URL}static/${path}`
}

function clamp(n: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n))
}

function lerpPath(pts: { x: number; y: number }[], t: number) {
  if (t <= 0) return pts[0]
  if (t >= 1) return pts[pts.length - 1]
  const seg = t * (pts.length - 1)
  const i = Math.floor(seg)
  const r = seg - i
  const a = pts[i]
  const b = pts[i + 1] || pts[i]
  return { x: a.x + (b.x - a.x) * r, y: a.y + (b.y - a.y) * r }
}

function forestSegment(t: number) {
  const safeT = clamp(t)
  const seg = safeT * (forestPath.length - 1)
  const i = Math.min(Math.floor(seg), forestPath.length - 2)
  return { a: forestPath[i], b: forestPath[i + 1] }
}

onMounted(() => {
  if (!order.value) return
  const total = totalSec.value
  let elapsed = 0
  const tick = 100 // ms
  countdown.value = `${String(showMin.value).padStart(2, '0')}:00`
  interactionMsg.value = t(isRabbit.value ? 'interactionReadyRabbit' : 'interactionReadyFootball')
  timer = setInterval(() => {
    elapsed += tick / 1000
    if (elapsed >= total) {
      step.value = 2
      progress.value = 1
      deliveryRatio.value = 1
      countdown.value = '00:00'
      clearInterval(timer)
      // 足球进球后彩带礼花持续 3 秒再跳转；兔子保持原节奏
      redirectTimer = setTimeout(() => {
        if (order.value) {
          uni.redirectTo({ url: '/pages/result/result?id=' + order.value.id })
        }
      }, isRabbit.value ? 1500 : 3000)
      return
    }
    const ratio = elapsed / total
    deliveryRatio.value = ratio
    if (ratio < 0.2) { step.value = 0; progress.value = 0 }
    else if (ratio < 0.8) {
      step.value = 1
      progress.value = (ratio - 0.2) / 0.6
    } else {
      step.value = 1
      progress.value = 1
    }
    const remainShow = showMin.value * (1 - ratio) * 60
    const m = Math.floor(remainShow / 60)
    const s = Math.floor(remainShow % 60)
    countdown.value = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  }, tick)
})
onUnmounted(() => {
  clearInterval(timer)
  clearTimeout(redirectTimer)
  clearTimeout(interactionTimer)
})

const rabbitHeading = computed(() => {
  const { a, b } = forestSegment(progress.value)
  const dx = b.x - a.x
  const dy = b.y - a.y
  if (Math.abs(dy) > Math.abs(dx) * 1.15) return dy > 0 ? 'front' : 'back'
  return dx >= 0 ? 'right' : 'left'
})

const rabbitSprite = computed(() => {
  if (rabbitHeading.value === 'front') return staticUrl('rabbit-courier-front.png')
  if (rabbitHeading.value === 'back') return staticUrl('rabbit-courier-back.png')
  return staticUrl('rabbit-courier-side.png')
})

const rabbitCourierStyle = computed(() => {
  const pos = lerpPath(forestPath, progress.value)
  const hop = step.value === 1 ? Math.sin(deliveryRatio.value * Math.PI * 24) * -5 : 0
  const sideMirror = rabbitHeading.value === 'right' ? -1 : 1
  const mirror = rabbitHeading.value === 'left' || rabbitHeading.value === 'right' ? sideMirror : 1
  return {
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    transform: `translate(-50%, -50%) translateY(${hop}rpx) scaleX(${mirror})`,
    transition: 'left 0.1s linear, top 0.1s linear',
  }
})

const athletePoint = computed(() => {
  const p = progress.value
  // 先从左侧推进，最后停在右侧罚球区内准备直线射门
  return {
    x: 12 + p * 68,
    y: 62 - Math.sin(p * Math.PI) * 8,
  }
})

const athleteStyle = computed(() => {
  const pos = athletePoint.value
  const bob = step.value === 1 ? Math.sin(deliveryRatio.value * Math.PI * 18) * -4 : 0
  return {
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    transform: `translate(-50%, -50%) translateY(${bob}rpx)`,
    transition: 'left 0.1s linear, top 0.1s linear',
  }
})

const shootProgress = computed(() => clamp((deliveryRatio.value - 0.82) / 0.14))
const showGoal = computed(() => !isRabbit.value && deliveryRatio.value >= 0.94)

const ballStyle = computed(() => {
  const shoot = shootProgress.value
  let x: number
  let y: number
  if (shoot <= 0) {
    const athlete = athletePoint.value
    x = athlete.x + 6
    y = athlete.y + 11
  } else {
    // 进入罚球区后沿球门方向直线射门
    x = 81 + shoot * 13
    y = 57
  }
  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%) rotate(${Math.round(deliveryRatio.value * 1100)}deg) scale(${showGoal.value ? 0.72 : 1})`,
    transition: 'left 0.1s linear, top 0.1s linear, transform 0.1s linear',
  }
})

function confettiStyle(i: number) {
  const colors = ['#ff4d4f', '#ffc53d', '#52c41a', '#40a9ff', '#9254de', '#ff85c0']
  const left = 12 + ((i * 37) % 76)
  const delay = (i % 7) * 0.08
  const duration = 1.4 + (i % 5) * 0.12
  return {
    left: `${left}%`,
    background: colors[i % colors.length],
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  }
}

function sendInteraction(type: 'cheer' | 'eta' | 'safe') {
  clearTimeout(interactionTimer)
  const key = type === 'cheer'
    ? (isRabbit.value ? 'interactionCheerRabbit' : 'interactionCheerFootball')
    : type === 'eta' ? 'interactionEta' : 'interactionSafe'
  interactionMsg.value = t(key)
  interactionPulse.value = true
  interactionTimer = setTimeout(() => { interactionPulse.value = false }, 500)
}

function back() { uni.navigateBack() }
</script>

<style scoped>
.track-page { min-height: 100vh; }
.header { padding: 90rpx 24rpx 24rpx; display: flex; align-items: center; }
.back { color: #fff; font-size: 56rpx; margin-right: 20rpx; }
.title { color: #fff; font-size: 32rpx; font-weight: 700; }
.track-body { padding: 24rpx 24rpx 140rpx 24rpx; }

/* 地图容器 */
.map-wrap { position: relative; height: 520rpx; border-radius: 20rpx; overflow: hidden; margin-bottom: 20rpx; background: #e8d5b0; box-shadow: 0 12rpx 32rpx rgba(0,0,0,0.08); }
.map-img { position: absolute; inset: 0; width: 100%; height: 100%; }

/* 精细足球场 */
.football-wrap { background: #185f2e; }
.football-field { position: absolute; inset: 0; overflow: hidden; background:
  linear-gradient(90deg, rgba(255,255,255,0.12) 0 1rpx, transparent 1rpx 100%),
  repeating-linear-gradient(90deg, #2f9b48 0 86rpx, #278b40 86rpx 172rpx); }
.football-field::before { content: ''; position: absolute; inset: 18rpx; border-radius: 18rpx; background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12), transparent 38%), linear-gradient(180deg, rgba(255,255,255,0.08), transparent 18%, transparent 82%, rgba(0,0,0,0.14)); pointer-events: none; }
.stadium-top { position: absolute; left: 22rpx; right: 22rpx; top: 18rpx; height: 50rpx; display: flex; align-items: center; justify-content: center; gap: 16rpx; z-index: 2; }
.scoreboard { background: #1d2430; color: #ffe58f; border: 2rpx solid rgba(255,255,255,0.55); border-radius: 10rpx; padding: 8rpx 18rpx; font-size: 20rpx; font-weight: 800; letter-spacing: 1rpx; }
.scoreboard.time { color: #69f0ae; }
.pitch-lines { position: absolute; border-color: rgba(255,255,255,0.82); z-index: 1; }
.border-line { left: 44rpx; right: 44rpx; top: 78rpx; bottom: 38rpx; border: 5rpx solid rgba(255,255,255,0.9); border-radius: 14rpx; }
.half-line { left: 50%; top: 78rpx; bottom: 38rpx; border-left: 4rpx solid rgba(255,255,255,0.8); }
.center-circle { width: 150rpx; height: 150rpx; border: 4rpx solid rgba(255,255,255,0.82); border-radius: 50%; left: 50%; top: 50%; transform: translate(-50%, -42%); }
.center-dot { width: 12rpx; height: 12rpx; border-radius: 50%; background: rgba(255,255,255,0.9); left: 50%; top: 52%; transform: translate(-50%, -50%); }
.penalty-box { top: 166rpx; width: 170rpx; height: 230rpx; border: 5rpx solid rgba(255,255,255,0.86); }
.penalty-box.left { left: 44rpx; border-left: none; }
.penalty-box.right { right: 44rpx; border-right: none; }
.goal-box { top: 222rpx; width: 78rpx; height: 118rpx; border: 4rpx solid rgba(255,255,255,0.86); }
.goal-box.left { left: 44rpx; border-left: none; }
.goal-box.right { right: 44rpx; border-right: none; }
.goal-net { position: absolute; top: 218rpx; width: 52rpx; height: 126rpx; border: 5rpx solid #fff; background: rgba(255,255,255,0.13); z-index: 2; }
.goal-net.left { left: 8rpx; border-right: none; }
.goal-net.right { right: 8rpx; border-left: none; }
.net-line, .net-row { position: absolute; background: rgba(255,255,255,0.55); }
.net-line { top: 0; bottom: 0; width: 2rpx; }
.net-row { left: 0; right: 0; height: 2rpx; }
.field-label { position: absolute; z-index: 2; color: rgba(255,255,255,0.72); font-size: 20rpx; font-weight: 800; letter-spacing: 1rpx; }
.start-label { left: 70rpx; bottom: 52rpx; }
.goal-label.left { left: 70rpx; top: 174rpx; }
.goal-label.right { right: 70rpx; top: 174rpx; }

/* 配送员 */
.courier-img { position: absolute; z-index: 4; }
.rabbit-img { width: 96rpx; height: 132rpx; filter: drop-shadow(0 8rpx 8rpx rgba(0,0,0,0.26)); }
.athlete-img { width: 96rpx; height: 126rpx; border-radius: 18rpx; filter: drop-shadow(0 8rpx 10rpx rgba(0,0,0,0.35)); }
.football-ball { position: absolute; width: 42rpx; height: 42rpx; line-height: 42rpx; text-align: center; font-size: 38rpx; z-index: 5; filter: drop-shadow(0 6rpx 6rpx rgba(0,0,0,0.35)); }
.goal-toast { position: absolute; left: 50%; top: 22%; transform: translateX(-50%); z-index: 8; background: linear-gradient(135deg, #fff7e6, #fffbe6); border: 4rpx solid #ffc53d; border-radius: 999rpx; padding: 14rpx 30rpx; box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.18); animation: goal-pop 0.55s ease both; }
.goal-title { color: #ad4e00; font-size: 28rpx; font-weight: 900; }
.celebration-layer { position: absolute; inset: 0; pointer-events: none; z-index: 7; }
.confetti { position: absolute; top: -20rpx; width: 12rpx; height: 28rpx; border-radius: 4rpx; animation-name: confetti-fall; animation-timing-function: cubic-bezier(.2,.7,.3,1); animation-iteration-count: infinite; }
.firework { position: absolute; width: 18rpx; height: 18rpx; border-radius: 50%; animation: firework 1.2s ease-out infinite; }
.firework-a { right: 110rpx; top: 118rpx; background: #ffec3d; }
.firework-b { right: 190rpx; top: 86rpx; background: #69c0ff; animation-delay: .25s; }

@keyframes confetti-fall {
  0% { transform: translateY(-20rpx) rotate(0deg); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: translateY(560rpx) rotate(420deg); opacity: 0; }
}
@keyframes firework {
  0% { box-shadow: 0 0 0 0 currentColor; transform: scale(.4); opacity: 1; }
  65% { box-shadow: 0 -42rpx 0 2rpx #ffec3d, 38rpx -22rpx 0 2rpx #ff85c0, 38rpx 22rpx 0 2rpx #40a9ff, 0 42rpx 0 2rpx #52c41a, -38rpx 22rpx 0 2rpx #9254de, -38rpx -22rpx 0 2rpx #ff4d4f; opacity: 1; }
  100% { box-shadow: 0 -58rpx 0 0 transparent, 54rpx -30rpx 0 0 transparent, 54rpx 30rpx 0 0 transparent, 0 58rpx 0 0 transparent, -54rpx 30rpx 0 0 transparent, -54rpx -30rpx 0 0 transparent; transform: scale(1.2); opacity: 0; }
}
@keyframes goal-pop {
  0% { transform: translateX(-50%) scale(.6); opacity: 0; }
  70% { transform: translateX(-50%) scale(1.08); opacity: 1; }
  100% { transform: translateX(-50%) scale(1); opacity: 1; }
}

.status-card { }
.status-row { display: flex; align-items: center; }
.step { display: flex; flex-direction: column; align-items: center; font-size: 22rpx; color: var(--text-light); }
.step.done { color: var(--theme-primary); }
.step.active .dot { transform: scale(1.3); }
.dot { width: 28rpx; height: 28rpx; border-radius: 50%; background: #ddd; margin-bottom: 8rpx; }
.step.done .dot { background: var(--theme-primary); }
.step.active .dot { background: var(--theme-primary); box-shadow: 0 0 0 8rpx var(--theme-primary-light); }
.line { flex: 1; height: 4rpx; background: #ddd; margin: 0 -8rpx 24rpx; }
.line.done { background: var(--theme-primary); }
.countdown-wrap { margin-top: 24rpx; text-align: center; }
.cd-label { color: var(--text-sub); font-size: 24rpx; display: block; }
.cd-time { font-size: 48rpx; font-weight: 700; color: var(--theme-primary); }
.interaction-panel { margin-top: 24rpx; padding: 20rpx; border-radius: 18rpx; background: var(--theme-primary-light); }
.interaction-title { display: block; color: var(--text-sub); font-size: 24rpx; margin-bottom: 14rpx; }
.interaction-actions { display: flex; gap: 12rpx; flex-wrap: wrap; }
.interaction-btn { flex: 1; min-width: 150rpx; text-align: center; color: var(--theme-primary); background: #fff; border: 2rpx solid var(--theme-primary); border-radius: 999rpx; padding: 12rpx 10rpx; font-size: 24rpx; font-weight: 700; }
.interaction-msg { display: block; margin-top: 14rpx; color: var(--text); font-size: 24rpx; line-height: 1.4; }
.interaction-msg.pulse { animation: msg-pulse .5s ease both; }
@keyframes msg-pulse {
  0% { transform: scale(.96); opacity: .55; }
  70% { transform: scale(1.02); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.block-title { font-size: 28rpx; font-weight: 700; display: block; margin-bottom: 12rpx; }
.item { justify-content: space-between; padding: 10rpx 0; }
.item-name { flex: 1; }
.fee { justify-content: space-between; padding: 8rpx 0; color: var(--text-sub); font-size: 26rpx; }
.fee.total { font-weight: 700; color: var(--text); border-top: 1rpx solid var(--border); margin-top: 8rpx; padding-top: 12rpx; }

/* 卡路里卡片 */
.cal-card { text-align: center; padding: 40rpx 24rpx; background: linear-gradient(180deg, #fff8e7, #fff); border: 2rpx solid #ffe0b2; }
.stars { font-size: 36rpx; letter-spacing: 8rpx; }
.cal-title { display: block; font-size: 40rpx; font-weight: 800; color: #d4a017; margin: 12rpx 0; }
.cal-trophy { font-size: 120rpx; line-height: 1; margin: 16rpx 0; }
.cal-label { display: block; font-size: 28rpx; color: var(--text-sub); margin-top: 8rpx; }
.cal-num { display: block; font-size: 48rpx; font-weight: 800; color: var(--theme-primary); margin-top: 8rpx; }
.done-btn { margin: 24rpx 0; padding: 24rpx 0; font-size: 30rpx; }
</style>
