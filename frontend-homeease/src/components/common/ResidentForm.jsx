import React from 'react';
import { Form, Input, Select, Button } from 'antd';

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
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button onClick={onCancel}>Hủy</Button>
      <Button type="primary" htmlType="submit">{type === 'add' ? 'Lưu' : 'Lưu thay đổi'}</Button>
    </div>
  </Form>
);

export default ResidentForm;
