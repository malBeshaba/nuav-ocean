import request from '@/utils/request'
import {PostFlyToPointBody} from "@/api/drone-control/drone";

const HTTP_PREFIX = '/statistic'

export async function taskInfoStatistic () {
    const resp = await request.get(`${HTTP_PREFIX}/taskInfoStatistic`)
    return resp.data
}

export async function distributeAnnualTasksStatistic(year: number) {
    const resp = await request.get(`${HTTP_PREFIX}/distributeAnnualTasksStatistic/${year}`)
    return resp.data
}

export async function collectAnnualTaskDataStatistic(year: number) {
    const resp = await request.get(`${HTTP_PREFIX}/collectAnnualTaskDataStatistic/${year}`)
    return resp.data
}

export async function collectDataInfoStatistic () {
    const resp = await request.get(`${HTTP_PREFIX}/collectDataInfoStatistic`)
    return resp.data
}
