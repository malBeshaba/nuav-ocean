<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";

function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return [params.get('token'), params.get('workspace_id')];
}
function removeTokenFromUrl() {
  // 获取当前页面的 URL，去除 token 参数
  const url = new URL(window.location.href);
  url.searchParams.delete('token'); // 删除 token 参数
  window.history.replaceState({}, document.title, url.pathname + url.search);
}
const login_info = getTokenFromUrl();
if (login_info[0]) {
  // 这个位置存token
  console.log(login_info)
  localStorage.setItem("token", login_info[0] as string);
  localStorage.setItem("userInfo", JSON.stringify({
    workspace_id: login_info[1] as string
  }));
  removeTokenFromUrl();
  router.push('/default/home');
}
</script>

<style scoped>

</style>
