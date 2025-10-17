// src/components/Notifications/NotificationTable.jsx
import React from 'react';
import { Button, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

// Function to get tag color based on notification target
const getTargetTag = (target) => {
  switch (target) {
    case 'all':
      return <Tag color="blue">Tất cả</Tag>;
    case 'residentId':
      return <Tag color="green">Cư dân cụ thể</Tag>;
    case 'group':
      return <Tag color="orange">Nhóm cư dân</Tag>;
    default:
      return <Tag color="default">{target}</Tag>;
  }
};

const NotificationTable = ({ notifications, onEdit, onDelete, onDetail }) => (
  <table className="notification-table" style={{ width: '100%', fontSize: '0.97rem', marginBottom: 0, borderCollapse: 'separate', borderSpacing: 0, minWidth: 900 }}>
    <thead>
      <tr>
        <th style={{ width: 50 }}>ID</th>
        <th style={{ width: 160 }}>Tiêu đề</th>
        <th style={{ width: 250 }}>Nội dung</th>
        <th style={{ width: 100 }}>Đối tượng</th>
        <th style={{ width: 160 }}>Ngày tạo</th>
        <th style={{ width: 120 }}>Người tạo</th>
        <th style={{ width: 100 }}></th>
      </tr>
    </thead>
    <tbody>
      {notifications.map((notification) => (
        <tr key={notification.id}>
          <td style={{ verticalAlign: 'middle' }}>{notification.id}</td>
          <td style={{ verticalAlign: 'middle' }}>
            <Button type="link" onClick={() => onDetail && onDetail(notification)} style={{ padding: 0 }}>
              {notification.title}
            </Button>
          </td>
          <td style={{ verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 250 }}>
            {notification.content?.length > 50 
              ? `${notification.content.substring(0, 50)}...` 
              : notification.content}
          </td>
          <td style={{ verticalAlign: 'middle' }}>
            {getTargetTag(notification.target)}
          </td>
          <td style={{ verticalAlign: 'middle' }}>
            {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString('vi-VN', {
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : '-'}
          </td>
          <td style={{ verticalAlign: 'middle' }}>
            {notification.user?.name || 'Admin'}
          </td>
          <td style={{ verticalAlign: 'middle' }}>
            <div className="notification-action-group" style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <Button type="text" icon={<EyeOutlined />} onClick={() => onDetail(notification)} />
              <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(notification)} />
              <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(notification)} />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default NotificationTable;