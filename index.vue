<template>
  <div class="app-container">

  </div>
</template>

<script setup name="Visualization">
const router = useRouter()
const { proxy } = getCurrentInstance()
// 跳转大屏
goto()
function goto() {
  proxy.$tab.closePage()
  let routeUrl = router.resolve({
    path: "/recyclable",
    query: {}
  });
  window.open(routeUrl.href, '_blank');

}



</script>
