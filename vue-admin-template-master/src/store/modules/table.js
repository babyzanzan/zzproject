/////// 获取接口的参数列表
const state = {
  DIYTableKey_down : {  // 下载的字段名列表
    bases_elusers_down:{   // 获取用户列表
      id:"用户ID",
      loginId:"用户登录账号",
      userName:"用户名",
      enabled:"启用状态",
      avatar:"头像"
    },
    products_down: {   //获取商品列表
      id:"三方系统商品ID",
      code:"商品编码",
      barCode:"条码",
      productName:"商品名",
      unitType:"剂型",
      fromPlace:"商品生产企业",
    },
    clients_cardtypes_down:{  // 获取证照类型
      id:"类型ID",
      name:"类型名称"
    },
    clients_cards_down:{  // 获取证照信息
      id:"证照id",
      cardTypeId:"类型ID",
      cardTypeName:"类型名称",
      cardNumber:"证件号码",
    },
    purchases_down:{  // 获取采购记录
      billCode:"单据编号",
      billDate:"单据日期",
      id:"三方单据明细ID",
      batch:"商品批号",
      pName:"订单商品名称",
      billNum: "订单商品数量",
    },
    inventories_down:{   // 获取 即时库存
      id: "三方单据明细id",
      pId: "三方商品id",
      pName: "订单商品名称",
      quantity: "库存数量",
      addDate: "入库时间",
      lastUpdate: "最新库存更新时间",
    }
  },

  //////上传

  DIYTableKey_up:{ // 上传的字段名列表
    purchases_up:{  // 上传 采购订单
      billCode: "采购订单单号",
      billNum:"单据数量_整数",
      batch:"商品批号",
      pName:"商品名称",
      details: "明细"
    },
    purchases_up_details:{  // 上传 采购单 细节
      price: "采购单价_小数",
      billCode: "订单单号",
      note: "备注"
    },
  }
}

const mutations = {
  CHANGE_TABLE: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_TABLE', data)
  },
  // 

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

