import request from '@/utils/request'

export function getDIYtable(data){   // 获取该自定义模板（某一个）的信息
  return request({
    url: `/api/v2/diytables/list`,
    method: 'post',
    data
  })
}

export function updateDIYtable(DIYinfo){    // 新建和更新模板，templateID为0是 新增，不为 0 是更新
  //DIYinfo.editColumn = DIYinfo.editColumn?1:0 // 将DIYinfo中的editColumn进行改变，因为 数据库中的bit字符只有0或1
  // 将DIYInfo中的 menuClass，optionList，tableColumList转成字符串类型
  DIYinfo.menuClass = JSON.stringify(DIYinfo.menuClass)
  if(DIYinfo.optionList.length===0){   //如果操作列没有值，就赋值为空，不给他转成字符
    DIYinfo.optionList = ""
  }else{
    DIYinfo.optionList = JSON.stringify(DIYinfo.optionList)
  }
  DIYinfo.columList = JSON.stringify(DIYinfo.columList)
  let data = [DIYinfo]
  return request({
    url: `/api/v2/diytables/update`,
    method: 'post',
    data
  })
}

export function deleteTemplateOne(data){  // 删除 模板
  return request({
    url: `/api/v2/diytables/delete`,
    method: 'post',
    data
  })
}

/////上传（更新）接口

export function updateInfo(submitInfo,interfaceAddress){   // 更新（添加信息）
  let data = []
  let dataItem = {}
  for(const element of submitInfo){  // 对提交的数据进行处理
    dataItem = element.interfaceParamList[0]
    data.push(dataItem)
  }
  interfaceAddress = interfaceAddress.replace(/_/g, "/")  // 处理接口地址
  return request({
    url: interfaceAddress,
    method: 'post',
    data
  })
}

export function uploadCardImages(data){   // 上传证照图片
  return request({
    url: `/api/v2/clients/cardfile/up`,
    method: 'post',
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data
  })
}

export function uploadUserRight(data){   // 上传 用户权限设置
  return request({
    url: `/api/v2/bases/elusermenus/up`,
    method: 'post',
    data
  })
}



/////获取接口
export function getPersonInfo(data){   // 获取人员信息
  return request({
    url: `/api/v2/bases/elusers/down`,
    method: 'post',
    data
  })
}


export function getProductsInfo(data){   // 获取商品信息
  return request({
    url: `/api/v2/products/down`,
    method: 'post',
    data
  })
}

export function getLicenseType(data){   // 获取证照类型
  return request({
    url: `/api/v2/clients/cardtypes/down`,
    method: 'post',
    data
  })
}

export function getLicenseInfo(data){   // 获取证照信息
  return request({
    url: `/api/v2/clients/cards/down`,
    method: 'post',
    data
  })
}
export function getInventories(data){   // 获取 即时库存
  return request({
    url: `/api/v2/inventories/down`,
    method: 'post',
    data
  })
}








