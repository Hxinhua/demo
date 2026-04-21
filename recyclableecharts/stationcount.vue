<template>
  <div class="station-count-container">
    <div class="station-number">{{ stationCount }}</div>
    <div class="station-label">回收站数</div>
  </div>
</template>

<script setup>
const props = defineProps({
  stationCount: {
    type: Number,
    default: 3
  }
})
</script>

<style scoped>
.station-count-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.station-number {
  font-size: 72px;
  font-weight: bold;
  color: #56d8ec;
  text-shadow: 0 0 20px rgba(86, 216, 236, 0.6);
  animation: numberRoll 0.8s ease-out forwards;
}

.station-label {
  font-size: 18px;
  color: #4c9bfd;
  margin-top: 10px;
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
</style>
