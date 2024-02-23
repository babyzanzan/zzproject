import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getName() {
  return Cookies.get('userName')
}

export function setName(userName) {
  return Cookies.set('userName', userName)
}

export function removeName() {
  return Cookies.remove('userName')
}

export function getUserId() {
  return Cookies.get('userId')
}

export function setUserId(Id) {
  return Cookies.set('userId', Id)
}

export function removeUserId() {
  return Cookies.remove('userId')
}

export function getFlag() {
  return Cookies.get('flag')
}

export function setFlag(flag) {
  return Cookies.set('flag',flag)
}

export function removeFlag() {
  return Cookies.remove('flag')
}

export function getAvatar() {
  return Cookies.get('avatar')
}

export function setAvatar(avatar) {
  return Cookies.set('avatar', avatar)
}

export function removeAvatar() {
  return Cookies.remove('avatar')
}