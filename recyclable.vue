<template>
  <div class="viewport">

    <div class="map-container" v-if="mapif">
      <lyamap :sortquery="sortquery" :stationList="configlist" ref="lyamaprefs" />
      <div class="map-ring-bg">
        <div class="rotating-ring"></div>
      </div>
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
        <el-select v-model="sortquery.sortingCenterName" placeholder="请选择分拣中心" clearable filterable
          @change="sortChange">
          <el-option v-for="item in configlist" :key="item.id" :label="item.sortingCenterName"
            :value="item.sortingCenterName"></el-option>
        </el-select>
      </div>
    </div>

    <div class="dashboard-wrapper">

      <div class="panel-left">
        <div class="panebody panel panel-animate">
          <div class="inner">
            <h3>数据汇总</h3>
            <div class="content">
              <sjhz-v2 :dataList="overviewStatlist" />
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
            <div class="content recycle-category-content">
              <!-- 统一标题栏 -->
              <div class="category-header">
                <div class="header-cell rank-cell">排名</div>
                <div class="header-cell name-cell">品类</div>
                <div class="header-cell today-cell">今日回收</div>
                <div class="header-cell month-cell">近30日回收</div>
              </div>
              <!-- 数据列表 - 无缝循环滚动 -->
              <div class="category-list" ref="categoryListRef" v-if="recycleBrandlist && recycleBrandlist.length > 0"
                @mouseenter="pauseAutoScroll" @mouseleave="startAutoScroll" @scroll="handleManualScroll">
                <!-- 第一组数据 -->
                <div class="scroll-content" ref="scrollContentRef">
                  <div class="category-item" v-for="(item, i) in recycleBrandlist" :key="i + 'recycleBrandlist'"
                    :class="'rank-' + item.rankNo">
                    <div class="item-cell rank-cell">
                      <span class="rank-badge" :class="'rank-' + item.rankNo">{{ item.rankNo }}</span>
                    </div>
                    <div class="item-cell name-cell">
                      <span class="category-name">{{ item.categoryName }}</span>
                    </div>
                    <div class="item-cell today-cell">
                      <span class="data-value">{{ formatNumber(item.recycleToday) }}</span>
                      <span class="data-unit">kg</span>
                    </div>
                    <div class="item-cell month-cell">
                      <span class="data-value">{{ formatNumber(item.last30DaysRecycling) }}</span>
                      <span class="data-unit">kg</span>
                    </div>
                  </div>
                </div>
                <!-- 第二组数据（用于无缝循环） -->
                <div class="scroll-content scroll-content-clone" v-if="recycleBrandlist.length > 5"
                  :class="{ 'is-hidden': isManuallyScrolling }">
                  <div class="category-item" v-for="(item, i) in recycleBrandlist" :key="i + 'recycleBrandlist-clone'"
                    :class="'rank-' + item.rankNo">
                    <div class="item-cell rank-cell">
                      <span class="rank-badge" :class="'rank-' + item.rankNo">{{ item.rankNo }}</span>
                    </div>
                    <div class="item-cell name-cell">
                      <span class="category-name">{{ item.categoryName }}</span>
                    </div>
                    <div class="item-cell today-cell">
                      <span class="data-value">{{ formatNumber(item.recycleToday) }}</span>
                      <span class="data-unit">kg</span>
                    </div>
                    <div class="item-cell month-cell">
                      <span class="data-value">{{ formatNumber(item.last30DaysRecycling) }}</span>
                      <span class="data-unit">kg</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="category-empty" v-else>
                <span>暂无数据</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-center">
        <div class="center-spacer"></div>
        <!-- 分拣中心介绍 -->
        <div class="panebody panel panel-animate center-intro-panel">
          <div class="inner">
            <h3>分拣中心介绍</h3>
            <div class="content intro-content">
              <p class="intro-text">
                本分拣中心是区域内规模领先的再生资源综合处理基地，配备先进的智能分选设备和数字化管理系统。中心日处理各类再生资源可达百吨级，涵盖纸类、塑料、金属、玻璃、织物、电子废弃物等多品类回收物。通过标准化作业流程与环保处理技术，实现资源的高效分类、清洁加工与循环利用，年减少碳排放数千吨，助力绿色低碳发展。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-right">
        <div class="panebody panel panel-animate">
          <div class="inner">
            <h3>实时监控
              <a class="more-link" @click="getmoreMonitor">更多&gt;&gt;</a>
            </h3>
            <div class="content camera-content">
              <cameraPlayer :ifselectd="false" :width="'100%'" :height="'100%'" />
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

  <!-- 实时监控弹窗 -->
  <el-dialog v-model="dialogVisible" title="实时监控" width="910px" :append-to-body="true" style="background:#072655"
    :close-on-click-modal="false">
    <dialogcamera v-if="dialogVisible" :ifselectd="true" :width="880" :height="600" />
  </el-dialog>
