import { Coins, FileText, Home, LogOut, Settings, ShieldCheck } from 'lucide-react'
import { Link, usePage } from '@inertiajs/react'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

// Menu items with their corresponding routes
const items = [
    {
        title: 'Dashboard',
        url: '/',
        icon: Home,
    },
    {
        title: 'Verify',
        url: '/verify',
        icon: ShieldCheck,
    },
    {
        title: 'Tokens',
        url: '/tokens',
        icon: Coins,
    },
    {
        title: 'History',
        url: '/history',
        icon: FileText,
    },
    {
        title: 'Settings',
        url: '/settings',
        icon: Settings,
    },
]

export function AppSidebar() {
    const { url } = usePage()

    return (
        <Sidebar>
            {/* Add logo header */}
            <SidebarHeader className="p-2 py-6 border-b">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-semibold">VerifyNG</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive =
                                    url.startsWith(item.url) &&
                                    (item.url === '/' ? url === '/' : true)
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={`transition-colors py-4 h-12 ${
                                                isActive
                                                    ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                                                    : ''
                                            }`}
                                        >
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Add logout button at the bottom */}
            <SidebarFooter className="mt-auto border-t border-sidebar-border p-2">
                <SidebarMenuButton
                    asChild
                    className="transition-colors py-4 h-12 w-full"
                    onClick={() => (window.location.href = '/logout')}
                >
                    <Button variant="ghost" className="w-full justify-start">
                        <LogOut />
                        <span>Logout</span>
                    </Button>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    )
}
