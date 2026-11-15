import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "../../services/AuthService"
import { useAuth } from "../../context/AuthContext"

function LoginPage() {

    // Input state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { setUser } = useAuth()

    // Validation form state
    const [errorMessage, setErrorMessage] = useState('')

    // Loading state
    const [isLoading, setIsLoading] = useState(false)

    // Handle submit fucntion
    const handleSubmit = async (e) => {
        e.preventDefault()

        setErrorMessage('')

        if (email.trim() === '' || password.trim() === '') {
            setErrorMessage('Email dan Password wajib diisi.')
            return
        }

        // Email format validation
        if (!email.includes('@') || !email.includes('.')) {
            setErrorMessage('Format email tidak valid.')
            return
        }

        try {
            setIsLoading(true)

            const response = await loginUser({
                email: email.trim(),
                password
            })

            // Menyimpan token autentikasi
            localStorage.setItem('paddle-token', response.data.token)

            // Menyimpan informasi user
            localStorage.setItem(
                'paddle-user',
                JSON.stringify(response.data.user)
            )

            // Navigasi role admin dan customer
            const user = response.data.user
            setUser(user)

            if (user.role === 'admin') {
            navigate('/admin/dashboard')
            } else {
            navigate('/customer/dashboard')
            }
            
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || 'Login gagal. Periksa email dan password.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-md rounded-card border border-border bg-surface p-8 shadow-lg">

                {/* Greeting Login */}
                <div className="mb-8 text-center">
                    <h1 className="font-heading text-3xl font-bold text-foreground">
                        Selamat Datang!
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        Masuk ke akun Paddle Booking Court
                    </p>
                </div>

                {/* Form login */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                            Email
                        </label>

                        <input 
                            type="email"
                            id="email"
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-control border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
                        />
                    </div>

                    <div>
                        <label htmlFor="password"
                        className="mb-2 block text-sm font-medium text-foreground">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-control border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
                        />
                    </div>

                    {/* Validation Message */}
                    {errorMessage && (
                        <p className="text-sm text-danger">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-control bg-accent px-4 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>

                {/* Register */}
                <p className="mt-6 text-center text-sm text-muted">
                    Belum punya akun? {' '}
                    <Link
                    to="/register"
                    className="font-semibold text-accent hover:text-accent-hover"
                    >
                        Daftar sekarang!
                    </Link>
                </p>

            </div>
        </main>
    )
}

export default LoginPage