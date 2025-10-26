// src/components/Notifications/NotificationList.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Spin, ConfigProvider, Row, Col, Typography, Card, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NotificationTable from './NotificationTable';
import NotificationForm from './NotificationForm';
import NotificationDetail from './NotificationDetail';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import PaginationControl from '../common/PaginationControl';
import api from '../../services/api';

const { Option } = Select;

const NotificationList = () => {
  // State cho filter nâng cao
  const [dateRange, setDateRange] = useState([null, null]);
  // State cho danh sách và phân trang
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  
  // State cho tìm kiếm và filter
  const [searchText, setSearchText] = useState('');
  const [targetFilter, setTargetFilter] = useState('all');
  
  // State cho các modal
  const [showForm, setShowForm] = useState(false);
  const [editNotification, setEditNotification] = useState(null);
  const [detailNotificationId, setDetailNotificationId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteNotification, setDeleteNotification] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // State cho form tạo mới
  const [newNotification, setNewNotification] = useState({ 
    title: '', 
    content: '', 
    target: 'all' 
  });

  // Filter notifications by search text, target, and date range
  const filteredNotifications = notifications.filter(n => {
    const text = searchText.toLowerCase();
    const matchesSearch = n.title?.toLowerCase().includes(text) || n.content?.toLowerCase().includes(text);
    const matchesTarget = targetFilter === 'all' ? true : n.target === targetFilter;
    let matchesDate = true;
    if (Array.isArray(dateRange) && dateRange[0] && dateRange[1]) {
      const created = dayjs(n.createdAt);
      matchesDate = created.isAfter(dayjs(dateRange[0]).startOf('day').subtract(1, 'ms')) && created.isBefore(dayjs(dateRange[1]).endOf('day').add(1, 'ms'));
    }
    return matchesSearch && matchesTarget && matchesDate;
  });

  // Calculate paginated results
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * notificationsPerPage,
    currentPage * notificationsPerPage
  );
  
  const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Load notifications from API; for non-admin users use /notification/me
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return; // wait until auth loaded
      try {
        const path = isAdmin ? '/notification' : '/notification/me';
        const response = await api.get(path);
        // Sort notifications by creation date, newest first
        let sortedNotifications = Array.isArray(response.data) ? 
          response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        // If current user is not admin, only show notifications explicitly for this user
        if (!isAdmin) {
          const uid = Number(user.id)
          sortedNotifications = sortedNotifications.filter(n => {
            // if notification has an associated user object
            if (n?.user && Number(n.user.id) === uid) return true
            // or if it has userId field matching
            if (n?.userId && Number(n.userId) === uid) return true
            // otherwise exclude (this removes global 'all' notifications)
            return false
          })
        }
        setNotifications(sortedNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        const status = err?.response?.status;
        const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Không thể tải thông báo';
        setError(`(${status || '??'}) ${msg}`);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Handle page change with loading effect
  const handlePageChange = (page) => {
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setPageLoading(false);
    }, 400);
  };

  // Create a new notification
  const handleCreateNotification = async (values) => {
    try {
      const res = await api.post('/notification/add', values);
      setNotifications(prev => [res.data, ...prev]); // Add to top of list
      setShowForm(false);
      setNewNotification({ title: '', content: '', target: 'all' });
      toast.success('Tạo thông báo thành công!');
    } catch (err) {
      console.error('Error creating notification:', err);
      toast.error('Tạo thông báo thất bại!');
    }
  };

  // Update an existing notification
  const handleUpdateNotification = async (values) => {
    try {
      const res = await api.put(`/notification/${editNotification.id}`, values);
      setNotifications(prev => 
        prev.map(n => n.id === editNotification.id ? res.data : n)
      );
      setEditNotification(null);
      toast.success('Cập nhật thông báo thành công!');
    } catch (err) {
      console.error('Error updating notification:', err);
      toast.error('Cập nhật thông báo thất bại!');
    }
  };

  // Delete a notification
  const handleDeleteNotification = async () => {
    try {
      await api.delete(`/notification/${deleteNotification.id}`);
      setNotifications(prev => prev.filter(n => n.id !== deleteNotification.id));
      setIsDeleteModalOpen(false);
      setDeleteNotification(null);
      toast.success('Xóa thông báo thành công!');
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('Xóa thông báo thất bại!');
      setIsDeleteModalOpen(false);
      setDeleteNotification(null);
    }
  };

  if (loading) return (
    <div style={{ margin: 24, maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
      <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderRadius: 12, padding: 0, background: '#fafcff', minHeight: 400 }} bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '24px 24px 0 24px' }}>
          <Typography.Title level={4} style={{ margin: 0, fontWeight: 700, color: '#2b2b2b' }}>Quản lý thông báo</Typography.Title>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ borderRadius: 10, background: '#fff', padding: 24, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin size="large" />
          </div>
        </div>
      </Card>
    </div>
  );

  if (error) return (
    <div style={{ margin: 24, maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
      <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderRadius: 12, padding: 0, background: '#fafcff', minHeight: 400 }} bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '24px 24px 0 24px' }}>
          <Typography.Title level={4} style={{ margin: 0, fontWeight: 700, color: '#2b2b2b' }}>Quản lý thông báo</Typography.Title>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ borderRadius: 10, background: '#fff', padding: 24, minHeight: 200 }}>
            <div style={{ color: '#b91c1c', fontWeight: 600, marginBottom: 8 }}>Lỗi khi tải thông báo</div>
            <div style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Button onClick={() => { setLoading(true); setError(''); (async () => { try { const resp = await api.get('/notification'); setNotifications(Array.isArray(resp.data) ? resp.data.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)) : []); } catch (e) { console.error(e); const status = e?.response?.status; const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || 'Không thể tải thông báo'; setError(`(${status || '??'}) ${msg}`); } finally { setLoading(false); } })() }}>Thử lại</Button>
              <Button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} type="default">Đăng xuất (kiểm tra token)</Button>
            </div>
            <div style={{ fontSize: 12, color: '#374151' }}>
              <div><strong>Gợi ý debug:</strong></div>
              <ul>
                <li>Kiểm tra token trong localStorage: <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{localStorage.getItem('token') ? 'Đã có token' : 'Không có token'}</code></li>
                <li>Nếu bạn không phải admin, backend trả 403. Hãy đăng nhập bằng tài khoản admin.</li>
                <li>Nếu backend down, kiểm tra server logs và khởi động lại backend.</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Message: {
            top: 80,
            duration: 2.5,
            maxCount: 3,
          },
        },
      }}
    >
      <ToastContainer position="top-right" autoClose={2200} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored" />
      <Card className="compact-card" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderRadius: 12, background: '#fafcff' }} bodyStyle={{ padding: 0 }}>
        <div className="compact-header" style={{ padding: '12px 16px 0 16px' }}>
          <Row gutter={[8, 8]} align="middle" wrap>
            <Col xs={24} style={{ marginBottom: 4 }}>
              <Typography.Title level={4} style={{ margin: 0, fontWeight: 700, color: '#2b2b2b', fontSize: '1.2rem' }}>
                {isAdmin ? 'Quản lý thông báo' : 'Thông báo của tôi'}
              </Typography.Title>
            </Col>
            <Col xs={24}>
              <Row gutter={[8, 8]} align="middle" justify="start" wrap style={{ width: '100%' }}>
                {isAdmin && (
                  <>
                    <Col xs={24} sm={10} md={5} style={{ marginBottom: 4 }}>
                      <Input.Search
                        placeholder="Tìm kiếm theo tiêu đề, nội dung..."
                        allowClear
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </Col>
                    <Col xs={24} sm={10} md={6} style={{ marginBottom: 4 }}>
                      <RangePicker
                        style={{ width: '100%' }}
                        value={Array.isArray(dateRange) ? dateRange : [null, null]}
                        onChange={val => setDateRange(Array.isArray(val) ? val : [null, null])}
                        format="DD/MM/YYYY"
                        allowClear
                        placeholder={["Từ ngày", "Đến ngày"]}
                      />
                    </Col>
                    <Col xs={12} sm={8} md={4} style={{ marginBottom: 4 }}>
                      <Select 
                        style={{ width: '100%' }}
                        value={targetFilter}
                        onChange={value => setTargetFilter(value)}
                        placeholder="Lọc theo đối tượng"
                      >
                        <Option value="all">Tất cả đối tượng</Option>
                        <Option value="residentId">Cư dân cụ thể</Option>
                      </Select>
                    </Col>
                    <Col xs={12} sm={6} md={3} style={{ marginBottom: 4 }}>
                      <Button type="primary" style={{ width: '100%' }} onClick={() => setShowForm(true)}>
                        Thêm thông báo
                      </Button>
                    </Col>
                  </>
                )}
              </Row>
            </Col>
          </Row>
        </div>

        <div className="compact-content" style={{ padding: '20px 24px' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ borderRadius: 10, background: '#fff', padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>Không có thông báo nào.</p>
            </div>
          ) : isAdmin ? (
            <div className="compact-table-container">
              <div className="compact-table-wrapper">
                {pageLoading && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255,255,255,0.6)',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Spin size="large" />
                  </div>
                )}
                <NotificationTable
                  notifications={paginatedNotifications}
                  onEdit={setEditNotification}
                  onDelete={(notification) => {
                    setDeleteNotification(notification);
                    setIsDeleteModalOpen(true);
                  }}
                  onDetail={(notification) => {
                    setDetailNotificationId(notification.id);
                    setShowDetailModal(true);
                  }}
                  isAdmin={isAdmin}
                  className="compact-table"
                />
              </div>
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="compact-pagination">
                  <PaginationControl
                    current={currentPage}
                    pageSize={notificationsPerPage}
                    total={filteredNotifications.length}
                    onChange={handlePageChange}
                    size="small"
                  />
                </div>
              )}
            </div>
          ) : (
            // User view: Card-based layout
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '12px' }}>
              {paginatedNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  hoverable
                  onClick={() => {
                    setDetailNotificationId(notification.id);
                    setShowDetailModal(true);
                  }}
                  style={{
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  bodyStyle={{ padding: '24px 28px' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                    e.currentTarget.style.borderColor = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '4px' }}>
                    {/* Icon */}
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 20,
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      marginLeft: 4,
                      marginRight: 4
                    }}>
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px'
                      }}>
                        <span style={{ marginTop: '-4px' }}>🔔</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0, marginRight: 16, marginTop: 4 }}>
                      <div style={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: '#1f2937',
                        marginBottom: 8,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {notification.title}
                      </div>
                      <div style={{
                        fontSize: 14,
                        color: '#6b7280',
                        marginBottom: 12,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.4'
                      }}>
                        {notification.content}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        color: '#9ca3af'
                      }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" fill="currentColor"/>
                        </svg>
                        {notification.createdAt && new Date(notification.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <div style={{ 
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginLeft: 'auto',
                      marginTop: 4,
                      color: '#94a3b8',
                      fontSize: 20,
                      transition: 'all 0.2s'
                    }}>›</div>
                  </div>
                </Card>
              ))}
              
              {/* Pagination for users */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                  <PaginationControl
                    current={currentPage}
                    pageSize={notificationsPerPage}
                    total={filteredNotifications.length}
                    onChange={handlePageChange}
                    size="small"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create/Edit Notification Modal - Admin only */}
        {isAdmin && (
          <Modal
            title={editNotification ? "Sửa thông báo" : "Tạo thông báo mới"}
            open={showForm || !!editNotification}
            onCancel={() => {
              setShowForm(false);
              setEditNotification(null);
            }}
            footer={null}
          >
            <NotificationForm
              initialValues={editNotification || newNotification}
              onFinish={editNotification ? handleUpdateNotification : handleCreateNotification}
              onCancel={() => {
                setShowForm(false);
                setEditNotification(null);
              }}
            />
          </Modal>
        )}

        {/* Notification Detail Modal */}
        <NotificationDetail
          notificationId={detailNotificationId}
          visible={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />

        {/* Delete confirmation modal - Admin only */}
        {isAdmin && (
          <ConfirmDeleteModal
            open={isDeleteModalOpen}
            title="Xác nhận xóa thông báo"
            content={`Bạn có chắc chắn muốn xóa thông báo "${deleteNotification?.title}" không?`}
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setDeleteNotification(null);
            }}
            onConfirm={handleDeleteNotification}
          />
        )}
      </Card>
    </ConfigProvider>
  );
};

export default NotificationList;