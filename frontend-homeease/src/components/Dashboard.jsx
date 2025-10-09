const Dashboard = ({ setCurrentView }) => {
  return (
    <div className="container-xl px-4 py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-3 fw-semibold">Tổng quan</h4>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="card-title text-muted mb-0 fs-6">Tổng Cư dân</h5>
                <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h2 className="fw-bold mb-1">150</h2>
              <p className="text-success mb-0 d-flex align-items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                  <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>5.3% tháng này</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="card-title text-muted mb-0 fs-6">Yêu cầu Chờ</h5>
                <div className="rounded-circle bg-warning bg-opacity-10 p-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#ff9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="#ff9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h2 className="fw-bold mb-1">25</h2>
              <p className="text-warning mb-0 d-flex align-items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>12.7% so với tuần trước</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="card-title text-muted mb-0 fs-6">Hóa đơn Quá hạn</h5>
                <div className="rounded-circle bg-danger bg-opacity-10 p-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h2 className="fw-bold mb-1">8</h2>
              <p className="text-danger mb-0 d-flex align-items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>2 hóa đơn mới</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="card-title text-muted mb-0 fs-6">Hoàn thành</h5>
                <div className="rounded-circle bg-success bg-opacity-10 p-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#198754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01L9 11.01" stroke="#198754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h2 className="fw-bold mb-1">42</h2>
              <p className="text-success mb-0 d-flex align-items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                  <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>8.4% tuần này</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-semibold">Yêu cầu Gần đây</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 py-3 px-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-semibold">Sửa chữa điện nước</h6>
                      <p className="text-muted mb-0 small">Căn hộ A101 - Nguyễn Văn A</p>
                    </div>
                    <span className="badge bg-warning text-dark bg-opacity-25 text-warning">Đang xử lý</span>
                  </div>
                </div>
                <div className="list-group-item border-0 py-3 px-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-semibold">Báo cáo tiếng ồn</h6>
                      <p className="text-muted mb-0 small">Căn hộ B205 - Trần Thị B</p>
                    </div>
                    <span className="badge bg-danger bg-opacity-25 text-danger">Khẩn cấp</span>
                  </div>
                </div>
                <div className="list-group-item border-0 py-3 px-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-semibold">Đăng ký thang máy</h6>
                      <p className="text-muted mb-0 small">Căn hộ C302 - Lê Văn C</p>
                    </div>
                    <span className="badge bg-success bg-opacity-25 text-success">Hoàn thành</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer bg-white border-0 py-3">
              <a href="#" className="text-decoration-none d-flex align-items-center justify-content-center" onClick={(e) => {e.preventDefault(); setCurrentView('requests')}}>
                <span className="me-2">Xem tất cả yêu cầu</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-semibold">Hóa đơn Sắp đến hạn</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 py-3 px-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-semibold">Phí dịch vụ tháng 10</h6>
                      <p className="text-muted mb-0 small">Hạn: 15/10/2025</p>
                    </div>
                    <div className="text-end">
                      <h6 className="mb-0 fw-bold">2,000,000₫</h6>
                      <span className="text-danger small">Còn 6 ngày</span>
                    </div>
                  </div>
                </div>
                <div className="list-group-item border-0 py-3 px-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-semibold">Phí gửi xe tháng 10</h6>
                      <p className="text-muted mb-0 small">Hạn: 20/10/2025</p>
                    </div>
                    <div className="text-end">
                      <h6 className="mb-0 fw-bold">300,000₫</h6>
                      <span className="text-warning small">Còn 11 ngày</span>
                    </div>
                  </div>
                </div>
                <div className="list-group-item border-0 py-3 px-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-semibold">Phí internet tháng 10</h6>
                      <p className="text-muted mb-0 small">Hạn: 25/10/2025</p>
                    </div>
                    <div className="text-end">
                      <h6 className="mb-0 fw-bold">220,000₫</h6>
                      <span className="text-success small">Còn 16 ngày</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer bg-white border-0 py-3">
              <a href="#" className="text-decoration-none d-flex align-items-center justify-content-center" onClick={(e) => {e.preventDefault(); setCurrentView('invoices')}}>
                <span className="me-2">Xem tất cả hóa đơn</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;