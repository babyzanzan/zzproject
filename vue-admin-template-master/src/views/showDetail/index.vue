<!-- 显示信息页面 -->
<template>
    <div style="padding: 20px 30px 20px 10px;">
        <el-page-header @back="goBack" title="返回" content="详情页面" style="margin-bottom: 20px;">
        </el-page-header>
        <el-card class="box-card" v-for="(form, index) in dynamicValidateForm" shadow="hover">
            <div slot="header" class="clearfix">
                <span>详情信息</span>
            </div>
            <el-form label-width="180px" class="demo-dynamic" :selfUpdate="true">
                <el-form-item
                    v-for="(item,paramIndex) in getInterfaceParamObject"
                    :label="item"
                    :key="paramIndex"
                    style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                    <el-row>
                        <el-col :span="16">
                            <el-input :disabled="true" v-if="getItemInfo(dynamicValidateForm[index].interfaceParamList[0][paramIndex])===0" v-model.lazy="dynamicValidateForm[index].interfaceParamList[0][paramIndex]"></el-input>
                            <el-switch
                                :disabled="true"
                                v-else-if="getItemInfo(dynamicValidateForm[index].interfaceParamList[0][paramIndex])===1"
                                v-model="dynamicValidateForm[index].interfaceParamList[0][paramIndex]"
                                active-text="是"
                                inactive-text="否">
                            </el-switch>
                            <el-input v-else text="明细" :disabled="true"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-collapse v-if="showDetails">
                    <el-collapse-item title="细节显示">
                        <el-card class="box-card" v-for="(detailsList,detailsListIndex) in detailsObjInfo" :style="detailsListIndex===0?'':{'margin-top':'20px'}">
                            <div slot="header" class="clearfix">
                                <span>细节详情{{ detailsListIndex+1 }}</span>
                            </div>
                            <el-form-item v-for="(detail,detailIndex) in getDetailsObject" :key="detailIndex" :label="detail">
                                <el-row>
                                    <el-col :span="16">
                                        <el-input :disabled="true" :placeholder="'请输入'+detail" v-model.lazy="detailsObjInfo[detailsListIndex][detailIndex]"></el-input>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-card>

                    </el-collapse-item>
                </el-collapse>
            </el-form>
        </el-card>
        <el-backtop></el-backtop>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name:'showDetail',
    data(){
        return{
            detailInfo:[],   // 详细信息
            dynamicValidateForm: [],      // 所需要提交的表单列表         
            getInterfaceParamObject:{},     // 获取 参数对象 
            interfaceParamObj:{},   // 参数对象

            showDetails: false,  // 显示细节下拉框
            detailsObjInfo:[],  // 细节对象信息
            getDetailsObject:{},  // 细节对象

        }
    },
    methods: {
        goBack(){   // 返回上一页，并关闭tag标签
            this.$router.back()
            let tag = {
                type: "dark",
                title: "查看详情页",
                path: "/detail/showDetail"
            }
            this.$store.dispatch('settings/closeTags', tag)
            .then(res=>{})
        },
        getItemInfo(item){  //如果值是boolean类型，就返回1，对象类型 返回2 ，否则返回0 ：  0 是string类型，1是boolean，2是细节
            if(typeof(item)==="boolean"){
                return 1
            }else if(typeof(item)==="object"&&item!=null){
                return 2
            }else{
                return 0
            }
        },
        doInit(){
            console.log(this.$route.query.info)
            this.getInterfaceParamObject = this.table.DIYTableKey_down[this.$route.query.type]  // 根据获取的参数类型去获取接口参数列表
            for(const element of Object.keys(this.getInterfaceParamObject)){   // 获取参数列表中的键，去生成一个参数对象
                if(element.substr(0,2).toLowerCase()==="is"){  // 如果 参数 列表中前两个字符是 is ，则就是布尔类型的 
                    this.interfaceParamObj[element]=false
                }else if(element==="details"){   // 如果 有 details ，则进行细节列表的显示  details 是个列表不止一个元素
                    this.showDetails = true
                    this.getDetailsObject = this.table.DIYTableKey_down[this.$route.query.type+'_details']   // 获取接口类型的细节
                    this.detailsObjInfo = this.$route.query.info.details
                }else{
                    this.interfaceParamObj[element]=""
                }
            }
            this.dynamicValidateForm.push({    // 给第一个表单赋值 所需要提交的表单列表
                interfaceParamList:[JSON.parse(JSON.stringify(this.interfaceParamObj))]   // 接口所需要提交的参数的列表，每一个列表都是独立的所以需要深拷贝
            })
            this.detailInfo.push(this.$route.query.info)
            this.dynamicValidateForm[0].interfaceParamList = this.detailInfo  
        }
    },
    mounted(){
        if(typeof(this.$route.query.info)!=="object"){  //如果获取到的不是object对象类型，则返回上一页
            this.$message({
                showClose: true,
                message: '数据出错啦，将返回上一页',
                type: 'error'
            })
            this.goBack()
        }else{
            this.doInit()
        }    
    },
    computed: {
        ...mapState(['table']),
    },
}
</script>