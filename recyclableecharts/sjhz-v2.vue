<template>
  <div class="data-summary-grid">
    <div class="summary-card" v-for="(item, index) in displayList" :key="index" :class="'card-' + index">
      <div class="summary-icon" :class="getIconClass(index)">
        <svg viewBox="0 0 24 24" v-html="getIconSvg(index)"></svg>
      </div>
      <div class="summary-data">
        <div class="summary-value">{{ item.statValue }}<span class="summary-unit">{{ item.statUnit }}</span></div>
        <div class="summary-label">{{ item.statName }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  }
})

// 只取前两个数据
const displayList = computed(() => {
  return props.dataList.slice(0, 2)
})

// 获取图标样式类
function getIconClass(index) {
  const classes = ['icon-blue', 'icon-cyan']
  return classes[index % classes.length]
}

// 获取图标SVG
function getIconSvg(index) {
  const icons = [
    // 第一个图标 - 数据/图表
    '<path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
    // 第二个图标 - 回收/循环
    '<path fill="currentColor" d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>'
  ]
  return icons[index % icons.length]
}
</script>

<style scoped>
.data-summary-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  height: 100%;
  padding: 8px 0;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(86, 216, 236, 0.08), rgba(86, 216, 236, 0.02));
  border: 1px solid rgba(86, 216, 236, 0.15);
  border-radius: 6px;
  transition: all 0.3s ease;
  animation: scaleIn 0.5s ease-out forwards;
  opacity: 0;
}

.summary-card:nth-child(1) { animation-delay: 0.1s; }
.summary-card:nth-child(2) { animation-delay: 0.2s; }

.summary-card:hover {
  background: linear-gradient(135deg, rgba(86, 216, 236, 0.15), rgba(86, 216, 236, 0.05));
  transform: translateX(5px);
  border-color: rgba(86, 216, 236, 0.3);
}

.summary-icon {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: visible;
  transform: translateZ(0);
}

.summary-icon svg {
  width: 22px;
  height: 22px;
  z-index: 2;
  position: relative;
}

.summary-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.2;
  animation: ripple 2s ease-out infinite;
  z-index: 0;
}

.summary-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border-radius: 50%;
  border: 2px solid currentColor;
  opacity: 0.6;
  animation: pulse 2s ease-out infinite;
  z-index: 1;
}

.icon-blue {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.icon-cyan {
  background: rgba(6, 182, 212, 0.15);
  color: #06b6d4;
}

.summary-data {
  flex: 1;
}

.summary-value {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.summary-unit {
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 4px;
}

.summary-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.3; }
}

@keyframes ripple {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.1; }
  100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
}
</style>
