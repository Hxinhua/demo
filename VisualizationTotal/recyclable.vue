<template>
  <div class="viewport"
    :style="{ 'transform-origin': origin, 'transform': 'scale(' + widScale + ',' + heiScale + ')' }">

    <!-- 顶部栏 - 添加入场动画 -->
    <div class="header panel-animate">
      <div class="title">再生资源分拣驾驶舱</div>
      <div class="time-info">
        <div class="clock" id="current-time">{{ timeStr }}</div>
        <div class="date">
          <span id="current-date">{{ currentdate }}{{ currentweek }}</span>
        </div>
      </div>
      <div class="sortconfig">
        <el-select v-model="sortquery.sortingCenterName" placeholder="请选择" @change="sortChange">
          <el-option v-for="item in configlist" :key="item.id" :label="item.sortingCenterName"
            :value="item.id"></el-option>
        </el-select>
      </div>
    </div>

    <div class="mainbody">
      <!-- 左侧列 -->
      <div class="column panel-animate" style="z-index: 10;">
        <div class="panebody panel">
          <div class="inner">
            <h3>回收趋势</h3>
            <div class="content sales">
              <div class="chart">
                <div class="label">单位：公斤</div>
                <div class="salesline" data-section="recycleTrend">
                  <salesline v-if="recycleTrendif" :recycleTrendlist="recycleTrendlist" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 回收品类 -->
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

        <!-- 回收站排名 -->
        <div class="panebody panel">
          <div class="inner">
            <h3>回收站排名</h3>
            <div class="gystj">
              <div class="gysgy">
                <span class="span01"></span><span class="span02">回收站总数</span>
                <span class="span03">{{ todaySupplier }}</span>
              </div>
              <div class="gysgy">
                <span class="span01"></span><span class="span02">今日供应</span>
                <span class="span03">{{ supplierTotal }}</span>
              </div>
            </div>
            <div class="content panecontent" style="display: flex;">
              <div class="contentpannel">
                <span style="width: 60px;">排名</span>
                <span>回收站</span>
              </div>
              <div class="gyspm" data-section="supplierRank">
                <gyspm v-if="supplierRankif" :supplierRanklist="supplierRanklist" />
              </div>
              <div class="gystable">
                <table cellspadding="0" cellsapcing="0">
                  <tbody>
                    <tr>
                      <th>近 30 日回收</th>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr v-for="(item, i) in supplierRanklist" :key="i + 'supplierRanklist'">
                      <td>{{ item.last30DaysRecycling }}公斤</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间列 -->
      <div class="column panel-animate">
        <div class="mapcontainer" v-if="mapif">
          <lyamap :sortquery="sortquery" ref="lyamaprefs" />
        </div>

        <!-- 地图数据卡片 -->
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

        <!-- 实时回收 -->
        <div class="monitor panel">
          <div class="inner">
            <h3>实时回收</h3>
            <div class="content" style="display: block;">
              <div class="head">
                <span class="col">回收站</span>
                <span class="col">回收方式</span>
                <span class="col">回收时间</span>
                <span class="col">品类</span>
                <span class="col" style="text-align: right;">重量 (公斤)</span>
              </div>
              <div class="marquee-view">
                <div class="marquee">
                  <div class="row" v-for="(item, i) in realtimeRecyclelist" :key="i + 'realtimeRecyclelist'">
                    <span class="col">{{ item.supplier }}</span>
                    <span class="col">{{ item.recycleMethod }}</span>
                    <span class="col">{{ item.recycleTime }}</span>
                    <span class="col">{{ item.categoryName }}</span>
                    <span class="col" style="text-align: right;">{{ item.weight }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧列 -->
      <div class="column panel-animate">
        <div class="panebody panel">
          <div class="inner">
            <h3>实时监控
              <a style="float:right;font-size:12px;line-height:25px;color:#56d8ec"
                @click="getmoreMonitor">更多&gt;&gt;</a>
            </h3>
            <div class="content">
              <div class="sxtvideo">
                <cameraPlayer :ifselectd="false" :width="420" :height="240" />
              </div>
            </div>
          </div>
        </div>

        <!-- 销售排名 -->
        <div class="panebody panel">
          <div class="inner">
            <h3>销售排名</h3>
            <div class="content">
              <div class="xspm" data-section="saleRank">
                <xspm v-if="saleRankif" :saleRanklist="saleRanklist" />
              </div>
            </div>
          </div>
        </div>

        <!-- 库内成品 -->
        <div class="panebody panel">
          <div class="inner">
            <h3>库内成品</h3>
            <div class="content">
              <div class="kncp" data-section="inventory">
                <kncp v-if="inventoryif" :inventorylist="inventorylist" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" title="实时监控" width="910px" @confirm="dialogVisible = false"
      style="background:#072655">
      <dialogcamera v-if="dialogVisible" :ifselectd="true" :width="880" :height="600" />
    </el-dialog>
  </div>
</template>
<script setup name="recyclable">
import { parseTime } from '../../utils/ruoyi'
import salesline from './recyclableecharts/salesline'
import hstype from './recyclableecharts/hstype'
import gyspm from './recyclableecharts/gyspm'
import xspm from './recyclableecharts/xspm'
import kncp from './recyclableecharts/kncp'
import lyamap from './recyclableecharts/lyamap'
import cameraPlayer from '../camera/index'
import dialogcamera from '../dialogcamera/index'
import { listconfigt, listoverviewStat, listrecycleTrend, listrecycleBrand, listsupplierOverview, listsupplierRank, listrealtimeRecycle, listsaleRank, listinventory } from "@/api/recyclable/recyclable"
const { proxy } = getCurrentInstance()
const dialogVisible = ref(false)
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
    sortingCenterName: ""
  },
  mapif: false
})

const { timeStr, currentdate, currentweek, overviewStatlist, configlist, sortquery, mapif } = toRefs(data)
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
    console.log(response, "配置文件")
    if (response.code == 200) {
      configlist.value = response.rows
      sortquery.value = JSON.parse(JSON.stringify(response.rows[0]))
      mapif.value = true
      // 总揽统计
      getoverviewStat()
      // 回收趋势
      getrecycleTrend()
      // 回收品类
      getrecycleBrand()
      // 供应排行 供应商总览
      getsupplierRank()
      // 实时回收
      getrealtimeRecycle()
      // 销售排名
      getsaleRank()
      // 库内成品
      getinventory()
    }

  })
}
getconfiglist()
// 分拣中心选择
function sortChange(val) {
  mapif.value = false
  console.log(val, "分拣中心选择")
  var newconfiglist = JSON.parse(JSON.stringify(configlist.value))
  const selectedDepartment = newconfiglist.find(item => item.id === val)
  if (selectedDepartment) {
    sortquery.value = selectedDepartment
  }
  console.log(configlist.value, "分拣中心选择")
  setTimeout(() => {
    mapif.value = true
  }, 200);

  // proxy.$refs.lyamaprefs.initMap()
  // 总揽统计
  getoverviewStat()
  // 回收趋势
  getrecycleTrend()
  // 回收品类
  getrecycleBrand()
  // 供应排行 供应商总览
  getsupplierRank()
  // 实时回收
  getrealtimeRecycle()
  // 销售排名
  getsaleRank()
  // 库内成品
  getinventory()
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
    console.log(response)
    if (response.code == 200) {
      overviewStatlist.value = response.data
    }

  })
}

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
    console.log(response, '回收趋势')
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
    console.log(response, '回收品类')
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
// 供应排行 供应商总览
const supplierRanklist = ref([])
const supplierRankif = ref(false)
const todaySupplier = ref()
const supplierTotal = ref()
function getsupplierRank() {
  var queryParams = {
    pageNum: 1,
    pageSize: 10,
    sortingCenterId: sortquery.value.sortingCenterId,
    sortingCenterCode: sortquery.value.sortingCenterCode,
    isRealScreen: sortquery.value.isRealScreen,
  }
  listsupplierOverview(queryParams).then(response => {
    console.log(response, '供应商总览')
    if (response.code == 200) {
      todaySupplier.value = response.data[0].todaySupplier
      supplierTotal.value = response.data[0].supplierTotal
    }
  })
  supplierRankif.value = false
  listsupplierRank(queryParams).then(response => {
    console.log(response, '供应排行')
    if (response.code == 200) {
      supplierRanklist.value = response.data
      setTimeout(() => {
        supplierRankif.value = true
      }, 200);
    }

  })
}

