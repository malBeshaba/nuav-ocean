
<script setup lang="ts">
import {Upload} from "@element-plus/icons-vue";
import { ref, watch, computed } from 'vue'
const route = useRoute();
const router = useRouter();
import store from "@/store";
import { useStore } from 'vuex'
import fly1 from '@assets/map/fly/fly1.png'
import fly2 from '@assets/map/fly/fly2.png'
import fly3 from '@assets/map/fly/fly3.png'
import fly4 from '@assets/map/fly/fly4.png'
import fly5 from '@assets/map/fly/fly5.png'
import {useRoute, useRouter} from "vue-router";
import {getWaylinePointByWaylineId} from "@/api/wayLinePoint";
import {InitializationWaypointByWaylineInfo} from "@/store/types/WayPoint";

const checked1 = ref(true)
const checked2 = ref(true)
let check1 = false
let check2 = false
const value1 = ref(false)
const onChange1 = (status: boolean) => {
  checked1.value = status
  check2 = !check2
}
const onChange2 = (status: boolean) => {
  checked2.value = status
  check1 = !check1
}
const vertical = ref(true)
const incline = ref(false)
const onVertical = () => {
  vertical.value = !vertical.value
  incline.value = !incline.value
}
const onIncline = () => {
  vertical.value = !vertical.value
  incline.value = !incline.value
}

const climb = ref(100)
if(route.query.waylineId){
  getWaylinePointByWaylineId(route.query.waylineId).then((res) => {
    // climb.value=res.data.templateContent.Folder.takeOffSecurityHeight
    climb.value=res.data.templateContent.missionConfig.takeOffSecurityHeight
  })
}
const showClimb = ref(true)

watch(climb, (newVal, oldVal) => {
  //console.log('climb changed from', oldVal, 'to', newVal);
  // if (newVal < 80){
  //   climb.value = 80
  //   newVal = 80
  //   ElMessage({
  //     message: '高度不得低于80m',
  //     type: 'warning',
  //   })
  // }
  // climb.value = newVal
  store.commit('SET_GLOBAL_RTH_HEIGHT', newVal)
})



const climbChange = () => {
  showClimb.value = !showClimb.value
}
const climbReturn = () => {
  showClimb.value = !showClimb.value
  if (climb.value >= 1500){
    climb.value = 1500
  }
  if (climb.value <= -2){
    climb.value = -2
  }
}
const add = ref(false)
const sub = ref(false)
const addOneHundred = () => {
  if (parseInt(climb.value) + 100 >= 1500){
    climb.value = 1500
    add.value = true
    return
  }
  climb.value = parseInt(climb.value) + 100;
  if (sub.value === true){
    sub.value = false
  }
}
const addTen = () => {
  if (parseInt(climb.value) + 10 >= 1500){
    climb.value = 1500
    add.value = true
    return
  }
  climb.value = parseInt(climb.value) + 10;
  if (sub.value === true){
    sub.value = false
  }
}
const subTen = () => {

  if (parseInt(climb.value) - 10 <= 2){
    climb.value = 2
    sub.value =true
    return
  }
  climb.value = parseInt(climb.value) - 10;
  if (add.value === true){
    add.value = false
  }
}
const subOneHundred = () => {

  if (parseInt(climb.value) - 100 <= 2){
    climb.value = 2
    sub.value =true
    return
  }
  climb.value = parseInt(climb.value) - 100;
  if (add.value === true){
    add.value = false
  }
}

const absoluteLight = ref(true)
const absoluteDark = ref(false)
const relativeFlyLight = ref(false)
const relativeFlyDark = ref(true)
const relativeGroundLight = ref(false)
const relativeGroundDark = ref(true)

const heightModel = ref('absolute')
const absoluteChange = () => {
  heightModel.value = 'absolute'
  absoluteLight.value =true
  absoluteDark.value = false

  relativeFlyLight.value = false
  relativeFlyDark.value = true

  relativeGroundLight.value = false
  relativeGroundDark.value = true
}
const flyChange = () => {
  heightModel.value = 'fly'
  absoluteLight.value =false
  absoluteDark.value = true

  relativeFlyLight.value = true
  relativeFlyDark.value = false

  relativeGroundLight.value = false
  relativeGroundDark.value = true
}
const groundChange = () => {
  heightModel.value = 'ground'
  absoluteLight.value =false
  absoluteDark.value = true

  relativeFlyLight.value = false
  relativeFlyDark.value = true

  relativeGroundLight.value = true
  relativeGroundDark.value = false
}

