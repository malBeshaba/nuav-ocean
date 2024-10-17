import request from '@/utils/request'
const HTTP_PREFIX = '/manage/api/v1'

export function selectPage(data:any) {
    const workspaceId: string = JSON.parse(localStorage.getItem('userInfo') as string).workspace_id || ''
    return request({
        url: `${HTTP_PREFIX}/users/${workspaceId}/users`,
        method: 'get',
        params: data,
    })
}

export function  addUser(data:any) {
    return request({
        url: `${HTTP_PREFIX}/users/insert`,
        method: 'post',
        data
    })
}

export function updateUser(data:any) {
    //username\password\userType是必传的参数
    return request({
        url: `${HTTP_PREFIX}/users/update`,
        method: 'post',
        data
    })
}

export function deleteUser(userId:any) {
    return request({
        url: `${HTTP_PREFIX}/users/delete/${userId}`,
        method: 'get',
    })
}

export function getUserById(id:any) {
    return request({
        url: '/user/get/' + id,
        method: 'get',
    })
}

export const getUsersByCondition = async function (workspace_id:any, body:any) {
    const url = `${HTTP_PREFIX}/users/${workspace_id}/getUsersByCondition?&page=${body.page}&page_size=${body.page_size}&user_type=${body.user_type}`
    const result = await request.get(url)
    return result.data
}

export function getUsers(workspace_id:any, body:any) {
    return request({
        url: `${HTTP_PREFIX}/users/${workspace_id}/users?&page=${body.page}&page_size=${body.page_size}`,
        method: 'get'
    })
}