import React, { useState, useEffect } from 'react'
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
  const [isMobile, setIsMobile] = useState(false)
  const [bottomPadding, setBottomPadding] = useState(0)
  const buttonRef = React.useRef(null)
  const textareaRef = React.useRef(null)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // adjust bottom padding dynamically based on the sticky button height
  useEffect(() => {
    const updatePadding = () => {
      const btnHeight = buttonRef.current ? Math.round(buttonRef.current.getBoundingClientRect().height) : 0
      // add more breathing room so button isn't too close to screen edge on mobile
      const EXTRA_BREATHING = 48
      // fallback bigger for mobile to ensure space when keyboard/safe-area present
      const MOBILE_FALLBACK = 240
      const DESKTOP_FALLBACK = 24
      const pad = btnHeight ? btnHeight + EXTRA_BREATHING : (isMobile ? MOBILE_FALLBACK : DESKTOP_FALLBACK)
      setBottomPadding(pad)
    }
    updatePadding()
    window.addEventListener('resize', updatePadding)
    return () => window.removeEventListener('resize', updatePadding)
  }, [isMobile])

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
  <div className="min-h-screen pt-4 sm:pt-6 p-3 pr-14 sm:pr-6" style={{ paddingBottom: bottomPadding, overflowY: 'auto' }}>
      <h2 className="text-lg font-semibold mb-3">Tạo yêu cầu mới</h2>
  <div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ category: [categories[0].value], priority: ['medium'], description: '' }}
        onFinish={onFinish}
      >
        <Form.Item name="category" label="Loại yêu cầu">
          <Selector options={categories} multiple={false} />
        </Form.Item>

        <Form.Item name="title" label="Tiêu đề">
          <Input placeholder="Ví dụ: Bóng đèn hỏng ở phòng khách" onFocus={() => {
            setTimeout(() => {
              textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 250)
          }} />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          {/* Controlled native textarea bound to form so value is always present in form values */}
          <textarea
            placeholder="Mô tả chi tiết vấn đề"
            rows={5}
            className="w-full p-2 rounded-md border border-gray-200"
            ref={textareaRef}
            value={form.getFieldValue('description') || ''}
            onFocus={() => {
              setTimeout(() => textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250)
            }}
            onChange={(e) => form.setFieldsValue({ description: e.target.value })}
          />
        </Form.Item>

        <Form.Item name="priority" label="Ưu tiên">
          <Selector options={[{ label: 'Thấp', value: 'low' }, { label: 'Trung bình', value: 'medium' }, { label: 'Cao', value: 'high' }]} multiple={false} />
        </Form.Item>
      </Form>
      </div>

      {/* Submit button - sticky on mobile to avoid being hidden by keyboard */}
      <div ref={buttonRef} style={isMobile ? {
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 'env(safe-area-inset-bottom, 20px)', // increased default safe inset
        padding: '8px 16px calc(env(safe-area-inset-bottom, 20px) + 12px)', // extra padding so button isn't flush to edge
        zIndex: 60,
        background: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.95))'
      } : { padding: '12px 0 0 0' }}>
        <div style={isMobile ? { maxWidth: 720, margin: '0 auto' } : {}}>
          <Button block color="primary" loading={submitting} onClick={() => form.submit()}>
            Gửi yêu cầu
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateRequest


