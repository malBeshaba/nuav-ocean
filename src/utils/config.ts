
export const CURRENT_CONFIG = {

  // license
  appId: '129151', // You need to go to the development website to apply.
  appKey: 'bd6de5e23ec0555e54b57136dd5ba41', // You need to go to the development website to apply.
  appLicense: 'RadYnqUJ+lhcym2x3rrC5c79l1jzLsWJEoH0DlgxkBdAdEdTomgCUw4Kn9Vm32erGUuuhf57THyDbAzb710LzfBQflJN316IYN2+WTdg9iP8V55WCu6PjC+nlBzmN+UXuV2Oi8JVlHOCk+hSEXzP/p7KYXmrDuUdJ+9QONTgMYY=', // You need to go to the development website to apply.
  // http
  baseURL: `http://${import.meta.env.VITE_BASE_URL}/`, // This url must end with "/". Example: 'http://192.168.1.1:6789/'
  baseURL2: `http://${import.meta.env.VITE_BASE_URL2}/`, // This url must end with "/". Example: 'http://192.168.1.1:6789/'
  websocketURL: `ws://${import.meta.env.VITE_BASE_URL}/api/v1/ws`, // Example: 'ws://192.168.1.1:6789/api/v1/ws'
  websocketURL2: `ws://${import.meta.env.VITE_BASE_URL2}/uavBackend/ws/v1`, // Example: 'ws://192.168.1.1:6789/api/v1/ws'
  // livestreaming
  // RTMP  Note: This IP is the address of the streaming server. If you want to see livestream on web page, you need to convert the RTMP stream to WebRTC stream.
  rtmpURL: 'rtmp://139.159.148.93/live/', // Example: 'rtmp://192.168.1.1/live/'
  // GB28181 Note:If you don't know what these parameters mean, you can go to Pilot2 and select the GB28181 page in the cloud platform. Where the parameters same as these parameters.
  gbServerIp: 'Please enter the server ip.',
  gbServerPort: 'Please enter the server port.',
  gbServerId: 'Please enter the server id.',
  gbAgentId: 'Please enter the agent id',
  gbPassword: 'Please enter the agent password',
  gbAgentPort: 'Please enter the local port.',
  gbAgentChannel: 'Please enter the channel.',
  // RTSP
  rtspUserName: 'Please enter the username.',
  rtspPassword: 'Please enter the password.',
  rtspPort: '8554',

  // map
  // You can apply on the AMap website.
  amapKey: 'aac4b48740729d3d0f69ec9f9f5d0c32',

}
export function getCloadWebSocketURL () {
  const token: string = localStorage.getItem('token') || '' as string
  return CURRENT_CONFIG.websocketURL + '?x-auth-token=' + encodeURI(token)
}

export function getJxWebSocketURL () {
  const token: string = localStorage.getItem('Authorization') || '' as string
  const account: string = JSON.parse(localStorage.getItem('userinfo2') as string).account || ''
  return CURRENT_CONFIG.websocketURL2 + `/${account}/${token}`
}
