<script setup>
import { computed, onMounted, reactive } from "vue";
import { fetchDashboardOverview } from "../api/dashboard";

const state = reactive({
  overview: {
    cards: [],
    waterUsageTrend: [],
    runningTasks: [],
    latestAlarms: []
  }
});

onMounted(async () => {
  const response = await fetchDashboardOverview();
  state.overview = response.data;
});

const topCards = computed(() => state.overview.cards.slice(0, 2));
const taskRows = computed(() => state.overview.runningTasks.slice(0, 2));
const alarmRows = computed(() => state.overview.latestAlarms.slice(0, 2));

const plotRows = computed(() => [
  { name: "1 号番茄地块", crop: "番茄", moisture: 34, status: "需补水", duration: "18 分钟" },
  { name: "2 号黄瓜地块", crop: "黄瓜", moisture: 42, status: "正常", duration: "12 分钟" },
  { name: "育苗温室", crop: "生菜", moisture: 58, status: "偏湿", duration: "暂停灌溉" }
]);

const chartMeta = computed(() => {
  const points = state.overview.waterUsageTrend ?? [];
  if (!points.length) {
    return [];
  }

  const width = 360;
  const height = 190;
  const left = 20;
  const right = 14;
  const top = 18;
  const bottom = 28;
  const usableWidth = width - left - right;
  const usableHeight = height - top - bottom;
  const values = points.map((item) => item.value);
  const max = Math.max(...values) + 4;
  const min = Math.max(0, Math.min(...values) - 4);

  return points.map((item, index) => {
    const ratio = (item.value - min) / Math.max(max - min, 1);
    const x = left + (points.length === 1 ? usableWidth / 2 : (usableWidth / (points.length - 1)) * index);
    const y = top + (1 - ratio) * usableHeight;
    return {
      label: item.label,
      value: item.value,
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2))
    };
  });
});

const linePoints = computed(() => chartMeta.value.map((item) => `${item.x},${item.y}`).join(" "));

const areaPoints = computed(() => {
  if (!chartMeta.value.length) {
    return "";
  }

  const baseline = 162;
  const first = chartMeta.value[0];
  const last = chartMeta.value[chartMeta.value.length - 1];
  return `${first.x},${baseline} ${linePoints.value} ${last.x},${baseline}`;
});

const yTicks = computed(() => {
  const points = state.overview.waterUsageTrend ?? [];
  const values = points.map((item) => item.value);
  const max = Math.max(...values, 40);
  const min = 0;
  const total = 4;
  const chartTop = 18;
  const chartHeight = 144;

  return Array.from({ length: total }, (_, index) => {
    const ratio = index / (total - 1);
    const value = Math.round(max - (max - min) * ratio);
    return {
      label: `${value}`,
      y: chartTop + chartHeight * ratio
    };
  });
});

const latestUsage = computed(() => {
  const last = state.overview.waterUsageTrend.at(-1);
  return last ? last.value : 0;
});

const peakUsage = computed(() => {
  const values = state.overview.waterUsageTrend.map((item) => item.value);
  return values.length ? Math.max(...values) : 0;
});
</script>

