<template>
    <div class="WayLineInitializePanel">
      <div class="head">创建新航线</div>
      <div class="middlearea">
        <div class="hangxian">航线名称</div>
        <el-input class="waylinename" v-model="input" placeholder="请输入内容"></el-input>
<!--        <div class="dronename">选择飞行器与负载</div>-->
<!--        <el-select v-model="dronetype" placeholder="请选择" class="choosepanel">-->
<!--          <el-option-->
<!--              v-for="item in Droneoptions"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
        <div class="buttonarea">
          <el-button type="primary" style="width: 80px" @click="create">确定</el-button>
          <el-button type="info" style="width: 80px" @click="cancel">取消</el-button>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRouter, useRoute} from "vue-router";
import bus from '@/utils/bus'
import store from "../../../../store";
import {WayLineV2} from "@/store/types/WayLineV2";
import {WayLineGlobalParams} from "@/store/types/wayline";

const route = useRoute();
const router = useRouter();

const Droneoptions=[{
  value: 'M30系列',
  label: 'M30系列'
}, {
  value: 'Mavic 3 行业系列',
  label: 'Mavic 3 行业系列'
}]


const dronetype=ref("Mavic 3 行业系列")
const input = ref('')
//1是代表航点航线，懒得起英文名了
//2是代表面状航线
//3是代表带状航线
//4是代表单点环绕航线
const SelectType=ref("1")
const ExchangeWaylineType = (type:string) => {
  SelectType.value=type
  console.log(SelectType.value)
}
const create = () => {
  if (input.value==""){
    const message = '请输入航线的名字这是必须的';
    const result = confirm(`${message}\n\n点击“确定”则退出，点击“取消”则继续编辑。`);
    return
  }
  switch (SelectType.value){
    case "1":
      router.push({
        path: '/default/edit-waypoint-v2',
        query: {
          name: input.value,
          drone_type: dronetype.value,
            device_sn: route.query.device_sn,
        }
      })
      break
    case "2":
      // 功能禁用
        const message_polygon = '面状航线功能暂未开放，请选择航点航线'
        const result_polygon = confirm(`${message_polygon}\n\n点击“确定”则退出，点击“取消”则继续编辑。`);
      // router.push({
      //   path: '/default/edit-waypoint-polygon-v2',
      //   query: {
      //     name: input.value,
      //     drone_type: dronetype.value,
        //     device_sn: route.query.device_sn,
      //   }
      // })
      break
    case "3":
        // 功能禁用
        const message_point = '单点环绕功能暂未开放，请选择航点航线'
        const result_point = confirm(`${message_point}\n\n点击“确定”则退出，点击“取消”则继续编辑。`);
      // router.push({
      //   path: '/default/edit-waypoint-point-v2',
      //   query: {
      //     name: input.value,
      //     drone_type: dronetype.value,
        //     device_sn: route.query.device_sn,
      //   }
      // })
      break
    case "4":
        // 功能禁用
        const message = '带状航线功能暂未开放，请选择航点航线'
        const result = confirm(`${message}\n\n点击“确定”则退出，点击“取消”则继续编辑。`);
      // router.push({
      //   path: '/default/edit-waypoint-polygon-v2',
      //   query: {
      //     name: input.value,
      //     dronetype: dronetype.value,
        //     device_sn: route.query.device_sn,
      //   }
      // })
      break
  }


  // centerDialogVisible.value=true
}
const cancel = () => {
  router.back()
}
</script>

<style scoped lang="scss">

.WayLineInitializePanel{
  width:480px ;
  height:200px ;
  background: $ComponentBackground;
  position: fixed;
  top: 30%;
  left: 37%;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  z-index: 2;
}
.head{
  height: 38px;
  font-size: $FirstLevelTitleFontSize;
  text-align: center;
  line-height: 38px;
  background: $ComponentBackground;
  border-radius: 4px;
}
.middlearea{
  width: 419px;
  margin-left: 28px;
  margin-top: 28px;
}
.hangxian{
  margin-bottom: 12px;
  font-size: $SecondLevelTitleFontSize;
  color: $SecondLevelTitleColor;
  font-weight: $SecondLevelTitleFontWeight;
}
.dronename{
  margin-top: 24px;
  font-size: $SecondLevelTitleFontSize;
  color: $SecondLevelTitleColor;
  font-weight: $SecondLevelTitleFontWeight;
}

.choosepanel{
  width: 419px;
  margin-top: 10px;
}
.WaylineType{
  margin-top: 13px;
  display: flex;
  justify-content: space-between;
}
.Wayline{
  height: 85px;
  width: 85px;
  background-position: center;
 }
.WaylineImg {
    height: 85px;
  width: 85px;
}
.buttonarea{
  margin-top: 27px;
  margin-left: 220px;
}
.active{
  border: 1px solid $TouchColor;
}
</style>
