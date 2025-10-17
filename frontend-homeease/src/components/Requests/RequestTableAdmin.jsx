import React from 'react';
import { Table, Button, Tag } from 'antd';

// TODO: Kết nối API lấy dữ liệu request

const getColumns = (onDetail) => [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: 'Tiêu đề', dataIndex: 'title', key: 'title', width: 200 },
  { title: 'Loại yêu cầu', dataIndex: 'category', key: 'category', width: 120,
    render: (cat) => {
      const map = {
        electricity: 'Điện',
        water: 'Nước',
        cleaning: 'Vệ sinh',
        parking: 'Gửi xe',
        service: 'Dịch vụ',
      };
      return map[cat] || (cat && cat[0]?.toUpperCase() + cat.slice(1)) || 'Khác';
    }
  },
  { title: 'Mức độ ưu tiên', dataIndex: 'priority', key: 'priority', width: 120,
    sorter: (a, b) => {
      const order = { high: 3, medium: 2, low: 1 };
      return (order[b.priority] || 0) - (order[a.priority] || 0);
    },
    render: (priority) => {
      let color = 'default';
      let text = 'Trung bình';
      if (priority === 'high') { color = 'red'; text = 'Cao'; }
      else if (priority === 'low') { color = 'geekblue'; text = 'Thấp'; }
      else if (priority === 'medium') { color = 'orange'; text = 'Trung bình'; }
      return <Tag color={color} style={{ fontWeight: 500 }}>{text}</Tag>;
    }
  },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 120,
    sorter: (a, b) => {
      const order = { pending: 1, in_progress: 2, completed: 3, rejected: 0 };
      return (order[b.status] || 0) - (order[a.status] || 0);
    },
    render: (status) => {
      let color = 'default';
      let text = 'Chờ xử lý';
      if (status === 'pending') { color = 'default'; text = 'Chờ xử lý'; }
      else if (status === 'in_progress') { color = 'blue'; text = 'Đang xử lý'; }
      else if (status === 'completed') { color = 'green'; text = 'Hoàn thành'; }
      else if (status === 'rejected') { color = 'red'; text = 'Từ chối'; }
      return <Tag color={color} style={{ fontWeight: 500 }}>{text}</Tag>;
    }
  },
  { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', width: 120,
    sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  },
  { title: 'Ngày cập nhật', dataIndex: 'updatedAt', key: 'updatedAt', width: 120,
    sorter: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  },
  { title: 'Người gửi', dataIndex: 'sender', key: 'sender', width: 140 },
  { title: 'Hành động', key: 'action', width: 100,
    render: (_, record) => (
      <>
        <Button type="link" onClick={() => onDetail(record)}>Chi tiết</Button>
      </>
    )
  },
];

const RequestTableAdmin = ({ data = [], loading, onDetail }) => (
  <Table
    columns={getColumns(onDetail)}
    dataSource={data}
    loading={loading}
    rowKey="id"
    pagination={{ pageSize: 10 }}
    scroll={{ x: 900 }}
    style={{ fontSize: '0.97rem', background: '#fff', width: '100%' }}
  />
);

export default RequestTableAdmin;
