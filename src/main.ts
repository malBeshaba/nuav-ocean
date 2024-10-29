import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store, {storeKey} from './store'
import './index.css'
import 'normalize.css/normalize.css'
import VueCookies from 'vue3-cookies'
import 'element-plus/theme-chalk/dark/css-vars.css' // Enable Element Plus Dark Mode
import './css/elementUI.css'

localStorage.setItem("token","eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ3b3Jrc3BhY2VfaWQiOiJlM2RlYTBmNS0zN2YyLTRkNzktYWU1OC00OTBhZjMyMjgwNjkiLCJzdWIiOiJDbG91ZEFwaVNhbXBsZSIsInVzZXJfdHlwZSI6IjEiLCJuYmYiOjE3MjkxNTM0NjcsImxvZyI6IkxvZ2dlcltjb20uZGppLnNhbXBsZS5jb21tb24ubW9kZWwuQ3VzdG9tQ2xhaW1dIiwiaXNzIjoiREpJIiwiaWQiOiJhMTU1OWU3Yy04ZGQ4LTQ3ODAtYjk1Mi0xMDBjYzQ3OTdkYTIiLCJleHAiOjE4MTU1NTM0NjcsImlhdCI6MTcyOTE1MzQ2NywidXNlcm5hbWUiOiJhZG1pblBDIn0.MR0-8jApvPA4JutgvHeAoQNkkTCe6hoydPBFMUouRLk")
localStorage.setItem("userInfo",JSON.stringify({"username":"adminPC","user_id":"a1559e7c-8dd8-4780-b952-100cc4797da2","workspace_id":"e3dea0f5-37f2-4d79-ae58-490af3228069","user_type":1,"mqtt_username":"admin","mqtt_password":"admin","access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ3b3Jrc3BhY2VfaWQiOiJlM2RlYTBmNS0zN2YyLTRkNzktYWU1OC00OTBhZjMyMjgwNjkiLCJzdWIiOiJDbG91ZEFwaVNhbXBsZSIsInVzZXJfdHlwZSI6IjEiLCJuYmYiOjE3MzAwOTc5NDUsImxvZyI6IkxvZ2dlcltjb20uZGppLnNhbXBsZS5jb21tb24ubW9kZWwuQ3VzdG9tQ2xhaW1dIiwiaXNzIjoiREpJIiwiaWQiOiJhMTU1OWU3Yy04ZGQ4LTQ3ODAtYjk1Mi0xMDBjYzQ3OTdkYTIiLCJleHAiOjE4MTY0OTc5NDUsImlhdCI6MTczMDA5Nzk0NSwidXNlcm5hbWUiOiJhZG1pblBDIn0.fcU_UEZrbUeOM9Ook8m74RgeJG1kpLOc5Oruz93Pi5Q","mqtt_addr":"tcp://218.192.106.100:1883","create_time":"2021-10-22 18:26:50"}))

const Vpp = createApp(App)
    .use(router)
    .use(store, storeKey)
    .use(VueCookies)

Vpp.config.errorHandler = (err) => {
    console.log(err , '!!!!!!!')
}

Vpp.mount('#app')
