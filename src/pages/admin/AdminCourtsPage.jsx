
import { useCallback, useEffect, useState } from 'react'
import { Plus, MapPin, RefreshCw, X, Pencil } from 'lucide-react'
import AdminLayout from '../../layouts/admin/AdminLayout'
import api from '../../services/api'

function AdminCourtsPage() {
    const [courts, setCourts] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCourt, setSelectedCourt] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        price_per_hour: '',
        is_active: true,
    })

    // Mengambil data lapangan dari API
    const fetchCourts = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true)
                setErrorMessage('')
            }

            const response = await api.get('/admin/courts')

            setCourts(response.data.data || [])
            setErrorMessage('')
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                'Gagal memuat data lapangan.'
            )
        } finally {
            setLoading(false)
        }
    }, [])

    // Mengambil data ketika halaman pertama kali dibuka
    useEffect(() => {
        fetchCourts(false)
    }, [fetchCourts])

    // Format harga menjadi Rupiah
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price)
    }

    // Menangani perubahan input form
    const handleInputChange = (event) => {
        const { name, value } = event.target

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }))
    }

    // Mengembalikan form ke kondisi awal
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            image: '',
            price_per_hour: '',
            is_active: true,
        })

        setSelectedCourt(null)
        setFormError('')
    }

    // Menutup modal
    const handleCloseModal = () => {
        if (isSubmitting) return

        setIsModalOpen(false)
        resetForm()
    }

    // Mengedit data lapangan
    const handleEdit = (court) => {
        setSelectedCourt(court)

        setFormData({
            name: court.name,
            description: court.description || '',
            image: court.image || '',
            price_per_hour: String(court.price_per_hour),
            is_active: Boolean(court.is_active)
        })

        setFormError('')
        setIsModalOpen(true)
    }

    // Menambahkan atau mengubah data lapangan
const handleSubmit = async (event) => {
    event.preventDefault()

    const isEditing = selectedCourt !== null

    try {
        setIsSubmitting(true)
        setFormError('')

        const payload = {
            ...formData,
            price_per_hour: Number(formData.price_per_hour),
        }

        if (isEditing) {
            await api.patch(`/courts/${selectedCourt.id}`, payload)
        } else {
            await api.post('/courts', payload)
        }

            setIsModalOpen(false)
            resetForm()

            await fetchCourts()
        } catch (error) {
            const validationErrors = error.response?.data?.errors

            if (validationErrors) {
                setFormError(
                    Object.values(validationErrors).flat().join(' ')
                )
            } else {
                setFormError(
                    error.response?.data?.message ||
                    (isEditing
                        ? 'Gagal memperbarui data lapangan.'
                        : 'Gagal menambahkan lapangan.')
                )
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-foreground">
                            Manajemen Lapangan
                        </h1>
                        <p className="mt-1 text-sm text-muted">
                            Kelola informasi dan ketersediaan lapangan.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            resetForm()
                            setIsModalOpen(true)
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-control bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
                    >
                        <Plus size={18} />
                        Tambah Lapangan
                    </button>
                </div>

                {/* Court Count */}
                <div className="rounded-card border border-border bg-surface p-5">
                    <p className="text-sm text-muted">
                        Total Seluruh Lapangan
                    </p>
                    <p className="mt-2 font-heading text-3xl font-bold text-foreground">
                        {courts.length}
                    </p>
                </div>

                {/* Court List */}
                <div className="rounded-card border border-border bg-surface">
                    <div className="flex items-center justify-between border-b border-border p-5">
                        <h2 className="font-heading font-semibold text-foreground">
                            Daftar Lapangan
                        </h2>

                        <button
                            type="button"
                            onClick={() => fetchCourts()}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-control border border-border px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-elevated disabled:opacity-50"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-sm text-muted">
                            Memuat data lapangan...
                        </div>
                    ) : errorMessage ? (
                        <div className="p-10 text-center">
                            <p className="text-sm text-red-500">
                                {errorMessage}
                            </p>
                            <button
                                type="button"
                                onClick={() => fetchCourts()}
                                className="mt-4 rounded-control bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    ) : courts.length === 0 ? (
                        <div className="p-10 text-center">
                            <MapPin size={32} className="mx-auto text-muted" />
                            <p className="mt-3 font-medium text-foreground">
                                Belum ada data lapangan
                            </p>
                            <p className="mt-1 text-sm text-muted">
                                Tambahkan lapangan untuk mulai mengelola data.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-162.5 text-left">
                                <thead className="bg-surface-elevated text-xs uppercase text-muted">
                                    <tr>
                                        <th className="px-5 py-4">Nama Lapangan</th>
                                        <th className="px-5 py-4">Deskripsi</th>
                                        <th className="px-5 py-4">Harga / Jam</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Aksi</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {courts.map((court) => (
                                        <tr key={court.id}>
                                            <td className="px-5 py-4 font-medium text-foreground">
                                                {court.name}
                                            </td>
                                            <td className="max-w-xs px-5 py-4 text-sm text-muted">
                                                {court.description || '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-foreground">
                                                {formatPrice(court.price_per_hour)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        court.is_active
                                                            ? 'bg-green-500/10 text-green-600'
                                                            : 'bg-red-500/10 text-red-600'
                                                    }`}
                                                >
                                                    {court.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <button 
                                                type="button"
                                                onClick={() => handleEdit(court)}
                                                title="Edit lapangan"
                                                aria-label={`Edit ${court.name}`}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-maroon-500/10 text-maroon-600 transition-colors hover:bg-amber-500 hover:text-white"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Court Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-card border border-border bg-surface shadow-xl">

                        <div className="flex items-center justify-between border-b border-border p-5">
                            <div>
                                <h2 className="font-heading text-lg font-bold text-foreground">
                                    Tambah Lapangan
                                </h2>
                                <p className="mt-1 text-sm text-muted">
                                    Lengkapi informasi lapangan baru.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleCloseModal}
                                disabled={isSubmitting}
                                className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-elevated"
                                aria-label="Tutup modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 p-5">

                            {formError && (
                                <div className="rounded-control bg-red-500/10 p-3 text-sm text-red-500">
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Nama Lapangan
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={255}
                                    placeholder="Contoh: Court 4"
                                    className="w-full rounded-control border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Deskripsi
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    maxLength={1000}
                                    rows={3}
                                    placeholder="Deskripsi lapangan (opsional)"
                                    className="w-full rounded-control border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    URL Gambar
                                </label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full rounded-control border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Harga per Jam (Rp)
                                </label>
                                <input
                                    type="number"
                                    name="price_per_hour"
                                    value={formData.price_per_hour}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    step="1"
                                    placeholder="150000"
                                    className="w-full rounded-control border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
                                />
                            </div>

                            <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(event) =>
                                        setFormData((previous) => ({
                                            ...previous,
                                            is_active: event.target.checked,
                                        }))
                                    }
                                    className="h-4 w-4 accent-orange-500"
                                />
                                Aktifkan lapangan
                            </label>

                            <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={isSubmitting}
                                    className="rounded-control border border-border px-4 py-3 text-sm font-semibold text-muted hover:bg-surface-elevated disabled:opacity-50"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-control bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan Lapangan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default AdminCourtsPage