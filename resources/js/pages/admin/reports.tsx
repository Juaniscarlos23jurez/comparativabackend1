import { Head } from '@inertiajs/react';
import { FileText, Download, Calendar, PieChart, Users, DollarSign, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

const reports = [
    {
        id: 1,
        title: 'Monthly Financial Summary',
        description: 'Comprehensive overview of platform revenue, subscription upgrades, and estimated user savings.',
        icon: DollarSign,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100',
        date: 'Last 30 Days',
        size: '2.4 MB',
    },
    {
        id: 2,
        title: 'User Engagement Report',
        description: 'Detailed metrics on user logins, onboarding completion rates, and average session times.',
        icon: Users,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
        date: 'Last 30 Days',
        size: '1.8 MB',
    },
    {
        id: 3,
        title: 'Pharmacy Search Analytics',
        description: 'Analysis of the most searched medications, geographic distribution of searches, and API hit rates.',
        icon: PieChart,
        color: 'text-amber-600',
        bg: 'bg-amber-100',
        date: 'All Time',
        size: '4.1 MB',
    },
    {
        id: 4,
        title: 'System Health & Logs',
        description: 'Export of critical system errors, integration uptime, and general performance metrics.',
        icon: Activity,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
        date: 'Last 7 Days',
        size: '8.2 MB',
        lastGenerated: 'Oct 27, 2023',
    },
];

export default function AdminReports() {
    return (
        <>
            <Head title="System Reports" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">System Reports</h1>
                        <p className="text-muted-foreground mt-1">Generate and download comprehensive platform reports.</p>
                    </div>
                    <Button className="gap-2">
                        <Download className="w-4 h-4" /> Export All
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {reports.map((report) => {
                        const Icon = report.icon;
                        return (
                            <div key={report.id} className="bg-card text-card-foreground rounded-xl border border-border shadow-sm flex flex-col hover:shadow-md transition-all group">
                                <div className="p-6 border-b border-border flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl border-4 border-card ${report.bg} ${report.color} flex items-center justify-center shrink-0`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{report.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-muted/30 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="w-3.5 h-3.5" />
                                        Last generated: {report.lastGenerated}
                                    </div>
                                    <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/10">
                                        Generate <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

AdminReports.layout = {
    breadcrumbs: [
        {
            title: 'Reports',
            href: '/admin/reports',
        },
    ],
};
