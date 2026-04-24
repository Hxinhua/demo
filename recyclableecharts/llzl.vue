<template>
  <div class="content" style="height: 100%; display: flex; flex-direction: column;">
    <gxgk :recycleTrendlist="recycleTrendlist" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import gxgk from './gxgk'

// 传入空数据，让gxgk使用默认数据
const recycleTrendlist = ref([])
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
}
</style>
