<template>
  <div class="wayline-list">
    <div class="WayLineListTitle">
      <div class="ChooseWayLine">{{ ChooseWayLine }}</div>
      <div class="NewWayLineBtn">
        <el-button type="warning" size="small" @click="importWayline()">
          <el-icon>
            <Plus/>
          </el-icon>
          导入航线
        </el-button>
      </div>
      <img class="CloseWayLineListPanel" @click="closeAddWayline()"
           referrerpolicy="no-referrer"
           src="https://lanhu.oss-cn-beijing.aliyuncs.com/ps0b8ui68rncgyhgp968dphjsl93bde9me5600e6a-3554-45d5-82c7-022fee77d3c6">
    </div>
    <hr class="solid-line">
    <div class="SearchBox">
      <input class="InputBox" type="text" placeholder="请输入航线名称">
      <img class="SearchIcon"
           referrerpolicy="no-referrer"
           src="https://lanhu.oss-cn-beijing.aliyuncs.com/psolv5o89x7hh14gxdngiqkvt8r76rk6so5f48becd-c29a-45c4-8f70-50f90ad28f3a"
      >
      <div class="import-btu">
        <el-button type="primary" @click="deleteJxWayline()" plain>删除</el-button>
      </div>
    </div>
    <div class="WaylineList" @click="handleClick">
      <div class="WayLineListItem" v-for="(item, index) in listItems" :key="index"
           :class="{ 'selected': SelectedList[index].isSelected }" @click="ItemClick(item)">
        <div class="WaylineInfo">
          <div class="InfoCellOne">
            <div class="orange-dot"></div>
            <div class="WayLineName">{{ item.name }}</div>
          </div>
          <div class="InfoCellTwo">相对高度
            <div class="DeviceInfo">{{ item.altitude }} m</div>
          </div>
          <div class="InfoCellTwo">飞行速度
            <div class="DeviceInfo">{{ item.speed }} m/s</div>
          </div>
          <div class="InfoCellTwo">飞行距离
            <div class="DeviceInfo">756m</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, reactive, onBeforeUnmount} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {Plus} from '@element-plus/icons-vue'
import {useMyStore} from "@/store"
import {RemoveEntitiesByBatch} from "@/components/mapTools/BaseMapTools";
import {removeStrategyConfig, getStrategyConfigPagingList} from "@/api/jiexiang/jxDronePlan";
import {CheckWayLine} from './DrawJxWayline'

const route = useRoute();
const router = useRouter();
const store = useMyStore();
const SelectedList = reactive([]);
const ChooseWayLine = ref("选择航线");
let listItems = ref([]);
const siteId = ref();
const selectItem = ref({} as any)

onMounted(() => {
  siteId.value = route.query.siteId;
  getStrategyConfigPagingList({current: 1, pageSize: 50, siteId: siteId.value}).then(res => {
    listItems.value = res.data.list
    listItems.value.forEach((item: any) => {
      SelectedList.push({
        waylineName: item.name,
        isSelected: false
      })
    })
  });
});

onBeforeUnmount(() => {
  RemoveEntitiesByBatch(window.cesiumViewer, 'checkWayLine')
})

function ItemClick(clickedItem: { name: any; id: string; altitude: number }) {
  SelectedList.forEach((item: { isSelected: any; waylineName: any }) => {
    item.isSelected = (item.waylineName === clickedItem.name);
    selectItem.value = {strategyId: clickedItem.id, waylineName: clickedItem.name}
  });
  CheckWayLine(window.cesiumViewer, clickedItem.id, clickedItem.altitude,'checkWayLine','checkWayLinePoint')
}

function importWayline() {
  router.push({
    path: '/default/task/jx-create/import-wayline',
    query: {
      siteId: siteId.value
    },
  })
}

// 选中航线
let isShow = false
const handleClick = (event: { target: { closest: (arg0: string) => any; }; }) => {
  const listItem = event.target.closest('.WayLineListItem')
  if (listItem) {
    const index = [...listItem.parentNode.children].indexOf(listItem)
    listItem.classList.toggle('isWayLineItem')
    store.state.selectJxWayline = listItems.value[index]
  }
}

