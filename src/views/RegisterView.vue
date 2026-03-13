<script setup>
import { reactive } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
const form = reactive({
  username: "",
  phone: "",
  password: "",
  confirmPassword: ""
});

function handleRegister() {
  if (!form.username || !form.phone || !form.password || !form.confirmPassword) {
    return;
  }
  router.push("/login");
}
</script>

<template>
  <div class="auth-page light-auth">
    <div class="simple-auth-card">
      <div class="auth-logo">注</div>
      <h1>注册账号</h1>
      <p>填写基础信息创建新账号</p>

      <form class="simple-auth-form" @submit.prevent="handleRegister">
        <input v-model="form.username" type="text" placeholder="请输入用户名" />
        <input v-model="form.phone" type="text" placeholder="请输入手机号" />
        <input v-model="form.password" type="password" placeholder="请输入密码" />
        <input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" />
        <button type="submit" class="auth-submit-btn">注册</button>
      </form>

      <div class="auth-links">
        <span>已有账号？</span>
        <RouterLink to="/login">返回登录</RouterLink>
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
  width: min(380px, 100%);
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
