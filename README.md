# 无人机平台前端开发

## 开发规范

## 组件（文件）名称

1. 所有组件使用 `SFC` 形式编写；
2. 凡是跟组件名相关的（组件名、文件名及在模板中使用），都必须采用大驼峰 `PascalCase` 形式；
3. 要用多个单词，避免与 `HTML`（未来）组件冲突；
4. 一个文件只允许存在一个组件；
5. 与父组件紧密耦合的子组件，命名要**以父组件名为前缀**，例：`TodoList`、`TodoListItem`、`TodoListItemButton`;
6. 一般化描述放前，特殊化描述放后，例：`SearchButtonClear`、`SettingsCheckboxLaunchOnStartup`;
7. 起名尽量使用**完整单词**而不是缩写。

## 属性相关

1. `defineProps`、`defineEmits` 要用**类型声明**的方式，而非运行时声明；
2. 一定要为 `v-for` 设置 `key`，且尽量不要用 `index`；
3. `v-if` 和 `v-for` 禁止同时出现在一个组件上；
4. 始终使用指令缩写，即`:`、`@`、`#`，除了 `v-bind="obj"` 这种情况。

## 其他

1. scoped 中尽量避免使用元素选择器，
2. 代码中禁止出现 `this.$parent`、`this.$root` 之类的访问祖先组件的代码，防止数据流混乱；
3. 使用 `hooks` 代替 `HOC`（高阶组件）和 `renderProps`；
4. `hooks`、`utils`、`constants`、`types` 等文件，就近（尽量深）存放，必要时才做目录提升。



## 关键方法调用

此章节描述request、webSocket、store方法的调用模式及规范。

## request方法

使用utils/request方法，使用异步函数声明进行请求，要求严格的参数类型声明，示例如下：

```typescript
import request from '@/utils/request' // 导入request/index.ts文件内封装方法

const loginURL = '/manage/api/v1/login' // 配置URL，baseURL在环境配置文件内配置

interface loginParam {
    username: String,
    password: String,
    flag: number
} // 定义输入参数类型

export const login = async function (body: loginParam) {
    const url = `${loginURL}`
    const result = await request.post(url, body)
    return result.data
}
```

## webSocket方法

使用utils/websocket方法，内部封装了ConnectWebSocket类，包含初始化、消息注册、消息监听、发送消息等方法，建议通过`hooks`方法调用。示例如下：

```typescript
import { onMounted, onUnmounted } from 'vue'
import ConnectWebSocket, { MessageHandler } from '@/utils/websocket'

export function useConnectWebSocket (messageHandler: MessageHandler) {
  const webSocket = new ConnectWebSocket(getCloadWebSocketURL())

  onMounted(() => {
    webSocket?.registerMessageHandler(messageHandler)
    webSocket?.initSocket()
  })

  onUnmounted(() => {
    webSocket?.close()
  })
}
```

MessageHandler是用于接收消息并处理消息的回调，示例如下：

```typescript
export function messageHandler (payload: any) {
  if (!payload) {
    return
  }
  switch (payload.biz_code) {
    case EBizCode.DockOsd:
      store.commit('SET_DOCK_INFO', payload.data)
      break
    case EBizCode.DeviceOsd:
      // store.commit('SET_DEVICE_INFO', payload.data)
      break
    case EBizCode.DeviceOffline:
      store.commit('CLEAR_DEVICE_INFO', payload.data.sn)
      break
    default:
      break
  }
}
```

## store 方法

store方法包含state、getter、mutation、action部分，使用方法和vue2中相同，仅需注意在不同区域的声明不同。示例如下：

```typescript
// ts文件中使用直接引入的方式
import store from "@/store"

// vue文件中script部分,使用use方法调用
import {useMyStore} from "@/store"
const store = useMyStore()
```

## scss 方法
scss用于定义全局CSS变量，统一背景颜色、选中颜色、字体属性等。示例如下：

```scss
// 在globalVariable.scss中加入全局属性
$TouchColor : #f9a205;

// 在.vue文件中使用
<style scoped lang="scss">
.title {
  color: $TouchColor;
}
</style>
```

