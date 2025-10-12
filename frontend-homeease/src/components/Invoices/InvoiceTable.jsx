import React from 'react';
import { Button, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const InvoiceTable = ({ invoices, onDetail, renderStatus, onEdit, onDelete }) => (
  <table className="invoice-table" style={{ width: '100%', fontSize: '0.97rem', marginBottom: 0, borderCollapse: 'separate', borderSpacing: 0, minWidth: 900 }}>
    <thead>
      <tr>
        <th style={{ width: 50 }}>Mã hóa đơn</th>
        <th style={{ width: 160 }}>Tên cư dân</th>
        <th style={{ width: 120 }}>Số tiền</th>
        <th style={{ width: 120 }}>Loại hóa đơn</th>
        <th style={{ width: 100, textAlign: 'center' }}>Trạng thái</th>
        <th style={{ width: 120 }}>Ngày tạo</th>
        <th style={{ width: 120 }}>Hạn thanh toán</th>
        <th style={{ width: 120 }}>Hành động</th>
      </tr>
    </thead>
    <tbody>
      {invoices.map((invoice) => (
        <tr key={invoice.id} className="invoice-row-padding">
          <td style={{ verticalAlign: 'middle' }}>{invoice.id}</td>
          <td style={{ verticalAlign: 'middle' }}>
            <Button type="link" onClick={() => onDetail(invoice.user)} style={{ padding: 0 }}>
              {invoice.user?.name || 'N/A'}
            </Button>
          </td>
          <td style={{ verticalAlign: 'middle' }}>{invoice.amount?.toLocaleString()} VNĐ</td>
          <td style={{ verticalAlign: 'middle' }}>{invoice.type === 'electric' ? 'Điện' : invoice.type === 'water' ? 'Nước' : invoice.type === 'service' ? 'Dịch vụ' : 'Khác'}</td>
          <td style={{ verticalAlign: 'middle', padding: 0, height: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 40 }}>
              {renderStatus(invoice.status)}
            </div>
          </td>
          <td style={{ verticalAlign: 'middle' }}>{invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : ''}</td>
          <td style={{ verticalAlign: 'middle' }}>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : ''}</td>
          <td style={{ verticalAlign: 'middle' }}>
            <Tooltip title="Sửa">
              <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(invoice)} style={{ marginRight: 4 }} />
            </Tooltip>
            <Popconfirm title="Bạn có chắc muốn xóa hóa đơn này?" onConfirm={() => onDelete(invoice.id)} okText="Xóa" cancelText="Hủy">
              <Tooltip title="Xóa">
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default InvoiceTable;
