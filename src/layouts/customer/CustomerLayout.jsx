import { useState } from 'react'
import CustomerSidebar from './CustomerSidebar'
import CustomerTopbar from './CustomerTopbar'

function CustomerLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <CustomerSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <CustomerTopbar
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="w-full min-w-0 flex-1 p-4 sm:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default CustomerLayout