<template>
  <br>
  <div class="record-component">
    <div class="row">
      动作：新建文件夹
      <div class="DeleteIcon" @click="deleteItem"></div>
    </div>
    <!--    //写在这里是暂时有Bug调不了参数-->
    <el-row :gutter="3">
      <el-col :span="6" class="InputName">文件夹名：</el-col>
      <el-col :span="10"><el-input v-model="DroneYawNum" placeholder="请输入内容"></el-input></el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import store from "@/store";
const props = defineProps(['message','Itemindex'])

const DroneYawNum=ref(props.message.aircraftHeading)
const index=ref(props.Itemindex)
const deleteItem=()=>{
  //删除动作，将后续动作的序号重排
  store.commit("DELETE_ACTION_ITEM_AND_RESORT",index.value.actionId)
  store.commit("UPDATE_WAYPOINT_INFO")
  console.log('delete', index.value)
  // console.log(store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action)
}
watch(
    DroneYawNum,
    (newValue, oldValue) => {
      //在这里直接更新vuex中的值
      store.commit("UPDATA_WAYLINE_ACTION",{
        0:index.value.actionId,
        1:{
          payloadPositionIndex:1,
          directoryName:DroneYawNum
        }
      })
      store.commit("UPDATE_WAYPOINT_INFO")
      // console.log(store.state.EditingWayLine.FocusWayPoint?.WayPointActionList?.action)
    },
)
watch(
    index.value,
    (newValue, oldValue) => {
      index.value=newValue
    },
)
</script>

<style>

</style>
