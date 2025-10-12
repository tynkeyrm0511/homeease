// src/components/Residents/ResidentsList.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Input, Tag, Spin } from 'antd';
import ResidentTable from './components/ResidentTable';
import ResidentForm from './components/ResidentForm';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import PaginationControl from '../common/PaginationControl';
import 'antd/dist/reset.css';
import { getResidents, createResident } from '../../services/api';
import api from '../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import ResidentDetail from './ResidentDetail';

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
          const sortedResidents = response.data.sort((a, b) => a.id - b.id);
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

  if (loading) return <div>Loading...</div>; // Hiển thị loading
  if (error) return <div className="alert alert-danger">{error}</div>; // Hiển thị lỗi
  return (
    <div style={{ marginTop: 40, maxWidth: 1200, minHeight: '100vh', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
      <h4 className="mb-3 fw-bold" style={{ fontSize: 22 }}>DANH SÁCH CƯ DÂN</h4>
      <Input.Search
        placeholder="Tìm kiếm theo tên, email, số căn hộ..."
        allowClear
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        style={{ maxWidth: 350, marginBottom: 16 }}
      />
      <Button type="primary" style={{ marginBottom: 12, marginLeft: 8 }} onClick={() => setShowForm(true)}>
        Thêm dân cư
      </Button>
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
                  await createResident(values);
                  setLoading(true);
                  message.success('Thêm cư dân thành công!');
                  const response = await getResidents();
                  const sortedResidents = response.data.sort((a, b) => a.id - b.id);
                  setResidents(sortedResidents);
                  setLoading(false);
                  setShowForm(false);
                  setNewResident({ name: '', email: '', password: '', role: 'resident' });
                } catch (err) {
                  message.error('Thêm cư dân thất bại!');
                  console.error(err);
                }
              }}
              onCancel={() => setShowForm(false)}
            />
          </Modal>
      )}

      <div>
        {filteredResidents.length === 0 ? (
          <p>Không có cư dân nào.</p>
        ) : (
          <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderRadius: 10, background: '#fff', padding: 24, overflowX: 'auto', position: 'relative', minHeight: 200 }}>
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
            />
            {/* Pagination controls */}
            {totalPages > 1 && (
                <PaginationControl
                  current={currentPage}
                  pageSize={residentsPerPage}
                  total={filteredResidents.length}
                  onChange={handlePageChange}
                />
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
            const deleteRes = await api.delete(`/resident/${deleteResident.id}`);
            message.success(`Xóa cư dân thành công! Đã xóa ${deleteRes.data.deletedInvoices || 0} hóa đơn, ${deleteRes.data.deletedRequests || 0} yêu cầu, ${deleteRes.data.deletedNotifications || 0} thông báo.`);
            const response = await getResidents();
            const sortedResidents = response.data.sort((a, b) => a.id - b.id);
            setResidents(sortedResidents);
            setIsDeleteModalOpen(false);
            setDeleteResident(null);
            setDeleteInvoiceCount(0);
            setDeleteRequestCount(0);
            setDeleteNotificationCount(0);
            setLoading(false);
          } catch (err) {
            setLoading(false);
            message.error('Xóa cư dân thất bại!');
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
                  await api.put(`/resident/${editResident.id}`, updateData);
                  message.success('Cập nhật cư dân thành công!');
                  const response = await getResidents();
                  const sortedResidents = response.data.sort((a, b) => a.id - b.id);
                  setResidents(sortedResidents);
                  setEditResident(null);
                } catch (err) {
                  message.error('Cập nhật cư dân thất bại!');
                  console.error(err);
                }
              }}
              onCancel={() => setEditResident(null)}
            />
          </Modal>
      )}
    </div>
  );
}

export default ResidentsList;