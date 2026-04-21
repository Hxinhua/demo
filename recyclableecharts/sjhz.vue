<template>
  <div class="data-summary-container">
    <div class="summary-item" v-for="(item, index) in summaryData" :key="index">
      
      <div class="icon-wrapper" :style="{ '--theme-color': item.color }">
        <div class="icon-svg" v-html="item.svg"></div>
        <div class="glow-base">
          <div class="base-inner"></div>
        </div>
      </div>

      <div class="value-wrapper">
        <span class="value-text">{{ item.value }}</span>
      </div>

      <div class="label-text">{{ item.label }}</div>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 按照截图写死的数据，并配置了对应的主题色和 SVG 图标
const summaryData = ref([
  {
    label: '分拣中心数',
    value: '13',
    color: '#00ffaa', // 绿色
    // 仓库/建筑图标
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-5 9 5v12"/><path d="M9 21V10h6v11"/><path d="M9 14h6"/></svg>`
  },
  {
    label: '回收站',
    value: '1590',
    color: '#ffcc00', // 黄色
    // 箱子/包裹图标
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`
  },
  {
    label: '客户',
    value: '23',
    color: '#00bbff', // 蓝色
    // 卡车图标
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
  },
  {
    label: '运输商',
    value: '185',
    color: '#00e5ff', // 青绿色
    // 人员/定位图标
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
  }
])
</script>

<style scoped>
.data-summary-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  box-sizing: border-box;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 25%;
}

/* ===== 图标与底座区域 ===== */
.icon-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

/* 悬浮图标样式 */
.icon-svg {
  position: relative;
  z-index: 2;
  width: 32px;
  height: 32px;
  color: var(--theme-color);
  filter: drop-shadow(0 0 8px var(--theme-color));
  /* 添加轻微的上下浮动动画 */
  animation: floatIcon 3s ease-in-out infinite;
}

.icon-svg :deep(svg) {
  width: 100%;
  height: 100%;
}

/* 3D 发光底座 */
.glow-base {
  position: absolute;
  bottom: 0px;
  width: 50px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  /* 利用透视产生 3D 扁平圆盘效果 */
  transform: perspective(200px) rotateX(65deg);
  box-shadow: 
    0 0 15px var(--theme-color), 
    inset 0 0 10px var(--theme-color);
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  z-index: 1;
}

/* 底座内部加深层 */
.base-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--theme-color);
  opacity: 0.3;
  filter: blur(4px);
}

/* ===== 数据与文字区域 ===== */
.value-wrapper {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 4px;
}

.value-text {
  font-family: "DIN", "Arial", sans-serif; /* 建议使用数字字体以显得更科技 */
  font-size: 26px;
  font-weight: bold;
  color: #56d8ec;
  text-shadow: 0 0 8px rgba(86, 216, 236, 0.5);
  letter-spacing: 1px;
}

.up-arrow {
  margin-left: 4px;
  opacity: 0.8;
}

.label-text {
  font-size: 13px;
  color: #a4bfe0;
  text-align: center;
}

/* ===== 动画 ===== */
@keyframes floatIcon {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>