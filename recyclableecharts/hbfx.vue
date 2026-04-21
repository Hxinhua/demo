<template>
  <div class="eco-grid">
    <div class="eco-card">
      <div class="eco-icon carbon-icon">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
      </div>
      <div class="eco-data">
        <div class="eco-value">{{ ecoStats.carbonReduction }}<span class="eco-unit">吨</span></div>
        <div class="eco-label">碳减排量</div>
      </div>
    </div>
    <div class="eco-card">
      <div class="eco-icon tree-icon">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L4 10h3v8h6v-8h3L12 2zm0 2.8l3.5 3.5h-1.5v7h-4v-7H8.5L12 4.8z"/></svg>
      </div>
      <div class="eco-data">
        <div class="eco-value">{{ ecoStats.treesSaved }}<span class="eco-unit">棵</span></div>
        <div class="eco-label">相当于种植树木</div>
      </div>
    </div>
    <div class="eco-card">
      <div class="eco-icon energy-icon">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 10 21 10 21z"/></svg>
      </div>
      <div class="eco-data">
        <div class="eco-value">{{ ecoStats.energySaved }}<span class="eco-unit">kWh</span></div>
        <div class="eco-label">节约能源</div>
      </div>
    </div>
    <div class="eco-card">
      <div class="eco-icon water-icon">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c4.97 0 9-4.03 9-9-4.5 0-9-9-9-9s-9 9-9 9c0 4.97 4.03 9 9 9z"/></svg>
      </div>
      <div class="eco-data">
        <div class="eco-value">{{ ecoStats.waterSaved }}<span class="eco-unit">吨</span></div>
        <div class="eco-label">节约用水</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  ecoStats: {
    type: Object,
    default: () => ({
      carbonReduction: 128.5,
      treesSaved: 3420,
      energySaved: 15680,
      waterSaved: 8920
    })
  }
})
</script>

<style scoped>
.eco-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  height: 100%;
  padding: 8px 0;
}

.eco-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(86, 216, 236, 0.08), rgba(86, 216, 236, 0.02));
  border: 1px solid rgba(86, 216, 236, 0.15);
  border-radius: 6px;
  transition: all 0.3s ease;
  animation: scaleIn 0.5s ease-out forwards;
  opacity: 0;
}

.eco-card:nth-child(1) { animation-delay: 0.1s; }
.eco-card:nth-child(2) { animation-delay: 0.2s; }
.eco-card:nth-child(3) { animation-delay: 0.3s; }
.eco-card:nth-child(4) { animation-delay: 0.4s; }

.eco-card:hover {
  background: linear-gradient(135deg, rgba(86, 216, 236, 0.15), rgba(86, 216, 236, 0.05));
  transform: translateX(5px);
  border-color: rgba(86, 216, 236, 0.3);
}

.eco-icon {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.eco-icon svg {
  width: 20px;
  height: 20px;
}

.eco-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border-radius: 50%;
  border: 2px solid currentColor;
  opacity: 0.4;
  animation: pulse 2s ease-out infinite;
}

.carbon-icon {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.tree-icon {
  background: rgba(132, 204, 22, 0.15);
  color: #84cc16;
}

.energy-icon {
  background: rgba(234, 179, 8, 0.15);
  color: #eab308;
}

.water-icon {
  background: rgba(6, 182, 212, 0.15);
  color: #06b6d4;
}

.eco-data {
  flex: 1;
}

.eco-value {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.eco-unit {
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 4px;
}

.eco-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
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

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.2; }
}
</style>
