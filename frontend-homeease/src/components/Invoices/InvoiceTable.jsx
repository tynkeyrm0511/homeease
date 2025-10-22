
import React from 'react';
import dayjs from 'dayjs';
import { Table, Button, Tag, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const getColumns = (onDetail, onEdit, onDelete) => [
  { title: 'Mã hóa đơn', dataIndex: 'id', key: 'id', width: 80, responsive: ['xs', 'sm', 'md', 'lg', 'xl'] },
  { title: 'Tên cư dân', dataIndex: 'user', key: 'user', width: 180, responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    render: (user) => (
      <Button type="link" onClick={() => onDetail(user)} style={{ padding: 0 }}>
        {user?.name || 'N/A'}
      </Button>
    )
  },
  { title: 'Số tiền', dataIndex: 'amount', key: 'amount', width: 120, responsive: ['sm', 'md', 'lg', 'xl'],
    render: (amount) => `${amount?.toLocaleString()} VNĐ` },
  { title: 'Loại hóa đơn', dataIndex: 'type', key: 'type', width: 140, responsive: ['sm', 'md', 'lg', 'xl'],
    render: (type) => {
      if (type === 'electric') return 'Điện';
      if (type === 'water') return 'Nước';
      if (type === 'service') return 'Dịch vụ';
      if (type === 'parking') return 'Gửi xe';
      return 'Khác';
    }
  },
  { title: 'Trạng thái', dataIndex: 'isPaid', key: 'isPaid', width: 120, responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    render: (isPaid, record) => {
      // Quá hạn nếu chưa thanh toán và đã quá hạn
      const isOverdue = record.dueDate && !isPaid && new Date(record.dueDate) < new Date();
      if (isPaid) return <Tag color="green">Đã thu tiền</Tag>;
      if (isOverdue) return <Tag color="red">Quá hạn</Tag>;
      return <Tag color="gold">Còn nợ</Tag>;
    }
  },
  { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', width: 120, responsive: ['md', 'lg', 'xl'],
    render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '' },
  { title: 'Hạn thanh toán', dataIndex: 'dueDate', key: 'dueDate', width: 120, responsive: ['md', 'lg', 'xl'],
    render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '' },
  { title: 'Hành động', key: 'action', width: 100, responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    render: (_, record) => (
      <>
        <Tooltip title="Sửa">
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)} style={{ marginRight: 4 }} />
        </Tooltip>
        <Popconfirm title="Bạn có chắc muốn xóa hóa đơn này?" onConfirm={() => onDelete(record.id)} okText="Xóa" cancelText="Hủy">
          <Tooltip title="Xóa">
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </Popconfirm>
      </>
    )
  },
];



const InvoiceTable = ({ invoices, onDetail, onEdit, onDelete }) => {
  return (
    <Table
      columns={getColumns(onDetail, onEdit, onDelete)}
      dataSource={invoices}
      rowKey="id"
      pagination={false} // handled externally by InvoiceList
      scroll={{ x: 'max-content' }}
      style={{ fontSize: '0.97rem', background: '#fff', width: '100%' }}
      rowClassName={() => 'invoice-row-custom'}
    />
  );
};

export default InvoiceTable;
