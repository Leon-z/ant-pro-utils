import React from 'react'
import { Button } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable, { ProColumns } from '@ant-design/pro-table'
import { getList, createNew } from './service'
import { RootObject as dataEntites } from './entities'
import CreateForm from './components/CreateForm'
import BaseTablePage from '@/components/BaseTablePage'
import { TSNotNeed } from '@/constants'
interface TableListProps { }

interface TableListState {
  /** 是否展示创建弹窗 */
  showCreateModal: boolean;
}
class TableList extends BaseTablePage<TableListProps, TableListState> {
  // 每次获取数据发起的请求，如果参数和约定的不一致，要么后端改，要么前端在service里做调整
  loadDataRequest = getList;

  columns: ProColumns<dataEntites>[] = [{{ each keys }}    
    {
      title: '{{$value}}',
      dataIndex: '{{$value}}',
    },{{/each}}
  ]

  constructor(props) {
    super(props)

    
    this.state = {
      ...this.state, // 这个不能删，要继承basePage的state
      showCreateModal: false,
      columnsStateList: this.getColumnsStateList(),
    }
  }


  /** 新建列表项弹窗 - 状态改变 */
  changeCreatModalVisible = (showCreateModal: boolean) => () => {
    this.setState({ showCreateModal })
  }

  /** 新建列表项 - 提交 */
  createSubmit = (value: TSNotNeed) => {
    createNew(value)
      .then(() => {
        // 关闭弹窗
        this.changeCreatModalVisible(false)()
        // 刷新列表
        this.reload()
      })
  }

  renderToolBar = () => [
    <Button
      icon='plus'
      type='primary'
      key='create'
      onClick={this.changeCreatModalVisible(true)}
    >
      新建
      </Button>,
    this.renderColumns(),
  ];
  
  render() {
    const tableCfg = this.getTableConfig()
    const { showCreateModal } = this.state
    return (
      <PageHeaderWrapper>
        <ProTable<dataEntites>
          {...tableCfg}
          toolBarRender={this.renderToolBar}
        />
        <CreateForm
          onSubmit={this.createSubmit}
          onCancel={this.changeCreatModalVisible(false)}
          modalVisible={showCreateModal}
        />
      </PageHeaderWrapper>
    )
  }
}

export default TableList
