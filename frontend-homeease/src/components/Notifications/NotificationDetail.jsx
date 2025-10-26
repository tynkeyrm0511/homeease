// src/components/Notifications/NotificationDetail.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Descriptions, Typography, Spin, Tag, Divider, message } from 'antd';
import api, { getNotificationById, deleteNotification, updateNotification } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext'

const { Title, Paragraph } = Typography;

const NotificationDetail = ({ notificationId, visible, onClose }) => {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth()

  const seenKey = user?.id ? `seenNotifications:${user.id}` : null

  useEffect(() => {
    const fetchNotificationDetail = async () => {
      if (!notificationId || !visible) return;
      
      try {
        setLoading(true);
        setError('');
        let response
        if (user && user.role === 'admin') {
          response = await getNotificationById(notificationId);
          setNotification(response);
        } else {
          // non-admins cannot call GET /notification/:id (admin-only)
          // fetch the user's notifications and pick the matching id
          const meRes = await api.get('/notification/me');
          const list = Array.isArray(meRes.data) ? meRes.data : [];
          const found = list.find(n => String(n.id) === String(notificationId));
          if (!found) {
            setError('Không có quyền xem thông báo này hoặc thông báo không tồn tại');
          } else {
            setNotification(found);
          }
        }
        // mark seen locally when opened by a resident
        if (user && user.role !== 'admin' && seenKey) {
          try {
            const raw = localStorage.getItem(seenKey)
            const set = new Set(raw ? raw.split(',').filter(Boolean) : [])
            set.add(String(notificationId))
            localStorage.setItem(seenKey, Array.from(set).join(','))
          } catch {
            /* ignore */
          }
        }
      } catch (err) {
        console.error('Error fetching notification details:', err);
        setError('Không thể tải thông tin thông báo');
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationDetail();
  }, [notificationId, visible, user, seenKey]);

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

  const handleMarkAsRead = () => {
    if (!notification || !user || !seenKey) return
    try {
      const raw = localStorage.getItem(seenKey)
      const set = new Set(raw ? raw.split(',').filter(Boolean) : [])
      set.add(String(notification.id))
      localStorage.setItem(seenKey, Array.from(set).join(','))
  } catch { /* ignore */ }
    message.success('Đã đánh dấu là đã đọc')
    // close modal to reflect change in header
    onClose && onClose()
  }

  const handleDelete = async () => {
    if (!notification) return
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa thông báo này? Hành động không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteNotification(notification.id)
          message.success('Đã xóa thông báo')
          onClose && onClose()
        } catch (err) {
          console.error('Delete failed', err)
          message.error('Xóa không thành công')
        }
      }
    })
  }

  const handleSaveAsDraft = async () => {
    if (!notification) return
    try {
      const updated = await updateNotification(notification.id, { ...notification })
      message.success('Đã lưu')
      setNotification(updated)
    } catch (err) {
      console.error('Update failed', err)
      message.error('Lưu không thành công')
    }
  }

  const isAdmin = user?.role === 'admin';

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0 }}>Chi tiết thông báo</Title>}
      open={visible}
      onCancel={onClose}
      width={isAdmin ? 700 : 560}
      footer={(
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          {!isAdmin && (
            <Button key="mark" type="default" onClick={handleMarkAsRead}>Đánh dấu đã đọc</Button>
          )}
          {isAdmin && (
            <>
              <Button key="save" onClick={handleSaveAsDraft}>Lưu</Button>
              <Button key="delete" danger onClick={handleDelete}>Xóa</Button>
            </>
          )}
          <Button key="close" type="primary" onClick={onClose}>Đóng</Button>
        </div>
      )}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 20 }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : notification ? (
        isAdmin ? (
          // Admin view: full details with ID, target, creator
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
                  minute: '2-digit'
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
          // Resident view: simpler card-based layout
          <div style={{ padding: '8px 0' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              borderRadius: '12px', 
              padding: '24px', 
              marginBottom: '20px',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
            }}>
              <Title level={3} style={{ margin: 0, color: '#fff', fontSize: '22px', fontWeight: 700 }}>
                {notification.title}
              </Title>
              <div style={{ 
                marginTop: '12px', 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.9 }}>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" fill="currentColor"/>
                </svg>
                {notification.createdAt && new Date(notification.createdAt).toLocaleDateString('vi-VN', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </div>
            </div>

            <div style={{ 
              background: '#f8fafc', 
              borderRadius: '12px', 
              padding: '20px',
              minHeight: '120px',
              border: '1px solid #e2e8f0'
            }}>
              <Paragraph style={{ 
                whiteSpace: 'pre-wrap', 
                fontSize: '15px', 
                lineHeight: '1.7',
                color: '#334155',
                margin: 0
              }}>
                {notification.content}
              </Paragraph>
            </div>
          </div>
        )
      ) : (
        <div>Không tìm thấy thông tin thông báo</div>
      )}
    </Modal>
  );
};

export default NotificationDetail;