<template>
  <div class="dashboard-page page-fill">
    <section class="dashboard-grid">
      <article class="dash-card hero-card">
        <div class="card-head">
          <div>
            <h3 class="dash-title">农业控制台</h3>
            <p class="dash-subtitle">灌溉主界面、天气、环境与任务总览</p>
          </div>
          <div class="overview-counts">
            <div class="count-box" v-for="card in topCards" :key="card.title">
              <strong>{{ card.value }}</strong>
              <span>{{ card.title }}</span>
            </div>
          </div>
        </div>

        <div class="hero-screen">
          <div class="hero-screen-top">
            <span class="hero-chip">主灌区监控</span>
            <span class="hero-chip subtle">实时在线</span>
          </div>
          <div class="hero-center"><div class="play-ring"><div class="play-icon"></div></div><p>地块监控区域</p></div>
          <div class="hero-overlay-grid">
            <div>
              <span>土壤湿度</span>
              <strong>34%</strong>
            </div>
            <div>
              <span>主管压力</span>
              <strong>72kPa</strong>
            </div>
          </div>
        </div>

        <div class="hero-footer">
          <div class="hero-tags">
            <span class="small-tag active">实时</span>
            <span class="small-tag">回放</span>
            <span class="small-tag">地图</span>
          </div>
          <button class="btn btn-primary">查看详情</button>
        </div>
      </article>

      <article class="dash-card weather-card">
        <div class="card-head compact-head">
          <div>
            <h3 class="dash-title">天气</h3>
            <p class="dash-subtitle">建议结合夜间窗口灌溉</p>
          </div>
          <select class="mini-select"><option>兰州</option></select>
        </div>

        <div class="weather-main">
          <div>
            <strong>23°C</strong>
            <p>多云</p>
          </div>
          <div class="weather-icon-wrap">☁</div>
        </div>

        <div class="weather-metrics">
          <div class="weather-metric-box"><span>湿度</span><strong>65%</strong></div>
          <div class="weather-metric-box"><span>风速</span><strong>3m/s</strong></div>
          <div class="weather-metric-box"><span>降雨概率</span><strong>15%</strong></div>
          <div class="weather-metric-box"><span>蒸发等级</span><strong>中等</strong></div>
        </div>

        <div class="weather-tip">建议 18:00 - 20:00 进行轻量补水，避免午后蒸发高峰。</div>
      </article>

      <article class="dash-card metric-card">
        <div class="card-head compact-head">
          <div>
            <h3 class="dash-title">环境数据</h3>
            <p class="dash-subtitle">关键设备指标</p>
          </div>
        </div>

        <div class="metric-list">
          <div class="metric-row">
            <div>
              <span>土壤湿度</span>
              <strong>34%</strong>
            </div>
            <div class="metric-bar"><i class="is-danger" style="width: 34%"></i></div>
          </div>
          <div class="metric-row">
            <div>
              <span>空气湿度</span>
              <strong>68%</strong>
            </div>
            <div class="metric-bar"><i class="is-success" style="width: 68%"></i></div>
          </div>
          <div class="metric-row">
            <div>
              <span>水箱液位</span>
              <strong>58%</strong>
            </div>
            <div class="metric-bar"><i class="is-warning" style="width: 58%"></i></div>
          </div>
          <div class="metric-row">
            <div>
              <span>管网压力</span>
              <strong>72kPa</strong>
            </div>
            <div class="metric-bar"><i class="is-success" style="width: 72%"></i></div>
          </div>
        </div>
      </article>

      <article class="dash-card trend-card">
        <div class="card-head compact-head">
          <div>
            <h3 class="dash-title">周用水趋势</h3>
            <p class="dash-subtitle">模拟一周灌溉用水变化，图表按真实监测风格重画</p>
          </div>
          <div class="trend-stats">
            <div>
              <span>本周累计</span>
              <strong>36.5 m³</strong>
            </div>
            <div>
              <span>峰值</span>
              <strong>{{ peakUsage }} m³</strong>
            </div>
          </div>
        </div>

        <div class="trend-content">
          <div class="chart-panel">
            <div class="chart-legend">
              <span><i class="legend-dot"></i>用水量</span>
              <span><i class="legend-bar"></i>参考区间</span>
            </div>

            <div class="chart-surface">
              <svg viewBox="0 0 360 190" preserveAspectRatio="none" class="line-chart-svg">
                <line
                  v-for="tick in yTicks"
                  :key="tick.label"
                  x1="20"
                  :y1="tick.y"
                  x2="346"
                  :y2="tick.y"
                  class="chart-grid-line"
                />
                <text
                  v-for="tick in yTicks"
                  :key="`${tick.label}-text`"
                  x="0"
                  :y="tick.y + 4"
                  class="chart-axis-label"
                >
                  {{ tick.label }}
                </text>
                <polygon :points="areaPoints" class="chart-area"></polygon>
                <polyline :points="linePoints" class="chart-line"></polyline>
                <circle
                  v-for="point in chartMeta"
                  :key="point.label"
                  :cx="point.x"
                  :cy="point.y"
                  r="4.5"
                  class="chart-point"
                ></circle>
              </svg>
              <div class="chart-labels">
                <span v-for="point in chartMeta" :key="point.label">{{ point.label }}</span>
              </div>
            </div>
          </div>

          <div class="plot-panel">
            <div class="sub-head">
              <span>地块概况</span>
              <b>{{ latestUsage }} m³</b>
            </div>
            <div class="plot-list">
              <div v-for="plot in plotRows" :key="plot.name" class="plot-row">
                <div class="plot-meta">
                  <strong>{{ plot.name }}</strong>
                  <p>{{ plot.crop }} · 当前湿度 {{ plot.moisture }}%</p>
                </div>
                <div class="plot-side">
                  <span class="tiny-badge" :class="{ success: plot.status === '正常', danger: plot.status === '需补水', warning: plot.status === '偏湿' }">{{ plot.status }}</span>
                  <em>{{ plot.duration }}</em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <article class="dash-card task-card">
        <div class="card-head compact-head">
          <div>
            <h3 class="dash-title">任务与告警</h3>
            <p class="dash-subtitle">最近运行与异常摘要</p>
          </div>
        </div>

        <div class="summary-list">
          <div class="summary-row" v-for="task in taskRows" :key="task.id">
            <div>
              <strong>{{ task.taskName }}</strong>
              <p>{{ task.plotName }} | {{ task.mode }}</p>
            </div>
            <span class="tiny-badge success">{{ task.status }}</span>
          </div>
          <div class="summary-row" v-for="alarm in alarmRows" :key="alarm.title">
            <div>
              <strong>{{ alarm.title }}</strong>
              <p>{{ alarm.plotName }}</p>
            </div>
            <span class="tiny-badge danger">{{ alarm.level }}</span>
          </div>
          <div class="summary-row suggestion-row">
            <div>
              <strong>预测建议</strong>
              <p>18:30 对 A 区番茄地块补水 18 分钟</p>
            </div>
            <span class="tiny-badge success">执行</span>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.dashboard-page {
  display: flex;
}

