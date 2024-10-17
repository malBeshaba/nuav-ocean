<template>
  <div :class="Props.selected?'tab-selector': '_tab-selector'">
    <el-image class="icon" :src="Props.src" v-show="Props.selected" style="width: 22px; height: 22px;"></el-image>
    <el-image class="icon" :src="Props.ssr" v-show="!Props.selected" style="width: 22px; height: 22px;"></el-image>
    <span class="name">{{Props.name}}</span>
  </div>
</template>

<script setup lang="ts">
const Props = defineProps<{
  src: string,
  ssr: string,
  name: string,
  selected: boolean
}>()
</script>

<style scoped lang="scss">
.tab-selector {
  display: flex;
  height: 44px;
  width: 138px;
  border: 1px solid $TouchColor;
  background: linear-gradient(90deg, $TouchColor 0%, rgba(249,161,0,0) 100%);
  text-align: center;
  align-items: center;
  cursor: pointer;
}
._tab-selector {
  display: flex;
  height: 44px;
  width: 138px;
  text-align: center;
  align-items: center;
  cursor: pointer;
}
.icon {
  margin-left: 15px;
  /*display: inline-block;*/
}
.name {
  text-align: center;
  line-height: 44px;
  margin-left: 13px;
  font-family: $FirstLevelTitleFontFamily;
  font-size: $FirstLevelTitleFontSize;
  font-weight: $FirstLevelTitleFontWeight;
  color: $FirstLevelTitleColor;
}

</style>
