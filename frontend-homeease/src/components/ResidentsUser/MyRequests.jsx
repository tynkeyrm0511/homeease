import React, { useEffect, useState } from 'react'
import { PullToRefresh, Button } from 'antd-mobile'
import { message } from 'antd'
import { getRequests, getRequestById, updateRequestStatus } from '../../services/api'
import RequestDetailModal from '../Requests/RequestDetailModal'

const MyRequests = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [requests, setRequests] = useState([])
  const [selected, setSelected] = useState(null)

  const fetch = async () => {
    try {
      setLoading(true)
      const data = await getRequests({})
      // Filter client-side by current user if API doesn't already scope
      setRequests(Array.isArray(data) ? data : data?.data || [])
    } catch {
      message.error('Không thể tải yêu cầu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      await fetch()
    } finally {
      setRefreshing(false)
    }
  }

  const openDetail = async (id) => {
    try {
      const detail = await getRequestById(id)
      setSelected(detail)
    } catch {
      message.error('Không thể mở chi tiết')
    }
  }

  const handleCancel = async (id) => {
    try {
      await updateRequestStatus(id, { status: 'cancelled' })
      message.success('Đã hủy yêu cầu')
      // remove from list or refetch
      setRequests(prev => prev.filter(r => r.id !== id))
      setSelected(null)
    } catch {
      message.error('Hủy thất bại')
    }
  }

  return (
  <div className="min-h-screen pt-4 sm:pt-6 p-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Yêu cầu của tôi</h2>
        <Button size="small" onClick={() => onNavigate && onNavigate('create-request')}>Tạo mới</Button>
      </div>

      <PullToRefresh onRefresh={onRefresh} refreshing={refreshing}>
        <div className="space-y-3">
          {loading ? (
            // simple loading placeholders
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-gray-100 animate-pulse" />
            ))
          ) : requests.length === 0 ? (
            <div className="text-center py-16">
              <p className="mb-4">Bạn chưa có yêu cầu nào</p>
              <Button onClick={() => onNavigate && onNavigate('create-request')}>Tạo yêu cầu</Button>
            </div>
          ) : (
            requests.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-gray-600">{r.category || 'Yêu cầu'}</div>
                    <div className="mt-1 font-medium">{r.title || r.summary || 'Không có tiêu đề'}</div>
                    <div className="mt-2 text-xs text-gray-400">{new Date(r.createdAt || r.created_at || Date.now()).toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="px-3 py-1 rounded-full text-xs bg-gray-100">{r.status}</div>
                    <Button size="mini" onClick={() => openDetail(r.id)}>Xem</Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PullToRefresh>

      {selected && (
        <RequestDetailModal request={selected} onClose={() => setSelected(null)} onCancel={handleCancel} />
      )}
    </div>
  )
}

export default MyRequests