.dashboard-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1.4fr 0.95fr 0.92fr;
  grid-template-areas:
    "hero weather metric"
    "trend trend task";
  grid-template-rows: minmax(298px, auto) minmax(320px, 1fr);
  gap: 14px;
}

.dash-card {
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 14px;
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: var(--shadow);
}

.hero-card {
  grid-area: hero;
}

.weather-card {
  grid-area: weather;
}

.metric-card {
  grid-area: metric;
}

.trend-card {
  grid-area: trend;
}

.task-card {
  grid-area: task;
}

.card-head,
.sub-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.compact-head {
  margin-bottom: 12px;
}

.dash-title {
  margin: 0;
  color: var(--text);
  font-size: 21px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.weather-card .dash-title,
.metric-card .dash-title,
.trend-card .dash-title,
.task-card .dash-title {
  font-size: 17px;
}

.dash-subtitle {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.55;
}

.overview-counts {
  display: flex;
  gap: 10px;
}

.count-box {
  min-width: 86px;
  padding: 10px 12px;
  border-radius: 12px;
  background: linear-gradient(180deg, #f8fcf7 0%, #f2f9f1 100%);
  border: 1px solid var(--line);
  text-align: center;
}

.count-box strong,
.count-box span {
  display: block;
}

.count-box strong {
  color: var(--text);
  font-size: 22px;
  line-height: 1;
}

.count-box span {
  margin-top: 6px;
  color: var(--muted);
  font-size: 11px;
}

.hero-screen {
  position: relative;
  flex: 1;
  min-height: 180px;
  margin-top: 2px;
  padding: 12px 12px 92px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(180deg, #d7ead2 0%, #c6e0c3 100%);
  border: 1px solid #bfdcbc;
}

.hero-screen-top,
.hero-overlay-grid {
  position: absolute;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-screen-top {
  top: 12px;
}

.hero-overlay-grid {
  bottom: 12px;
  gap: 10px;
}

.hero-center {
  position: absolute;
  top: 56px;
  right: 24px;
  bottom: 106px;
  left: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
}

.hero-overlay-grid > div {
  flex: 1;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.hero-overlay-grid span {
  display: block;
  color: #6b826d;
  font-size: 11px;
}

.hero-overlay-grid strong {
  display: block;
  margin-top: 5px;
  color: var(--text);
  font-size: 18px;
}

.hero-chip,
.small-tag,
.tiny-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.hero-chip {
  background: rgba(255, 255, 255, 0.6);
  color: #426447;
}

.hero-chip.subtle,
.small-tag {
  background: rgba(255, 255, 255, 0.42);
  color: #5d735e;
  border: 1px solid rgba(255, 255, 255, 0.65);
}

.small-tag.active,
.tiny-badge.success {
  background: rgba(89, 201, 106, 0.15);
  color: var(--success);
}

.tiny-badge.danger {
  background: rgba(223, 106, 90, 0.14);
  color: var(--danger);
}

.tiny-badge.warning {
  background: rgba(217, 164, 61, 0.14);
  color: var(--warning);
}

.play-ring {
  width: 66px;
  height: 66px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.38);
}

.play-icon {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 16px solid var(--primary-deep);
  margin-left: 4px;
}

.hero-center p {
  width: 100%;
  margin: 0;
  color: #3f6145;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-align: center;
}

.hero-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

.hero-tags {
  display: flex;
  gap: 8px;
}

.mini-select {
  width: 110px;
  background: #f9fdf8;
}

.weather-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0 12px;
}

.weather-main strong {
  display: block;
  color: var(--text);
  font-size: 50px;
  line-height: 1;
}

.weather-main p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 16px;
}

.weather-icon-wrap {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: var(--panel-soft);
  color: #7aa67f;
  font-size: 26px;
}

.weather-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.weather-metric-box,
.plot-panel,
.chart-panel {
  background: var(--panel-soft);
  border: 1px solid var(--line);
  border-radius: 14px;
}

.weather-metric-box {
  padding: 12px;
}

.weather-metric-box span,
.metric-row span,
.trend-stats span,
.plot-meta p,
.summary-row p,
.chart-legend span,
.weather-tip {
  color: var(--muted);
}

.weather-metric-box span {
  display: block;
  font-size: 12px;
}

.weather-metric-box strong {
  display: block;
  margin-top: 10px;
  color: var(--text);
  font-size: 18px;
}

.weather-tip {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f8fcf7;
  border: 1px dashed #c8ddc5;
  font-size: 12px;
  line-height: 1.6;
}

.metric-list,
.summary-list,
.plot-list {
  display: grid;
  gap: 10px;
}

.metric-list {
  margin-top: 6px;
}

.metric-row {
  padding: 12px;
  background: var(--panel-soft);
  border: 1px solid var(--line);
  border-radius: 14px;
}

.metric-row > div:first-child {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.metric-row strong {
  color: var(--text);
  font-size: 20px;
}

.metric-bar {
  height: 8px;
  margin-top: 12px;
  border-radius: 999px;
  background: #dfeadf;
  overflow: hidden;
}

.metric-bar i {
  display: block;
  height: 100%;
  border-radius: 999px;
}

.metric-bar .is-success {
  background: linear-gradient(90deg, #7ad68a, #49b35d);
}

.metric-bar .is-warning {
  background: linear-gradient(90deg, #f0cc72, #d9a43d);
}

.metric-bar .is-danger {
  background: linear-gradient(90deg, #f08c7f, #df6a5a);
}

.trend-stats {
  display: flex;
  gap: 18px;
}

.trend-stats strong {
  display: block;
  margin-top: 6px;
  color: var(--text);
  font-size: 19px;
}

.trend-content {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1.45fr 0.95fr;
  gap: 12px;
}

.chart-panel,
.plot-panel {
  padding: 14px;
}

.chart-legend {
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 12px;
  margin-bottom: 12px;
}

.legend-dot,
.legend-bar {
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #57c769;
}

.legend-bar {
  width: 18px;
  height: 6px;
  border-radius: 999px;
  background: rgba(87, 199, 105, 0.18);
}

.chart-surface {
  min-height: 240px;
  padding: 10px 10px 0;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbf6 100%);
  border: 1px solid #e5f0e2;
}

.line-chart-svg {
  width: 100%;
  height: 190px;
}

.chart-grid-line {
  stroke: #d8e7d5;
  stroke-dasharray: 4 4;
  stroke-width: 1;
}

.chart-axis-label {
  font-size: 10px;
  fill: #8a9a8b;
}

.chart-area {
  fill: rgba(89, 201, 106, 0.16);
}

.chart-line {
  fill: none;
  stroke: #59c96a;
  stroke-width: 3;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.chart-point {
  fill: #ffffff;
  stroke: #59c96a;
  stroke-width: 3;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 0 14px 12px 22px;
  color: var(--muted);
  font-size: 11px;
}

.sub-head {
  margin-bottom: 12px;
}

.sub-head span {
  color: var(--muted);
  font-size: 12px;
}

.sub-head b {
  color: var(--text);
  font-size: 18px;
}

.plot-row,
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e1ede0;
  border-radius: 12px;
}

.plot-meta strong,
.summary-row strong {
  color: var(--text);
  font-size: 13px;
}

.plot-meta p,
.summary-row p {
  margin: 5px 0 0;
  font-size: 11px;
}

.plot-side {
  display: grid;
  justify-items: end;
  gap: 6px;
}

.plot-side em {
  color: #607360;
  font-size: 11px;
  font-style: normal;
}

.summary-row.suggestion-row {
  background: linear-gradient(180deg, #f8fcf7 0%, #f3faf2 100%);
}

@media (max-width: 1280px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "hero weather"
      "metric task"
      "trend trend";
    grid-template-rows: auto auto minmax(340px, 1fr);
  }
}

@media (max-width: 960px) {
  .dashboard-grid,
  .trend-content,
  .weather-metrics {
    grid-template-columns: 1fr;
    grid-template-areas: none;
  }

  .hero-card,
  .weather-card,
  .metric-card,
  .trend-card,
  .task-card {
    grid-area: auto;
  }

  .card-head,
  .sub-head,
  .hero-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .overview-counts,
  .trend-stats {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>




