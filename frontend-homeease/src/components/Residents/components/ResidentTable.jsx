import React from 'react';
import { Button, Table, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const getColumns = (onEdit, onDelete, onDetail, renderStatus) => [
  { 
    title: 'ID', 
    dataIndex: 'id', 
    key: 'id', 
    width: 60,
    sorter: (a, b) => a.id - b.id
  },
  { 
    title: 'Tên', 
    dataIndex: 'name', 
    key: 'name', 
    width: 160,
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (text, record) => (
      <Button type="link" onClick={() => onDetail && onDetail(record)} style={{ padding: 0 }}>
        {text}
      </Button>
    )
  },
  { 
    title: 'Số căn hộ', 
    dataIndex: 'apartmentNumber', 
    key: 'apartmentNumber', 
    width: 120,
    render: (text) => text || '-',
    sorter: (a, b) => (a.apartmentNumber || '').localeCompare(b.apartmentNumber || '')
  },
  { 
    title: 'Email', 
    dataIndex: 'email', 
    key: 'email', 
    width: 220,
    sorter: (a, b) => a.email.localeCompare(b.email)
  },
  { 
    title: 'Vai trò', 
    dataIndex: 'role', 
    key: 'role', 
    width: 100,
    render: (text) => {
      let color = 'default';
      if (text === 'admin') color = 'blue';
      else if (text === 'resident') color = 'green';
      return <Tag color={color} style={{ fontWeight: 500, textTransform: 'capitalize' }}>{text}</Tag>;
    },
    filters: [
      { text: 'Admin', value: 'admin' },
      { text: 'Resident', value: 'resident' },
    ],
    onFilter: (value, record) => record.role === value
  },
  { 
    title: 'Trạng thái', 
    dataIndex: 'status', 
    key: 'status', 
    width: 100,
    align: 'center',
    render: (status) => {
      if (renderStatus) return renderStatus(status);
      
      let color = status === 'active' ? 'green' : 'red';
      let text = status === 'active' ? 'Hoạt động' : 'Vô hiệu';
      
      return <Tag color={color} style={{ fontWeight: 500 }}>{text}</Tag>;
    },
    filters: [
      { text: 'Hoạt động', value: 'active' },
      { text: 'Vô hiệu', value: 'inactive' },
    ],
    onFilter: (value, record) => record.status === value
  },
  { 
    title: 'Hành động', 
    key: 'action', 
    width: 100,
    render: (_, record) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(record)} />
      </div>
    )
  }
];

const ResidentTable = ({ residents, onEdit, onDelete, onDetail, renderStatus }) => (
  <Table
    columns={getColumns(onEdit, onDelete, onDetail, renderStatus)}
    dataSource={residents}
    rowKey="id"
    pagination={{ pageSize: 10 }}
    scroll={{ x: 900 }}
    style={{ 
      fontSize: '0.97rem', 
      background: '#fff', 
      width: '100%', 
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
    }}
  />
);

export default ResidentTable;
