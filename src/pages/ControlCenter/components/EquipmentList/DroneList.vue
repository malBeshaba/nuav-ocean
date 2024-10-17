<template>
  <div class="drone_list">
    <list-head title="资源信息" style="width: 100%;"></list-head>
    <div class="source-tag">
      <div class="tag">
        <span class="equip">无人机</span>
<!--        <span class="num">{{20}}架</span>-->
      </div>
      <div class="tag">
        <span class="equip">机场</span>
<!--        <span class="num">{{}}个</span>-->
      </div>
<!--      <div class="tag">-->
<!--        <span class="equip">工作人员</span>-->
<!--&lt;!&ndash;        <span class="num">{{}}人</span>&ndash;&gt;-->
<!--      </div>-->
    </div>
    <div class="head">
      <span class="title">无人机列表</span>
    </div>
    <div class="list" v-for="item in droneInfo" :key="item">
      <DroneItem :drone-info="item"></DroneItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import ListHead from "@/components/Head/ListHead.vue";
import router from "@/router";
import DroneItem from "@/components/Equipment/DroneItem.vue";
import {getBindingDevices} from "@/api/device";
import {reactive, ref, onMounted} from "vue";
import SourceBack from "@/assets/ControlCenter/source-back.png"
const toOther = () => {
  router.push({path: '/default/control/dock-list'})
}
const infos = [{
  deviceName: '北斗M300',
  deviceModel: 'M300',
  payload: 'h20T',
  state: '待命'}]
const droneInfo = reactive([]);
const droneTotal = ref(2);
const getDroneList = () => {
  droneInfo.splice(0, droneInfo.length);
  getBindingDevices({
    workspace_id: JSON.parse(localStorage.getItem('userInfo') as string).workspace_id,
    page: 1,
    page_size: 100,
    domain: 0,
  }).then(res => {
    if (res.code === 0) {
      droneTotal.value = res.data.pagination.total
      res.data.list.forEach((item: any) => {
        droneInfo.push(item)
      })
    }
  })
};
onMounted(() => {
  getDroneList()
})
</script>

<style scoped lang="scss">
.drone_list {
  background-color: $ComponentBackground;
  width: 100%;
  height: 100%;
}
.source-tag {
  display: flex;
}
.tag {
  margin-left: 60px;
  //display: flex;
  //flex-direction: column;
  //flex
  width: 102px;
  height: 110px;
  /*background-color: black;*/
  //position: relative;
  background-image: url("@/assets/ControlCenter/source-back.png");
  text-align: center;
}
.equip {
  width: 50px;
  height: 16px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #AED6FF;
  line-height: 80px;
  text-shadow: 1px 2px 0px rgba(17,20,22,0.22);
  background: linear-gradient(0deg, rgba(250,254,255,0.72) 0%, rgba(250,254,255,0) 100%);
  -webkit-background-clip: text;
  //-webkit-text-fill-color: transparent;
}
.num {
  width: 32px;
  height: 23px;
  font-size: 28px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #EDFBFF;
  background: linear-gradient(179deg, #FFFBCC 0%, #FFCD3D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.title {
  color: $TouchColor;
}
</style>
