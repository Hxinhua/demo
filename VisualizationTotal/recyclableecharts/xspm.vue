<template>
  <div ref="chatMain" class="echartsdiv">
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
const props = defineProps({
  saleRanklist: {
    type: Array,
  },
})
const chatMain = ref(null);
onMounted(() => {
  nextTick(() => {
    getecharts()
  });
});
function getecharts() {
  const myechart = echarts.init(chatMain.value, 'chatMain')
  // 模拟数据
  const xData = [];
  const yData = [];
  for (let index = 0; index < props.saleRanklist.length; index++) {
    const element = props.saleRanklist[index];
    xData.push(element.categoryName)
    yData.push(Number(element.weight))
  }
  const maxVal = 100; // 满格对应的数值，用于绘制背景
  var option = {
    // 设置网格样式
    grid: {
      show: true,// 显示边框
      top: '5%',
      left: '3%',
      right: '0',
      bottom: '5%',
      show: false,
      borderColor: '#2e4964',// 边框颜色
      containLabel: true // 包含刻度文字在内
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' }, // 去除指示线
      formatter: '{b0}: {c1}'
    },
    xAxis: [{
      data: xData,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        interval: 0, // 强制显示所有标签
        color: '#56d8ec',
        fontSize: '14px',
        margin: 20
      }
    },
    {
      type: 'category',
      boundaryGap: true,
      axisTick: { show: false },
      axisLine: { show: false },
      data: yData,
      axisLabel: {
        interval: 0,
        color: '#ffffffbe',
        fontSize: '14px',
        margin: 20,
        formatter: function (value, index) {
          return value + '公斤';
        },
      }
    }],
    yAxis: {
      splitLine: { show: false },
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false }
    },
    // 这里的 animationDurationUpdate 很重要，让动态变化更流畅
    animationEasing: 'cubicOut',
    series: [
      {
        // --- 底部背景条（灰色的空电量格） ---
        type: 'pictorialBar',
        symbol: 'roundRect', // 图形形状：圆角矩形
        symbolRepeat: 'fixed', // 固定重复次数，或者用 true 自动计算
        symbolMargin: '20%', // 图形间的间隔
        symbolClip: false,   // 背景不需要裁剪，全部显示
        symbolSize: [30, 8], // [宽, 高] - 这里宽是柱子宽度，高是单格高度
        data: yData.map(() => maxVal), // 所有数据都设为最大值
        itemStyle: {
          color: 'rgba(255,255,255,0.1)' // 灰色半透明背景
        },
        z: 1, // 层级在下
        animation: false // 背景不需要动画
      },
      {
        // --- 顶部数据条（带渐变的电量格） ---
        type: 'pictorialBar',
        symbol: 'roundRect',
        symbolRepeat: true, // 根据数值自动重复
        symbolMargin: '20%', // 必须与背景保持一致
        symbolClip: true,   // 关键：开启裁剪，根据数据值显示对应高度
        symbolSize: [30, 8], // 必须与背景保持一致
        data: yData,
        z: 2, // 层级在上
        itemStyle: {
          // 定义线性渐变
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00ffcc' }, // 顶部颜色（青色）
            { offset: 1, color: '#007bff' }  // 底部颜色（蓝色）
          ])
        },
        label: {
          show: false,
          position: 'top',
          color: '#00ffcc',
          fontSize: 14,
          formatter: '{c}%'
        }
      }
    ]
  };
  myechart.setOption(option);
  myechart.on('click', function (param) {

  });
}
</script>
<style scoped>
.echartsdiv {
  width: 100%;
  height: 100%;
}
</style>