import React from 'react';
import { Pagination } from 'antd';

const PaginationControl = ({ current, pageSize, total, onChange }) => (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
    <Pagination
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={onChange}
      showSizeChanger={false}
    />
  </div>
);

export default PaginationControl;
