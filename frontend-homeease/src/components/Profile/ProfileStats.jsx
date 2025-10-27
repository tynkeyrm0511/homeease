import React, { useState, useEffect } from 'react';
import { Spin, Card, Row, Col, Progress } from 'antd';
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { getProfileStats } from '../../services/profileApi';

const StatCard = ({ title, value, icon, color, gradient, index }) => (
  <div 
    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    style={{
      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
    }}
  >
    <div 
      className="p-4 sm:p-6 bg-gradient-to-br relative"
      style={{
        background: gradient || `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium truncate">{title}</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-800 truncate" style={{ color: color }}>
            {value}
          </div>
        </div>
        <div 
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 flex-shrink-0 ml-2"
          style={{ 
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
            animation: `pulse 2s ease-in-out infinite`
          }}
        >
          {React.cloneElement(icon, { style: { fontSize: window.innerWidth < 640 ? '20px' : '28px', color: '#fff' } })}
        </div>
      </div>
    </div>
  </div>
);

const ProfileStats = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    invoices: {
      total: 0,
      paid: 0,
      unpaid: 0,
      totalAmount: 0,
      paidAmount: 0,
      unpaidAmount: 0
    },
    requests: {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      rejected: 0
    }
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getProfileStats();
      setStats(response.data);
    } catch (error) {
      console.error('Load stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const invoicePaymentRate = stats.invoices.total > 0 
    ? Math.round((stats.invoices.paid / stats.invoices.total) * 100) 
    : 0;

  const requestCompletionRate = stats.requests.total > 0
    ? Math.round((stats.requests.completed / stats.requests.total) * 100)
    : 0;

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-blue-50">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div 
          className="mb-4 sm:mb-6 lg:mb-8"
          style={{ animation: 'slideInLeft 0.6s ease-out' }}
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
            Thống kê tổng quan
          </h2>
          <p className="text-sm sm:text-base text-gray-600">Theo dõi hoạt động và chi tiêu của bạn</p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Invoices Section */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <DollarCircleOutlined className="text-blue-600" />
                  Hóa đơn
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Tỷ lệ thanh toán: {invoicePaymentRate}%
                </p>
              </div>
              <Progress 
                type="circle" 
                percent={invoicePaymentRate} 
                width={window.innerWidth < 640 ? 50 : 60}
                strokeColor={{
                  '0%': '#3b82f6',
                  '100%': '#8b5cf6',
                }}
                strokeWidth={8}
              />
            </div>
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Tổng số hóa đơn"
                  value={stats.invoices.total}
                  icon={<FileTextOutlined />}
                  color="#3b82f6"
                  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  index={0}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Đã thanh toán"
                  value={stats.invoices.paid}
                  icon={<CheckCircleOutlined />}
                  color="#10b981"
                  gradient="linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
                  index={1}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Chưa thanh toán"
                  value={stats.invoices.unpaid}
                  icon={<ClockCircleOutlined />}
                  color="#f59e0b"
                  gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                  index={2}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Tổng số tiền đã trả"
                  value={`${stats.invoices.paidAmount.toLocaleString()}đ`}
                  icon={<DollarCircleOutlined />}
                  color="#6366f1"
                  gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                  index={3}
                />
              </Col>
            </Row>
          </div>

          {/* Requests Section */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FileTextOutlined className="text-purple-600" />
                  Yêu cầu dịch vụ
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Tỷ lệ hoàn thành: {requestCompletionRate}%
                </p>
              </div>
              <Progress 
                type="circle" 
                percent={requestCompletionRate} 
                width={window.innerWidth < 640 ? 50 : 60}
                strokeColor={{
                  '0%': '#8b5cf6',
                  '100%': '#ec4899',
                }}
                strokeWidth={8}
              />
            </div>
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Tổng số yêu cầu"
                  value={stats.requests.total}
                  icon={<FileTextOutlined />}
                  color="#3b82f6"
                  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  index={4}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Đã hoàn thành"
                  value={stats.requests.completed}
                  icon={<CheckCircleOutlined />}
                  color="#10b981"
                  gradient="linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
                  index={5}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Đang chờ xử lý"
                  value={stats.requests.pending}
                  icon={<ClockCircleOutlined />}
                  color="#f59e0b"
                  gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                  index={6}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  title="Đang xử lý"
                  value={stats.requests.inProgress}
                  icon={<SyncOutlined />}
                  color="#6366f1"
                  gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                  index={7}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;