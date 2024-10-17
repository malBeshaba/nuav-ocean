<template>
  <div class="annual">
    <list-head title="年度数据采集分布" style="width: 100%;"></list-head>
    <div id="chart" class="chart" style="margin-top: 20px"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import {onMounted} from "vue";
import ListHead from "@/components/Head/ListHead.vue";
import {collectAnnualTaskDataStatistic} from "@/api/data-statistics/taskStatistic";

type EChartsOption = echarts.EChartsOption;
const adData: number[][] = []
interface adType {
  data_type: number,
  month: number,
  data_count: number
}
onMounted(() => {
  // initEcharts()
  collectAnnualTaskDataStatistic(2023).then(res => {
    res.data.forEach((arr: adType[]) => {
      const tempArr:number[] = []
      arr.forEach((item: adType) => {
        tempArr.push(item.data_count)
      })
      adData.push(tempArr)
    })
    console.log(adData)
    initEcharts()
  })
})
function initEcharts() {
  let chartDom = document.getElementById('chart')!;
  let myChart = echarts.init(chartDom, {renderer: 'canvas'}, {width:535, height: 230});
  let option: EChartsOption;
  option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      textStyle: {
        fontSize: 12,
        color: '#B5C5D4'
      },
      itemWidth: 20,
      itemHeight: 6
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '倾斜摄影',
        type: 'line',
        stack: 'Total',
        data:  adData[0], //[120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90, 230, 210],
        itemStyle: {
          color: '#F2597F'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(213,72,120,0.8)'
            },
            {
              offset: 1,
              color: 'rgba(213,72,120,0.3)'
            }
          ])
        },
      },
      {
        name: '航拍影像',
        type: 'line',
        stack: 'Total',
        data: adData[1],//[820, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330, 1320],
        itemStyle: {
          color: '#0770FF'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(58,77,233,0.8)'
            },
            {
              offset: 1,
              color: 'rgba(58,77,233,0.3)'
            }
          ])
        },
      }
    ]
  };
  option && myChart.setOption(option);

}

</script>

<style scoped lang="scss">
.annual {
  background-color: $ComponentBackground;
  width: 100%;
  height: 100%;
}
</style>
