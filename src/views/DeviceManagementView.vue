<script setup>
import { computed, onMounted, ref } from "vue";
import { fetchDevices } from "../api/dashboard";

const devices = ref([]);

onMounted(async () => {
  const response = await fetchDevices();
  devices.value = response.data;
});

const extraTemplates = [
  { suffix: "3", name: "B 区阀门 1", type: "电磁阀", plotName: "2 号黄瓜地块", running: true, humidity: 52 },
  { suffix: "4", name: "B 区土壤传感器", type: "土壤湿度传感器", plotName: "2 号黄瓜地块", running: true, humidity: 49 },
  { suffix: "5", name: "温室喷灌阀", type: "喷灌阀", plotName: "育苗温室", running: true, humidity: 61 },
  { suffix: "6", name: "温室环境传感器", type: "环境传感器", plotName: "育苗温室", running: true, humidity: 58 },
  { suffix: "7", name: "备用水泵", type: "水泵", plotName: "A 区主泵房", running: false, humidity: 35 }
];

const deviceCards = computed(() => {
  const base = devices.value.map((device, index) => ({
    ...device,
    humidity: index === 0 ? 43 : index === 1 ? 51 : 47,
    running: device.onlineStatus === "ONLINE",
    channel: `CH-${index + 1}`
  }));

  const extras = extraTemplates.map((item, index) => ({
    id: `extra-${index}`,
    deviceCode: `DEV-00${item.suffix}`,
    name: item.name,
    type: item.type,
    plotName: item.plotName,
    onlineStatus: item.running ? "ONLINE" : "OFFLINE",
    humidity: item.humidity,
    running: item.running,
    channel: `CH-${index + 4}`
  }));

  return [...base, ...extras];
});
</script>

<template>
  <section class="device-page page-fill">
    <div class="device-grid">
      <article v-for="device in deviceCards" :key="device.id" class="device-card panel">
        <div class="card-top">
          <div>
            <h4>{{ device.name }}</h4>
            <p>{{ device.type }}</p>
          </div>
          <span class="badge" :class="{ 'is-success': device.running, 'is-danger': !device.running }">
            <span class="status-dot"></span>
            {{ device.running ? '在线' : '离线' }}
          </span>
        </div>

        <div class="device-status-block">
          <div class="status-line">
            <span>实时湿度</span>
            <strong>{{ device.humidity }}%</strong>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: `${device.humidity}%` }"></div>
          </div>
          <div class="status-meta">
            <span>{{ device.plotName }}</span>
            <span>{{ device.channel }}</span>
          </div>
        </div>

        <div class="switch-row">
          <span>设备开关</span>
          <button class="switch-btn" :class="{ 'is-on': device.running }">
            <span class="switch-dot"></span>
          </button>
        </div>

        <div class="card-actions">
          <button class="action-btn">详情</button>
          <button class="action-btn active">控制</button>
        </div>
      </article>
    </div>

    <div class="bottom-actions">
      <button class="btn btn-secondary">刷新设备状态</button>
      <button class="btn btn-primary">导出设备清单</button>
    </div>
  </section>
</template>

<style scoped>
.device-page {
  display: grid;
  gap: 14px;
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  align-content: start;
}

.device-card {
  padding: 14px;
  background: #fff;
  border-radius: 14px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: flex-start;
}

.card-top h4,
.card-top p {
  margin: 0;
}

.card-top h4 {
  color: var(--text);
  font-size: 13px;
}

.card-top p {
  margin-top: 4px;
  color: var(--muted);
  font-size: 11px;
}

.device-status-block {
  margin-top: 12px;
  padding: 12px;
  border-radius: 12px;
  background: var(--panel-soft);
  border: 1px solid var(--line);
}

.status-line,
.status-meta,
.switch-row,
.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-line span,
.status-meta span,
.switch-row span {
  color: var(--muted);
  font-size: 11px;
}

.status-line strong {
  color: var(--text);
  font-size: 19px;
}

.progress-track {
  height: 7px;
  margin: 12px 0 10px;
  border-radius: 999px;
  background: #dfeadf;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #77d589, #3fa950);
}

.switch-row {
  margin-top: 12px;
}

.switch-btn {
  width: 42px;
  height: 22px;
  padding: 2px;
  border: none;
  border-radius: 999px;
  background: #d9e6d9;
  cursor: pointer;
}

.switch-btn.is-on {
  background: #58c86a;
}

.switch-dot {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition: transform 0.18s ease;
}

.switch-btn.is-on .switch-dot {
  transform: translateX(20px);
}

.card-actions {
  gap: 8px;
  margin-top: 12px;
}

.action-btn {
  flex: 1;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--text);
  border-radius: 10px;
  padding: 8px 0;
  font-size: 11px;
  cursor: pointer;
}

.action-btn.active {
  background: linear-gradient(135deg, var(--primary), var(--primary-deep));
  color: #fff;
  border-color: transparent;
}

.bottom-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-top: 2px;
}

@media (max-width: 1200px) {
  .device-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .device-grid {
    grid-template-columns: 1fr;
  }

  .bottom-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
