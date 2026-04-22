<template>
  <div id="mapcontainer"></div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import staticImg from "@/assets/images/static.png"; // 新增：引入静态图片

const props = defineProps({
  sortquery: {
    type: Object,
    default: () => ({}),
  },
  stationList: {
    type: Array,
    default: () => [],
  },
})

let map = null;
let isMapInitialized = false;
let AMapInstance = null;

// 新增：用于全局保存烟台市边界线段，以便复位视角时使用
let cityPolylines = []; 

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "70cff08f99beff0b00e9d9d48cdeebb3",
  };

  initMap();
});

function initMap() {
  AMapLoader.load({
    key: "0cc4c5e81b680d99eb18e32211c6dc0f",
    version: "2.0",
    plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.DistrictSearch"],
  })
    .then((AMap) => {
      AMapInstance = AMap;
      const defaultCenter = [121.391382, 37.539297];
      
      map = new AMap.Map("mapcontainer", {
        zoom: 9,
        skyColor: 'rgba(24, 34, 48,1)',
        wallColor: 'rgba(111,123,144,0.5)',
        roofColor: 'rgba(164,207,227,.5)',
        mapStyle: 'amap://styles/darkblue',
        showBuildingBlock: true,
        center: defaultCenter
      });

      map.on('complete', function () {
        if (isMapInitialized) return;
        isMapInitialized = true;
        
        // 绘制遮罩和边界
        drawMask(AMap);
      });
    })
    .catch((e) => console.error(e));
}

// 存储所有标记点
let allMarkers = [];

function drawMask(AMap) {
  var district = new AMap.DistrictSearch({
    extensions: 'all',
    subdistrict: 0
  });

  district.search('烟台市', function (status, result) {
    if (status === 'complete' && result.districtList.length > 0) {
      var bounds = result.districtList[0].boundaries;
      if (bounds) {
        // 1. 创建外部遮罩（遮住烟台以外的所有地方）
        var outer = [
          new AMap.LngLat(-360, 90, true),
          new AMap.LngLat(-360, -90, true),
          new AMap.LngLat(360, -90, true),
          new AMap.LngLat(360, 90, true)
        ];
        var pathArray = [outer, ...bounds];

        var polygonMask = new AMap.Polygon({
          path: pathArray,
          strokeColor: 'transparent',
          fillColor: '#0d1a26', // 背景颜色，建议与地图暗色调一致
          fillOpacity: 1,      // 完全不透明，隐藏外部区域
          zIndex: 10
        });
        map.add(polygonMask);

        // 2. 绘制烟台边界线
        var polylines = [];
        for (var i = 0; i < bounds.length; i++) {
          var polyline = new AMap.Polyline({
            path: bounds[i],
            strokeColor: '#99EEFF',
            strokeWeight: 3,
            strokeOpacity: 1,
            zIndex: 11
          });
          polylines.push(polyline);
        }
        map.add(polylines);
        
        // ★ 将边界线数组保存到全局变量，用于后续复位
        cityPolylines = polylines; 

        // 3. 自动缩放到合适范围 (首次加载全景)
        map.setFitView(polylines);
        
        // 4. 添加示例标记点
        addSampleMarkers(AMap);
      }
    }
  });
}

