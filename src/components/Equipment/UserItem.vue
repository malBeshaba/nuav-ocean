<template>
    <div class="user-item">
        <el-row :class="bgHeightlight?'detailed_list_item_':'detailed_list_item'" @mouseover="bgHeightlight=true" @mouseleave="bgHeightlight=false"
                style="border-bottom: 1px solid #232f3f;">

            <el-col :span="5" :style="runStyle" class="img_left">
                <el-avatar style="width: 100%; height: 100%" fit="fill"
                           :src="userInfo.icon"
                />
            </el-col>

            <el-col :span="19" style="padding-left: 10px;">
                <div class="head" id="head">
                    <div class="atitle" id="atitle" style="font-size: 14px;">{{ userInfo.username }}</div>
                    <div class="state_1" id="state">{{ userInfo.user_type}}</div>
                    <span :class="'more '+userInfo.user_id+ ' iconfont icon-dian'" id="more" style="color: #737f8b;"
                          @click.stop="moreBlock"></span>
                </div>
                <div class="introduction" id="introduction">{{ userInfo.note }}</div>
                <div class="tail" id="tail">
                    <div class="tail_left" id="tail_left">
                        <div style="margin-top: 4px;">电话: {{ userInfo.cellphone }}</div>
                    </div>
                    <div class="tail_right" id="tail_right">
                        <div>创建时间:</div>
                        <div class="time" id=time>{{ userInfo.create_time }}</div>
                    </div>
                </div>
                <div class="operation" id="operation" v-if="isShow" ref="opera">
                    <div>
                        <button :class="isHeightlight=='edit'? 'bt1': 'bt' +' edit'" id="edit"
                                @mouseover="isHeightlight='edit'" @mouseleave="isHeightlight=''"
                                @click="edit">编辑
                        </button>
                    </div>
                    <div>
                        <button :class="isHeightlight=='detail'? 'bt1': 'bt' +' detail'" id="detail"
                                @mouseover="isHeightlight='detail'" @mouseleave="isHeightlight=''"
                                @click="chat">删除
                        </button>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>


<script setup lang="ts">
import {computed, onMounted, reactive,ref, watch,toRaw} from 'vue';
import {deleteUser} from "@/api/adminUser";
import {useRouter} from "vue-router"

const Props = defineProps<{
    userInfo: {
        user_id:string,
        username: string,
        workspace_name: string,
        user_type: string,
        mqtt_username: string,
        mqtt_password: string,
        create_time: string,
        icon: string,
        email: string,
        cellphone: string,
        nick_name: string,
        gender: boolean,
        note: string,
        status: boolean

    },
}>()

const userInfo = reactive({...toRaw(Props.userInfo)})
// 使用computed根据userInfo.userType来计算StateName
// const StateName = computed(() => {
//     switch (String(userInfo.userType)) {
//         case "1":
//             return "执法人员"
//         case "2":
//             return "飞手"
//         default :
//             return "未知身份"
//     }
// })

// const getTime = computed(()=>{
//       return userInfo.createTime.toLocaleDateString().replace(/\//g, "-") + " " + userInfo.createTime.toTimeString().substr(0, 8)
// })

const moreBlock = () => {
    isShow.value = !isShow.value
}
const emit = defineEmits(["delete-user"])

const chat = () => {
    deleteUser(userInfo.user_id).then(res => {
        console.log(res)
        emit('delete-user', userInfo.user_id)
    })
}


const router = useRouter()
const edit = ()=>{
    // console.log(111111)
    router.push({
        path:"/default/resource/editOrCreateUser",
        query:{
            userInfo:JSON.stringify(userInfo),
            title:"编辑用户"
        }
    })
}


const stayStyle = reactive({'border': '2px solid #09bf94'})
const runStyle = reactive({'border': '2px solid #bfc2c6'})
const dronevideo_frame = ref(false)
const data = ref('wurenji')
const isShow = ref(false)
const isHeightlight = ref('')
const bgHeightlight = ref(false)
const contentList = ['edit', 'detail', 'run', 'pause', 'continue', 'achievements', 'delete', 'cancel']
const isChatShow = ref(false)
const showList = ref(false)
</script>

<style scoped lang="scss">
/*//@import "//at.alicdn.com/t/c/font_3880304_af4x2y6g26a.css"*/
.detailed_list_item_ {
    display: flex;
    padding-left: 10px;
    position: relative;
}

.left{
    margin-top: 13px;
    margin-right: 10px;
    width :24%;
    height: 24%;
    border-radius: 50%;
}

.img{
    height :100%;
    width :100%;
    padding-top: 15px;
    padding-bottom :15px;
}

.jimg{
    height: 100%;
    width: 100%;
    padding-top :10px;
    padding-bottom :10px;
}

.right{
    display: flex;
    flex-direction: column;
    width: 100%;
}

.img_left{
    width: 76px;
    height: 76px;
    border-radius: 50%;
    // padding: 10px;
    margin: auto;
}

.head{
    display: flex;
    position: relative;
    padding-top: 12px;
    align-items: center;
}

.state_0{
    margin-left: 10px;
    color :#3980e8;
    font-size :8px;
    text-align :center;
    line-height: 16px;
    padding: 1px 5px 2px 5px;
    border :1px solid #3980e8;
}

.state_1{
    margin-left: 10px;
    color :#06c799;
    font-size :8px;
    text-align :center;
    line-height: 16px;
    padding: 1px 5px 2px 5px;
    border: 1px solid #06c799
}

.atitle{
    color: #e3e9ef;
    letter-spacing: 1.2px
}

.more{
    position: absolute;
    right: 25px
}

.introduction{
    padding-top :12px;
    font-size: 12px;
    transform :scale(0.9);
    color :#e3e9ef;
    letter-spacing :1.5px;
    line-height :16px;
    font-weight :400;
    margin-left: -15px;
}

.tail{
    display: flex;
    padding-top :13px;
    color :#777f8a;

    position :relative;
    align-items :center;
    padding-bottom :13px;
}

.tail_left{
    display: flex;
    color: #e3e9ef;
    font-size :12px;
    transform: scale(0.8);
    margin-left :-10px;
}

.tail_right{
    position: absolute;
    display: flex;
    right: 25px;
    font-size: 12px;
    transform: scale(0.8);
    margin-top: 3px;
    margin-right: -15px;
}

.operation{
    position: absolute;

    right: -1px;
    z-index: 100;
    top :30px;
    line-height: 30px;
    color :#e9f0f6;
    font-size :12px;
}

.bt{
    padding: 3px;
    padding-left: 14px;
    padding-right :14px;
    background-color :#596674;
}

.bt1{
    padding :3px;
    padding-left: 14px;
    padding-right :14px;
    background-color :#181d20;
}

.chatView{
    position :fixed
}

.admintask{
    position :fixed
}

</style>
