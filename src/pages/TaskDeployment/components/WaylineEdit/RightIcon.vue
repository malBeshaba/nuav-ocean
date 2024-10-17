<script setup lang="ts">
import icon1 from '@assets/map/icon/icon1.png'
import icon2 from '@assets/map/icon/icon2.png'
import icon3 from '@assets/map/icon/icon3.png'
import icon4 from '@assets/map/icon/icon4.png'
import icon5 from '@assets/map/icon/icon5.png'
import icon6 from '@assets/map/icon/icon6.png'
import icon7 from '@assets/map/icon/icon7.png'
import icon8 from '@assets/map/icon/icon8.png'
import icon9 from '@assets/map/icon/icon9.png'
import icon10 from '@assets/map/icon/icon10.png'
import icon11 from '@assets/map/icon/icon11.png'
import icon12 from '@assets/map/icon/icon12.png'
const icons = [
  {
    'label': '开始录像',
    'src': icon1
  },
  {
    'label': '停止录像',
    'src': icon2
  },
  {
    'label': '开始等时间隔拍照',
    'src': icon3
  },
  {
    'label': '开始等距间隔拍照',
    'src': icon4
  },
  {
    'label': '结束间隔拍照',
    'src': icon5
  },
  {
    'label': '悬停',
    'src': icon6
  },
  {
    'label': '飞行器偏航角',
    'src': icon7
  },
  {
    'label': '云台偏航角',
    'src': icon8
  },
  {
    'label': '云台俯仰角',
    'src': icon9
  },
  {
    'label': '拍照',
    'src': icon10
  },
  {
    'label': '相机变焦',
    'src': icon11
  },
  {
    'label': '创建文件夹',
    'src': icon12
  },
]
</script>

<template>
  <div class="box"

  >
    <div
        v-for="item in icons"
        :key="item.label"
        class="element"
    >
      <span>{{item.label}}</span>&nbsp;
      <img :src="item.src" alt="">
    </div>
  </div>
</template>

<style scoped>
.box {
  display: flex;
  flex-direction: column;
}
.element{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;
}
span{
  font-size: 12px;
}
img {
  width:30px;
  height:30px;
}
</style>
