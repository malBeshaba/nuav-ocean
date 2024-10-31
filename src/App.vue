<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import router from "@/router";
import { useMyStore } from "@/store"
import {
  useConnectWebSocket,
  messageHandler,
} from "@/utils/websocket/use-connect-websocket";

import { dockState } from '@/utils/deviceWatch/dockState'
import { deviceState } from '@/utils/deviceWatch/deviceState'
const store = useMyStore()

useConnectWebSocket(messageHandler);
dockState()
deviceState()

function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return [params.get('token'), params.get('workspace_id'),params.get("path"),params.get("dockSn")];
}
function removeTokenFromUrl() {
  // 获取当前页面的 URL，去除 token 参数
  const url = new URL(window.location.href);
  url.searchParams.delete('token'); // 删除 token 参数
  window.history.replaceState({}, document.title, url.pathname + url.search);
}
const login_info = getTokenFromUrl();
if (login_info[0]) {
  localStorage.setItem("token", login_info[0] as string);
  localStorage.setItem("userInfo", JSON.stringify({
    workspace_id: login_info[1] as string
  }));
  removeTokenFromUrl();
  if(login_info[3]){
    store.commit('SET_IFRAME_DOCK_SN', login_info[3]);
  }

  if(login_info[2] === "mainPageFrame") {
    // router.push(login_info[2] as string);
    router.push("/mainPageFrame")
  }else{
    router.push('/default/task');
  }
} else {
  localStorage.setItem("token", import.meta.env.VITE_TOKEN as string);
  localStorage.setItem("userInfo", JSON.stringify({
    workspace_id: import.meta.env.VITE_WORKSPACE_ID as string
  }));
}


</script>

<style scoped>

</style>
