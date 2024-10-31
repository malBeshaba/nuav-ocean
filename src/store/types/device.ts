

export interface GatewayOsd {
    capacity_percent: string,
    transmission_signal_quality: string,
    longitude: number,
    latitude: number,
}
export interface DeviceOsd {
    longitude: number,
    latitude: number,
    gear: number,
    mode_code: number,
    height: string,
    home_distance: string,
    horizontal_speed: string,
    vertical_speed: string,
    wind_speed: string,
    wind_direction: string,
    elevation: string,
    position_state: {
        gps_number: string,
        is_fixed: number,
        rtk_number: string
    },
    battery: {
        capacity_percent: string,
        landing_power: string,
        remain_flight_time: number,
        return_home_power: string,
    },
    night_lights_state?: NightLightsStateEnum;// 夜航灯开关
    height_limit?: number;// 限高设置
    distance_limit_status?: DistanceLimitStatus;// 限远开关
    obstacle_avoidance?: ObstacleAvoidance;// 飞行器避障开关设置
    attitude_head?: number;// 偏航轴角度
    attitude_pitch?: number;// 俯仰轴角度
    attitude_roll?: number;// 横滚轴角度
    cameras?: DeviceOsdCamera[],
    payloads: any[],
}
// 夜航灯开关
export enum NightLightsStateEnum {
    CLOSE = 0, // 0-关闭
    OPEN = 1, // 1-打开
}
// 限远开关
export enum DistanceLimitStatusEnum {
    UNSET = 0, // 0-未设置
    SET = 1, // 1-已设置
}

export interface DistanceLimitStatus {
    state?: DistanceLimitStatusEnum;
    distance_limit?: number; // 限远
}
// 避障
export enum ObstacleAvoidanceStatusEnum {
    CLOSE = 0, // 0-关闭
    OPEN = 1, // 1-开启
}

export interface ObstacleAvoidance {
    horizon?: ObstacleAvoidanceStatusEnum;// 水平避障开关
    upside?: ObstacleAvoidanceStatusEnum;// 上行方向避障开关
    downside?: ObstacleAvoidanceStatusEnum;// 下行方向避障开关
}
export enum DroneInDockEnum {
    INSIDE, OUTSIDE
}
export enum NetworkStateTypeEnum {
    FOUR_G = 1,
    ETHERNET = 2,
}

export enum RainfallEnum {
    NONE = 0,
    LIGHT_RAIN = 1,
    MODERATE_RAIN = 2,
    HEAVY_RAIN = 3,
}
// 机场声光报警状态
export enum AlarmModeEnum {
    CLOSE = 0, // 关闭
    OPEN = 1, // 开启
}

// 电池保养
export enum BatteryStoreModeEnum {
    BATTERY_PLAN_STORE = 1, // 电池计划存储策略
    BATTERY_EMERGENCY_STORE = 2, // 电池应急存储策略
}

// 4g链路连接状态
export enum FourGLinkStateEnum {
    CLOSE = 0, // 断开
    OPEN = 1, // 连接
}

//  Sdr链路连接状态
export enum SdrLinkStateEnum {
    CLOSE = 0, // 断开
    OPEN = 1, // 连接
}

// 机场的图传链路模式
export enum LinkWorkModeEnum {
    SDR = 0, // sdr模式
    FourG_FUSION_MODE = 1, // 4G融合模式
}
// 飞行器电池保养
export enum DroneBatteryStateEnum {
    NoMaintenanceRequired = 0, // 0-无需保养
    MaintenanceRequired = 1, // 1-待保养
    MaintenanceInProgress = 2, // 2-正在保养
}
export enum DrcStateEnum {
    DISCONNECT = 0,
    CONNECTING = 1,
    CONNECTED = 2
}

