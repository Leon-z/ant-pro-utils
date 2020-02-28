import React from 'react'
import router from 'umi/router'
import request from '@/utils/request'

interface query {
  [key: string]: string;
}

export default class BasePage<P = {}, S = {}> extends React.Component<P, S> {
  /** 基础请求方法 */
  request = request;

  /** 路由跳转方法 */
  router = router;

  /** 获取url上的query参数对象 */
  query: query = this.props.location.query;
}
