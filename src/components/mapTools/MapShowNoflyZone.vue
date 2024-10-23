<template>
    <div class="MapShowNoflyZone">
        <el-popover placement="right" :width="400" trigger="click">
      <template #reference>
    
        <el-button style="margin-right: 16px">禁飞区</el-button>
      </template>
      <el-switch v-model="showProhibitArea" />显示禁飞区
    </el-popover>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import * as Cesium from 'cesium'
import {RemoveEntitiesByBatch} from './BaseMapTools'

const showProhibitArea = ref(false)

const prohibitAreaData = [{"color":"#DE4329","height":0,"level":2,"lat":23.08318541434155,"lng":113.07129735201424,"radius":18420,"polygon_points":[[[113.070356649,23.2488403528],[113.147673237,23.2332258631],[113.113534828,23.1533822024],[113.139299279,23.1305358862],[113.146505702,23.1153182022],[113.147271451,23.0828664555],[113.134566604,23.03839783],[113.124527778,23.024608368],[113.110955121,23.013678895],[113.077610801,23.0031638998],[113.072184225,22.9175274746],[112.995017712,22.9331402055],[113.029077843,23.0129744018],[113.003309251,23.0357952431],[112.996085591,23.0510042957],[112.995277059,23.0834736179],[113.002118134,23.1121739587],[113.017929849,23.1417000399],[113.031496451,23.1526494344],[113.064925683,23.1632077308],[113.070356649,23.2488403528]]],"shape":1},{"color":"#979797","height":120,"level":2,"lat":23.08317371042492,"lng":113.07133350190679,"radius":23834,"polygon_points":[[[113.021104436,23.29249196],[113.21233639,23.2538831108],[113.121265284,22.8738110625],[112.930573206,22.912419912],[113.021104436,23.29249196]]],"shape":1}]

watch(showProhibitArea,(val)=>{
    if (val) {
        let num:number = 0
        prohibitAreaData.forEach(pointInfo => {
            let points:number[] = []
            pointInfo["polygon_points"][0].forEach(pointArr=>{
                points.push(pointArr[0])
                points.push(pointArr[1])
            })
            window.cesiumViewer.entities.add({  
            id:"prohibitArea"+String(num++),
            polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(points),
            height: 0,
            material: Cesium.Color.fromCssColorString(pointInfo["color"]).withAlpha(0.5),
            outline:true,
            outlineColor: Cesium.Color.fromCssColorString(pointInfo["color"]),
            outlineWidth: 2
            },
        });
        });
        // console.log(window.cesiumViewer.entities);
        
    }else{
        RemoveEntitiesByBatch(window.cesiumViewer,"prohibitArea")
    }

})

</script>

<style scoped lang="scss">
.MapShowNoflyZone {
  width: 40px;
  height: 30px;
  line-height: 30px;
}
</style>