export interface DockBasicOsd {
    network_state: {
        type: NetworkStateTypeEnum,
        quality: number,
        rate: number,
    },
    drone_charge_state: {
        state: number,
        capacity_percent: number,
    },
    drone_in_dock: DroneInDockEnum,
    rainfall: RainfallEnum,
    wind_speed: number,
    environment_temperature: number,
    temperature: number,
    humidity: number,
    latitude: number,
    longitude: number,
    height: number,
    alternate_land_point: {
        latitude: number,
        longitude: number,
        height: number,
        safe_land_height: number,
        is_configured: number
    }
    first_power_on: number,
    positionState: {
        gps_number: number,
        is_fixed: number,
        rtk_number: number,
        is_calibration: number,
        quality: number,
    },
    storage: {
        total: number,
        used: number,
    },
    mode_code: number,
    cover_state: number,
    supplement_light_state: number,
    emergency_stop_state: number,
    air_conditioner: {
        air_conditioner_state: number,
        switch_time: number,
    }
    battery_store_mode?: BatteryStoreModeEnum; // 电池保养(存储)模式
    alarm_state?: AlarmModeEnum; // 机场声光报警状态
    putter_state: number,
    sub_device: {
        device_sn?: string,
        device_model_key?: string,
        device_online_status: number,
        device_paired: number,
    },
}

export interface DockLinkOsd {
    drc_state: DrcStateEnum,
    flighttask_prepare_capacity: number,
    flighttask_step_code: number,
    media_file_detail: {
        remain_upload: number
    },
    sdr: {
        up_quality: string,
        down_quality: string,
        frequency_band: number,
    },
    wireless_link?:{
        dongle_number: number, // dongle 数量
        ['4g_link_state']: FourGLinkStateEnum, // 4g_link_state
        sdr_link_state: SdrLinkStateEnum, // sdr链路连接状态
        link_workmode: LinkWorkModeEnum, // 图传链路模式
        sdr_quality: number, // sdr信号质量 0-5
        ['4g_quality']: number, // 4G信号质量 0-5
        ['4g_freq_band']: number,
        ['4g_gnd_quality']: number,
        ['4g_uav_quality']: number,
        sdr_freq_band: number,
    }
}

export interface MaintainStatus {
    state: number,
    last_maintain_type: number,
    last_maintain_time: number,
    last_maintain_work_sorties: number,
}

export interface DockWorkOsd {
    job_number: number,
    acc_time: number,
    activation_time: number,
    maintain_status: {
        maintain_status_array: MaintainStatus[]
    }
    electric_supply_voltage: number,
    working_voltage: string,
    working_current: string,
    backup_battery: {
        voltage: number,
        temperature: number,
        switch: number,
    }
    drone_battery_maintenance_info?: { // 飞行器电池保养信息
        maintenance_state: DroneBatteryStateEnum, // 保养状态
        maintenance_time_left: number, // 电池保养剩余时间(小时)
    }
}

export interface DockOsd {
    basic_osd: DockBasicOsd,
    link_osd: DockLinkOsd,
    work_osd: DockWorkOsd
}

// 设备类型
export enum DomainEnum {
    Drone = 0,
    Playload = 1,
    RemoteControl = 2,
    Dock = 3
}
// 是否绑定到工作区
export enum BoundStatusEnum {
    NotBound = 0,
    Bound = 1
}
export interface DeviceInfo {
    bound_status: BoundStatusEnum,
    bound_time: string,
    child_device_sn?: string,
    control_source: string,
    device_desc: string,
    device_name: string,
    device_sn: string,
    domain: DomainEnum,
    firmware_status: number,
    firmware_version: string,
    icon_url: {
        normal_icon_url: string,
        selected_icon_url: string
    },
    login_time: string,
    nickname: string,
    status: boolean,
    sub_type: number,
    type: number,
    workspace_id: string,
    workspace_name: string,
    children?: DeviceInfo
}
export interface DeviceInfoType {
    gateway: GatewayOsd, // 遥控器
    dock: DockOsd, // 机场
    device: DeviceOsd, // 飞机
}
export interface PayloadInfo {
    index: number,
    model: string,
    control_source?: ControlSource,
    payload_sn?: string,
    payload_index?: string,
    payload_name?: string,
}
export enum ControlSource {
    A = 'A',
    B = 'B'
}
export interface OsdCameraLiveview {
    bottom: number,
    left: number,
    right: number,
    top: number,
}
export enum CameraMode {
    Photo = 0, // 拍照
    Video = 1, // 录像
}
export interface DeviceOsdCamera {
    camera_mode: CameraMode,
    payload_index: string,
    photo_state: number,
    record_time: number,
    recording_state: number,
    remain_photo_num: number,
    remain_record_duration: number,
    liveview_world_region: OsdCameraLiveview
}