</template>

<script setup name="recyclable">
import { reactive, toRefs, onMounted, onUnmounted, ref, nextTick } from 'vue'
import { parseTime } from '@/utils/ruoyi'

import lyamap from './recyclableecharts/lyamap'
import salesline from './recyclableecharts/salesline'
import hstype from './recyclableecharts/hstype'
import xspm from './recyclableecharts/xspm'
import gxgk from './recyclableecharts/gxgk'
import hbfx from './recyclableecharts/hbfx'
import llzl from './recyclableecharts/llzl'
import plzb from './recyclableecharts/plzb'
import sjhzV2 from './recyclableecharts/sjhz-v2'
import cameraPlayer from '../camera/index'
import dialogcamera from '../dialogcamera/index'

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
const dialogVisible = ref(false)
const recycleTrendlist = ref([]), recycleTrendif = ref(false)
const recycleBrandlist = ref([]), recycleBrandif = ref(false)
const saleRanklist = ref([]), saleRankif = ref(false)

// 回收品类列表自动滚动相关
const categoryListRef = ref(null)
const scrollContentRef = ref(null)
let autoScrollTimer = null
let isPaused = false
let isManuallyScrolling = false
let manualScrollTimer = null

// 启动自动滚动
function startAutoScroll() {
  isPaused = false
  isManuallyScrolling = false
  if (autoScrollTimer) return
  autoScrollTimer = setInterval(() => {
    if (!categoryListRef.value || isPaused) return

    const container = categoryListRef.value
    const scrollContent = scrollContentRef.value
    if (!scrollContent) return

    const contentHeight = scrollContent.offsetHeight
    const clientHeight = container.clientHeight

    // 如果内容没有溢出，不需要滚动
    if (contentHeight <= clientHeight) return

    // 每次滚动0.5像素，实现平滑滚动
    container.scrollTop += 0.5

    // 当滚动超过第一组数据高度时，无缝重置到顶部
    if (container.scrollTop >= contentHeight) {
      container.scrollTop = 0
    }
  }, 30) // 每30毫秒滚动一次
}

// 暂停自动滚动
function pauseAutoScroll() {
  isPaused = true
}

// 处理手动滚动事件
function handleManualScroll() {
  // 如果正在自动滚动，不处理
  if (!isPaused) return

  // 标记为手动滚动状态
  isManuallyScrolling = true

  // 清除之前的定时器
  if (manualScrollTimer) {
    clearTimeout(manualScrollTimer)
  }

  // 如果用户滚动到了克隆区域，将滚动位置重置到第一组数据的对应位置
  if (categoryListRef.value && scrollContentRef.value) {
    const contentHeight = scrollContentRef.value.offsetHeight
    const currentScrollTop = categoryListRef.value.scrollTop

    // 如果滚动位置超过了第一组数据的高度，重置到第一组数据的对应位置
    if (currentScrollTop >= contentHeight) {
      categoryListRef.value.scrollTop = currentScrollTop - contentHeight
    }
  }

  // 用户停止滚动2秒后，恢复显示克隆数据
  manualScrollTimer = setTimeout(() => {
    isManuallyScrolling = false
  }, 2000)
}

// 停止自动滚动
function stopAutoScroll() {
  if (autoScrollTimer) {
    clearInterval(autoScrollTimer)
    autoScrollTimer = null
  }
}

// 获取底座颜色配置：绿、青、黄、绿
function getThemeColor(index) {
  const colors = ['#00d284', '#00e5ff', '#fdda24', '#00d284'];
  return colors[index % colors.length];
}

// 格式化数字，添加千分位
function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
        if (typeof parseTime === 'function') element.statTime = parseTime(element.statTime, '{y}-{m}')
      }
      recycleTrendif.value = true
    }
  })
}

