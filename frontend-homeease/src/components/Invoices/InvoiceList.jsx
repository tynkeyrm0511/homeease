import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Modal, Button, Input, Spin, message, ConfigProvider, Select, DatePicker, Row, Col, Typography } from 'antd';
import { Checkbox } from 'antd';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '../../services/api';
import InvoiceTable from './InvoiceTable';
import '../../App.css';
import ResidentDetail from '../Residents/ResidentDetail';
import PaginationControl from '../common/PaginationControl';
import InvoiceForm from './InvoiceForm';
import { getResidents } from '../../services/api';

const InvoiceList = () => {
  // State declarations (move to top)
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showOverdue, setShowOverdue] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterResident, setFilterResident] = useState('');
  const [filterDateRange, setFilterDateRange] = useState([null, null]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailResident, setDetailResident] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);
  const invoicesPerPage = 10;
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [residentOptions, setResidentOptions] = useState([]);

  // Fetch invoices from API
  useEffect(() => {
    fetchInvoices();
    fetchResidents();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await getInvoices();
      setInvoices(data);
      setError('');
    } catch {
      setError('Lỗi tải hóa đơn');
    }
    setLoading(false);
  };

  const fetchResidents = async () => {
    try {
      const data = await getResidents();
      setResidentOptions(data.map(r => ({ id: r.id, name: r.name })));
    } catch {}
  };

  // Resident detail modal handler
  const handleShowResidentDetail = (resident) => {
    setDetailResident(resident);
    setShowDetailModal(true);
  };

  // Status rendering
  const renderStatus = (status) => {
    if (status === 'paid') return <span style={{ color: '#52c41a' }}>Đã thu tiền</span>;
    if (status === 'overdue') return <span style={{ color: '#ff4d4f' }}>Quá hạn</span>;
    return <span style={{ color: '#faad14' }}>Còn nợ</span>;
  };

  // Filtering logic
  const filteredInvoices = invoices.filter(inv => {
    let match = true;
    if (searchText) {
      match = match && (
        inv.user?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        inv.code?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterStatus) {
      const today = new Date();
      if (filterStatus === 'paid') {
        match = match && inv.isPaid;
      } else if (filterStatus === 'unpaid') {
        match = match && !inv.isPaid && inv.dueDate && new Date(inv.dueDate) >= today;
      } else if (filterStatus === 'overdue') {
        match = match && !inv.isPaid && inv.dueDate && new Date(inv.dueDate) < today;
      }
    }
    if (filterType) {
      match = match && inv.type === filterType;
    }
    if (filterResident) {
      match = match && inv.user?.name === filterResident;
    }
    if (filterDateRange && filterDateRange[0] && filterDateRange[1]) {
      const created = dayjs(inv.createdAt);
      match = match && created.isAfter(filterDateRange[0], 'day') && created.isBefore(filterDateRange[1], 'day');
    }
    if (showOverdue) {
      const today = new Date();
      match = match && !inv.isPaid && inv.dueDate && new Date(inv.dueDate) < today;
    }
    return match;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * invoicesPerPage,
    currentPage * invoicesPerPage
  );

  const handlePageChange = (page) => {
    setPageLoading(true);
    setCurrentPage(page);
    setTimeout(() => setPageLoading(false), 300);
  };

  // Hàm load lại danh sách hóa đơn
  return (
    <React.Fragment>
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
            <Row gutter={[12, 12]} align="middle" wrap>
              <Col xs={24} style={{ marginBottom: 8 }}>
                <Typography.Title level={4} style={{ margin: 0, fontWeight: 700, color: '#2b2b2b' }}>Quản lý hóa đơn (Invoice)</Typography.Title>
              </Col>
              <Col xs={24}>
                <Row gutter={[16, 16]} align="middle" justify="start" wrap style={{ width: '100%' }}>
                  <Col xs={24} sm={12} md={6} style={{ marginBottom: 8 }}>
                    <Input.Search
                      placeholder="Tìm kiếm tên cư dân, mã hóa đơn..."
                      allowClear
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} style={{ marginBottom: 8 }}>
                    <Select
                      placeholder="Trạng thái"
                      allowClear
                      value={filterStatus || undefined}
                      onChange={setFilterStatus}
                      style={{ width: '100%' }}
                    >
                      <Select.Option value="unpaid">Còn nợ</Select.Option>
                      <Select.Option value="paid">Đã thu tiền</Select.Option>
                      <Select.Option value="overdue">Quá hạn</Select.Option>
                    </Select>
                  </Col>
                  <Col xs={12} sm={6} md={4} style={{ marginBottom: 8 }}>
                    <Select
                      placeholder="Loại hóa đơn"
                      allowClear
                      value={filterType || undefined}
                      onChange={setFilterType}
                      style={{ width: '100%' }}
                    >
                      <Select.Option value="service">Dịch vụ</Select.Option>
                      <Select.Option value="electricity">Điện</Select.Option>
                      <Select.Option value="water">Nước</Select.Option>
                      <Select.Option value="parking">Gửi xe</Select.Option>
                    </Select>
                  </Col>
                  <Col xs={12} sm={6} md={4} style={{ marginBottom: 8 }}>
                    <Select
                      showSearch
                      placeholder="Tên cư dân"
                      allowClear
                      value={filterResident || undefined}
                      onChange={setFilterResident}
                      style={{ width: '100%' }}
                      optionFilterProp="children"
                    >
                      {invoices
                        .map(inv => inv.user?.name)
                        .filter((v, i, arr) => v && arr.indexOf(v) === i)
                        .map(name => (
                          <Select.Option key={name} value={name}>{name}</Select.Option>
                        ))}
                    </Select>
                  </Col>
                  <Col xs={24} sm={12} md={6} style={{ marginBottom: 8 }}>
                    <DatePicker.RangePicker
                      style={{ width: '100%' }}
                      value={filterDateRange}
                      onChange={setFilterDateRange}
                      format="DD/MM/YYYY"
                      placeholder={["Từ ngày", "Đến ngày"]}
                    />
                  </Col>
                  <Col xs={24} md={6} style={{ marginBottom: 8 }}>
                    <Row gutter={[8, 8]} align="middle" justify="start" style={{ width: '100%' }}>
                      <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox checked={showOverdue} onChange={e => setShowOverdue(e.target.checked)}>
                          Hóa đơn quá hạn
                        </Checkbox>
                      </Col>
                      <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Button type="primary" onClick={() => setShowForm(true)} style={{ width: '100%' }}>
                          Thêm hóa đơn
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          {showForm && (
            <Modal
              title="THÊM HÓA ĐƠN MỚI"
              open={showForm}
              onCancel={() => setShowForm(false)}
              footer={null}
            >
              <InvoiceForm
                initialValues={{ userId: '', amount: '', type: '', isPaid: false, createdAt: null, dueDate: null, note: '' }}
                type="add"
                residentOptions={residentOptions}
                onFinish={async (values) => {
                  try {
                    // Map type đúng chuẩn backend
                    const typeMap = {
                      electric: 'electricity',
                      water: 'water',
                      service: 'service',
                      other: 'service',
                      parking: 'parking',
                    };
                    const payload = {
                      amount: parseFloat(values.amount),
                      dueDate: values.dueDate ? dayjs(values.dueDate).toISOString() : undefined,
                      isPaid: !!values.isPaid,
                      type: typeMap[values.type] || 'service',
                      userId: Number(values.userId),
                    };
                    await createInvoice(payload);
                    toast.success('Thêm hóa đơn thành công!');
                    setShowForm(false);
                    fetchInvoices();
                  } catch {
                    toast.error('Thêm hóa đơn thất bại!');
                  }
                }}
                onCancel={() => setShowForm(false)}
              />
            </Modal>
          )}
          {showEditForm && (
            <Modal
              title="SỬA HÓA ĐƠN"
              open={showEditForm}
              onCancel={() => setShowEditForm(false)}
              footer={null}
            >
              <InvoiceForm
                initialValues={editInvoice ? {
                  ...editInvoice,
                  createdAt: editInvoice.createdAt ? dayjs(editInvoice.createdAt) : null,
                  dueDate: editInvoice.dueDate ? dayjs(editInvoice.dueDate) : null,
                  isPaid: editInvoice.status === 'paid',
                } : {} }
                type="edit"
                residentOptions={residentOptions}
                onFinish={async (values) => {
                  try {
                    const typeMap = {
                      electric: 'electricity',
                      water: 'water',
                      service: 'service',
                      other: 'service',
                      parking: 'parking',
                    };
                    const payload = {
                      amount: parseFloat(values.amount),
                      dueDate: values.dueDate ? dayjs(values.dueDate).toISOString() : undefined,
                      isPaid: !!values.isPaid,
                      type: typeMap[values.type] || 'service',
                      userId: Number(values.userId),
                    };
                    await updateInvoice(editInvoice.id, payload);
                    toast.info('Cập nhật hóa đơn thành công!');
                    setShowEditForm(false);
                    fetchInvoices();
                  } catch {
                    toast.error('Cập nhật hóa đơn thất bại!');
                  }
                }}
                onCancel={() => setShowEditForm(false)}
              />
            </Modal>
          )}
          <div style={{ padding: 24 }}>
            {loading ? (
              <div style={{ borderRadius: 10, background: '#fff', padding: 24, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin size="large" />
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div style={{ borderRadius: 10, background: '#fff', padding: 24, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Không có hóa đơn nào.</p>
              </div>
            ) : (
              <div style={{ borderRadius: 10, background: '#fff', padding: 0, overflowX: 'auto', position: 'relative', minHeight: 200 }}>
                {/* Custom row style for InvoiceTable */}
                <style>{`
                  .invoice-row-custom td {
                    padding-top: 6px !important;
                    padding-bottom: 6px !important;
                  }
                `}</style>
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
                <InvoiceTable
                  invoices={paginatedInvoices}
                  onDetail={handleShowResidentDetail}
                  renderStatus={renderStatus}
                  onEdit={(invoice) => {
                    setEditInvoice(invoice);
                    setShowEditForm(true);
                  }}
                  onDelete={async (id) => {
                    try {
                      await deleteInvoice(id);
                      toast.error('Đã xóa hóa đơn!');
                      fetchInvoices();
                    } catch {
                      toast.error('Xóa hóa đơn thất bại!');
                    }
                  }}
                />
                {/* Pagination controls */}
                {totalPages > 1 && (
                  <PaginationControl
                    current={currentPage}
                    pageSize={invoicesPerPage}
                    total={filteredInvoices.length}
                    onChange={handlePageChange}
                  />
                )}
              </div>
            )}
            {error && <div className="text-danger mt-2">{error}</div>}
            {/* Resident Detail Modal */}
            <ResidentDetail
              residentId={detailResident?.id}
              visible={showDetailModal}
              onClose={() => setShowDetailModal(false)}
            />
          </div>
        </Card>
      </ConfigProvider>
    </React.Fragment>
  );
};

export default InvoiceList;
