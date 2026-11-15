import { Moon, Sun, LogOut, Menu } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

function AdminTopbar({ onMenuClick }) {
    const { theme, toggleTheme } = useTheme()
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        await logout()
        window.location.href = '/'
    }

    return (
        <header className="h-16 shrink-0 bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
                {/* Hamburger button */}
                <button
                    type='button'
                    onClick={onMenuClick}
                    aria-label='Buka menu'
                    className="shrink-0 rounded-control p-2 text-muted hover:bg-surface-elevated lg:hidden"
                >
                    <Menu size={22} />
                </button>

                {/* Greeting */}
                <h1 className="truncate font-heading font-semibold text-foreground">
                    Selamat datang, {user?.name || 'Admin'}
                </h1>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                {/* Theme */}
                <button
                    type='button'
                    onClick={toggleTheme}
                    className="p-2 rounded-control text-muted hover:bg-surface-elevated"
                    aria-label="Ganti tema"
                >
                    {theme == 'light' ? (
                        <Moon size={20} />
                    ) : (
                        <Sun size={20} />
                    )}
                </button>

                {/* Logout button */}
                <button
                    type='button'
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-control text-muted hover:bg-surface-elevated hover:text-danger"
                >
                    <LogOut size={18} />
                    <span className="hidden text-sm font-medium sm:inline">
                        Keluar
                    </span>
                </button>
            </div>
        </header>
    )
}

export default AdminTopbar