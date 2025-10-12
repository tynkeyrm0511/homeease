import React from 'react';
import { Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const StatusDot = ({ color }) => (
  <span style={{
    display: 'inline-block',
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: color,
    margin: 0,
    verticalAlign: 'middle',
  }} />
);

const ResidentTable = ({ residents, onEdit, onDelete, onDetail, renderStatus }) => (
  <table className="resident-table" style={{ width: '100%', fontSize: '0.97rem', marginBottom: 0, borderCollapse: 'separate', borderSpacing: 0, minWidth: 900 }}>
    <thead>
      <tr>
        <th style={{ width: 50 }}>ID</th>
        <th style={{ width: 160 }}>Tên</th>
        <th style={{ width: 220 }}>Email</th>
        <th style={{ width: 90 }}>Vai trò</th>
        <th style={{ width: 100, textAlign: 'center' }}>Trạng thái</th>
        <th style={{ width: 70 }}></th>
      </tr>
    </thead>
    <tbody>
      {residents.map((resident) => (
        <tr key={resident.id}>
          <td style={{ verticalAlign: 'middle' }}>{resident.id}</td>
          <td style={{ verticalAlign: 'middle' }}>
            <Button type="link" onClick={() => onDetail && onDetail(resident)} style={{ padding: 0 }}>
              {resident.name}
            </Button>
          </td>
          <td style={{ verticalAlign: 'middle' }}>{resident.email}</td>
          <td style={{ verticalAlign: 'middle', textTransform: 'capitalize' }}>{resident.role}</td>
          <td style={{ verticalAlign: 'middle', padding: 0, height: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 40 }}>
              {renderStatus ? renderStatus(resident.status) : (
                resident.status === 'active'
                  ? <StatusDot color="#52c41a" />
                  : <StatusDot color="#ff4d4f" />
              )}
            </div>
          </td>
          <td style={{ verticalAlign: 'middle' }}>
            <div className="resident-action-group" style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(resident)} />
              <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(resident)} />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ResidentTable;
