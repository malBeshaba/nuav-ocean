<template>
  <br>
  <div class="record-component">
    <div class="row">
      动作：云台偏航角
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

<script>

export default {
  data() {
    return {
      DroneYawNum:0,
      duration: "",

      ActionName:"gimbalRotateParam",
    };

  },
  //在组件初始化和参数发生改变的时候将值回传
  mounted() {
    const CombinedData = {
      ActionName: this.ActionName,
      ActionParam:{
        //参数的多少是根据接口文档中编写的，有部分参数的设置的默认值，这是因为前端需要简洁没有流出太多的可供用户选择的参数
        //因为在前面定义出现传值未定义的问题，懒得改了直接写在下面
        payloadPositionIndex:1,
        gimbalYawRotateEnable:1,
        gimbalYawRotateAngle:0,
        gimbalRotateTimeEnable:0
      }
    };
    this.$emit('HandleReturnValues',this.fatherMsg,CombinedData);
  },
  watch: {
    DroneYawNum(newVal) {
      const CombinedData = {
        ActionName: this.ActionName,
        ActionParam:{
          //参数的多少是根据接口文档中编写的，有部分参数的设置的默认值，这是因为前端需要简洁没有流出太多的可供用户选择的参数
          //因为在前面定义出现传值未定义的问题，懒得改了直接写在下面
          payloadPositionIndex:1,
          gimbalYawRotateEnable:1,
          gimbalYawRotateAngle:newVal,
          gimbalRotateTimeEnable:0
        }
      };
      this.$emit('HandleReturnValues',this.fatherMsg,CombinedData);
    },
  },
  props: ['fatherMsg'],
  methods: {
    deleteItem() {
      this.$emit('deleteItem', this.fatherMsg); // 触发自定义事件，并传递要删除的项的id
    },
  }
};
</script>

<style>
.record-component {
  font-family: Arial, sans-serif;
  border-top: 1px solid white;
  margin-left: 15px;
  margin-bottom: 20px;
  margin-top: 0px;
}

.row {
  color: white;
  display:flex ;
  margin-bottom: 10px;
  width: 320px;
  margin-top: 15px;
}

.DeleteIcon{
  width: 24px;
  height: 24px;
  margin-left: 152px;
  background-image: url("../../../../../assets/TaskDeployment/DeleteIcon.png");
  background-size: cover;
}
.DroneYawNum{
  width: 234px;
  margin-right: 10px;
}
.DroneYawNumInput{
  width: 120px;
}
</style>