export interface checkDeviceState {
    sn: string,
    isShow: boolean,
    position: machinePosition,
    flyPath: number[]
}

export interface checkDockState {
    sn: string,
    isShow: boolean,
    position: machinePosition,
    deviceSn: string,
    deviceType: number,
}

interface machinePosition {
    longitude: number,
    latitude: number,
    height: number,
}

export interface JxDeviceState {
    altitude: string;
    batteryCycle: string;
    batteryPercent: string;
    batteryTemperature: string;
    batteryVoltage: string;
    compassState: string;
    downLink: string;
    gimbalPitch: string;
    gimbalRoll: string;
    gimbalYaw: string;
    gpsCount: string;
    gpsLevel: string;
    heading: string;
    horizontalSpeed: string;
    horizontalXSpeed: string;
    horizontalYSpeed: string;
    isCharging: string;
    isRanging: string;
    isRcOn: string;
    isRtkOn: string;
    isUavOn: string;
    latitude: string;
    longitude: string;
    pitch: string;
    roll: string;
    siteId: string;
    siteState: string;
    targetWaypointIndex: string;
    uavState: string;
    upLink: string;
    useLTE: string;
    verticalSpeed: string;
    yaw: string;
}

export interface JxDockState {
    hangarState: string;
    hatchState: string;
    humidity: string;
    isRaining: string;
    pressure: string;
    pushbeamXState: string;
    pushbeamYState: string;
    rainfall: string;
    siteId: string;
    temperature: string;
    ventilatorState: string;
    weather: string;
    windDirection: string;
    windPower: string;
    windSpeed: string;
    wirelessChargeState: string;
}

export enum DOMAIN {
    DRONE = '0', // 飞行器
    PAYLOAD = '1', // 负载
    RC = '2', // 遥控
    DOCK = '3', // 机场
}
export enum DRONE_TYPE {
    M30 = 67,
    M300 = 60,
    Mavic3EnterpriseAdvanced= 77,
}
// DJI负载类型枚举值
export enum PAYLOAD_TYPE {
    FPV = 39,
    H20 = 42,
    H20T = 43,
    H20N = 61,
    EP600 = 50,
    EP800 = 90742,
    M30D = 52,
    M30T = 53,
    XT2 = 26,
    XTS = 41,
    Z30 = 20,
    DockTopCamera = 165,

    M3E = 66,
    M3T = 67,
    // UNKNOWN = 65535
}

// RC type
export enum RC_TYPE {
    RC = 56,
    RCPlus = 119,
    RC144 = 144,
}

// DOCK type
export enum DOCK_TYPE {
    Dock = 1,
}

// 设备sub_type 从0升序
export enum DEVICE_SUB_TYPE {
    ZERO,
    ONE,
    TWO,
    THREE,
    UNKNOWN = 65535,
}