const climbByAbsolute = ref(100)
const showClimbByAbsolute = ref(true)

watch(climbByAbsolute, (newVal, oldVal) => {
  //console.log('climb changed from', oldVal, 'to', newVal);
  // if (newVal < 80){
  //   climbByAbsolute.value = 80
  //   newVal = 80
  // //   ElMessage({
  // //     message: '高度不得低于80m',
  // //     type: 'warning',
  // //   })
  // // }
  // climbByAbsolute.value = newVal
  store.commit('SET_EXECUTE_HEIGHT', newVal)
})

if(route.query.waylineId){
  getWaylinePointByWaylineId(route.query.waylineId).then((res) => {
    // console.log("这个代码无问题")
    // console.log("起飞高度", res.data.templateContent.Folder.placemark)
    climbByAbsolute.value=res.data.templateContent.Folder.placemark[0].executeHeight
  })
}

const climbChangeByAbsolute = () => {
  showClimbByAbsolute.value = !showClimbByAbsolute.value
}
const climbReturnByAbsolute = () => {
  showClimbByAbsolute.value = !showClimbByAbsolute.value
  if (climbByAbsolute.value >= 10000){
    climbByAbsolute.value = 10000
  }
  if (climbByAbsolute.value <= -2000){
    climbByAbsolute.value = -2000
  }
}
const addByAbsolute = ref(false)
const subByAbsolute = ref(false)
const addOneHundredByAbsolute = () => {
  if (parseInt(climbByAbsolute.value) + 100 >= 10000){
    climbByAbsolute.value = 10000
    addByAbsolute.value = true
    return
  }
  climbByAbsolute.value = parseInt(climbByAbsolute.value) + 100;
  if (subByAbsolute.value === true){
    subByAbsolute.value = false
  }
}
const addTenByAbsolute = () => {
  if (parseInt(climbByAbsolute.value) + 10 >= 10000){
    climbByAbsolute.value = 10000
    addByAbsolute.value = true
    return
  }
  climbByAbsolute.value = parseInt(climbByAbsolute.value) + 10;
  if (subByAbsolute.value === true){
    subByAbsolute.value = false
  }
}
const subTenByAbsolute = () => {

  if (parseInt(climbByAbsolute.value) - 10 <= -2000){
    climbByAbsolute.value = -2000
    subByAbsolute.value =true
    return
  }
  climbByAbsolute.value = parseInt(climbByAbsolute.value) - 10;
  if (addByAbsolute.value === true){
    addByAbsolute.value = false
  }
}
const subOneHundredByAbsolute = () => {

  if (parseInt(climbByAbsolute.value) - 100 <= -2000){
    climbByAbsolute.value = -2000
    subByAbsolute.value =true
    return
  }
  climbByAbsolute.value = parseInt(climbByAbsolute.value) - 100;
  if (addByAbsolute.value === true){
    addByAbsolute.value = false
  }
}


const climbByFly = ref(100)
const showClimbByFly = ref(true)

