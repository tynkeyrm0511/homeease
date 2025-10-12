import React from 'react';
import { Form, Input, Select, Button, DatePicker, Card, Row, Col } from 'antd';

const ResidentForm = ({ initialValues, onFinish, onCancel, type = 'add' }) => (
  <Card style={{ maxWidth: 650, margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderRadius: 16, padding: 24 }}>
    <Form layout="vertical" initialValues={initialValues} onFinish={onFinish}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}> 
            <Input placeholder="Nhập tên cư dân" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}> 
            <Input placeholder="Nhập email" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label={type === 'add' ? 'Mật khẩu' : 'Mật khẩu mới (nếu đổi)'} name="password" rules={type === 'add' ? [{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }] : [{ min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }]}> 
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Vai trò" name="role" initialValue="resident"> 
            <Select>
              <Select.Option value="resident">Cư dân</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Số điện thoại" name="phone">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Số căn hộ" name="apartmentNumber">
            <Input placeholder="Nhập số căn hộ" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Ngày sinh" name="dateOfBirth">
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Chọn ngày sinh" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Giới tính" name="gender">
            <Select allowClear placeholder="Chọn giới tính">
              <Select.Option value="male">Nam</Select.Option>
              <Select.Option value="female">Nữ</Select.Option>
              <Select.Option value="other">Khác</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24}>
          <Form.Item label="Địa chỉ" name="address">
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Ngày chuyển vào" name="moveInDate">
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Chọn ngày chuyển vào" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Trạng thái" name="status" initialValue="active">
            <Select>
              <Select.Option value="active">Đang ở</Select.Option>
              <Select.Option value="inactive">Đã chuyển đi</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <Button onClick={onCancel}>Hủy</Button>
        <Button type="primary" htmlType="submit">{type === 'add' ? 'Lưu' : 'Lưu thay đổi'}</Button>
      </div>
    </Form>
  </Card>
);

export default ResidentForm;
