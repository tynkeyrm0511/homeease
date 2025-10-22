import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getResidents, getRequests, getInvoices } from '../services/api'
import { Toast } from 'antd-mobile'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import { MdPeople, MdRequestPage, MdPayment, MdCheckCircle, MdGroups, MdArticle, MdReceiptLong, MdCampaign } from 'react-icons/md'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const AdminDashboard = ({ onNavigate, setCurrentView }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalResidents: 0,
    pendingRequests: 0,
    overdueInvoices: 0,
    completedRequests: 0
  })
  const [chartData, setChartData] = useState({
    requestsByStatus: [],
    requestsByMonth: [],
    invoicesByMonth: [],
  })

  const fetchStats = async () => {
    try {
      setLoading(true)
      const [residentsRes, requestsRes, invoicesRes] = await Promise.all([
        getResidents(),
        getRequests(),
        getInvoices()
      ])

      const residents = residentsRes?.data || residentsRes || []
      const requests = requestsRes?.data || requestsRes || []
      const invoices = invoicesRes?.data || invoicesRes || []

      const totalResidents = Array.isArray(residents) ? residents.length : 0
      const pendingRequests = Array.isArray(requests) ? requests.filter(r => r.status === 'pending').length : 0
      const completedRequests = Array.isArray(requests) ? requests.filter(r => r.status === 'completed').length : 0
      const inProgressRequests = Array.isArray(requests) ? requests.filter(r => r.status === 'in_progress' || r.status === 'in-progress').length : 0
      const rejectedRequests = Array.isArray(requests) ? requests.filter(r => r.status === 'rejected' || r.status === 'từ chối').length : 0
      
      const today = new Date()
      const overdueInvoices = Array.isArray(invoices) ? invoices.filter(inv => 
        !inv.isPaid && new Date(inv.dueDate) < today
      ).length : 0

      setStats({
        totalResidents,
        pendingRequests,
        overdueInvoices,
        completedRequests
      })

      // Process data for charts
      
      // 1. Requests by status (Pie Chart) - 4 trạng thái
      const requestsByStatus = [
        { name: 'Chờ xử lý', value: pendingRequests, fill: '#f59e0b' },
        { name: 'Đang xử lý', value: inProgressRequests, fill: '#3b82f6' },
        { name: 'Hoàn thành', value: completedRequests, fill: '#10b981' },
        { name: 'Từ chối', value: rejectedRequests, fill: '#ef4444' },
      ].filter(item => item.value > 0)

      // 2. Requests by month (Bar Chart)
      const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
      const requestsByMonth = {}
      
      if (Array.isArray(requests)) {
        requests.forEach(req => {
          if (req.createdAt) {
            const date = new Date(req.createdAt)
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`
            const monthLabel = monthNames[date.getMonth()]
            
            if (!requestsByMonth[monthKey]) {
              requestsByMonth[monthKey] = { month: monthLabel, requests: 0, date: date }
            }
            requestsByMonth[monthKey].requests++
          }
        })
      }

      // Get last 4 months of data
      const sortedMonths = Object.values(requestsByMonth)
        .sort((a, b) => b.date - a.date)
        .slice(0, 4)
        .reverse()
        .map(({ month, requests }) => ({ month, requests }))

      // 3. Invoices payment trend (Line Chart)
      const invoicesByMonth = {}
      
      if (Array.isArray(invoices)) {
        invoices.forEach(inv => {
          if (inv.createdAt) {
            const date = new Date(inv.createdAt)
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`
            const monthLabel = monthNames[date.getMonth()]
            
            if (!invoicesByMonth[monthKey]) {
              invoicesByMonth[monthKey] = { 
                month: monthLabel, 
                paid: 0, 
                unpaid: 0,
                total: 0,
                date: date 
              }
            }
            
            invoicesByMonth[monthKey].total++
            if (inv.isPaid || inv.status === 'paid') {
              invoicesByMonth[monthKey].paid++
            } else {
              invoicesByMonth[monthKey].unpaid++
            }
          }
        })
      }

      // Calculate percentages and get last 4 months
      const sortedInvoices = Object.values(invoicesByMonth)
        .sort((a, b) => b.date - a.date)
        .slice(0, 4)
        .reverse()
        .map(({ month, paid, unpaid, total }) => ({
          month,
          paid: total > 0 ? Math.round((paid / total) * 100) : 0,
          unpaid: total > 0 ? Math.round((unpaid / total) * 100) : 0,
        }))

      setChartData({
        requestsByStatus: requestsByStatus.length > 0 ? requestsByStatus : [{ name: 'Không có dữ liệu', value: 1, fill: '#e5e7eb' }],
        requestsByMonth: sortedMonths.length > 0 ? sortedMonths : [{ month: 'T10', requests: 0 }],
        invoicesByMonth: sortedInvoices.length > 0 ? sortedInvoices : [{ month: 'T10', paid: 0, unpaid: 0 }],
      })
    } catch (err) {
      console.error('Failed to fetch admin stats', err)
      Toast.show({ content: 'Không thể tải dữ liệu. Vui lòng thử lại.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleMenuClick = (view) => {
    // Mirror Header.jsx navigation behavior:
    // 1) If parent provided setCurrentView (preferred), use it
    // 2) Else if onNavigate is provided, call it
    // 3) Fallback to hash-based navigation for older setups
    let target = view
    // keep parity with Header: map dashboard->resident-dashboard for residents if needed
    // (AdminDashboard currently doesn't expose `user.role` changes here, but we keep
    // mapping behavior minimal — callers can pass the desired view).
    try {
      if (typeof setCurrentView === 'function') {
        setCurrentView(target)
        return
      }
      if (typeof onNavigate === 'function') {
        onNavigate(target)
        return
      }
      // final fallback
      window.location.hash = `#/${target}`
    } catch (e) {
      console.warn('Navigation fallback failed', e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="sm:mx-auto sm:max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden mx-3 mt-3 rounded-2xl sm:rounded-3xl sm:mx-6 sm:mt-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 pt-4 pb-3 px-4 sm:pt-6 sm:pb-4 sm:px-6 shadow-xl sm:shadow-2xl shadow-indigo-500/20"
        >
          <div className="relative z-10 flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/90 text-lg sm:text-xl font-bold text-indigo-600 shadow-lg"
              >
                {user?.name?.charAt(0) || 'A'}
              </motion.div>
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl sm:text-2xl font-bold text-white"
                >
                  Xin chào, Admin {user?.name || 'User'}! 👋
                </motion.h2>
                <p className="text-xs sm:text-sm text-white/90 mt-1">
                  Quản lý và theo dõi hoạt động của toàn bộ chung cư
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="px-3 sm:px-6">
          <div className="mt-3 sm:mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Residents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="group rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-lg transition-all cursor-pointer"
              onClick={() => handleMenuClick('residents')}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-xl sm:text-2xl shadow-md text-white">
                    <MdPeople size={24} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Tổng cư dân</p>
                    <motion.div
                      key={stats.totalResidents}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl sm:text-3xl font-bold text-gray-900"
                    >
                      {loading ? '...' : <CountUp end={stats.totalResidents || 0} duration={1} />}
                    </motion.div>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMenuClick('residents')}
                className="mt-3 sm:mt-4 w-full rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 py-2 text-xs sm:text-sm font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                Quản lý cư dân
              </motion.button>
            </motion.div>

            {/* Pending Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="group rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-lg transition-all cursor-pointer"
              onClick={() => handleMenuClick('requests')}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-xl sm:text-2xl shadow-md text-white">
                    <MdRequestPage size={24} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Yêu cầu chờ</p>
                    <motion.div
                      key={stats.pendingRequests}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl sm:text-3xl font-bold text-gray-900"
                    >
                      {loading ? '...' : <CountUp end={stats.pendingRequests || 0} duration={1} />}
                    </motion.div>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMenuClick('requests')}
                className="mt-3 sm:mt-4 w-full rounded-lg sm:rounded-xl border border-amber-200 bg-amber-50 py-2 text-xs sm:text-sm font-medium text-amber-600 transition-all hover:border-amber-300 hover:bg-amber-100"
              >
                Xem yêu cầu
              </motion.button>
            </motion.div>

            {/* Overdue Invoices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="group rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-lg transition-all cursor-pointer"
              onClick={() => handleMenuClick('invoices')}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-red-500 to-pink-500 text-xl sm:text-2xl shadow-md text-white">
                    <MdPayment size={24} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Hóa đơn quá hạn</p>
                    <motion.div
                      key={stats.overdueInvoices}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl sm:text-3xl font-bold text-gray-900"
                    >
                      {loading ? '...' : <CountUp end={stats.overdueInvoices || 0} duration={1} />}
                    </motion.div>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMenuClick('invoices')}
                className="mt-3 sm:mt-4 w-full rounded-lg sm:rounded-xl border border-red-200 bg-red-50 py-2 text-xs sm:text-sm font-medium text-red-600 transition-all hover:border-red-300 hover:bg-red-100"
              >
                Xem hóa đơn
              </motion.button>
            </motion.div>

            {/* Completed Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="group rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-lg transition-all cursor-pointer"
              onClick={() => handleMenuClick('requests')}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-xl sm:text-2xl shadow-md text-white">
                    <MdCheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Đã hoàn thành</p>
                    <motion.div
                      key={stats.completedRequests}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl sm:text-3xl font-bold text-gray-900"
                    >
                      {loading ? '...' : <CountUp end={stats.completedRequests || 0} duration={1} />}
                    </motion.div>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMenuClick('requests')}
                className="mt-3 sm:mt-4 w-full rounded-lg sm:rounded-xl border border-green-200 bg-green-50 py-2 text-center text-xs sm:text-sm font-medium text-green-600 transition-all hover:border-green-300 hover:bg-green-100"
              >
                Yêu cầu hoàn tất
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-3 sm:px-6 mt-4 sm:mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Thao tác nhanh</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { id: 'residents', name: 'Quản lý cư dân', subtitle: 'Thêm/sửa/xóa cư dân', gradient: 'from-blue-500 to-cyan-400', icon: <MdGroups size={36} /> },
                { id: 'requests', name: 'Xử lý yêu cầu', subtitle: 'Duyệt & cập nhật trạng thái', gradient: 'from-amber-400 to-amber-600', icon: <MdArticle size={36} /> },
                { id: 'invoices', name: 'Quản lý hóa đơn', subtitle: 'Tạo & theo dõi thanh toán', gradient: 'from-red-500 to-pink-400', icon: <MdReceiptLong size={36} /> },
                { id: 'notifications', name: 'Gửi thông báo', subtitle: 'Tạo chiến dịch nhanh', gradient: 'from-purple-500 to-violet-400', icon: <MdCampaign size={36} /> },
              ].map((action) => (
                <motion.button
                  key={action.id}
                  whileHover={{ translateY: -6, boxShadow: '0 18px 40px rgba(15,23,42,0.12)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMenuClick(action.id)}
                  className="w-full h-28 sm:h-32 flex items-center gap-4 p-5 sm:p-6 rounded-2xl bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className={`flex-shrink-0 h-16 w-16 sm:h-18 sm:w-18 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${action.gradient}`}>
                    {action.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base sm:text-lg font-semibold text-gray-800">{action.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{action.subtitle}</div>
                      </div>
                      <div className="text-gray-300">{/* Chevron */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="px-3 sm:px-6 mt-6 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Thống kê & Báo cáo</h3>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Request Status Pie Chart */}
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
              >
                <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Trạng thái yêu cầu</h4>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={chartData.requestsByStatus}
                      cx="50%"
                      cy="42%"
                      labelLine={false}
                      label={false}
                      outerRadius={120}
                      dataKey="value"
                    >
                    </Pie>
                    <Tooltip />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Monthly Requests Bar Chart */}
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
              >
                <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Yêu cầu theo tháng</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData.requestsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Bar dataKey="requests" fill="#4f46e5" radius={[8, 8, 0, 0]} name="Số yêu cầu" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Payment Trend Line Chart */}
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:col-span-2 lg:col-span-1"
              >
                <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Xu hướng thanh toán</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData.invoicesByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      formatter={(value) => `${value}%`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="paid" stroke="#10b981" strokeWidth={2} name="Đã thanh toán (%)" />
                    <Line type="monotone" dataKey="unpaid" stroke="#ef4444" strokeWidth={2} name="Chưa thanh toán (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
