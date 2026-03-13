import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    user: {
      username: "admin",
      roleName: "农场管理员"
    }
  })
});
