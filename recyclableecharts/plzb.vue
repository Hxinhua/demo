<template>
  <div class="donut-wrap" style="height: 100%;">
    <div ref="chartRef" class="echartsdiv"></div>
    <div class="pulse-dot"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      { name: '纸类', value: 3680 },
      { name: '塑料', value: 2960 },
      { name: '金属', value: 1280 },
      { name: '玻璃', value: 1120 },
      { name: '织物', value: 860 },
      { name: '电子', value: 540 }
    ]
  }
})

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
  
  chartInstance.setOption({
    tooltip: {
      trigger: 'item',
      formatter: (p) => `${p.name}<br/>${p.value}公斤 (${p.percent}%)`
    },
    legend: {
      orient: 'vertical',
      right: '2%',
      top: 'center',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 6,
      formatter: (name) => {
        const item = props.data.find(d => d.name === name)
        const value = item ? item.value : 0
        return `{name|${name}}  {value|${value}}{unit|公斤}`
      },
      textStyle: {
        rich: {
          name: {
            color: '#a4bfe0',
            fontSize: 11,
            width: 50
          },
          value: {
            color: '#56d8ec',
            fontSize: 12,
            fontWeight: 'bold',
            width: 45,
            align: 'right'
          },
          unit: {
            color: '#7a8fa8',
            fontSize: 10,
            padding: [0, 0, 0, 2]
          }
        }
      }
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
      data: props.data.map((d, i) => ({
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

/* 中心柔和呼吸灯 */
.donut-wrap .pulse-dot {
  position: absolute;
  top: 50%;
  left: 35%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(86, 216, 236, 0.6) 0%, rgba(86, 216, 236, 0) 60%);
  animation: pulseSoft 2.5s ease-in-out infinite;
  pointer-events: none;
  z-index: 2;
}

@keyframes pulseSoft {
  0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.4); opacity: 1; }
}
</style>