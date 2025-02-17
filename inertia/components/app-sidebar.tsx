import { Coins, FileText, Home, Settings, ShieldCheck } from 'lucide-react'
import { Link, usePage } from '@inertiajs/react'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

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
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = url === item.url
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
        </Sidebar>
    )
}
