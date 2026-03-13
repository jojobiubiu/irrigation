const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

const dashboardCards = [
  { title: "农场总数", value: "3", subtitle: "3 个区域稳定运行" },
  { title: "在线设备", value: "18", subtitle: "在线率 90%" },
  { title: "今日灌溉次数", value: "12", subtitle: "较昨日 +2" },
  { title: "今日用水量", value: "36.5 m³", subtitle: "峰值出现在 09:00" }
];

const plots = [
  { id: 1, name: "1 号番茄地块", zoneName: "A 区", area: 12.5, soilType: "壤土", cropName: "番茄", moisture: 34.8 },
  { id: 2, name: "2 号黄瓜地块", zoneName: "A 区", area: 10.0, soilType: "砂壤土", cropName: "黄瓜", moisture: 42.1 },
  { id: 3, name: "育苗温室", zoneName: "B 区", area: 6.8, soilType: "营养土", cropName: "生菜", moisture: 58.4 }
];

const devices = [
  { id: 1, deviceCode: "VALVE-001", name: "A 区阀门 1", type: "电磁阀", plotName: "1 号番茄地块", onlineStatus: "ONLINE", lastOnlineAt: "2026-03-13T10:09:00" },
  { id: 2, deviceCode: "SENSOR-001", name: "A 区土壤传感器", type: "土壤湿度传感器", plotName: "1 号番茄地块", onlineStatus: "ONLINE", lastOnlineAt: "2026-03-13T10:08:00" },
  { id: 3, deviceCode: "PUMP-001", name: "主水泵", type: "水泵", plotName: "A 区主泵房", onlineStatus: "FAULT", lastOnlineAt: "2026-03-13T09:52:00" }
];

const realtimeReadings = [
  { id: 1, plotName: "1 号番茄地块", metricCode: "soil_moisture", metricName: "土壤湿度", metricValue: 34.8, unit: "%", collectTime: "2026-03-13T10:09:00" },
  { id: 2, plotName: "1 号番茄地块", metricCode: "air_temp", metricName: "空气温度", metricValue: 27.2, unit: "°C", collectTime: "2026-03-13T10:09:00" },
  { id: 3, plotName: "2 号黄瓜地块", metricCode: "soil_moisture", metricName: "土壤湿度", metricValue: 42.1, unit: "%", collectTime: "2026-03-13T10:08:00" },
  { id: 4, plotName: "育苗温室", metricCode: "air_humidity", metricName: "空气湿度", metricValue: 68.0, unit: "%", collectTime: "2026-03-13T10:07:00" },
  { id: 5, plotName: "育苗温室", metricCode: "light", metricName: "光照强度", metricValue: 850, unit: "Lux", collectTime: "2026-03-13T10:07:00" }
];

const irrigationTasks = [
  { id: 1, taskName: "番茄地块自动补水", mode: "AUTO", plotName: "1 号番茄地块", status: "RUNNING", durationMinutes: 20, startTime: "2026-03-13T09:55:00" },
  { id: 2, taskName: "黄瓜地块晨间灌溉", mode: "SCHEDULED", plotName: "2 号黄瓜地块", status: "FINISHED", durationMinutes: 15, startTime: "2026-03-13T07:20:00" }
];

const alarms = [
  { id: 1, level: "HIGH", type: "DEVICE_FAULT", title: "主水泵通信异常", plotName: "A 区", status: "UNACK", createdAt: "2026-03-13T09:52:00" },
  { id: 2, level: "MEDIUM", type: "LOW_MOISTURE", title: "1 号番茄地块湿度过低", plotName: "1 号番茄地块", status: "UNACK", createdAt: "2026-03-13T10:04:00" }
];

const waterUsageTrend = [
  { label: "Mon", value: 22.0 },
  { label: "Tue", value: 26.0 },
  { label: "Wed", value: 21.0 },
  { label: "Thu", value: 28.0 },
  { label: "Fri", value: 36.5 }
];

const moistureTrend = [
  { label: "06:00", value: 41.0 },
  { label: "08:00", value: 38.0 },
  { label: "10:00", value: 35.0 },
  { label: "12:00", value: 37.0 },
  { label: "14:00", value: 42.0 },
  { label: "16:00", value: 46.0 }
];

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

async function respond(data, message = "success") {
  await delay();
  return {
    code: 200,
    message,
    data: clone(data)
  };
}

export async function getDashboardOverview() {
  return respond({
    cards: dashboardCards,
    moistureTrend,
    waterUsageTrend,
    runningTasks: irrigationTasks,
    latestAlarms: alarms
  });
}

export async function getPlots() {
  return respond(plots);
}

export async function getDevices() {
  return respond(devices);
}

export async function getRealtimeReadings() {
  return respond(realtimeReadings);
}

export async function getIrrigationTasks() {
  return respond(irrigationTasks);
}

export async function createManualIrrigation(payload) {
  const plot = plots.find((item) => item.id === Number(payload.plotId)) ?? plots[0];

  return respond(
    {
      id: 99,
      taskName: "人工灌溉任务",
      mode: "MANUAL",
      plotName: plot.name,
      status: "RUNNING",
      durationMinutes: Number(payload.durationMinutes) || 15,
      startTime: new Date().toISOString()
    },
    "人工灌溉已启动"
  );
}

export async function getAlarms() {
  return respond(alarms);
}
