import { Form, Input, Modal } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import React from 'react'

const FormItem = Form.Item
/** 创建弹窗 */
interface CreateFormProps extends FormComponentProps {
  /** 是否可见 */
  modalVisible: boolean;
  /** 提交方法 */
  onSubmit: (fieldsValue: { desc: string }) => void;
  /** 取消弹窗的回调 */
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, onSubmit: handleAdd, onCancel } = props
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) { return }
      handleAdd(fieldsValue)
    })
  }
  const labelCol = { span: 5 }
  const wrapperCol = { span: 15 }
  return (
    <Modal
      destroyOnClose
      title='新建规则'
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <FormItem labelCol={labelCol} wrapperCol={wrapperCol} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [
            {
              required: true,
              message: '这里是一些提示',
              min: 5,
            },
          ],
        })(<Input placeholder='请输入' />)}
      </FormItem>
    </Modal>
  )
}

export default Form.create<CreateFormProps>()(CreateForm)
