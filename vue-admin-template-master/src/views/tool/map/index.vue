<template>
    <div class="amap-wrapper">
      <el-amap
            ref="map"
            :vid="'amapDemo'"
            :center="center"
            :zoom="zoom"
            :plugin="plugin"
            :events="events"
            class="amap-demo"
            style="height: 800px;width: 100%">
            <el-amap-marker v-for="(u,i) in markers" :position="u.position" :key="i">
            </el-amap-marker>
            <el-amap-marker :position="[121.5273285, 31.21515044]" :icon="icon">
           </el-amap-marker>
        </el-amap>
 </div>
</template>
<script>
 export default {
        name: 'index',
        data() {
            return {
                center: [121.5273285, 31.21515044],
                zoom: 12,
                position: [121.5273285, 31.21515044],
                icon: new AMap.Icon({            
                    image: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                    size: new AMap.Size(128, 128),  //自定义地图标记点图片
                    imageSize: new AMap.Size(64,64)
                }),
                events: {
                    init(o){
                        console.log(o.getCenter());
                    },
                    zoomchange: (e) => {
                        console.log(e);
                    },
                    zoomend: (e) => {
                        //获取当前缩放zoom值
                        console.log(this.$refs.map.$$getInstance().getZoom());
                        console.log(e);
                    },
                    click: e => {
                        alert('map clicked')
                    }
                },
                markers: [//标记点位置
                    {
                        position: [121.5273285, 31.21515044]
                    },
                    {
                        position: [121.5174286, 31.21515044]
                    }
                ],
               //使用其他组件
                plugin: [
                    {
                        pName: 'Scale',
                        events: {
                            init(instance) {
                                console.log(instance)
                            }
                        }
                    },
                    {
                        pName: 'ToolBar',
                        events: {
                            init(instance) {
                                console.log(instance)
                            }
                        }
                    }
                ],
            };
        },
        methods: {
        }
    }

</script>