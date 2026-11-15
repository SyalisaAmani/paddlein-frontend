
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { registerUser } from '../../services/AuthService'

function RegisterPage() {
  // Input state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  // Validation state
  const [errorMessage, setErrorMessage] = useState('')

  // Loading state
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setSuccessMessage('')

    // Validasi input kosong
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !passwordConfirmation.trim()
    ) {
      setErrorMessage('Semua kolom wajib diisi.')
      return
    }

    // Validasi format email
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Format email tidak valid.')
      return
    }

    // Validasi panjang password
    if (password.length < 8) {
      setErrorMessage('Password minimal 8 karakter.')
      return
    }

    // Validasi konfirmasi password
    if (password !== passwordConfirmation) {
      setErrorMessage('Konfirmasi password tidak cocok.')
      return
    }

    try {
      setIsLoading(true)

      const response = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      })

      console.log('Register berhasil:', response)

      setSuccessMessage(
        'Pendaftaran berhasil! Silakan masuk ke akun Anda.'
      )
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        'Pendaftaran gagal. Silakan coba lagi.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-card border border-border bg-surface p-8 shadow-lg">

        <h1 className="font-heading text-3xl font-bold text-foreground">
          Buat Akun
        </h1>

        <p className="mt-2 text-sm text-muted">
          Daftar untuk mulai booking lapangan.
        </p>

        {/* Form Register Customer */}
        <form
          className="mt-6 space-y-5"
          onSubmit={handleSubmit}
        >

          {/* Input Nama */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Nama Lengkap
            </label>

            <input
              type="text"
              id="name"
              placeholder="Masukkan nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-control border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
            />
          </div>

          {/* Input Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-control border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
            />
          </div>

          {/* Input Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              placeholder="Buat password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-control border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
            />
          </div>

          {/* Input Konfirmasi Password */}
          <div>
            <label
              htmlFor="password_confirmation"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Konfirmasi Password
            </label>

            <input
              type="password"
              id="password_confirmation"
              placeholder="Ulangi password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full rounded-control border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
            />
          </div>

          {/* Pesan Error */}
          {errorMessage && (
            <p className="text-sm text-danger">
              {errorMessage}
            </p>
          )}

          {/* Pesan Sukses */}
          {successMessage && (
            <p className="text-sm text-success">
              {successMessage}
            </p>
          )}

          {/* Tombol Daftar */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-control bg-accent px-4 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="font-semibold text-accent hover:text-accent-hover"
          >
            Masuk sekarang!
          </Link>
        </p>

      </div>
    </main>
  )
}

export default RegisterPage