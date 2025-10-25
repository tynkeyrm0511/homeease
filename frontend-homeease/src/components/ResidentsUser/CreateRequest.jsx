import React, { useState } from 'react'
import { Form, Input, Button, Selector } from 'antd-mobile'
import { message } from 'antd'
import { createRequest } from '../../services/api'

const categories = [
  { label: 'Điện', value: 'electricity' },
  { label: 'Nước', value: 'water' },
  { label: 'Vệ sinh', value: 'cleaning' },
  { label: 'Gửi xe', value: 'parking' },
  { label: 'Dịch vụ', value: 'service' },
  { label: 'Khác', value: 'other' },
]

const CreateRequest = ({ onNavigate }) => {
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    console.log('CreateRequest onFinish values:', values)
    // basic validation
    if (!values.description || !values.category) {
      message.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    setSubmitting(true)
    try {
      // Selector returns array like [value] when multiple={false}
      const category = Array.isArray(values.category) ? values.category[0] : values.category
      const priority = Array.isArray(values.priority) ? values.priority[0] : values.priority

      const payload = {
        title: values.title || null,
        description: values.description,
        category: category,
        priority: priority || 'medium'
      }
      console.log('CreateRequest payload:', payload)

      await createRequest(payload)
      message.success('Gửi yêu cầu thành công')
      if (onNavigate) onNavigate('my-requests')
    } catch (err) {
      console.error('CreateRequest error', err, err.response)
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message || err.message
      message.error(serverMsg || 'Gửi thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
  <div className="min-h-screen pt-4 sm:pt-6 p-3 pr-14 sm:pr-6">
      <h2 className="text-lg font-semibold mb-3">Tạo yêu cầu mới</h2>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ category: [categories[0].value], priority: ['medium'], description: '' }}
        onFinish={onFinish}
        footer={
          <div style={{ padding: '12px' }}>
            <Button block type="submit" color="primary" loading={submitting}>Gửi yêu cầu</Button>
          </div>
        }
      >
        <Form.Item name="category" label="Loại yêu cầu" rules={[{ required: true }]}>
          <Selector options={categories} multiple={false} />
        </Form.Item>

        <Form.Item name="title" label="Tiêu đề">
          <Input placeholder="Ví dụ: Bóng đèn hỏng ở phòng khách" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
          {/* Controlled native textarea bound to form so value is always present in form values */}
          <textarea
            placeholder="Mô tả chi tiết vấn đề"
            rows={5}
            className="w-full p-2 rounded-md border border-gray-200"
            value={form.getFieldValue('description') || ''}
            onChange={(e) => form.setFieldsValue({ description: e.target.value })}
          />
        </Form.Item>

        <Form.Item name="priority" label="Ưu tiên">
          <Selector options={[{ label: 'Thấp', value: 'low' }, { label: 'Trung bình', value: 'medium' }, { label: 'Cao', value: 'high' }]} multiple={false} />
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateRequest
