<template>
  <div class="viewport">
    
    <div class="map-container" v-if="mapif">
      <lyamap :sortquery="sortquery" :stationList="configlist" ref="lyamaprefs" />
    </div>

    <div class="gradient-overlay"></div>

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

    <div class="dashboard-wrapper">
      
      <div class="panel-left">
        <div class="panebody panel panel-animate">
          <div class="inner">
            <h3>回收趋势</h3>
            <div class="content sales" style="display: flex; flex-direction: column;">
              <div class="chart" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
                <div class="label" style="flex: none; padding-bottom: 5px; color: #a4bfe0; font-size: 12px;">单位：公斤</div>
                <div class="salesline" data-section="recycleTrend" style="flex: 1; min-height: 0;">
                  <salesline v-if="recycleTrendif" :recycleTrendlist="recycleTrendlist" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="panebody panel panel-animate" style="animation-delay: 0.1s;">
          <div class="inner">
            <h3>环保贡献</h3>
            <div class="content">
              <hbfx :ecoStats="ecoStats" />
            </div>
          </div>
        </div>

        <div class="panebody panel panel-animate" style="animation-delay: 0.2s;">
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
                <table cellpadding="0" cellspacing="0">
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

      <div class="panel-center">
        <div class="center-spacer"></div>

        <div class="center-bottom panel-animate" style="animation-delay: 0.3s;" v-if="overviewStatlist && overviewStatlist.length > 0">
          <div class="horizontal-stats">
            <div class="stat-box" 
                 v-for="(item, i) in overviewStatlist" 
                 :key="i + 'overviewStatlist'" 
                 :style="{ '--theme-color': getThemeColor(i) }">
                 
              <div class="stat-value" v-if="item != null">
                <i>{{ item.statValue }}</i><span class="unit" v-if="item != null">{{ item.statUnit }}</span>
              </div>
              
              <div class="stat-name" v-if="item != null">{{ item.statName }}</div>
              
              <div class="pedestal-container" v-if="item != null">
                <div class="pedestal-beam"></div> <div class="pedestal-core"></div> <div class="pedestal-ring"></div> </div>
              
            </div>
          </div>
        </div>
      </div>

      <div class="panel-right">
        <div class="panebody panel panel-animate">
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

        <div class="panebody panel panel-animate" style="animation-delay: 0.1s;">
          <div class="inner">
            <h3>来料质量</h3>
            <div class="content">
              <llzl />
            </div>
          </div>
        </div>

        <div class="panebody panel panel-animate" style="animation-delay: 0.2s;">
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
</template>

<script setup name="recyclable">
import { reactive, toRefs, onMounted, ref } from 'vue'
import { parseTime } from '@/utils/ruoyi'

import lyamap from './recyclableecharts/lyamap'
import salesline from './recyclableecharts/salesline'
import hstype from './recyclableecharts/hstype'
import xspm from './recyclableecharts/xspm'
import gxgk from './recyclableecharts/gxgk'
import hbfx from './recyclableecharts/hbfx'
import llzl from './recyclableecharts/llzl'
import plzb from './recyclableecharts/plzb'

import { listconfigt, listoverviewStat, listrecycleTrend, listrecycleBrand, listsaleRank } from "@/api/recyclable/recyclable"

const data = reactive({
  timeStr: "", currentdate: "", currentweek: "", configlist: [],
  sortquery: { sortingCenterName: "", sortingCenterId: "", sortingCenterCode: "", isRealScreen: "", longitude: 121.391382, latitude: 37.539297 },
  mapif: false, overviewStatlist: [],
  ecoStats: { carbonReduction: 128.5, treesSaved: 3420, energySaved: 15680, waterSaved: 8920 },
  plzbData: [
    { name: '纸类', value: 3680 }, { name: '塑料', value: 2960 }, { name: '金属', value: 1280 },
    { name: '玻璃', value: 1120 }, { name: '织物', value: 860 }, { name: '电子', value: 540 }
  ]
})

const { timeStr, currentdate, currentweek, sortquery, mapif, configlist, overviewStatlist, ecoStats, plzbData } = toRefs(data)

const gxgklist = ref([]), gxgkif = ref(true)
const recycleTrendlist = ref([]), recycleTrendif = ref(false)
const recycleBrandlist = ref([]), recycleBrandif = ref(false)
const saleRanklist = ref([]), saleRankif = ref(false)

// 获取底座颜色配置：绿、青、黄、绿
function getThemeColor(index) {
  const colors = ['#00d284', '#00e5ff', '#fdda24', '#00d284'];
  return colors[index % colors.length];
}

function updateTime() {
  const now = new Date();
  data.timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
  data.currentdate = now.toLocaleDateString('zh-CN');
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  data.currentweek = weekdays[now.getDay()];
}

