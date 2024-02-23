import Vue from 'vue'

Vue.directive('drawerDrag', {
    bind(el, binding, vnode, oldVnode) {
        const minWidth = 300
        const dragDom = el.querySelector('.el-drawer')
        // const dragDom1 = el.querySelector('.el-drawer__container')
        // const dragDom2 = el.querySelector('.el-drawer__wrapper')
        // dragDom.style.overflow = 'auto'

        const resizeElL = document.createElement('div')
        const img = new Image(24, 38)
        // img.src = require('@/assets/img/apk.png')
        // dragDom.appendChild(img)
        dragDom.appendChild(resizeElL)
        resizeElL.style.cursor = 'w-resize'
        resizeElL.style.position = 'absolute'
        resizeElL.style.height = '100%'
        resizeElL.style.width = '30px'
        resizeElL.style.left = '0px'
        resizeElL.style.top = '0px'
        img.style.position = 'absolute'
        img.style.left = '-12px'
        img.style.top = '50%'

        resizeElL.onmousedown = (e) => {
            const elW = dragDom.clientWidth
            const EloffsetLeft = dragDom.offsetLeft
            console.log(elW,EloffsetLeft)
            const clientX = e.clientX
            document.onmousemove = function (e) {
                // console.log(e.clientX,dragDom.offsetLeft,333333)
                e.preventDefault()
                // 左侧鼠标拖拽位置
                if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
                    // 往左拖拽
                    if (clientX > e.clientX) {
                        dragDom.style.width = elW + (clientX - e.clientX) + 'px'
                    }
                    // 往右拖拽
                    if (clientX < e.clientX) {
                        if (dragDom.clientWidth >= minWidth) {
                          dragDom.style.width = elW - (e.clientX - clientX) + 'px'
                        }
                    }
                }
            }
            // 拉伸结束
            document.onmouseup = function (e) {
                document.onmousemove = null
                document.onmouseup = null
            }
        }
    }
})