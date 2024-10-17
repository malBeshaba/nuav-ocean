<template>
  <div class="annual">
    <list-head title="年度任务分布" style="width: 100%"></list-head>
    <div id="annual-task" class="annual-task" style="margin-top: 20px"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import {onMounted} from "vue";
import ListHead from "@/components/Head/ListHead.vue";
import {distributeAnnualTasksStatistic} from "@/api/data-statistics/taskStatistic";

type EChartsOption = echarts.EChartsOption;
const atData: number[][] = []
interface atType {
  plan_task_type: number,
  month: number,
  task_count: number
}
onMounted(() => {

  distributeAnnualTasksStatistic(2023).then(res => {
    res.data.forEach((arr: atType[]) => {
      const tempArr:number[] = []
      arr.forEach((item: atType) => {
        tempArr.push(item.task_count)
      })
      atData.push(tempArr)
    })
    // console.log(atData[0])
    initEcharts()
  })
})
function initEcharts() {
  let chartDom = document.getElementById('annual-task')!;
  let myChart = echarts.init(chartDom, {renderer: 'canvas'}, {width:585, height: 230});
  let option: EChartsOption;
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
      }
    },
    legend: {
      textStyle: {
        fontSize: 12,
        color: '#B5C5D4'
      },
      itemWidth: 10,
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
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      type: 'value'
    },
    barWidth: 14,
    series: [
      {
        name: '图像采集',
        type: 'bar',
        stack: 'total',

        emphasis: {
          focus: 'series'
        },
        data: atData[0],//        data: [320, 302, 301, 334, 390, 330, 320, 302, 301, 334, 390, 330, 320],

      },
      {
        name: '倾斜摄影',
        type: 'bar',
        stack: 'total',

        emphasis: {
          focus: 'series'
        },
        data:  atData[1], //        data: [120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '视频录制',
        type: 'bar',
        stack: 'total',

        emphasis: {
          focus: 'series'
        },
        data:  atData[2], //        data: [220, 182, 191, 234, 290, 330, 310, 182, 191, 234, 290, 330, 310]
      },
      {
        name: '巡查任务',
        type: 'bar',
        stack: 'total',

        emphasis: {
          focus: 'series'
        },
        data:  atData[3], //        data: [150, 212, 201, 154, 190, 330, 410, 212, 201, 154, 190, 330, 410]
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
.annual-task {
  /*width: 30%;*/
  /*height: 287px;*/
}
</style>
