import React from 'react'
import { ActionType, ProColumns } from '@ant-design/pro-table'
import * as moment from 'moment'
import { searchParams } from './constants'
import BasePage from '@/components/BasePage'
import { objToQueryString } from '@/utils/url'
import { current2PageNum, filterEmptyKey, filterSpace, formatTimeRange } from '@/utils/object'
import { BASE_VALUE_ENUM } from '@/constants/table'
import { TSNotNeed, TSFixMe } from '@/constants/index'
import { baseService } from '@/services'

type formatcolumns = (columns: ProColumns<TSFixMe>[]) => ProColumns<TSFixMe>[];
interface baseTablePageState {
  /** 每页大小 */
  pageSize: number;
  /** 当前页面编号 */
  pageNum: number;
  /** 页面总数 */
  total: number;
  /** 当前页的请求数据结果 */
  requestData: null | TSFixMe;
  collapsed: boolean;
}
export const formatValueEnum = (origin: BASE_VALUE_ENUM) => {
  const valueEnum = {}
  Object.keys(origin).forEach(key => {
    const item = origin[key]
    valueEnum[item.VALUE] = {
      text: item.TEXT,
      status: item.STATUS,
    }
  })
  return valueEnum
}

export const filterAll = (origin: BASE_VALUE_ENUM) => {
  const res: object[] = []
  Object.keys(origin).filter(notAll => {
    return notAll != 'ALL'
  })
  .forEach(key => {
    const item = origin[key]
    res.push({
      text: item.TEXT,
      value: item.VALUE,
    })
  })
  return res
}

export default class BaseTablePage<P = {}, S = baseTablePageState> extends BasePage<P, S> {
  loadDataRequest: (params: TSFixMe) => Promise<TSFixMe>;

  actionRef: React.MutableRefObject<ActionType | undefined>;

  constructor(props: P) {
    super(props)

    this.loadDataRequest = (params: TSFixMe) => baseService(params)
    this.state = {
      pageSize: 10,
      pageNum: 1,
      total: 0,
      requestData: null,
    }
    this.actionRef = {
      current: {
        reload: () => {},
        fetchMore: () => {},
        reset: () => {},
      },
    }
  }

  get searchBarConfig(){
    return {
      collapsed: !!this.state.collapsed,
      onCollapse: this.onCollapse,
    }
  }

  /** 要使用分页必须设置postdData参数 */
  get pagination() {
    if (!this.state.requestData) {
      return false
    }
    const { pageSize, total, pageNum } = this.state
    return {
      pageSize,
      showQuickJumper: true,
      showSizeChanger: true,
      total,
      pageNum,
    }
  }

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed })
  }

  /** 主动刷新当前 需要 绑定ProTable组件  actionRef={this.actionRef} */
  reload = () => {
    this.actionRef.current?.reload()
  };

  /** 格式化枚举常量 */
  formatValueEnum = formatValueEnum

  filterAll = filterAll

  search: (params?: searchParams) => Promise<TSNotNeed> = (params = {}) => {
    // TODO 临时处理请求中的时间段，会有坑
    const timeRangeParams = formatTimeRange(params)
    const pageParams = current2PageNum(timeRangeParams)
    const notEmptyParams = filterEmptyKey(pageParams)
    const notSpaceParams = filterSpace(notEmptyParams)
    this.router.push({
      search: objToQueryString(notSpaceParams),
    })
    return this.loadDataRequest(notSpaceParams)
  };

  formatcolumns: formatcolumns = columns => {
    return columns
  };

  /** 约定具有分页的格式列表在resultList字段中 */
  formatTableData = (data: TSFixMe) => {
    this.setState({
      total: data?.total,
      pageNum: data?.pageNum,
      pageSize: data?.pageSize,
      requestData: data,
    })
    return data?.resultList
  };

  /** 将[2020-01-01， 2020-02-02]，转换成'时间戳，时间戳'的方法 */
  changeDatesFormat = (dates: string[]) => {
    const startTime = new Date(dates[0].replace(/-/g, '/'))
    const endTime = new Date(dates[1].replace(/-/g, '/'))
    return `${startTime.getTime()},${endTime.getTime()}`
  };

  /** 将时间戳字符串（'时间戳，时间戳'）转换成[moment对象，moment对象]的方法，用于回填RangePicker，如果是'NaN,NaN'，返回null */
  formatDateToMoment = (data: string) => {
    if (data === 'NaN,NaN') {
      return null
    }
    const timeArr = data.split(',')
    const start = new Date(parseInt(timeArr[0]))
    const startTime = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()} ${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`
    const end = new Date(parseInt(timeArr[1]))
    const endTime = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}  ${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}`
    return [moment(startTime), moment(endTime)]
  }

  /** 时间戳转成时间 默认转成年月日时分秒，type为date的时候，转成年月日*/
  timestampToTime = (timestamp: number, type?: string) => {
    if(!timestamp) {
      return ''
    }
    const date = new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = `${date.getFullYear()}-`
    const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`
    const D = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} `
    const h = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:`
    const m = `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:`
    const s = (date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds())

    let strDate = Y + M + D + h + m + s
    if (type === 'date') {
      strDate = Y + M + D
    }
    return strDate
  }

  getTableConfig = (config: TSFixMe = {}) => {
    const tableCfg = {
      headerTitle: '',
      // 默认每行使用id作为唯一标示
      rowKey: 'id',
      // 默认search方法
      request: this.search,
      // 列表页查询和列表配置
      columns: this.columns || [],
      // 统一的数据格式方法
      postData: this.formatTableData,
      // 参数统一读取url参数
      params: this.query,
      // 统一分页管理
      pagination: this.pagination,
      // 获取表单实例，提供刷新功能
      actionRef: this.actionRef,
      // 统一的搜索栏配置
      search: this.searchBarConfig,
      // 统一的x轴滚动
      scroll: { x: true }
    }
    return Object.assign(tableCfg, config)
  }

  LayoutCol = {
    formItemLayout: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
        md: { span: 10 },
      },
    },
    submitFormLayout: {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    },
  };
}
