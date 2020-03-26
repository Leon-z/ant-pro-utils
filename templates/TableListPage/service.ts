import { baseTableReq, getListResp } from './entities'
import { baseResp } from '@/services/entities'
import request, { requestOnlyData } from '@/utils/request'
import { TSFixMe } from '@/constants'
// import api from '@/constants/api'

/** 获取列表 */
export async function getList(params: baseTableReq): Promise<getListResp> {
  return request('/yp{{url}}', {
    params,
  })
}

/** 新建列表项接口 */
export async function createNew(body: TSFixMe): Promise<baseResp> {
  return requestOnlyData('..', {
    method: 'post',
    body,
  })
}
