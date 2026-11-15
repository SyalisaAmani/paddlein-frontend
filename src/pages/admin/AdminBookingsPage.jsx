
import { useCallback, useEffect, useState } from 'react'

import AdminLayout from '../../layouts/admin/AdminLayout'
import api from '../../services/api'
import BookingDetailModal from './components/BookingDetailModal'

function AdminBookingsPage() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchEmail, setSearchEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    // Mengelola booking
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isUpdatingPayment, setIsUpdatingPayment] = useState(false)

    // Mengambil data booking
    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true)
            setErrorMessage('')

            const response = await api.get('/bookings')

            setBookings(response.data.data || [])
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || 'Gagal memuat data booking.'
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchBookings()
    }, [fetchBookings])

    // Format data tanggal
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    // Format data harga
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(price))
    }

    // Buka modal detail booking
    const handleViewDetail = (booking) => {
        setSelectedBooking(booking)
        setIsDetailModalOpen(true)
    }

    // Tutup modal detail booking
    const handleCloseDetail = () => {
        setIsDetailModalOpen(false)
        setSelectedBooking(null)
    }

    // Konfirmasi pembayaran booking
    const handleConfirmPayment = async (booking) => {
        if (
            booking.status === 'cancelled' ||
            booking.payment_status === 'paid'
        ) {
            return
        }

        const isConfirmed = window.confirm(
            `Apakah kamu yakin ingin mengonfirmasi pembayaran booking #${booking.id}?`
        )

        if (!isConfirmed) return

        try {
            setIsUpdatingPayment(true)

            const response = await api.patch(
                `/bookings/${booking.id}/payment`,
                {
                    payment_status: 'paid',
                }
            )

            const updatedBooking = response.data.data

            setBookings((prevBookings) =>
                prevBookings.map((item) =>
                    item.id === booking.id ? {...item, payment_status: updatedBooking.payment_status,} : item
                )
            )

            setSelectedBooking(updatedBooking)

        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Gagal mengonfirmasi pembayaran.'
            )
        } finally {
            setIsUpdatingPayment(false)
        }
    }

    // Cancel booking oleh admin
    const handleCancelBooking = async (booking) => {
        if (booking.status === 'cancelled') {
            return
        }

        const confirmMessage = booking.payment_status == 'paid' ? `Booking #${booking.id} sudah dibayar.
        Apakah kamun ingin membatalkan booking ini?
        
        PERHATIAN:
        Status pembayaran akan tetap PAID. Pengembalian dana harus ditangani secara manual.`
        : `Apakah kamu yakin ingin membatalkan booking #${booking.id}?`

        const isConfirmed = window.confirm(confirmMessage)        

        if (!isConfirmed) return

        try {
            const response = await api.patch(
                `/bookings/${booking.id}/cancel`
            )

            const updatedBooking = response.data.data

            setBookings((prevBooking) =>
            prevBooking.map((item) =>
            item.id === booking.id ? {
                ...item,
                status: updatedBooking.status,
            } : item))

            setSelectedBooking((prevBooking) =>
            prevBooking ? {
                ...prevBooking,
                status: updatedBooking.status,
            }
            : prevBooking
        )

        } catch (error) {
            alert(
                error.response?.data?.message || 'Gagal memebatalkan booking.'
            )
        }
    }

    // Search data booking
    const filteredBookings = bookings.filter((booking) =>
    booking.user?.email ?.toLowerCase()
    .includes(searchEmail.toLowerCase().trim()))

    return (
        <AdminLayout>
            <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">
                    Booking Management
                </h1>

                <p className="mt-1 text-sm text-muted">
                    Kelola seluruh pemesanan lapangan.
                </p>

                <div className='mt-6'>
                    <label 
                        htmlFor="searchEmail"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Cari email customer
                    </label>

                    <input 
                        id='searchEmail'
                        type="text"
                        value={searchEmail}
                        onChange={(e) =>setSearchEmail(e.target.value)}
                        placeholder='Masukkan email customer'
                        className='w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-maroon-500 focus:ring-2 focus:ring-maroon-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500' />
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-262.5 text-left text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                                <tr className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    <th className="px-5 py-4 font-semibold">Customer</th>
                                    <th className="px-5 py-4 font-semibold">Lapangan</th>
                                    <th className="px-5 py-4 font-semibold">Tanggal</th>
                                    <th className="px-5 py-4 font-semibold">Waktu</th>
                                    <th className="px-5 py-4 font-semibold">Total Harga</th>
                                    <th className="px-5 py-4 font-semibold">Status Booking</th>
                                    <th className="px-5 py-4 font-semibold">Pembayaran</th>
                                    <th className="px-5 py-4 font-semibold">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">
                                            Memuat data booking...
                                        </td>
                                    </tr>
                                ) : errorMessage ? (
                                    <tr>
                                        <td colSpan="8" className="px-5 py-10 text-center text-red-500 dark:text-red-400">
                                            {errorMessage}
                                        </td>
                                    </tr>
                                ) : filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">
                                            {searchEmail ? 'Booking dengan email tersebut tidak ditemukan.' : 'Belum ada data booking.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <tr
                                            key={booking.id}
                                            className="transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-700/50"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-gray-800 dark:text-gray-100">
                                                    {booking.user?.name || '-'}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    {booking.user?.email || '-'}
                                                </p>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 dark:text-gray-200">
                                                {booking.court?.name || '-'}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                                                {formatDate(booking.booking_date)}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                                                {booking.start_time?.slice(0, 5)} - {booking.end_time?.slice(0, 5)}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800 dark:text-gray-100">
                                                {formatPrice(booking.total_price)}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                        booking.status === 'confirmed'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                                            : booking.status === 'cancelled'
                                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                                    }`}
                                                >
                                                    {booking.status === 'confirmed'
                                                        ? 'Confirmed'
                                                        : booking.status === 'cancelled'
                                                            ? 'Cancelled'
                                                            : 'Pending'}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                        booking.payment_status === 'paid'
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                                            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                                    }`}
                                                >
                                                    {booking.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewDetail(booking)}
                                                    className="rounded-lg bg-maroon-500/10 px-3 py-2 text-xs font-semibold text-maroon-600 transition-colors hover:bg-amber-500 hover:text-black"
                                                >
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Detail Booking */}
            <BookingDetailModal
                booking={selectedBooking}
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetail}
                formatDate={formatDate}
                formatPrice={formatPrice}
                onConfirmPayment={handleConfirmPayment}
                onCancelBooking={handleCancelBooking}
                isUpdatingPayment={isUpdatingPayment}
            />
        </AdminLayout>
    )
}

export default AdminBookingsPage
