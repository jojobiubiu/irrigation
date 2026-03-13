<script setup>
import { onMounted, ref } from "vue";
import { fetchPlots } from "../api/dashboard";

const plots = ref([]);

onMounted(async () => {
  const response = await fetchPlots();
  plots.value = response.data;
});
</script>

<template>
  <section class="panel management-panel">
    <div class="toolbar">
      <div>
        <h3 class="section-title">地块管理</h3>
        <p class="section-subtitle">维护地块、区域、作物与湿度阈值</p>
      </div>
      <div class="toolbar-actions">
        <button class="btn btn-secondary">批量导入</button>
        <button class="btn btn-primary">新增地块</button>
      </div>
    </div>

    <div class="compact-table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>地块名称</th>
            <th>区域</th>
            <th>面积</th>
            <th>土壤类型</th>
            <th>作物</th>
            <th>当前湿度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plot in plots" :key="plot.id">
            <td>{{ plot.name }}</td>
            <td>{{ plot.zoneName }}</td>
            <td>{{ plot.area }} 亩</td>
            <td>{{ plot.soilType }}</td>
            <td>{{ plot.cropName }}</td>
            <td>
              <span class="badge" :class="{ 'is-warning': plot.moisture < 40, 'is-success': plot.moisture >= 40 }">{{ plot.moisture }}%</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