function sortChange(val) {
  if (!val) {
    data.sortquery.sortingCenterName = ""; data.sortquery.sortingCenterId = ""; data.sortquery.sortingCenterCode = "";
    data.sortquery.isRealScreen = ""; data.sortquery.longitude = 121.391382; data.sortquery.latitude = 37.539297;
    return;
  }
  const selected = data.configlist.find(item => item.sortingCenterName === val);
  if (selected) {
    data.sortquery.longitude = selected.longitude; data.sortquery.latitude = selected.latitude;
    data.sortquery.sortingCenterName = selected.sortingCenterName; data.sortquery.sortingCenterId = selected.sortingCenterId;
    data.sortquery.sortingCenterCode = selected.sortingCenterCode; data.sortquery.isRealScreen = selected.isRealScreen;
    getoverviewStat(); getrecycleTrend(); getrecycleBrand(); getsaleRank();
  }
}

function getconfiglist() {
  listconfigt({ pageNum: 1, pageSize: 1000 }).then(response => {
    if (response.code == 200) { data.configlist = response.rows; data.mapif = true; }
  });
}

function getoverviewStat() {
  var queryParams = { pageNum: 1, pageSize: 10, sortingCenterId: data.sortquery.sortingCenterId, sortingCenterCode: data.sortquery.sortingCenterCode, isRealScreen: data.sortquery.isRealScreen }
  listoverviewStat(queryParams).then(response => { if (response.code == 200) data.overviewStatlist = response.data })
}

function getrecycleTrend() {
  var queryParams = { pageNum: 1, pageSize: 10, sortingCenterId: data.sortquery.sortingCenterId, sortingCenterCode: data.sortquery.sortingCenterCode, isRealScreen: data.sortquery.isRealScreen }
  recycleTrendif.value = false
  listrecycleTrend(queryParams).then(response => {
    if (response.code == 200) {
      recycleTrendlist.value = response.data
      for (let i = 0; i < recycleTrendlist.value.length; i++) {
        const element = recycleTrendlist.value[i];
        if(typeof parseTime === 'function') element.statTime = parseTime(element.statTime, '{y}-{m}') 
      }
      recycleTrendif.value = true
    }
  })
}

function getrecycleBrand() {
  var queryParams = { pageNum: 1, pageSize: 6, sortingCenterId: data.sortquery.sortingCenterId, sortingCenterCode: data.sortquery.sortingCenterCode, isRealScreen: data.sortquery.isRealScreen }
  recycleBrandif.value = false
  listrecycleBrand(queryParams).then(response => {
    if (response.code == 200) {
      recycleBrandlist.value = response.data
      setTimeout(() => { recycleBrandif.value = true }, 200);
    }
  })
}

function getsaleRank() {
  var queryParams = { pageNum: 1, pageSize: 10, sortingCenterId: data.sortquery.sortingCenterId, sortingCenterCode: data.sortquery.sortingCenterCode, isRealScreen: data.sortquery.isRealScreen }
  saleRankif.value = false
  listsaleRank(queryParams).then(response => {
    if (response.code == 200) { saleRanklist.value = response.data; saleRankif.value = true; }
  })
}

onMounted(() => {
  getconfiglist(); updateTime(); setInterval(updateTime, 1000);
});
</script>

<style scoped>
@import "../../assets/styles/screenTotal.css";

/* ================= 基础外层 ================= */
.viewport {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #04122c; 
}

/* ================= 全屏地图作为背景 ================= */
.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; 
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent 40%, rgba(3, 15, 38, 0.7) 90%);
  pointer-events: none;
  z-index: 2;
}

/* ================= 顶部标题栏 ================= */
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  z-index: 10;
  background: url(../../assets/images/headerbg.png) no-repeat center -10px;
  background-size: 100% 100%;
  pointer-events: auto;
}

.title {
  width: 100%;
  text-align: center;
  font-size: 20px; 
  font-weight: bold;
  letter-spacing: 2px;
  color: #def2f3;
  text-shadow: 0 0 10px #007bff;
  padding-top: 10px;
}

