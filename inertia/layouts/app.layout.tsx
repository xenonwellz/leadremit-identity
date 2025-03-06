import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-col w-full">
                <header className="w-full p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="p-0 border w-10 h-10" />
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* User profile/settings dropdown can go here */}
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    </div>
                </header>
                <main className="w-full p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col gap-6">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
