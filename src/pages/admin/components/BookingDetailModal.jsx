function BookingDetailModal({ booking, isOpen, onClose, formatDate, formatPrice, onConfirmPayment, isUpdatingPayment, onCancelBooking}) {
    if (!isOpen || !booking) {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-gray-800">

                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-700">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                            Detail Booking
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Informasi lengkap pemesanan lapangan
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-3 py-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Content */}
                <div className="space-y-5 px-6 py-5">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Booking ID
                        </p>
                        <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">
                            #{booking.id}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Customer
                            </p>
                            <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">
                                {booking.user?.name || '-'}
                            </p>
                            <p className="mt-1 break-all text-xs text-gray-500 dark:text-gray-400">
                                {booking.user?.email || '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Lapangan
                            </p>
                            <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">
                                {booking.court?.name || '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Tanggal Booking
                            </p>
                            <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">
                                {formatDate(booking.booking_date)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Waktu Booking
                            </p>
                            <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">
                                {booking.start_time?.slice(0, 5)} - {booking.end_time?.slice(0, 5)}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Total Harga
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-800 dark:text-gray-100">
                            {formatPrice(booking.total_price)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Status Booking
                            </p>
                            <p className="mt-1 font-semibold capitalize text-gray-800 dark:text-gray-100">
                                {booking.status}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Status Pembayaran
                            </p>
                            <p className="mt-1 font-semibold capitalize text-gray-800 dark:text-gray-100">
                                {booking.payment_status}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Catatan Customer
                        </p>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                            {booking.notes || 'Tidak ada catatan.'}
                        </p>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                    {/* Konfirmasi pembayaran */}
                    {booking.status !== 'cancelled' && booking.payment_status === 'unpaid' && (
                        <button
                            type="button"
                            onClick={() => onConfirmPayment(booking)}
                            disabled={isUpdatingPayment}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isUpdatingPayment ? 'Memproses...' : 'Konfirmasi Pembayaran'}
                        </button>
                    )}

                    {/* Button batalkan booking */}
                    {booking.status !== 'cancelled' && (
                        <button
                            type="button"
                            onClick={() => onCancelBooking(booking)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                        >
                            Batalkan booking
                        </button>
                    )}

                    {/* Button close */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BookingDetailModal