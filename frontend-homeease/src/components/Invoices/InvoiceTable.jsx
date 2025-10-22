
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Table, Tag, Button } from 'antd';
import { QrcodeOutlined } from '@ant-design/icons';

const getColumns = (onDetail, isDesktop = false) => {
  const base = [
    { title: 'Mã hóa đơn', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Số tiền', dataIndex: 'amount', key: 'amount', width: 160,
      render: (amount) => `${amount?.toLocaleString()} VNĐ` },
    { title: 'Loại hóa đơn', dataIndex: 'type', key: 'type', width: 140,
      render: (type) => {
        if (type === 'electric') return 'Điện';
        if (type === 'water') return 'Nước';
        if (type === 'service') return 'Dịch vụ';
        if (type === 'parking') return 'Gửi xe';
        return 'Khác';
      }
    },
    { title: 'Trạng thái', dataIndex: 'isPaid', key: 'isPaid', width: 140,
      render: (isPaid, record) => {
        const isOverdue = record.dueDate && !isPaid && new Date(record.dueDate) < new Date();
        if (isPaid) return <Tag color="green">Đã thu tiền</Tag>;
        if (isOverdue) return <Tag color="red">Quá hạn</Tag>;
        return <Tag color="gold">Còn nợ</Tag>;
      }
    },
  ];

  // On non-desktop we include more small columns; on desktop we can simplify
  if (!isDesktop) {
    base.push({ title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', width: 120,
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '' })
  }

  base.push(
      { title: 'Hạn thanh toán', dataIndex: 'dueDate', key: 'dueDate', width: 140,
        render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '' }
  )

  // Add a lightweight Pay action column (keeps table compact; clicking row also opens detail)
  base.push({ title: 'Thanh toán', dataIndex: 'pay', key: 'pay', width: 120, render: (_, record) => (
    isDesktop ? (
      <Button className="btn-pay" type="primary" size="small" icon={<QrcodeOutlined />} aria-label="Thanh toán" title="Thanh toán" onClick={(e) => { e.stopPropagation(); if (record && typeof record._onPay === 'function') record._onPay(record); }}>Thanh toán</Button>
    ) : (
      <Button className="btn-pay btn-pay-icon" type="primary" size="small" icon={<QrcodeOutlined />} aria-label="Thanh toán" title="Thanh toán" onClick={(e) => { e.stopPropagation(); if (record && typeof record._onPay === 'function') record._onPay(record); }} />
    )
  )})

  return base
}



const InvoiceTable = ({ invoices, onDetail, compactOnMobile = false, renderStatus, onInvoiceClick }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 640);
      setIsDesktop(w >= 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // helper to render status tag as a compact pill (use parent provided renderer if available)
  const StatusTag = (inv) => {
    if (renderStatus) return renderStatus(inv);
    const isPaid = !!inv.isPaid;
    const isOverdue = inv.dueDate && !isPaid && new Date(inv.dueDate) < new Date();
    const commonStyle = { fontSize: 12, padding: '0 8px', borderRadius: 12, height: 24, display: 'inline-flex', alignItems: 'center' };
  if (isPaid) return <Tag color="green" style={commonStyle}>Đã thu tiền</Tag>;
  if (isOverdue) return <Tag style={{ ...commonStyle, color: '#ef4444', border: '1px solid #ef4444', background: '#fff' }}>Quá hạn</Tag>;
  return <Tag color="gold" style={commonStyle}>Còn nợ</Tag>;
  };

  // Mobile compact card list
  if (compactOnMobile && isMobile) {
    return (
      <div>
        {invoices.map(inv => (
          <div
            key={inv.id}
            className="invoice-compact-card"
            role="button"
            tabIndex={0}
            onClick={() => onInvoiceClick ? onInvoiceClick(inv) : onDetail(inv)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') (onInvoiceClick ? onInvoiceClick(inv) : onDetail(inv)); }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>#{inv.id}</div>
                    <div style={{ marginTop: 6, color: '#374151', fontSize: 13 }}>{inv.user?.name || ''}</div>
                  </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>{inv.amount ? `${inv.amount.toLocaleString()} VNĐ` : ''}</div>
                <div style={{ marginTop: 6 }}>{StatusTag(inv)}</div>
              </div>
            </div>

            <div style={{ height: 1, background: '#f3f4f6', marginTop: 12, borderRadius: 2 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, gap: 8 }}>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{inv.type || ''} • {inv.createdAt ? dayjs(inv.createdAt).format('DD/MM/YYYY') : ''}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {inv.dueDate && <div style={{ fontSize: 12, color: '#9ca3af' }}>Hạn: {dayjs(inv.dueDate).format('DD/MM/YYYY')}</div>}
                <div>
                  <Button className="btn-pay btn-pay-mobile btn-pay-icon" size="small" icon={<QrcodeOutlined />} aria-label="Thanh toán" title="Thanh toán" onClick={(e) => { e.stopPropagation(); inv && typeof inv._onPay === 'function' && inv._onPay(inv); }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table
      columns={getColumns(onDetail, isDesktop)}
      dataSource={invoices}
      rowKey="id"
      pagination={false} // handled externally by InvoiceList
      scroll={{ x: '100%' }}
      style={{ fontSize: '0.98rem', background: '#fff', width: '100%', minWidth: 720 }}
      rowClassName={() => 'invoice-row-custom'}
      onRow={(record) => ({
        onClick: () => onInvoiceClick ? onInvoiceClick(record) : (onDetail ? onDetail(record) : null),
        style: { cursor: 'pointer' }
      })}
    />
  );
};

export default InvoiceTable;
