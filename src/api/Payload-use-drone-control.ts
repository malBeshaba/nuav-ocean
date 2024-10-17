import { ref } from 'vue'
import { postFlyToPoint, PostFlyToPointBody, deleteFlyToPoint, postTakeoffToPoint, PostTakeoffToPointBody } from '@/api/drone-control/drone'


export function useDroneControl () {
    const droneControlPanelVisible = ref(false)

    function setDroneControlPanelVisible (visible: boolean) {
        droneControlPanelVisible.value = visible
    }

    async function flyToPoint (sn: string, body: PostFlyToPointBody) {
        const { code } = await postFlyToPoint(sn, body)
        if (code === 0) {
            ElMessage.success('Fly to')
        }
    }

    async function stopFlyToPoint (sn: string) {
        const { code } = await deleteFlyToPoint(sn)
        if (code === 0) {
            ElMessage.success('Stop fly to')
        }
    }

    async function takeoffToPoint (sn: string, body: PostTakeoffToPointBody) {
        const { code } = await postTakeoffToPoint(sn, body)
        if (code === 0) {
            ElMessage.success('Take off successfully')
        }
    }

    return {
        droneControlPanelVisible,
        setDroneControlPanelVisible,
        flyToPoint,
        stopFlyToPoint,
        takeoffToPoint
    }
}