.sortconfig { position: absolute; left: 3%; top: 1.5rem; }
.time-info { position: absolute; right: 5%; top: 1rem; display: flex; gap: 15px; align-items: baseline; }
.clock { font-size: 18px; font-weight: bold; color: #00ffcc; line-height: 35px; }
.date { font-size: 13px; color: #fff; line-height: 35px; }

:deep(.el-select) { width: 220px; }
:deep(.el-select .el-select__wrapper) {
  background-color: rgba(7, 38, 85, 0.7) !important;
  box-shadow: 0 0 0 1px rgba(86, 216, 236, 0.5) inset !important;
  color: #56d8ec !important;
  font-size: 13px;
}
:deep(.el-select .el-select__selected-item) { color: #56d8ec !important; }

/* ================= 悬浮数据面板层 ================= */
.dashboard-wrapper {
  position: absolute;
  top: 70px; 
  left: 0;
  width: 100%;
  height: calc(100% - 80px);
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  z-index: 5;
  pointer-events: none;
}

.panel-left, .panel-right, .center-bottom {
  pointer-events: auto;
}

/* ================= 左右两侧高度严格等分 ================= */
.panel-left, .panel-right {
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-left .panel, .panel-right .panel {
  flex: 1; 
  height: 0; 
  min-height: 0; 
  overflow: hidden; 
}

/* === 中间区域 === */
.panel-center {
  flex: 1;
  margin: 0 20px;
  display: flex;
  flex-direction: column;
}

.center-spacer {
  flex: 1; 
  pointer-events: none; 
}

/* ================= 中间底部：3D光柱数据区 ================= */
.center-bottom {
  flex: none;
  background: transparent !important; /* 去除原本的框框背景，让底座直接悬浮在地图上 */
  border: none !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  padding: 20px 0;
  margin-bottom: 0;
}

.horizontal-stats {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  width: 100%;
  height: 120px; /* 预留充足高度给光柱 */
}

/* 单个数据块容器 */
.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 120px;
  padding-bottom: 30px;
}

/* 顶部数值 */
.stat-box .stat-value {
  font-family: 'DIN', Arial, sans-serif;
  color: #fff;
  z-index: 3;
  margin-bottom: 4px;
}
.stat-box .stat-value i {
  font-style: normal;
  font-size: 20px;
  font-weight: bold;
}
.stat-box .stat-value .unit {
  font-size: 11px;
  margin-left: 2px;
  color: #ccc;
}

/* 中间标签名 */
.stat-box .stat-name {
  font-size: 12px;
  color: #e0e0e0;
  z-index: 3;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

/* ======= 3D 底座特效核心 ======= */
.pedestal-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1; /* 放在文字底层 */
}

/* 1. 向上渐变发光的光柱 */
.pedestal-beam {
  position: absolute;
  bottom: 15px; /* 从圆盘中心开始往上 */
  width: 70%;
  height: 60px;
  background: linear-gradient(to top, var(--theme-color) 0%, transparent 100%);
  opacity: 0.25;
  /* 让光柱顶部收拢，底部贴合圆盘 */
  border-radius: 50% 50% 0 0 / 20% 20% 0 0;
  pointer-events: none;
}

/* 2. 核心实心发光圆盘 */
.pedestal-core {
  position: absolute;
  bottom: 5px;
  width: 70px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--theme-color);
  box-shadow: 0 0 20px var(--theme-color), 
              inset 0 3px 8px rgba(255, 255, 255, 0.7),
              inset 0 -3px 8px rgba(0, 0, 0, 0.3);
  opacity: 0.9;
  transform: perspective(150px) rotateX(75deg);
}

/* 3. 外围轨道星环 */
.pedestal-ring {
  position: absolute;
  bottom: 0;
  width: 105px;
  height: 35px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 2px solid var(--theme-color);
  border-top: 1px solid var(--theme-color);
  opacity: 0.6;
  transform: perspective(150px) rotateX(75deg);
}
/* 外围轨道上的高光点缀 */
.pedestal-ring::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 4px;
  background: #fff;
  box-shadow: 0 0 10px #fff;
  border-radius: 50%;
}


/* 面板通用基础样式 */
.panel {
  background: rgba(10, 24, 50, 0.7); 
  border: 1px solid rgba(86, 216, 236, 0.3); 
  box-shadow: 0 0 15px rgba(86, 216, 236, 0.1) inset;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  backdrop-filter: blur(5px); 
}

.panel .inner { height: 100%; display: flex; flex-direction: column; }
.panel .inner h3 {
  flex: none; color: #fff; font-size: 14px; margin: 0 0 8px 0;
  position: relative; padding-bottom: 5px; letter-spacing: 1px;
}
.panel .inner h3::after {
  content: ''; position: absolute; left: 0; bottom: 0; width: 0; height: 2px;
  background: linear-gradient(90deg, #56d8ec, transparent);
  animation: lineGrow 1s ease-out forwards;
}
.panel .inner .content { flex: 1; min-height: 0; position: relative; }

/* 图表辅助 */
.chart, .salesline, .xspm, .hstype { width: 100%; height: 100%; }
.contentpannel { writing-mode: vertical-lr; letter-spacing: 5px; color: #a4bfe0; font-size: 12px; display: flex; align-items: center; justify-content: center; }

/* 左侧回收品类表格缩放 */
.hstable { margin-left: 10px; width: 40%; }
.hstable table { width: 100%; text-align: left; color: #fff; font-size: 11px; }
.hstable th { color: #56d8ec; padding-bottom: 6px; font-weight: normal; }
.hstable td { padding: 4px 0; }

/* 动画特效 */
@keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes lineGrow { to { width: 100%; } }
.panel-animate { animation: slideInUp 0.6s ease-out forwards; opacity: 0; }
</style>