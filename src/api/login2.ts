import request from '@/utils/request2'

const loginURL = '/uavBackend/system/login'

interface loginParam {
    username: String,
    password: String
}

export const login2 = async function (body: loginParam) {
    const url = `${loginURL}`
    const result = await request.post(url, body)
    return result.data
}
