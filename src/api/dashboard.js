import {
  createManualIrrigation,
  getAlarms,
  getDashboardOverview,
  getDevices,
  getIrrigationTasks,
  getPlots,
  getRealtimeReadings
} from "../mock/demoData";

export function fetchDashboardOverview() {
  return getDashboardOverview();
}

export function fetchPlots() {
  return getPlots();
}

export function fetchDevices() {
  return getDevices();
}

export function fetchRealtimeReadings() {
  return getRealtimeReadings();
}

export function fetchIrrigationTasks() {
  return getIrrigationTasks();
}

export function startManualIrrigation(payload) {
  return createManualIrrigation(payload);
}

export function fetchAlarms() {
  return getAlarms();
}
