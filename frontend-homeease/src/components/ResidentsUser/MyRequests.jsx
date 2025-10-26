import React, { useEffect, useState } from 'react'
import { PullToRefresh, Button } from 'antd-mobile'
import { message } from 'antd'
import { getRequests, getRequestById, updateRequestStatus, cancelRequest } from '../../services/api'
import RequestDetailModal from '../Requests/RequestDetailModal'
import { useAuth } from '../../contexts/AuthContext'

const MyRequests = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [requests, setRequests] = useState([])
  const [selected, setSelected] = useState(null)
  const { user } = useAuth()
  // derive current user info, fallback to decoding token if AuthContext hasn't populated yet
  const decodeToken = () => {
    try {
      const t = localStorage.getItem('token')
      if (!t) return null
      const payload = JSON.parse(atob(t.split('.')[1]))
      return payload
    } catch {
      return null
    }
  }

  const tokenPayload = decodeToken()
  const currentUserId = user?.id || tokenPayload?.userId || tokenPayload?.id
  const currentUserRole = (user?.role || tokenPayload?.role || tokenPayload?.userRole || '').toLowerCase()
  const isAdmin = currentUserRole === 'admin'

  const fetch = async () => {
    try {
      setLoading(true)
      const data = await getRequests({})
      // getRequests now normalizes result to an array
      setRequests(data || [])
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
      await cancelRequest(id)
      message.success('Đã hủy yêu cầu')
      // remove from list or refetch
      setRequests(prev => prev.filter(r => r.id !== id))
      setSelected(null)
    } catch {
      message.error('Hủy thất bại')
    }
  }

  const handleStatusChange = (newStatus) => {
    setSelected(prev => prev ? { ...prev, status: newStatus } : prev)
  }

  const handleSave = async () => {
    if (!selected) return
    try {
      setLoading(true)
      await updateRequestStatus(selected.id, { status: selected.status })
      message.success('Đã lưu trạng thái')
      // refresh list
      await fetch()
      setSelected(null)
    } catch {
      message.error('Lưu thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
  // make this container grow to fill the available space under the fixed header
  <div className="flex-1 min-h-0 pt-4 sm:pt-6 p-3 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Yêu cầu của tôi</h2>
        <Button size="small" onClick={() => onNavigate && onNavigate('create-request')}>Tạo mới</Button>
      </div>

      <div className="flex-1 min-h-0">
        <PullToRefresh onRefresh={onRefresh} refreshing={refreshing}>
          <div className="space-y-3 flex-1 overflow-y-auto">
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
            requests.map(r => {
              // map category values to Vietnamese labels
              const categoryMap = {
                electricity: 'Điện',
                water: 'Nước',
                cleaning: 'Vệ sinh',
                parking: 'Gửi xe',
                service: 'Dịch vụ',
                other: 'Khác'
              };

              const categoryLabel = categoryMap[r.category] || r.category || 'Yêu cầu';

              // color classes for category tags
              const categoryColorMap = {
                electricity: 'bg-yellow-100 text-yellow-800',
                water: 'bg-blue-100 text-blue-800',
                cleaning: 'bg-green-100 text-green-800',
                parking: 'bg-indigo-100 text-indigo-800',
                service: 'bg-purple-100 text-purple-800',
                other: 'bg-gray-100 text-gray-800'
              };
              const categoryColorClass = categoryColorMap[r.category] || 'bg-gray-100 text-gray-800';

              // Prefer an explicit title, otherwise use first line/summary of description
              const displayTitle = r.title && r.title.trim()
                ? r.title
                : (r.description && r.description.split('\n')[0].slice(0, 80)) || 'Không có tiêu đề';

              // Human-friendly status (Vietnamese labels)
              const statusMap = {
                pending: 'Đang chờ',
                in_progress: 'Đang xử lý',
                completed: 'Hoàn thành',
                rejected: 'Từ chối',
                cancelled: 'Đã hủy'
              };
              const statusLabel = statusMap[r.status] || r.status;

              return (
                // Use overflow-hidden and a subtle shadow + transparent border so rounded corners render cleanly
                <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm overflow-hidden border border-transparent">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${categoryColorClass}`}>{categoryLabel}</span>
                      </div>
                      <div className="mt-1 font-medium">{displayTitle}</div>
                      <div className="mt-2 text-xs text-gray-400">{new Date(r.createdAt || r.created_at || Date.now()).toLocaleString()}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {/* status badge with color */}
                      {(() => {
                        const statusColorMap = {
                          pending: 'bg-yellow-100 text-yellow-800',
                          in_progress: 'bg-blue-100 text-blue-800',
                          completed: 'bg-green-100 text-green-800',
                          rejected: 'bg-red-100 text-red-800',
                          cancelled: 'bg-gray-100 text-gray-600'
                        };
                        const statusClass = statusColorMap[r.status] || 'bg-gray-100 text-gray-800';
                        return (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                            {statusLabel}
                          </span>
                        )
                      })()}
                      <Button size="mini" onClick={() => openDetail(r.id)}>Xem</Button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
  </PullToRefresh>
  </div>

  {selected && (
        <RequestDetailModal
          open={!!selected}
          request={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onSave={handleSave}
          loading={loading}
          onCancel={handleCancel}
          isAdmin={isAdmin}
          isOwner={Number(selected.userId) === Number(currentUserId)}
        />
      )}
    </div>
  )
}

export default MyRequests