// 添加标记点
function addSampleMarkers(AMap) {
  let markersData = [];
  
  if (props.stationList && props.stationList.length > 0) {
    markersData = props.stationList.map(item => ({
      name: item.sortingCenterName || '未命名站点',
      position: [item.longitude, item.latitude],
      type: 'center',
      id: item.sortingCenterId,
      code: item.sortingCenterCode,
      rawData: item
    }));
  } else {
  }
  
  // 清除之前的标记
  if (allMarkers.length > 0) {
    map.remove(allMarkers);
    allMarkers = [];
  }
  
  // 根据类型设置不同颜色（保留用于 InfoWindow 的颜色区分）
  const colorMap = {
    'station': '#00f2f1',   // 青色 - 回收站
    'center': '#4caf50',    // 绿色 - 分拣中心
    'transfer': '#eab308'   // 黄色 - 中转站
  };
  
  // 创建标记点
  markersData.forEach((item, index) => {
    // 检查坐标是否有效
    if (!item.position || !item.position[0] || !item.position[1]) {
      console.warn('Invalid position for marker:', item.name);
      return;
    }
    
    const color = colorMap[item.type] || '#00f2f1';
    
    const customIcon = new AMap.Icon({
      size: new AMap.Size(28, 28),     // 图标显示尺寸，与原来保持一致
      image: staticImg,                // 使用导入的图片
      imageSize: new AMap.Size(28, 28) // 适配大小拉伸
    });
    
    // 创建标记
    const marker = new AMap.Marker({
      position: item.position,
      icon: customIcon, // 使用自定义图片图标
      offset: new AMap.Pixel(-14, -14),
      extData: item
    });
    
    // 添加信息窗口
    const infoWindow = new AMap.InfoWindow({
      content: `<div style="
        padding: 10px; 
        background: rgba(7, 38, 85, 0.95); 
        border: 1px solid ${color}; 
        border-radius: 6px; 
        color: #fff; 
        font-size: 14px;
        min-width: 120px;
        text-align: center;
      ">
        <div style="font-weight: bold; margin-bottom: 5px; color: ${color};">${item.name}</div>
        <div style="font-size: 12px; color: rgba(255,255,255,0.7);">
          类型: ${item.type === 'center' ? '分拣中心' : item.type === 'transfer' ? '中转站' : '回收站'}
        </div>
        ${item.code ? `<div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px;">编号: ${item.code}</div>` : ''}
      </div>`,
      offset: new AMap.Pixel(0, -35)
    });
    
    // 点击事件
    marker.on('click', function() {
      infoWindow.open(map, marker.getPosition());
    });
    
    allMarkers.push(marker);
  });
  
  // 将标记添加到地图
  map.add(allMarkers);
  
  // 添加动画效果（需要在添加到地图后设置）
  allMarkers.forEach((marker, index) => {
    setTimeout(() => {
      marker.setAnimation('AMAP_ANIMATION_DROP');
    }, index * 100);
  });
}

// 监听数据变化，平滑移动或复位地图
watch(() => props.sortquery, (newVal) => {
  if (!isMapInitialized || !map || !AMapInstance) return;
  
  // 判断是有选择具体的分拣中心，还是清空了选择（清空时 sortingCenterName 为空）
  if (newVal.sortingCenterName) {
    // 1. 选中具体分拣中心，移动过去并放大
    if (newVal.longitude && newVal.latitude) {
      const newLngLat = new AMapInstance.LngLat(newVal.longitude, newVal.latitude);
      map.panTo(newLngLat);
      setTimeout(() => {
        map.setZoom(12);
      }, 100);
    }
  } else {
    // 2. 清空选择 (点击了 X)，自动复位到烟台市全景
    if (cityPolylines && cityPolylines.length > 0) {
      map.setFitView(cityPolylines); 
    }
  }
}, { deep: true });

// 监听站点列表变化，重新渲染标记点
watch(() => props.stationList, (newVal) => {
  if (!isMapInitialized || !map || !AMapInstance) return;
  if (newVal && newVal.length > 0) {
    addSampleMarkers(AMapInstance);
  }
}, { deep: true });

onUnmounted(() => {
  map?.destroy();
});
</script>

<style scoped>
#mapcontainer {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: #0d1a26; /* 容器背景色，防止地图加载前的白屏 */
}

@media screen and (min-width: 1920px) {
  #mapcontainer {
    min-height: 500px;
  }
}

@media screen and (min-width: 2560px) {
  #mapcontainer {
    min-height: 600px;
  }
}
</style>