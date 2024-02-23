import printJS from "print-js"
/**
 * 
 * @param {
 *      title:"", // 表名
 *      serial：false, // 是否需要序号
 *      data:[], // 要打印的数据
 *      fields:[], // 需要打印的字段
 *      currentPages: 当前页码 //可不传，不传的话是直接进行进行按序号排序 则按 如果有分页，传入的是当前页数
 *      pageSize：每页的条目数 //currentPages和pageSize一般来讲都是一起出现的
 *      waterMark: 是否开启水印//默认开启
 *      waterMarkContent: 水印内容 //只有党开启水印时才会展示，一般来讲都是和开启水印一起出现的 默认是用户名+用户id
 *      zoom: 缩放比例//默认100%
 *      vertical：横向纵向//默认横向
 *      paperType：纸张类型//默认为单一类型（循环对硬件配置较高）
 *      waterMarkType: 水印类型
 *      properties:[ //可不传，不传的话是默认打印出来表单中的所有信息
 *          {
 *              field:"字段名（对应fields）",
 *              displayName:"打印时展示的中文表头名字",
 *              columnSize:"定义列宽，用百分比来表示大小，可不传"
 *          }
 *      ],
 * } args
 *  
 */
function printJson(args = {}) {
    let data = []
    let no = 0
    for(const dataItem of args.data){
        let dataObj = {}
        if (args.serial&&args.currentPages&&args.pageSize) {//如果需要序列号并且有当前页码和每页的条目数
            dataObj.serial = (args.currentPages - 1) * args.pageSize + no + 1
            no++
        }else{
            dataObj.serial = no + 1// 如果需要序列号 但没有当前页码和每页条目数 就是 index+1
            no++
        }
        for(const element of args.fields){
            if(element.columItemFormat){//如果有格式化，就进行格式化操作
                if(element.columItemFormat==="dateFormat"){//日期格式化
                    dataItem[element.columItemName] = dataItem[element.columItemName].split(' ')[0]
                }else if(element.columItemFormat==="boolean"){//布尔值格式化
                    dataItem[element.columItemName]==='是'?dataItem[element.columItemName]='是':dataItem[element.columItemName]='否'
                }
            }
            if((dataItem[element.columItemName]!==null)&&(dataItem[element.columItemName]!==undefined)){//数据有值
                dataObj[element.columItemName] = dataItem[element.columItemName]
            }else{//数据没值
                dataObj[element.columItemName]="暂无"
            }
        }
        data.push(dataObj)
    }
    let properties = args.properties||[]
    if(properties.length===0){//如果没传properties，就是默认所有表中信息
        for(const prope of args.fields){
            let propeObj = {}
            propeObj["field"]=prope.columItemName
            propeObj["displayName"]=prope.columItemLable
            properties.push(propeObj)
        }
    }
    if (args.serial) {
        properties.unshift({
            field: "serial",
            displayName: "序号",
        })
    }

    let displayType = args.waterMark
    if(displayType===undefined){
        displayType='block'  //没传值过来就默认是显示水印的
    }else{//如果有值进行判断，true是显示，flase是不显示
        displayType?displayType='block':displayType='none'
    }

    let printDocType = {
        A4:{//暂时只支持A4纸张
            with: 1123,
            height: 794
        }
    }

    let printPaperType = printDocType[args.paperType]  //获取纸张类型
    let scanZoom = args.zoom //获取缩放比例
    let vertical = args.vertical==='横向'?'landscape':'portrait' //获取横向纵向


    let handleWidth = vertical==='landscape'?printPaperType.with:printPaperType.height  //如果是纵向的话，需要将反过来
    let handleLength = vertical==='landscape'?printPaperType.height:printPaperType.with

    let printScannerWidth = (handleWidth) + (100-scanZoom) * (handleWidth/50) //获取打印窗口的宽度，进行比例缩放的换算 
    let printScannerHeight = (handleLength) + (100-scanZoom) * (handleLength/50)  //获取打印窗口的高度
    let fontSize = 24 + (100-scanZoom) * (24/50)


    let htmlStr = ''

    if(args.waterMarkType==='单一'){
        //单个水印
        let posithionLeft = printScannerWidth * 0.2 //列位置
        let waterMarkHeight = printScannerHeight * 0.4//高度
        htmlStr = htmlStr + `<div style="left: ${posithionLeft+'px'};position: fixed;opacity: 0.1;z-index: 999;display: ${displayType}">
                        <span style="margin-top: ${waterMarkHeight + 'px'};font-weight: 900; white-space:nowrap;font-family: Arial, sans-serif;font-size: ${fontSize*3+'px'};color: #000000;text-align: center;display: block;transform:rotate(-45deg);font-style:italic">${args.waterMarkContent||'默认水印'}</span>
                        </div>`
    }else{
        //循环水印(需要较高机器配置不推荐使用)
        let waterMarkWidth = Math.ceil(printScannerWidth/300)  //水印显示列以300为间隔,向下取整
        let rowNum = Math.ceil(printScannerHeight/160)//行数
        let waterMarkHeight = 100 //向下取整,需要的高度间距
        let posithionLeft = 0//列位置
        for(let i = 0;i < waterMarkWidth;i++){//列
            htmlStr = htmlStr + `<div style="left: ${posithionLeft+'px'};position: fixed;opacity: 0.1;z-index: 999;display: ${displayType}">`
            for(let j = 0; j< rowNum; j++){
                let marginTop = j===0?'20px':waterMarkHeight+'px'//第一行需要往上一点
                htmlStr = htmlStr + `<span style="margin-top: ${marginTop}; white-space:nowrap;font-family: Arial, sans-serif;font-size: 24px;color: #000000;text-align: center;display: block;transform:rotate(-45deg);font-style:italic">${args.waterMarkContent||'默认水印'}</span>`
            }
            htmlStr = htmlStr + `</div>`
            posithionLeft = posithionLeft + 300
        } 
    }
    

    printJS({
       printable: data,
       properties: properties || [],
       //header: args.title || "",
       header: `${htmlStr}
                <div style="display:flex;flex-direction:column;text-align:center">
                    <h3>${args.title || ""}</h3>
                </div>`,
       // 样式设置
       style: `body {zoom: ${scanZoom+'%'}}
                @media print{@page {size:${vertical}}}`,
       type: 'json',  // 打印的格式  
       gridStyle: 'border-bottom: 1px solid #000;text-align:center;padding:5px 0;', // 表格样式  
       gridHeaderStyle: 'border-bottom: 1px solid #000;border-top: 1px solid #000;text-align:center;padding:5px 0;',//表头样式
       repeatTableHeader: false
    });
}
 
export default {
    printJson
}