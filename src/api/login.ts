import request from '@/utils/request'

const loginURL = '/manage/api/v1/login'

interface loginParam {
    username: String,
    password: String,
    flag: number
}

export const login = async function (body: loginParam) {
    const url = `${loginURL}`
    const result = await request.post(url, body)
    return result.data
}
