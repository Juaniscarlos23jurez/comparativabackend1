import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Bell, MapPin, Plane, TrendingDown, Star, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Button } from '@/components/ui/button';

type Medication = {
    id: string;
    name: string;
    generic: string;
    category: string;
    rank: number;
    bestPrice: number;
    retail: number;
};

export default function MedicationShow({ medication }: { medication: Medication, auth: any }) {
    const name = medication.name;
    const currentPrice = medication.bestPrice;
    const retailPrice = medication.retail;

    // Generate a realistic trend leading to the current best price
    const priceHistoryData = [
        { date: 'Jan 1', price: Math.round(currentPrice * 1.15) },
        { date: 'Jan 15', price: Math.round(currentPrice * 1.13) },
        { date: 'Feb 1', price: Math.round(currentPrice * 1.10) },
        { date: 'Feb 15', price: Math.round(currentPrice * 1.08) },
        { date: 'Mar 1', price: Math.round(currentPrice * 1.07) },
        { date: 'Mar 15', price: Math.round(currentPrice * 1.05) },
        { date: 'Apr 1', price: Math.round(currentPrice * 1.04) },
        { date: 'Apr 15', price: Math.round(currentPrice * 1.02) },
        { date: 'May 1', price: Math.round(currentPrice * 1.03) },
        { date: 'May 15', price: Math.round(currentPrice * 1.01) },
        { date: 'Jun 1', price: Math.round(currentPrice * 1.00) },
        { date: 'Jun 15', price: Math.round(currentPrice) },
    ];

    // Calculate percentage change
    const pctChange = (((priceHistoryData[0].price - currentPrice) / priceHistoryData[0].price) * 100).toFixed(1);

    return (
        <>
            <Head title={name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
                
                {/* Back Link */}
                <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium w-fit">
                    <ArrowLeft className="w-4 h-4" /> Back to Market
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left & Center Column: Info & Chart */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                                        {name.charAt(0)}
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">{name}</h1>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-md">Rank #{medication.rank}</span>
                                    <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-1 rounded-md">{medication.generic}</span>
                                    <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-1 rounded-md">{medication.category}</span>
                                </div>
                            </div>
                            
                            <div className="text-left md:text-right">
                                <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-1">Current Lowest Price</div>
                                <div className="flex items-end gap-3 md:justify-end">
                                    <span className="text-5xl font-bold text-foreground">${currentPrice.toLocaleString()}</span>
                                    <span className="text-green-600 font-bold flex items-center mb-1 bg-green-100 dark:bg-green-950/30 px-2 py-1 rounded-lg">
                                        <TrendingDown className="w-4 h-4 mr-1" /> {pctChange}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="flex gap-3 border-b border-border pb-4">
                            <Button variant="outline" className="rounded-full font-semibold">
                                <Star className="w-4 h-4 mr-2" /> Watch
                            </Button>
                            <Button variant="outline" className="rounded-full font-semibold">
                                <Bell className="w-4 h-4 mr-2" /> Price Alarm
                            </Button>
                            <Button variant="outline" className="rounded-full font-semibold">
                                <LinkIcon className="w-4 h-4 mr-2" /> Official Info
                            </Button>
                        </div>

                        {/* GIANT CHART */}
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-4 md:p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold font-serif">Price Chart (6 Months)</h2>
                                <div className="flex gap-2 bg-muted p-1 rounded-lg">
                                    {['1D', '7D', '1M', '3M', '6M', '1Y'].map(t => (
                                        <button key={t} className={`px-3 py-1 text-sm font-bold rounded-md ${t === '6M' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={priceHistoryData} margin={{ top: 15, right: 10, bottom: 5, left: -15 }}>
                                        <defs>
                                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2b73e0" stopOpacity={0.25}/>
                                                <stop offset="95%" stopColor="#2b73e0" stopOpacity={0.01}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(156, 163, 175, 0.15)" />
                                        <XAxis 
                                            dataKey="date" 
                                            tickLine={false} 
                                            axisLine={false} 
                                            tick={{fill: '#888888', fontSize: 11, fontWeight: 500}} 
                                            dy={10} 
                                            minTickGap={30} 
                                        />
                                        <YAxis 
                                            domain={['auto', 'auto']} 
                                            tickFormatter={(val) => `$${val}`} 
                                            tickLine={false} 
                                            axisLine={false} 
                                            tick={{fill: '#888888', fontSize: 11, fontWeight: 500}} 
                                            dx={-10} 
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'var(--background)',
                                                borderRadius: '12px',
                                                border: '1px solid var(--border)',
                                                fontSize: '12px',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
                                                padding: '10px 14px'
                                            }}
                                            labelStyle={{ fontWeight: 'bold', color: 'var(--foreground)' }}
                                            formatter={(value) => [`$${parseFloat(value as string).toFixed(2)}`, 'Price']} 
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="price" 
                                            stroke="#2b73e0" 
                                            strokeWidth={3.5} 
                                            fillOpacity={1} 
                                            fill="url(#colorPrice)" 
                                            activeDot={{r: 6, fill: '#2b73e0', stroke: '#fff', strokeWidth: 2}} 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-serif font-bold">About {name}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {name} ({medication.generic}) is an FDA-approved prescription medication originally developed for the treatment of type 2 diabetes. It belongs to a class of medications called GLP-1 receptor agonists. Because it helps regulate appetite and slows digestion, it is frequently prescribed off-label for chronic weight management. The incredibly high demand has led to global shortages and significant price volatility in the US retail market.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: "Exchanges" (Where to Buy) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sticky top-6">
                            <h3 className="text-xl font-bold font-serif mb-6 border-b border-border pb-4">Where to Buy</h3>
                            
                            <div className="space-y-4">
                                {/* Option 1: Canada (Best Price) */}
                                <div className="p-4 rounded-xl border-2 border-green-500 bg-green-50/50 dark:bg-green-950/20 relative">
                                    <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        Lowest Price
                                    </div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <Plane className="w-5 h-5 text-green-600" />
                                            <span className="font-bold text-green-800 dark:text-green-400">Canadian Pharmacy</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-green-700/80 dark:text-green-500/80 mb-3">Mail order • 2-3 weeks delivery</p>
                                    <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">${currentPrice.toLocaleString()}</div>
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl">
                                        Order Now
                                    </Button>
                                </div>

                                {/* Option 2: Local US */}
                                <div className="p-4 rounded-xl border border-border bg-card">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-foreground" />
                                            <span className="font-bold text-foreground">US Local Retail</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">Pickup today • Requires Coupon</p>
                                    <div className="text-3xl font-bold text-foreground mb-4">${retailPrice.toLocaleString()}</div>
                                    <Button variant="outline" className="w-full font-bold h-12 rounded-xl border-2 border-border hover:border-primary hover:text-primary">
                                        Get Free Coupon
                                    </Button>
                                </div>

                                {/* Disclaimer */}
                                <div className="flex items-start gap-3 p-4 bg-muted rounded-xl mt-6">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Prices are estimates based on cash-pay without insurance. Canadian pharmacies require a valid prescription from your doctor.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
