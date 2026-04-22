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
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisTick: { show: false },
      axisLabel: {
        interval: 'auto', // 改为自动，让 ECharts 自动计算最佳显示密度，防止重叠
        // rotate: 20,       // 倾斜 20 度，既能显示更多文字，又能防止重叠
        color: '#4c9bfd',
        fontSize: '10px'  // 适当减小字号
      },
      axisLine: { show: false },
      boundaryGap: true   // 改为 true，让首尾保留半个刻度的间距，防止文字贴边
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
        fontSize: '12px', // 字号从 16px 调小到 12px，减少占用空间
        color: '#4c9bfd'
      },
      top: '5%',         // 稍微下移一点点
      left: 'center',    // 改为居中，避免挤在右边遮挡折线末端
      itemWidth: 10,     // 缩小图标宽度
      itemHeight: 10     // 缩小图标高度
    },
    // 设置网格样式
    grid: {
      show: false,
      top: '25%',    // 从 20% 增加到 25%，拉开图表与上方图例的距离
      left: '3%',
      right: '5%',   // 稍微增加右边距，防止最后一个日期标签溢出
      bottom: '10%', // 增加底部间距，给倾斜的标签留空间
      containLabel: true
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