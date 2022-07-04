// 整体导入
import request from './request.js'

const api = {}

api.PostLoginApi = (params) => request.post('login', params)

api.GetMenus = () => request.get('menus')

api.GetUsers = (params) => request.get('users', { params })

api.PutUserStateSetting = (userId, state) => request.put(`users/${userId}/state/${state}`)

api.PostAddUser = (userInfo) => request.post('users', userInfo)

api.GetUserById = (id) => request.get(`users/${id}`)

api.PutUserSetting = (userId, email, mobile) => request.put('users/' + userId, { email, mobile })

api.DeleteUserById = (id) => request.delete('users/' + id)

api.GetRightsList = () => request.get('rights/list')

api.GetRoles = () => request.get('roles')

api.GetRightsByTree = () => request.get('rights/tree')

api.PostRolesSetting = (roleId, idStr) => request.post(`roles/${roleId}/rights`, { rids: idStr })

api.DeleteRight = (roleId, rightId) => request.delete(`roles/${roleId}/rights/${rightId}`)

api.PutUserRolesSetting=(userId,roleId)=>request.put(`users/${userId}/role`,{rid:roleId})


export default api