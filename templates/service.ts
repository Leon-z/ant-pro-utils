import { baseTableReq, getListResp } from './entities'
import request, { requestOnlyData } from '@/utils/request'
// import api from '@/constants/api'

export async function getList(params: baseTableReq): Promise<getListResp> {
  return request('/yp{{url}}', {
    params,
  })
}
