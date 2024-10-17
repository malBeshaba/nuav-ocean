<template>
  <div class="show_and_hide_3d_tileset">
    <el-select v-model="value" placeholder="选择要加载的3D模型">
      <el-option
          v-for="item in ModelList"
          :key="item.dataId"
          :label="item.dataName"
          :value="item.dataId"
          :tileSetURL="item.outerDataUrl"
          @click="ItemClick(item)"
      >
<!--        <el-checkbox      :key="item.dataId"-->
<!--                          :label="item.dataName"-->
<!--                          :value="item.dataId"-->
<!--                          :tileSetURL="item.outerDataUrl"-->
<!--                          @change="checkboxOnclick($event,item)"-->
<!--        >-->
<!--        </el-checkbox>-->
      </el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as Cesium from 'cesium'
import {getModelDataList, getResponseUrlData} from '@/api/modelData'
import { ModelData } from '@/store/types/modelData'
import { TilesetData } from '@/components/mapTools/class/Map3DtilesetClass'
import {NULL} from "sass";
import store from "@/store";
import bus from "@/utils/bus";
import {Checktileset} from "@/pages/ResultData/components/Data/DataListCheckDataList";


onMounted(() => {
	getModelData()
})
const ModelList = ref<ModelData[]>([])

const getModelData = () => {
	getModelDataList({
		pageNo: 1,
		pageSize: 100,
	}).then((res) => {
		ModelList.value = res.data.list
    //console.log(ModelList.value)
	})
}

const value = ref('')
let showdataId = ref('')
let select_data_item = {} as any;
const SelectedList=ref([]);
function ItemClick(clickedItem: { dataName: any; dataId: string }) {
  select_data_item = clickedItem
  console.log('????')
  bus.emit('clickResultModelItem', clickedItem.dataId)
  SelectedList.value.forEach((item: { isSelected: any; dataName: any }) => {
    item.isSelected = (item.dataName === clickedItem.dataName);
  });
  showdataId.value = clickedItem.dataId
  Checktileset(window.cesiumViewer, clickedItem,false)
}
let tileset = ref<{id: string, tilesetData: TilesetData, isShow: boolean}[]>([])
async function checkboxOnclick(value: boolean, tilesetData: any) {
  let isExist = false
  //console.log("--------------------------------------tileset:",tileset)
  tileset.value.forEach((item:any) => {
    if (item.id === tilesetData.dataId) {
      isExist = true
      if (value && !item.isShow) {
        item.tilesetData.show(value)
        item.isShow = value
      } else {
        item.tilesetData.show(value)
        item.isShow = value
      }
    }
  })
  if (!isExist) {
    if (tilesetData.innerDataPath) {
      const check = await getResponseUrlData(tilesetData.innerDataPath);
      if (check) {
        let addTilesetData = new TilesetData({
          id: tilesetData.dataId,
          tilesetUrl: tilesetData.innerDataPath,
          show: value,
          mapViewer: window.cesiumViewer,
        })
        console.log("内外网均正常----------------------------------------------", addTilesetData.tilesetUrl)
        tileset.value.push({
          id: tilesetData.dataId,
          tilesetData: addTilesetData,
          isShow: value,
        })
      } else{
        let addTilesetData = new TilesetData({
          id: tilesetData.dataId,
          tilesetUrl: tilesetData.outerDataUrl,
          show: value,
          mapViewer: window.cesiumViewer,
        })
        console.log("内网错误----------------------------------------------", addTilesetData.tilesetUrl)
        tileset.value.push({
          id: tilesetData.dataId,
          tilesetData: addTilesetData,
          isShow: value,
        })
      }
    }
    else {
        let addTilesetData = new TilesetData({
        id: tilesetData.dataId,
        tilesetUrl: tilesetData.outerDataUrl,
        show: value,
        mapViewer: window.cesiumViewer,
      })
      console.log("没有内网————————————————————————————————————————————————————")
      tileset.value.push({
        id: tilesetData.dataId,
        tilesetData: addTilesetData,
        isShow: value,
      })
    }
      // let addTilesetData = new TilesetData({
      //   id: tilesetData.dataId,
      //   tilesetUrl: tilesetData.outerDataUrl,
      //   show: value,
      //   mapViewer: window.cesiumViewer,
      // })
      // tileset.value.push({
      //   id: tilesetData.dataId,
      //   tilesetData: addTilesetData,
      //   isShow: value,
      // })
  }
}

</script>

<style scoped>
.show_and_hide_3d_tileset {
  width: 180px;
  height: 150px;
  line-height: 50px;
}
:deep(.el-input) {
  --el-input-bg-color: #333;
  --el-input-text-color: #ccc;
}
</style>
