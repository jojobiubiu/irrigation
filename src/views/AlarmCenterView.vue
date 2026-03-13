<script setup>
import { computed, onMounted, ref } from "vue";
import { fetchAlarms } from "../api/dashboard";

const alarms = ref([]);

onMounted(async () => {
  const response = await fetchAlarms();
  alarms.value = response.data;
});

const unackCount = computed(() => alarms.value.filter((item) => item.status === "UNACK").length);
</script>

<template>
  <div class="alarm-page">
    <section class="stats-strip">
      <article class="stat-card panel">
        <p>当前告警</p>
        <strong>{{ alarms.length }}</strong>
        <span>系统自动汇总</span>
      </article>
      <article class="stat-card panel">
        <p>待确认</p>
        <strong>{{ unackCount }}</strong>
        <span>需要人工跟进</span>
      </article>
      <article class="stat-card panel">
        <p>高优先级</p>
        <strong>1</strong>
        <span>建议优先处理</span>
      </article>
      <article class="stat-card panel">
        <p>通知渠道</p>
        <strong>3</strong>
        <span>站内、短信、邮件</span>
      </article>
    </section>

    <section class="card-grid-2">
      <article class="panel management-panel">
        <div class="toolbar">
          <div>
            <h3 class="section-title">告警列表</h3>
            <p class="section-subtitle">聚焦设备故障、通信异常和湿度风险</p>
          </div>
        </div>
        <div class="compact-table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>等级</th>
                <th>类型</th>
                <th>标题</th>
                <th>区域 / 地块</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alarm in alarms" :key="alarm.id">
                <td><span class="badge is-danger">{{ alarm.level }}</span></td>
                <td>{{ alarm.type }}</td>
                <td>{{ alarm.title }}</td>
                <td>{{ alarm.plotName }}</td>
                <td>{{ alarm.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="panel management-panel">
        <div class="toolbar compact-toolbar">
          <div>
            <h3 class="section-title">处置建议</h3>
            <p class="section-subtitle">帮助运维快速判断告警优先级</p>
          </div>
        </div>
        <div class="list-stack">
          <div class="list-item" v-for="alarm in alarms" :key="`plan-${alarm.id}`">
            <div>
              <h4>{{ alarm.title }}</h4>
              <p v-if="alarm.type === 'DEVICE_FAULT'">建议检查设备供电、通信模块与网关连接。</p>
              <p v-else>建议确认土壤湿度阈值，并评估是否执行补水任务。</p>
            </div>
            <span class="badge" :class="{ 'is-danger': alarm.level === 'HIGH', 'is-warning': alarm.level !== 'HIGH' }">{{ alarm.level }}</span>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.alarm-page {
  display: grid;
  gap: 12px;
}
</style>
