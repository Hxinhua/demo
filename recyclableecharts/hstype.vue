<template>
  <div ref="chatMain" class="echartsdiv" :style="{ 'height': chatheight }">
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  recycleBrandlist: {
    type: Array,
    default: () => []
  },
})

const chatheight = ref('100%')
const chatMain = ref(null);
let myechart = null;

onMounted(() => {
  nextTick(() => {
    if (props.recycleBrandlist && props.recycleBrandlist.length > 0) {
      getecharts()
    }
  });
});

// 监听数据变化，重新渲染图表
watch(() => props.recycleBrandlist, (newVal) => {
  if (newVal && newVal.length > 0) {
    nextTick(() => {
      getecharts()
    })
  }
}, { deep: true, immediate: true });
function getecharts() {
  chatheight.value = props.recycleBrandlist.length * 39 + 'px'
  setTimeout(() => {
    const yAxisdata = []
    const recycleToday = []
    const last30DaysRecycling = []
    const rankNo = []
    for (let index = 0; index < props.recycleBrandlist.length; index++) {
      const element = props.recycleBrandlist[index];
      yAxisdata.push(element.categoryName)
      recycleToday.push(element.recycleToday)
      last30DaysRecycling.push(element.last30DaysRecycling)
      rankNo.push(element.rankNo)
    }
    const myechart = echarts.init(chatMain.value, 'chatMain')
    var option = {
      //鼠标提示工具
      tooltip: {
        trigger: 'axis'
      },
      //图例组件
      legend: {
        show: false,
        textStyle: {
          color: '#4c9bfd' // 图例文字颜色
        },
        right: '10%'//距离右边10%
      },
      xAxis: {
        // 数据作为刻度文字  
        type: 'value',
        axisTick: {
          show: false//去除刻度线
        },
        axisLabel: {
          show: false
        },
        axisLine: {
          show: false,//去除轴线  
        },
        splitLine: { // 修改 Y 轴横线样式
          show: false
        },
        boundaryGap: false//去除轴内间距
      },
      yAxis: {
        // 类目类型                                  
        type: 'category',
        data: yAxisdata,
        inverse: true,
        axisTick: {
          show: false//去除刻度线
        },
        axisLabel: {
          // color: '#4c9bfd'//文本颜色
          color: '#fff',
          fontSize: '16px',

          textStyle: {
            align: 'right',
            color: '#fff'
          },
          // 这里的formatter函数可以根据你的需要进行调整  
          formatter: function (value, index) {
            if (index < 3) {
              return `{titleBg${rankNo[index]}|${rankNo[index]} }{vuleBg|${value} } `;
            } else {
              return `{titleBg|${rankNo[index]} }{vuleBg|${value} } `;
            }
          },
          rich: {
            titleBg: {
              backgroundColor: '#1c3257',
              height: 15,
              align: "center",
              lineheight: 17,
              borderRadius: 15,
              padding: [3, 0, 0, 1],
              width: 20,
              color: '#fff',
              align: 'right'
            },
            titleBg1: {
              backgroundColor: '#f7d760',
              height: 15,
              align: "center",
              fontWeight: "bold",
              borderRadius: 15,
              padding: [3, 0, 0, 1],
              width: 20,
              color: '#000',
              align: 'right'
            },
            titleBg2: {
              backgroundColor: '#dbdee8',
              height: 15,
              align: "center",
              lineheight: 17,
              fontWeight: "bold",
              borderRadius: 15,
              padding: [3, 0, 0, 1],
              width: 20,
              color: '#000',
              align: 'right'
            },
            titleBg3: {
              backgroundColor: '#ef954a',
              height: 15,
              align: "center",
              lineheight: 17,
              fontWeight: "bold",
              borderRadius: 15,
              padding: [3, 0, 0, 1],
              width: 20,
              color: '#000',
              align: 'right'
            },
            vuleBg: {
              height: 30,
              width: 50,
              overflow: "hidden",
              color: '#fff',
              align: 'left'
            },

          }
        },
        axisLine: {
          show: false,//去除轴线  
        },
        splitLine: { // 修改 Y 轴横线样式
          show: false
        },
        boundaryGap: false//去除轴内间距
      },

      // 设置网格样式
      grid: {
        show: true,// 显示边框
        top: '25px',
        left: '3%',
        right: '0',
        bottom: '5%',
        show: false,
        borderColor: '#2e4964',// 边框颜色
        containLabel: true // 包含刻度文字在内
      },
      series: [{
        name: '今日回收',
        // 数据                                  
        data: recycleToday,
        // 图表类型                                  
        type: 'bar',
        barWidth: "6px",
        barGap: '1px', // 设置柱间距离
        // 圆滑连接                                  
        smooth: true,
        showBackground: true,
        backgroundStyle: {
          color: '#21374f',
        },
        itemStyle: {
          barBorderRadius: [0, 100, 100, 0],

          color: new echarts.graphic.LinearGradient(
            1, 0, 0, 0,
            [
              { offset: 0, color: '#5097fe' },
              { offset: 0.5, color: '#5680c5' },
              { offset: 1, color: '#2e4f7a' }
            ]
          )
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              1, 0, 0, 0,
              [
                { offset: 0, color: '#5097fe' },
                { offset: 0.5, color: '#5680c5' },
                { offset: 1, color: '#2e4f7a' }
              ]
            )
          }
        },

      },
      {
        name: '近30日回收',
        // 数据                                  
        data: last30DaysRecycling,
        // 图表类型                                  
        type: 'bar',
        barWidth: "6px",
        // 圆滑连接                                  
        smooth: true,
        showBackground: true,
        backgroundStyle: {
          color: '#21374f',
        },
        itemStyle: {
          barBorderRadius: [0, 100, 100, 0],

          color: new echarts.graphic.LinearGradient(
            1, 0, 0, 0,
            [
              { offset: 0, color: '#ea7d91' },
              { offset: 0.5, color: '#a87384' },
              { offset: 1, color: '#2f3954' }
            ]
          )
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              1, 0, 0, 0,
              [
                { offset: 0, color: '#ea7d91' },
                { offset: 0.5, color: '#a87384' },
                { offset: 1, color: '#2f3954' }
              ]
            )
          }
        },
      }]
    };
    myechart.setOption(option);
    myechart.on('click', function (param) {

    });
  }, 200);
}
</script>
<style scoped>
.echartsdiv {
  width: 100%;
  height: 100%;
}
</style>