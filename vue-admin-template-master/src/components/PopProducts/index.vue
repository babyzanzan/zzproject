<template>
    <div>
        <el-popover ref="popover4" placement="right" width="700" trigger="click" v-model="show">
            <el-table :data="gridData" v-loading="popProductLoading" highlight-current-row @current-change="handleCurrentChange">
                <el-table-column width="150" property="code" label="编码"></el-table-column>
                <el-table-column width="200" property="name" label="品名"></el-table-column>
                <el-table-column width="100" property="model" label="规格"></el-table-column>
                <el-table-column width="200" property="fromPlace" label="生产企业"></el-table-column>
            </el-table>
            <el-pagination
                background
                layout="prev, pager, next"
                :total="popProductTotal"
                :page-size="10"
                :current-page="popProductCurrentPage"
                @current-change="handlePopProductCurrentChange"
                :hide-on-single-page="true"
                style="margin-top: 10px">
            </el-pagination>
        </el-popover>
        <el-input placeholder="请输入内容" v-model="query" @blur="inputId" @input="doClear" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search" @click="search" v-popover:popover4></el-button>
        </el-input>
    </div>
</template>
<script>
import { getProductsInfo } from '@/api/table'
export default {
    data () {
        return {
            query: "",
            gridData: [],
            show: false,
            popProductTotal:0,   // 数据总数
            popProductCurrentPage:1,  // 当前页面
            popProductLoading: false
        }
    },
    methods: {
        inputId(){ // 手动输入失去焦点
            if(!isNaN(Number(this.query,10))&&this.query!==''){   // 如果输入的是数字，就是手动的输入id 把数字传出去
                this.$emit('selectProduct', this.query)
            }
        },
        doClear(){
            this.$emit('selectProduct', '')  //清空输入内容
        },
        handlePopProductCurrentChange (popProductCurrentPage) {
            this.popProductCurrentPage = popProductCurrentPage
            this.search()
        },
        search () {
            this.popProductLoading = true
            getProductsInfo({ page: this.popProductCurrentPage, size: 10, name: this.query, relatedId: "" }).then(res => {
                this.popProductTotal = res.data.totalPageNumber
                this.gridData = res.data.data
                this.popProductLoading = false
            }).catch(err => {
                this.$message(err)
                this.popProductLoading = false
            })
        },
        handleCurrentChange (val) {
            if (val) {
                this.query = val.name;
                this.$emit('selectProduct', val.relatedId)
                this.show = false
            }
        }
    },
}
</script>