import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getRequests, getInvoices } from '../../services/api'
import { PullToRefresh } from 'antd-mobile'
import { message } from 'antd'
import CountUp from 'react-countup'
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion'
import RecentActivity from './RecentActivity'

const ResidentDashboard = ({ onNavigate }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [requestsCount, setRequestsCount] = useState(0)
  const [invoicesCount, setInvoicesCount] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const fetchCounts = async () => {
    if (!user) return
    try {
      setLoading(true)
      const reqRes = await getRequests({ userId: user.id })
      const invRes = await getInvoices({ userId: user.id })

      const requests = Array.isArray(reqRes) ? reqRes : reqRes?.data || []
      const invoices = Array.isArray(invRes) ? invRes : invRes?.data || []

      setRequestsCount(requests.length)

      // Defensive: if API accidentally returns invoices not scoped to this user (e.g., admin token),
      // filter by invoice.user.id when available. Otherwise fall back to filtering by isPaid.
      const invoicesForUser = invoices.filter(i => {
        if (i?.user && i.user.id != null) return Number(i.user.id) === Number(user.id)
        // if no user on invoice object, assume it's already scoped by API
        return true
      })

      const due = invoicesForUser.filter(i => !i.isPaid).length
      setInvoicesCount(due)
    } catch (err) {
      console.error('Failed to fetch resident counts', err)
      message.error('Không thể tải dữ liệu. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchCounts()
    setRefreshing(false)
  }

  const handleMenuClick = (view) => {
    if (onNavigate) onNavigate(view)
    else {
      try {
        window.location.hash = `#/${view}`
      } catch (e) {
        console.warn('Navigation fallback failed', e)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <PullToRefresh onRefresh={onRefresh} refreshing={refreshing}>
        <div className="sm:mx-auto sm:max-w-7xl">
        {/* Hero Section with Beautiful Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden mx-3 mt-3 rounded-2xl sm:rounded-3xl sm:mx-6 sm:mt-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 pt-4 pb-3 px-4 sm:pt-6 sm:pb-4 sm:px-6 shadow-xl sm:shadow-2xl shadow-purple-500/20"
        >
        <div className="relative z-10 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/90 text-lg sm:text-xl font-bold text-purple-600 shadow-lg"
            >
              {user?.name?.charAt(0) || 'U'}
            </motion.div>
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl font-bold text-white"
              >
                Xin chào, {user?.name || 'User'}! 👋
              </motion.h2>
              <p className="text-xs sm:text-sm text-white/90 mt-1">
                Chúc bạn một ngày tốt lành! Dưới đây là thông tin về các yêu cầu, hóa đơn và hoạt động gần đây của bạn tại chung cư.
              </p>
            </div>
          </div>

          <div className="hidden gap-2 sm:flex">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMenuClick('create-request')}
              aria-label="Tạo yêu cầu mới"
              className="glass rounded-xl px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20"
            >
              Tạo mới
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMenuClick('my-requests')}
              aria-label="Xem yêu cầu của tôi"
              className="rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-purple-600 transition-all hover:bg-white"
            >
              Xem yêu cầu
            </motion.button>
          </div>
        </div>

        {/* Mobile CTAs */}
        <div className="mt-3 flex gap-2 sm:hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMenuClick('create-request')}
            aria-label="Tạo yêu cầu mới"
            className="glass flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white"
          >
            Tạo mới
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMenuClick('my-requests')}
            aria-label="Xem yêu cầu của tôi"
            className="flex-1 rounded-xl bg-white/90 px-4 py-2.5 text-sm font-semibold text-purple-600"
          >
            Xem yêu cầu
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="px-3 sm:px-6">
      <div className="mt-3 sm:mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Requests Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          className="group rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-lg transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-2 sm:gap-3">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-xl sm:text-2xl shadow-md">
                📄
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Tổng số yêu cầu</p>
                <motion.div
                  key={requestsCount}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                >
                  {loading ? '...' : <CountUp end={requestsCount || 0} duration={1} />}
                </motion.div>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleMenuClick('my-requests')}
            className="mt-3 sm:mt-4 w-full rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 py-2 text-xs sm:text-sm font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            Chi tiết
          </motion.button>
        </motion.div>

        {/* Invoices Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          className="group rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-lg transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-2 sm:gap-3">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-xl sm:text-2xl shadow-md">
                💸
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Hóa đơn chưa thanh toán</p>
                <motion.div
                  key={invoicesCount}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                >
                  {loading ? '...' : <CountUp end={invoicesCount || 0} duration={1} />}
                </motion.div>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleMenuClick('my-invoices')}
            className="mt-3 sm:mt-4 w-full rounded-lg sm:rounded-xl border border-red-200 bg-red-50 py-2 text-xs sm:text-sm font-medium text-red-600 transition-all hover:border-red-300 hover:bg-red-100"
          >
            Xem hóa đơn
          </motion.button>
        </motion.div>

        {/* Notifications Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-lg transition-all sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-2 sm:gap-3">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-xl sm:text-2xl shadow-md">
                🔔
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">Thông báo</p>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">Không có thông báo mới</p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-3 sm:mt-4 w-full rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 py-2 text-xs sm:text-sm font-medium text-gray-700 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600"
          >
            Xem
          </motion.button>
        </motion.div>
      </div>
      </div>

      {/* Recent Activity */}
      <div className="px-3 sm:px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-4 sm:mt-6 pb-4 sm:pb-6"
      >
        <h3 className="mb-3 text-base sm:text-lg font-bold text-gray-900">Hoạt động gần đây</h3>
        <RecentActivity userId={user?.id} />
      </motion.div>
      </div>

        </div>
      </PullToRefresh>
    </div>
  )
}

export default ResidentDashboard
