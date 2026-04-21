<template>
  <div class="viewport"
    :style="{ 'transform-origin': origin, 'transform': 'scale(' + widScale + ',' + heiScale + ')' }">

    <div class="header panel-animate">
      <div class="title">再生资源分拣驾驶舱</div>
      <div class="time-info">
        <div class="clock" id="current-time">{{ timeStr }}</div>
        <div class="date">
          <span id="current-date">{{ currentdate }}{{ currentweek }}</span>
        </div>
      </div>
      <div class="sortconfig">
        <el-select v-model="sortquery.sortingCenterName" placeholder="请选择分拣中心" clearable filterable @change="sortChange">
          <el-option v-for="item in configlist" :key="item.id" :label="item.sortingCenterName"
            :value="item.sortingCenterName"></el-option>
        </el-select>
      </div>
    </div>

    <div class="layout-wrapper">
      
      <div class="mainbody top-section">
        <div class="column panel-animate" style="z-index: 10;">
          <div class="panebody panel">
            <div class="inner">
              <h3>数据汇总</h3>
              <div class="content sales">
                <div class="chart">
                  <div class="salesline" data-section="recycleTrend">
                    <sjhz v-if="sjhzif" :recycleTrendlist="recycleTrendlist" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="panebody panel">
            <div class="inner">
              <h3>环保贡献</h3>
              <div class="content">
                <hbfx :ecoStats="ecoStats" />
              </div>
            </div>
          </div>

          <div class="panebody panel">
            <div class="inner">
              <h3>回收品类</h3>
              <div class="content panecontent" style="display: flex;">
                <div class="contentpannel">
                  <span>排名</span>
                </div>
                <div class="hstype" data-section="recycleBrand">
                  <hstype v-if="recycleBrandif" :recycleBrandlist="recycleBrandlist" />
                </div>
                <div class="hstable">
                  <table cellspadding="0" cellsapcing="0">
                    <tbody>
                      <tr>
                        <th>今日回收</th>
                        <th>近 30 日回收</th>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr v-for="(item, i) in recycleBrandlist" :key="i + 'recycleBrandlist'">
                        <td>{{ item.recycleToday }}公斤</td>
                        <td style="color: #ffffffbe;">{{ item.last30DaysRecycling }}公斤</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="column panel-animate center-column">
          <div class="center-top-wrapper">
            <div class="mapcontainer" v-if="mapif">
              <lyamap :sortquery="sortquery" ref="lyamaprefs" />
            </div>

            <div class="map">
              <div class="chart">
                <div class="panel-container">
                  <div class="data-card" v-for="(item, i) in overviewStatlist" :key="i + 'overviewStatlist'">
                    <div class="card-header" v-if="item != null">
                      <div class="icon icon-blue" v-if="i == 0"><img src="../../assets/images/car.png" /></div>
                      <div class="icon icon-yellow" v-if="i == 1"><img src="../../assets/images/person.png" /></div>
                      <div class="icon icon-green" v-if="i == 2"><img src="../../assets/images/twoperson.png" /></div>
                      <div class="icon icon-purple" v-if="i == 3"><img src="../../assets/images/tian.png" /></div>
                      <div class="header-text" v-if="item.statName">{{ item.statName }}</div>
                    </div>
                    <div class="data-value" v-if="item != null">
                      <i>{{ item.statValue }}</i>
                      <span class="unit" v-if="item != null">{{ item.statUnit }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="panebody panel trend-panel">
            <div class="inner">
              <h3>回收趋势</h3>
              <div class="content sales" style="display: flex; flex-direction: column;">
                <div class="chart" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
                  <div class="label" style="flex: none; padding-bottom: 5px;">单位：公斤</div>
                  <div class="salesline" data-section="recycleTrend" style="flex: 1; min-height: 0;">
                    <salesline v-if="recycleTrendif" :recycleTrendlist="recycleTrendlist" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="column panel-animate">
          <div class="panebody panel">
            <div class="inner">
              <h3>购销概况</h3>
              <div class="content">
                <div class="chart">
                  <div class="xspm" data-section="recycleTrend">
                    <gxgk v-if="gxgkif" :recycleTrendlist="recycleTrendlist" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="panebody panel">
            <div class="inner">
              <h3>来料质量</h3>
              <div class="content">
                <llzl />
              </div>
            </div>
          </div>

          <div class="panebody panel">
            <div class="inner">
              <h3>品类占比</h3>
              <div class="content">
                <plzb :data="plzbData" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup name="recyclable">
import { parseTime } from '../../utils/ruoyi'
import salesline from './recyclableecharts/salesline'
import hstype from './recyclableecharts/hstype'
import xspm from './recyclableecharts/xspm'
import lyamap from './recyclableecharts/lyamap'
import sjhz from './recyclableecharts/sjhz'
import gxgk from './recyclableecharts/gxgk'
import hbfx from './recyclableecharts/hbfx'
import llzl from './recyclableecharts/llzl'
import plzb from './recyclableecharts/plzb'
import { listconfigt, listoverviewStat, listrecycleTrend, listrecycleBrand, listsaleRank } from "@/api/recyclable/recyclable"
const { proxy } = getCurrentInstance()

const data = reactive({
  form: {},
  timeStr: "",
  currentdate: "",
  currentweek: "",
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    categoryName: null,
  },
  overviewStatlist: [],
  configlist: [],
  sortquery: {
    sortingCenterName: "",
    sortingCenterId: "",
    sortingCenterCode: "",
    isRealScreen: "",
    longitude: 121.391382,
    latitude: 37.539297
  },
  mapif: false,
  // 环保贡献数据
  ecoStats: {
    carbonReduction: 128.5,
    treesSaved: 3420,
    energySaved: 15680,
    waterSaved: 8920
  },
  // 品类占比数据
  plzbData: [
    { name: '纸类', value: 3680 },
    { name: '塑料', value: 2960 },
    { name: '金属', value: 1280 },
    { name: '玻璃', value: 1120 },
    { name: '织物', value: 860 },
    { name: '电子', value: 540 }
  ]
})

