import React, { useEffect, useState } from 'react';
import { Modal, Spin, Alert } from 'antd';
import { getResidentById } from '../../services/api';

const ResidentDetail = ({ residentId, visible, onClose }) => {
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (residentId && visible) {
      setLoading(true);
      setError('');
      getResidentById(residentId)
        .then(res => setResident(res.data))
        .catch(() => setError('Không thể tải thông tin cư dân!'))
        .finally(() => setLoading(false));
    }
  }, [residentId, visible]);

  return (
    <Modal
      title="Chi tiết cư dân"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      {loading ? <Spin /> : error ? <Alert type="error" message={error} /> : resident && (
        <div>
          <p><b>ID:</b> {resident.id}</p>
          <p><b>Họ tên:</b> {resident.name}</p>
          <p><b>Email:</b> {resident.email}</p>
          <p><b>Vai trò:</b> {resident.role}</p>
          <p><b>Số điện thoại:</b> {resident.phone || 'Chưa cập nhật'}</p>
          <p><b>Số căn hộ:</b> {resident.apartmentNumber || 'Chưa cập nhật'}</p>
          <p><b>Ngày sinh:</b> {resident.dateOfBirth ? new Date(resident.dateOfBirth).toLocaleDateString() : 'Chưa cập nhật'}</p>
          <p><b>Giới tính:</b> {resident.gender || 'Chưa cập nhật'}</p>
          <p><b>Địa chỉ:</b> {resident.address || 'Chưa cập nhật'}</p>
          <p><b>Ngày chuyển vào:</b> {resident.moveInDate ? new Date(resident.moveInDate).toLocaleDateString() : 'Chưa cập nhật'}</p>
          <p><b>Trạng thái:</b> {resident.status}</p>
          <p><b>Ngày tạo:</b> {resident.createdAt ? new Date(resident.createdAt).toLocaleDateString() : ''}</p>
          <p><b>Cập nhật lần cuối:</b> {resident.updatedAt ? new Date(resident.updatedAt).toLocaleDateString() : ''}</p>
        </div>
      )}
    </Modal>
  );
};

export default ResidentDetail;
