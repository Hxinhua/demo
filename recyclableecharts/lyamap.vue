<template>
  <div id="mapcontainer"></div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

const props = defineProps({
  sortquery: {
    type: Object,
    default: () => ({}),
  },
})

let map = null;
let marker = null;
let isMapInitialized = false;

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

      var icon = new AMap.Icon({
        image: 'iconwu.png',
        imageSize: new AMap.Size(40, 40)
      });

      const defaultPosition = new AMap.LngLat(121.391382, 37.539297);
      marker = new AMap.Marker({
        position: defaultPosition,
        icon: icon,
        offset: new AMap.Pixel(-12, -20)
      });

      marker.setLabel({
        content: '烟台市',
        offset: new AMap.Pixel(0, 0)
      });
      
      map.add(marker);

      map.on('complete', function () {
        if (isMapInitialized) return;
        isMapInitialized = true;
        
        console.log('地图底图初始化完成，开始绘制边界遮罩');

        var district = new AMap.DistrictSearch({
          extensions: 'all',
          subdistrict: 0
        });

        district.search('烟台市', function (status, result) {
          if (status === 'complete' && result.districtList.length > 0) {
            var bounds = result.districtList[0].boundaries;
            if (bounds) {
              var outer = [
                new AMap.LngLat(-360, 90, true),
                new AMap.LngLat(-360, -90, true),
                new AMap.LngLat(360, -90, true),
                new AMap.LngLat(360, 90, true)
              ];
              var pathArray = [outer];
              pathArray.push.apply(pathArray, bounds);

              var polygonMask = new AMap.Polygon({
                path: pathArray,
                strokeColor: 'transparent',
                fillColor: '#000000',
                fillOpacity: 0.65
              });
              map.add(polygonMask);

              var polylines = [];
              for (var i = 0; i < bounds.length; i++) {
                var polyline = new AMap.Polyline({
                  path: bounds[i],
                  strokeColor: '#99EEFF',
                  strokeWeight: 3,
                  strokeOpacity: 1
                });
                polylines.push(polyline);
              }
              map.add(polylines);

              map.setFitView([...polylines, marker]);
            }
          }
        });
      });
    })
    .catch((e) => console.error(e));
}
watch(() => props.sortquery, (newVal) => {
  if (!isMapInitialized || !map || !marker) return;
  
  if (newVal.longitude && newVal.latitude && newVal.sortingCenterName) {
    const newLngLat = new AMap.LngLat(newVal.longitude, newVal.latitude);

    marker.setPosition(newLngLat);

    marker.setLabel({
      content: newVal.sortingCenterName,
      offset: new AMap.Pixel(0, 0)
    });

    map.panTo(newLngLat);
    
    setTimeout(() => {
      map.setZoom(12);
    }, 100);
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