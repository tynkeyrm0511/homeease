import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { updatePassword } from '../../services/profileApi';

const SecuritySettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });

      message.success('Đổi mật khẩu thành công');
      form.resetFields();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Đổi mật khẩu thất bại';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="max-w-[500px] mx-auto">
        <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu mới"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="min-w-[120px]"
            >
              Cập nhật mật khẩu
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">Lưu ý bảo mật</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>Mật khẩu phải có ít nhất 6 ký tự</li>
            <li>Nên sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
            <li>Không sử dụng mật khẩu đã dùng cho các tài khoản khác</li>
            <li>Không chia sẻ mật khẩu với người khác</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;