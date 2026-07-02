<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { applyTheme, updateTabBarLang } from "./store";
onLaunch(() => {
  applyTheme();
  updateTabBarLang();
});
onShow(() => {});
onHide(() => {});
</script>
<style>
:root {
  --theme-primary: #FF6A00;
  --theme-primary-light: rgba(255, 106, 0, 0.12);
  --bg: #f5f6f8;
  --card: #ffffff;
  --text: #1a1a1a;
  --text-sub: #888888;
  --text-light: #b0b0b0;
  --border: #eeeeee;
}
page {
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 28rpx;
}
view, text { box-sizing: border-box; }
.container { padding: 24rpx; }
.card {
  background: var(--card);
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}
.row { display: flex; align-items: center; }
.between { display: flex; align-items: center; justify-content: space-between; }
.btn-primary {
  background: var(--theme-primary);
  color: #fff;
  border-radius: 999rpx;
  text-align: center;
  font-weight: 600;
  border: none;
}
.btn-primary::after { border: none; }
.tag-seckill { background: #ff3b30; color: #fff; font-size: 20rpx; padding: 2rpx 10rpx; border-radius: 6rpx; margin-left: 8rpx; }
.tag-bargain { background: #ff9500; color: #fff; font-size: 20rpx; padding: 2rpx 10rpx; border-radius: 6rpx; margin-left: 8rpx; }
.price { color: var(--theme-primary); font-weight: 700; }
.cal { color: var(--text-sub); font-size: 22rpx; }
.ph-img {
  background: #f0f0f0;
  display: flex; align-items: center; justify-content: center;
  color: #c0c0c0; font-size: 22rpx;
  border-radius: 12rpx;
}
</style>
