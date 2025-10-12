import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Input, Spin, message, ConfigProvider } from 'antd';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '../../services/api';
import InvoiceTable from './InvoiceTable';
import ResidentDetail from '../Residents/ResidentDetail';
import PaginationControl from '../common/PaginationControl';
import InvoiceForm from './InvoiceForm';
import { getResidents } from '../../services/api';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showOverdue, setShowOverdue] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailResident, setDetailResident] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);
  const invoicesPerPage = 10;
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [residentOptions, setResidentOptions] = useState([]);

  // Hàm load lại danh sách hóa đơn
  const fetchInvoices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getInvoices();
      setInvoices(Array.isArray(data) ? data : []);
    } catch {
      setError('Không thể tải danh sách hóa đơn!');
      message.error('Lỗi tải hóa đơn!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    // Lấy danh sách cư dân cho form
    const fetchResidents = async () => {
      try {
        const res = await getResidents();
        setResidentOptions(Array.isArray(res.data) ? res.data : []);
      } catch {
        setResidentOptions([]);
      }
    };
    fetchResidents();
  }, []);

  // Search/filter invoices
  let filteredInvoices = invoices.filter(inv => {
    const text = searchText.toLowerCase();
    return (
      inv.user?.name?.toLowerCase().includes(text) ||
      inv.id?.toString().includes(text)
    );
  });
  if (showOverdue) {
    filteredInvoices = filteredInvoices.filter(inv => {
      const today = dayjs();
      return inv.dueDate && dayjs(inv.dueDate).isBefore(today, 'day') && inv.status !== 'paid';
    });
  }
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * invoicesPerPage,
    currentPage * invoicesPerPage
  );
  // Handle page change with smooth loading
  const handlePageChange = (page) => {
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setPageLoading(false);
    }, 400);
  };

  // Status dot renderer
  const renderStatus = (status) => (
    status === 'paid'
      ? <span style={{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#52c41a'}} title="Đã thanh toán" />
      : status === 'overdue'
        ? <span style={{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#ff4d4f'}} title="Quá hạn" />
        : <span style={{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#faad14'}} title="Chưa thanh toán" />
  );

  // Show resident detail popup
  const handleShowResidentDetail = (resident) => {
    setDetailResident(resident);
    setShowDetailModal(true);
  };

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
  <div style={{ marginTop: 40, maxWidth: 1200, minHeight: '100vh', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
        <h4 className="mb-3 fw-bold" style={{ fontSize: 22 }}>DANH SÁCH HÓA ĐƠN</h4>
        <Input.Search
          placeholder="Tìm kiếm theo tên cư dân, mã hóa đơn..."
          allowClear
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ maxWidth: 350, marginBottom: 16 }}
        />
        <Button type="primary" style={{ marginBottom: 12, marginLeft: 8 }} onClick={() => setShowForm(true)}>
          Thêm hóa đơn
        </Button>
        <Button
          style={{ marginBottom: 12, marginLeft: 8 }}
          type={showOverdue ? 'default' : 'dashed'}
          onClick={() => setShowOverdue(prev => !prev)}
        >
          {showOverdue ? 'Hiển thị tất cả' : 'Chỉ hóa đơn quá hạn'}
        </Button>
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
        <div>
          {loading ? (
            <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderRadius: 10, background: '#fff', padding: 24, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin size="large" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderRadius: 10, background: '#fff', padding: 24, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>Không có hóa đơn nào.</p>
            </div>
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
        </div>
        {error && <div className="text-danger mt-2">{error}</div>}
        {/* Resident Detail Modal */}
        <ResidentDetail
          residentId={detailResident?.id}
          visible={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />
      </div>
    </ConfigProvider>
  );
};

export default InvoiceList;
