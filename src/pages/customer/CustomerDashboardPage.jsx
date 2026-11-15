import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomerLayout from '../../layouts/customer/CustomerLayout'
import SummaryCard from '../../components/SummaryCard'
import {
  CalendarDays,
  Clock,
  CheckCircle,
  Wallet,
} from 'lucide-react'
import api from '../../services/api'

function CustomerDashboardPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Mengambil data booking customer
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

  // Menggabungkan tanggal dan jam booking
  const getBookingDateTime = (booking) => {
    const [year, month, day] = booking.booking_date.split('-')
    const [hours, minutes] = booking.start_time.split(':')

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes)
    )
  }

  const now = new Date()

  // Booking yang tidak dibatalkan
  const validBookings = bookings.filter(
    (booking) => booking.status !== 'cancelled'
  )

  // Booking mendatang
  const upcomingBookings = validBookings.filter(
    (booking) => getBookingDateTime(booking) > now
  )

  // Booking selesai berdasarkan waktu yang sudah berlalu
  const completedBookings = validBookings.filter(
    (booking) => {
      const bookingEndTime = getBookingDateTime(booking)
      bookingEndTime.setHours(bookingEndTime.getHours() + 1)

      return bookingEndTime <= now
    }
  )

  // Total pengeluaran dari booking yang sudah dibayar
  const totalExpenses = bookings
    .filter((booking) => booking.payment_status === 'paid')
    .reduce(
      (total, booking) => total + Number(booking.total_price || 0),
      0
    )

  // Mengambil 5 booking terbaru
  const latestBookings = [...bookings]
    .sort((a, b) => {
      return getBookingDateTime(b) - getBookingDateTime(a)
    })
    .slice(0, 5)

  const formatCurrency = (value) => {
    return `Rp${Number(value).toLocaleString('id-ID')}`
  }

  const formatDate = (dateString) => {
  if (!dateString) return '-'

  // Mengambil bagian tanggal YYYY-MM-DD
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

  const getStatusLabel = (status) => {
    const statusLabels = {
      confirmed: 'Dikonfirmasi',
      cancelled: 'Dibatalkan',
      completed: 'Selesai',
    }

    return statusLabels[status] || status
  }

  const getStatusStyle = (status) => {
    const styles = {
      confirmed: 'bg-blue-500/10 text-blue-500',
      cancelled: 'bg-red-500/10 text-red-500',
      completed: 'bg-green-500/10 text-green-500',
    }

    return styles[status] || 'bg-surface-elevated text-muted'
  }

  return (
    <CustomerLayout>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Dashboard
        </h1>

        <p className="mt-2 text-muted">
          Ringkasan aktivitas booking lapangan kamu.
        </p>
      </div>

      {/* Informasi aktivitas customer */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Booking"
          value={loading ? '...' : bookings.length}
          description="Seluruh booking kamu"
          icon={CalendarDays}
        />

        <SummaryCard
          title="Booking Mendatang"
          value={loading ? '...' : upcomingBookings.length}
          description="Booking yang akan datang"
          icon={Clock}
        />

        <SummaryCard
          title="Booking Selesai"
          value={loading ? '...' : completedBookings.length}
          description="Booking yang sudah berlalu"
          icon={CheckCircle}
        />

        <SummaryCard
          title="Total Pengeluaran"
          value={loading ? '...' : formatCurrency(totalExpenses)}
          description="Total booking yang sudah dibayar"
          icon={Wallet}
        />
      </div>

      {/* Booking terbaru */}
      <div className="mt-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">
              Booking Terbaru
            </h2>

            <p className="mt-1 text-sm text-muted">
              Riwayat pemesanan lapangan kamu.
            </p>
          </div>

          <Link
            to="/customer/bookings"
            className="shrink-0 text-sm font-semibold text-accent hover:text-accent-hover"
          >
            Lihat Semua
          </Link>
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
              Kamu belum memiliki riwayat pemesanan lapangan.
            </p>

            <Link
              to="/customer/courts"
              className="mt-5 inline-block rounded-control bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
            >
              Cari Lapangan
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-card border border-border bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full min-w-162.5 text-left">
                <thead className="border-b border-border bg-surface-elevated">
                  <tr className="text-sm text-muted">
                    <th className="px-5 py-4 font-semibold">Lapangan</th>
                    <th className="px-5 py-4 font-semibold">Tanggal</th>
                    <th className="px-5 py-4 font-semibold">Jam</th>
                    <th className="px-5 py-4 font-semibold">Total Harga</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {latestBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="text-sm text-foreground"
                    >
                      <td className="px-5 py-4 font-medium">
                        {booking.court?.name || 'Lapangan'}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatDate(booking.booking_date)}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {booking.start_time.slice(0, 5)} -{' '}
                        {booking.end_time.slice(0, 5)}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatCurrency(booking.total_price)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(booking.status)}`}
                        >
                          {getStatusLabel(booking.status)}
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
    </CustomerLayout>
  )
}

export default CustomerDashboardPage