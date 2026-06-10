import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, TrendingDown, Trash2 } from 'lucide-react';

type Alarm = {
    id: number;
    medication_name: string;
    last_price: string | null;
    created_at: string;
};

export default function AlarmsIndex() {
    const [alarms, setAlarms] = useState<Alarm[]>([]);
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
        if (!confirm('Are you sure you want to delete this price alarm?')) return;
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

    return (
        <>
            <Head title="My Alarms" />
            <div className="flex flex-col gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Bell className="text-primary" /> My Price Alarms
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        We'll email you when these medications drop in price.
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground animate-pulse">Loading active alarms...</div>
                ) : alarms.length > 0 ? (
                    <div className="grid gap-4 mt-4">
                        {alarms.map((alarm) => (
                            <Card key={alarm.id} className="rounded-2xl border-border shadow-sm">
                                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold font-serif text-foreground">{alarm.medication_name}</h3>
                                        <p className="text-muted-foreground flex items-center gap-1 mt-1 text-sm">
                                            Active Alert
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 pt-4 sm:pt-0">
                                        <div className="text-left sm:text-right">
                                            <div className="text-2xl font-bold text-foreground">
                                                {alarm.last_price ? `$${parseFloat(alarm.last_price).toLocaleString()}` : 'Pending Check'}
                                            </div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Last Checked Price</p>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            onClick={() => handleRemoveAlarm(alarm.id)}
                                            className="text-destructive border-destructive hover:bg-destructive/10 rounded-full h-10 px-4 font-semibold"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Remove
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="rounded-2xl border-dashed border-2 border-border p-12 text-center mt-4">
                        <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-bold font-serif text-foreground mb-1">No active price alarms</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            Go to the Dashboard, search for a medication and click "Set Price Alert" to start tracking price drops.
                        </p>
                    </Card>
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
