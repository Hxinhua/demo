<template>
  <div ref="chatMain" class="echartsdiv">
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, nextTick, watch } from 'vue'

const props = defineProps({
  // 建议传入数据，这里先写死模拟数据测试显示
  chartData: {
    type: Array,
    default: () => []
  },
})

const chatMain = ref(null);
let myechart = null;

onMounted(() => {
  nextTick(() => {
    getecharts()
  });
});

// 增加 resize 监听，防止缩放时消失
window.addEventListener('resize', () => {
  myechart && myechart.resize();
})

function getecharts() {
  if (!chatMain.value) return;
  myechart = echarts.init(chatMain.value, 'chatMain')

  // 1. 模拟图片上的数据
  const xData = ['分拣1', '分拣2',];
  const purchaseData = [33.78, 0,];
  const salesData = [31.01, 32.06];

  var option = {
    // 2. 核心：grid 必须调整，否则图表会被挤压或留白太多
    grid: {
      top: '22%',    // 顶部留空给倾斜数字和图例
      left: '3%',
      right: '3%',
      bottom: '5%',
      containLabel: true // 包含刻度文字，防止被遮挡
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['采购量', '销售量'],
      textStyle: { color: '#ffffffbe', fontSize: 12 },
      top: '0%',
      right: '5%'
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
      axisLabel: {
        interval: 0,
        color: '#56d8ec', // 贴合你项目的字体颜色
        fontSize: 14,
        margin: 15
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: { type: 'dashed', color: 'rgba(255, 255, 255, 0.1)' }
      },
      axisLabel: { color: '#ffffffbe', fontSize: 12 }
    },
    series: [
      {
        name: '采购量',
        type: 'bar',
        barWidth: '25%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4dabf7' },
            { offset: 1, color: '#5c7cfa' }
          ])
        },
        label: {
          show: true,
          position: 'top',
          rotate: 30, // 还原图片中的倾斜数值
          color: '#fff',
          fontSize: 12,
          fontWeight: 'bold',
          formatter: '{c}'
        },
        data: purchaseData
      },
      {
        name: '销售量',
        type: 'bar',
        barWidth: '25%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#22b8cf' },
            { offset: 1, color: '#0ca678' }
          ])
        },
        label: {
          show: true,
          position: 'top',
          rotate: 30,
          color: '#fff',
          fontSize: 12,
          fontWeight: 'bold',
          formatter: '{c}'
        },
        data: salesData
      }
    ]
  };
  myechart.setOption(option);
}
</script>

<style scoped>
.echartsdiv {
  width: 100%;
  /* 如果父级是 flex 布局且设置了 flex: 1，这里 100% 才能起作用 */
  height: 100%;
  min-height: 200px;
  /* 强制给个最小高度防止塌陷 */
}
</style>
