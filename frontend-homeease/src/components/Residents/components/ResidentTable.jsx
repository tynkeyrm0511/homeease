import React from 'react';
import { Button } from 'antd';

const ResidentTable = ({ residents, onEdit, onDelete }) => (
  <table className="resident-table" style={{ width: '100%', fontSize: '0.97rem', marginBottom: 0, borderCollapse: 'separate', borderSpacing: 0, minWidth: 900 }}>
    <thead>
      <tr>
        <th style={{ width: 50 }}>ID</th>
        <th style={{ width: 160 }}>Tên</th>
        <th style={{ width: 220 }}>Email</th>
        <th style={{ width: 90 }}>Vai trò</th>
        <th style={{ width: 70 }}></th>
      </tr>
    </thead>
    <tbody>
      {residents.map((resident) => (
        <tr key={resident.id}>
          <td style={{ verticalAlign: 'middle' }}>{resident.id}</td>
          <td style={{ verticalAlign: 'middle' }}>{resident.name}</td>
          <td style={{ verticalAlign: 'middle' }}>{resident.email}</td>
          <td style={{ verticalAlign: 'middle', textTransform: 'capitalize' }}>{resident.role}</td>
          <td style={{ verticalAlign: 'middle' }}>
            <div className="resident-action-group">
              <Button type="default" className="resident-action-btn edit-btn" onClick={() => onEdit(resident)}>
                Sửa
              </Button>
              <Button type="primary" danger className="resident-action-btn delete-btn" onClick={() => onDelete(resident)}>
                Xóa
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ResidentTable;
