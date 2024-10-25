<template>
  <div class="largeScreen-navbar">
    <div class="left-nav-container">
      <span
          v-for="item in navbarData"
          :key="item.id"
          @click="handleSelect(item)"
      >
        <navigation-btn
            :title="item.name"
            :selected="curPageName === item.name"
            position="left"
        ></navigation-btn>
      </span>
    </div>
    <div class="sysTitle-container">
      <img :src="sysTitleImg" />
    </div>
    <div class="right-nav-container">
      <span
          v-for="item in navbarData2"
          :key="item.id"
          @click="handleSelect(item)"
      >
        <navigation-btn
            :title="item.name"
            :selected="curPageName===item.name"
            position="right"
        ></navigation-btn>
      </span>
      <el-dropdown
          class="avatar-container right-menu-item hover-effect"
          placement="bottom"
          trigger="click"
      >
        <div class="avatar-wrapper">
          <img
              v-if="!userImg"
              :src="defaultUserImg"
              class="user-avatar"
          />
          <img v-else :src="userImg" class="user-avatar" />
          <span class="user-text" v-html="userName" />
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item>
              修改密码
            </el-dropdown-item>
            <el-dropdown-item>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue'
// import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import NavigationBtn from '@/components/Navigation/components/NavigationBtn.vue'
import sysTitleImg from '@/assets/images/sysTitle.png'
import defaultUserImg from '@/assets/images/default-user-img.png'
// import { ChangePassword, getInfo } from '@/api/user'
// import { userLogout } from '@/api/javaApi/user.js'
// import { removeAllCookie, getID } from '@/utils/auth'

// const store = useStore()
const route = useRoute()
const router = useRouter()

const dialogFormVisible = ref(false)
const PerdialogFormVisible = ref(false)
const PassWordComplexity = ref('')
const showtext = ref(true)
const curPageName = ref('无人机巡航')

const temp = ref({
  oldPass: '',
  newPass: '',
  resPass: ''
})
const Pertemp = ref({
  userName: '',
  head_url: '',
  deptNames: '',
  emailAddress: '',
  gender: '',
  phoneNumber: '',
  roleNames: ''
})
const navbarData = ref([
  { id: 1, name: '首页', type: 'overview', sort: 1 },
  { id: 2, name: '视频监管', type: 'warning', sort: 2 },
  { id: 3, name: '无人机巡航', type: 'clue', sort: 3 }
])
const navbarData2 = ref([
  { id: 4, name: '核查预警', type: 'patrol', sort: 4 },
  { id: 5, name: '算法仓', type: 'monitoring', sort: 5 }
])

const userName = ref("admin")


const handleSelect = (item) => {

  if(item.name === curPageName.value) {
    return
  }

  // localStorage.setItem('curPageName', item.name)

  // 跳转至对应页面
  switch (item.name){
    case '首页':
      location.href = import.meta.env.VITE_AEF_URL+"#/LargeScreen?type=overview"
      // router.push('/overview')
      break
    case '视频监管':
      location.href = import.meta.env.VITE_AEF_URL+"#/LargeScreen?type=patrol"
      // router.push('/warning')
      break
    case '无人机巡航':
      // router.push('/clue')
      break
    case '核查预警':
      location.href = import.meta.env.VITE_OCEAN_URL + '#/verification-warning'
      // router.push('/verification-warning')
      break
    case '算法仓':
      location.href = import.meta.env.VITE_OCEAN_URL + '#/algorithm-house'

      // router.push('/algorithm-house')
      break
  }
}

const setUrlQueryParam = (type) => {
  var url = window.location.href
  var str = url.split('?')[0]
  var newUrl = ''
  const searchParams = new URLSearchParams()
  const query = route.query
  if (query) {
    for (const key in query) {
      searchParams.set(key, query[key])
    }
  }
  if (type) {
    searchParams.set('type', type)
  }
  newUrl = `${str}?${searchParams.toString()}`
  window.history.pushState({}, '', newUrl)
}

const logout = async () => {
  // await userLogout()
  // store.dispatch('user/logout')
  // removeAllCookie()
  // router.push(`/login`)
}

const profile = async () => {
  // const UserID = getID()
  // const res = await getInfo(UserID)
  // Pertemp.value = res.data.result
  // PerdialogFormVisible.value = true
}

const changePass = () => {
  // temp.value = {
  //   oldPass: '',
  //   newPass: '',
  //   resPass: ''
  // }
  // PassWordComplexity.value = ''
  // dialogFormVisible.value = true
}

const UpdatePassWord = () => {
  // store.dispatch('user/changePassword', {
  //   currentPassword: temp.value.oldPass,
  //   newPassword: temp.value.newPass
  // }).then(() => {
  //   dialogFormVisible.value = false
  //   logout()
  // }).catch(error => {
  //   console.error(error)
  // })
}

const CodePassWord = (val) => {
  if (val === '') {
    PassWordComplexity.value = ''
  }
  const weakreg = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/
  if (weakreg.test(val)) {
    PassWordComplexity.value = 'weak'
  }
  const inreg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/
  if (inreg.test(val)) {
    PassWordComplexity.value = 'in'
  }
  const strongreg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/
  if (strongreg.test(val)) {
    PassWordComplexity.value = 'strong'
  }
}

onMounted(() => {
  // // 加载本地localStorage中的curPageName
  // const storedPageName = localStorage.getItem('curPageName');
  // if (storedPageName && !storedPageName.includes()) {
  //   curPageName.value = storedPageName;
  // }
  // console.log('curPageName11111111111111111111111111111111111111111111', curPageName.value)

  // 获取当前的路由地址来判断当前页面，给curPageName.value赋值
  const path = route.path
  if (path.includes( '/overview')) {
    curPageName.value = '首页'
  } else if (path.includes('/warning')) {
    curPageName.value = '视频监管'
  } else if (path.includes('/clue')) {
    curPageName.value = '无人机巡航'
  } else if (path.includes('/verification-warning')) {
    curPageName.value = '核查预警'
  } else if (path .includes('/algorithm-house')) {
    curPageName.value = '算法仓'
  }
})

</script>

<style lang="scss" scoped>
.largeScreen-navbar {
  position: relative;
  width: 100%;
  height: 90px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: distribute;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 16px;
  pointer-events: none;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
}
.left-nav-container {
  width: 35%;
  display: flex;
  justify-content: flex-end;
  gap: 18px;
  margin-bottom: 24px;
  pointer-events: all;
}
.right-nav-container {
  width: 35%;
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  pointer-events: all;
}
.sysTitle-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 30%;
  height: 100%;
  padding: 0 5%;
  background-image: url(../../assets/images/sysTitleBg1.png);
  background-size: 100% 100%;
}
.sysTitle-container img {
  margin-top: 24px;
  max-width: 100%;
}
.time-container {
  width: 150px;
  max-width: 10vw;
}
.avatar-container {
  margin-left: auto;
  display: flex;
  align-items: center;
}
.avatar-container .avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 30px;
}
.avatar-container .avatar-wrapper .user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  margin-right: 6px;
}
.avatar-container .avatar-wrapper .user-text {
  font-size: 14px;
  color: #fff;
}

.right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 40px;
  font-size: 18px;
  color: #fff;

  &.hover-effect {
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
}

</style>