const climbChangeByFly = () => {
  showClimbByFly.value = !showClimbByFly.value
}
const climbReturnByFly = () => {
  showClimbByFly.value = !showClimbByFly.value
  if (climbByFly.value >= 1500){
    climbByFly.value = 1500
  }
  if (climbByFly.value <= -1500){
    climbByFly.value = -1500
  }
}
const addByFly = ref(false)
const subByFly = ref(false)
const addOneHundredByFly = () => {
  if (parseInt(climbByFly.value) + 100 >= 1500){
    climbByFly.value = 1500
    addByFly.value = true
    return
  }
  climbByFly.value = parseInt(climbByFly.value) + 100;
  if (subByFly.value === true){
    subByFly.value = false
  }
}
const addTenByFly = () => {
  if (parseInt(climbByFly.value) + 10 >= 1500){
    climbByFly.value = 1500
    addByFly.value = true
    return
  }
  climbByFly.value = parseInt(climbByFly.value) + 10;
  if (subByFly.value === true){
    subByFly.value = false
  }
}
const subTenByFly = () => {

  if (parseInt(climbByFly.value) - 10 <= -1500){
    climbByFly.value = -1500
    subByFly.value =true
    return
  }
  climbByFly.value = parseInt(climbByFly.value) - 10;
  if (addByFly.value === true){
    addByFly.value = false
  }
}
const subOneHundredByFly = () => {

  if (parseInt(climbByFly.value) - 100 <= -1500){
    climbByFly.value = -1500
    subByFly.value =true
    return
  }
  climbByFly.value = parseInt(climbByFly.value) - 100;
  if (addByFly.value === true){
    addByFly.value = false
  }
}


const climbByGround = ref(100)
const showClimbByGround = ref(true)

const climbChangeByGround = () => {
  showClimbByGround.value = !showClimbByGround.value
}
const climbReturnByGround = () => {
  showClimbByGround.value = !showClimbByGround.value
  if (climbByGround.value >= 1500){
    climbByGround.value = 1500
  }
  if (climbByGround.value <= 0){
    climbByGround.value = 0
  }
}
const addByGround = ref(false)
const subByGround = ref(false)
const addOneHundredByGround = () => {
  if (parseInt(climbByGround.value) + 100 >= 1500){
    climbByGround.value = 1500
    addByGround.value = true
    return
  }
  climbByGround.value = parseInt(climbByGround.value) + 100;
  if (subByGround.value === true){
    subByGround.value = false
  }
}
const addTenByGround = () => {
  if (parseInt(climbByGround.value) + 10 >= 1500){
    climbByGround.value = 1500
    addByGround.value = true
    return
  }
  climbByGround.value = parseInt(climbByGround.value) + 10;
  if (subByGround.value === true){
    subByGround.value = false
  }
}
const subTenByGround = () => {

  if (parseInt(climbByGround.value) - 10 <= 0){
    climbByGround.value = 0
    subByGround.value =true
    return
  }
  climbByGround.value = parseInt(climbByGround.value) - 10;
  if (addByGround.value === true){
    addByGround.value = false
  }
}
const subOneHundredByGround = () => {

  if (parseInt(climbByGround.value) - 100 <= 0){
    climbByGround.value = 0
    subByGround.value =true
    return
  }
  climbByGround.value = parseInt(climbByGround.value) - 100;
  if (addByGround.value === true){
    addByGround.value = false
  }
}


const speed = ref(10)
const showSpeed = ref(true)
const speedChange = () => {
  showSpeed.value = !showSpeed.value
}
const speedReturn = () => {
  showSpeed.value = !showSpeed.value
  if (speed.value >= 15){
    speed.value = 15
  }
  if (speed.value <= 1){
    speed.value = 1
  }
}
const addBySpeed = ref(false)
const subBySpeed = ref(false)
const addSpeed = () => {
  if (parseInt(speed.value) + 1 >= 15){
    speed.value = 15
    addBySpeed.value = true
    return
  }
  speed.value = parseInt(speed.value) + 1;
  if (subBySpeed.value === true){
    subBySpeed.value = false
  }
}
const subSpeed = () => {

  if (parseInt(speed.value) - 1 <= 1){
    speed.value = 1
    subBySpeed.value =true
    return
  }
  speed.value = parseInt(speed.value) - 1;
  if (addBySpeed.value === true){
    addBySpeed.value = false
  }
}
const cities = [
  {
    value: fly1,
    label: '曲线飞行，飞行器过点不停',
  },
  {
    value: fly2,
    label: '曲线飞行，飞行器到点停',
  },
  {
    value: fly3,
    label: '平滑过点，提前转弯',
  },
  {
    value: fly4,
    label: '协调转弯，不过点，提前转弯',
  },
  {
    value: fly5,
    label: '直线飞行，飞行器到点停',
  },
  ]
