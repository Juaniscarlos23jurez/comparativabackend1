import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Bell, HelpCircle, Sparkles, User, CreditCard, Users, BarChart, Activity, FileText } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'My Alarms',
        href: '/alarms',
        icon: Bell,
    },
    {
        title: 'Savings Optimizer',
        href: '/optimizer',
        icon: Sparkles,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard Overview',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'User Management',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Platform Statistics',
        href: '/admin/statistics',
        icon: BarChart,
    },
    {
        title: 'System Activity',
        href: '/admin/activity',
        icon: Activity,
    },
    {
        title: 'Reports',
        href: '/admin/reports',
        icon: FileText,
    },
];

const settingsNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/settings/profile',
        icon: User,
    },
    {
        title: 'Billing',
        href: '/settings/billing',
        icon: CreditCard,
    },
];

const footerNavItems: NavItem[] = [

    {
        title: 'Help & Support',
        href: '#',
        icon: HelpCircle,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const isSuperAdmin = auth?.user?.role === 'super_admin';

    const activeNavItems = isSuperAdmin ? adminNavItems : mainNavItems;
    const navLabel = isSuperAdmin ? "Administration" : "Platform";

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={activeNavItems} label={navLabel} />
                <NavMain items={settingsNavItems} label="Settings" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
