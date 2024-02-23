import request from '@/utils/request'

export function login(data) {  //登录
  if(data.admin){  // 如果是 管理员 登录
    return request({
      url: '/api/v3/users/login',
      method: 'post',
      data
    })
  }else{  // 否则就是 客户登录
    return request({
      url: '/api/v2/token',
      method: 'post',
      data
    })
  }
}

export function register(data) {   // 注册用户
  return request({
    url: '/api/v2/token/register',
    method: 'post',
    data
  })
}



export function fetchUserMenuList(data) {   // 获取 user下的 菜单列表
  return request({
    url: '/api/v2/bases/elmenus/down',
    method: 'post',
    data
  })
}

export function updatePsw(data) {  //修改密码
  return request({
    url: '/api/v2/token/password',
    method: 'post',
    data
  })
}


export function getInfo(token) {   // 获取 用户信息
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {  //登出
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}



