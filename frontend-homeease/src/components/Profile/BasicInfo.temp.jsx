import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Select, DatePicker, Button, Card, Typography, Space, Divider, message } from 'antd';
import { getProfile, updateProfile } from '../../services/profileApi';
import { UserOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined, MailOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const BasicInfo = () => {
  const formId = React.useId();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = useCallback(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const profileData = response.data;
        
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
    
    fetchProfile();
  }, [form]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
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
    <div className="min-h-screen bg-gray-50/30 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Typography.Title level={4} className="mb-6">
          Thông tin cá nhân
        </Typography.Title>
        
        <Card className="shadow-sm">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={loading}
            className="w-full"
          >
            <div className="space-y-8">
              {/* Email Section */}
              <div className="w-full">
                <Form.Item
                  name="email"
                  label={<span className="font-medium">Email</span>}
                  labelCol={{ id: `${formId}-email-label` }}
                >
                  <Input 
                    id={`${formId}-email`}
                    disabled 
                    prefix={<MailOutlined className="text-gray-400" />}
                    className="bg-gray-50"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <Typography.Text strong className="text-gray-700 block text-base">
                    Thông tin cá nhân
                  </Typography.Text>
                  <div className="space-y-4">
                    <Form.Item
                      name="name"
                      label={<span className="font-medium">Họ và tên <span className="text-red-500">*</span></span>}
                      rules={[
                        { required: true, message: 'Vui lòng nhập họ tên' },
                        { min: 2, message: 'Tên phải có ít nhất 2 ký tự' }
                      ]}
                      labelCol={{ id: `${formId}-name-label` }}
                    >
                      <Input 
                        id={`${formId}-name`}
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Nhập họ và tên"
                      />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      label={<span className="font-medium">Số điện thoại</span>}
                      rules={[
                        { pattern: /^[0-9+()-\s]{10,15}$/, message: 'Số điện thoại không hợp lệ' }
                      ]}
                      labelCol={{ id: `${formId}-phone-label` }}
                    >
                      <Input 
                        id={`${formId}-phone`}
                        prefix={<PhoneOutlined className="text-gray-400" />}
                        placeholder="Nhập số điện thoại"
                      />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        name="gender"
                        label={<span className="font-medium">Giới tính</span>}
                        labelCol={{ id: `${formId}-gender-label` }}
                      >
                        <Select 
                          id={`${formId}-gender`}
                          placeholder="Chọn giới tính"
                          className="w-full"
                        >
                          <Option value="male">Nam</Option>
                          <Option value="female">Nữ</Option>
                          <Option value="other">Khác</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name="dateOfBirth"
                        label={<span className="font-medium">Ngày sinh</span>}
                        labelCol={{ id: `${formId}-dob-label` }}
                      >
                        <DatePicker
                          id={`${formId}-dateOfBirth`}
                          className="w-full"
                          format="DD/MM/YYYY"
                          placeholder="Chọn ngày sinh"
                          suffixIcon={<CalendarOutlined className="text-gray-400" />}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                {/* Residence Information */}
                <div className="space-y-6">
                  <Typography.Text strong className="text-gray-700 block text-base">
                    Thông tin cư trú
                  </Typography.Text>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        name="apartmentNumber"
                        label={<span className="font-medium">Số căn hộ</span>}
                        labelCol={{ id: `${formId}-apt-label` }}
                      >
                        <Input 
                          id={`${formId}-apartmentNumber`}
                          prefix={<HomeOutlined className="text-gray-400" />}
                          placeholder="Nhập số căn hộ"
                        />
                      </Form.Item>

                      <Form.Item
                        name="houseNumber"
                        label={<span className="font-medium">Số nhà</span>}
                        labelCol={{ id: `${formId}-house-label` }}
                      >
                        <Input 
                          id={`${formId}-houseNumber`}
                          prefix={<HomeOutlined className="text-gray-400" />}
                          placeholder="Nhập số nhà"
                        />
                      </Form.Item>
                    </div>

                    <Form.Item
                      name="moveInDate"
                      label={<span className="font-medium">Ngày chuyển vào</span>}
                      labelCol={{ id: `${formId}-moveIn-label` }}
                    >
                      <DatePicker
                        id={`${formId}-moveInDate`}
                        className="w-full"
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày chuyển vào"
                        suffixIcon={<CalendarOutlined className="text-gray-400" />}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <Divider />

              <div className="flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={saving}
                  size="large"
                  className="min-w-[140px] h-[40px]"
                >
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default BasicInfo;