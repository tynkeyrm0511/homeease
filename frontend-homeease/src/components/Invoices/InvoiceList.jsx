import React, { useEffect, useState } from 'react';
import { Table, Button, Spin, message } from 'antd';
import { getInvoices } from '../../services/api';

const InvoiceList = ({ onShowResidentDetail }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (err) {
      setError('Không thể tải danh sách hóa đơn!');
      message.error('Lỗi tải hóa đơn!');
    } finally {
      setLoading(false);
    }
  };

  const handleShowResidentDetail = (residentId) => {
    if (onShowResidentDetail && residentId) {
      onShowResidentDetail(residentId);
    }
  };

  const columns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên cư dân',
      key: 'residentName',
      render: (_, record) => (
        <Button type="link" onClick={() => handleShowResidentDetail(record.user?.id)}>
          {record.user?.name || 'N/A'}
        </Button>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount.toLocaleString()} VNĐ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    // Thêm các cột khác nếu cần
  ];

  return (
    <div className="container-xl px-4 py-4">
      <h4 className="fw-semibold mb-4">Danh sách hóa đơn</h4>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={invoices}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
      {error && <div className="text-danger mt-2">{error}</div>}
      <Button type="primary" className="mt-3">Thêm hóa đơn</Button>
    </div>
  );
};

export default InvoiceList;
