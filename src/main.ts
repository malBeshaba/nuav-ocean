import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store, {storeKey} from './store'
import './index.css'
import 'normalize.css/normalize.css'
import VueCookies from 'vue3-cookies'
import 'element-plus/theme-chalk/dark/css-vars.css' // Enable Element Plus Dark Mode
import './css/elementUI.css'

const Vpp = createApp(App)
    .use(router)
    .use(store, storeKey)
    .use(VueCookies)

Vpp.config.errorHandler = (err) => {
    console.log(err , '!!!!!!!')
}

Vpp.mount('#app')
