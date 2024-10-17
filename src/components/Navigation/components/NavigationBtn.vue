<template>
  <div class="NavbarBtn" :class="{ 'right-btn': props.position === 'right', 'left-btn': props.position !== 'right' ,selected:props.selected }">
    <div class="panel">
      <img :src="props.selected ? navbarBtn_active:navbarBtn " />
    </div>
    <div class="label">{{ props.title }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import navbarBtn_active from '@/assets/images/navbarBtn-active.png'
import navbarBtn from '@/assets/images/navbarBtn.png'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'left'
  },
  selected: {
    type: Boolean,
    default: false
  }
})


</script>

<style scoped lang="scss">
.NavbarBtn {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  max-width: 10vw;
  height: 40px;
  color: #fff;
  font-size: 16px;
  &:hover {
    cursor: pointer;
    color: #06e9f9;
  }
  &.selected {
    color: #06e9f9;
  }
  .panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    //z-index: -1;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &.right-btn .panel {
    transform: rotateY(180deg); /* 水平镜像翻转 */
  }
  .label{
    position: relative;
    z-index: 1; /* 确保文字在图片上层 */
  }
}
</style>