export const DEVICE_MODEL_KEY = {
    M30: `${DOMAIN.DRONE}-${DRONE_TYPE.M30}-${DEVICE_SUB_TYPE.ZERO}`,
    M30T: `${DOMAIN.DRONE}-${DRONE_TYPE.M30}-${DEVICE_SUB_TYPE.ONE}`,

    M3E: `${DOMAIN.DRONE}-${DRONE_TYPE.Mavic3EnterpriseAdvanced}-${DEVICE_SUB_TYPE.ZERO}`,
    M3T: `${DOMAIN.DRONE}-${DRONE_TYPE.Mavic3EnterpriseAdvanced}-${DEVICE_SUB_TYPE.ONE}`,

    M300: `${DOMAIN.DRONE}-${DRONE_TYPE.M300}-${DEVICE_SUB_TYPE.ZERO}`,

    FPV: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.FPV}-${DEVICE_SUB_TYPE.ZERO}`,
    H20: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.H20}-${DEVICE_SUB_TYPE.ZERO}`,
    H20T: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.H20T}-${DEVICE_SUB_TYPE.ZERO}`,
    H20N: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.H20N}-${DEVICE_SUB_TYPE.ZERO}`,
    EP600: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.EP600}-${DEVICE_SUB_TYPE.UNKNOWN}`,
    EP800: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.EP800}-${DEVICE_SUB_TYPE.ZERO}`,
    M30Camera: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.M30D}-${DEVICE_SUB_TYPE.ZERO}`,
    M30TCamera: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.M30T}-${DEVICE_SUB_TYPE.ZERO}`,

    M3ECamera: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.M3E}-${DEVICE_SUB_TYPE.ZERO}`,
    M3TCamera: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.M3T}-${DEVICE_SUB_TYPE.ZERO}`,
    // M3MCamera: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.M3M}-${DEVICE_SUB_TYPE.ZERO}`,

    XT2: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.XT2}-${DEVICE_SUB_TYPE.ZERO}`,
    XTS: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.XTS}-${DEVICE_SUB_TYPE.ZERO}`,
    Z30: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.Z30}-${DEVICE_SUB_TYPE.ZERO}`,
    DockTopCamera: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.DockTopCamera}-${DEVICE_SUB_TYPE.ZERO}`,

    RC: `${DOMAIN.RC}-${RC_TYPE.RC}-${DEVICE_SUB_TYPE.ZERO}`,
    RCPlus: `${DOMAIN.RC}-${RC_TYPE.RCPlus}-${DEVICE_SUB_TYPE.ZERO}`,

    Dock: `${DOMAIN.DOCK}-${DOCK_TYPE.Dock}-${DEVICE_SUB_TYPE.ZERO}`,
}

export const DEVICE_NAME = {
    // drone
    [DEVICE_MODEL_KEY.M30]: 'M30',
    [DEVICE_MODEL_KEY.M30T]: 'M30T',
    [DEVICE_MODEL_KEY.M3E]: 'Mavic 3E',
    [DEVICE_MODEL_KEY.M3T]: 'Mavic 3T',
    // [DEVICE_MODEL_KEY.M3M]: 'Mavic 3M',
    [DEVICE_MODEL_KEY.M300]: 'M300 RTK',

    // payload
    [DEVICE_MODEL_KEY.FPV]: 'FPV',
    [DEVICE_MODEL_KEY.H20]: 'H20',
    [DEVICE_MODEL_KEY.H20T]: 'H20T',
    [DEVICE_MODEL_KEY.H20N]: 'H20N',
    [DEVICE_MODEL_KEY.EP600]: 'P1',
    [DEVICE_MODEL_KEY.EP800]: 'L1',
    [DEVICE_MODEL_KEY.M30Camera]: 'M30 Camera',
    [DEVICE_MODEL_KEY.M30TCamera]: 'M30T Camera',
    [DEVICE_MODEL_KEY.M3ECamera]: 'Mavic 3E',
    [DEVICE_MODEL_KEY.M3TCamera]: 'Mavic 3T',
    // [DEVICE_MODEL_KEY.M3MCamera]: 'Mavic 3M',
    [DEVICE_MODEL_KEY.XT2]: 'XT2',
    [DEVICE_MODEL_KEY.XTS]: 'XTS',
    [DEVICE_MODEL_KEY.Z30]: 'Z30',
    [DEVICE_MODEL_KEY.DockTopCamera]: 'Dock Camera',

    // rc
    [DEVICE_MODEL_KEY.RC]: 'RC',
    [DEVICE_MODEL_KEY.RCPlus]: 'RC Plus',

    // dock
    [DEVICE_MODEL_KEY.Dock]: 'Dock',
}
