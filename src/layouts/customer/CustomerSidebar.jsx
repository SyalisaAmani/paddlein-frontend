import {
  LayoutDashboard,
  CalendarDays,
  User,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

function CustomerSidebar({ isOpen, onClose }) {
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/customer/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Daftar Lapangan',
      path: '/customer/courts',
      icon: CalendarDays,
    },
    {
      name: 'Booking Saya',
      path: '/customer/bookings',
      icon: CalendarDays,
    },
    {
      name: 'Profil',
      path: '/customer/profile',
      icon: User,
    },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64 min-h-screen bg-surface border-r border-border p-5
          transition-transform duration-300
          lg:sticky lg:top-0 lg:block lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Paddle.In
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="rounded-lg p-2 text-muted hover:bg-surface-elevated lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/customer/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-control transition-colors ${
                    isActive
                      ? 'bg-accent text-accent-foreground font-semibold'
                      : 'text-muted hover:bg-surface-elevated hover:text-foreground'
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default CustomerSidebar