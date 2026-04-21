<template>
  <div class="content" style="height: 100%; display: flex; flex-direction: column;">
    <div class="donut-wrap" style="flex: 1; min-height: 0;">
      <div ref="chartRef" class="echartsdiv"></div>
      <div class="ring-outer"></div>
      <div class="ring-inner"></div>
      <div class="pulse-dot"></div>
    </div>
    <div class="mini-metrics">
      <span class="metric">杂质率：3.2%</span>
      <span class="metric">含水率：6.8%</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance = null

// 环形图公共配色
const pieColors = ['#00f2f1', '#416b9e', '#4caf50', '#7f4e68', '#eab308', '#06b6d4']

onMounted(() => {
  renderChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
  }
})

function handleResize() {
  if (chartInstance) {
    chartInstance.resize()
  }
}

function renderChart() {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const data = [
    { name: '合格料', value: 78 },
    { name: '杂质偏高', value: 12 },
    { name: '含水偏高', value: 7 },
    { name: '疑似危废/异常', value: 3 }
  ]
  
  chartInstance.setOption({
    tooltip: {
      trigger: 'item',
      formatter: (p) => `${p.name}：${p.percent}%`
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#a4bfe0', fontSize: 12 },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 8
    },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: '#0d1b2a',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
          color: '#fff'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: (idx) => idx * 200,
      data: data.map((d, i) => ({
        ...d,
        itemStyle: { color: pieColors[i % pieColors.length] }
      }))
    }]
  })
}
</script>

<style scoped>
.echartsdiv {
  width: 100%;
  height: 100%;
}

/* 环形图动画容器 */
.donut-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 外部科技感光环 */
.donut-wrap .ring-outer {
  position: absolute;
  top: 50%;
  left: 35%;
  width: min(54%, 190px);
  height: min(54%, 190px);
  border-radius: 50%;
  /* 制作两侧有实线，上下有微弱发光的效果 */
  border: 2px solid rgba(86, 216, 236, 0.1);
  border-left: 2px solid rgba(86, 216, 236, 0.8);
  border-right: 2px solid rgba(86, 216, 236, 0.8);
  box-shadow: 0 0 15px rgba(86, 216, 236, 0.2) inset;
  animation: spinOuter 8s linear infinite;
  pointer-events: none;
  z-index: 1;
}

/* 内部虚线环 */
.donut-wrap .ring-inner {
  position: absolute;
  top: 50%;
  left: 35%;
  width: min(46%, 160px);
  height: min(46%, 160px);
  border-radius: 50%;
  border: 2px dashed rgba(86, 216, 236, 0.4);
  animation: spinInner 12s linear infinite reverse; /* 反向旋转 */
  pointer-events: none;
  z-index: 1;
}

/* 中心柔和呼吸灯 */
.donut-wrap .pulse-dot {
  position: absolute;
  top: 50%;
  left: 35%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  /* 使用径向渐变，让光晕更加柔和自然 */
  background: radial-gradient(circle, rgba(86, 216, 236, 0.6) 0%, rgba(86, 216, 236, 0) 60%);
  animation: pulseSoft 2.5s ease-in-out infinite;
  pointer-events: none;
  z-index: 2;
}

/* 动画定义 */
@keyframes spinOuter {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes spinInner {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes pulseSoft {
  0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.4); opacity: 1; }
}

.mini-metrics {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-top: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}

.mini-metrics .metric {
  white-space: nowrap;
}
</style>