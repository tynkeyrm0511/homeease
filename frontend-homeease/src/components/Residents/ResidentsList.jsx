// src/components/Residents/ResidentsList.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Spin, message, ConfigProvider, Row, Col, Typography, Card } from 'antd';
import ResidentTable from './components/ResidentTable';
import ResidentForm from './components/ResidentForm';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import PaginationControl from '../common/PaginationControl';
import 'antd/dist/reset.css';
import { getResidents, createResident } from '../../services/api';
import api from '../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import ResidentDetail from './ResidentDetail';
import { ToastContainer, toast } from 'react-toastify';

const ResidentsList = ({ selectedResidentId }) => {
  // State cho modal xác nhận xóa
  const [deleteResident, setDeleteResident] = useState(null);
  const [deleteInvoiceCount, setDeleteInvoiceCount] = useState(0);
  const [deleteRequestCount, setDeleteRequestCount] = useState(0);
  const [deleteNotificationCount, setDeleteNotificationCount] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [residents, setResidents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const residentsPerPage = 10;
  const [editResident, setEditResident] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'resident', password: '' });
  // Xóa khai báo setEditError vì không dùng, tránh lỗi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newResident, setNewResident] = useState({ name: '', email: '', password: '', role: 'resident' });
  const [detailResidentId, setDetailResidentId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  const totalPages = Math.ceil(residents.length / residentsPerPage);

  // Filter residents by search text
  const filteredResidents = residents.filter(r => {
    const text = searchText.toLowerCase();
    return (
      r.name?.toLowerCase().includes(text) ||
      r.email?.toLowerCase().includes(text) ||
      r.apartmentNumber?.toLowerCase().includes(text)
    );
  });
  const paginatedResidents = filteredResidents.slice(
    (currentPage - 1) * residentsPerPage,
    currentPage * residentsPerPage
  );

  useEffect(() => {
    if (editResident) {
      setEditForm({
        name: editResident.name || '',
        email: editResident.email || '',
        role: editResident.role || 'resident',
        password: ''
      });
    }
  }, [editResident]);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
          const response = await getResidents();
          // Sắp xếp cư dân theo id tăng dần để đảm bảo thứ tự luôn đúng
          const sortedResidents = response.sort((a, b) => a.id - b.id);
          setResidents(sortedResidents);
      } catch (err) {
        setError('Không thể tải danh sách cư dân');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResidents();
  }, []);

  useEffect(() => {
    if (selectedResidentId) {
      setDetailResidentId(selectedResidentId);
      setShowDetailModal(true);
    }
  }, [selectedResidentId]);

  // Khi đổi trang, hiển thị loading ngắn
  const handlePageChange = (page) => {
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setPageLoading(false);
    }, 400); // loading 400ms cho cảm giác mượt
  };

  if (loading) return (
    <div style={{ width: '100%' }}>
      <Card className="compact-card" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderRadius: 12, background: '#fafcff' }} bodyStyle={{ padding: 0 }}>
        <div className="compact-header" style={{ padding: '12px 16px 0 16px' }}>
          <Row gutter={[8, 8]} align="middle" wrap>
            <Col xs={24} style={{ marginBottom: 4 }}>
              <Typography.Title level={4} style={{ margin: 0, fontWeight: 700, color: '#2b2b2b', fontSize: '1.2rem' }}>Quản lý cư dân</Typography.Title>
            </Col>
            <Col xs={24}>
              <Row gutter={[8, 8]} align="middle" justify="start" wrap style={{ width: '100%' }}>
                <Col xs={24} sm={12} md={6} style={{ marginBottom: 4 }}>
                  <Input.Search
                    placeholder="Tìm kiếm theo tên, email, số căn hộ..."
                    allowClear
                    disabled
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} style={{ marginBottom: 4 }}>
                  <Button type="primary" style={{ width: '100%' }} disabled>
                    Thêm dân cư
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="compact-content" style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin size="large" />
        </div>
      </Card>
    </div>
  );
  if (error) return (
    <div style={{ margin: 24, maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
      <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderRadius: 12, padding: 0, background: '#fafcff', minHeight: 400, paddingTop: 0 }} bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '24px 24px 0 24px' }}>
          <Row gutter={[12, 12]} align="middle" wrap>
            <Col xs={24} style={{ marginBottom: 8 }}>
              <Typography.Title level={4} style={{ margin: 0, fontWeight: 700, color: '#2b2b2b' }}>Quản lý cư dân</Typography.Title>
            </Col>
          </Row>
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
              <Typography.Title level={4} style={{ margin: 0, fontWeight: 700, color: '#2b2b2b', fontSize: '1.2rem' }}>Quản lý cư dân</Typography.Title>
            </Col>
            <Col xs={24}>
              <Row gutter={[8, 8]} align="middle" justify="start" wrap style={{ width: '100%' }}>
                <Col xs={24} sm={12} md={6} style={{ marginBottom: 4 }}>
                  <Input.Search
                    placeholder="Tìm kiếm theo tên, email, số căn hộ..."
                    allowClear
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} style={{ marginBottom: 4 }}>
                  <Button type="primary" style={{ width: '100%' }} onClick={() => setShowForm(true)}>
                    Thêm dân cư
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        {showForm && (
          <Modal
            title="THÊM DÂN CƯ MỚI"
            open={showForm}
            onCancel={() => setShowForm(false)}
            footer={null}
          >
            <ResidentForm
              initialValues={newResident}
              type="add"
              onFinish={async (values) => {
                try {
                  const res = await createResident(values);
                  setResidents(prev => [...prev, res.data.newResident]);
                  setShowForm(false);
                  setNewResident({ name: '', email: '', password: '', role: 'resident' });
                  setTimeout(() => toast.success('Thêm cư dân thành công!'), 100);
                } catch (err) {
                  setTimeout(() => toast.error('Thêm cư dân thất bại!'), 100);
                  console.error(err);
                }
              }}
              onCancel={() => setShowForm(false)}
            />
          </Modal>
        )}
        <div className="compact-content" style={{ padding: 16 }}>
          {filteredResidents.length === 0 ? (
            <div style={{ borderRadius: 10, background: '#fff', padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>Không có cư dân nào.</p>
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
                <ResidentTable
                  residents={paginatedResidents}
                  onEdit={setEditResident}
                  onDelete={async (resident) => {
                    try {
                      const invoiceRes = await api.get(`/invoice?userId=${resident.id}`);
                      const requestRes = await api.get(`/request?userId=${resident.id}`);
                      const notificationRes = await api.get(`/notification?userId=${resident.id}`);
                      setDeleteResident(resident);
                      setDeleteInvoiceCount(Array.isArray(invoiceRes.data) ? invoiceRes.data.length : 0);
                      setDeleteRequestCount(Array.isArray(requestRes.data) ? requestRes.data.length : 0);
                      setDeleteNotificationCount(Array.isArray(notificationRes.data) ? notificationRes.data.length : 0);
                      setIsDeleteModalOpen(true);
                    } catch (err) {
                      message.error('Không thể kiểm tra dữ liệu liên quan!');
                      setError('Không thể kiểm tra dữ liệu liên quan!');
                      console.error(err);
                    }
                  }}
                  onDetail={(resident) => {
                    setDetailResidentId(resident.id);
                    setShowDetailModal(true);
                  }}
                  renderStatus={(status) => (
                    status === 'active' ? <span style={{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#52c41a'}} /> : <span style={{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#ff4d4f'}} />
                  )}
                  className="compact-table"
                />
              </div>
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="compact-pagination">
                  <PaginationControl
                    current={currentPage}
                    pageSize={residentsPerPage}
                    total={filteredResidents.length}
                    onChange={handlePageChange}
                    size="small"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        {/* Resident Detail Modal */}
        <ResidentDetail
          residentId={detailResidentId}
          visible={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />
        {/* Delete confirmation modal */}
        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          resident={deleteResident}
          invoiceCount={deleteInvoiceCount}
          requestCount={deleteRequestCount}
          notificationCount={deleteNotificationCount}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setDeleteResident(null);
            setDeleteInvoiceCount(0);
            setDeleteRequestCount(0);
            setDeleteNotificationCount(0);
          }}
          onConfirm={async () => {
            setLoading(true);
            try {
              await api.delete(`/resident/${deleteResident.id}`);
              setResidents(prev => prev.filter(r => r.id !== deleteResident.id));
              setIsDeleteModalOpen(false);
              setDeleteResident(null);
              setDeleteInvoiceCount(0);
              setDeleteRequestCount(0);
              setDeleteNotificationCount(0);
              setLoading(false);
              setTimeout(() => toast.success('Xóa cư dân thành công!'), 100);
            } catch (err) {
              setTimeout(() => toast.error('Xóa cư dân thất bại!'), 100);
              setLoading(false);
              setIsDeleteModalOpen(false);
              setDeleteResident(null);
              setDeleteInvoiceCount(0);
              setDeleteRequestCount(0);
              setDeleteNotificationCount(0);
              console.error(err);
            }
          }}
        />
        {/* Edit resident modal */}
        {editResident && (
          <Modal
            title={<span>Sửa thông tin cư dân</span>}
            open={!!editResident}
            onCancel={() => setEditResident(null)}
            footer={null}
          >
            <ResidentForm
              initialValues={editForm}
              type="edit"
              onFinish={async (values) => {
                try {
                  const updateData = {
                    name: values.name,
                    email: values.email,
                    role: values.role,
                    phone: values.phone,
                    apartmentNumber: values.apartmentNumber,
                    gender: values.gender,
                    address: values.address,
                    status: values.status,
                  };
                  if (values.dateOfBirth) {
                    updateData.dateOfBirth = values.dateOfBirth.format ? values.dateOfBirth.format('YYYY-MM-DD') : values.dateOfBirth;
                  }
                  if (values.moveInDate) {
                    updateData.moveInDate = values.moveInDate.format ? values.moveInDate.format('YYYY-MM-DD') : values.moveInDate;
                  }
                  if (values.password && values.password.length >= 6) {
                    updateData.password = values.password;
                  }
                  const res = await api.put(`/resident/${editResident.id}`, updateData);
                  setResidents(prev => prev.map(r => r.id === editResident.id ? res.data : r));
                  setEditResident(null);
                  setTimeout(() => toast.success('Cập nhật cư dân thành công!'), 100);
                } catch (err) {
                  setTimeout(() => toast.error('Cập nhật cư dân thất bại!'), 100);
                  console.error(err);
                }
              }}
              onCancel={() => setEditResident(null)}
            />
          </Modal>
        )}
      </Card>
    </ConfigProvider>
  );
}

export default ResidentsList;