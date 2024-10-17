import request from '@/utils/request2'

const homePageURL = '/uavBackend/homepage'

export const getHomepageSiteList = async function () {
    const url = `${homePageURL}/getHomepageSiteList`
    const result = await request.post(url, {})
    return result.data
}
