<template>
  <div class="panel">
    <div class="top-section">
      <div class="BtnTrunLeft" @click="decrement"></div>
      <div v-if="selectedPoint.number === null" class="CountOfWaypointAction">航点</div>
      <div v-else class="CountOfWaypointAction">航点  {{ selectedPoint.number + 1 }}</div> <!-- 数字使用Vue的数据绑定进行动态更新 -->
      <div class="BtnTrunRight" @click="increment"></div>
      <div class="NewWayPointActionList" @click="toggleDropdown"></div>
      <div class="WayPointActionList" v-show="showDropdown">
        <ul>
          <li v-for="item in items"
              :key="item.id"
              @click="showItemComponent(item)"
              @mouseover="setHoveredItem(item)"
              @mouseout="clearHoveredItem"
              :class="{ 'hovered': item === hoveredItem }">
            {{ item.text }}
          </li>
        </ul>
      </div>
    </div>

    <br>
    <div class="bottom-section">
      <div class="ActionListTitle">已添加的航点动作：</div>
      <div class="content">
        <component v-for="component in displayedComponents"
                   :key="component.id"
                   :is="component.componentName"
                   :fatherMsg="component. ComponentIndex"
                   @deleteItem="deleteItem"
                   @HandleReturnValues="HandleReturnValues"
        />
      </div>
    </div>
<!--	  <init-aerial-view-map class="init_aerial_view_map"></init-aerial-view-map>-->
  </div>
</template>

<script>

import StartRecord from "./WayPointActionList/StartRecord.vue";
import StopRecord from "./WayPointActionList/StopRecord.vue";
import DroneYaw from "./WayPointActionList/DroneYaw.vue";
import GimbalPitch from "./WayPointActionList/GimbalPitch.vue";
import GimbalYaw from "./WayPointActionList/GimbalYaw.vue";
import Hover from "./WayPointActionList/Hover.vue";
import NewFolder from "./WayPointActionList/NewFolder.vue";
import InitAerialViewMap from '@/pages/Map/components/AerialView/InitAerialViewMap.vue'
import StartEqualIntervalTakePhoto from "./WayPointActionList/StartEqualIntervalTakePhoto.vue";
import StartEqualDistanceIntervalTakePhoto from "./WayPointActionList/StartEqualDistanceIntervalTakePhoto.vue";
import Zoom from "./WayPointActionList/Zoom.vue";
import TakePhoto from "./WayPointActionList/TakePhoto.vue";
import StopEqualIntervalTakePhoto from "./WayPointActionList/StopEqualIntervalTakePhoto.vue";
import store from '@/store'

