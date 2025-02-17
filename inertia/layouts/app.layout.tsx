import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full p-10 flex flex-col gap-6">
                <SidebarTrigger className="md:hidden" />
                {children}
            </main>
        </SidebarProvider>
    )
}
