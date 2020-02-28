import React from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable, { ProColumns } from '@ant-design/pro-table'
import BaseTablePage from '@/components/BaseTablePage'
import { getList } from './service'
import { RootObject as dataEntites } from './entities'

interface TableListProps { }

class TableList extends BaseTablePage<TableListProps> {
  loadDataRequest = getList;

  columns: ProColumns<dataEntites>[] = [{{ each keys }}    
    {
      title: '{{$value}}',
      dataIndex: '{{$value}}',
    },{{/each}}
  ]

  render() {
    const tableCfg = this.getTableConfig()
    return (
      <PageHeaderWrapper>
        <ProTable<dataEntites>
          {...tableCfg}
        />
      </PageHeaderWrapper>
    )
  }
}

export default TableList
