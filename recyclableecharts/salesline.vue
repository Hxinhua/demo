<template>
  <div ref="chatMain" class="echartsdiv">
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
const props = defineProps({
  recycleTrendlist: {
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
  // 1. 提取所有唯一日期并排序（按时间顺序，从早到晚）
  const dates = [...new Set(props.recycleTrendlist.map(item => item.statTime))].sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  // 2. 按 name 分组
  const groups = {};
  props.recycleTrendlist.forEach(item => {
    if (!groups[item.categoryName]) {
      groups[item.categoryName] = {};
    }
    groups[item.categoryName][item.statTime] = item.weight;
  });
  const colordata = ['#00f2f1', '#416b9e', '#4caf50', '#7f4e68']
  // 3. 构建 series
  const series = Object.keys(groups).map((categoryName, index) => {
    const values = dates.map(statTime => groups[categoryName][statTime] ?? '-'); // 若无数据用 '-'（ECharts 会断点）
    return {
      name: categoryName,
      type: 'line',
      // 圆滑连接                                  
      smooth: true,
      data: values,
      itemStyle: {
        color: colordata[index] // 线颜色
      }
    };
  });
  const myechart = echarts.init(chatMain.value, 'chatMain')
  var option = {
    //鼠标提示工具
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      // 类目类型                                  
      type: 'category',
      // x轴刻度文字                                  
      data: dates,
      axisTick: {
        show: false//去除刻度线
      },
      axisLabel: {
        // fontSize: '0.55rem',
        interval: 0, // 强制显示所有标签
        // rotate: 30,// 通过旋转解决标签显示不下的问题
        color: '#4c9bfd'//文本颜色
      },
      axisLine: {
        show: false,//去除轴线  
      },
      boundaryGap: false//去除轴内间距
    },
    yAxis: {
      // 数据作为刻度文字                                  
      type: 'value',
      axisTick: {
        show: false//去除刻度线
      },
      axisLabel: {
        // fontSize: '0.55rem',
        color: '#4c9bfd'//文本颜色
      },
      axisLine: {
        show: false,//去除轴线  
      },
      splitLine: { // 修改 Y 轴横线样式
        lineStyle: {
          color: '#2e4964', // 设置横线颜色为绿色
          // type: 'dashed' // 设置为虚线
        }
      },
      boundaryGap: false//去除轴内间距
    },
    //图例组件
    legend: {
      textStyle: {
        fontSize: '16px',
        color: '#4c9bfd' // 图例文字颜色

      },
      top: 0,
      right: '0%'//距离右边10%
    },
    // 设置网格样式
    grid: {
      show: true,// 显示边框
      top: '20%',
      left: '3%',
      right: '8%',
      bottom: '3%',
      show: false,
      borderColor: '#2e4964',// 边框颜色
      containLabel: true // 包含刻度文字在内
    },
    series: series
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