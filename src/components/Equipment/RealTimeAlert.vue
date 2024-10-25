<template>
    <div style="background: rgba(0, 40, 66, 1); padding-bottom: 5px;">
        <CustomPanel bottom-light style="width: 300px;" v-if="isShow">
            <PanelTitle>无人机详情</PanelTitle>
            <main-page-frame />
            <el-icon class="btn-backward" @click="handleOnClose"><Close /></el-icon>
        </CustomPanel>
    </div>
</template>

<script setup lang="ts">
import PanelTitle from "@/components/panelTitle/index.vue";
import CustomPanel from "@/components/customPanel/index.vue";
import MainPageFrame from "@/pages/MainPageFrame/MainPageFrame.vue";
import { Close } from '@element-plus/icons-vue'
import { watch, ref} from "vue";
import { useMyStore } from "@/store"

const store = useMyStore();
const isShow = ref(false);

const handleOnClose = () => {
    store.commit('SET_IFRAME_DOCK_SN', '');
}

watch(() => store.state.iframeDockSn, (value) => {
    console.log("value", value);
    isShow.value = !!value;
}, { immediate: true })
</script>

<style scoped lang="scss">
.btn-backward {
    position: absolute;
    top: 0px;
    right: 0px;
    vertical-align: middle;
    width: 2em;
    height: 2em;
    font-size: $IconSize;
    color: $IconColor;
    z-index: 3;
  }
</style>