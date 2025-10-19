import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ResidentProfile = () => {
  const { user } = useAuth();

  return (
    <div className="container-xl px-4 py-4">
      <h3>Thông tin tài khoản</h3>
      <p>Họ tên: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Số điện thoại: {user?.phone || 'Chưa cập nhật'}</p>
    </div>
  );
};

export default ResidentProfile;
