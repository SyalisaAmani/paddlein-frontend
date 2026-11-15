import CustomerLayout from "../../layouts/customer/CustomerLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

function CourtDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [court, setCourt] = useState(null)
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const fetchCourtDetail = async () => {
            try {
                setLoading(true)
                setErrorMessage('')

                const response = await api.get(`/courts/${id}`)

                setCourt(response.data.data)
            } catch (error) {
                console.error('Error catching court detail:', error)

                setErrorMessage(
                    error.response?.data?.message || 'Gagal mengambil detail lapangan.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchCourtDetail()
    }, [id])

    return (
        <CustomerLayout>
            <button 
            onClick={() => navigate('/customer/courts')}
            className="inline-flex items-center gap-2 px-4 py-2.5 mb-6 bg-surface border border-border rounded-control text-sm font-semibold text-foreground hover:bg-surface-elevated hover:border-accent hover:text-accent transition-all duration-200"
            >
                Kembali
            </button>

            <div className="mb-8">
                <h1 className="font-heading text-2xl font-bold text-foreground">
                    Detail Lapangan
                </h1>

                <p className="mt-2 text-muted">
                    Informasi lengkap mengenai lapangan yang kamu pilih.
                </p>

                <p className="mt-4 text-muted">
                    ID Lapangan : {id}
                </p>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="text-center py-10 text-muted">
                    Memuat detail lapangan...
                </div>
            )}

            {/* Error state */}
            {!loading && errorMessage && (
                <div className="bg-surface border border-danger rounded-card p-5 text-center">
                    <p className="text-danger">{errorMessage}</p>
                </div>
            )}

            {/* Court detail */}
            {!loading && !errorMessage && court && (
                <div className="bg-surface border border-border rounded-card p-6 max-w-3xl">
                    <img
                        src={court.image}
                        alt={court.name}
                        onError={(e) => {
                            e.target.style.display = 'none'
                        }}
                        className="w-full h-64 object-cover rounded-xl"
                    />
                    <div className="flex flex-col gap-5">
                        {/* Nama court */}
                        <div>
                            <h2 className="font-heading text-2xl font-bold text-foreground">
                                {court.name}
                            </h2>

                            {/* Status court */}
                            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                                court.is_active ? 'bg-success/5 text-success' : 'bg-danger/5 text-danger'
                            }`}>
                                {court.is_active ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                        </div>

                        {/* Deskripsi court */}
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">
                                Deskripsi Lapangan
                            </h3>

                            <p className="text-muted leading-relaxed">
                                {court.description || 'Belum ada deskripsi lapangan.'}
                            </p>
                        </div>

                        {/* Harga court */}
                        <div className="bg-surface-elevated rounded-control p-5">
                            <p className="text-sm text-muted">
                                Harga Sewa
                            </p>

                            <p className="font-heading text-2xl font-bold text-accent mt-1">
                                Rp{Number(court.price_per_hour).toLocaleString('id-ID')}
                                <span className="text-sm font-normal text-muted">
                                     / jam
                                </span>
                            </p>
                        </div>

                        {/* Booking court */}
                        <button
                            onClick={() => navigate(`/customer/courts/${id}/book`)}
                            disabled={!court.is_active}
                            className="w-full bg-accent hover:bg-accent-hover text-accent-foreground font-semibold py-3 rounded-control transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Booking sekarang!
                        </button>
                    </div>
                </div>
            )}
        </CustomerLayout>
    )
}

export default CourtDetailPage