import React from 'react';
import { Form, Input, Select, Button, DatePicker } from 'antd';

const ResidentForm = ({ initialValues, onFinish, onCancel, type = 'add' }) => (
  <Form layout="vertical" initialValues={initialValues} onFinish={onFinish}>
    <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}> 
      <Input />
    </Form.Item>
    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}> 
      <Input />
    </Form.Item>
    <Form.Item label={type === 'add' ? 'Mật khẩu' : 'Mật khẩu mới (nếu đổi)'} name="password" rules={type === 'add' ? [{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }] : [{ min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }]}> 
      <Input.Password />
    </Form.Item>
    <Form.Item label="Vai trò" name="role" initialValue="resident"> 
      <Select>
        <Select.Option value="resident">Cư dân</Select.Option>
        <Select.Option value="admin">Admin</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item label="Số điện thoại" name="phone">
      <Input />
    </Form.Item>
    <Form.Item label="Số căn hộ" name="apartmentNumber">
      <Input />
    </Form.Item>
    <Form.Item label="Ngày sinh" name="dateOfBirth">
      <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item label="Giới tính" name="gender">
      <Select allowClear>
        <Select.Option value="male">Nam</Select.Option>
        <Select.Option value="female">Nữ</Select.Option>
        <Select.Option value="other">Khác</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item label="Địa chỉ" name="address">
      <Input />
    </Form.Item>
    <Form.Item label="Ngày chuyển vào" name="moveInDate">
      <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item label="Trạng thái" name="status" initialValue="active">
      <Select>
        <Select.Option value="active">Đang ở</Select.Option>
        <Select.Option value="inactive">Đã chuyển đi</Select.Option>
      </Select>
    </Form.Item>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button onClick={onCancel}>Hủy</Button>
      <Button type="primary" htmlType="submit">{type === 'add' ? 'Lưu' : 'Lưu thay đổi'}</Button>
    </div>
  </Form>
);

export default ResidentForm;