const label1 = ref('直线飞行，飞行器到点停')
const yawAngleMode = [
  {
    label: '沿航线方向',
  },
  {
    label: '手动控制',
  },
  {
    label: '锁定当前偏航角',
  },

]
const label2 = ref('沿航线方向')
const controlMode = [
  {
    label: '手动控制',
  },
  {
    label: '依照每个航点设置',
  },

]
const label3 = ref('手动控制')
const finishAction = [
  {
    label: '自动返航',
  },
  {
    label: '返回航线起始点悬停',
  },
  {
    label: '退出航线模式',
  },
  {
    label: '原地降落',
  },
]
const label4 = ref('自动返航')
</script>
<template>
  <el-scrollbar
      class="box-card">
    <div  class="text item">
      <span>
        已设置参考起飞点
      </span>
      <el-popover
          placement="right"
          :width="280"
          trigger="hover"
          content="起飞点”仅做航线规划参考，飞机执行航线时以飞机真实的起飞点为准。"
      >
        <template #reference>
          <span class="cancelSet">
            <el-icon color="#4a8ae9" size="14px"><Upload /></el-icon>
            <span>取消设置</span>
          </span>
        </template>
      </el-popover>
    </div>

    <div  class="text item photo">
      <span class="photoChild">拍照设置</span>
      <div class="photoChild">
        <el-check-tag
            key="wide"
            type="primary"
            class="mx-1 photoBlue"
            @change="onChange1"
            round
            :checked="checked1"
        >
          广角照片
        </el-check-tag>&nbsp;
        <el-check-tag
            key="focus"
            type="primary"
            class="mx-1 photoBlue"
            @change="onChange2"
            round
            :checked="checked2"
        >
          变焦照片
        </el-check-tag>
      </div>
      <div class="switchLight">
        <span>智能低光</span>
        <el-switch v-model="value1" />
      </div>

    </div>
    <el-popover
        placement="right"
        :width="280"
        trigger="hover"
    >
      <span>
        垂直爬升：飞行器爬升到航线起始点高度后，再飞向航线起始点。
        <br><br>倾斜爬升：飞行器爬升到安全起飞高度后，再直线飞到航线起始点。
        <br><br>安全起飞高度：是相对起飞点的高度值。
        <br><br>飞行器起飞后，会先上升至安全起飞高度，再飞向航线起始点。
      </span>
      <template #reference slot="reference">
        <div  class="text item climbParent">
          <div>
            <el-button :class="{'vertical':vertical,'incline':incline}"  @click="onVertical">
              垂直爬升
            </el-button>
            <el-button :class="{'vertical':!vertical,'incline':!incline}" @click="onIncline">
              倾斜爬升
            </el-button>
          </div>
          <div class="climbChild">
            <!-- <img src="@/assets/map/climb.png" alt="" class="climbLocus"> -->
<!--            <img src="@/assets/map/climb.png" alt="" class="climbLocus">-->
            <div class="addSub">
              <el-button class="numberChange" @click="addOneHundred" :disabled="add">+100</el-button>
              <el-button class="numberChange" @click="addTen" :disabled="add">+10</el-button>
              <span>
            <span v-if="showClimb" class="climbChange" @click="climbChange">
              {{ climb }}
            </span>
            <el-input v-else v-model="climb" class="climbInput" @blur="climbReturn"/>
              m
            </span>
              <el-button class="numberChange" @click="subTen" :disabled="sub">-10</el-button>
              <el-button class="numberChange" @click="subOneHundred" :disabled="sub">-100</el-button>
            </div>
          </div>
        </div>
      </template>
    </el-popover>

    <el-popover
        placement="right"
        :width="280"
        trigger="hover"
    >
      <span v-if="heightModel === 'absolute'">
        绝对高度：航点高度值相对于海拔面/椭球面高度保持不变。
      </span>
      <span v-else-if="heightModel === 'fly'" >
        相对起飞点高度（ALT）：航点高度值相对起飞点的高度保持不变。
      </span>
      <span v-else>
        相对地面高度（AGL）：航点高度值相对地面高度保持不变。
      </span>
      <template #reference slot="reference">
        <div  class="text item climbParent">
        <span class="model">
        航线高度模式
<!--          记得修改：修改高度，然后修改航线的全局飞行高度 executeheight-->
      </span>
          <div>
            <el-button
                :class="{'absoluteHeight':absoluteLight,'relativeFlyHeight':absoluteDark}"
                @click="absoluteChange">
              相对起飞点高度
            </el-button>
            <el-button
                :class="{'absoluteHeight':relativeFlyLight,'relativeFlyHeight':relativeFlyDark}"
                @click="flyChange">
              绝对高度
            </el-button>
            <el-button
                :class="{'absoluteHeight':relativeGroundLight,'relativeFlyHeight':relativeGroundDark}"
                @click="groundChange">
              相对地面高度
            </el-button>
          </div>
          <div v-if="heightModel === 'absolute' " class="climbChild">
            <!-- <img src="@/assets/map/flyHeight.png" alt="" class="climbLocus"> -->
            <div class="addSub">
              <el-button class="numberChange" @click="addOneHundredByAbsolute" :disabled="addByAbsolute">+100</el-button>
              <el-button class="numberChange" @click="addTenByAbsolute" :disabled="addByAbsolute">+10</el-button>
              <span>
            <span v-if="showClimbByAbsolute" class="climbChange heightChange" @click="climbChangeByAbsolute">
              {{ climbByAbsolute }}
            </span>
            <el-input v-else v-model="climbByAbsolute" class="climbInput" @blur="climbReturnByAbsolute"/>
              m
            </span>
              <el-button class="numberChange" @click="subTenByAbsolute" :disabled="subByAbsolute">-10</el-button>
              <el-button class="numberChange" @click="subOneHundredByAbsolute" :disabled="subByAbsolute">-100</el-button>
            </div>
          </div>
          <div v-else-if="heightModel === 'fly' " class="climbChild">
            <!-- <img src="@/assets/map/absoluteHeight.png" alt="" class="climbLocus"> -->
            <div class="addSub">
              <el-button class="numberChange" @click="addOneHundredByFly" :disabled="addByFly">+100</el-button>
              <el-button class="numberChange" @click="addTenByFly" :disabled="addByFly">+10</el-button>
              <span>
            <span v-if="showClimbByFly" class="climbChange heightChange" @click="climbChangeByFly">
              {{ climbByFly }}
            </span>
            <el-input v-else v-model="climbByFly" class="climbInput" @blur="climbReturnByFly"/>
              m
            </span>
              <el-button class="numberChange" @click="subTenByFly" :disabled="subByFly">-10</el-button>
              <el-button class="numberChange" @click="subOneHundredByFly" :disabled="subByFly">-100</el-button>
            </div>
          </div>
          <div v-else class="climbChild">
            <!-- <img src="@/assets/map/groundHeight.png" alt="" class="climbLocus"> -->
            <div class="addSub">
              <el-button class="numberChange" @click="addOneHundredByGround" :disabled="addByGround">+100</el-button>
              <el-button class="numberChange" @click="addTenByGround" :disabled="addByGround">+10</el-button>
              <span>
            <span v-if="showClimbByGround" class="climbChange heightChange" @click="climbChangeByGround">
              {{ climbByGround }}
            </span>
            <el-input v-else v-model="climbByGround" class="climbInput" @blur="climbReturnByGround"/>
              m
            </span>
              <el-button class="numberChange" @click="subTenByGround" :disabled="subByGround">-10</el-button>
              <el-button class="numberChange" @click="subOneHundredByGround" :disabled="subByGround">-100</el-button>
            </div>
          </div>
        </div>
      </template>
    </el-popover>


    <div  class="text item climbParent">
      <span>
        全局航线速度
      </span>
      <div class="asButton">
        <el-button class="symbol" @click="subSpeed" :disabled="subBySpeed">-</el-button>
        <span>
          <span v-if="showSpeed" class="climbChange heightChange" @click="speedChange">
              {{ speed }}
            </span>
            <el-input v-else v-model="speed" class="climbInput" @blur="speedReturn"/>
          m/s
        </span>
        <el-button class="symbol" @click="addSpeed" :disabled="addBySpeed">+</el-button>
      </div>
    </div>

    <div  class="text item climbParent">
      <el-collapse  >
        <el-collapse-item title="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;高级设置" name="1" >
          <div class="primarySet">
             <span class="model">
              航点类型
             </span>
            <el-select v-model="label1"  class="model" placement="top">
              <el-option
                  v-for="item in cities"
                  :key="item.value"
                  :value="item.label"
                  class="optionType"
              >
                <img :src="item.value" alt="" class="optionImg">
              </el-option>
            </el-select>
            <span class="model">
              飞行器偏航角模式
             </span>
            <el-select v-model="label2"  class="model">
              <el-option
                  v-for="item in yawAngleMode"
                  :key="item.label"
                  :value="item.label"
              >
                <span>{{item.label}}</span>
              </el-option>
            </el-select>
            <span class="model">
              航点间云台俯仰角控制模式
             </span>
            <el-select v-model="label3"  class="model">
              <el-option
                  v-for="item in controlMode"
                  :key="item.label"
                  :value="item.label"
              >
                <span>{{item.label}}</span>
              </el-option>
            </el-select>
            <span class="model">
              完成动作
             </span>
            <el-select v-model="label4"  >
              <el-option
                  v-for="item in finishAction"
                  :key="item.label"
                  :value="item.label"
              >
                <span>{{item.label}}</span>
              </el-option>
            </el-select>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-scrollbar>
