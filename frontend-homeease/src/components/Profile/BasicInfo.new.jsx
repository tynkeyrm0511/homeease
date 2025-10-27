import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile, updateProfile } from '../../services/profileApi';
import dayjs from 'dayjs';

const { Option } = Select;

const BasicInfo = () => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      const profileData = response.data;
      
      // Convert dates to dayjs objects for DatePicker
      const formData = {
        ...profileData,
        dateOfBirth: profileData.dateOfBirth ? dayjs(profileData.dateOfBirth) : null,
        moveInDate: profileData.moveInDate ? dayjs(profileData.moveInDate) : null
      };
      
      form.setFieldsValue(formData);
    } catch (error) {
      message.error('Không thể tải thông tin profile');
      console.error('Load profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSaving(true);
    try {
      // Convert dayjs objects to ISO strings for API
      const data = {
        ...values,
        dateOfBirth: values.dateOfBirth?.toISOString(),
        moveInDate: values.moveInDate?.toISOString()
      };

      await updateProfile(data);
      message.success('Cập nhật thông tin thành công');
    } catch (error) {
      message.error('Cập nhật thông tin thất bại');
      console.error('Update profile error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full px-4 pt-2">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="h-full"
        disabled={loading}
      >
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <Form.Item
            name="email"
            label="Email"
            className="mb-2"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên' },
              { min: 2, message: 'Tên phải có ít nhất 2 ký tự' }
            ]}
            className="mb-2"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { pattern: /^[0-9+()-\s]{10,15}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
            className="mb-2"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Giới tính"
            className="mb-2"
          >
            <Select>
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            className="mb-2"
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>

          <Form.Item
            name="apartmentNumber"
            label="Số căn hộ"
            className="mb-2"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="houseNumber"
            label="Số nhà"
            className="mb-2"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="moveInDate"
            label="Ngày chuyển vào"
            className="mb-2"
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày chuyển vào"
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            className="mb-2 col-span-2"
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </div>

        <Form.Item className="mb-0 mt-2">
          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            className="min-w-[120px]"
          >
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BasicInfo;