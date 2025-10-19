import React, { useEffect, useState } from 'react'
import { getRequests, getInvoices } from '../../services/api'
import { List, Toast } from 'antd-mobile'
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

const RecentActivity = ({ userId }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

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
        Toast.show({ content: 'Không thể tải hoạt động gần đây' })
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [userId])

  if (loading) return <div className="ra-shell">Đang tải hoạt động...</div>
  if (!items.length) return <div className="ra-shell">Không có hoạt động gần đây</div>

  return (
    <div className="ra-shell">
      <List header={<div style={{fontWeight:700}}>Hoạt động gần đây</div>}>
        {items.map(it => (
          <List.Item key={it.id} description={<small className="small-muted">{it.status} • {timeAgo(it.date)}</small>}>
            <div className="ra-item">
              <div className={`ra-icon ra-${it.type}`}>{it.type === 'request' ? '🔧' : '💸'}</div>
              <div className="ra-content">{it.title}</div>
            </div>
          </List.Item>
        ))}
      </List>
    </div>
  )
}

export default RecentActivity
