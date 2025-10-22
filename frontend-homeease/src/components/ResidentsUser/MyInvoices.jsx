import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getInvoices } from '../../services/api'
import InvoiceTable from '../Invoices/InvoiceTable'
import PaginationControl from '../common/PaginationControl'
import ResidentDetail from '../Residents/ResidentDetail'
import { Card, Spin } from 'antd'

const MyInvoices = ({ onShowInvoice }) => {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const invoicesPerPage = 8
  const [pageLoading, setPageLoading] = useState(false)
  const [detailResident, setDetailResident] = useState(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return
      setLoading(true)
      try {
        const data = await getInvoices({ userId: user.id })
        const arr = Array.isArray(data) ? data : data?.data || []
        setInvoices(arr)
        setError('')
      } catch (err) {
        console.error('Failed to load my invoices', err)
        setError('Không thể tải hóa đơn')
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [user])

  const filteredInvoices = invoices // can add client-side filters later

  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage)
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * invoicesPerPage, currentPage * invoicesPerPage)

  const handlePageChange = (page) => {
    setPageLoading(true)
    setCurrentPage(page)
    setTimeout(() => setPageLoading(false), 250)
  }

  const handlePay = (invoice) => {
    if (onShowInvoice) {
      // request parent to open pay-invoice view for this invoice
      onShowInvoice(invoice, { pay: true })
    }
    // if you want different behavior (direct to pay view), parent App should pass a dedicated onPay handler
  }

  if (loading) return (
    <div className="p-4">
      <Card>
        <div className="flex items-center justify-center" style={{ minHeight: 180 }}>
          <Spin size="large" />
        </div>
      </Card>
    </div>
  )

  return (
    <div className="p-3 sm:p-4 container-xl">
      <Card className="compact-card" bodyStyle={{ padding: 0 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold mb-1">Hóa đơn của tôi</h3>
              <div className="text-sm text-gray-500">{filteredInvoices.length} hóa đơn</div>
            </div>
          </div>
        </div>
  <div className="border-t" />
  <div className="invoices-scroll px-4 py-3">
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {paginatedInvoices.length === 0 ? (
            <div className="py-6 text-center">Không có hóa đơn nào.</div>
          ) : (
            <div className="relative">
              {pageLoading && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                  <Spin />
                </div>
              )}
              <InvoiceTable
                invoices={paginatedInvoices.map(inv => ({ ...inv, _onPay: () => handlePay(inv) }))}
                onDetail={(inv) => setDetailResident(inv)}
                compactOnMobile={true}
                onInvoiceClick={(inv) => onShowInvoice && onShowInvoice(inv)}
              />
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-3 flex justify-center">
            <PaginationControl current={currentPage} pageSize={invoicesPerPage} total={filteredInvoices.length} onChange={handlePageChange} size="small" />
          </div>
        )}

        <ResidentDetail residentId={detailResident?.id} visible={!!detailResident} onClose={() => setDetailResident(null)} />
      </Card>
    </div>
  )
}

export default MyInvoices
