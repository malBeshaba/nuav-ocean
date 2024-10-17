<template>
  <div class="loginbody">
    <div class="logindata">
      <div class="logintext">
        <h2>欢迎登录</h2>
        <h2>低空无人机遥感平台</h2>
      </div>
      <div class="formdata">
        <el-form ref="ruleFormRef" :model="form" :rules="rules">
          <el-form-item prop="username">
            <el-input
                v-model="form.username"
                clearable
                placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
                v-model="form.password"
                clearable
                placeholder="请输入密码"
                show-password
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="tool">
        <div>
          <el-checkbox v-model="checked" @change="remenber"
          >记住密码</el-checkbox
          >
        </div>
        <div>
          <span class="shou" @click="forgetpas">忘记密码？</span>
        </div>
      </div>
      <div class="butt">
        <el-button type="primary" @click="submitForm(ruleFormRef)"
        >登录</el-button
        >
        <el-button class="shou" @click="register">注册</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import   { login } from "@/api/login";
import   { login2 } from "@/api/login2";
import { ref, reactive } from 'vue'
import store from '@/store'
import router from "@/router";
import {FormRules, FormInstance} from "element-plus";

const form = ref({
  password: "",
  username: "",
  flag: 1
})
const ruleFormRef = ref<FormInstance>()
const checked = ref(false)

const rules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" }
  ],
})
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log(valid, form.value)
      login(form.value).then(res => {
        console.log(res)
        if (res.code === 0) {
          localStorage.setItem("token", res.data.access_token);
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          console.log(JSON.stringify(res.data))
          ElMessage({
            message: "登录成功啦",
            type: "success",
            showClose: true,
          });
          router.replace("/");

          // login2({username:"userhnsf",password:"Hnsf@12345"}).then(res => {
          //   console.log(res)
          //   localStorage.setItem("Authorization", res.data.token);
          //   localStorage.setItem("userinfo2", JSON.stringify(res.data.userInfo));
          //
          //   ElMessage({
          //     message: "登录成功啦",
          //     type: "success",
          //     showClose: true,
          //   });
          //   router.replace("/");
          // })


        }
      })
    } else {
      console.log('error')
      ElMessage({
        message: "账户名或密码错误",
        type: "error",
        showClose: true,
      });
      return false
    }
  })
}

const remenberHandler = (data: boolean) => {
  checked.value = data
  if(checked.value){
    localStorage.setItem("news",JSON.stringify(form))
  }else{
    localStorage.removeItem("news")
  }
}

const forgetpasHandler = () => {
  ElMessage({
    type:"info",
    message:"功能尚未开发额😥",
    showClose:true
  })
}

const registerHandler = () => {}

</script>

<style scoped>
.loginbody {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  /*background-image: url("../assets/login2.jpg");*/
  background-color: #1c2127;
  background-size: 100% 100%;
  background-position: center center;
  overflow: auto;
  background-repeat: no-repeat;
  position: fixed;
  line-height: 100%;
  padding-top: 150px;
}

.logintext {
  margin-bottom: 20px;
  line-height: 50px;
  text-align: center;
  font-size: 28px;
  font-weight: bolder;
  color: white;
  text-shadow: 2px 2px 4px #000000;
}

.logindata {
  width: 400px;
  height: 300px;
  transform: translate(-50%);
  margin-left: 50%;
}

.tool {
  display: flex;
  justify-content: space-between;
  color: #606266;
}

.butt {
  margin-top: 10px;
  text-align: center;
}

.shou {
  cursor: pointer;
  color: #606266;
}

/*ui*/
/* /deep/ .el-form-item__label {
  font-weight: bolder;
  font-size: 15px;
  text-align: left;
}

/deep/ .el-button {
  width: 100%;
  margin-bottom: 10px;

} */
</style>
