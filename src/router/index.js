import { createRouter, createWebHashHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import PlotManagementView from "../views/PlotManagementView.vue";
import DeviceManagementView from "../views/DeviceManagementView.vue";
import MonitorCenterView from "../views/MonitorCenterView.vue";
import IrrigationPredictionView from "../views/IrrigationPredictionView.vue";
import IrrigationControlView from "../views/IrrigationControlView.vue";
import AlarmCenterView from "../views/AlarmCenterView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView
    },
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "",
          name: "dashboard",
          component: DashboardView
        },
        {
          path: "plots",
          name: "plots",
          component: PlotManagementView
        },
        {
          path: "devices",
          name: "devices",
          component: DeviceManagementView
        },
        {
          path: "monitor",
          name: "monitor",
          component: MonitorCenterView
        },
        {
          path: "prediction",
          name: "prediction",
          component: IrrigationPredictionView
        },
        {
          path: "irrigation",
          name: "irrigation",
          component: IrrigationControlView
        },
        {
          path: "alarms",
          name: "alarms",
          component: AlarmCenterView
        }
      ]
    }
  ]
});

export default router;
