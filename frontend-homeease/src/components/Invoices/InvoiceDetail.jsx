import React from 'react'
import { Card, Button } from 'antd'
import { QrcodeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const InvoiceDetail = ({ invoice, onPay, onBack }) => {
  if (!invoice) return <div style={{ padding: 16 }}>Không tìm thấy hóa đơn.</div>

  return (
    <div style={{ padding: 16 }}>
      <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>Hóa đơn #{invoice.id}</h3>
            <div style={{ color: '#6b7280' }}>{invoice.user?.name || 'N/A'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, fontSize: 20 }}>{invoice.amount?.toLocaleString()} VNĐ</div>
            <div style={{ color: '#6b7280', fontSize: 12 }}>{invoice.dueDate ? dayjs(invoice.dueDate).format('DD/MM/YYYY') : ''}</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <p><strong>Loại:</strong> {invoice.type}</p>
          <p><strong>Ghi chú:</strong> {invoice.note || 'Không có'}</p>
          <p><strong>Ngày tạo:</strong> {invoice.createdAt ? dayjs(invoice.createdAt).format('DD/MM/YYYY') : ''}</p>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button onClick={onBack}>Quay lại</Button>
          <Button className="btn-pay" type="primary" icon={<QrcodeOutlined />} aria-label="Thanh toán" title="Thanh toán" onClick={() => onPay(invoice)}>Thanh toán</Button>
        </div>
      </Card>
    </div>
  )
}

export default InvoiceDetail
