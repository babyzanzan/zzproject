<template>
    <el-card>
        <div slot="header" class="clearfix">
            <span>子路由{{ index+1 }}</span>
        </div>
        <el-form style="padding-right: 20px;">
            <el-form-item label="子路径" :label-width="labelWidthChildren">
                <el-input placeholder="请输入子路径" v-model="item.path">
                </el-input>
            </el-form-item>
            <el-form-item label="子路由名" :label-width="labelWidthChildren">
                <el-input placeholder="请输入子路由名(非中文,首字母大写)" v-model="item.name"></el-input>
            </el-form-item>

            <el-form-item v-if="item.meta" label="子标题" :label-width="labelWidthChildren">
                <el-input placeholder="请输入子标题" v-model="item.meta.title">
                </el-input>
            </el-form-item>
            <el-form-item v-else label="子标题" :label-width="labelWidthChildren">
                <el-input placeholder="请输入子标题" v-model="item.title">
                </el-input>
            </el-form-item>

            <el-form-item v-if="item.meta" label="子图标" :label-width="labelWidthChildren">
                <el-input placeholder="请输入子图标" v-model="item.meta.icon">
                    <i
                        class="el-icon-link el-input__icon"
                        slot="suffix"
                        @click="toLinkIcon">
                    </i>
                </el-input>
            </el-form-item>
            <el-form-item v-else label="子图标" :label-width="labelWidthChildren">
                <el-input placeholder="请输入子图标" v-model="item.icon">
                    <i
                        class="el-icon-link el-input__icon"
                        slot="suffix"
                        @click="toLinkIcon">
                    </i>
                </el-input>
            </el-form-item>

        </el-form>
        <el-button type="danger" style="margin-left: 18px;" circle size="mini" icon="el-icon-remove" @click="deleteChildren"></el-button>
    </el-card>
</template>
<script>
export default {
    name:'chilidrenRouter',
    props:['index','item'],
    data() {
        return {
            labelWidthChildren: '80px',
        }
    },
    methods:{
        toLinkIcon(){
            window.open('https://element.eleme.cn/#/zh-CN/component/icon', '_blank')
        },
        deleteChildren(){
            this.$emit("deleteIndex",this.index)
        }
    },
}
</script>