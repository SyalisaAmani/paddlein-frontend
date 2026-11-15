import { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/admin/AdminLayout'
import SummaryCard from '../../components/SummaryCard'
import {
  CalendarDays,
  Clock,
  CheckCircle,
  Wallet,
} from 'lucide-react'
import api from '../../services/api'

function AdminDashboardPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Mengambil seluruh data booking
  useEffect(() => {
    let isActive = true

    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings')

        if (isActive) {
          setBookings(response.data.data || [])
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(
            error.response?.data?.message ||
            'Gagal mengambil data booking.'
          )
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    fetchBookings()

    return () => {
      isActive = false
    }
  }, [])

  // Menghitung ringkasan booking
  const unpaidBookings = bookings.filter(
    (booking) => booking.payment_status === 'unpaid'
  )

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === 'confirmed'
  )

  const totalRevenue = bookings
    .filter((booking) => booking.payment_status === 'paid')
    .reduce(
      (total, booking) => total + Number(booking.total_price || 0),
      0
    )

  // Mengurutkan booking terbaru berdasarkan waktu dibuat
  const latestBookings = [...bookings]
    .sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at)
    })
    .slice(0, 5)

  const formatCurrency = (value) => {
    return `Rp${Number(value).toLocaleString('id-ID')}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'

    const dateOnly = String(dateString).split('T')[0]
    const [year, month, day] = dateOnly.split('-')

    if (!year || !month || !day) return '-'

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    )

    if (Number.isNaN(date.getTime())) return '-'

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getPaymentLabel = (status) => {
    return status === 'paid' ? 'Lunas' : 'Belum Dibayar'
  }

  const getPaymentStyle = (status) => {
    return status === 'paid'
      ? 'bg-green-500/10 text-green-500'
      : 'bg-yellow-500/10 text-yellow-500'
  }

  const getBookingLabel = (status) => {
    const labels = {
      confirmed: 'Dikonfirmasi',
      cancelled: 'Dibatalkan',
      completed: 'Selesai',
    }

    return labels[status] || status
  }

  const getBookingStyle = (status) => {
    const styles = {
      confirmed: 'bg-blue-500/10 text-blue-500',
      cancelled: 'bg-red-500/10 text-red-500',
      completed: 'bg-green-500/10 text-green-500',
    }

    return styles[status] || 'bg-surface-elevated text-muted'
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-muted">
          Ringkasan aktivitas booking dan pembayaran Paddle Court.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Booking"
          value={loading ? '...' : bookings.length}
          description="Seluruh pemesanan"
          icon={CalendarDays}
        />

        <SummaryCard
          title="Menunggu Pembayaran"
          value={loading ? '...' : unpaidBookings.length}
          description="Booking belum dibayar"
          icon={Clock}
        />

        <SummaryCard
          title="Booking Terkonfirmasi"
          value={loading ? '...' : confirmedBookings.length}
          description="Booking berstatus confirmed"
          icon={CheckCircle}
        />

        <SummaryCard
          title="Total Pendapatan"
          value={loading ? '...' : formatCurrency(totalRevenue)}
          description="Dari pembayaran yang lunas"
          icon={Wallet}
        />
      </div>

      {/* Latest Bookings */}
      <div className="mt-8">
        <div className="mb-5">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Booking Terbaru
          </h2>

          <p className="mt-1 text-sm text-muted">
            Lima pemesanan terbaru dari seluruh customer.
          </p>
        </div>

        {loading ? (
          <div className="rounded-card border border-border bg-surface p-8 text-center text-muted">
            Memuat data booking...
          </div>
        ) : errorMessage ? (
          <div className="rounded-card border border-border bg-surface p-8 text-center">
            <p className="text-sm text-danger">{errorMessage}</p>
          </div>
        ) : latestBookings.length === 0 ? (
          <div className="rounded-card border border-border bg-surface p-8 text-center">
            <CalendarDays
              size={36}
              className="mx-auto mb-3 text-muted"
            />

            <h3 className="font-heading font-semibold text-foreground">
              Belum Ada Booking
            </h3>

            <p className="mt-2 text-sm text-muted">
              Belum ada pemesanan lapangan dari customer.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-card border border-border bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5 text-left">
                <thead className="border-b border-border bg-surface-elevated">
                  <tr className="text-sm text-muted">
                    <th className="px-5 py-4 font-semibold">Customer</th>
                    <th className="px-5 py-4 font-semibold">Lapangan</th>
                    <th className="px-5 py-4 font-semibold">Tanggal</th>
                    <th className="px-5 py-4 font-semibold">Jam</th>
                    <th className="px-5 py-4 font-semibold">Total Harga</th>
                    <th className="px-5 py-4 font-semibold">Pembayaran</th>
                    <th className="px-5 py-4 font-semibold">Booking</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {latestBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="text-sm text-foreground"
                    >
                      <td className="px-5 py-4 font-medium">
                        {booking.user?.name || '-'}
                      </td>

                      <td className="px-5 py-4">
                        {booking.court?.name || '-'}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatDate(booking.booking_date)}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {booking.start_time?.slice(0, 5)} -{' '}
                        {booking.end_time?.slice(0, 5)}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatCurrency(booking.total_price)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStyle(booking.payment_status)}`}
                        >
                          {getPaymentLabel(booking.payment_status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBookingStyle(booking.status)}`}
                        >
                          {getBookingLabel(booking.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboardPage