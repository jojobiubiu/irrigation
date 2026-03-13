<script setup>
import { computed, onMounted, ref } from "vue";
import { fetchPlots } from "../api/dashboard";

const plots = ref([]);
const model = ref("模糊算法");
const modelOptions = ["模糊算法", "P-V", "RF", "LSTM"];

onMounted(async () => {
  const response = await fetchPlots();
  plots.value = response.data;
});

const predictionRows = computed(() => plots.value.map((plot, index) => {
  const recommendedMinutes = plot.moisture < 40 ? 18 + index * 2 : 8 + index;
  const riskLevel = plot.moisture < 36 ? "高" : plot.moisture < 45 ? "中" : "低";
  const action = plot.moisture < 40 ? "建议灌溉" : "暂缓灌溉";

  return {
    id: plot.id,
    plotName: plot.name,
    moisture: plot.moisture,
    riskLevel,
    recommendedMinutes,
    action,
    recommendedTime: plot.moisture < 40 ? "18:30" : "明日 06:00"
  };
}));
</script>

<template>
  <div class="prediction-page">
    <section class="panel management-panel">
      <div class="toolbar">
        <div>
          <h3 class="section-title">灌溉预测总览</h3>
          <p class="section-subtitle">根据当前湿度阈值给出下一时段灌溉建议</p>
        </div>
        <div class="toolbar-actions model-select-wrap">
          <label class="model-label">预测模型</label>
          <select v-model="model">
            <option v-for="item in modelOptions" :key="item" :value="item">{{ item }}</option>
          </select>
          <button class="btn btn-primary">生成计划</button>
        </div>
      </div>

      <div class="stats-strip prediction-stats">
        <article class="stat-card panel">
          <p>待执行建议</p>
          <strong>2</strong>
          <span>其中 1 个高优先级</span>
        </article>
        <article class="stat-card panel">
          <p>当前模型</p>
          <strong>{{ model }}</strong>
          <span>用于生成推荐时长</span>
        </article>
        <article class="stat-card panel">
          <p>预计节水</p>
          <strong>12%</strong>
          <span>相对固定时长策略</span>
        </article>
        <article class="stat-card panel">
          <p>最佳执行窗口</p>
          <strong>18:30</strong>
          <span>蒸发损耗较低</span>
        </article>
      </div>
    </section>

    <section class="card-grid-2">
      <article class="panel management-panel">
        <div class="toolbar">
          <div>
            <h3 class="section-title">地块预测结果</h3>
            <p class="section-subtitle">推荐时段、灌溉时长与风险等级</p>
          </div>
        </div>
        <div class="compact-table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>地块</th>
                <th>当前湿度</th>
                <th>风险等级</th>
                <th>推荐动作</th>
                <th>建议时间</th>
                <th>时长</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in predictionRows" :key="row.id">
                <td>{{ row.plotName }}</td>
                <td>{{ row.moisture }}%</td>
                <td>
                  <span class="badge" :class="{ 'is-danger': row.riskLevel === '高', 'is-warning': row.riskLevel === '中', 'is-success': row.riskLevel === '低' }">{{ row.riskLevel }}</span>
                </td>
                <td>{{ row.action }}</td>
                <td>{{ row.recommendedTime }}</td>
                <td>{{ row.recommendedMinutes }} 分钟</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="panel management-panel">
        <div class="toolbar">
          <div>
            <h3 class="section-title">预测依据</h3>
            <p class="section-subtitle">当前使用 {{ model }} 进行规则推演</p>
          </div>
        </div>
        <div class="list-stack">
          <div class="list-item">
            <div>
              <h4>土壤湿度阈值</h4>
              <p>湿度低于 35% 时优先安排补水</p>
            </div>
            <span class="badge">核心指标</span>
          </div>
          <div class="list-item">
            <div>
              <h4>时段策略</h4>
              <p>优先推荐傍晚执行，减少蒸发损耗</p>
            </div>
            <span class="badge is-success">节水优化</span>
          </div>
          <div class="list-item">
            <div>
              <h4>设备约束</h4>
              <p>同一时段避免多任务抢占同一水泵</p>
            </div>
            <span class="badge is-warning">冲突校验</span>
          </div>
          <div class="list-item">
            <div>
              <h4>人工干预优先</h4>
              <p>若人工任务运行中，自动预测计划延后</p>
            </div>
            <span class="badge">调度规则</span>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.prediction-page {
  display: grid;
  gap: 12px;
}

.prediction-stats {
  margin-top: 12px;
}

.model-select-wrap {
  min-width: 320px;
}

.model-label {
  color: var(--muted);
  font-size: 12px;
}
</style>
