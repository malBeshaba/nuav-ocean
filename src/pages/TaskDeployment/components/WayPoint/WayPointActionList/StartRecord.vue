<template>
  <div class="record-component">
    <div class="row">
      动作：开始录像
      <div class="DeleteIcon" @click="deleteItem"></div>
    </div>
    <!--    //写在这里是暂时有Bug调不了参数-->

  </div>
</template>

<script>
export default {
  data() {
    return {
      DroneYawNum:0,
      duration: "",
      ActionName:"startRecordParam",
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
        useGlobalPayloadLensIndex:1
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
          useGlobalPayloadLensIndex:1
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

</style>