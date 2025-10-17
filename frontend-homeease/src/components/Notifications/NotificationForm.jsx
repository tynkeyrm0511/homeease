// src/components/Notifications/NotificationForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Space } from 'antd';
import api from '../../services/api';

const { Option } = Select;
const { TextArea } = Input;

const NotificationForm = ({ initialValues = {}, onFinish, onCancel }) => {
  const [form] = Form.useForm();
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [targetType, setTargetType] = useState(initialValues.target || 'all');

  // Fetch residents for dropdown when targeting specific residents
  useEffect(() => {
    if (targetType === 'residentId') {
      const fetchResidents = async () => {
        try {
          setLoading(true);
          const response = await api.get('/resident');
          setResidents(response.data.filter(user => user.role === 'resident'));
        } catch (error) {
          console.error('Error fetching residents:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchResidents();
    }
  }, [targetType]);

  // Reset form when initialValues change
  useEffect(() => {
    form.resetFields();
    setTargetType(initialValues.target || 'all');
  }, [initialValues, form]);

  // Handle target type change
  const handleTargetTypeChange = (value) => {
    setTargetType(value);
    // Clear the userId field if the target is not residentId
    if (value !== 'residentId') {
      form.setFieldsValue({ userId: undefined });
    }
  };

  const handleSubmit = (values) => {
    // Prepare data based on target type
    const notificationData = {
      title: values.title,
      content: values.content,
      target: values.target
    };

    // Add userId only if target is residentId
    if (values.target === 'residentId' && values.userId) {
      notificationData.userId = values.userId;
    }

    onFinish(notificationData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
      requiredMark={false}
    >
      <Form.Item
        name="title"
        label="Tiêu đề"
        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề thông báo' }]}
      >
        <Input placeholder="Nhập tiêu đề thông báo" />
      </Form.Item>

      <Form.Item
        name="content"
        label="Nội dung"
        rules={[{ required: true, message: 'Vui lòng nhập nội dung thông báo' }]}
      >
        <TextArea 
          rows={4} 
          placeholder="Nhập nội dung thông báo" 
          maxLength={500} 
          showCount 
        />
      </Form.Item>

      <Form.Item
        name="target"
        label="Đối tượng nhận"
        rules={[{ required: true, message: 'Vui lòng chọn đối tượng nhận thông báo' }]}
      >
        <Select 
          placeholder="Chọn đối tượng" 
          onChange={handleTargetTypeChange}
          loading={loading}
        >
          <Option value="all">Tất cả cư dân</Option>
          <Option value="residentId">Cư dân cụ thể</Option>
          <Option value="group">Nhóm cư dân</Option>
        </Select>
      </Form.Item>

      {targetType === 'residentId' && (
        <Form.Item
          name="userId"
          label="Chọn cư dân"
          rules={[{ required: true, message: 'Vui lòng chọn cư dân' }]}
        >
          <Select 
            placeholder="Chọn cư dân" 
            loading={loading}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {residents.map(resident => (
              <Option key={resident.id} value={resident.id}>
                {resident.name} ({resident.email})
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {targetType === 'group' && (
        <Form.Item
          name="group"
          label="Chọn nhóm"
          rules={[{ required: true, message: 'Vui lòng chọn nhóm cư dân' }]}
        >
          <Select placeholder="Chọn nhóm">
            <Option value="floor1">Tầng 1</Option>
            <Option value="floor2">Tầng 2</Option>
            <Option value="floor3">Tầng 3</Option>
            <Option value="block-a">Block A</Option>
            <Option value="block-b">Block B</Option>
            <Option value="new-residents">Cư dân mới</Option>
          </Select>
        </Form.Item>
      )}

      <Form.Item>
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            {initialValues.id ? 'Cập nhật' : 'Tạo thông báo'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default NotificationForm;