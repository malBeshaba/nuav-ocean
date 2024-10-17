import {ref} from 'vue'

export const wayLinePointParams = ref([
	{
		optionName: '是否使用全局速度',
		isInput: false,
		field: 'useGlobalSpeed',
		optionValue: '1',
		items: [
			{ value: '0', label: '定义当前航点速度', disabled: false},
			{ value: '1', label: '使用全局速度', disabled: false}
		]
	},
	{
		optionName: '航点飞行速度',
		isInput: true,
		field: 'waypointSpeed',
		optionValue: 0,
		items: []
	},
])

export const globalParams = ref([
	{
		optionName: '飞向首航点模式',
		isInput: false,
		field: 'flyToWaylineMode',
		optionValue: 'safely',
		items: [
			{ value: 'safely', label: '安全模式', disabled: false},
			{ value: 'pointToPoint', label: '倾斜飞行模式', disabled: false}
		]
	},
	{
		optionName: '航线结束动作',
		isInput: false,
		field: 'finishAction',
		optionValue: 'goHome',
		items: [
			{ value: 'goHome', label: '退出航线模式并返航', disabled: false},
			{ value: 'noAction', label: '退出航线模式', disabled: false},
			{ value: 'autoLand', label: '退出航线模式并原地降落', disabled: false},
			{ value: 'gotoFirstWaypoint', label: '飞向首航点并退出航线模式', disabled: false}
		]
	},
	{
		optionName: '失联动作',
		isInput: false,
		field: 'exitOnRCLost',
		optionValue: 'executeLostAction',
		items: [
			{ value: 'goContinue', label: '继续执行航线', disabled: false},
			{ value: 'executeLostAction', label: '退出航线，执行失控动作', disabled: false},
		]
	},
	{
		optionName: '全局航点转弯模式',
		isInput: false,
		field: 'globalWaypointTurnMode',
		optionValue: 'toPointAndStopWithDiscontinuityCurvature',
		items: [
			{ value: 'toPointAndStopWithDiscontinuityCurvature', label: '直线飞行，飞行器到点停', disabled: false},
			{ value: 'toPointAndStopWithContinuityCurvature', label: '曲线飞行，飞行器到点停', disabled: false},
			{ value: 'toPointAndPassWithContinuityCurvature', label: '曲线飞行，飞行器过点不停', disabled: false},
		]
	},
	{
		optionName: '全局航段轨迹是否尽量贴合直线',
		isInput: false,
		field: 'globalUseStraightLine',
		optionValue: 0,
		items: [
			{ value: 0, label: '航段轨迹全程为曲线', disabled: false},
			{ value: 1, label: '航段轨迹尽量贴合两点连线', disabled: false},
		]
	},
	{
		optionName: '执行高度模式',
		isInput: false,
		field: 'executeHeightMode',
		optionValue: 'relativeToStartPoint',
		items: [
			{ value: 'WGS84', label: '椭球高模式', disabled: false},
			{ value: 'relativeToStartPoint', label: '相对起飞点高度模式', disabled: false},
		]
	},
	{
		optionName: '安全起飞高度',
		isInput: true,
		field: 'takeOffSecurityHeight',
		optionValue: 100,
		items: [],
	},
	{
		optionName: '全局航线过渡速度',
		isInput: true,
		field: 'globalTransitionalSpeed',
		optionValue: 5,
		items: [],
	},
	{
		optionName: '全局航线飞行速度(0默认最高速度)',
		isInput: true,
		field: 'autoFlightSpeed',
		optionValue: 5,
		items: [],
	},
	{
		optionName: '相对起飞点高度',
		isInput: true,
		field: 'globalHeight',
		optionValue: 100,
		items: [],
	},
	{
		optionName: '无人机负载一',
		isInput: false,
		field: 'payloadPositionIndex',
		optionValue: 'H20t',
		items: [
			{ value: 'MultiSpectralCamera', label: '多光谱相机', disabled: false},
			{ value: 'LaserRangefinder', label: '激光测距仪', disabled: false},
			{ value: 'PanoramicCamera', label: '全景相机', disabled: false},
			{ value: 'H20t', label: 'H20t', disabled: false},
		]
	},
])
