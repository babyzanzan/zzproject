import { login, logout, getInfo,register,updatePsw } from '@/api/user'
import { getToken, setToken, removeToken,setName,getName,removeName,getUserId,setUserId,removeUserId,getFlag,setFlag,removeFlag,getAvatar,setAvatar,removeAvatar} from '@/utils/auth'
import { resetRouter } from '@/router'
import Layout from '@/layout'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: getName(),
    avatar: getAvatar(),
    user: {},
    userId: getUserId(),
    flag: getFlag(),
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_FLAG: (state, flag) => {
    state.flag = flag
  }
}

const actions = {
  // user login 登录
  // login({ commit,dispatch }, userInfo) {
  //   const { userName, password, admin } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ userName: userName.trim(), password: password, admin }).then(response => {
  //       if(response.success&&typeof(response.data)==="object"){
  //           const {data} = response
  //           commit('SET_TOKEN', data.token)
  //           setToken(data.token)
  //           if(data.user.userName!=="admin"){  // 如果返回的数据中的clientName不为undefined就是 客户登录
  //             commit('SET_NAME', data.user.userName)
  //             setName(data.user.userName)
  //             commit('SET_USERID', data.user.id)
  //             setUserId(data.user.id)
  //             commit('SET_AVATAR', data.user.avatar)
  //             setAvatar(data.user.avatar)
  //           }else{  // 否则就是 管理员 登录
  //             commit('SET_NAME', data.user.name)
  //             setName(data.user.name)
  //             commit('SET_USERID', 0)
  //             setUserId(0)
  //             commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
  //             setAvatar('https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
  //           }
  //           // 获取菜单,调用其他文件中actions时必须加 { root: true }
  //           // dispatch('permission/generateRoutes', data.user.id, { root: true }).then((accessRoutes) => {
  //           //   router.addRoutes(accessRoutes)
  //           // })
  //       }
  //       resolve(response)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  
  login({ commit,dispatch }, userInfo) {
    console.log(userInfo)
    const { userName, password, admin } = userInfo
    return new Promise((resolve, reject) => {
        //演示模式假数据
      const data = {
        token:'123456',
        user:{
          userName:userName,
          id:'121',
          avatar:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        }
      }
      commit('SET_TOKEN', data.token)
      setToken(data.token)
      
      if(!admin){  //不是管理员
        commit('SET_NAME', data.user.userName)
        setName(data.user.userName)
        commit('SET_USERID', data.user.id)
        setUserId(data.user.id)
        commit('SET_AVATAR', data.user.avatar)
        setAvatar(data.user.avatar)
      }else{  // 否则就是 管理员 登录
        commit('SET_NAME', data.user.userName)
        setName(data.user.userName)
        commit('SET_USERID', 0)
        setUserId(0)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        setAvatar('https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
      }
      resolve(data)
    })
  },




  setFlag({ commit }, flag) {
    return new Promise(resolve => {
      commit('SET_FLAG',flag )
      setFlag(flag)
      resolve()
    })
  },

 // user register 注册
  register({commit},RegisterInfo){
    return new Promise((resolve, reject) => {
      // register(RegisterInfo).then(response => {
      //   resolve(response)
      // }).catch(error => {
      //   reject(error)
      // })
      resolve(true)
    })
  },

  // 修改密码
  updatePassword({commit},updateInfo){
    return new Promise((resolve, reject) => {
      updatePsw(updateInfo).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  
  // get user info
  getInfo({commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {  //登出
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      removeName()
      removeUserId()
      removeFlag()
      removeAvatar()
      commit('RESET_STATE')
      resolve(true)

      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

