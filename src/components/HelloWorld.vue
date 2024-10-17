<template>
  <h1>{{ msg }}</h1>
  <button @click="loginB">count is: {{ count }}</button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
</template>

<script>
import {login} from '@/api/login'
import router from "@/router";
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    try111() {
      console.log(import.meta.env)
    },
    loginB() {
      login({
        username: 'webtestwsy',
        password: 'webtestwsy',
        flag: 1
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          localStorage.setItem("token", res.data.access_token);
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          console.log(JSON.stringify(res.data))
        }
      })
    },
    pushMap() {
      router.push('/map')
    }
  }
}
</script>
