export interface IResult {
 code: number;
 message: string;
}

export interface IPage {
 page: number;
 total: number;
 page_size: number;
}

export interface IListWorkspaceResponse<T> {
 code: number;
 message: string;
 data: {
   list: T[];
   pagination: IPage;
 };
}
// Workspace
export interface IWorkspaceResponse<T> {
 code: number;
 data: T;
 message: string;
}

export type IStatus = 'WAITING' | 'DOING' | 'SUCCESS' | 'FAILED';

export interface CommonListResponse<T> extends IResult {
 data: {
   list: T[];
   pagination: IPage;
 };
}

export interface CommonResponse<T> extends IResult {
 data: T
}
export enum EUserType {
    Web = 1,
    Pilot = 2,
}
export enum ERouterName {
    ELEMENT = 'element',
    PROJECT = 'project',
    HOME = 'home',
    TSA = 'tsa',
    LAYER = 'layer',
    MEDIA = 'media',
    WAYLINE = 'wayline',
    LIVESTREAM = 'livestream',
    LIVING = 'living',
    WORKSPACE = 'workspace',
    MEMBERS = 'members',
    DEVICES = 'devices',
    TASK = 'task',
    CREATE_PLAN = 'create-plan',
    SELECT_PLAN = 'select-plan',
    FIRMWARES = 'firmwares',

    PILOT = 'pilot-login',
    PILOT_HOME = 'pilot-home',
    PILOT_MEDIA = 'pilot-media',
    PILOT_LIVESHARE = 'pilot-liveshare',
    PILOT_BIND = 'pilot-bind'
}
export enum ELocalStorageKey {
    Username = 'username',
    WorkspaceId = 'workspace_id',
    Token = 'x-auth-token',
    Authorization = 'Authorization',
    PlatformName = 'platform_name',
    WorkspaceName = 'workspace_name',
    WorkspaceDesc = 'workspace_desc',
    Flag = 'flag',
    UserId = 'user_id',
    Device = 'device',
    GatewayOnline = 'gateway_online',
}
