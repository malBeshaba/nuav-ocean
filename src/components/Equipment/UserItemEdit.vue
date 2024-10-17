<template>
    <div class = "create-user-container">

        <!-- 根标签 -->
        <el-form
            :model="form"
            status-icon
            :rules="rules"
            label-width="100px"
            class="register-form">

            <h2 class="title">{{title}}</h2>
            <div style="background-color: #ebf4fc;height:1px;"></div>
            <el-form-item label="姓名" prop="username">
                <el-input v-model="form.username"
                          placeholder="姓名作为登陆的唯一方式，一旦注册成功不可更改！"
                          maxlength="10"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input
                    type="password"
                    v-model="form.password"
                    placeholder="请输入密码"
                    autocomplete="off"
                    maxlength="16"
                ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input
                    type="password"
                    v-model="form.checkPass"
                    placeholder="请再次输入密码"
                    autocomplete="off"
                    maxlength="16"
                ></el-input>
            </el-form-item>

            <el-form-item label="人员类型"  prop="user_type" style="text-align:left">
                <el-input v-model="form.user_type" maxlength="20"></el-input>
            </el-form-item>

            <el-form-item label="昵称" prop="nick_name">
                <el-input v-model="form.nick_name" maxlength="20"></el-input>
            </el-form-item>

            <el-form-item label="性别"  prop="gender" style="text-align:left">
                <el-radio-group v-model="genders" >
                    <el-radio value="0">男</el-radio>
                    <el-radio value="1">女</el-radio>
                </el-radio-group>
            </el-form-item>

<!--            <el-form-item label="年龄"  prop="age" style="text-align: left">-->
<!--                <el-input v-model="form.age" maxlength="2"></el-input>-->
<!--            </el-form-item>-->

            <el-form-item label="电话" prop="cellphone">
                <!--                <el-input v-model="form.cellphone" maxlength="11" @input="onInput('keyName', $event) " :placeholder = "phonePlaceholder"></el-input>-->
                <el-input v-model="form.cellphone"  ></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <!--                <el-input v-model="form.cellphone" maxlength="11" @input="onInput('keyName', $event) " :placeholder = "phonePlaceholder"></el-input>-->
                <el-input v-model="form.email" ></el-input>
            </el-form-item>

            <el-form-item style="margin-left:-20px" >
                <el-button type="primary" @click="submit()" style="font-size: 18px">提交</el-button>
<!--                <el-button type="primary" @click="clear" style="font-size: 18px">清空</el-button>-->
                <el-button type="primary" @click="back" style="font-size: 18px">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import {reactive,toRefs,ref,onMounted, computed} from "vue"
import {useRoute} from "vue-router"
import {addUser,updateUser} from "@/api/adminUser";
import router from "@/router";

const route = useRoute()

const props = reactive({
    title: route.query.title as string,
    userInfo :JSON.parse(route.query.userInfo as string),
})

const {title,userInfo} = toRefs(props)

const form = reactive({
    checkPass: '',
    ...userInfo.value,
})

onMounted(()=>{
		console.log("userInfo",userInfo.value)
})

const genders = computed(()=>{
	if(props.userInfo.gender === true) {
		return '1'
	} else if(props.userInfo.gender === false) {
		return '0'
	}
})


const haveUserName = ref(true)
const havePassword = ref(true)

const rules = {
    username: [{required: true, message: "请输入账号", trigger: "blur"},
        {min: 1, max: 20, message: '请勿超过20个字符！', trigger: 'blur'},
        {validator: (rule, value, callback) => {
                const reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/  //正则表达式 只能输入英文、汉字与数字
                if (!reg.test(value)) {
                    haveUserName.value = false
                    callback(new Error('请勿输入特殊字符'))

                } else {
                    haveUserName.value =  true
                    callback()
                    // console.log("this",this)
                }}}
    ],
    password: [{required: true, message: "请输入密码", trigger: "blur"},
    ],
    checkPass: [{required: true, message: "请再次输入密码", trigger: "blur"},
        {validator: (rule, value, callback) => {
                if (value !== form.password) {
                    havePassword.value = false
                    callback(new Error("两次输入密码不一致"));

                } else {
                    havePassword.value = true
                    callback()
                }}}]
}

const submit = async () => {
    if(haveUserName.value && havePassword.value){
        let user_type = 1
        switch (form.user_type) {
            case "web":
                user_type = 1
                break
            case "遥控器、机场端":
                user_type = 2
                break
            case "App":
                user_type = 3
                break
            default:
                user_type = 1
        }

        // 更新 userInfo 中的属性
        let postData={
                user_id:form.user_id,
                username: form.username,
                workspace_name: form.workspace_name,
                user_type: user_type,
                mqtt_username: form.mqtt_username,
                mqtt_password: form.mqtt_password,
                // create_time: form.create_time,
                icon: form.icon,
                email: form.email,
                cellphone: form.cellphone,
                nick_name: form.nick_name,
                gender: Number(form.gender),
                note: form.note,
                status: form.status
        }
        if(title.value == "编辑用户"){
            await updateUser(postData).then(res=>{
                // console.log(res)
                if (res.data.code == 0) {
                    ElMessage({
                        message: "用户信息修改成功",
                        type: 'success',
                    })
                }
                else {
                    ElMessage.error("用户信息修改失败",res.data.message)
                    // this.$message.error('用户更新失败');
                }
            })
        }else{
            await addUser(postData).then(res=>{
                if (res.data.code == 0) {
                    ElMessage({
                        message: "用户添加成功",
                        type: 'success',
                    })
                }
                else {
                    ElMessage.error("用户添加失败",res.data.message)
                    // this.$message.error('用户更新失败');
                }
            })
        }
    }
}

const back = ()=>{
    // history.back()
    router.push({path: '/default/resource'})
}

</script>

<style scoped>
.create-user-container{
    position: absolute;
    z-index: 5;
    width :100%;
    height :100%;
    color :#ebf4fc;
    background-color: rgba(10,11,14,0.7);
}
:deep(.el-form-item__label){
    color:white;
    font-size:18px;
    margin-top:8px
}

:deep(.el-radio__input.is-checked + .el-radio__label){
    color:#3a8ce0;
    font-size:18px
}
:deep(.el-button--primary){

    --el-button-hover-bg-color:#3a8ce0
}
:deep(.el-form-item__content){
    margin-left:50px
}
:deep(.el-radio__input.is-checked .el-radio__inner){
    border-color:#3a8ce0;
    background:#3a8ce0
}

.title{
    width :100%;
    height: 50px;
    padding-left: 5px;
    line-height: 50px;
    background-color: rgba(10,11,14,0.1);
    margin-top: 0px;
    margin-bottom :0px;
    text-align: center;
}
</style>