// 实时回收
const realtimeRecyclelist = ref([])
const realtimeRecycleif = ref(false)
function getrealtimeRecycle() {
  var queryParams = {
    pageNum: 1,
    pageSize: 5,
    sortingCenterId: sortquery.value.sortingCenterId,
    sortingCenterCode: sortquery.value.sortingCenterCode,
    isRealScreen: sortquery.value.isRealScreen,
  }
  realtimeRecycleif.value = false
  listrealtimeRecycle(queryParams).then(response => {
    console.log(response, '实时回收')
    if (response.code == 200) {
      realtimeRecyclelist.value = response.data
      realtimeRecycleif.value = true
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
    console.log(response, '销售排名')
    if (response.code == 200) {
      saleRanklist.value = response.data
      saleRankif.value = true
    }

  })
}
// 库内成品
const inventorylist = ref([])
const inventoryif = ref(false)
function getinventory() {
  var queryParams = {
    pageNum: 1,
    pageSize: 10,
    sortingCenterId: sortquery.value.sortingCenterId,
    sortingCenterCode: sortquery.value.sortingCenterCode,
    isRealScreen: sortquery.value.isRealScreen,
  }
  inventoryif.value = false
  listinventory(queryParams).then(response => {
    console.log(response, '库内成品')
    if (response.code == 200) {
      inventorylist.value = response.data
      inventoryif.value = true
    }

  })
}
// 更多监控
function getmoreMonitor() {
  dialogVisible.value = true
}
</script>

<style scoped>
@import "../../assets/styles/screen.css";

/* ===== 动画关键帧定义 ===== */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
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

@keyframes numberRoll {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow {

  0%,
  100% {
    box-shadow: 0 0 5px rgba(86, 216, 236, 0.3);
  }

  50% {
    box-shadow: 0 0 20px rgba(86, 216, 236, 0.6);
  }
}

@keyframes marqueeScroll {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-50%);
  }
}

/* ===== 面板动画类 ===== */
.panel-animate {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
}

.panel-animate:nth-child(1) {
  animation-delay: 0.1s;
}

.panel-animate:nth-child(2) {
  animation-delay: 0.2s;
}

.panel-animate:nth-child(3) {
  animation-delay: 0.3s;
}

.panel-animate:nth-child(4) {
  animation-delay: 0.4s;
}

.panel-animate:nth-child(5) {
  animation-delay: 0.5s;
}

.panel-animate:nth-child(6) {
  animation-delay: 0.6s;
}

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

.data-card:nth-child(1) {
  animation-delay: 0.7s;
}

.data-card:nth-child(2) {
  animation-delay: 0.8s;
}

.data-card:nth-child(3) {
  animation-delay: 0.9s;
}

.data-card:nth-child(4) {
  animation-delay: 1.0s;
}

/* ===== 数字滚动效果 ===== */
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

.hstable tbody tr:nth-child(1) {
  animation-delay: 0.1s;
}

.hstable tbody tr:nth-child(2) {
  animation-delay: 0.2s;
}

.hstable tbody tr:nth-child(3) {
  animation-delay: 0.3s;
}

.hstable tbody tr:nth-child(4) {
  animation-delay: 0.4s;
}

.hstable tbody tr:nth-child(5) {
  animation-delay: 0.5s;
}

.hstable tbody tr:nth-child(6) {
  animation-delay: 0.6s;
}

.hstable tbody tr:hover,
.gystable tbody tr:hover {
  background: rgba(86, 216, 236, 0.1);
  transform: translateX(5px);
}

/* ===== 实时回收滚动动画 ===== */
.marquee {
  animation: marqueeScroll 15s linear infinite;
}

.marquee-view {
  overflow: hidden;
  height: 200px;
}

.marquee:hover {
  animation-play-state: paused;
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
  to {
    width: 100%;
  }
}

/* ===== 加载闪烁效果 ===== */
.loading-pulse {
  animation: glow 2s ease-in-out infinite;
}

/* ===== 原有样式保持不变 ===== */
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