function deleteJxWayline() {
  console.log(selectItem.value)
  ElMessageBox.confirm('是否删除航线?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    RemoveEntitiesByBatch(window.cesiumViewer, 'checkWayLine')
    removeStrategyConfig({id: selectItem.value.strategyId}).then(res => {
      if (res.errorCode === '00000') {
        ElMessage.success('删除成功')
        getStrategyConfigPagingList({current: 1, pageSize: 50, siteId: siteId.value}).then(res => {
          listItems.value = res.data.list
          SelectedList.splice(0, SelectedList.length);
          listItems.value.forEach((item: any) => {
            SelectedList.push({
              waylineName: item.name,
              isSelected: false
            })
          })
        });
      }
    })
  })
}

// 返回
const closeAddWayline = () => {
  router.push({
    path: '/default/task/jx-create',
    query: {
      siteId: siteId.value
    },
  })
};

</script>

<style scoped lang="scss">
//这里是去除边框滚动条的地方，别删了好吧
::-webkit-scrollbar {
  width: 0 !important;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}

.wayline-list {
  border-left: 1px solid #F9A100;;
  box-shadow: 8px 0px 4px 0px rgba(255, 120, 0, 1);
  background-color: rgba(10, 11, 14, 0.85);
  width: 100%;
  height: 100%;
  overflow: scroll;
}

.WayLineListTitle {
  display: flex;
  width: 360px;
  height: 16px;
  padding-top: 6px;
  font-size: 16px;
  text-align: left;
  line-height: 16px;
  margin-top: 22px;
  margin-left: 16px;
  margin-bottom: 15px;
}

.ChooseWayLine {
  margin-left: 10px;
  width: 70px;
  height: 17px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
}

.NewWayLineBtn {
  justify-content: center;
  align-items: center;
  margin-left: 147px;
  display: flex;
  width: 85px;
  height: 20px;
  border-radius: 4px;
}

.CloseWayLineListPanel {
  height: 15px;
  padding-left: 30px;
  width: 15px;
}

.solid-line {
  border: none;
  border-top: 1px solid #F9A100;
}

.SearchBox {
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 1);
  border-radius: 4px;
  width: 386px;
  height: 32px;
  margin: 15px 0 0 5px;
}

.InputBox {
  width: 90%;
  border-radius: 4px;
  padding-left: 10px;
  background: black;
  color: white;
  border: 0;

}

.SearchIcon {
  width: 5%;
  height: 16px;
  margin-top: 9px;
  margin-right: 8px;
}

.import-btu {
  font-size: 12px;
  height: 100%;
  color: #f9a100;
}

.WaylineList {
  margin-top: 10px;
}

.WayLineListItem {
  display: flex;
  margin-bottom: 10px;
  opacity: 0.7;
  margin-left: 10px;
  align-items: center;
  width: 95%;
  height: 125px;
  border-radius: 4px;
  cursor: pointer;
  background: black;
}

.WaylineInfo {
  height: 100%;
  width: 93%;

  display: flex;
  flex-direction: column;
}

.TheDeleteIcon {
  background-image: url("../../../../assets/TaskDeployment/DeleteIcon.png");
  width: 12px;
  height: 12px;
  background-size: cover;
}

.DeleteIcon {
  width: 7%;
  height: 100%;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  background: #996300;
}

.orange-dot {
  width: 5px;
  height: 5px;
  background: #f9a100;
  border-radius: 50%;
  margin-left: 12px;
}

.WayLineName {
  margin-left: 9px;
}

.InfoCellOne {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 8px;
  height: 25%;
  width: 100%;

}

.InfoCellTwo {
  display: flex;
  margin-left: 13px;
  margin-top: 4px;
  font-size: 12px;
  height: 18%;
  width: 100%;
  color: #f9a100;
}

.DeviceInfo {
  color: white;
  margin-left: 38px;
}

.WayLineListItem.selected {
  border: 1px dashed #f9a100; /* 设置加粗虚线边框样式 */
}
</style>
