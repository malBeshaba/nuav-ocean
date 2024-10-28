<!--机场详细信息元素-->
<template>
  <div class="dock-detail">
    <!-- 设备 -->
    <div class="dock-info">
      <div class="info-left">
        <el-avatar shape="square" style="width: 34px; height: 29px; background-color: transparent;" :src="dockIMG"/>
      </div>
      <div class="info-center">
        <div class="info-center__title"> {{ dockInfo.hangarName ? dockInfo.hangarName + ' 机库' : '机库'}}</div>
      </div>
      <div class="info-right">
        <div class="circle"
             :style="dockInfo.hangarState === '离线' ? 'backgroud: red;' : 'background: #19BE6B;'"></div>
        <div style="padding-left: 12px;width: 75%;"> {{ dockInfo.hangarState ? dockInfo.hangarState : '未知' }}</div>
      </div>
    </div>
    <!-- 机场具体 -->
    <div class="dock-information">
      <el-row class="item-row">
        <el-col :span="12" class="item">
          <div class="item-title">舱门状态</div>
          <div class="item-detail"> {{ jxDockState?.hatchState === '0' ? '关闭' : '开启' }}</div>
        </el-col>
        <el-col :span="12" class="item">
          <div class="item-title">空调状态</div>
          <span class="item-detail">{{jxDockState?.ventilatorState === '0' ? '关闭' : '开启'}}</span>
        </el-col>
      </el-row>
      <el-row class="item-row">
        <el-col :span="8" class="item">
          <div class="item-title">第一推杆状态</div>
          <span class="item-detail">{{ jxDockState?.pushbeamXState === '0' ? '夹紧' : '松开' }} </span>
        </el-col>
        <el-col :span="8" class="item">
          <div class="item-title">第二推杆状态</div>
          <span class="item-detail">{{ jxDockState?.pushbeamYState === '0' ? '夹紧' : '松开' }} </span>
        </el-col>
        <el-col :span="8" class="item">
          <div class="item-title">无线充电状态</div>
          <span class="item-detail">{{jxDockState?.wirelessChargeState === '0' ? '未充电' : '充电中' }}</span>
        </el-col>
      </el-row>
      <el-row class="item-row">
        <el-col :span="8" class="item">
          <div class="item-title">风速</div>
          <span class="item-detail">{{ jxDockState?.windSpeed + ' m/s' }}</span>
        </el-col>
        <el-col :span="8" class="item">
          <div class="item-title">风力</div>
          <span class="item-detail">{{ jxDockState?.windPower }}</span>
        </el-col>
        <el-col :span="8" class="item">
          <div class="item-title">风向</div>
          <span class="item-detail">{{ jxDockState?.windDirection }}</span>
        </el-col>
      </el-row>
      <el-row class="item-row">
        <el-col :span="8" class="item">
          <div class="item-title">当前雨量</div>
          <span class="item-detail">{{ jxDockState?.rainfall }} °C</span>
        </el-col>
        <el-col :span="8" class="item">
          <div class="item-title">是否有雨</div>
          <span class="item-detail">{{ jxDockState?.isRaining }}</span>
        </el-col>
        <el-col :span="8" class="item">
          <div class="item-title">天气</div>
          <span class="item-detail">{{ jxDockState?.weather }}</span>
        </el-col>
      </el-row>
      <el-row class="item-row">
        <el-col :span="8" class="item">
          <div class="item-title">湿度</div>
          <span class="item-detail">{{ jxDockState?.humidity }}</span>
        </el-col>
        <el-col :span="8" class="item">
          <div class="item-title">温度</div>
          <span class="item-detail">{{ jxDockState?.temperature }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="dock-video">
      <div class="video-item">
          <JxVideo :siteId="siteId" :device = 'deviceType' />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, reactive, watch, onBeforeUnmount} from 'vue'
import { JxDockState} from "@/store/types/device";
import dockIMG from "@/assets/images/dock2.png"
import {useMyStore} from "@/store"
import {useRoute, useRouter} from 'vue-router';
import {getHomepageSiteList} from "@/api/jiexiang/site";
import JxVideo from "@/components/video/JxVideo.vue";

const route = useRoute();
const router = useRouter();
const siteId = ref(route.query.siteId as string)
const store = useMyStore()
const deviceType = ref('dock' as string)

let jxDockState = reactive({} as JxDockState)
const dockInfo = ref({} as any)

let droneInfo = reactive({} as any)

const isFull = ref(false as boolean)

onMounted(() => {
  getSiteInfo()
});

const getSiteInfo = async () => {
  getHomepageSiteList().then(res => {
    if (res.errorCode === '00000') {
      res.data.forEach((item: any) => {
        if (item.id === siteId.value) {
          dockInfo.value = item
          console.log('dock',dockInfo)
        }
      })
    }
  })
};

onBeforeUnmount(() => {

});


const toFull_sc = (isF: boolean) => {
  isFull.value = isF
}

watch(() => store.state.jxDockState[siteId.value], (newData, oldData) => {
  jxDockState = newData
}, {deep: true, immediate: true})

</script>

<style scoped lang="scss">
div {
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

/* 整体 */
.dock-detail {
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.7); */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: $ComponentGap;
  box-sizing: border-box;
}

/* 设备信息 */
.dock-info {
  width: 100%;
  height: 62px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
  box-sizing: border-box;
  font-size: $ContentFontSize;
  font-family: $ContentFontFamily;
  color: $ContentColor;
  font-weight: $ContentFontWeight;
  background: $TouchColor2;
  border-radius: 4px;
}

.info-left {
  width: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-center {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.info-center__title {
  color: $TouchColor;
  padding-bottom: 8px;
}

.info-right {
  width: 76px;
  display: flex;
  align-items: center;
}

.circle {
  border-radius: 50%;
  width: 8px;
  height: 8px;
}

/* 设备具体信息 */
.dock-information {
  width: 100%;
  height: 340px;
  display: flex;
  flex-direction: column;
  padding: 16px 0px;
  box-sizing: border-box;
}

.item-row {
  flex: 1;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-title {
  height: 14px;
  font-size: $AnnotateFontSize;
  font-family: $AnnotateFontFamily;
  color: $AnnotateColor;
  font-weight: $AnnotateFontWeight;
}

.item-detail {
  flex-grow: 1;
  display: flex;
  align-items: center;
  font-size: $ContentFontSize;
  font-family: $ContentFontFamily;
  color: $ContentColor;
  font-weight: $ContentFontWeight;
}

/* 设备视频 */
.dock-video {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

</style>
