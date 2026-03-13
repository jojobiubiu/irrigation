<script setup>
import { onMounted, reactive, ref } from "vue";
import { fetchIrrigationTasks, fetchPlots, fetchDevices, startManualIrrigation } from "../api/dashboard";

const tasks = ref([]);
const plots = ref([]);
const devices = ref([]);
const lastMessage = ref("");
const form = reactive({
  plotId: 1,
  deviceId: 1,
  durationMinutes: 15
});

async function loadData() {
  const [taskResponse, plotResponse, deviceResponse] = await Promise.all([
    fetchIrrigationTasks(),
    fetchPlots(),
    fetchDevices()
  ]);
  tasks.value = taskResponse.data;
  plots.value = plotResponse.data;
  devices.value = deviceResponse.data;
}

async function handleManualStart() {
  const response = await startManualIrrigation(form);
  lastMessage.value = `${response.message}：${response.data.plotName}，${response.data.durationMinutes} 分钟`;
}

onMounted(loadData);
</script>

<template>
  <div class="irrigation-page">
    <section class="card-grid-2">
      <article class="panel management-panel">
        <div class="toolbar">
          <div>
            <h3 class="section-title">人工灌溉</h3>
            <p class="section-subtitle">用于紧急补水、运维测试和人工接管</p>
          </div>
          <span class="badge">手动模式</span>
        </div>

        <div class="management-form-grid">
          <label>
            <span>选择地块</span>
            <select v-model="form.plotId">
              <option v-for="plot in plots" :key="plot.id" :value="plot.id">{{ plot.name }}</option>
            </select>
          </label>
          <label>
            <span>控制设备</span>
            <select v-model="form.deviceId">
              <option v-for="device in devices" :key="device.id" :value="device.id">{{ device.name }}</option>
            </select>
          </label>
          <label>
            <span>灌溉时长</span>
            <input v-model="form.durationMinutes" type="number" min="1" />
          </label>
        </div>

        <div class="action-row">
          <button class="btn btn-primary" @click="handleManualStart">启动人工灌溉</button>
          <span class="section-subtitle">{{ lastMessage || '建议优先在低蒸发时段执行。' }}</span>
        </div>
      </article>

      <article class="panel management-panel">
        <div class="toolbar compact-toolbar">
          <div>
            <h3 class="section-title">策略提示</h3>
            <p class="section-subtitle">帮助操作员快速判断是否适合执行</p>
          </div>
        </div>
        <div class="list-stack">
          <div class="list-item">
            <div>
              <h4>推荐时段</h4>
              <p>18:00 - 20:00 蒸发损耗较低</p>
            </div>
            <span class="badge is-success">优先</span>
          </div>
          <div class="list-item">
            <div>
              <h4>当前水位</h4>
              <p>水箱液位 58%，支持执行计划</p>
            </div>
            <span class="badge">正常</span>
          </div>
          <div class="list-item">
            <div>
              <h4>冲突检测</h4>
              <p>主泵当前仅 1 个任务运行，可继续调度</p>
            </div>
            <span class="badge is-success">通过</span>
          </div>
        </div>
      </article>
    </section>

    <section class="panel management-panel">
      <div class="toolbar">
        <div>
          <h3 class="section-title">灌溉任务列表</h3>
          <p class="section-subtitle">展示自动、定时和人工模式任务状态</p>
        </div>
      </div>
      <div class="compact-table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>任务</th>
              <th>模式</th>
              <th>地块</th>
              <th>状态</th>
              <th>时长</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td>{{ task.taskName }}</td>
              <td>{{ task.mode }}</td>
              <td>{{ task.plotName }}</td>
              <td>
                <span class="badge" :class="{ 'is-success': task.status === 'RUNNING', 'is-warning': task.status !== 'RUNNING' }">{{ task.status }}</span>
              </td>
              <td>{{ task.durationMinutes }} 分钟</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.irrigation-page {
  display: grid;
  gap: 12px;
}

.action-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 12px;
}

@media (max-width: 960px) {
  .action-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
