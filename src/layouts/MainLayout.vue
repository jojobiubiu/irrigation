<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "../stores/app";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const menus = [
  { path: "/", label: "首页" },
  { path: "/plots", label: "地块" },
  { path: "/devices", label: "设备" },
  { path: "/monitor", label: "监测" },
  { path: "/prediction", label: "预测" },
  { path: "/irrigation", label: "控制" },
  { path: "/alarms", label: "告警" }
];

const activePath = computed(() => route.path);
const currentMenu = computed(() => menus.find((item) => item.path === route.path) ?? menus[0]);

function handleLogout() {
  router.push("/login");
}
</script>

<template>
  <div class="page-shell admin-layout">
    <aside class="sidebar">
      <div class="brand-block">
        <div class="brand-mark">灌</div>
        <div>
          <h1>智能灌溉系统</h1>
          <p>管理平台</p>
        </div>
      </div>

      <nav class="menu-list">
        <RouterLink
          v-for="menu in menus"
          :key="menu.path"
          :to="menu.path"
          class="menu-link"
          :class="{ 'is-active': activePath === menu.path }"
        >
          <span class="menu-dot"></span>
          {{ menu.label }}
        </RouterLink>
      </nav>
    </aside>

    <main class="workspace">
      <header class="workspace-topbar">
        <div class="topbar-title">{{ currentMenu.label }}</div>
        <div class="topbar-right">
          <span class="badge is-success">
            <span class="status-dot"></span>
            online
          </span>
          <div class="operator-card">
            <strong>{{ appStore.user.username }}</strong>
            <span>{{ appStore.user.roleName }}</span>
          </div>
          <button class="logout-btn" @click="handleLogout">退出登录</button>
        </div>
      </header>

      <section class="workspace-content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: grid;
  grid-template-columns: 168px 1fr;
  min-height: 100vh;
  background: #f3f8f1;
}

.sidebar {
  padding: 10px;
  background: #f7fbf6;
  border-right: 1px solid var(--line);
}

.brand-block {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px 6px 14px;
}

.brand-mark {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #59c96a, #3da74d);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
}

.brand-block h1,
.brand-block p {
  margin: 0;
}

.brand-block h1 {
  font-size: 12px;
  color: var(--text);
}

.brand-block p {
  margin-top: 2px;
  color: var(--muted);
  font-size: 10px;
}

.menu-list {
  display: grid;
  gap: 6px;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--muted);
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 600;
}

.menu-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.menu-link:hover,
.menu-link.is-active {
  color: var(--primary-deep);
  background: rgba(89, 201, 106, 0.14);
  border-color: rgba(89, 201, 106, 0.2);
}

.workspace {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #f3f8f1;
}

.workspace-topbar {
  height: 46px;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(6px);
}

.topbar-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.operator-card {
  padding: 5px 10px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid var(--line);
}

.operator-card strong,
.operator-card span {
  display: block;
}

.operator-card strong {
  font-size: 11px;
  color: var(--text);
}

.operator-card span {
  margin-top: 2px;
  color: var(--muted);
  font-size: 10px;
}

.logout-btn {
  border: 1px solid var(--line);
  background: #ffffff;
  color: var(--text);
  border-radius: 8px;
  padding: 7px 12px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
}

.workspace-content {
  padding: 12px;
  min-height: calc(100vh - 46px);
}

@media (max-width: 900px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }
}
</style>
