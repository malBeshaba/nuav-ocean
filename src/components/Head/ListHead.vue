<template>
  <div class="list-head" >
    <div class="list-photo" >
      <span class="title-left">{{ Props.title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const Props = defineProps<{
  title: string
}>()
</script>

<style scoped lang="scss">

// .list-head {
//   box-sizing: border-box;
//   margin-top: 5px;
//   padding-left: 14px;
//   background-color: black;
//   position: relative;
//   background-image: url("@/assets/images/head-back.png");
//   background-repeat:no-repeat;
//   background-size: 100% 100%;
//   height: 27px;
// }
// .title-left {
//   padding: 12px;
//   font-family: $FirstLevelTitleFontFamily;
//   font-size: $FirstLevelTitleFontSize;
//   font-weight: $FirstLevelTitleFontWeight;
//   color: $FirstLevelTitleColor;
// }

.list-head {
  box-sizing: border-box;
  padding-top: 12px;
  padding-left: 14px;
  width: 100%;
  height: 42px;
  background-color: transparent;
  // background-color: black;
}
.list-photo {
  width: 100%;
  height: 100%;
  background-image: url("@/assets/images/head-back.png");
  background-repeat:no-repeat;
  background-size: 100% 100%;
}
.title-left {
  padding-left: 12px;
  font-family: $FirstLevelTitleFontFamily;
  font-size: $FirstLevelTitleFontSize;
  font-weight: $FirstLevelTitleFontWeight;
  color: $FirstLevelTitleColor;
}
</style>
