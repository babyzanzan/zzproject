<template>
    <div>
      <el-card>
        <div id="mychart" :style="{height:height,width:width}"></div>
      </el-card>
      <el-card>
        <div id="mychart2" :style="{height:height,width:width}"></div>
      </el-card>
      <el-card>
        <div id="datachart" :style="{height:height,width:width}"></div>
      </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import { getProductsInfo } from '@/api/table' 
export default {
  name: 'DIYtable',
  data() {
    return {
      height:'300px',
      width:'800px',
      option:{
        series: [
          {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
            splitNumber: 12,
            itemStyle: {
              color: '#FFAB91'
            },
            progress: {
              show: true,
              width: 30
            },
            pointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                width: 30
              }
            },
            axisTick: {
              distance: -45,
              splitNumber: 5,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            splitLine: {
              distance: -52,
              length: 14,
              lineStyle: {
                width: 3,
                color: '#999'
              }
            },
            axisLabel: {
              distance: -20,
              color: '#999',
              fontSize: 20
            },
            anchor: {
              show: false
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              width: '60%',
              lineHeight: 40,
              borderRadius: 8,
              offsetCenter: [0, '-15%'],
              fontSize: 60,
              fontWeight: 'bolder',
              formatter: '{value} °C',
              color: 'inherit'
            },
            data: [
              {
                value: 20
              }
            ]
          },
          {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
            itemStyle: {
              color: '#FD7347'
            },
            progress: {
              show: true,
              width: 8
            },
            pointer: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            detail: {
              show: false
            },
            data: [
              {
                value: 20
              }
            ]
          }
        ]
      }
    }
  },
  methods:{
    showEchart(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('mychart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
    },
    showEchart2(){
      let mychart2 = echarts.init(document.getElementById('mychart2'))
      setInterval(function () {
        const random = +(Math.random() * 60).toFixed(2)
        mychart2.setOption({
          series: [
            {
              data: [
                {
                  value: random
                }
              ]
            },
            {
              data: [
                {
                  value: random
                }
              ]
            }
          ]
        })
      }, 2000)
      this.option && mychart2.setOption(this.option)
    },
    async showDataEchart(){
      let dataList = []
      let dataValueList = []
      await getProductsInfo({page:2,size:6,name:'',relatedId:''})
      .then((res)=>{
        res.data.data.forEach(element => {
          dataList.push(element.name)
        })
        res.data.data.forEach(element => {
          dataValueList.push(element.rPrice)
        })
      })
      let datachart = echarts.init(document.getElementById('datachart'))
      let option = {
        title: {
          text: '数据绑定折线图'
        },
        xAxis: {
          type: 'category',
          data: dataList
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: dataValueList,
            type: 'line'
          }
        ]
      }
      option && datachart.setOption(option)
    }
  },
  mounted() {
    this.showEchart()
    this.showEchart2()
    this.showDataEchart()
  },
}
</script>