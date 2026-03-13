<script setup>
import { reactive } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
const form = reactive({
  username: "admin",
  password: "123456"
});

function handleLogin() {
  if (!form.username || !form.password) {
    return;
  }
  router.push("/");
}
</script>

<template>
  <div class="auth-page light-auth">
    <div class="simple-auth-card">
      <div class="auth-logo">灌</div>
      <h1>智能灌溉管理平台</h1>
      <p>请输入账号信息登录系统</p>

      <form class="simple-auth-form" @submit.prevent="handleLogin">
        <input v-model="form.username" type="text" placeholder="请输入用户名" />
        <input v-model="form.password" type="password" placeholder="请输入密码" />
        <button type="submit" class="auth-submit-btn">登录</button>
      </form>

      <div class="auth-links">
        <span>还没有账号？</span>
        <RouterLink to="/register">立即注册</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.light-auth {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(circle at top, rgba(94, 201, 106, 0.18), transparent 26%), linear-gradient(180deg, #f8fff7 0%, #eef9ed 100%);
}

.simple-auth-card {
  width: min(360px, 100%);
  padding: 28px 24px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #dcefd9;
  box-shadow: 0 16px 36px rgba(76, 185, 94, 0.12);
  text-align: center;
}

.auth-logo {
  width: 52px;
  height: 52px;
  margin: 0 auto 16px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #5fd36d, #3faa4d);
  color: #fff;
  font-size: 22px;
  font-weight: 800;
}

.simple-auth-card h1,
.simple-auth-card p {
  margin: 0;
}

.simple-auth-card h1 {
  color: #1f3425;
  font-size: 24px;
}

.simple-auth-card p {
  margin-top: 8px;
  color: #6f836f;
  font-size: 13px;
}

.simple-auth-form {
  display: grid;
  gap: 14px;
  margin-top: 24px;
}

.simple-auth-form input {
  border: 1px solid #d7e8d4;
  border-radius: 12px;
  padding: 12px 14px;
  background: #fbfffb;
  color: #1f3425;
}

.simple-auth-form input:focus {
  outline: none;
  border-color: #58c86a;
  box-shadow: 0 0 0 3px rgba(88, 200, 106, 0.12);
}

.auth-submit-btn {
  border: none;
  border-radius: 12px;
  padding: 12px 14px;
  background: linear-gradient(135deg, #5fd36d, #3faa4d);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.auth-links {
  margin-top: 16px;
  font-size: 12px;
  color: #6f836f;
}

.auth-links a {
  margin-left: 8px;
  color: #359646;
  font-weight: 700;
}
</style>