const { timeStr, currentdate, currentweek, overviewStatlist, configlist, sortquery, mapif, ecoStats, plzbData } = toRefs(data)

// 初始化时间
function updateTime() {
  const now = new Date();
  const nowtimeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
  const dateStr = now.toLocaleDateString('zh-CN');
  timeStr.value = nowtimeStr
  currentdate.value = dateStr
  currentweek.value = getWeekday(now)
}

function getWeekday(date) {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[date.getDay()];
}

// 时间
setInterval(updateTime, 1000);
updateTime(); // 初始化调用

const widScale = ref()
const heiScale = ref()
const origin = ref("left top")
function pageZoom() {
  var winWidth = document.body.clientWidth;
  var winHeight = document.body.clientHeight;
  var widScale1 = winWidth / 1920;
  var heiScale1 = winHeight / 1080;
  widScale.value = widScale1;
  heiScale.value = heiScale1;
  window.onresize = function () {
    pageZoom();
  };
}

onMounted(() => {
  window.onresize = function () {
    pageZoom();
  };
});
pageZoom()

// 获取配置文件
function getconfiglist() {
  var queryParams = {
    pageNum: 1,
    pageSize: 1000,
  }
  listconfigt(queryParams.value).then(response => {
    if (response.code == 200) {
      configlist.value = response.rows
      sortquery.value.sortingCenterName = ''
      mapif.value = true
    }
  })
}
getconfiglist()

// 分拣中心选择
function sortChange(val) {
  if (!val) {
    sortquery.value.sortingCenterName = ''
    sortquery.value.sortingCenterId = ''
    sortquery.value.sortingCenterCode = ''
    sortquery.value.isRealScreen = ''
    sortquery.value.longitude = 121.391382
    sortquery.value.latitude = 37.539297
    return
  }
  
  var newconfiglist = JSON.parse(JSON.stringify(configlist.value))
  const selectedDepartment = newconfiglist.find(item => item.sortingCenterName === val)
  if (selectedDepartment) {
    sortquery.value.sortingCenterName = selectedDepartment.sortingCenterName
    sortquery.value.sortingCenterId = selectedDepartment.sortingCenterId
    sortquery.value.sortingCenterCode = selectedDepartment.sortingCenterCode
    sortquery.value.isRealScreen = selectedDepartment.isRealScreen
    sortquery.value.longitude = selectedDepartment.longitude
    sortquery.value.latitude = selectedDepartment.latitude
    
    getoverviewStat()
    getrecycleTrend()
    getrecycleBrand()
    getsaleRank()
  }
}

// 总揽统计
function getoverviewStat() {
  var queryParams = {
    pageNum: 1,
    pageSize: 10,
    sortingCenterId: sortquery.value.sortingCenterId,
    sortingCenterCode: sortquery.value.sortingCenterCode,
    isRealScreen: sortquery.value.isRealScreen,
  }
  listoverviewStat(queryParams).then(response => {
    if (response.code == 200) {
      overviewStatlist.value = response.data
    }
  })
}

// 数据汇总
const sjhzlist = ref([])
const sjhzif = ref(true)

// 购销概况
const gxgklist = ref([])
const gxgkif = ref(true)

// 回收趋势
const recycleTrendlist = ref([])
const recycleTrendif = ref(false)
function getrecycleTrend() {
  var queryParams = {
    pageNum: 1,
    pageSize: 10,
    sortingCenterId: sortquery.value.sortingCenterId,
    sortingCenterCode: sortquery.value.sortingCenterCode,
    isRealScreen: sortquery.value.isRealScreen,
  }
  recycleTrendif.value = false
  listrecycleTrend(queryParams).then(response => {
    if (response.code == 200) {
      recycleTrendlist.value = response.data
      for (let index = 0; index < recycleTrendlist.value.length; index++) {
        const element = recycleTrendlist.value[index];
        element.statTime = parseTime(element.statTime, '{y}-{m}')
      }
      recycleTrendif.value = true
    }
  })
}

