<script setup>
import { computed, onMounted, ref } from "vue";
import { fetchRealtimeReadings } from "../api/dashboard";

const readings = ref([]);

onMounted(async () => {
  const response = await fetchRealtimeReadings();
  readings.value = response.data;
});

const grouped = computed(() => readings.value.reduce((result, item) => {
  if (!result[item.plotName]) {
    result[item.plotName] = [];
  }
  result[item.plotName].push(item);
  return result;
}, {}));

const moistureTrend = [42, 39, 37, 35, 38, 41];
const linePoints = computed(() => {
  const width = 320;
  const height = 120;
  const max = Math.max(...moistureTrend);
  const min = Math.min(...moistureTrend);
  const stepX = width / (moistureTrend.length - 1);

  return moistureTrend.map((value, index) => {
    const x = index * stepX;
    const ratio = (value - min) / Math.max(max - min, 1);
    const y = height - ratio * 88 - 14;
    return `${x},${y}`;
  }).join(" ");
});

const barRows = [
  { label: "土壤湿度", value: 34 },
  { label: "空气湿度", value: 68 },
  { label: "土壤温度", value: 21 },
  { label: "水箱液位", value: 58 }
];
</script>

<template>
  <div class="monitor-page page-fill">
    <section class="stats-strip">
      <article class="stat-card panel">
        <p>采集设备</p>
        <strong>8</strong>
        <span>全部接入正常</span>
      </article>
      <article class="stat-card panel">
        <p>监测地块</p>
        <strong>{{ Object.keys(grouped).length }}</strong>
        <span>按区域自动聚合</span>
      </article>
      <article class="stat-card panel">
        <p>异常指标</p>
        <strong>2</strong>
        <span>需重点关注湿度</span>
      </article>
      <article class="stat-card panel">
        <p>刷新频率</p>
        <strong>5 min</strong>
        <span>支持实时轮询</span>
      </article>
    </section>

    <section class="monitor-grid">
      <article class="panel management-panel chart-panel">
        <div class="toolbar compact-toolbar">
          <div>
            <h3 class="section-title">土壤湿度折线图</h3>
            <p class="section-subtitle">番茄地块近 6 个时段走势</p>
          </div>
        </div>
        <div class="line-chart-wrap">
          <svg viewBox="0 0 320 120" preserveAspectRatio="none" class="line-chart-svg">
            <line x1="0" y1="106" x2="320" y2="106" class="chart-axis" />
            <polyline :points="linePoints" class="chart-line" />
            <polyline :points="`${linePoints} 320,120 0,120`" class="chart-area" />
          </svg>
          <div class="chart-labels">
            <span>06:00</span>
            <span>08:00</span>
            <span>10:00</span>
            <span>12:00</span>
            <span>14:00</span>
            <span>16:00</span>
          </div>
        </div>
      </article>

      <article class="panel management-panel chart-panel">
        <div class="toolbar compact-toolbar">
          <div>
            <h3 class="section-title">指标柱状图</h3>
            <p class="section-subtitle">关键环境参数对比</p>
          </div>
        </div>
        <div class="bar-chart-grid">
          <div v-for="item in barRows" :key="item.label" class="bar-item">
            <div class="bar-track">
              <div class="bar-fill" :style="{ height: `${item.value}px` }"></div>
            </div>
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </article>

      <article class="panel management-panel overview-panel">
        <div class="toolbar compact-toolbar">
          <div>
            <h3 class="section-title">监测卡片</h3>
            <p class="section-subtitle">按地块聚合当前传感器信息</p>
          </div>
        </div>
        <div class="monitor-cards">
          <article v-for="(items, plotName) in grouped" :key="plotName" class="group-card">
            <div class="group-head">
              <strong>{{ plotName }}</strong>
              <span class="badge is-success">在线</span>
            </div>
            <div class="reading-grid">
              <div v-for="reading in items" :key="reading.id" class="reading-card">
                <span>{{ reading.metricName }}</span>
                <strong>{{ reading.metricValue }} {{ reading.unit }}</strong>
              </div>
            </div>
          </article>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.monitor-page {
  display: grid;
  gap: 12px;
}

.monitor-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.overview-panel {
  grid-column: span 2;
}

.chart-panel {
  min-height: 260px;
}

.line-chart-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 190px;
}

.line-chart-svg {
  width: 100%;
  height: 140px;
}

.chart-axis {
  stroke: #cfe0cf;
  stroke-width: 1;
}

.chart-line {
  fill: none;
  stroke: #56c766;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-area {
  fill: rgba(89, 201, 106, 0.12);
  stroke: none;
}

.chart-labels {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  text-align: center;
  color: var(--muted);
  font-size: 10px;
}

.bar-chart-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  align-items: end;
  min-height: 190px;
}

.bar-item {
  display: grid;
  justify-items: center;
  gap: 8px;
}

.bar-track {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: end;
  padding: 8px;
  border-radius: 10px;
  background: var(--panel-soft);
  border: 1px solid var(--line);
}

.bar-fill {
  width: 100%;
  border-radius: 8px 8px 4px 4px;
  background: linear-gradient(180deg, #7ad68a, #49b159);
}

.bar-item strong,
.bar-item span {
  color: var(--text);
  font-size: 11px;
}

.bar-item span {
  color: var(--muted);
}

.monitor-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.group-card {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--panel-soft);
}

.group-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.reading-grid {
  display: grid;
  gap: 8px;
}

.reading-card {
  padding: 10px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid var(--line);
}

.reading-card span,
.reading-card strong {
  display: block;
}

.reading-card span {
  color: var(--muted);
  font-size: 10px;
}

.reading-card strong {
  margin-top: 6px;
  font-size: 14px;
}

@media (max-width: 960px) {
  .monitor-grid,
  .monitor-cards,
  .bar-chart-grid,
  .chart-labels {
    grid-template-columns: 1fr;
  }

  .overview-panel {
    grid-column: auto;
  }
}
</style>
