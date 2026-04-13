<template>
  <div id="mapcontainer"></div>
</template>
<script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
const props = defineProps({
  sortquery: {
    type: Object,
    default: ",",
  }
})
let map = null;
onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "70cff08f99beff0b00e9d9d48cdeebb3",
  };

});

function initMap() {
  AMapLoader.load({
    key: "0cc4c5e81b680d99eb18e32211c6dc0f",
    version: "2.0",
    plugins: ["AMap.Scale", "AMap.ToolBar"],
  })
    .then((AMap) => {
      map = new AMap.Map("mapcontainer", {
        // viewMode: "3D",
        zoom: 14, // 缩放级别
        skyColor: 'rgba(24, 34, 48,1)',
        // wallColor: '#414a59',
        wallColor: 'rgba(111,123,144,0.5)',
        // roofColor:'#7392a0',
        roofColor: 'rgba(164,207,227,.5)',
        mapStyle: 'amap://styles/darkblue',
        showBuildingBlock: true,
        center: [props.sortquery.longitude || 121.573575, props.sortquery.latitude || 37.376457] // 临平分拣中心的大致坐标（请根据实际需求调整）
      });

      // map.setMapStyle('amap://styles/darkblue');
      var icon = new AMap.Icon({
        // size: new AMap.Size(25, 34),
        image: 'iconwu.png',
        imageSize: new AMap.Size(40, 40)
      });

      // 创建一个标记点
      var marker = new AMap.Marker({
        position: new AMap.LngLat(props.sortquery.longitude || 121.573575, props.sortquery.latitude || 37.376457), // 标记点的位置
        icon: icon,// 可选：自定义图标
        offset: new AMap.Pixel(-12, -20) // 图标偏移量
      });
      marker.setLabel({
        // 设置标签内容
        content: props.sortquery.sortingCenterName,
        // 设置样式
        offset: new AMap.Pixel(0, 0)
      });
      map.add(marker);

      // 地图加载完成后的回调
      map.on('complete', function () {
        console.log('地图初始化完成');
      });
    })
    .catch((e) => console.error(e));
}
initMap()
onUnmounted(() => {
  map?.destroy();
});
</script>
<style scoped>
#mapcontainer {
  width: 100%;
  height: 100%;
}
</style>