export default {
  name: "AddWayPointActionPanel",
  components: {
	  InitAerialViewMap,
    StopRecord,
    StartRecord,
    StartEqualIntervalTakePhoto,
    StartEqualDistanceIntervalTakePhoto,
    StopEqualIntervalTakePhoto,
    DroneYaw,
    GimbalYaw,
    GimbalPitch,
    Hover,
    NewFolder,
    Zoom,
    TakePhoto
  },
  data() {
    return {
      CurrentNum:0,
      //下面这个StoreWayLineActionList存储着所有的待回传的该航线的动作
      StoreWayLineActionList:{},
      //其中的数据结构大致为下：
      // [
      //     这是航点一{
      //   航点一的第一个动作：{
      //   动作的名字：
      //   动作的参数：{...}
      //   }
      // },
      //     这是航点二{..},
      //     这是航点三{..},
      //     这是航点四{..},
      //     ]
      WayLineActionList:{},
      hoveredItem: null,
	    selectedPoint: {
				number: null,
		    pointId: 'activate',
		    pointX: 0,
	    },
	    historyWayLine: [],
      number: 0 ,// 初始数字值为0
      showDropdown: false, // 控制下拉框显示/隐藏的标志
      items: [ // 下拉框的选项列表,componentName:''
        { id: 1, text: '开始录像' ,componentName:'StartRecord'},
        { id: 2, text: '停止录像' ,componentName:'StopRecord'},
        { id: 3, text: '开始等时间间隔拍照' ,componentName:'StartEqualIntervalTakePhoto'},
        { id: 4, text: '开始等距间隔拍照' ,componentName:'StartEqualDistanceIntervalTakePhoto'},
        { id: 5, text: '结束间隔拍照' ,componentName:'StopEqualIntervalTakePhoto'},
        { id: 6, text: '悬停' ,componentName:'Hover'},
        { id: 7, text: '飞行器偏航角' ,componentName:'DroneYaw'},
        { id: 8, text: '云台偏航角' ,componentName:'GimbalYaw'},
        { id: 9, text: '云台俯仰角' ,componentName:'GimbalPitch'},
        { id: 10, text: '拍照' ,componentName:'TakePhoto'},
        { id: 11, text: '相机变焦' ,componentName:'Zoom'},
        { id: 12, text: '创建文件夹' ,componentName:'NewFolder'},
        // 其他选项...
      ],
      displayedComponents:[]
    };
  },
	watch: {
		'$store.state.wayLinePointsDrawingActive'(newVal, oldVal) {
			this.selectedPoint.pointId = newVal.pointId
			store.state.wayLinePointsDrawing.forEach((item, index) => {
				const drawingPoint = item.pointX.toFixed(12)
				const activePoint = newVal.pointX.toFixed(12)
				if (drawingPoint === activePoint) {
          //##########
          this.clearlist(index,this.selectedPoint.number)
					this.selectedPoint.number = index
				}
			})
		},
		'$store.state.wayLinePointsDrawing': {
			handler(newVal, oldVal) {
        this.clearlist()
				if(newVal.length === 1) {
					// 第一个点，直接赋值
					this.selectedPoint.pointId = newVal[0].pointId
					this.selectedPoint.pointX = newVal[0].pointX
					this.selectedPoint.number = 0
					const nextPoint = {
						pointId: store.state.wayLinePointsDrawingActive.pointId,
						pointX: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointX,
						pointY: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointY,
						pointZ: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointZ,
					}
					store.commit('SET_WAY_LINE_POINT_DRAWING_ACTIVE', nextPoint)
				} else {
					// 之后的点，判断是否有插入点
					let flag = false
					let flagIndex = 0
					store.state.wayLinePointsDrawing.forEach((item, index) => {
						if (item.addManner === 'before' || item.addManner === 'after' || item.addManner === 'move') {
							flag = true
							flagIndex = index
						}
					})
					if (!flag) {
						// 没有插入点
						this.selectedPoint.pointId = newVal[newVal.length - 1].pointId
						this.selectedPoint.pointX = newVal[newVal.length - 1].pointX
						this.selectedPoint.number = newVal.length - 1
            //##########
            this.clearlist(newVal.length - 1,newVal.length - 2)
						const nextPoint = {
							pointId: store.state.wayLinePointsDrawingActive.pointId,
							pointX: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointX,
							pointY: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointY,
							pointZ: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointZ,
						}
						store.commit('SET_WAY_LINE_POINT_DRAWING_ACTIVE', nextPoint)
						this.historyWayLine = JSON.parse(JSON.stringify(newVal))
					} else {
						// 有插入点,
						let flag = new Array(newVal.length).fill(false)
						newVal.forEach((item, index) => {
							const drawingPoint = item.pointX.toFixed(12)
							this.historyWayLine.forEach((item) => {
								const activePoint = item.pointX.toFixed(12)
								if (drawingPoint === activePoint) {
									flag[index] = true
								}
							})
						})
						flag.forEach((item, index) => {
							if (!item) {
								this.selectedPoint.pointId = newVal[index].pointId
								this.selectedPoint.pointX = newVal[index].pointX
								this.selectedPoint.number = index
                this.clearlistforInsert(index)
							}
						})
						const nextPoint = {
							pointId: store.state.wayLinePointsDrawingActive.pointId,
							pointX: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointX,
							pointY: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointY,
							pointZ: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointZ,
						}
						store.commit('SET_WAY_LINE_POINT_DRAWING_ACTIVE', nextPoint)
						this.historyWayLine = JSON.parse(JSON.stringify(newVal))
					}
				}
			},
			deep: true,
		},
	},
  methods: {
    //切换航点，可能涉及到不同的组件之间的传值，所以需要在切换之前进行一些处理
    clearlist(newindex,oldindex){
      //需要将面板中的组件先存储到列表中，
      this.WayLineActionList[oldindex] = this.displayedComponents;
      //然后查询跳转的航点的index是否已经在列表中存在
      //如果存在则拷贝进面板中
      //不存在则将该点的置空然后再将面板置空
      if (!this.WayLineActionList.hasOwnProperty(newindex)) {
        this.WayLineActionList[newindex] = [];
      }
      this.displayedComponents=this.WayLineActionList[newindex];
    },
    //上面的清除list函数针对于顺序插入航点
    //下面的函数针对于在某点前面插入一个点，也就是在中间插入，所以不仅需要清除面板中的组价消息
    //还需要将列表中后续的所有组件顺序往后一位
    clearlistforInsert(oldindex){
      console.log(oldindex)
      const temlength=store.state.wayLinePointsDrawing.length
      if(store.state.wayLinePointsDrawing[oldindex].addManner==="before"){
        console.log("执行前插入动作")
        //需要将面板中的组件先存储到列表中，
        this.WayLineActionList[oldindex] = this.displayedComponents;
        //对于插入点之后的每一个航点的动作存储的列表需要顺序往后一位
        //所以就是顺序遍历顺序往后一位
        for (let i = temlength-2; i >= oldindex; i--) {
          if (!this.WayLineActionList.hasOwnProperty(i)) {
            this.WayLineActionList[i] = [];
          }
          this.WayLineActionList[i + 1] = this.WayLineActionList[i];
        }
        this.WayLineActionList[oldindex]=[]
        this.displayedComponents=this.WayLineActionList[oldindex];
      }else{
        //需要将面板中的组件先存储到列表中，
        this.WayLineActionList[oldindex-1] = this.displayedComponents;
        //对于插入点之后的每一个航点的动作存储的列表需要顺序往后一位
        //所以就是顺序遍历顺序往后一位
        for (let i = temlength-1; i >= oldindex; i--) {
          if (!this.WayLineActionList.hasOwnProperty(i)) {
            this.WayLineActionList[i] = [];
          }
          this.WayLineActionList[i + 1] = this.WayLineActionList[i];
        }
        this.WayLineActionList[oldindex]=[]
        this.displayedComponents=this.WayLineActionList[oldindex];
      }
    },
    //这里是往左切换航点
    increment() {
				this.WayLineActionList[this.selectedPoint.number] = this.displayedComponents;
	      this.selectedPoint.number++; // 点击右按钮增加数字
	      // 如果数字大于数组长度，数字归零,目的设置航点动作组在列表循环
	      if (this.selectedPoint.number > store.state.wayLinePointsDrawing.length - 1) {
	        this.selectedPoint.number = 0;
	      }
	      if (!this.WayLineActionList.hasOwnProperty(this.selectedPoint.number)) {
	        this.WayLineActionList[this.selectedPoint.number] = [];
	      }
				// 移动当前设置航点动作组到下一个航点
				const nextPoint = {
					pointId: store.state.wayLinePointsDrawingActive.pointId,
					pointX: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointX,
					pointY: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointY,
					pointZ: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointZ,
				}
				store.commit('SET_WAY_LINE_POINT_DRAWING_ACTIVE', nextPoint)
	      this.displayedComponents = this.WayLineActionList[this.selectedPoint.number];
    },
    //这里是往右切换航点
    decrement() {

      this.WayLineActionList[this.selectedPoint.number] = this.displayedComponents;
      this.selectedPoint.number--; // 点击左按钮减少数字
	    // 如果数字小于0，数字等于数组长度，目的设置航点动作组在列表循环
	    if(this.selectedPoint.number < 0) {
		    this.selectedPoint.number = store.state.wayLinePointsDrawing.length - 1;
	    }
      if (!this.WayLineActionList.hasOwnProperty(this.selectedPoint.number)) {
        this.WayLineActionList[this.selectedPoint.number] = [];
      }
			// 移动当前设置航点动作组到上一个航点
			const nextPoint = {
				pointId: store.state.wayLinePointsDrawingActive.pointId,
				pointX: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointX,
				pointY: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointY,
				pointZ: store.state.wayLinePointsDrawing[this.selectedPoint.number].pointZ,
			}
			store.commit('SET_WAY_LINE_POINT_DRAWING_ACTIVE', nextPoint)
      this.displayedComponents = this.WayLineActionList[this.selectedPoint.number];
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    setHoveredItem(item) {
      this.hoveredItem = item;
    },
    clearHoveredItem() {
      this.hoveredItem = null;
    },
    showItemComponent(item) {
      //为每一个航点动作设置参数，直接将航点动作内部的参数绑定到这里
      switch (item.componentName) {
        case 'StartRecord':
          this.displayedComponents.push({ id: item.id, componentName: item.componentName, ComponentIndex: this.displayedComponents.length });
          // 执行StartRecord的逻辑
          break;
        case 'StopRecord':
          this.displayedComponents.push({ id: item.id, componentName: item.componentName, ComponentIndex: this.displayedComponents.length });
          // 执行StopRecord的逻辑
          break;
        case 'StartEqualIntervalTakePhoto':
          this.displayedComponents.push({ id: item.id, componentName: item.componentName, ComponentIndex: this.displayedComponents.length });
          // 执行StartEqualIntervalTakePhoto的逻辑
          break;
        case 'StartEqualDistanceIntervalTakePhoto':
          this.displayedComponents.push({ id: item.id, componentName: item.componentName, ComponentIndex: this.displayedComponents.length });
          // 执行StartEqualDistanceIntervalTakePhoto的逻辑
          break;
        case 'StopEqualIntervalTakePhoto':
          this.displayedComponents.push({ id: item.id, componentName: item.componentName, ComponentIndex: this.displayedComponents.length });
          // 执行StopEqualIntervalTakePhoto的逻辑
          break;
        case 'Hover':
          this.displayedComponents.push({ id: item.id, componentName: item.componentName, ComponentIndex: this.displayedComponents.length });
          // 执行Hover的逻辑
          break;
        case 'DroneYaw':
          this.displayedComponents.push({ id: item.id, componentName: item.componentName, ComponentIndex: this.displayedComponents.length });
          // 执行DroneYaw的逻辑
          break;
        case 'GimbalYaw':
          this.displayedComponents.push({ id: item.id, componentName: item.componentName, ComponentIndex: this.displayedComponents.length });
          // 执行GimbalYaw的逻辑
          break;
        case 'GimbalPitch':
          this.displayedComponents.push({ id: item.id, componentName: item.componentName, ComponentIndex: this.displayedComponents.length });
          // 执行GimbalPitch的逻辑
          break;
        case 'TakePhoto':
          this.displayedComponents.push({ id: item.id, componentName: item.componentName, ComponentIndex: this.displayedComponents.length });
          // 执行TakePhoto的逻辑
          break;
        case 'Zoom':
          this.displayedComponents.push({ id: item.id, componentName: item.componentName, ComponentIndex: this.displayedComponents.length });
          // 执行Zoom的逻辑
          break;
        case 'NewFolder':
          this.displayedComponents.push({ id: item.id, componentName: item.componentName, ComponentIndex: this.displayedComponents.length });
          // 执行NewFolder的逻辑
          break;
        default:
          // 处理其他选项的逻辑
          break;
      }

      this.showDropdown = !this.showDropdown;
    },

    deleteItem(itemId) {
      if (itemId !== -1) {
        this.displayedComponents[itemId]={}
        // this.displayedComponents.splice(itemId, 1);不要用
      //  由于删除项之后列表会重建索引，导致空位之后的项往前移动，所以，需要将移动之后的所以传回子控件
      //   这里不可用this.displayedComponents=this.MyDelete(this.displayedComponents)，会导致错误，就是要有键无值
        this.HandleReturnValues(itemId,{})
        this.StoreWayLineActionList[this.selectedPoint.number]=this.MyDelete(this.StoreWayLineActionList[this.selectedPoint.number])
         }
    },
    //清除对象中值为{}的键值对
    MyDelete(obj) {
      const filteredObj = { ...obj }; // 创建副本以保持原始数据不变
      for (const key in filteredObj) {
        if (Object.prototype.hasOwnProperty.call(filteredObj, key)) {
          const value = filteredObj[key];
          if (typeof value === 'object' && Object.keys(value).length === 0) {
            delete filteredObj[key];
          }
        }
      }
      return filteredObj;
    },
    //将子组件传回的参数存储起来
    //暂时留下一个问题，需要在所有航点创建之后再新建航点动作
    HandleReturnValues(index, CombinedData) {
      //首先打印回传的参数
      //检查该航点是否已经存在（可能该值为空则会导致函数遗产）
      if (this.selectedPoint.number === null) {
        return; // 结束函数
      }
      //检查该航点是否已经存在在记录中
      if (!this.StoreWayLineActionList[this.selectedPoint.number]) {
        //如果不在则新建
        this.StoreWayLineActionList[this.selectedPoint.number] = {};
      }
      //如果已经存在了直接使用新值覆盖旧值即可
      //这里需要注意：按理来说在列表中删除动作的时候索引的变化会导致整个航线组重新排序
      //如果没有按照预期则检查这里
      this.StoreWayLineActionList[this.selectedPoint.number]['count'+index] = CombinedData;
      // console.log(this.StoreWayLineActionList)
      let temArray=[]
      let keys = Object.keys(this.StoreWayLineActionList);
      keys.forEach(key => {
        temArray.push({index:key,param:this.StoreWayLineActionList[key]})
      });
      //前面的是将子控件的值传回这里，下面的操作是将存储的值回传给vuex，存储在state中
      store.commit("SET_BEFORE_PROCESS_WAYLINE_ACTION",temArray)
      console.log(store.state.beforeprocesswaylineaction)
    }
  }
}
</script>

<style scoped lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  box-shadow: 8px 0px 4px 0px rgba(255, 120, 0, 1);
  background-color: $ComponentBackground;
  position: fixed;
  width: $RightWidth;
  top: 15px;
  margin-top: 165px;
  height: calc(100% - 200px);
  left: 20%;
  margin-left: 1092px;
  z-index:999
  /* 其他样式设置 */
}

