<template>

  <div class="record-component">
    <div class="row">
      动作:飞行器偏航角
      <div class="DeleteIcon" @click="deleteItem"></div>
    </div>
    <!--    //写在这里是暂时有Bug调不了参数-->
    <el-row :gutter="17">
      <el-col :span="15"><el-slider class="DroneYawNum" v-model="DroneYawNum" :show-tooltip="false" :step=0.1
                                    :min="-180" :max="180"></el-slider></el-col>
      <el-col :span="6"><el-input-number class="DroneYawNumInput" size="mini" v-model="DroneYawNum"></el-input-number></el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import store from "@/store";
const props = defineProps(['message','Itemindex'])

const DroneYawNum=ref(props.message.rotateYawAircraftHeading)
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
          rotateYawAircraftHeading:newValue,
          rotateYawAircraftHeadingMode:"clockwise"
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
