import React from 'react';
import { Modal, Button } from 'antd';

const ConfirmDeleteModal = ({ open, resident, invoiceCount, requestCount, notificationCount, onCancel, onConfirm }) => (
  <Modal
    title={<span>XÁC NHẬN XÓA DÂN CƯ</span>}
    open={open}
    onCancel={onCancel}
    footer={[
      <Button key="cancel" onClick={onCancel}>Không</Button>,
      <Button key="ok" type="primary" danger onClick={onConfirm}>Có</Button>
    ]}
  >
    {resident && (
      <div>
        <span>Bạn có chắc chắn muốn xóa cư dân <b>{resident.name}</b>?</span>
        <div style={{ marginTop: 12, textAlign: 'left' }}>
          <ul style={{ paddingLeft: 18 }}>
            <li><b>{invoiceCount}</b> hóa đơn liên quan sẽ bị xóa</li>
            <li><b>{requestCount}</b> yêu cầu liên quan sẽ bị xóa</li>
            <li><b>{notificationCount}</b> thông báo liên quan sẽ bị xóa</li>
          </ul>
          <span>THAO TÁC NÀY KHÔNG THỂ HOÀN TÁC</span>
        </div>
      </div>
    )}
  </Modal>
);

export default ConfirmDeleteModal;
