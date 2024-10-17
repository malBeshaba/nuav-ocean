<template>
  <div class="record-component">
    <div class="row">
      动作：变焦
      <div class="DeleteIcon" @click="deleteItem"></div>
    </div>
    <!--    //写在这里是暂时有Bug调不了参数-->
    <el-row :gutter="17">
      <el-col :span="3"><el-button  class="WaitTime15" size="medium" @click="setDroneYawNum(300)">300mm</el-button></el-col>
      <el-col :span="3"><el-button  class="WaitTime15" size="medium" @click="setDroneYawNum(400)">400mm</el-button></el-col>
      <el-col :span="9"><el-input-number class="HoverNumInputOne" size="medium" v-model="DroneYawNum"></el-input-number></el-col>
      <el-col :span="3"><el-button  size="medium" class="WaitTime15" @click="setDroneYawNum(600)">600mm</el-button></el-col>
      <el-col :span="3"><el-button  size="medium" class="WaitTime20" @click="setDroneYawNum(700)">700mm</el-button></el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import store from "@/store";
const props = defineProps(['message','Itemindex'])

const DroneYawNum=ref(props.message. useGlobalPayloadLensIndex)
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
          useGlobalPayloadLensIndex:500
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

</style>
