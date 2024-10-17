<template>

  <div class="record-component">
    <div class="row">
      动作：开始等距离间隔拍照
      <div class="DeleteIconOne" @click="deleteItem"></div>
    </div>
    <!--    //写在这里是暂时有Bug调不了参数-->
    <el-row :gutter="17" class="SetRow">
      <el-col :span="3"><el-button size="medium" @click="setDroneYawNum(5)" >5m</el-button></el-col>
      <el-col :span="3"><el-button size="medium" @click="setDroneYawNum(10)">10m</el-button></el-col>
      <el-col :span="9"><el-input-number class="HoverNumInput" size="medium" v-model="DroneYawNum"></el-input-number></el-col>
      <el-col :span="3"><el-button size="medium" class="WaitTime15" @click="setDroneYawNum(15)">15m</el-button></el-col>
      <el-col :span="3"><el-button size="medium" class="WaitTime20" @click="setDroneYawNum(20)">20m</el-button></el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import store from "@/store";
const props = defineProps(['message','Itemindex'])

const DroneYawNum=ref(props.message.actionTriggerParam)
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
          actionTriggerType:"multipleDistance",
          actionTriggerParam:10
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
const setDroneYawNum=(num:number)=>{
  DroneYawNum.value=num
  //下面要手动的调用watch里面的函数
  store.commit("UPDATA_WAYLINE_ACTION",{
    0:index.value.actionId,
    1:{
      hoverTime:num
    }
  })
  store.commit("UPDATE_WAYPOINT_INFO")

}
</script>

<style>
.SetRow{
 padding-left: 10px;
}
</style>
