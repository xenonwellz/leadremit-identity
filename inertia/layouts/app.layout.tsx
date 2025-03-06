import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { ShieldCheck } from 'lucide-react'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-col w-full">
                <header className="w-full p-4 border-b flex items-center justify-between sticky top-0 bg-background">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 sm:hidden">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-semibold">VerifyNG</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* User profile/settings dropdown can go here */}
                        <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gray-200"></div>
                        <SidebarTrigger className="p-0 border w-10 h-10 sm:hidden flex" />
                    </div>
                </header>
                <main className="w-full p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col gap-6">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
