<!-- 鸿云大屏看板 -->
<template>
    <div class="bigScreenContain" ref="appRef" v-loading="fullscreenLoading">
        
        <!-- 头部         -->
        <el-row :gutter="20" >
            <el-col :span="8">
                <div class="timeInterval">
                    {{ todayDate }}
                </div>
            </el-col>
            <el-col :span="8">
                <div class="titleTop">
                    数字化智能生产看板
                </div>
            </el-col>
        </el-row>
        
        <!-- 内容（分栏） -->
        <el-row :gutter="20">
            <el-col :span="19">
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <!-- 左边1-1 成品入库 -->
                            <div class="product-in">
                                <dv-border-box-13 ref="productIn">
                                    <div class="product-in-title">
                                        <i class="el-icon-s-home"></i>
                                        成品入库
                                    </div>
                                    <el-row :gutter="20" style="margin-top: 10px;">
                                        <el-col :span="10">
                                            <div class="product-in-card">
                                                <dv-border-box-10 class="dv-border-box-7-padding">                                 
                                                    <el-statistic title="今日" :value-style="{color:'lightgreen'}"  group-separator=",">
                                                        <template slot="formatter">
                                                            {{ inData.today | formatType('Thousand') }}
                                                        </template>
                                                    </el-statistic>
                                                </dv-border-box-10>
                                            </div>
                                        </el-col>
                                        <el-col :span="10">
                                            <div class="product-in-card" >
                                                <dv-border-box-10 class="dv-border-box-7-padding">                                                
                                                    <el-statistic title="本周" :value-style="{color:'lightgreen'}">
                                                        <template slot="formatter">
                                                            {{ inData.thisWeek | formatType('Thousand') }}
                                                        </template>
                                                    </el-statistic>
                                                </dv-border-box-10>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20">
                                        <el-col :span="10">
                                            <div class="product-in-card">
                                                <dv-border-box-10  class="dv-border-box-7-padding">                                                
                                                    <el-statistic title="本月" :value-style="{color:'lightgreen'}">
                                                        <template slot="formatter">
                                                            {{ inData.thisMonth | formatType('Thousand') }}
                                                        </template>
                                                    </el-statistic>
                                                </dv-border-box-10>
                                            </div>
                                        </el-col>
                                        <el-col :span="10">
                                            <div class="product-in-card">
                                                <dv-border-box-10 class="dv-border-box-7-padding">                                                
                                                    <el-statistic title="本年" :value-style="{color:'lightgreen'}">
                                                        <template slot="formatter">
                                                            {{ inData.thisYear | formatType('Thousand') }}
                                                        </template>
                                                    </el-statistic>
                                                </dv-border-box-10>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </dv-border-box-13>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="topMain">
                                <dv-border-box-11 title="成品7日出库详情" ref="out7">
                                    <div id="out7Info" class="out7Info">
                                    </div>
                                </dv-border-box-11>
                            </div>
                        </el-col>
                    </el-row>

                    <el-row :gutter="10">
                        <el-col :span="8">
                            <!-- 左2-1 今日工序入库详情 -->
                            <div class="in-info">
                                <dv-border-box-13 ref="inInfo">
                                    <div class="product-in-title">
                                        <i class="el-icon-s-order"></i>
                                        今日入库详情
                                    </div>
                                    <div id="todayInInfo" class="todayInInfo">
                                    </div>
                                </dv-border-box-13>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="mediaMain" >
                                <dv-border-box-11 title="工序7日入库详情" ref="in7">
                                    <div id="in7Info" class="in7Info">
                                    </div>
                                </dv-border-box-11>
                            </div>
                        </el-col>
                    </el-row>

                    <el-row :gutter="10">
                        <el-col :span="24">
                            <div>
                                <dv-border-box-12 style="padding-bottom: 10px"  ref="report">
                                    <div class="product-in-title">
                                        <i class="el-icon-s-claim"></i>
                                        生产报工详情
                                    </div>
                                    <div class="reportInfo">
                                        <dv-scroll-board :config="productionReportInfoConfig" :style="{width:windowWidth/980*732+'px',height:'290px',display: 'inline-block'}" />
                                    </div>
                                </dv-border-box-12>
                            </div>
                        </el-col>
                    </el-row>

                </div>
            </el-col>

            <el-col :span="5" style="margin-top: 30px;">
                <dv-border-box-12 style="padding-bottom: 10px;" ref="order">
                    <div class="product-in-title">
                        <i class="el-icon-s-data"></i>
                        订单进度详情
                    </div>
                    <div class="orderProcess" >
                        <dv-scroll-board :config="orderProgressInfoConfig" class="orderProcessTable"/>
                    </div>
                </dv-border-box-12>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import { getSumData,getTodayIn,get7out,get7in,getProductReport,getOrderProcess } from '@/api/hy'
