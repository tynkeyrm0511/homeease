// src/components/Residents/ResidentsList.jsx
import { useState, useEffect } from 'react';
import { getResidents } from '../../services/api';

const ResidentsList = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await getResidents();
        setResidents(response.data);
      } catch (err) {
        setError('Không thể tải danh sách cư dân');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResidents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-xl px-4 py-4">
      <h4 className="mb-3 fw-semibold">Danh sách Cư dân</h4>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {residents.length === 0 ? (
            <p>Không có cư dân nào.</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                </tr>
              </thead>
              <tbody>
                {residents.map((resident) => (
                  <tr key={resident.id}>
                    <td>{resident.id}</td>
                    <td>{resident.name}</td>
                    <td>{resident.email}</td>
                    <td>{resident.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentsList;