import { Head } from '@inertiajs/react';
import { Users, TrendingUp, Search, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const userGrowthData = [
    { name: 'Jan', users: 4000 },
    { name: 'Feb', users: 3000 },
    { name: 'Mar', users: 5000 },
    { name: 'Apr', users: 4500 },
    { name: 'May', users: 6000 },
    { name: 'Jun', users: 8000 },
];

const searchData = [
    { name: 'Lipitor', searches: 400 },
    { name: 'Synthroid', searches: 300 },
    { name: 'Prinivil', searches: 300 },
    { name: 'Glucophage', searches: 200 },
    { name: 'Zoloft', searches: 278 },
];

export default function AdminStatistics({ stats }: any) {
    return (
        <>
            <Head title="Platform Statistics" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Platform Statistics</h1>
                    <p className="text-muted-foreground mt-1">Key metrics and overall platform performance over time.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                            <h3 className="text-2xl font-bold">{stats?.totalUsers?.toLocaleString() || 0}</h3>
                            <p className="text-xs text-emerald-600 font-medium mt-1 dark:text-emerald-400">{stats?.recentUsers?.toLocaleString() || 0} recent signups</p>
                        </div>
                    </div>

                    <div className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Est. Savings Found</p>
                            <h3 className="text-2xl font-bold">${(stats?.estSavings || 1200000).toLocaleString()}</h3>
                            <p className="text-xs text-emerald-600 font-medium mt-1 dark:text-emerald-400">+8% from last month</p>
                        </div>
                    </div>

                    <div className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Search className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pharmacy Lookups</p>
                            <h3 className="text-2xl font-bold">{(stats?.totalLookups || 142000).toLocaleString()}</h3>
                            <p className="text-xs text-amber-600 font-medium mt-1 dark:text-amber-400">Steady traffic</p>
                        </div>
                    </div>

                    <div className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center shrink-0">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                            <h3 className="text-2xl font-bold">${(stats?.totalRevenue || 45231).toLocaleString()}</h3>
                            <p className="text-xs text-emerald-600 font-medium mt-1 dark:text-emerald-400">+24% from last month</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm">
                        <h3 className="text-lg font-semibold mb-6">Monthly User Growth</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={userGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }}
                                    />
                                    <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm">
                        <h3 className="text-lg font-semibold mb-6">Top Searched Medications</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={searchData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <Tooltip 
                                        cursor={{ fill: 'hsl(var(--muted))' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }}
                                    />
                                    <Bar dataKey="searches" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminStatistics.layout = {
    breadcrumbs: [
        {
            title: 'Platform Statistics',
            href: '/admin/statistics',
        },
    ],
};
