import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Statistic, Progress, Spin } from 'antd';
import { getResidents, getRequests, getInvoices } from '../services/api';

const Dashboard = ({ setCurrentView }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho các dữ liệu thống kê
  const [stats, setStats] = useState({
    totalResidents: 0,
    completedInfoPercent: 0,
    pendingRequests: 0,
    requestCategories: {},
    overdueInvoices: 0,
    overdueAmount: 0,
    completedRequests: 0,
    successRate: 0
  });
  
  // State cho dữ liệu biểu đồ
  const [requestData, setRequestData] = useState([]);
  const [requestTypeData, setRequestTypeData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [upcomingInvoices, setUpcomingInvoices] = useState([]);

  // Màu sắc cho biểu đồ tròn
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Hàm lấy dữ liệu
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Lấy dữ liệu cư dân
        const residentsData = await getResidents();
        
        // Lấy dữ liệu yêu cầu
        const requestsData = await getRequests();
        
        // Lấy dữ liệu hóa đơn
        const invoicesData = await getInvoices();
        
        // Xử lý dữ liệu cư dân
        const totalResidents = residentsData.length;
        
        // Tính % cư dân đã điền đầy đủ thông tin (có đủ các trường cơ bản)
        const completedInfoCount = residentsData.filter(r => 
          r.name && r.email && r.phone && r.apartmentNumber
        ).length;
        const completedInfoPercent = Math.round((completedInfoCount / totalResidents) * 100) || 0;
        
        // Xử lý dữ liệu yêu cầu
        const pendingRequests = requestsData.filter(r => r.status === 'pending').length;
        const inProgressRequests = requestsData.filter(r => r.status === 'in-progress').length;
        const completedRequests = requestsData.filter(r => r.status === 'completed').length;
        const successRate = Math.round((completedRequests / (pendingRequests + inProgressRequests + completedRequests)) * 100) || 0;
        
        // Tính toán phân loại yêu cầu
        const categories = {};
        requestsData.forEach(req => {
          if (req.category) {
            categories[req.category] = (categories[req.category] || 0) + 1;
          }
        });
        
        // Tạo dữ liệu biểu đồ tròn
        const typeData = Object.keys(categories).map(key => ({
          name: key,
          value: categories[key]
        }));
        
        // Xử lý dữ liệu hóa đơn
        const today = new Date();
        const overdueInvoices = invoicesData.filter(inv => 
          !inv.isPaid && new Date(inv.dueDate) < today
        );
        
        const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);
        
        // Tạo dữ liệu cho biểu đồ yêu cầu theo thời gian (7 ngày gần nhất)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          // Định dạng ngày để hiển thị
          const formattedDate = `T${i === 0 ? 'N' : 7-i}`;
          
          // Lọc yêu cầu cho ngày này
          const dayRequests = requestsData.filter(req => {
            const reqDate = new Date(req.createdAt);
            return reqDate.toDateString() === date.toDateString();
          });
          
          const pending = dayRequests.filter(r => r.status === 'pending').length;
          const inProgress = dayRequests.filter(r => r.status === 'in-progress').length;
          const completed = dayRequests.filter(r => r.status === 'completed').length;
          
          last7Days.push({
            name: formattedDate,
            pending,
            inProgress,
            completed
          });
        }
        
        // Tạo dữ liệu cho biểu đồ hóa đơn theo tháng (6 tháng gần nhất)
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          
          // Định dạng tháng để hiển thị
          const formattedMonth = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().substring(2)}`;
          
          // Lọc hóa đơn cho tháng này
          const monthInvoices = invoicesData.filter(inv => {
            const invDate = new Date(inv.createdAt);
            return invDate.getMonth() === date.getMonth() && invDate.getFullYear() === date.getFullYear();
          });
          
          const amount = monthInvoices.reduce((sum, inv) => sum + inv.amount, 0);
          const paid = monthInvoices.filter(inv => inv.isPaid).reduce((sum, inv) => sum + inv.amount, 0);
          
          last6Months.push({
            name: formattedMonth,
            amount,
            paid
          });
        }
        
        // Lấy 3 yêu cầu gần nhất
        const recent = [...requestsData]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map(req => ({
            id: req.id,
            description: req.description,
            status: req.status,
            category: req.category,
            priority: req.priority,
            user: req.user ? `${req.user.apartmentNumber} - ${req.user.name}` : 'Không xác định'
          }));
        
        // Lấy 3 hóa đơn sắp đến hạn
        const upcoming = [...invoicesData]
          .filter(inv => !inv.isPaid && new Date(inv.dueDate) >= today)
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 3)
          .map(inv => {
            const daysLeft = Math.ceil((new Date(inv.dueDate) - today) / (1000 * 60 * 60 * 24));
            return {
              id: inv.id,
              type: inv.type,
              amount: inv.amount,
              dueDate: new Date(inv.dueDate).toLocaleDateString('vi-VN'),
              daysLeft,
              user: inv.user ? inv.user.name : 'Không xác định'
            };
          });
          
        // Cập nhật state
        setStats({
          totalResidents,
          completedInfoPercent,
          pendingRequests,
          requestCategories: categories,
          overdueInvoices: overdueInvoices.length,
          overdueAmount,
          completedRequests,
          successRate
        });
        
        setRequestData(last7Days);
        setRequestTypeData(typeData);
        setInvoiceData(last6Months);
        setRecentRequests(recent);
        setUpcomingInvoices(upcoming);
        
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu dashboard:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
  <div className="container-xl px-4 py-3 compact-dashboard" style={{ paddingBottom: '20px' }}>
      <div className="row mb-2">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-semibold" style={{ fontWeight: 700, fontSize: '1.2rem' }}>TỔNG QUAN</h4>
          {loading && <Spin size="small" />}
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <Spin size="large" />
          <p className="mt-3">Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="card-title text-muted mb-0 fs-6">Tổng Cư dân</h5>
                    <div className="rounded-circle bg-light" style={{ padding: 8 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <h2 className="fw-bold mb-1">
                    <CountUp end={stats.totalResidents} duration={2.5} />
                  </h2>
                  <p className="text-success mb-0 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                      <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Tổng số người dùng</span>
                  </p>
                  <div className="mt-3">
                    <Progress percent={stats.completedInfoPercent} size="small" status="active" showInfo={false} />
                    <div className="d-flex justify-content-between mt-1">
                      <small className="text-muted">Đã điền thông tin</small>
                      <small className="text-primary">{stats.completedInfoPercent}%</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="card-title text-muted mb-0 fs-6">Yêu cầu Chờ</h5>
                    <div className="rounded-circle bg-light" style={{ padding: 8 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#ff9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 6V12L16 14" stroke="#ff9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <h2 className="fw-bold mb-1">
                    <CountUp end={stats.pendingRequests} duration={2} />
                  </h2>
                  <p className="text-warning mb-0 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Đang chờ xử lý</span>
                  </p>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between flex-wrap">
                      {Object.entries(stats.requestCategories).slice(0, 3).map(([category, count], index) => (
                        <span key={index} className={`badge ${index === 0 ? 'bg-warning text-dark' : index === 1 ? 'bg-info text-dark' : 'bg-secondary'} me-1 mb-1`}>
                          {category}: {count}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="card-title text-muted mb-0 fs-6">Hóa đơn Quá hạn</h5>
                    <div className="rounded-circle bg-light" style={{ padding: 8 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <h2 className="fw-bold mb-1 text-danger">
                    <CountUp end={stats.overdueInvoices} duration={1.5} />
                  </h2>
                  <p className="text-danger mb-0 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Đã quá hạn thanh toán</span>
                  </p>
                  <div className="mt-3">
                    <Progress percent={35} size="small" status="exception" showInfo={false} />
                    <div className="d-flex justify-content-between mt-1">
                      <small className="text-muted">Tổng: {stats.overdueAmount.toLocaleString('vi-VN')}₫</small>
                      <small className="text-danger">Quá hạn</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="card-title text-muted mb-0 fs-6">Hoàn thành</h5>
                    <div className="rounded-circle bg-light" style={{ padding: 8 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#198754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 4L12 14.01L9 11.01" stroke="#198754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <h2 className="fw-bold mb-1 text-success">
                    <CountUp end={stats.completedRequests} duration={2} />
                  </h2>
                  <p className="text-success mb-0 d-flex align-items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                      <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Yêu cầu đã hoàn thành</span>
                  </p>
                  <div className="mt-3">
                    <Progress percent={stats.successRate} size="small" status="success" showInfo={false} />
                    <div className="d-flex justify-content-between mt-1">
                      <small className="text-muted">Tỉ lệ thành công</small>
                      <small className="text-success">{stats.successRate}%</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!loading && !error && (
        <>
          {/* Recharts Visualization Section */}
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="mb-0 fw-semibold">Thống kê yêu cầu theo thời gian</h5>
                </div>
                <div className="card-body">
                  <div style={{ width: '100%', height: 240 }}>
                    <ResponsiveContainer>
                      <BarChart data={requestData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} yêu cầu`]} />
                        <Legend />
                        <Bar dataKey="pending" name="Chờ xử lý" fill="#faad14" />
                        <Bar dataKey="inProgress" name="Đang xử lý" fill="#1890ff" />
                        <Bar dataKey="completed" name="Hoàn thành" fill="#52c41a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="mb-0 fw-semibold">Phân loại yêu cầu</h5>
                </div>
                <div className="card-body">
                  {requestTypeData.length > 0 ? (
                    <div style={{ width: '100%', height: 240 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={requestTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {requestTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [`${value} yêu cầu`, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <p className="text-muted">Không có dữ liệu yêu cầu</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="mb-0 fw-semibold">Yêu cầu Gần đây</h5>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {recentRequests.length > 0 ? (
                      recentRequests.map((request) => (
                        <div key={request.id} className="list-group-item border-0 py-3 px-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1 fw-semibold">{request.description}</h6>
                              <p className="text-muted mb-0 small">{request.user}</p>
                            </div>
                            <span className={`badge ${
                              request.status === 'pending' ? 'bg-warning text-dark' : 
                              request.status === 'in-progress' ? 'bg-primary' :
                              request.status === 'completed' ? 'bg-success' : 'bg-danger'
                            }`}>
                              {request.status === 'pending' ? 'Chờ xử lý' : 
                               request.status === 'in-progress' ? 'Đang xử lý' :
                               request.status === 'completed' ? 'Hoàn thành' : request.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center">
                        <p className="text-muted mb-0">Không có yêu cầu gần đây</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-footer bg-white border-0 py-3">
                  <a href="#" className="text-decoration-none d-flex align-items-center justify-content-center" onClick={(e) => {e.preventDefault(); setCurrentView && setCurrentView('requests')}}>
                    <span className="me-2">Xem tất cả yêu cầu</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-semibold">Hóa đơn Sắp đến hạn</h5>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {upcomingInvoices.length > 0 ? (
                      upcomingInvoices.map((invoice) => (
                        <div key={invoice.id} className="list-group-item border-0 py-3 px-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1 fw-semibold">{invoice.type || 'Phí dịch vụ'}</h6>
                              <p className="text-muted mb-0 small">Hạn: {invoice.dueDate}</p>
                            </div>
                            <div className="text-end">
                              <h6 className="mb-0 fw-bold">{invoice.amount.toLocaleString('vi-VN')}₫</h6>
                              <span className={`small ${
                                invoice.daysLeft <= 7 ? 'text-danger' : 
                                invoice.daysLeft <= 14 ? 'text-warning' : 'text-success'
                              }`}>
                                Còn {invoice.daysLeft} ngày
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center">
                        <p className="text-muted mb-0">Không có hóa đơn sắp đến hạn</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-footer bg-white border-0 py-3">
                  <a href="#" className="text-decoration-none d-flex align-items-center justify-content-center" onClick={(e) => {e.preventDefault(); setCurrentView && setCurrentView('invoices')}}>
                    <span className="me-2">Xem tất cả hóa đơn</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Invoice Trend Chart */}
          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="mb-0 fw-semibold">Xu hướng hóa đơn 6 tháng gần nhất</h5>
                </div>
                <div className="card-body">
                  {invoiceData.length > 0 ? (
                    <div style={{ width: '100%', height: 240 }}>
                      <ResponsiveContainer>
                        <LineChart data={invoiceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value.toLocaleString('vi-VN')}₫`]} />
                          <Legend />
                          <Line type="monotone" dataKey="amount" name="Tổng hóa đơn" stroke="#8884d8" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="paid" name="Đã thanh toán" stroke="#82ca9d" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '240px' }}>
                      <p className="text-muted">Không có dữ liệu hóa đơn</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;