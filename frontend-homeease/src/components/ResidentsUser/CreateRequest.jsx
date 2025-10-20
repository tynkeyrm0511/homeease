import React, { useState } from 'react'
import { Form, Input, Button, Toast, Selector } from 'antd-mobile'
import { createRequest } from '../../services/api'

const categories = [
  { label: 'Điện nước', value: 'utilities' },
  { label: 'Internet', value: 'internet' },
  { label: 'Chung', value: 'general' },
]

const CreateRequest = ({ onNavigate }) => {
  const [submitting, setSubmitting] = useState(false)

  const onFinish = async (values) => {
    try {
      if (!values.category || !values.description) {
        Toast.show({ content: 'Vui lòng điền đầy đủ thông tin' })
        return
      }
      setSubmitting(true)
      await createRequest(values)
      Toast.show({ content: 'Gửi yêu cầu thành công' })
      if (onNavigate) onNavigate('my-requests')
    } catch {
      Toast.show({ content: 'Gửi thất bại' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
  <div className="min-h-screen pt-4 sm:pt-6 p-3 pr-14 sm:pr-6">
      <h2 className="text-lg font-semibold mb-3">Tạo yêu cầu mới</h2>
      <Form
        layout="vertical"
        onFinish={onFinish}
        footer={
          <div style={{ padding: '12px' }}>
            <Button block type="submit" color="primary" loading={submitting}>Gửi yêu cầu</Button>
          </div>
        }
      >
        <Form.Item name="category" label="Loại yêu cầu" rules={[{ required: true }]}>
          <Selector options={categories} defaultValue={[categories[0].value]} multiple={false} />
        </Form.Item>

        <Form.Item name="title" label="Tiêu đề">
          <Input placeholder="Ví dụ: Bóng đèn hỏng ở phòng khách" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
          <Input.TextArea placeholder="Mô tả chi tiết vấn đề" rows={5} />
        </Form.Item>

        <Form.Item name="priority" label="Ưu tiên">
          <Selector options={[{ label: 'Thấp', value: 'low' }, { label: 'Trung bình', value: 'medium' }, { label: 'Cao', value: 'high' }]} defaultValue={[ 'medium' ]} multiple={false} />
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateRequest
