import {ElMessage} from 'element-plus'
import {
    postPayloadAuth,
    postPayloadCommands,
    PayloadCommandsEnum,
    PostCameraModeBody,
    PostCameraFocalLengthBody,
    PostGimbalResetBody,
    PostCameraAimBody,
} from "@/api/drone-control/payload"
import {ControlSource} from "@/store/types/device";

export function usePayloadControl () {
    function checkPayloadAuth (controlSource?: ControlSource) {
        if (controlSource !== ControlSource.A) {
            ElMessage.error('Get Payload Control first')
            return false
        }
        return true
    }

    async function authPayload (sn: string, payloadIndx: string) {
        const { code } = await postPayloadAuth(sn, {
            payload_index: payloadIndx
        })
        if (code === 0) {
            ElMessage.success('Get Payload Control successfully')
            return true
        }
        return false
    }

    async function resetGimbal (sn: string, data: PostGimbalResetBody) {
        const { code } = await postPayloadCommands(sn, {
            cmd: PayloadCommandsEnum.GimbalReset,
            data: data
        })
        if (code === 0) {
            ElMessage.success('Gimbal Reset successfully')
        }
    }

    async function switchCameraMode (sn: string, data: PostCameraModeBody) {
        const { code } = await postPayloadCommands(sn, {
            cmd: PayloadCommandsEnum.CameraModeSwitch,
            data: data
        })
        if (code === 0) {
            ElMessage.success('Camera Mode Switch successfully')
        }
    }

    async function takeCameraPhoto (sn: string, payloadIndx: string) {
        const { code } = await postPayloadCommands(sn, {
            cmd: PayloadCommandsEnum.CameraPhotoTake,
            data: {
                payload_index: payloadIndx
            }
        })
        if (code === 0) {
            ElMessage.success('Take Photo successfully')
        }
    }

    async function startCameraRecording (sn: string, payloadIndx: string) {
        const { code } = await postPayloadCommands(sn, {
            cmd: PayloadCommandsEnum.CameraRecordingStart,
            data: {
                payload_index: payloadIndx
            }
        })
        if (code === 0) {
            ElMessage.success('Start Recording successfully')
        }
    }

    async function stopCameraRecording (sn: string, payloadIndx: string) {
        const { code } = await postPayloadCommands(sn, {
            cmd: PayloadCommandsEnum.CameraRecordingStop,
            data: {
                payload_index: payloadIndx
            }
        })
        if (code === 0) {
            ElMessage.success('Stop Recording successfully')
        }
    }

    async function changeCameraFocalLength (sn: string, data: PostCameraFocalLengthBody) {
        const { code } = await postPayloadCommands(sn, {
            cmd: PayloadCommandsEnum.CameraFocalLengthSet,
            data: data,
        })
        if (code === 0) {
            ElMessage.success('Zoom successfully')
        }
    }

    async function cameraAim (sn: string, data: PostCameraAimBody) {
        const { code } = await postPayloadCommands(sn, {
            cmd: PayloadCommandsEnum.CameraAim,
            data: data,
        })
        if (code === 0) {
            ElMessage.success('Zoom Aim successfully')
        }
    }

    return {
        checkPayloadAuth,
        authPayload,
        resetGimbal,
        switchCameraMode,
        takeCameraPhoto,
        startCameraRecording,
        stopCameraRecording,
        changeCameraFocalLength,
        cameraAim,
    }
}
