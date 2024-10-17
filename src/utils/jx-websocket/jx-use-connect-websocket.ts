import { onMounted, onUnmounted } from 'vue'
import JxConnectWebSocket, { JxMessageHandler } from './'
import { getJxWebSocketURL } from '../config'
import store from '@/store'

// const store = useMyStore()
/**
 * 接收一个message函数
 * @param messageHandler
 */
export function jxUseConnectWebsocket (messageHandler: JxMessageHandler) {
    const webSocket = new JxConnectWebSocket(getJxWebSocketURL())

    onMounted(() => {
        webSocket?.registerMessageHandler(messageHandler)
        webSocket?.initSocket()
    })

    onUnmounted(() => {
        webSocket?.close()
    })
}

export interface jxPayloadType {
    type: string,
    data: any
}

export function jxMessageHandler (payload: any) {
    // console.log(payload)
    if (!payload) {
        return
    }
    // console.log('payload', payload)
    switch (payload.type) {
        case "1":
            store.commit('SET_JIEXIANG_DEVICE_INFO', payload.data)
            break
        case "2":
            store.commit('SET_JIEXIANG_DOCK_INFO', payload.data)
            break
        default:
            break
    }
}
