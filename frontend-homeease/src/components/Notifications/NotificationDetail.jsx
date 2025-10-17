// src/components/Notifications/NotificationDetail.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Descriptions, Typography, Spin, Tag, Divider } from 'antd';
import api from '../../services/api';

const { Title, Paragraph } = Typography;

const NotificationDetail = ({ notificationId, visible, onClose }) => {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotificationDetail = async () => {
      if (!notificationId || !visible) return;
      
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/notification/${notificationId}`);
        setNotification(response.data);
      } catch (err) {
        console.error('Error fetching notification details:', err);
        setError('Không thể tải thông tin thông báo');
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationDetail();
  }, [notificationId, visible]);

  // Helper function to render target tag
  const renderTargetTag = (target) => {
    switch (target) {
      case 'all':
        return <Tag color="blue">Tất cả cư dân</Tag>;
      case 'residentId':
        return <Tag color="green">Cư dân cụ thể</Tag>;
      case 'group':
        return <Tag color="orange">Nhóm cư dân</Tag>;
      default:
        return <Tag color="default">{target}</Tag>;
    }
  };

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0 }}>Chi tiết thông báo</Title>}
      open={visible}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="back" onClick={onClose}>
          Đóng
        </Button>
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 20 }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : notification ? (
        <div>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{notification.id}</Descriptions.Item>
            <Descriptions.Item label="Tiêu đề">
              <Title level={5} style={{ margin: 0 }}>{notification.title}</Title>
            </Descriptions.Item>
            <Descriptions.Item label="Đối tượng">
              {renderTargetTag(notification.target)}
              {notification.target === 'residentId' && notification.user && (
                <span> - {notification.user.name}</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {notification.createdAt && new Date(notification.createdAt).toLocaleDateString('vi-VN', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Người tạo">
              {notification.user?.name || 'Admin'}
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">Nội dung thông báo</Divider>
          <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '5px', minHeight: '100px' }}>
            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
              {notification.content}
            </Paragraph>
          </div>
        </div>
      ) : (
        <div>Không tìm thấy thông tin thông báo</div>
      )}
    </Modal>
  );
};

export default NotificationDetail;