<template>
  <div ref="chatMain" class="echartsdiv">
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
const props = defineProps({
  inventorylist: {
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
  console.log(props.inventorylist)
  const myechart = echarts.init(chatMain.value, 'chatMain')
  const colors = ['#2d8cf0', '#ff6b6b', '#00e5ff', '#e0e0e0'];
  // 转换为 ECharts 饼图需要的格式：{ name: '...', value: ... }
  const chartData = props.inventorylist.map(item => ({
    name: item.categoryName,
    value: Number(item.weight)
  }));
  var option = {
    backgroundColor: 'transparent', // 背景透明，由CSS控制容器背景
    color: colors,
    tooltip: {
      trigger: 'item',
      formatter: '{a0}<br/>{b}: {c}公斤 ({d}%)' // 提示框格式
    },
    // 图例
    legend: {
      // orient: 'vertical',
      // left: 'left',
      // top: '20%',
      // data: ['PET专项', '织物', '纸张', '塑料'],
      // textStyle: {
      //     color: '#fff'
      // },
      orient: 'vertical',
      left: 'left',
      top: 45,
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 18,
      data: chartData.map(item => item.name),
      formatter: function (name) {
        // 通过name获取到数组对象中的单个对象
        let singleData = chartData.filter(function (item) {
          return item.name == name;
        });
        // return name + '  ' + singleData[0].value + '公斤';
        return `{name|${name}}\t{percent|${singleData[0].value}}{hanzi|公斤}`
      },
      textStyle: {
        fontSize: '14px',
        color: '#fff',
        rich: {
          name: {
            fontSize: '14px',
            color: '#cfd8e8',
            padding: [0, 0, 0, 0]
          },
          percent: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: "#3b6394",
            padding: [0, 0, 0, 0]
          },
          value: {
            fontSize: '14px',
            color: 'rgba(0, 0, 0, 0.85)',
            padding: [0, 0, 0, 0],
            fontWeight: 700
          }
        }
      }
    },
    series: [
      // ----------------------------------------
      // 第一层：核心饼图 (带发光效果)
      // ----------------------------------------
      {
        name: 'MainData',
        type: 'pie',
        radius: ['55%', '70%'], // 内外半径，形成圆环
        center: ['65%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10, // 圆角扇形
          // borderColor: '#fff', // 边框颜色与背景一致，产生切割感
          borderWidth: 1,
          // !! 核心：荧光效果配置 !!
          shadowBlur: 20,
          shadowColor: 'rgba(255, 255, 255, 0.3)'
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: '#fff',
          fontSize: '14px',
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10,
          smooth: true
        },
        // 鼠标悬停放大效果
        emphasis: {
          scale: true,
          scaleSize: 10,
          itemStyle: {
            shadowBlur: 30,
            shadowColor: 'rgba(255, 255, 255, 0.8)'
          }
        },
        data: chartData
      },

      // ----------------------------------------
      // 中心装饰：科技感圆环
      // ----------------------------------------
      {
        type: 'pie',
        radius: ['35%', '36%'],
        center: ['65%', '50%'],
        label: { show: false },
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [{
              offset: 0, color: 'rgba(86, 216, 236, 0.1)'
            }, {
              offset: 0.5, color: 'rgba(86, 216, 236, 0.8)'
            }, {
              offset: 1, color: 'rgba(86, 216, 236, 0.1)'
            }]
          }
        },
        data: [{ value: 1 }],
        animation: false,
        tooltip: { show: false },
        hoverAnimation: false
      },
      // 中心数据标签
      {
        type: 'pie',
        radius: ['0%', '30%'],
        center: ['65%', '50%'],
        label: {
          show: true,
          position: 'center',
          formatter: function() {
            const total = chartData.reduce((sum, item) => sum + item.value, 0);
            return `{total|${total}}\n{unit|公斤}`;
          },
          rich: {
            total: {
              fontSize: 24,
              fontWeight: 'bold',
              color: '#56d8ec',
              padding: [0, 0, 5, 0]
            },
            unit: {
              fontSize: 12,
              color: '#a4bfe0'
            }
          }
        },
        itemStyle: { color: 'transparent' },
        data: [{ value: 1 }],
        animation: false,
        tooltip: { show: false },
        hoverAnimation: false,
        silent: true
      }
    ],
    // color: ['#006cff', '#60cda0', '#ed8884', '#ff9f7f', '#0096ff', '#9fe6b8', '#32c5e9', '#1d9dff']
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
