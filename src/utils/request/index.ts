import axios from 'axios'
import { CURRENT_CONFIG } from '../config'
import {ElMessage} from 'element-plus'
import {ELocalStorageKey} from './type'
import router from "@/router";
export * from './type'

const REQUEST_ID = 'X-Request-Id'
function getAuthToken () {
    return localStorage.getItem('token')
}

const instance = axios.create({
    // withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 12000,
})

instance.interceptors.request.use(
    config => {
        if (getAuthToken()) {
            config.headers[ELocalStorageKey.Token] = getAuthToken()
        } else {
            router.push({path: '/login'}).catch(() => {})
        }
        // config.headers[REQUEST_ID] = uuidv4()
        config.baseURL = CURRENT_CONFIG.baseURL
        return config
    },
    error => {
        return Promise.reject(error)
    },
)

instance.interceptors.response.use(
    response => {
        // console.info('URL: ' + response.config.baseURL + response.config.url, '\nData: ', response.data, '\nResponse:', response)
        if (response.data.code && response.data.code !== 0) {
            // ElMessage.error(response.data.message)
        }
        return response
    },
    err => {
        const requestId = err?.config?.headers && err?.config?.headers[REQUEST_ID]
        if (requestId) {
            console.info(REQUEST_ID, '：', requestId)
        }
        console.info('url: ', err?.config?.url, `【${err?.config?.method}】 \n>>>> err: `, err)

        let description = '-'
        if (err.response?.data && err.response.data.message) {
            description = err.response.data.message
        }
        if (err.response?.data && err.response.data.result) {
            description = err.response.data.result.message
        }
        // @See: https://github.com/axios/axios/issues/383
        if (!err.response || !err.response.status) {

            ElMessage.error('The network is abnormal, please check the backend service and try again')
            return
        }
        if (err.response?.status !== 200) {
            // ElMessage.error(`ERROR_CODE: ${err.response?.status}`)
        }
        // if (err.response?.status === 403) {
        //   // window.location.href = '/'
        // }
        if (err.response?.status === 401) {
            console.error(err.response)
            const flag: number = Number(localStorage.getItem(ELocalStorageKey.Flag))
            // switch (flag) {
            //     case EUserType.Web:
            //         router.push(ERouterName.PROJECT)
            //         break
            //     case EUserType.Pilot:
            //         router.push(ERouterName.PILOT)
            //         break
            // }
        }

        return Promise.reject(err)
    },
)

export default instance