// 回收品类
const recycleBrandlist = ref([])
const recycleBrandif = ref(false)
function getrecycleBrand() {
  var queryParams = {
    pageNum: 1,
    pageSize: 6,
    sortingCenterId: sortquery.value.sortingCenterId,
    sortingCenterCode: sortquery.value.sortingCenterCode,
    isRealScreen: sortquery.value.isRealScreen,
  }
  recycleBrandif.value = false
  listrecycleBrand(queryParams).then(response => {
    if (response.code == 200) {
      recycleBrandlist.value = response.data
      for (let index = 0; index < recycleBrandlist.value.length; index++) {
        const element = recycleBrandlist.value[index];
        element.statTime = parseTime(element.statTime, '{y}-{m}')
      }
      setTimeout(() => {
        recycleBrandif.value = true
      }, 200);
    }
  })
}

// 销售排名
const saleRanklist = ref([])
const saleRankif = ref(false)
function getsaleRank() {
  var queryParams = {
    pageNum: 1,
    pageSize: 10,
    sortingCenterId: sortquery.value.sortingCenterId,
    sortingCenterCode: sortquery.value.sortingCenterCode,
    isRealScreen: sortquery.value.isRealScreen,
  }
  saleRankif.value = false
  listsaleRank(queryParams).then(response => {
    if (response.code == 200) {
      saleRanklist.value = response.data
      saleRankif.value = true
    }
  })
}
</script>

<style scoped>
@import "../../assets/styles/screen.css";

/* ===== 核心限高保护与三列对齐结构 ===== */
.layout-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100% - 110px); /* 留足底部边距防裁切 */
  width: 100%;
  box-sizing: border-box;
}

.mainbody.top-section {
  height: 100%;
  flex: none;
}

.top-section .column {
  display: flex;
  flex-direction: column;
}

/* 左、右列：3个面板严格 flex:1 均分 */
.top-section .column .panel {
  flex: 1;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
}

.top-section .column .panel:last-child {
  margin-bottom: 0;
}

/* 防止内部 Echarts 或组件撑破高度 */
.panel .inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.panel .inner h3 {
  flex: none;
}

.panel .inner .content {
  flex: 1;
  min-height: 0;
  width: 100%;
  position: relative;
}

/* ===== 中间列精确定高 ===== */
.center-column {
  display: flex;
  flex-direction: column;
}

/* 顶部（地图+统计）：2/3 高度 */
.center-top-wrapper {
  flex: 0 0 calc((100% - 28px) * 2 / 3 + 14px);
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

.center-top-wrapper .mapcontainer {
  flex: 1;
  min-height: 0;
}

/* 底部面板：严格 1/3 高度 */
.center-column .trend-panel {
  flex: 0 0 calc((100% - 28px) / 3);
  min-height: 0;
  margin-bottom: 0;
}

/* ===== 中间统计数据卡片 (Stats Bar) ===== */
.center-top-wrapper .map {
  flex: none;
  background: rgba(7, 38, 85, 0.4);
  border-top: 1px solid rgba(86, 216, 236, 0.2);
  margin-top: 8px; 
}
.center-top-wrapper .panel-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 8px 0;
}

/* ===== 动画关键帧定义 ===== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes numberRoll {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== 面板动画类 ===== */
.panel-animate {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
}
.panel-animate:nth-child(1) { animation-delay: 0.1s; }
.panel-animate:nth-child(2) { animation-delay: 0.2s; }
.panel-animate:nth-child(3) { animation-delay: 0.3s; }

/* ===== 数据卡片动画 ===== */
.data-card {
  animation: scaleIn 0.5s ease-out forwards;
  opacity: 0;
  transition: all 0.3s ease;
}
.data-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 30px rgba(86, 216, 236, 0.3);
}

.data-value {
  animation: numberRoll 0.8s ease-out forwards;
}
.data-value i {
  font-style: normal;
  transition: all 0.3s ease;
}
.data-value:hover i {
  color: #56d8ec;
  text-shadow: 0 0 10px rgba(86, 216, 236, 0.8);
}

/* ===== 表格行动画 ===== */
.hstable tbody tr,
.gystable tbody tr {
  animation: slideInRight 0.4s ease-out forwards;
  opacity: 0;
  transition: all 0.3s ease;
}
.hstable tbody tr:hover,
.gystable tbody tr:hover {
  background: rgba(86, 216, 236, 0.1);
  transform: translateX(5px);
}

/* ===== 标题动画 ===== */
.inner h3 {
  position: relative;
  overflow: hidden;
  padding-bottom: 3px;
}
.inner h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #56d8ec, transparent);
  animation: lineGrow 1s ease-out forwards;
}
@keyframes lineGrow {
  to { width: 100%; }
}

/* ===== 原有下拉等样式保持不变 ===== */
:deep(.el-dialog__title) {
  color: #fff;
}
.sortconfig :deep(.el-select) {
  width: 250px;
}
.sortconfig :deep(.el-select .el-select__wrapper) {
  background-color: #072655 !important;
  box-shadow: 0 0 0 1px #1a3f6e inset !important;
  color: #56d8ec !important;
}
.sortconfig :deep(.el-select .el-select__selected-item) {
  color: #56d8ec !important;
}
</style>