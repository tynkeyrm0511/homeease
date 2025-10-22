
import React from 'react';
import { Modal, Descriptions, Select, Button } from 'antd';

const { Option } = Select;

const statusOptions = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'in_progress', label: 'Đang xử lý' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'rejected', label: 'Từ chối' },
];



const RequestDetailModal = ({ open, onClose, request, onStatusChange, onSave, loading }) => {
  if (!request) return null;
  // Format ngày tạo
  let createdAt = request.createdAt;
  if (createdAt && createdAt.length > 10) {
    try {
      createdAt = new Date(createdAt).toLocaleDateString();
    } catch (e) {
      console.warn('RequestDetailModal: createdAt parse failed', e);
    }
  }
  // Lấy tên người gửi
  const sender = request.user?.name || request.sender || 'N/A';
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={`Chi tiết yêu cầu #${request.id}`}
      footer={null}
      width={520}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Tiêu đề">{request.title || request.description}</Descriptions.Item>
        <Descriptions.Item label="Người gửi">{sender}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{createdAt}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Select
            value={request.status}
            onChange={onStatusChange}
            style={{ width: 180 }}
            disabled={loading}
          >
            {statusOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </Descriptions.Item>
        {/* Có thể bổ sung mô tả, file đính kèm, lịch sử... */}
      </Descriptions>
      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>Đóng</Button>
        <Button type="primary" onClick={onSave} loading={loading}>Lưu thay đổi</Button>
      </div>
    </Modal>
  );
};

export default RequestDetailModal;
