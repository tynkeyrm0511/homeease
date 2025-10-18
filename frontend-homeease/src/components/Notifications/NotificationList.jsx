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

  // Load notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notification');
        // Sort notifications by creation date, newest first
        const sortedNotifications = Array.isArray(response.data) ? 
          response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        setNotifications(sortedNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Không thể tải thông báo');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

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
          <div className="text-danger mt-2">{error}</div>
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
              <Typography.Title level={4} style={{ margin: 0, fontWeight: 700, color: '#2b2b2b', fontSize: '1.2rem' }}>Quản lý thông báo</Typography.Title>
            </Col>
            <Col xs={24}>
              <Row gutter={[8, 8]} align="middle" justify="start" wrap style={{ width: '100%' }}>
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
                    <Option value="all">Toàn bộ cư dân</Option>
                    <Option value="residentId">Cư dân cụ thể</Option>
                    <Option value="group">Nhóm cư dân</Option>
                  </Select>
                </Col>
                <Col xs={12} sm={6} md={3} style={{ marginBottom: 4 }}>
                  <Button type="primary" style={{ width: '100%' }} onClick={() => setShowForm(true)}>
                    Thêm thông báo
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        <div className="compact-content" style={{ padding: 16 }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ borderRadius: 10, background: '#fff', padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>Không có thông báo nào.</p>
            </div>
          ) : (
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
          )}
        </div>

        {/* Create/Edit Notification Modal */}
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

        {/* Notification Detail Modal */}
        <NotificationDetail
          notificationId={detailNotificationId}
          visible={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />

        {/* Delete confirmation modal */}
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
      </Card>
    </ConfigProvider>
  );
};

export default NotificationList;