.BtnTrunLeft{
  width: 20px;
  height: 20px;
  background-image: url("../../../../assets/TaskDeployment/return.png");
  background-size: cover;
  margin-right: 10px;
  margin-top: 5px;
  margin-left:140px ;
}
.BtnTrunRight{

  width: 20px;
  height: 20px;
  background-image: url("../../../../assets/TaskDeployment/TurnRight.png");
  background-size: cover;
  margin-left: 10px;
  margin-top: 5px;
}
.CountOfWaypointAction{

  justify-content: center;
  align-items: center;
  width: 50px;
  color: white;
  margin-top: 5px;
}
.top-section {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  /* 上方部分的样式设置 */
  align-content: center;
  border-bottom: 1px solid $LightColor;
}
.NewWayPointActionList{
  margin-left:80px ;
  background-image: url("../../../../assets/TaskDeployment/New.png");
  background-size: cover;
  width: 20px;
  height: 20px;
  margin-top: 5px;
}
.bottom-section {

}
.WayPointActionList{
  position: absolute;
  top:49px;
  left: 205px;
  width: 190px;
  background-color: #fff;
  border: 1px solid #ccc;
  /* 其他样式设置 */
  background-color: $ComponentBackground;
  color: white;
  z-index: 10;
}
.WayPointActionList li{
  cursor: pointer;
  margin-bottom: 10px;
}
.WayPointActionList li.hovered {
  background-color: #ae7202; /* 设置悬浮时的背景颜色 */
}

.ActionListTitle{
  width: 60px;
  height: 15px;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 20px;
  text-align: left;
  white-space: nowrap;
  line-height: 20px;
  margin: 8px 0 0 18px;
  margin-bottom: 25px;
}
.init_aerial_view_map {
	width: 380px;
	height: 280px;
	position: absolute;
	margin-left: 10px;
	bottom: 5px;
	border: 2px solid #ae7202;
	border-radius: 5px;
	/*z-index: 1;*/
}

</style>
