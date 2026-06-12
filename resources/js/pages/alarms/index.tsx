import { Head, usePage } from '@inertiajs/react';
import { Bell, Trash2, Mail, Pill, Clock, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Alarm = {
    id: number;
    medication_name: string;
    last_price: string | null;
    created_at: string;
};

export default function AlarmsIndex() {
    const page = usePage();
    const { auth } = page.props as any;
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/alarms')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAlarms(data);
                }
            })
            .catch(err => console.error('Error fetching alarms:', err))
            .finally(() => setIsLoading(false));
    }, []);

    const handleRemoveAlarm = async (id: number) => {
        if (!confirm('Are you sure you want to delete this price alarm?')) {
return;
}

        try {
            const res = await fetch(`/api/alarms/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (res.ok) {
                setAlarms(alarms.filter(a => a.id !== id));
            }
        } catch (err) {
            console.error('Error removing alarm:', err);
        }
    };

    const filteredAlarms = alarms.filter(alarm => 
        alarm.medication_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head title="My Alarms" />
            <div className="flex flex-col gap-10 p-4 md:p-8 max-w-4xl mx-auto w-full bg-transparent text-foreground">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <Bell className="text-primary w-6 h-6" /> Price Alarms
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Track live market changes. We'll send an email immediately if any price goes down.
                        </p>
                    </div>
                    <div>
                        <Button 
                            onClick={() => window.location.href = '/dashboard'}
                            className="rounded-full bg-primary hover:bg-primary/95 text-white font-semibold text-xs px-5 py-1.5 transition-all duration-200"
                        >
                            Find Medications
                        </Button>
                    </div>
                </div>

                {/* Stripe-like borderless stats */}
                {!isLoading && alarms.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2 border-y border-border/40">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Active Alarms</span>
                            <span className="text-xl font-bold text-foreground">{alarms.length}</span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Monitoring Status</span>
                            <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Fully Operational
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Recipient Email</span>
                            <span className="text-sm font-medium text-foreground truncate" title={auth?.user?.email || 'Guest'}>
                                {auth?.user?.email || 'N/A'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Info & Status Banner */}
                {auth?.user && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-4 h-4 text-primary shrink-0" />
                        <span>
                            Notifications are active and will be delivered to <span className="font-semibold text-foreground">{auth.user.email}</span> as soon as a savings opportunity is detected.
                        </span>
                    </div>
                )}

                {/* Filter and Content */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 border-b border-border/40 animate-pulse"></div>
                        ))}
                    </div>
                ) : alarms.length > 0 ? (
                    <div className="space-y-6">
                        {/* Search / Filter Input */}
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search tracked medications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-5 rounded-md border-border/60 bg-transparent focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary w-full text-sm shadow-none"
                            />
                        </div>

                        {filteredAlarms.length > 0 ? (
                            <div className="divide-y divide-border/40">
                                {filteredAlarms.map((alarm) => {
                                    const formattedDate = new Date(alarm.created_at).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    });

                                    return (
                                        <div key={alarm.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group bg-transparent">
                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                                                    <Pill className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-semibold text-foreground leading-snug">
                                                        {alarm.medication_name}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1 font-semibold text-emerald-600">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                            Active Alert
                                                        </span>
                                                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            Created {formattedDate}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                                <div className="text-left sm:text-right">
                                                    <div className="text-lg font-bold text-foreground tracking-tight">
                                                        {alarm.last_price ? `$${parseFloat(alarm.last_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Pending'}
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">Alert Threshold</p>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => handleRemoveAlarm(alarm.id)}
                                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md w-8 h-8 p-0 transition-all duration-150"
                                                    title="Delete Price Alert"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-12 text-center bg-transparent">
                                <Search className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                                <h3 className="text-sm font-semibold text-foreground mb-1">No matching results</h3>
                                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                    We couldn't find any tracked medications matching "{searchQuery}". Try searching for a different name.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-16 text-center bg-transparent">
                        <Bell className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                        <h3 className="text-sm font-semibold text-foreground mb-1">No Price Alarms Active</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
                            Want to watch a drug? Go to the main dashboard, look up a medication, and turn on the alert trigger. We'll handle the rest.
                        </p>
                        <Button 
                            onClick={() => window.location.href = '/dashboard'}
                            className="rounded-full bg-primary hover:bg-primary/95 text-white font-semibold text-xs px-5 py-1.5 transition-all duration-200"
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

AlarmsIndex.layout = {
    breadcrumbs: [
        {
            title: 'My Alarms',
            href: '/alarms',
        },
    ],
};
