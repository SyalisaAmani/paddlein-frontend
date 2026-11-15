
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import CustomerLayout from '../../layouts/customer/CustomerLayout'
import api from '../../services/api'

function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [cancelLoading, setCancelLoading] = useState(null)
  const [cancelMessage, setCancelMessage] = useState('')

  useEffect(() => {
    let isActive = true

    const loadBookings = async () => {
      try {
        const response = await api.get('/bookings')

        console.log('Booking date:', response.data.data.map(booking => ({
    id: booking.id,
    booking_date: booking.booking_date,
})));

        if (isActive) {
          setBookings(response.data.data)
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

    loadBookings()

    return () => {
      isActive = false
    }
  }, [])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
  };

  const formatTime = (time) => {
    return time?.slice(0, 5)
  }

  const formatPrice = (price) => {
    return Number(price).toLocaleString('id-ID')
  }

  const getBookingStatus = (status) => {
    const statuses = {
      confirmed: 'Dikonfirmasi',
      cancelled: 'Dibatalkan',
      completed: 'Selesai',
    }

    return statuses[status] || status
  }

  const getPaymentStatus = (status) => {
    const statuses = {
      paid: 'Sudah Dibayar',
      unpaid: 'Belum Dibayar',
    }

    return statuses[status] || status
  }

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      'Apakah kamu yakin ingin membatalkan booking ini?'
    )

    if (!confirmed) return

    try {
      setCancelLoading(bookingId)
      setCancelMessage('')

      const response = await api.patch(`/bookings/${bookingId}/cancel`)

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: response.data.data.status }
            : booking
        )
      )

      setCancelMessage(response.data.message)
    } catch (error) {

      setCancelMessage(
        error.response?.data?.message ||
        'Gagal membatalkan booking.'
      )
    } finally {
      setCancelLoading(null)
    }
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Booking Saya
          </h1>
          <p className="mt-1 text-sm text-muted">
            Lihat daftar dan informasi booking lapangan Anda.
          </p>
        </div>

        {cancelMessage && (
          <div className="rounded-xl border border-border bg-surface p-4 text-sm text-foreground">
            {cancelMessage}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            <p className="text-muted">Memuat data booking...</p>
          </div>
        )}

        {!loading && errorMessage && (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-center text-red-600">
            {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && bookings.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            <CalendarDays className="mx-auto mb-3 text-muted" size={36} />

            <h2 className="font-semibold text-foreground">
              Belum Ada Booking
            </h2>

            <p className="mt-1 text-sm text-muted">
              Anda belum memiliki riwayat booking lapangan.
            </p>

            <Link
              to="/customer/courts"
              className="mt-5 inline-block rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white"
            >
              Cari Lapangan
            </Link>
          </div>
        )}

        {!loading && !errorMessage && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {booking.court?.name || 'Lapangan'}
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                      Booking #{booking.id}
                    </p>
                  </div>

                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    {getBookingStatus(booking.status)}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="text-accent" size={20} />

                    <div>
                      <p className="text-xs text-muted">Tanggal</p>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(booking.booking_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="text-accent" size={20} />

                    <div>
                      <p className="text-xs text-muted">Waktu</p>
                      <p className="text-sm font-medium text-foreground">
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="text-accent" size={20} />

                    <div>
                      <p className="text-xs text-muted">Total Harga</p>
                      <p className="text-sm font-medium text-foreground">
                        Rp {formatPrice(booking.total_price)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted">Pembayaran</p>
                    <p className="text-sm font-medium text-foreground">
                      {getPaymentStatus(booking.payment_status)}
                    </p>
                  </div>
                </div>

                {booking.notes && (
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-xs text-muted">Catatan</p>
                    <p className="mt-1 text-sm text-foreground">
                      {booking.notes}
                    </p>
                  </div>
                )}

                {booking.status !== 'cancelled' && (
                  <div className="mt-5 flex justify-end border-t border-border pt-4">
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancelLoading === booking.id}
                      className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {cancelLoading === booking.id
                        ? 'Membatalkan...'
                        : 'Batalkan Booking'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}

export default MyBookingsPage
