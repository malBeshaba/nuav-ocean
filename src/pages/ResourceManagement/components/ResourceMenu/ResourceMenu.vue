<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    default-active="/resource/drone"
    text-color="#fff"
    router
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item index="/default/resource/drone">
      <img class="menu-photo" style="width: 36px" :src="droneIMG" alt="">
    </el-menu-item>
    <el-menu-item index="/default/resource/dock">
      <img class="menu-photo" :src="dockIMG" alt="">
    </el-menu-item>
    <el-menu-item index="/default/resource/user">
      <img class="menu-photo" src="@/assets/ResourceManagement/人员.png" alt="">
    </el-menu-item>
    <!-- <el-menu-item index="4">
      <el-icon><setting /></el-icon>
    </el-menu-item> -->
  </el-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import droneIMG from "@/assets/images/drone.png"
import dockIMG from "@/assets/images/dock2.png"

const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}

</script>

<style scoped>
.el-menu {
  border-right: 0;
}

.menu-photo {
  width: 28px;
  height: 28px;
}
</style>