import { mapGetters } from 'vuex'
export default {
  name: 'bigScreen',
  data() {
    return {
        todayDate: '',
        fullscreenLoading:true,//全屏加载数据动画
        windowWidth: '',//获取屏幕宽度
        myChartTodayIn:'',//今日入库实例
        myChartOut7:'',//7日出库实例
        myChartIn7:'',//7日入库实例
        dataLoadSuccessNum:0, //数据加载完成数量
        inData:{//入库数量
            today:1000,
            thisWeek:30000,
            thisMonth:500000,
            thisYear:60000000
        },
        productionReportInfoConfig:{
            header: ['订单号','报工工序','报工数量','报工时间','报工人员'],
            data: [
                ['行1列1', '行1列2', '行1列3','行1列4','行1列5'],
                ['行2列1', '行2列2', '行2列3','行2列4','行2列5'],
                ['行3列1', '行3列2', '行3列3','行3列4','行3列5'],
                ['行4列1', '行4列2', '行4列3','行4列4','行4列5'],
                ['行5列1', '行5列2', '行5列3','行5列4','行5列5'],
                ['行6列1', '行6列2', '行6列3','行6列4','行6列5'],
                ['行7列1', '行7列2', '行7列3','行7列4','行7列5'],
                ['行8列1', '行8列2', '行8列3','行8列4','行8列5'],
                ['行9列1', '行9列2', '行9列3','行9列4','行9列5'],
                ['行10列1', '行10列2', '行10列3','行10列4','行10列5']
            ],
            index: true,
            columnWidth: [40],
            align: ['center']
        },
        orderProgressInfoConfig:{
            header: ['订单号','交货日期','当前状态'],
            data: [
                ['行1列1', '行1列2', '行1列3'],
                ['行2列1', '行2列2', '行2列3'],
                ['行3列1', '行3列2', '行3列3'],
                ['行4列1', '行4列2', '行4列3'],
                ['行5列1', '行5列2', '行5列3'],
                ['行6列1', '行6列2', '行6列3'],
                ['行7列1', '行7列2', '行7列3'],
                ['行8列1', '行8列2', '行8列3'],
                ['行9列1', '行9列2', '行9列3'],
                ['行10列1', '行10列2', '行10列3']
            ],
            index: true,
            columnWidth: [50],
            align: ['center'],
            rowNum: 9
        }
    }
  },
  mounted(){
    this.myChartIn7 = echarts.init(document.getElementById('in7Info'))
    this.myChartOut7 = echarts.init(document.getElementById('out7Info'))
    this.myChartTodayIn = echarts.init(document.getElementById('todayInInfo'))
    //this.getDataInfo()//先把数据获取到

    //静态展示
    this.showEchartTodayIn()
    this.showEchartOut7()
    this.showEchartIn7()

    window.addEventListener('resize',this.handleResize)
    this.todayDate = this.getDate() 
    setInterval(() =>{
      this.todayDate =  this.getDate() 
    }, 1000)
    this.windowWidth = this.$refs.appRef.clientWidth //初始化窗口大小

    //暂时的显示效果
    setTimeout(()=>{
        this.fullscreenLoading = false
    },2000)

  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed:{
    ...mapGetters([
      'sidebar'
    ]),
    siderBarActive(){
        return this.sidebar.opened
    }
  },
  watch:{
    siderBarActive(newVal, oldVal){
        if(newVal!==oldVal){//收缩 扩展 siderbar状态发生了变化 进行位置的重调
            this.handleResize() //进行echart 和 datav 位置重调
        }
    },
    dataLoadSuccessNum(newVal,oldVal){//监听数据加载成功数量（总共需要调用6个接口）
        if(newVal===6){//全部加载完成，全屏加载动画变为false
            this.fullscreenLoading=false
        }
    }
  },
  methods:{
    handleResize() {//监听并重置echart位置
        setTimeout(() =>{
            //echart位置重调
            this.myChartIn7.resize()
            this.myChartOut7.resize()
            this.myChartTodayIn.resize()
            //datav位置重调
            this.$refs.report.initWH()
            this.$refs.order.initWH()
            this.$refs.productIn.initWH()
            this.$refs.inInfo.initWH()
            this.$refs.in7.initWH()
            this.$refs.out7.initWH()

            this.windowWidth = this.$refs.appRef.clientWidth//对滚动表进行位置重调
        },200) 
    },
    getDataInfo(){ //获取数据信息，进行显示
        getSumData() // 获取成品入库信息
        .then((res)=>{
            this.inData = res.data
            this.dataLoadSuccessNum++
        })
        .catch((error)=>{
            console.log(error)
            this.fullscreenLoading = false
        })


        getTodayIn() // 获取今日入库详情
        .then((res)=>{
            this.showEchartTodayIn(res.data)
            this.dataLoadSuccessNum++
        })
        .catch((error)=>{
            console.log(error)
            this.fullscreenLoading = false
        })


        get7out() // 获取7日出库详情
        .then((res)=>{
            this.showEchartOut7(res.data)
            this.dataLoadSuccessNum++
        })
        .catch((error)=>{
            console.log(error)
            this.fullscreenLoading = false
        })

        
        get7in()  //  获取7日入库详情
        .then((res)=>{
            this.showEchartIn7(res.data)
            this.dataLoadSuccessNum++
        })
        .catch((error)=>{
            console.log(error)
            this.fullscreenLoading = false
        })


        getProductReport() // 获取生产报工详情
        .then((res)=>{
            this.productionReportInfoConfig = res.data //可能需要对数据进行处理
            this.dataLoadSuccessNum++
        })
        .catch((error)=>{
            console.log(error)
            this.fullscreenLoading = false
        })


        getOrderProcess() // 获取生产报工详情
        .then((res)=>{
            this.orderProgressInfoConfig.data = res.data //可能需要对数据进行处理
            this.dataLoadSuccessNum++
        })
        .catch((error)=>{
            console.log(error)
            this.fullscreenLoading = false
        })
    }, 
    getDate(){//获取当前时间
      let date = new Date()
      const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      let Y = date.getFullYear(),
          M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
          D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()),
          h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()),
          m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()),
          s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
      let weekDay = weekDays[date.getDay()]
      return Y + '年' + M + '月' + D + '日 ' + h + ':' + m + ':' + s + '  ' + weekDay
    },
    showEchartTodayIn(data){
      // 绘制今日入库图表
      this.myChartTodayIn.setOption({
        grid:{
            left:'17%'
        },
        xAxis: {
            splitLine:{
                show:true
            },
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLabel:{//修改坐标系字体颜色
		        show:true,
                color:"#8DB6DB"
	        },
        },
        yAxis: {
            type: 'value',
            splitLine:{
                show:true
            },
            axisLabel:{//修改坐标系字体颜色
		        show:true,
                color:"#8DB6DB"
	        },
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }
        ]
      })
    },
    showEchartOut7(data){//绘制7天出库图表
        const posList = [
            'left',
            'right',
            'top',
            'bottom',
            'inside',
            'insideTop',
            'insideLeft',
            'insideRight',
            'insideBottom',
            'insideTopLeft',
            'insideTopRight',
            'insideBottomLeft',
            'insideBottomRight'
        ];
        app.configParameters = {
            rotate: {
                min: -90,
                max: 90
            },
        align: {
            options: {
                left: 'left',
                center: 'center',
                right: 'right'
            }
        },
        verticalAlign: {
            options: {
                top: 'top',
                middle: 'middle',
                bottom: 'bottom'
            }
        },
        position: {
            options: posList.reduce(function (map, pos) {
                map[pos] = pos;
                return map;
            }, {})
        },
        distance: {
            min: 0,
            max: 100
        }
    }
    app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15,
        onChange: function () {
            const labelOption = {
                rotate: app.config.rotate,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                position: app.config.position,
                distance: app.config.distance
            };
            this.myChartOut7.setOption({
                series: [
                    {
                        label: labelOption
                    },
                    {
                        label: labelOption
                    },
                    {
                        label: labelOption
                    },
                    {
                        label: labelOption
                    }
                ]
            });
        }
    };
    const labelOption = {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        formatter: '{c}  {name|{a}}',
        fontSize: 16,
        color:'white',
        rich: {
            name: {}
        }
    };
    this.myChartOut7.setOption({
        grid:{
            bottom:'20%',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['Forest', 'Steppe', 'Desert', 'Wetland'],
            bottom: '3%',
            textStyle:{
                fontSize: 14,//字体大小
                color: 'white'//字体颜色
            },
        },
        xAxis: [
            {
                type: 'category',
                axisTick: { show: false },
                data: ['2012', '2013', '2014', '2015', '2016'],
                axisLabel:{//修改坐标系字体颜色
		            show:true,
                    color:"white"
	            },
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel:{//修改坐标系字体颜色
		        show:true,
                color:"white"
	            },
            },   
        ],
        series: [
            {
                name: 'Forest',
                type: 'bar',
                barGap: 0,
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: [320, 332, 301, 334, 390]
                
            },
            {
                name: 'Steppe',
                type: 'bar',
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                textStyle: {
                        color: '#8DB6DB', // 标签字体颜色
                        fontSize: 14, // 标签字体大小
                    },
                data: [220, 182, 191, 234, 290]
            },
            {
                name: 'Desert',
                type: 'bar',
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: [150, 232, 201, 154, 190]
            },
            {
                name: 'Wetland',
                type: 'bar',
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: [98, 77, 101, 99, 40]
            }
        ]
        });
    },
    showEchartIn7(data){//绘制七日入库图表
        const posList = [
            'left',
            'right',
            'top',
            'bottom',
            'inside',
            'insideTop',
            'insideLeft',
            'insideRight',
            'insideBottom',
            'insideTopLeft',
            'insideTopRight',
            'insideBottomLeft',
            'insideBottomRight'
        ];
        app.configParameters = {
            rotate: {
                min: -90,
                max: 90
            },
        align: {
            options: {
                left: 'left',
                center: 'center',
                right: 'right'
            }
        },
        verticalAlign: {
            options: {
                top: 'top',
                middle: 'middle',
                bottom: 'bottom'
            }
        },
        position: {
            options: posList.reduce(function (map, pos) {
                map[pos] = pos;
                return map;
            }, {})
        },
        distance: {
            min: 0,
            max: 100
        }
    }
    app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15,
        onChange: function () {
            const labelOption = {
                rotate: app.config.rotate,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                position: app.config.position,
                distance: app.config.distance
            };
            this.myChartIn7.setOption({
                series: [
                    {
                        label: labelOption
                    },
                    {
                        label: labelOption
                    },
                    {
                        label: labelOption
                    },
                    {
                        label: labelOption
                    }
                ]
            });
        }
    };
    const labelOption = {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        formatter: '{c}  {name|{a}}',
        fontSize: 16,
        color:'white',
        rich: {
            name: {}
        }
    };
    this.myChartIn7.setOption({
        grid:{
            bottom:'20%',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['Forest', 'Steppe', 'Desert', 'Wetland'],
            bottom: '3%',
            textStyle:{
                fontSize: 14,//字体大小
                color: 'white'//字体颜色
            },
        },
        xAxis: [
            {
                type: 'category',
                axisTick: { show: false },
                data: ['2012', '2013', '2014', '2015', '2016'],
                axisLabel:{//修改坐标系字体颜色
		            show:true,
                    color:"white"
	            },
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel:{//修改坐标系字体颜色
		        show:true,
                color:"white"
	            },
            },   
        ],
        series: [
            {
                name: 'Forest',
                type: 'bar',
                barGap: 0,
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: [320, 332, 301, 334, 390]
                
            },
            {
                name: 'Steppe',
                type: 'bar',
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                textStyle: {
                        color: '#8DB6DB', // 标签字体颜色
                        fontSize: 14, // 标签字体大小
                    },
                data: [220, 182, 191, 234, 290]
            },
            {
                name: 'Desert',
                type: 'bar',
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: [150, 232, 201, 154, 190]
            },
            {
                name: 'Wetland',
                type: 'bar',
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: [98, 77, 101, 99, 40]
            }
        ]
        });
    }
  },
  filters: {
    formatType(value,formatType){//对内容进行格式化
      if(formatType==='Thousand'){   // 千分位逗号
        let billionValue = value/1000000 
        if(billionValue>1){//如果数量多于100W则将数据后面百万的零头抹掉，加上百万
            return parseFloat(billionValue).toFixed(0).replace(/\d(?=(?:\d{3})+\b)/g, `$&,`)+'百万'
        }else{
            return parseFloat(value).toFixed(0).replace(/\d(?=(?:\d{3})+\b)/g, `$&,`)
        }
      }
    }
  },
}
</script>
<style scoped>
.bigScreenContain{
    color: white;
    background-image: url('../../assets/hybg.png');
    background-size: cover;
}
.timeInterval{
    margin-top: 30px;
    margin-left: 40px;
    font-size:18px;
}
.titleTop{
    display: flex;
    justify-content: center;
    margin-top: 10px;
    font-size: 33px;
}
.product-in{
    margin-top: 50px;
    width: 100%;
    height: 250px;
}
.product-in dv-border-box-13{
    width: 100%;
    height: 200px;
}
.product-in-title {
    font-size: 18px;
}
.product-in-title i{
    margin-left: 18px;
    margin-top: 24px;
}
.product-in-card{
    width: 100%;
    height: 63px;
    margin-left: 18%;
    margin-top: 20px;
    border-radius: 10px;
    display: flex;
    justify-content:center;
    align-items:Center;
}
.product-in-card dv-border-box-7{
    width: 100%;
    height: 100%;
    
}
.dv-border-box-7-padding{
    padding-top: 10px;
    display: inline-block;
}
.in-info{
    width: 100%;
    height: 250px;
}
.in-info dv-border-box-13{
    width: 100%;
    height: 250px;
}
.todayInInfo{
    height: 230px;
}
.topMain{
    width: 100%;
    height: 300px;
    margin-top: 10px;
}
.out7Info{
    height: 300px;
}
.mediaMain{
    width: 100%;
    height: 250px;   
}
.in7Info{
    height: 250px;
}
.reportInfo{
    text-align: center;
    padding-left: 10px;
    margin-top: 15px;
    height:300px;
    width: 100%;
}
.reportInfoTable{
    height:290px;
    margin-left: 10px;
    margin-right: 10px;
}
.orderProcess{
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 15px;
    height:830px;
    width: 100%;
}
.orderProcessTable{
    height:820px;
    display: inline-block;
    margin-right: 5px;
    width: calc(100% - 25px);
}
</style>
<style>
.el-statistic .head{
    color: white;
}
</style>