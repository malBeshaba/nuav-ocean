interface ImportMetaEnv {
    readonly VITE_BASE_URL: string
    readonly VITE_BASE_URL2: string
    readonly VITE_WEBSOCKET_URL: string
    readonly VITE_MOBILE_SOCKET_URL: string
    readonly VITE_SOCKET_URL: string
    readonly VITE_APIGATEWAY_BACKEND_HOST: string
    readonly VITE_CESIUM_TOKEN: string
    readonly VITE_TIANDITU_TOKEN: string
    readonly VITE_AERIALVIEW_TOKEN: string
    readonly VITE_SCNU_3DTILESET_URL: string
    readonly VITE_MAP_CENTER_POSITION: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}
