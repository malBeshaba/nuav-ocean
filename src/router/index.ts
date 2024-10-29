import {createRouter, createWebHistory} from 'vue-router'
import {ElMessage} from "element-plus";
import store from "@/store"
// @ts-ignore
const router = createRouter({
    history: createWebHistory('hszx'),
    routes: [
        {
            path: '/',
            redirect: '/default/task'
        },
        {
            path: '/login',
            component: () => import('@/pages/Login/index.vue')
        },
        //测试新页面暂时创建的路由，写完就删掉
        {
            path: '/editwayline',
            component: () => import('@/pages/TaskDeployment/components/WaylineEdit/WaylineEditPanel.vue')
        },
        {
            path: '/default',
            component: () => import('@/pages/index.vue'),
            children: [
                {
                    path: 'control',
                    name: 'control',
                    // redirect: '/dronesv2/default/control/drone-list',
                    component: () => import('@/pages/ControlCenter/index.vue'),
                    children: [
                        {
                            path: 'drone-list',
                            components: {
                                equipment_list: () => import('@/pages/ControlCenter/components/EquipmentList/DroneList.vue')
                            }
                        },
                        {
                            path: 'dock-list',
                            components: {
                                equipment_list: () => import('@/pages/ControlCenter/components/EquipmentList/DockList.vue')
                            }
                        }
                    ]
                },
                {
                    path: 'task',
                    name: 'task',
                    component: () => import('@/pages/TaskDeployment/index.vue'),
                    children: [
                        {
                            path: '',
                            name: '任务部署',
                            components: {
                                task_list: () => import('@/components/Equipment/DeviceList.vue')
                            }
                        },
                        {
                            path: 'task-list',
                            components: {
                                task_list: () => import('@/pages/TaskDeployment/components/Task/TaskList.vue')
                            },
                            children: [{
                                path: 'detail',
                                components: {
                                    task_detail: () => import('@/pages/TaskDeployment/components/Task/TaskInfo.vue')
                                }
                            }]
                        },
                        {
                            path: 'jx-task-list',
                            components: {
                                task_list: () => import('@/pages/TaskDeployment/components/Task/JxTaskList.vue')
                            },
                            children: [{
                                path: 'detail',
                                components: {
                                    task_detail: () => import('@/pages/TaskDeployment/components/Task/JxTaskInfo.vue')
                                }
                            }]
                        },
                        {
                            path: 'create',
                            components: {
                                task_list: () => import('@/pages/TaskDeployment/components/CreateTask/CreateTask.vue')
                            },
                            children: [
                                {
                                    path: 'add-wayline',
                                    components: {
                                        wayline_list: () => import('@/pages/TaskDeployment/components/WayLine/WayLineList.vue')
                                    }
                                },
                                {
                                    path: 'new-wayline',
                                    components: {
                                        wayline_list: () => import('@/pages/TaskDeployment/components/WayLine/NewWayLine.vue')
                                    }
                                },
                                {
                                    path: 'new-wayline-1',
                                    components: {
                                        wayline_list: () => import('@/pages/TaskDeployment/components/WaylineEdit/WayLineInitialize.vue')
                                    }
                                },
                                {
                                    path: 'add-waypoint',
                                    components: {
                                        wayline_list: () => import('@/pages/TaskDeployment/components/WayPoint/AddWayPointActionPanel.vue')
                                    }
                                },

                            ]
                        },
                        {
                            path: 'jx-create',
                            components: {
                                task_list: () => import('@/pages/TaskDeployment/components/CreateTask/JxNewTask.vue')
                            },
                            children: [
                                {
                                    path: 'add-wayline',
                                    components: {
                                        jx_wayline_list: () => import('@/pages/TaskDeployment/components/WayLine/JxWaylineList.vue')
                                    }
                                },
                                {
                                    path: 'new-wayline',
                                    components: {
                                        jx_wayline_list: () => import('@/pages/TaskDeployment/components/WayLine/NewWayLine.vue')
                                    }
                                },
                                {
                                    path: 'add-waypoint',
                                    components: {
                                        jx_wayline_list: () => import('@/pages/TaskDeployment/components/WayPoint/AddWayPointActionPanel.vue')
                                    }
                                },
                                {
                                    path: 'import-wayline',
                                    components: {
                                        jx_wayline_list: () => import('@/pages/TaskDeployment/components/WayLine/JxImportWaylineList.vue')
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    path: 'edit-waypoint-v2',
                    component: () => import('@/pages/TaskDeployment/components/WaylineEdit/WaylineEditPanel.vue')
                },
                {
                    path: 'edit-waypoint-polygon-v2',
                    component: () => import('@/pages/TaskDeployment/components/WaylineEdit/WayLineByPolygon/WayLineEditPlane.vue')
                },
                {
                    path: 'edit-waypoint-point-v2',
                    component: () => import('@/pages/TaskDeployment/components/WaylineEdit/WayLineByPoint/WayLineEditP.vue')
                },
                {
                    name: 'home',
                    path: 'home',
                    component: () => import('@/pages/Home/index.vue')
                },
                {
                    path: 'resource',
                    name: 'resource',
                    component: () => import('@/pages/ResourceManagement/index.vue'),
                    children: [
                        {
                            path: '',
                            name: '资源管理',
                            components: {
                                resource_list: () => import('@/components/Equipment/DeviceList.vue')
                            }
                        },
                        {
                            path: 'editOrCreateUser',
                            name: "用户管理",
                            components: {
                                resource_list: () => import('@/components/Equipment/UserItemEdit.vue')
                            },

                        },
                        {
                            path: 'drone',
                            components: {
                                resource_list: () => import('@/pages/ResourceManagement/components/Drone/DroneDetailInfo.vue')
                            },
                        },
                        {
                            path: 'dock',
                            components: {
                                resource_list: () => import('@/pages/ResourceManagement/components/Dock/DockDetail.vue')
                            }
                        },
                        {
                            path: 'jxdock',
                            components: {
                                resource_list: () => import('@/pages/ResourceManagement/components/Dock/JxDockDetail.vue')
                            }
                        }
                    ]
                },
                {
                    path: 'result',
                    name: 'result',
                    component: () => import('@/pages/ResultData/index.vue'),
                    children: [
                        {
                            path: '',
                            name: '成果数据',
                            components: {
                                result_list: () => import('@/pages/ResultData/components/Data/DataList.vue')
                            },
                        },
                        {
                            path: 'task-list',
                            components: {
                                result_list: () => import('@/pages/ResultData/components/Task/TaskList.vue')
                            },
                            children: [
                                {
                                    path: 'photo',
                                    components: {
                                        result_detail: () => import('@/pages/ResultData/components/Data/PhotoList.vue')
                                    },
                                },
                                {
                                    path: 'video',
                                    components: {
                                        result_detail: () => import('@/pages/ResultData/components/Button/VideoList.vue')
                                    },
                                },
                                {
                                    path: 'videotape',
                                    components: {
                                        result_detail: () => import('@/pages/ResultData/components/Button/VideotapeList.vue')
                                    },
                                },
                                {
                                    path: 'video-replay',
                                    components: {
                                        result_detail: () => import('@/pages/ResultData/components/Button/VideoReplay.vue')
                                    },
                                }
                            ]
                        }
                    ]
                },
            ]
        },
        {
            path: '/map',
            name: 'map',
            component: () => import('../components/basemap.vue'),
        },
        {
            path: '/playback',
            name: 'playback',
            component: () => import('../pages/DroneVideoPlayback/index.vue'),
        },
        {
            path: '/player',
            name: 'player',
            component: () => import('@/components/video/WebrtcPlayer.vue')
        },
        {
            path:"/mainPageFrame",
            name:"mainPageFrame",
            component:()=>import('@/pages/MainPageFrame/MainPageFrame.vue')
        }
    ]
})
router.beforeEach((to, from, next) => {
    if (from.path.includes('/default/task/create') && !to.path.includes('/default/task/create') && !to.path.includes('/default/edit-waypoint')) {
        if (store.state.isComSaveCache.isAllow) {
            store.commit('CHANGE_CACHE_STYLE', {isReady: false, isAllow: false, path: '', query: {} as any})
            next()
        } else if (!store.state.isComSaveCache.isReady)
            store.commit('CHANGE_CACHE_STYLE', {isReady: true, isAllow: false, path: to.path, query: to.query})
    } else {
        next()
    }
    if (from.path === '/default/task/task-list' && to.path !=='/default/task/task-list') {
        store.commit('SET_IFRAME_DOCK_SN', '');
    }
    if (to.path === '/default/task/task-list') {
        store.commit('SET_IFRAME_DOCK_SN', to.query?.device_sn)
    }

    // if (localStorage.getItem('userInfo')) {
    //     if (from.path.includes('/default/task/create') && !to.path.includes('/default/task/create') && !to.path.includes('/default/edit-waypoint')) {
    //         if (store.state.isComSaveCache.isAllow) {
    //             store.commit('CHANGE_CACHE_STYLE', {isReady: false, isAllow: false, path: '', query: {} as any})
    //             next()
    //         } else if (!store.state.isComSaveCache.isReady)
    //             store.commit('CHANGE_CACHE_STYLE', {isReady: true, isAllow: false, path: to.path, query: to.query})
    //     } else {
    //         next()
    //     }
    // } else {
    //     switch (to.path) {
    //         case '/login':
    //             ElMessage({
    //                 message: "登录已过期，请重新登录！",
    //                 type: "error",
    //                 showClose: true,
    //             });
    //             next()
    //             break
    //     }
    //     next('/login')
    // }
})
router.afterEach((to, from) => {
    // sendToAnalytics(to.fullPath)
})
export default router
