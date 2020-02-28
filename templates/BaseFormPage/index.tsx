import React from 'react'
import moment from 'moment'
import BasePage from '@/components/BasePage'

export default class BaseFormPage<P = {}, S = {}> extends BasePage<P,S> {
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

  /** 将时间['2020-02-10'，'2020-02-10']转换成[moment对象，moment对象]的方法，用于回填RangePicker */
  formatDateToMoment = (data: string[]) => {
    if (!data) {
      return
    }
    return [moment(data[0]), moment(data[1])]
  }

  /** 将时间[moment对象，moment对象]转换成['2020-02-10'，'2020-02-10']的方法，用于提交表单RangePicker */
  formatDateToString = (data: []) => {
    if (!data) {
      return
    }
    let startMonth = data[0].month() + 1
    startMonth = startMonth < 10 ? (`0${startMonth}`) : startMonth
    let endMonth = data[1].month() + 1
    endMonth = endMonth < 10 ? (`0${endMonth}`) : endMonth
    let startDate = data[0].date()
    startDate = startDate < 10 ? (`0${startDate}`) : startDate
    let endDate = data[1].date()
    endDate = endDate < 10 ? (`0${endDate}`) : endDate
    const startTime = `${data[0].year()}-${startMonth}-${startDate}`
    const endTime = `${data[1].year()}-${endMonth}-${endDate}`
    return [startTime, endTime]
  }

  /** 内容物居中布局 */
  renderJustifyCenter = (children: React.ReactNode): React.ReactNode => {
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
        {children}
      </div>
    )
  }
}
