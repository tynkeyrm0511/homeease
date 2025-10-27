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
    <div className="h-full bg-gray-50/30 overflow-auto">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Card className="shadow-sm">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={loading}
            className="w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Email Section */}
              <div className="col-span-1 md:col-span-2">
                <Form.Item
                  name="email"
                  label={<span className="font-medium text-sm sm:text-base">Email</span>}
                  labelCol={{ id: `${formId}-email-label` }}
                >
                  <Input 
                    id={`${formId}-email`}
                    disabled 
                    prefix={<MailOutlined className="text-gray-400" />}
                    className="bg-gray-50"
                    size="large"
                  />
                </Form.Item>
              </div>

              {/* Personal Information */}
              <div className="space-y-3 sm:space-y-4">
                <Typography.Text strong className="text-gray-700 text-sm sm:text-base block">
                  Thông tin cá nhân
                </Typography.Text>
                <div className="space-y-2 sm:space-y-3">
                  <Form.Item
                    name="name"
                    label={<span className="font-medium text-sm">Họ và tên <span className="text-red-500">*</span></span>}
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
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label={<span className="font-medium text-sm">Số điện thoại</span>}
                    rules={[
                      { pattern: /^[0-9+()-\s]{10,15}$/, message: 'Số điện thoại không hợp lệ' }
                    ]}
                    labelCol={{ id: `${formId}-phone-label` }}
                  >
                    <Input 
                      id={`${formId}-phone`}
                      prefix={<PhoneOutlined className="text-gray-400" />}
                      placeholder="Nhập số điện thoại"
                      size="large"
                    />
                  </Form.Item>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Form.Item
                      name="gender"
                      label={<span className="font-medium text-sm">Giới tính</span>}
                      labelCol={{ id: `${formId}-gender-label` }}
                    >
                      <Select 
                        id={`${formId}-gender`}
                        placeholder="Chọn giới tính"
                        size="large"
                      >
                        <Option value="male">Nam</Option>
                        <Option value="female">Nữ</Option>
                        <Option value="other">Khác</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="dateOfBirth"
                      label={<span className="font-medium text-sm">Ngày sinh</span>}
                      labelCol={{ id: `${formId}-dob-label` }}
                    >
                      <DatePicker
                        id={`${formId}-dateOfBirth`}
                        className="w-full"
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày sinh"
                        suffixIcon={<CalendarOutlined className="text-gray-400" />}
                        size="large"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              {/* Residence Information */}
              <div className="space-y-3 sm:space-y-4">
                <Typography.Text strong className="text-gray-700 text-sm sm:text-base block">
                  Thông tin cư trú
                </Typography.Text>
                <div className="space-y-2 sm:space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Form.Item
                      name="apartmentNumber"
                      label={<span className="font-medium text-sm">Số căn hộ</span>}
                      labelCol={{ id: `${formId}-apt-label` }}
                    >
                      <Input 
                        id={`${formId}-apartmentNumber`}
                        prefix={<HomeOutlined className="text-gray-400" />}
                        placeholder="Nhập số căn hộ"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="houseNumber"
                      label={<span className="font-medium text-sm">Số nhà</span>}
                      labelCol={{ id: `${formId}-house-label` }}
                    >
                      <Input 
                        id={`${formId}-houseNumber`}
                        prefix={<HomeOutlined className="text-gray-400" />}
                        placeholder="Nhập số nhà"
                        size="large"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="moveInDate"
                    label={<span className="font-medium text-sm">Ngày chuyển vào</span>}
                    labelCol={{ id: `${formId}-moveIn-label` }}
                  >
                    <DatePicker
                      id={`${formId}-moveInDate`}
                      className="w-full"
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày chuyển vào"
                      suffixIcon={<CalendarOutlined className="text-gray-400" />}
                      size="large"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <Divider className="my-4 sm:my-6" />

            <div className="flex justify-end pb-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                size="large"
                className="min-w-[120px] sm:min-w-[140px]"
              >
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default BasicInfo;