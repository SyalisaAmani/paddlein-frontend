
import { useParams, useNavigate } from "react-router-dom";
import CustomerLayout from "../../layouts/customer/CustomerLayout";
import { useEffect, useState } from "react";
import api from "../../services/api";

function BookingPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Court detail state
    const [errorMessage, setErrorMessage] = useState('');
    const [court, setCourt] = useState(null);
    const [loading, setLoading] = useState(true);

    // Booking date and time state
    const [bookingDate, setBookingDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [notes, setNotes] = useState('');

    // Availability state
    const [bookedSlots, setBookedSlots] = useState([]);
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
    const [availabilityError, setAvailabilityError] = useState('');
    const [availabilityRefresh, setAvailabilityRefresh] = useState(0);

    // Booking submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState('');

    // Daftar jam operasional (09.00 - 21.00)
    // Jam terakhir yang bisa dipilih adalah 20.00
    const timeSlots = Array.from({ length: 12 }, (_, index) => {
        const hour = index + 9;
        return `${String(hour).padStart(2, '0')}:00`;
    });

    // Memeriksa apakah jam sudah dipesan
    const isSlotBooked = (slot) => {
        const [hour, minute] = slot.split(':').map(Number);

        const slotStart = hour * 60 + minute;
        const slotEnd = slotStart + 60;

        return bookedSlots.some((booking) => {
            const [startHour, startMinute] = booking.start_time.split(':').map(Number);
            const [endHour, endMinute] = booking.end_time.split(':').map(Number);

            const bookingStart = startHour * 60 + startMinute;
            const bookingEnd = endHour * 60 + endMinute;

            return bookingStart < slotEnd && bookingEnd > slotStart;
        });
    };

    // Memeriksa apakah jam booking sudah terlewat
    const isSlotPast = (slot) => {
        if (!bookingDate) return false;

        const today = new Date();

        const selectedDate = new Date(`${bookingDate}T00:00:00`);

        const todayDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        // Menonaktifkan seluruh jam jika tanggal sudah lewat
        if (selectedDate.getTime() < todayDate.getTime()) {
            return true;
        }

        const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // Jika tanggal booking bukan hari ini, jam belum terlewat
        if (bookingDate !== todayString) {
            return false;
        }

        const [hour, minute] = slot.split(':').map(Number);

        return hour * 60 + minute <= today.getHours() * 60 + today.getMinutes();
    };

    // Mengirim booking ke API
    const handleBooking = async () => {
        if (!bookingDate || !startTime) {
            setBookingError('Silakan pilih tanggal dan jam booking.');
            return;
        }

        if (isSlotBooked(startTime) || isSlotPast(startTime)) {
            setBookingError('Jam booking sudah tidak tersedia. Silakan pilih jam lain.');
            return;
        }

        try {
            setIsSubmitting(true);
            setBookingError('');
            setBookingSuccess('');

            await api.post('/bookings', {
                court_id: Number(id),
                booking_date: bookingDate,
                start_time: startTime,
                notes: notes,
            });

            setBookingSuccess('Booking berhasil dibuat.');

            setStartTime('');
            setNotes('');

            // Memperbarui jadwal ketersediaan
            setAvailabilityRefresh((prev) => prev + 1);

        } catch (error) {
            console.error('Error creating booking:', error);

            setBookingError(
                error.response?.data?.message ||
                'Gagal membuat booking. Silakan coba kembali.'
            );

            // Memperbarui jadwal jika booking ditolak
            setAvailabilityRefresh((prev) => prev + 1);

        } finally {
            setIsSubmitting(false);
        }
    };

    // Mengambil detail lapangan dari API
    useEffect(() => {
        const fetchCourtDetail = async () => {
            try {
                setLoading(true);
                setErrorMessage('');

                const response = await api.get(`/courts/${id}`);

                setCourt(response.data.data);
            } catch (error) {
                console.error('Error fetching court detail:', error);

                setErrorMessage(
                    error.response?.data?.message ||
                    'Gagal mengambil detail lapangan.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCourtDetail();
    }, [id]);

    // Mengambil data ketersediaan lapangan dari API
    useEffect(() => {
        if (!bookingDate) {
            setBookedSlots([]);
            setAvailabilityError('');
            setAvailabilityLoading(false);
            return;
        }

        let isActive = true;

        const fetchAvailability = async () => {
            try {
                setAvailabilityLoading(true);
                setAvailabilityError('');
                setBookedSlots([]);

                const response = await api.get(
                    `/courts/${id}/availability`,
                    {
                        params: {
                            date: bookingDate,
                        },
                    }
                );

                if (isActive) {
                    setBookedSlots(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching availability:', error);

                if (isActive) {
                    setAvailabilityError(
                        error.response?.data?.message ||
                        'Gagal mengambil jadwal ketersediaan lapangan.'
                    );
                }
            } finally {
                if (isActive) {
                    setAvailabilityLoading(false);
                }
            }
        };

        fetchAvailability();

        // Mencegah respons request lama mengubah data terbaru
        return () => {
            isActive = false;
        };
    }, [id, bookingDate, availabilityRefresh]);

    return (
        <CustomerLayout>
            {/* Tombol kembali */}
            <button
                onClick={() => navigate(`/customer/courts/${id}`)}
                className="inline-flex items-center gap-2 px-4 py-2.5 mb-6 bg-surface border border-border rounded-control text-sm font-semibold text-foreground hover:bg-surface-elevated hover:border-accent hover:text-accent transition-all duration-200"
            >
                Kembali
            </button>

            {/* Page heading */}
            <div className="mb-8">
                <h1 className="font-heading text-2xl font-bold text-foreground">
                    Booking Lapangan
                </h1>

                <p className="mt-2 text-muted">
                    Lengkapi informasi untuk melakukan pemesanan lapangan.
                </p>
            </div>

            {/* Loading detail lapangan */}
            {loading && (
                <p className="text-sm text-muted">
                    Memuat detail lapangan...
                </p>
            )}

            {/* Error detail lapangan */}
            {!loading && errorMessage && (
                <p className="text-sm text-red-500">
                    {errorMessage}
                </p>
            )}

            {/* Informasi court */}
            {!loading && !errorMessage && court && (
                <div className="bg-surface border border-border rounded-card p-6 max-w-3xl">
                    <h2 className="font-heading text-xl font-bold text-foreground">
                        {court.name}
                    </h2>

                    <p className="text-muted mt-2">
                        {court.description || 'Belum ada deskripsi lapangan.'}
                    </p>

                    <div className="mt-5 bg-surface-elevated rounded-control p-4">
                        <p className="text-sm text-muted">
                            Harga Sewa
                        </p>

                        <p className="font-heading text-2xl font-bold text-accent mt-1">
                            Rp{Number(court.price_per_hour).toLocaleString('id-ID')}

                            <span className="text-sm font-normal text-muted">
                                {' '} / jam
                            </span>
                        </p>
                    </div>
                </div>
            )}

            {/* Input tanggal booking */}
            {!loading && !errorMessage && court && (
                <div className="bg-surface border border-border rounded-card p-6 max-w-3xl mt-6">
                    <label className="block text-sm font-semibold text-foreground mb-2">
                        Tanggal Booking
                    </label>

                    <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => {
                            setBookingDate(e.target.value);
                            setStartTime('');
                            setBookingError('');
                            setBookingSuccess('');
                            setAvailabilityError('');
                        }}
                        min={(() => {
                            const today = new Date();

                            return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                        })()}
                        className="w-full px-4 py-3 bg-background border border-border rounded-control text-foreground focus:outline-none focus:border-accent"
                    />

                    <p className="text-xs text-muted mt-2">
                        Pilih tanggal untuk melakukan pemesanan lapangan.
                    </p>
                </div>
            )}

            {/* Tampilan pilihan jam */}
            {!loading && !errorMessage && court && bookingDate && (
                <div className="bg-surface border border-border rounded-card p-6 max-w-3xl mt-6">
                    <h2 className="font-heading text-lg font-bold text-foreground">
                        Pilih Jam Booking
                    </h2>

                    <p className="text-sm text-muted mt-2 mb-5">
                        Pilih jam yang masih tersedia untuk melakukan pemesanan.
                    </p>

                    {/* Loading availability */}
                    {availabilityLoading && (
                        <p className="text-sm text-muted">
                            Memuat ketersediaan jam...
                        </p>
                    )}

                    {/* Error availability */}
                    {availabilityError && (
                        <p className="text-sm text-red-500">
                            {availabilityError}
                        </p>
                    )}

                    {/* Daftar pilihan jam */}
                    {!availabilityLoading && !availabilityError && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {timeSlots.map((slot) => {
                                const booked = isSlotBooked(slot);
                                const past = isSlotPast(slot);
                                const disabled = booked || past;

                                return (
                                    <button
                                        key={slot}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => {
                                            setStartTime(slot);
                                            setBookingError('');
                                            setBookingSuccess('');
                                        }}
                                        className={`px-3 py-3 rounded-control border text-sm font-semibold transition-all duration-200 ${
                                            disabled
                                                ? 'bg-surface-elevated border-border text-muted opacity-50 cursor-not-allowed'
                                                : startTime === slot
                                                    ? 'bg-accent border-accent text-white'
                                                    : 'bg-background border-border text-foreground hover:border-accent hover:text-accent'
                                        }`}
                                    >
                                        {slot}

                                        <span className="block text-xs font-normal mt-1">
                                            {booked
                                                ? 'Dipesan'
                                                : past
                                                    ? 'Terlewat'
                                                    : 'Tersedia'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Pesan booking berhasil */}
            {bookingSuccess && (
                <div className="max-w-3xl mt-6 p-4 bg-green-50 border border-green-200 rounded-control">
                    <p className="text-sm font-semibold text-green-700">
                        {bookingSuccess}
                    </p>
                </div>
            )}

            {/* Form konfirmasi booking */}
            {!loading && !errorMessage && court && bookingDate && startTime && (
                <div className="bg-surface border border-border rounded-card p-6 max-w-3xl mt-6">
                    <h2 className="font-heading text-lg font-bold text-foreground">
                        Konfirmasi Booking
                    </h2>

                    <p className="text-sm text-muted mt-2 mb-5">
                        Periksa detail booking sebelum melanjutkan.
                    </p>

                    {/* Ringkasan booking */}
                    <div className="bg-surface-elevated rounded-control p-4 space-y-3">
                        <div className="flex justify-between gap-4">
                            <span className="text-sm text-muted">
                                Lapangan
                            </span>

                            <span className="text-sm font-semibold text-foreground">
                                {court.name}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-sm text-muted">
                                Tanggal
                            </span>

                            <span className="text-sm font-semibold text-foreground">
                                {new Date(`${bookingDate}T00:00:00`).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-sm text-muted">
                                Jam
                            </span>

                            <span className="text-sm font-semibold text-foreground">
                                {startTime} - {`${String(Number(startTime.slice(0, 2)) + 1).padStart(2, '0')}:00`}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-sm text-muted">
                                Durasi
                            </span>

                            <span className="text-sm font-semibold text-foreground">
                                1 Jam
                            </span>
                        </div>

                        <div className="border-t border-border pt-3 flex justify-between gap-4">
                            <span className="text-sm font-semibold text-foreground">
                                Total Harga
                            </span>

                            <span className="text-lg font-bold text-accent">
                                Rp{Number(court.price_per_hour).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    {/* Catatan tambahan */}
                    <div className="mt-5">
                        <label className="block text-sm font-semibold text-foreground mb-2">
                            Catatan Tambahan (Opsional)
                        </label>

                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Tuliskan catatan jika ada..."
                            className="w-full px-4 py-3 bg-background border border-border rounded-control text-foreground focus:outline-none focus:border-accent resize-none"
                        />
                    </div>

                    {/* Pesan error booking */}
                    {bookingError && (
                        <p className="text-sm text-red-500 mt-4">
                            {bookingError}
                        </p>
                    )}

                    {/* Tombol konfirmasi */}
                    <button
                        type="button"
                        onClick={handleBooking}
                        disabled={
                            isSubmitting ||
                            availabilityLoading ||
                            Boolean(availabilityError) ||
                            isSlotBooked(startTime) ||
                            isSlotPast(startTime)
                        }
                        className="w-full mt-5 px-5 py-3 bg-accent text-white font-semibold rounded-control hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting
                            ? 'Memproses Booking...'
                            : 'Booking Sekarang'}
                    </button>
                </div>
            )}
        </CustomerLayout>
    );
}

export default BookingPage;
