import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Row, Col, Typography, Spin, message, Checkbox } from 'antd';
import RequestTableAdmin from './RequestTableAdmin';
import PaginationControl from '../common/PaginationControl';
import RequestDetailModal from './RequestDetailModal';
import { getRequests, updateRequestStatus } from '../../services/api';

const { Title } = Typography;
const { Option } = Select;




const RequestAdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [sender, setSender] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showAll, setShowAll] = useState(false); // Hiện tất cả request kể cả đã hoàn thành/bị từ chối
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    getRequests()
      .then((res) => {
        let filtered = res;
        if (!showAll) {
          filtered = filtered.filter(r => r.status !== 'completed' && r.status !== 'rejected');
        }
        if (status) filtered = filtered.filter(r => r.status === status);
        if (category) filtered = filtered.filter(r => r.category === category);
        if (priority) filtered = filtered.filter(r => (r.priority || 'medium') === priority);
        if (sender) filtered = filtered.filter(r => (r.user?.name || '').toLowerCase() === sender.toLowerCase());
        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter(r =>
            (r.description && r.description.toLowerCase().includes(s)) ||
            (r.user?.name && r.user.name.toLowerCase().includes(s))
          );
        }
        setData(filtered.map(r => ({
          id: r.id,
          title: r.description,
          category: r.category || 'Không xác định',
          priority: r.priority || 'medium',
          status: r.status,
          createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
          updatedAt: r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : '',
          sender: r.user?.name || 'N/A',
          raw: r
        })));
        setCurrentPage(1); // Reset về trang đầu khi filter
      })
      .catch(() => message.error('Không thể tải danh sách request!'))
      .finally(() => setLoading(false));
  }, [search, status, category, priority, sender, showAll]);

  // Xử lý mở modal chi tiết
  const handleDetail = (row) => {
    setSelectedRequest(row.raw);
    setModalOpen(true);
  };

  // Xử lý đổi trạng thái trong modal
  const handleStatusChange = (newStatus) => {
    setSelectedRequest((prev) => ({ ...prev, status: newStatus }));
  };

  // Xử lý lưu thay đổi trạng thái
  const handleSave = () => {
    if (!selectedRequest) return;
    setModalLoading(true);
    updateRequestStatus(selectedRequest.id, { status: selectedRequest.status })
      .then(() => {
        message.success('Cập nhật trạng thái thành công!');
        setModalOpen(false);
        // Reload lại danh sách
        setLoading(true);
        getRequests()
          .then((res) => {
            let filtered = res;
            if (status) filtered = filtered.filter(r => r.status === status);
            if (search) {
              const s = search.toLowerCase();
              filtered = filtered.filter(r =>
                (r.description && r.description.toLowerCase().includes(s)) ||
                (r.user?.name && r.user.name.toLowerCase().includes(s))
              );
            }
            setData(filtered.map(r => ({
              id: r.id,
              title: r.description,
              category: r.category || 'Không xác định',
              priority: r.priority || 'medium',
              status: r.status,
              createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
              updatedAt: r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : '',
              sender: r.user?.name || 'N/A',
              raw: r
            })));
          })
          .catch(() => message.error('Không thể tải danh sách request!'))
          .finally(() => setLoading(false));
      })
      .catch(() => message.error('Cập nhật trạng thái thất bại!'))
      .finally(() => setModalLoading(false));
  };

  return (
    <Card
      style={{
        margin: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        borderRadius: 12,
        padding: 0,
        background: '#fafcff',
        minHeight: 400,
        paddingTop: 0,
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ padding: '24px 24px 0 24px' }}>
        <Row gutter={[12, 0]} align="middle" wrap>
          <Col xs={24}>
            <Typography.Title level={4} style={{ margin: 0, fontWeight: 700, color: '#2b2b2b', paddingBottom: 8 }}>Quản lý yêu cầu</Typography.Title>
          </Col>
          <Col xs={24}>
            <Row gutter={[16, 0]} align="middle" justify="start" wrap style={{ width: '100%' }}>
              <Col xs={24} sm={12} md={6}>
                <Input.Search
                  placeholder="Tìm kiếm theo tiêu đề hoặc người gửi"
                  allowClear
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Select
                  placeholder="Trạng thái"
                  allowClear
                  style={{ width: '100%' }}
                  onChange={setStatus}
                  value={status || undefined}
                >
                  <Option value="pending">Chờ xử lý</Option>
                  <Option value="in_progress">Đang xử lý</Option>
                  <Option value="completed">Hoàn thành</Option>
                  <Option value="rejected">Từ chối</Option>
                </Select>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Select
                  placeholder="Loại yêu cầu"
                  allowClear
                  style={{ width: '100%' }}
                  onChange={setCategory}
                  value={category || undefined}
                >
                  <Option value="electricity">Điện</Option>
                  <Option value="water">Nước</Option>
                  <Option value="cleaning">Vệ sinh</Option>
                  <Option value="parking">Gửi xe</Option>
                  <Option value="service">Dịch vụ</Option>
                </Select>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Select
                  placeholder="Ưu tiên"
                  allowClear
                  style={{ width: '100%' }}
                  onChange={setPriority}
                  value={priority || undefined}
                >
                  <Option value="high">Cao</Option>
                  <Option value="medium">Trung bình</Option>
                  <Option value="low">Thấp</Option>
                </Select>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Select
                  showSearch
                  placeholder="Người gửi"
                  allowClear
                  style={{ width: '100%' }}
                  onChange={setSender}
                  value={sender || undefined}
                  optionFilterProp="children"
                >
                  {data
                    .map(r => r.sender)
                    .filter((v, i, arr) => v && arr.indexOf(v) === i)
                    .map(name => (
                      <Option key={name} value={name}>{name}</Option>
                    ))}
                </Select>
              </Col>
              <Col xs={24} md={6}>
                <Row gutter={[8, 0]} align="middle" justify="start" style={{ width: '100%' }}>
                  <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox checked={showAll} onChange={e => setShowAll(e.target.checked)}>
                      Hiển thị tất cả
                    </Checkbox>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <div style={{ padding: '24px 0 0 0' }}>
          {loading ? (
            <div style={{ borderRadius: 10, background: '#fff', padding: 24, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin size="large" />
            </div>
          ) : data.length === 0 ? (
            <div style={{ borderRadius: 10, background: '#fff', padding: 24, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>Không có yêu cầu nào.</p>
            </div>
          ) : (
            <>
              <div style={{ borderRadius: 10, background: '#fff', padding: 0, overflowX: 'auto', position: 'relative', minHeight: 200 }}>
                <RequestTableAdmin
                  data={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                  loading={loading}
                  onDetail={handleDetail}
                />
              </div>
              {data.length > pageSize && (
                <PaginationControl
                  current={currentPage}
                  pageSize={pageSize}
                  total={data.length}
                  onChange={setCurrentPage}
                />
              )}
            </>
          )}
          <RequestDetailModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            request={selectedRequest}
            onStatusChange={handleStatusChange}
            onSave={handleSave}
            loading={modalLoading}
          />
        </div>
      </div>
    </Card>
  );
};

export default RequestAdminPage;
