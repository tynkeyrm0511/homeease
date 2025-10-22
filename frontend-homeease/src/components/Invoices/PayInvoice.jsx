import React, { useEffect, useState } from 'react'
import { Card, Button, Spin, message } from 'antd'
import QRCode from 'qrcode'
import { createPaymentSession, getInvoicePaymentStatus, confirmMockPayment } from '../../services/api'

const PayInvoice = ({ invoice, onBack }) => {
  const [loading, setLoading] = useState(false)
  const [qrData, setQrData] = useState(null)
  const [paymentUrl, setPaymentUrl] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [status, setStatus] = useState('pending')
  const [error, setError] = useState(null)
  const [hasNotifiedSuccess, setHasNotifiedSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState(null)


  useEffect(() => {
    if (!invoice) return
    let mounted = true
    const setup = async () => {
      setLoading(true)
    try {
  const resp = await createPaymentSession(invoice.id)
  console.log('createPaymentSession resp', resp)
  if (resp?.sessionId) setSessionId(resp.sessionId)
  if (!mounted) return
    // Generate QR as data-URL client-side for reliability; fallback to Google Charts image
    try {
      const dataUrl = await QRCode.toDataURL(resp.paymentUrl, { width: 300 })
      setQrData(dataUrl)
    } catch (e) {
      console.warn('QR generation failed, falling back to Google Charts', e)
      const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(resp.paymentUrl)}`
      setQrData(qrUrl)
    }
  setPaymentUrl(resp.paymentUrl)

        // start polling
        pollStatus()
      } catch (err) {
        console.error('createPaymentSession error', err)
        const msg = err?.response?.data?.error || err.message || 'Không thể tạo phiên thanh toán'
        setError(msg)
        message.error(msg)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    let pollInterval = null
    const pollStatus = async () => {
      try {
        const s = await getInvoicePaymentStatus(invoice.id)
        setStatus(s.status)
        if (s.status === 'succeeded') {
          message.success('Thanh toán thành công!')
          // stop polling
          clearInterval(pollInterval)
        }
      } catch (err) {
        console.error('poll error', err)
      }
    }

    setup()
    pollInterval = setInterval(pollStatus, 3000)
    return () => { mounted = false; clearInterval(pollInterval) }
  }, [invoice])

  // Show a one-time notification when payment succeeds
  useEffect(() => {
    if (status === 'succeeded' && !hasNotifiedSuccess) {
      message.success('Thanh toán thành công!')
      setHasNotifiedSuccess(true)
    }
  }, [status, hasNotifiedSuccess])

  if (!invoice) return <div style={{ padding: 16 }}>Không tìm thấy hóa đơn.</div>

  return (
    <div style={{ padding: 16 }}>
      <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 16 }}>
        <h3>Thanh toán hóa đơn #{invoice.id}</h3>
        <p>Số tiền: <strong>{invoice.amount?.toLocaleString()} VNĐ</strong></p>
        <p>Nhấn vào QR code bên dưới để quét bằng ứng dụng ngân hàng của bạn.</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          {loading ? <Spin /> : (
            qrData ? <img src={qrData} alt="QR Payment" style={{ width: 220, height: 220, borderRadius: 8, cursor: 'pointer' }} onClick={async () => {
              if (!sessionId) return;
              setLoading(true)
              try {
                const resp = await confirmMockPayment(sessionId)
                // Immediately reflect success locally and capture tx id
                setStatus('succeeded')
                if (resp?.transactionId) setTransactionId(resp.transactionId)
                message.success('Thanh toán thành công (demo)')
              } catch (e) {
                console.error('confirm mock payment failed', e)
                message.error('Không thể hoàn tất thanh toán demo')
              } finally {
                setLoading(false)
              }
            }} /> : <div style={{ color: '#9ca3af' }}>Không có QR</div>
          )}
        </div>

        {status === 'succeeded' && (
          <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: '#ecfdf5', color: '#065f46' }}>
            <strong>Thanh toán thành công</strong>
            {transactionId && <div style={{ fontSize: 12, marginTop: 6 }}>Mã giao dịch: {transactionId}</div>}
          </div>
        )}

        {paymentUrl && (
          <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href={paymentUrl} target="_blank" rel="noreferrer">Mở liên kết thanh toán</a>
            <Button size="small" onClick={async () => {
              setLoading(true)
              setError(null)
              try {
                const resp = await createPaymentSession(invoice.id)
                // generate QR same as initial flow (data-URL) with fallback
                try {
                  const dataUrl = await QRCode.toDataURL(resp.paymentUrl, { width: 300 })
                  setQrData(dataUrl)
                } catch (e) {
                  console.warn('QR generation failed on retry, falling back to Google Charts', e)
                  const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(resp.paymentUrl)}`
                  setQrData(qrUrl)
                }
                setPaymentUrl(resp.paymentUrl)
                console.log('retry session', resp)
              } catch (e) {
                console.error('retry createPaymentSession error', e)
                const msg = e?.response?.data?.error || e.message || 'Tạo lại thất bại'
                setError(msg)
                message.error(msg)
              } finally { setLoading(false) }
            }}>Tạo lại</Button>
          </div>
        )}

        {error && <div style={{ marginTop: 12, color: 'red' }}>Lỗi: {String(error)}</div>}

        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ marginRight: 'auto', color: status === 'succeeded' ? 'green' : '#6b7280' }}>Trạng thái: <strong>{status}</strong></div>
          <Button onClick={onBack}>Quay lại</Button>
        </div>
      </Card>
    </div>
  )
}

export default PayInvoice
