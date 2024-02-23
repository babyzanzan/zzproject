<template>
    <div>
        <el-popover ref="popover4" placement="right" width="700" trigger="click" v-model="show">
            <el-table :data="gridData" v-loading="popClientLoading" highlight-current-row @current-change="handleCurrentChange">
                <el-table-column width="350" property="entId" label="编码"></el-table-column>
                <el-table-column width="300" property="name" label="名称"></el-table-column>
            </el-table>
            <el-pagination
                background
                layout="prev, pager, next"
                :total="popClientTotal"
                :page-size="10"
                :current-page="popClientCurrentPage"
                @current-change="handlePopClientCurrentChange"
                style="margin-top: 10px;"
                :hide-on-single-page="true">
            </el-pagination>
        </el-popover>
        <el-input placeholder="请输入内容" v-model="query" @blur="inputId" @input="doClear" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search" @click="search" v-popover:popover4></el-button>
        </el-input>
    </div>
</template>
<script>
import { getSuppliersInfo,getClientsInfo } from '@/api/table'
export default {
    props: {
        clientType: String
    },
    data () {
        return {
            query: "",
            gridData: [],
            show: false,
            popClientTotal:0,   // 数据总数
            popClientCurrentPage:1,  // 当前页面
            popClientLoading: false
        }
    },
    methods: {
        inputId(){ // 手动输入失去焦点
            if(!isNaN(Number(this.query,10))&&this.query!==''){   // 如果输入的是数字，就是手动的输入id 把数字传出去
                this.$emit('selectClient', this.query)
            }
        },
        doClear(){
            this.$emit('selectClient', '')  //清空输入内容
        },
        handlePopClientCurrentChange (popClientCurrentPage) {
            this.popClientCurrentPage = popClientCurrentPage
            this.search()
        },
        search () {
            this.popClientLoading = true
            //console.log("🚀 ~ file: index.vue:31 ~ search ~ this.clientType:", this.clientType)
            if (this.clientType === 'supplier') {
                getSuppliersInfo({ page: this.popClientCurrentPage, size: 10, name: this.query, relatedId: "" })
                .then(res => {
                    this.popClientTotal = res.data.totalPageNumber
                    this.gridData = res.data.data
                    this.popClientLoading = false
                })
                .catch(err => {
                    this.$message(err)
                    this.popClientLoading = false
                })
            }else if(this.clientType === 'customers'){
                getClientsInfo({ page: this.popClientCurrentPage, size: 10, name: this.query, relatedId: "" })
                .then(res => {
                    this.popClientTotal = res.data.totalPageNumber
                    this.gridData = res.data.data
                    this.popClientLoading = false
                })
                .catch(err => {
                    this.$message(err)
                    this.popClientLoading = false
                })
            }
        },
        handleCurrentChange (val) {
            if (val) {
                this.query = val.name;
                this.$emit('selectClient', val.relatedId)
                this.show = false
            }
        }
    },
}
</script>