function getrecycleBrand() {
  var queryParams = { pageNum: 1, pageSize: 6, sortingCenterId: data.sortquery.sortingCenterId, sortingCenterCode: data.sortquery.sortingCenterCode, isRealScreen: data.sortquery.isRealScreen }
  recycleBrandif.value = false
  // 停止之前的自动滚动
  stopAutoScroll()
  listrecycleBrand(queryParams).then(response => {
    if (response.code == 200) {
      recycleBrandlist.value = response.data
      setTimeout(() => {
        recycleBrandif.value = true
        // 数据加载完成后启动自动滚动
        nextTick(() => {
          setTimeout(() => startAutoScroll(), 500)
        })
      }, 200);
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
  // 延迟启动自动滚动，等待DOM渲染完成
  setTimeout(() => {
    startAutoScroll()
  }, 1000)
});

// 更多监控弹窗
function getmoreMonitor() {
  dialogVisible.value = true
}

onUnmounted(() => {
  stopAutoScroll()
})
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

/* .gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent 40%, rgba(3, 15, 38, 0.7) 90%);
  pointer-events: none;
  z-index: 2;
} */

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

.sortconfig {
  position: absolute;
  left: 3%;
  top: 1.5rem;
}

.time-info {
  position: absolute;
  right: 5%;
  top: 1rem;
  display: flex;
  gap: 15px;
  align-items: baseline;
}

.clock {
  font-size: 18px;
  font-weight: bold;
  color: #00ffcc;
  line-height: 35px;
}

.date {
  font-size: 13px;
  color: #fff;
  line-height: 35px;
}

:deep(.el-select) {
  width: 220px;
}

:deep(.el-select .el-select__wrapper) {
  background-color: rgba(7, 38, 85, 0.7) !important;
  box-shadow: 0 0 0 1px rgba(86, 216, 236, 0.5) inset !important;
  color: #56d8ec !important;
  font-size: 13px;
}

:deep(.el-select .el-select__selected-item) {
  color: #56d8ec !important;
}

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

.panel-left,
.panel-right {
  pointer-events: auto;
}

/* ================= 左右两侧高度严格等分 ================= */
.panel-left,
.panel-right {
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-left .panel,
.panel-right .panel {
  flex: 1;
  min-height: 0;
  overflow: visible;
}

/* 回收品类面板特殊处理，确保有高度用于滚动 */
.panel-left .panel:nth-child(3) {
  min-height: 180px;
}

/* 确保回收品类内部滚动容器正常工作 */
.panel-left .panel:nth-child(3) .inner {
  height: 100%;
  min-height: 150px;
}

.panel-left .panel:nth-child(3) .content {
  overflow: hidden !important;
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

/* 分拣中心介绍面板 */
.center-intro-panel {
  height: auto;
  min-height: 120px;
  max-height: 180px;
  margin-top: 20px;
  margin-bottom: 10px;
  pointer-events: auto;
}

.intro-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
}

.intro-text {
  color: #a8d5e5;
  font-size: 13px;
  line-height: 1.8;
  text-align: justify;
  text-indent: 2em;
  margin: 0;
}

/* 面板通用基础样式 */
.panel {
  background: rgba(16, 42, 88, 0.6);
  border: 1px solid rgba(0, 200, 255, 0.25);
  box-shadow:
    0 0 20px rgba(0, 150, 255, 0.1) inset,
    0 4px 15px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  backdrop-filter: blur(5px);
}

.panel .inner {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel .inner h3 {
  flex: none;
  color: #fff;
  font-size: 14px;
  margin: 0 0 8px 0;
  position: relative;
  padding-bottom: 5px;
  letter-spacing: 1px;
}

.panel .inner h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #56d8ec, transparent);
  animation: lineGrow 1s ease-out forwards;
}

.panel .inner .content {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

/* 更多链接样式 */
.more-link {
  float: right;
  font-size: 12px;
  line-height: 25px;
  color: #56d8ec;
  cursor: pointer;
  transition: all 0.3s ease;
}

.more-link:hover {
  color: #00ffcc;
  text-shadow: 0 0 8px rgba(86, 216, 236, 0.6);
}

/* 监控视频容器 */
.sxtvideo {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* 强制 EZUIKit 播放器占满容器 */
.sxtvideo :deep(#ezuikit-player) {
  width: 100% !important;
  height: 100% !important;
}

.sxtvideo :deep(#ezuikit-player iframe) {
  width: 100% !important;
  height: 100% !important;
}

/* 缩小播放器控制台 - 整体缩放 */
.sxtvideo :deep(#ezuikit-player) {
  transform: scale(0.85);
  transform-origin: center center;
}

/* 回收品类内容区域允许滚动 */
.panel .inner .content.recycle-category-content {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 图表辅助 */
.chart,
.salesline,
.xspm {
  width: 100%;
  height: 100%;
}

/* ================= 回收品类区域新样式 ================= */
.recycle-category-content {
  display: flex;
  flex-direction: column;
  padding: 0 4px;
  height: 100%;
  overflow: hidden;
}

/* 标题栏 */
.category-header {
  display: flex;
  align-items: center;
  padding: 8px 4px;
  margin-bottom: 6px;
  background: linear-gradient(90deg, rgba(86, 216, 236, 0.15), rgba(86, 216, 236, 0.05));
  border-radius: 4px;
  border-left: 3px solid #56d8ec;
}

.header-cell {
  font-size: 11px;
  font-weight: 600;
  color: #56d8ec;
  text-align: center;
}

.header-cell.rank-cell {
  width: 45px;
}

.header-cell.name-cell {
  flex: 1;
  text-align: left;
  padding-left: 8px;
}

.header-cell.today-cell,
.header-cell.month-cell {
  width: 70px;
  text-align: right;
  padding-right: 4px;
}

/* 数据列表 */
.category-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  min-height: 0;
}

/* 滚动内容容器 */
.scroll-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.scroll-content-clone {
  /* 克隆的列表不需要额外样式，跟随布局即可 */
}

.scroll-content-clone.is-hidden {
  display: none;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 6px 4px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  transition: all 0.3s ease;
  animation: slideInLeft 0.5s ease-out forwards;
  opacity: 0;
}

.category-item:nth-child(1) {
  animation-delay: 0.1s;
}

.category-item:nth-child(2) {
  animation-delay: 0.15s;
}

.category-item:nth-child(3) {
  animation-delay: 0.2s;
}

.category-item:nth-child(4) {
  animation-delay: 0.25s;
}

.category-item:nth-child(5) {
  animation-delay: 0.3s;
}

.category-item:hover {
  background: rgba(86, 216, 236, 0.1);
  transform: translateX(3px);
}

/* 前三名特殊样式 */
.category-item.rank-1 {
  background: linear-gradient(90deg, rgba(247, 215, 96, 0.15), rgba(247, 215, 96, 0.05));
  border-left: 2px solid #f7d760;
}

.category-item.rank-2 {
  background: linear-gradient(90deg, rgba(219, 222, 232, 0.15), rgba(219, 222, 232, 0.05));
  border-left: 2px solid #dbdee8;
}

.category-item.rank-3 {
  background: linear-gradient(90deg, rgba(239, 149, 74, 0.15), rgba(239, 149, 74, 0.05));
  border-left: 2px solid #ef954a;
}

.item-cell {
  font-size: 11px;
}

.item-cell.rank-cell {
  width: 45px;
  display: flex;
  justify-content: center;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
  background: #1c3257;
  color: #fff;
}

.rank-badge.rank-1 {
  background: #f7d760;
  color: #000;
}

.rank-badge.rank-2 {
  background: #dbdee8;
  color: #000;
}

.rank-badge.rank-3 {
  background: #ef954a;
  color: #fff;
}

.item-cell.name-cell {
  flex: 1;
  padding-left: 8px;
}

.category-name {
  color: #fff;
  font-weight: 500;
}

.item-cell.today-cell,
.item-cell.month-cell {
  width: 70px;
  text-align: right;
  padding-right: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
}

.data-value {
  color: #fff;
  font-weight: 600;
}

.data-unit {
  color: rgba(255, 255, 255, 0.5);
  font-size: 9px;
}

.category-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
}

/* 动画 */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ================= 自定义滚动条样式 ================= */
/* 自动滚动时隐藏滚动条 */
.category-list::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.category-list {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 动画特效 */
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

@keyframes lineGrow {
  to {
    width: 100%;
  }
}

.panel-animate {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
}



/* 监控内容区域 - 宽度填满，高度留出标题空间 */
.camera-content {
  padding: 0 !important;
  width: 100%;
  height: calc(100% - 35px); /* 留出标题高度，35px根据实际标题高度调整 */
  overflow: hidden;
}

.camera-content :deep(.camera-player),
.camera-content :deep(video),
.camera-content :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
}
</style>