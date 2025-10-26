import React, { useEffect, useState } from 'react'
import { getRequests, getInvoices, getRequestById, updateRequestStatus, cancelRequest } from '../../services/api'
import RequestDetailModal from '../Requests/RequestDetailModal'
import { List } from 'antd-mobile'
import { message } from 'antd'
import './recent-activity.css'

const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff/60)}m`
  if (diff < 86400) return `${Math.floor(diff/3600)}h`
  return `${Math.floor(diff/86400)}d`
}

const statusMap = {
  // request statuses
  pending: { label: 'Đang chờ', color: 'yellow' },
  in_progress: { label: 'Đang xử lý', color: 'blue' },
  completed: { label: 'Hoàn thành', color: 'green' },
  rejected: { label: 'Bị từ chối', color: 'red' },
  cancelled: { label: 'Đã huỷ', color: 'gray' },
  // invoice statuses
  paid: { label: 'Đã thanh toán', color: 'green' },
  unpaid: { label: 'Chưa thanh toán', color: 'red' }
}

const RecentActivity = ({ userId, onNavigate }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalRequest, setModalRequest] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!userId) return
      setLoading(true)
      try {
        const [reqs, invs] = await Promise.all([
          getRequests({ userId }),
          getInvoices({ userId })
        ])
        const requests = Array.isArray(reqs) ? reqs : reqs?.data || []
        const invoices = Array.isArray(invs) ? invs : invs?.data || []

        // Normalize items
        const normalized = [
          ...requests.map(r => ({
            id: `r-${r.id}`,
            type: 'request',
            title: r.description?.slice(0,60) || 'Yêu cầu mới',
            status: r.status,
            date: r.createdAt || r.updatedAt
          })),
          ...invoices.map(i => ({
            id: `i-${i.id}`,
            type: 'invoice',
            title: `Hóa đơn: ${i.amount ?? ''}`,
            status: i.isPaid ? 'paid' : 'unpaid',
            date: i.createdAt || i.dueDate
          }))
        ]

        normalized.sort((a,b) => new Date(b.date) - new Date(a.date))
        setItems(normalized.slice(0,6))
      } catch (err) {
        console.error(err)
        message.error('Không thể tải hoạt động gần đây')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [userId])

  if (loading) {
    // simple skeleton placeholders
    return (
      <div className="ra-shell">
        <div className="ra-list">
          {[1,2,3].map(n => (
            <div key={n} className="ra-card ra-skeleton">
              <div className="ra-left">
                <div className={`ra-avatar ra-request`}></div>
              </div>
              <div className="ra-main">
                <div className="ra-title ra-skel-title" />
                <div className="ra-sub">
                  <span className="ra-badge ra-badge--gray ra-skel-badge" />
                  <span className="ra-time ra-skel-time" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!items.length) return <div className="ra-shell">Không có hoạt động gần đây</div>

  return (
    <>
    <div className="ra-shell">
      <div className="ra-list">
        {items.map(it => {
          const mapKey = it.type === 'request' ? it.status : (it.status === 'paid' ? 'paid' : 'unpaid')
          const st = statusMap[mapKey] || { label: it.status, color: 'gray' }
          return (
            <div
              key={it.id}
              className="ra-card"
              role="button"
              tabIndex={0}
              onClick={async () => {
                  if (it.type === 'invoice') {
                    if (!onNavigate) return
                    return onNavigate('my-invoices')
                  }
                  // open request detail modal
                  const rawId = String(it.id).replace(/^r-/, '')
                  setModalLoading(true)
                  try {
                    const res = await getRequestById(rawId)
                    const req = res?.data || res || null
                    setModalRequest(req)
                    setModalOpen(true)
                  } catch (err) {
                    console.error('Failed to load request detail', err)
                  } finally {
                    setModalLoading(false)
                  }
                }}
              onKeyDown={(e) => { if (e.key === 'Enter') { if (it.type === 'request') onNavigate && onNavigate('my-requests') ; else onNavigate && onNavigate('my-invoices') } }}
            >
              <div className="ra-left">
                <div className={`ra-avatar ra-${it.type}`}>{it.type === 'request' ? '🔧' : '💸'}</div>
              </div>
              <div className="ra-main">
                <div className="ra-title">{it.title}</div>
                <div className="ra-sub">
                  <span className={`ra-badge ra-badge--${st.color}`}>{st.label}</span>
                  <span className="ra-time">{timeAgo(it.date)}</span>
                </div>
              </div>
            </div>
          )
        })}
        <div className="ra-see-more">
          <button className="ra-see-more-btn" onClick={() => onNavigate ? onNavigate('my-requests') : window.location.hash = '#/my-requests'}>Xem tất cả</button>
        </div>
      </div>
    </div>
    {/* Request Detail Modal */}
    <RequestDetailModal
      open={modalOpen}
      request={modalRequest}
      loading={modalLoading}
      isAdmin={false}
      isOwner={!!(modalRequest && modalRequest.user && String(modalRequest.user.id) === String(userId))}
      onClose={() => { setModalOpen(false); setModalRequest(null) }}
      onCancel={async (id) => {
        try {
          setModalLoading(true)
          await cancelRequest(id)
          // update list: mark item as cancelled locally
          setItems(curr => curr.map(it => it.id === `r-${id}` ? { ...it, status: 'cancelled' } : it))
          setModalOpen(false)
        } catch (err) {
          console.error('Cancel request failed', err)
        } finally { setModalLoading(false) }
      }}
      onStatusChange={async (newStatus) => {
        if (!modalRequest) return
        try {
          setModalLoading(true)
          await updateRequestStatus(modalRequest.id, { status: newStatus })
          setModalRequest(r => ({ ...r, status: newStatus }))
          setItems(curr => curr.map(it => it.id === `r-${modalRequest.id}` ? { ...it, status: newStatus } : it))
        } catch (err) {
          console.error('Update status failed', err)
        } finally { setModalLoading(false) }
      }}
      onSave={async () => {
        // For now, close modal — saving handled by onStatusChange in admin flows
        setModalOpen(false)
      }}
    />
    </>
  )
}

export default RecentActivity
