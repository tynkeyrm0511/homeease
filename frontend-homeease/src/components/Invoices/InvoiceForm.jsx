import React from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Button } from 'antd';

const { Option } = Select;

const InvoiceForm = ({ initialValues, type = 'add', onFinish, onCancel, residentOptions = [] }) => {
  return (
    <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32, maxWidth: 500, margin: '0 auto' }}>
      <Form
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 15 }}>Cư dân</span>}
          name="userId"
          rules={[{ required: true, message: 'Vui lòng chọn cư dân!' }]}
        >
          <Select placeholder="Chọn cư dân">
            {residentOptions.map(resident => (
              <Option key={resident.id} value={resident.id}>{resident.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 15 }}>Số tiền (VNĐ)</span>}
          name="amount"
          rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số tiền" />
        </Form.Item>
        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 15 }}>Loại hóa đơn</span>}
          name="type"
          rules={[{ required: true, message: 'Vui lòng chọn loại hóa đơn!' }]}
        >
          <Select placeholder="Chọn loại hóa đơn">
            <Option value="electric">Điện</Option>
            <Option value="water">Nước</Option>
            <Option value="service">Dịch vụ</Option>
            <Option value="other">Khác</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 15 }}>Ngày tạo</span>}
          name="createdAt"
          rules={[{ required: true, message: 'Vui lòng chọn ngày tạo!' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 15 }}>Hạn thanh toán</span>}
          name="dueDate"
          rules={[{ required: true, message: 'Vui lòng chọn hạn thanh toán!' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 15 }}>Trạng thái thanh toán</span>}
          name="isPaid"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value={true}>Đã thanh toán</Option>
            <Option value={false}>Chưa thanh toán</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 15 }}>Ghi chú</span>}
          name="note"
        >
          <Input.TextArea rows={2} placeholder="Ghi chú (tuỳ chọn)" />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
          <Button onClick={onCancel} style={{ minWidth: 100 }}>Huỷ</Button>
          <Button type="primary" htmlType="submit" style={{ minWidth: 120 }}>
            {type === 'add' ? 'Thêm hóa đơn' : 'Cập nhật'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
export default InvoiceForm;
