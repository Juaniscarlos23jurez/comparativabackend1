import { Head } from '@inertiajs/react';
import { ShieldAlert, UserPlus, FileEdit, Settings, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const activities = [
    {
        id: 1,
        type: 'security',
        title: 'Failed login attempt',
        description: 'Multiple failed login attempts from IP 192.168.1.104',
        time: '10 minutes ago',
        icon: ShieldAlert,
        color: 'text-red-600',
        bg: 'bg-red-100',
    },
    {
        id: 2,
        type: 'user',
        title: 'New user registration',
        description: 'diana@example.com created a new account.',
        time: '2 hours ago',
        icon: UserPlus,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100',
    },
    {
        id: 3,
        type: 'system',
        title: 'System update completed',
        description: 'API integration endpoints updated successfully.',
        time: '5 hours ago',
        icon: Settings,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
    },
    {
        id: 4,
        type: 'billing',
        title: 'Subscription upgraded',
        description: 'alice@example.com upgraded to MedPrice+ plan.',
        time: '1 day ago',
        icon: CreditCard,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
    },
    {
        id: 5,
        type: 'content',
        title: 'Medication database updated',
        description: 'Synced 450 new prices from NeedyMeds API.',
        time: '1 day ago',
        icon: FileEdit,
        color: 'text-amber-600',
        bg: 'bg-amber-100',
    },
];

export default function AdminActivity() {
    return (
        <>
            <Head title="System Activity" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">System Activity Logs</h1>
                    <p className="text-muted-foreground mt-1">Monitor recent events, security alerts, and platform usage.</p>
                </div>

                <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-semibold text-foreground">Recent Events</h2>
                        <div className="flex gap-2">
                            <Badge variant="secondary" className="cursor-pointer">All</Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-muted">Security</Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-muted">Users</Badge>
                        </div>
                    </div>

                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border">
                        {activities.map((activity) => {
                            const Icon = activity.icon;

                            return (
                                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    {/* Icon */}
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background ${activity.bg} ${activity.color} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    
                                    {/* Card */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-2">
                                            <h3 className="font-semibold text-foreground">{activity.title}</h3>
                                            <time className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md shrink-0">
                                                {activity.time}
                                            </time>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {activity.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

AdminActivity.layout = {
    breadcrumbs: [
        {
            title: 'System Activity',
            href: '/admin/activity',
        },
    ],
};
