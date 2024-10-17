<template>
  <div class="record-component">
    <div class="row">
      动作：拍照
      <div class="DeleteIcon" @click="deleteItem"></div>
    </div>
    <!--    //写在这里是暂时有Bug调不了参数-->

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

</script>
<style>


</style>
