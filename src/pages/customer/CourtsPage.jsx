import { useEffect, useState } from "react";
import CustomerLayout from "../../layouts/customer/CustomerLayout";
import api from "../../services/api";
import { Link } from 'react-router-dom';

function CourtsPage() {
    const [courts, setCourts] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    // Fetch data dari API
    useEffect(() => {
        const fetchCourts = async () => {
            try {
                setLoading(true)
                setErrorMessage('')

                const response = await api.get('/courts')

                setCourts(response.data.data)
            } catch (error) {
                console.error('Error fetching courts:', error)

                setErrorMessage(
                    error.response?.data?.message || 'Gagal mengambil data lapangan.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchCourts()
    }, [])

    return (
        <CustomerLayout>
            <div className="mb-8">
                <h1 className="font-heading text-2xl font-bold text-foreground">
                    Daftar Lapangan
                </h1>

                <p className="mt-2 text-muted">
                    Pilih lapangan untuk memulai booking.
                </p>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="text-center py-10 text-muted">
                    Memuat data lapangan...
                </div>
            )}

            {/* Error state */}
            {!loading && errorMessage && (
                <div className="bg-surface border border-danger rounded-card p-5 text-center">
                    <p className="text-danger">
                        {errorMessage}
                    </p>
                </div>
            )}

            {/* Menampilkan data lapangan dari API backend */}

            {!loading && !errorMessage && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {courts.map((court) => (
                        <div
                            key={court.id}
                            className="group relative flex h-full flex-col rounded-card border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="relative mb-5 pt-2 pr-2">
                                {/* Decorative background */}
                                <div className="absolute right-0 top-0 h-44 w-4/5 rounded-2xl bg-accent/15 rotate-3 transition-transform duration-500 group-hover:rotate-6" />

                                {/* Court image */}
                                <img
                                    src={court.image}
                                    alt={court.name}
                                    onError={(e) => {
                                        e.target.style.display = 'none'
                                    }}
                                    className="relative z-10 h-52 w-full rounded-2xl object-cover shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
                                />

                                {/* Status badge */}
                                <span className="absolute right-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm backdrop-blur-md">
                                    {court.is_active ? 'Aktif' : 'Tidak Aktif'}
                                </span>

                            </div>

                            <h2 className="min-h-7 font-heading text-lg font-bold text-foreground">
                                {court.name}
                            </h2>
                            
                            <p className="mt-2 min-h-18 line-clamp-3 text-sm leading-6 text-muted">
                                {court.description || "Tidak ada deskripsi tersedia."}
                            </p>

                            <p className="mt-auto pt-4 font-heading font-bold text-accent">
                                Rp{Number(court.price_per_hour).toLocaleString('id-ID')} / jam
                            </p>

                            {/* Detail button */}
                            <Link
                                to={`/customer/courts/${court.id}`}
                                className="block w-full text-center mt-5 px-4 py-3 bg-accent hover:bg-accent-hover text-accent-foreground font-semibold rounded-control transition-colors duration-200"
                            >
                                Detail lapangan
                            </Link>
                        </div>
                    ))}
                </div>
            )}

        {/* Empty state */}
        {!loading && !errorMessage && courts.length === 0 && (
            <div className="bg-surface border border-border rounded-card p-8 text-center">
                <h3 className="font-heading font-semibold text-foreground">
                    Belum ada lapangan
                </h3>

                <p className="text-sm text-muted mt-2">
                    Saat ini belum ada lapangan yang tersedia.
                </p>
            </div>
        )}
        </CustomerLayout>
    )
}

export default CourtsPage