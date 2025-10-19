import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MyRequests = () => {
  const { user } = useAuth();

  // Placeholder for user's requests
  return (
    <div className="container-xl px-4 py-4">
      <h3>Yêu cầu của tôi</h3>
      <p>Xin chào {user?.name || 'bạn'}, danh sách yêu cầu gửi bởi bạn sẽ hiển thị ở đây.</p>
    </div>
  );
};

export default MyRequests;
