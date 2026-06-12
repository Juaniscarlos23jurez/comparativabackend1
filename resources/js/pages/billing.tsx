import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { CreditCard, Check, Sparkles, ChevronLeft } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

export default function Billing() {
    const invoices = [
        { id: 'INV-001', date: 'June 01, 2026', amount: '$12.00', status: 'Paid' },
        { id: 'INV-002', date: 'May 01, 2026', amount: '$12.00', status: 'Paid' },
        { id: 'INV-003', date: 'April 01, 2026', amount: '$12.00', status: 'Paid' },
    ];

    return (
        <>
            <Head title="Billing Settings" />

            <div className="flex flex-col gap-6 p-4 md:p-8 max-w-4xl mx-auto w-full">
                
                {/* Back Link */}
                <div className="flex items-center gap-2">
                    <Link href="/optimizer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Back to Optimizer
                    </Link>
                </div>

                <Heading
                    title="Billing Settings"
                    description="Manage your subscription plans, payment methods, and invoices."
                />

                {/* Plan Status Card */}
                <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                                <Sparkles className="w-3 h-3" /> Active Plan
                            </span>
                            <h3 className="text-xl font-bold mt-2">MedSaver Pro</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Unlimited recipes, automatic daily price alerts, and premium reports.</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-foreground">$12</span>
                            <span className="text-xs text-muted-foreground"> / month</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                        <span>Next renewal date: **July 01, 2026**</span>
                        <Button variant="link" className="text-primary hover:underline p-0 h-auto text-xs">Cancel Subscription</Button>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <CreditCard className="w-4.5 h-4.5 text-primary" /> Payment Method
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-6.5 bg-muted rounded border border-border flex items-center justify-center font-mono text-[9px] font-bold text-muted-foreground">
                                VISA
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-foreground">Visa ending in •••• 4242</p>
                                <p className="text-[10px] text-muted-foreground">Expires 12/28</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold px-4">
                            Update Method
                        </Button>
                    </div>
                </div>

                {/* Invoices List */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-foreground">Billing History</h3>
                    <div className="border border-border/80 rounded-xl overflow-hidden bg-card shadow-sm">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-border bg-muted/20 text-muted-foreground uppercase font-bold tracking-wider text-[9px]">
                                    <th className="p-3">Invoice ID</th>
                                    <th className="p-3">Billing Date</th>
                                    <th className="p-3 text-right">Amount</th>
                                    <th className="p-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-muted/10">
                                        <td className="p-3 font-semibold text-foreground">{inv.id}</td>
                                        <td className="p-3 text-muted-foreground">{inv.date}</td>
                                        <td className="p-3 text-right font-medium text-foreground">{inv.amount}</td>
                                        <td className="p-3 text-center">
                                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold text-[10px]">
                                                <Check className="w-3 h-3" /> Paid
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    );
}

Billing.layout = {
    breadcrumbs: [
        {
            title: 'Billing Settings',
            href: '/settings/billing',
        },
    ],
};
