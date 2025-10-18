// src/components/Notifications/NotificationTable.jsx
import React from 'react';
import { Button, Table, Tag, Tooltip } from 'antd';
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

const getColumns = (onEdit, onDelete, onDetail) => [
  { 
    title: 'ID', 
    dataIndex: 'id', 
    key: 'id', 
    width: 60,
    sorter: (a, b) => a.id - b.id
  },
  { 
    title: 'Tiêu đề', 
    dataIndex: 'title', 
    key: 'title', 
    width: 160,
    sorter: (a, b) => a.title.localeCompare(b.title),
    ellipsis: {
      showTitle: false,
    },
    render: (text, record) => (
      <Tooltip placement="topLeft" title={text}>
        <Button type="link" onClick={() => onDetail && onDetail(record)} style={{ padding: 0, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {text}
        </Button>
      </Tooltip>
    )
  },
  { 
    title: 'Nội dung', 
    dataIndex: 'content', 
    key: 'content', 
    width: 250,
    ellipsis: {
      showTitle: false,
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text || ''}>
        {text?.length > 50 ? `${text.substring(0, 50)}...` : text || ''}
      </Tooltip>
    )
  },
  { 
    title: 'Đối tượng', 
    dataIndex: 'target', 
    key: 'target', 
    width: 120,
    render: (target) => getTargetTag(target),
    filters: [
      { text: 'Tất cả', value: 'all' },
      { text: 'Cư dân cụ thể', value: 'residentId' },
      { text: 'Nhóm cư dân', value: 'group' },
    ],
    onFilter: (value, record) => record.target === value
  },
  { 
    title: 'Ngày tạo', 
    dataIndex: 'createdAt', 
    key: 'createdAt', 
    width: 160,
    sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    render: (date) => date ? new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '-'
  },
  { 
    title: 'Người tạo', 
    dataIndex: 'user', 
    key: 'user', 
    width: 120,
    render: (user) => user?.name || 'Admin'
  },
  { 
    title: 'Hành động', 
    key: 'action', 
    width: 120,
    render: (_, record) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <Button type="text" icon={<EyeOutlined />} onClick={() => onDetail(record)} />
        <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(record)} />
      </div>
    )
  }
];

const NotificationTable = ({ notifications, onEdit, onDelete, onDetail }) => (
  <Table
    columns={getColumns(onEdit, onDelete, onDetail)}
    dataSource={notifications}
    rowKey="id"
    pagination={{ pageSize: 10 }}
    scroll={{ x: 1100 }}
    style={{ 
      fontSize: '0.97rem', 
      background: '#fff', 
      width: '100%', 
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
    }}
    rowClassName={() => 'notification-table-row'}
    className="notification-table-custom"
  />
);

export default NotificationTable;