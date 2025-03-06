import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/admin-sidebar'
// import { Toaster } from '@/components/ui/sonner'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            {/* <Toaster richColors /> */}
            <AdminSidebar />
            <main className="w-full p-10 flex flex-col gap-6">
                <SidebarTrigger className="lg:hidden p-0 border w-10 h-10" />
                {children}
            </main>
        </SidebarProvider>
    )
}