</template>

<style scoped lang="scss">
.el-scrollbar{
  width: 400px;
}
ul{
  list-style: none;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 16px;
  background-color: rgba(39, 73, 85, 0.5);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
}
.photo{
  flex-direction: column;
}
.photoChild{
  margin-bottom: 12px;
}
.photoBlue {
  width: 56px;
  height: 18px;
  color: white;
  border-radius: 10px;
}
.photoBlue:hover{
  opacity: 0.6;
}
.switchLight{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-card {
  margin-top: 45px;
  width: 400px;
  background-color: $ComponentBackground;
  height: 420px;
  padding: 20px;
}
.vertical{
  width: 178px;
  height: 40px;
  color: white;
  border: none;
  background-color: #3b81ec;
}
.incline{
  width: 178px;
  height: 40px;
  color: white;
  border: none;
  background-color: #3c3c3c;
}
.absoluteHeight{
  width: 114px;
  height: 40px;
  color: white;
  border: none;
  background-color: #3b81ec;
}
.relativeFlyHeight{
  width: 114px;
  height: 40px;
  color: white;
  border: none;
  background-color: #3c3c3c;
}
.model{
  margin-bottom: 10px;
}
.climbLocus{
  width:75%;
  height: 75%;
}
.climbParent{
  display:flex;
  flex-direction: column;
}
.climbChild{
  display:flex;
  margin-top: 10px;
}
.addSub{
  display: flex;
  flex-direction: column;
}
.numberChange{
  margin-bottom: 4px;
  background-color: #3c3c3c;
  border:none;
  width: 61px;
  margin-left: 12px;
}
.climbChange{
  color: #4a8ae9;
  font-weight: bolder;
  margin-bottom: 4px;
  margin-left: 10px;
  font-size: 23px;
  line-height: 30px;
}
.asButton{
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.symbol{
  font-size: 20px;
  width: 30px;
  height: 30px;
}
.climbChange:hover{
  text-decoration: underline;
}
.climbInput{
  width: 61px;
  margin-bottom: 4px;
  margin-left: 12px;
  line-height: 30px;
}
.cancelSet{
  color: #4a8ae9;
  display: flex;
  align-items: center;
}
.el-check-tag.is-checked {
  background-color: #3b81ec;
}
.el-collapse-item__content{
  display: flex;
  flex-direction: column;
}
.primarySet{
  display: flex;
  flex-direction: column;
}
.optionType{
  height: 160px;
  width: 380px;
  padding: 0;
}
.optionImg{
  height: 160px;
  width: 380px;
}
.optionImg:hover{
  opacity: 0.6;
}
</style>
