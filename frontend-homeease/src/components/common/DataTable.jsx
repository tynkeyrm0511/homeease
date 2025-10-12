import React from 'react';
import { Table, Spin, Alert } from 'antd';
import AppPagination from './AppPagination';

/**
 * DataTable component dùng chung cho các entity (residents, invoices, requests, notifications...)
 * @param {Array} columns - Cấu hình cột (Ant Design Table columns)
 * @param {Array} data - Dữ liệu hiển thị
 * @param {boolean} loading - Trạng thái loading
 * @param {string} error - Thông báo lỗi (nếu có)
 * @param {ReactNode} actions - Các nút hành động (edit, delete, ...), có thể là function(row) => ReactNode
 * @param {object} pagination - { current, total, pageSize, onChange }
 */
const DataTable = ({ columns, data, loading, error, actions, pagination }) => {
  // Thêm cột actions nếu có
  const tableColumns = actions
    ? [
        ...columns,
        {
          title: 'Hành động',
          key: 'actions',
          render: (row) => (typeof actions === 'function' ? actions(row) : actions),
          align: 'center',
        },
      ]
    : columns;

  return (
    <div className="data-table-wrapper">
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Table
          columns={tableColumns}
          dataSource={data}
          rowKey={(row) => row.id || row.key}
          pagination={false}
          bordered
        />
      </Spin>
      {pagination && pagination.total > pagination.pageSize && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <AppPagination {...pagination} />
        </div>
      )}
    </div>
  );
};

export default DataTable;
