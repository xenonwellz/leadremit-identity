import {
    Coins,
    FileText,
    Home,
    LogOut,
    Settings,
    ShieldCheck,
    Users,
    UserCog,
    Sliders,
} from 'lucide-react'
import { Link, usePage } from '@inertiajs/react'
import { adminRoutes } from '#shared/routes'

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
        url: adminRoutes.app.dashboard,
        icon: Home,
    },
    {
        title: 'Users',
        url: adminRoutes.app.users,
        icon: Users,
    },
    {
        title: 'Verifications',
        url: adminRoutes.app.verifications,
        icon: ShieldCheck,
    },
    {
        title: 'Verification Settings',
        url: adminRoutes.app.verificationSettings,
        icon: Sliders,
    },
    {
        title: 'Transactions',
        url: adminRoutes.app.transactions,
        icon: Coins,
    },
    {
        title: 'Administrators',
        url: adminRoutes.app.admins,
        icon: UserCog,
    },
    {
        title: 'Settings',
        url: adminRoutes.app.settings,
        icon: Settings,
    },
]

export function AdminSidebar() {
    const { url } = usePage()

    return (
        <Sidebar>
            {/* Add logo header */}
            <SidebarHeader className="p-2 py-6 border-b">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-semibold">Admin Panel</span>
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
                <form action={adminRoutes.app.logout} method="POST">
                    <input type="hidden" name="_method" value="DELETE" />
                    <SidebarMenuButton asChild className="transition-colors py-4 h-12 w-full">
                        <Button type="submit" variant="ghost" className="w-full justify-start">
                            <LogOut />
                            <span>Logout</span>
                        </Button>
                    </SidebarMenuButton>
                </form>
            </SidebarFooter>
        </Sidebar>
    )
}
