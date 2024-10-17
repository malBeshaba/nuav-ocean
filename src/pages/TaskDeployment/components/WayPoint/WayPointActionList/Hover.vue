<template>
  <br>
  <div class="record-component">
    <div class="row">
      动作：悬停
      <div class="DeleteIcon" @click="deleteItem"></div>
    </div>
    <!--    //写在这里是暂时有Bug调不了参数-->
    <el-row :gutter="17">
      <el-col :span="3"><el-button size="medium" @click="setDroneYawNum(5)" >5s</el-button></el-col>
      <el-col :span="3"><el-button size="medium" @click="setDroneYawNum(10)">10s</el-button></el-col>
      <el-col :span="9"><el-input-number class="HoverNumInput" size="medium" v-model="DroneYawNum"></el-input-number></el-col>
      <el-col :span="3"><el-button size="medium" class="WaitTime15" @click="setDroneYawNum(15)">15s</el-button></el-col>
      <el-col :span="3"><el-button size="medium" class="WaitTime20" @click="setDroneYawNum(20)">20s</el-button></el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  data() {
    return {
      DroneYawNum:0,
      duration: "",

      ActionName:"hoverParam",
    };

  },
  //在组件初始化和参数发生改变的时候将值回传
  mounted() {
    const CombinedData = {
      ActionName: this.ActionName,
      ActionParam:{
        //参数的多少是根据接口文档中编写的，有部分参数的设置的默认值，这是因为前端需要简洁没有流出太多的可供用户选择的参数
        //因为在前面定义出现传值未定义的问题，懒得改了直接写在下面
        hoverTime:0
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
          hoverTime:newVal
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
    setDroneYawNum(num){
      this.DroneYawNum=num;
    }
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

.HoverNumInput{
  margin-left: 9px;
  width: 140px;
}
.WaitTime15{
  margin-left: 1px;
}
.WaitTime20{
  margin-left: 9px;
}
</style>