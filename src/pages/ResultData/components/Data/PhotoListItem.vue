<template>
  <div :class="isSelected ? 'photo-card__selected' : 'photo-card'" @click="selectPhoto">
    <el-image class="image" :src="photoUrl"/>
    <div class="info">
      <div>{{ Props.fileInfo.file_name }}</div>
      <div class="bottom">
        <time class="time">{{ Props.fileInfo.create_time }}</time>
        <el-button class="button" @click.stop="showViewer">查看</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import loadingFailImg from "@/assets/Resource/loadingFailImg.png"
import loadingImg from "@/assets/Resource/loadingImg.png"
import { useMyStore } from "@/store"
import { MediaFile } from "@/store/types/file";
import testIMG from "@/assets/images/photo.jpg"
const store = useMyStore()

// 获取设备名
const Props = defineProps<{
	fileInfo: MediaFile,
  isProcessing: boolean,
  isAllSelected: boolean,
  selectedPhotos: string[]
}>()

const photoUrl = ref('' as any)
const srcList = ref([] as string[])
onMounted(() => {
  // 处理预览图片
  photoUrl.value = loadingImg
  if (Props.fileInfo.preview_url) {
    loadImageAsync(`${Props.fileInfo.preview_url}?&g=Center&w=300&h=300`).then(res => {
      photoUrl.value = res  //赋值新的 url 
    }).catch(err => {
      photoUrl.value = loadingFailImg
      console.log('图片加载出错', err)
    })
  }
  else {
    photoUrl.value = loadingFailImg
  }
  // 判断是否选中
  const index = Props.selectedPhotos.indexOf(Props.fileInfo.file_id)
  if (index !== -1) {
    isSelected.value = true
  }
});

// 打开预览
const emit = defineEmits(["showImgViewer", "selectPhoto"]);
const showViewer = () => {
  emit("showImgViewer", Props.fileInfo.file_id);
};

// 异步加载图片
const loadImageAsync = (url: string) => {
  return new Promise(function(resolve, reject) {
    const image = new Image();
    image.src = url;
    image.onload = function() {
      // resolve(image);  // 返回 img 对象
      resolve(url);  // 也可返回 url 地址
    };
    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };
  });
}

// 监听处理状态的变化
watch(() => Props.isProcessing, (newData, oldData) => {
  if (!newData) {
    isSelected.value = false
  }
})

// 监听是否选择/取消全选
watch(() => Props.isAllSelected, (newData, oldData) => {
  if (newData) {
    if (!isSelected.value) {
      isSelected.value = true
    }
  } else {
    if (isSelected.value) {
      isSelected.value = false
    } 
  }
})

// 监听是否单选
const isSelected = ref(false as boolean)
const selectPhoto = () => {
  if (Props.isProcessing) {
    isSelected.value = !isSelected.value
    // emit("selectPhoto", {state: isSelected.value, file_id: Props.fileInfo.file_id});
  }
}
watch(() => isSelected.value, (newData, oldData) => {
  emit("selectPhoto", {state: newData, file_id: Props.fileInfo.file_id});
})
</script>

<style scoped lang="scss">
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}

.photo-item {
  width: 100%;
  height: 100%;
}

.photo-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: $UsualBorder;
}

.photo-card__selected {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid $TouchColor;
  -webkit-transform: rotate(0deg);
}
.photo-card__selected::before{
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  border: 12px solid $TouchColor;
  border-right-color: transparent;
  border-bottom-color: transparent;
  z-index: 3;
}
.photo-card__selected::after{
  content: "";
  display: block;
  width: 5px;
  height: 10px;
  position: absolute;
  top: 2px;
  left: 4px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-left-color: transparent;
  transform: rotate(45deg);
  cursor: pointer;
  z-index: 4;
}

.image {
  width: 100%;
  flex: 9;
}

.info {
  width: 100%;
  flex: 2;
  padding: 10px;
  padding-bottom: 0px;
  font-size: $ContentFontSize;
  font-family: $ContentFontFamily;
  font-weight: $ContentFontWeight;
  color: $ContentColor;
}

.time {
  font-size: $InforFontSize;
  font-family: $InforFontFamily;
  font-weight: $InforFontWeight;
  color: $UsualColor;
}

.bottom {
  padding-top: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  min-height: auto;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 14px;
  font-size: $ContentFontSize;
  border: 1px solid $ComponentBackground;
  height: 28px;
  &:hover {
    background: $TouchColorBackground;
    color: $TouchColor;
    border: 1px solid $TouchColor;
  }
  &:active {
    background: $TouchColorBackground;
    color: $TouchColor;
    border: 1px solid $TouchColor;
  }
  &:focus {
    background: $TouchColorBackground;
    color: $TouchColor;
    border: 1px solid $TouchColor;
  }
}

</style>
