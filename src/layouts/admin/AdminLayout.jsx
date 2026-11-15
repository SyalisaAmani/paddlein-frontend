import { useState } from "react";
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

function AdminLayout ({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen w-full overflow-x-hidden bg-background text-foreground">
            <AdminSidebar isOpen = {isSidebarOpen}
                onClose = {() => setIsSidebarOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
                <AdminTopbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="w-full min-w-0 flex-1 p-4 sm:p-5 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AdminLayout