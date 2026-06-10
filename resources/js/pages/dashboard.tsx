import { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, TrendingDown, TrendingUp, Filter, BarChart3, Users, DollarSign, Activity, Pill, Stethoscope, HeartHandshake, Wallet, LineChart, MapPin, Layers, Percent, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const globalMetrics = [
    { label: 'Medications Tracked', value: '4,021', icon: Stethoscope },
    { label: 'Active Users Saving', value: '1.2M+', icon: HeartHandshake },
    { label: 'Avg User Savings', value: '$2,450/yr', icon: Wallet },
    { label: 'GLP-1 Market Dominance', value: '45%', icon: LineChart },
];

const categories = ['All Medications', 'Weight Loss (GLP-1)', 'Diabetes', 'Mental Health', 'Autoimmune', 'Cholesterol'];

type Medication = {
    id: string;
    rank: number;
    name: string;
    exactName?: string;
    generic: string;
    category: string;
    retail: number;
    bestPrice: number;
    change: number;
};

export default function Dashboard({ medicationsList }: { medicationsList: Medication[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [apiResults, setApiResults] = useState<{ id: string, name: string, ndc: string }[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    
    // Compare Modal States
    const [compareResults, setCompareResults] = useState<any[]>([]);
    const [isComparing, setIsComparing] = useState(false);
    const [comparedDrug, setComparedDrug] = useState('');
    const [groupByPharmacy, setGroupByPharmacy] = useState(true);
    const [viewEstimatedDiscount, setViewEstimatedDiscount] = useState(true);

    // Pharmacy Row Expansion & History
    const [expandedPharmacy, setExpandedPharmacy] = useState<string | null>(null);
    const [pharmacyHistory, setPharmacyHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Price Alarms
    const [activeAlarms, setActiveAlarms] = useState<string[]>([]);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounced API Search
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery.trim().length > 2) {
                setIsSearching(true);
                fetch(`/api/drugs/search?q=${encodeURIComponent(searchQuery)}`)
                    .then(res => res.json())
                    .then(data => {
                        setApiResults(data);
                        setShowDropdown(true);
                    })
                    .catch(err => console.error('API Search Error:', err))
                    .finally(() => setIsSearching(false));
            } else {
                setApiResults([]);
                setShowDropdown(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch active alarms
    useEffect(() => {
        fetch('/api/alarms')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setActiveAlarms(data.map((a: any) => a.medication_name));
                }
            })
            .catch(err => console.error('Error fetching alarms:', err));
    }, []);

    const handleSetAlarm = async () => {
        if (!comparedDrug) return;
        const lowestPrice = compareResults.length > 0 
            ? Math.min(...compareResults.map(p => parseFloat(p.price))) 
            : null;

        try {
            const res = await fetch('/api/alarms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ medication_name: comparedDrug, last_price: lowestPrice })
            });
            if (res.ok) {
                setActiveAlarms([...activeAlarms, comparedDrug]);
                alert(`Price alert successfully created for ${comparedDrug}! We'll email you when prices drop.`);
            }
        } catch (err) {
            console.error('Error creating alarm:', err);
        }
    };

    const filteredMedications = medicationsList.filter((med) => {
        const query = searchQuery.toLowerCase();
        return med.name.toLowerCase().includes(query) || 
               med.generic.toLowerCase().includes(query) || 
               med.category.toLowerCase().includes(query);
    });

    const handlePharmacyClick = async (npi: string) => {
        if (expandedPharmacy === npi) {
            setExpandedPharmacy(null);
            setPharmacyHistory([]);
            return;
        }
        setExpandedPharmacy(npi);
        setIsLoadingHistory(true);
        try {
            const res = await fetch(`/api/drugs/pharmacy-history?npi=${npi}&drugName=${encodeURIComponent(comparedDrug)}`);
            const data = await res.json();
            setPharmacyHistory(data);
        } catch (error) {
            console.error('Error fetching pharmacy price history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const renderHistoryChart = (npi: string) => {
        if (expandedPharmacy !== npi) return null;

        return (
            <div className="mt-4 p-4 bg-muted/10 rounded-xl border border-border/60" onClick={(e) => e.stopPropagation()}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-primary" />
                    Historical Pricing Trend
                </h4>
                {isLoadingHistory ? (
                    <div className="h-28 flex items-center justify-center text-xs text-muted-foreground animate-pulse">
                        Loading price history...
                    </div>
                ) : pharmacyHistory.length > 0 ? (
                    <div className="h-36 w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={pharmacyHistory} margin={{ top: 10, right: 10, bottom: 5, left: -25 }}>
                                <defs>
                                    <linearGradient id={`colorPrice-${npi}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2b73e0" stopOpacity={0.25}/>
                                        <stop offset="95%" stopColor="#2b73e0" stopOpacity={0.01}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(156, 163, 175, 0.15)" />
                                <XAxis 
                                    dataKey="date" 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tick={{fill: '#888888', fontSize: 10, fontWeight: 500}} 
                                    dy={8}
                                />
                                <YAxis 
                                    domain={['auto', 'auto']} 
                                    tickFormatter={(val) => `$${val}`} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tick={{fill: '#888888', fontSize: 10, fontWeight: 500}} 
                                    dx={-8}
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'var(--background)',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border)',
                                        fontSize: '11px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
                                        padding: '8px 12px'
                                    }}
                                    labelStyle={{ fontWeight: 'bold', color: 'var(--foreground)' }}
                                    formatter={(value) => [`$${parseFloat(value as string).toFixed(2)}`, 'Price']} 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="price" 
                                    stroke="#2b73e0" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill={`url(#colorPrice-${npi})`} 
                                    activeDot={{r: 5, fill: '#2b73e0', stroke: '#fff', strokeWidth: 2}} 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-28 flex items-center justify-center text-xs text-muted-foreground">
                        No historical data available.
                    </div>
                )}
            </div>
        );
    };

    const handleCompare = async () => {
        if (!searchQuery) return;
        setShowDropdown(false);
        setIsComparing(true);
        setComparedDrug(searchQuery);
        try {
            const res = await fetch('/api/drugs/pharmacies', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ drugName: searchQuery, quantity: '1' })
            });
            const data = await res.json();
            setCompareResults(data);
        } catch (error) {
            console.error('Error fetching pharmacies:', error);
        } finally {
            setIsComparing(false);
        }
    };

    return (
        <>
            <Head title="Market Overview" />

            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full">
                
                {/* Search Bar (Hero) */}
                <div className="relative max-w-3xl mx-auto w-full mb-4" ref={dropdownRef}>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
                    <Input 
                        type="text" 
                        placeholder="Search for medication (e.g. Ozempic, Lisinopril)..." 
                        className="w-full h-16 pl-14 pr-32 text-xl rounded-full shadow-sm border-2 border-border bg-card focus-visible:ring-primary"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => {
                            if (apiResults.length > 0) setShowDropdown(true);
                        }}
                    />
                    <Button 
                        onClick={handleCompare}
                        className="absolute right-2 top-2 h-12 rounded-full bg-primary px-8 text-lg font-bold transition-all duration-200 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                    >
                        Compare
                    </Button>

                    {/* Autocomplete Dropdown */}
                    {showDropdown && (searchQuery.trim().length > 2) && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl shadow-xl border border-border overflow-hidden z-50">
                            {isSearching ? (
                                <div className="p-4 text-center text-muted-foreground">Searching NeedyMeds...</div>
                            ) : apiResults.length > 0 ? (
                                <ul className="max-h-64 overflow-y-auto py-2">
                                    {apiResults.map((result) => (
                                        <li 
                                            key={result.id} 
                                            className="px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between"
                                            onClick={() => {
                                                setSearchQuery(result.name);
                                                setShowDropdown(false);
                                            }}
                                        >
                                            <span className="font-semibold text-foreground">{result.name}</span>
                                            {result.ndc && <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">NDC: {result.ndc}</span>}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-4 text-center text-muted-foreground">No matching drugs found in NeedyMeds</div>
                            )}
                        </div>
                    )}
                </div>

                {/* NeedyMeds Drug Discount Card Callout */}
                <div className="max-w-3xl mx-auto w-full">
                    <a 
                        href="https://www.needymeds.org/files/drug-card-print.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block bg-card hover:bg-muted/50 border border-border rounded-xl p-4 transition-all duration-200"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-sm tracking-wide text-foreground uppercase">NeedyMeds Drug Discount Card</span>
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">Save up to 80%</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-snug">
                                    Free, no fees or registration. Never expires. Accepted at over 65,000 pharmacies nationwide including all major chains.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 text-left border-t sm:border-t-0 sm:border-l border-border pt-2 sm:pt-0 sm:pl-4 text-[10px] font-mono text-muted-foreground">
                                <div>
                                    <div><span className="font-semibold text-foreground">BIN:</span> 019520</div>
                                    <div><span className="font-semibold text-foreground">PCN:</span> NMeds</div>
                                </div>
                                <div>
                                    <div><span className="font-semibold text-foreground">GRP:</span> DRUGCARD</div>
                                    <div><span className="font-semibold text-foreground">ID:</span> NMNA733663784223</div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>

                {/* Pharmacy Prices Section */}
                {comparedDrug && (
                    <Card className="rounded-2xl border-0 bg-card shadow-none overflow-hidden">
                        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30">
                            <div>
                                <h2 className="text-2xl font-bold font-serif text-foreground flex items-center gap-2">
                                    <Activity className="w-6 h-6 text-primary animate-pulse" />
                                    Pharmacy Prices
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-2">
                                    Comparing prices for <span className="font-bold text-foreground mr-1">{comparedDrug}</span>
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={handleSetAlarm}
                                        disabled={activeAlarms.includes(comparedDrug)}
                                        className={`h-7 px-2.5 rounded-full flex items-center gap-1 text-[11px] font-semibold transition-all duration-200 ${activeAlarms.includes(comparedDrug) ? 'bg-primary/10 border-primary/20 text-primary cursor-default' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <Bell className={`w-3.5 h-3.5 ${activeAlarms.includes(comparedDrug) ? 'fill-current' : ''}`} />
                                        {activeAlarms.includes(comparedDrug) ? 'Price Alert Active' : 'Set Price Alert'}
                                    </Button>
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant={groupByPharmacy ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setGroupByPharmacy(!groupByPharmacy)}
                                    className="rounded-full flex items-center gap-1.5 transition-all duration-200"
                                >
                                    <Layers className="w-4 h-4" />
                                    Group by Pharmacy
                                </Button>
                                <Button
                                    variant={viewEstimatedDiscount ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewEstimatedDiscount(!viewEstimatedDiscount)}
                                    className="rounded-full flex items-center gap-1.5 transition-all duration-200"
                                >
                                    <Percent className="w-4 h-4" />
                                    Est. Discount Price
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    className="rounded-full w-10 h-10 p-0 text-muted-foreground hover:text-foreground ml-2" 
                                    onClick={() => {
                                        setComparedDrug('');
                                        setCompareResults([]);
                                    }}
                                >
                                    ✕
                                </Button>
                            </div>
                        </div>
                        <div className="p-0">
                            {isComparing ? (
                                <div className="divide-y divide-border">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-6 flex justify-between items-center animate-pulse">
                                            <div className="space-y-2.5 w-2/3">
                                                <div className="h-5 bg-muted rounded w-1/3"></div>
                                                <div className="h-3.5 bg-muted rounded w-1/2"></div>
                                                <div className="h-3 bg-muted rounded w-1/4"></div>
                                            </div>
                                            <div className="space-y-2 w-1/4 flex flex-col items-end">
                                                <div className="h-6 bg-muted rounded w-1/2"></div>
                                                <div className="h-4 bg-muted rounded w-1/3"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : compareResults.length > 0 ? (
                                <div className="overflow-x-auto">
                                    {groupByPharmacy ? (
                                        <div className="divide-y divide-border">
                                            {Object.entries(
                                                compareResults.reduce((acc: Record<string, any[]>, pharm) => {
                                                    const brand = pharm.pharmacy || 'Independent / Other';
                                                    if (!acc[brand]) acc[brand] = [];
                                                    acc[brand].push(pharm);
                                                    return acc;
                                                }, {})
                                            ).map(([brand, items]) => (
                                                <div key={brand} className="bg-muted/10">
                                                    <div className="bg-muted/30 px-6 py-3 font-bold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border">
                                                        <Layers className="w-4 h-4 text-primary" />
                                                        {brand} ({items.length} {items.length === 1 ? 'location' : 'locations'})
                                                    </div>
                                                    <div className="divide-y divide-border/50">
                                                        {items.map((pharm, idx) => (
                                                            <div 
                                                                key={idx} 
                                                                onClick={() => handlePharmacyClick(pharm.npi)}
                                                                className="p-6 cursor-pointer hover:bg-muted/20 transition-colors select-none"
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <div>
                                                                        <div className="font-bold text-foreground flex items-center gap-2">
                                                                            {pharm.name}
                                                                            <a 
                                                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharm.name + ' ' + pharm.street1 + ' ' + pharm.city + ' ' + pharm.state + ' ' + pharm.zipCode)}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs"
                                                                                title="View on Google Maps"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                <MapPin className="w-3.5 h-3.5" />
                                                                            </a>
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground mt-1">
                                                                            {pharm.street1}, {pharm.city}, {pharm.state} {pharm.zipCode}
                                                                        </div>
                                                                        {pharm.phoneNumber && (
                                                                            <div className="text-xs text-muted-foreground mt-0.5">{pharm.phoneNumber}</div>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="font-bold text-xl text-primary">${parseFloat(pharm.price).toLocaleString()}</div>
                                                                        {viewEstimatedDiscount && (
                                                                            <div className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full inline-block mt-1">
                                                                                Est. Coupon: ${(parseFloat(pharm.price) * 0.85).toFixed(2)}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {renderHistoryChart(pharm.npi)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-muted/50 text-sm text-muted-foreground border-b border-border">
                                                    <th className="p-4 pl-6 font-semibold">Pharmacy</th>
                                                    <th className="p-4 pr-6 font-semibold text-right">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {compareResults.map((pharm, idx) => (
                                                    <>
                                                        <tr 
                                                            key={idx} 
                                                            onClick={() => handlePharmacyClick(pharm.npi)}
                                                            className="hover:bg-muted/30 transition-colors cursor-pointer select-none"
                                                        >
                                                            <td className="p-4 pl-6">
                                                                <div className="font-bold text-foreground flex items-center gap-2">
                                                                    {pharm.name}
                                                                    <a 
                                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharm.name + ' ' + pharm.street1 + ' ' + pharm.city + ' ' + pharm.state + ' ' + pharm.zipCode)}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                                                                        title="View on Google Maps"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <MapPin className="w-4 h-4" />
                                                                    </a>
                                                                </div>
                                                                <div className="text-xs text-muted-foreground mt-1">
                                                                    {pharm.street1}, {pharm.city}, {pharm.state} {pharm.zipCode}
                                                                </div>
                                                                {pharm.phoneNumber && (
                                                                    <div className="text-xs text-muted-foreground">{pharm.phoneNumber}</div>
                                                                )}
                                                            </td>
                                                            <td className="p-4 pr-6 text-right">
                                                                <div className="font-bold text-xl text-primary">${parseFloat(pharm.price).toLocaleString()}</div>
                                                                {viewEstimatedDiscount && (
                                                                    <div className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full inline-block mt-1">
                                                                        Est. Coupon: ${(parseFloat(pharm.price) * 0.85).toFixed(2)}
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                        {expandedPharmacy === pharm.npi && (
                                                            <tr key={`${idx}-history`}>
                                                                <td colSpan={2} className="p-4 bg-muted/5 border-b border-border">
                                                                    {renderHistoryChart(pharm.npi)}
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-muted-foreground">
                                    No pharmacies found for this medication in your area.
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                {/* Global Metrics Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {globalMetrics.map((metric, i) => (
                        <Card key={i} className="rounded-2xl border-0 bg-card shadow-none">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="text-primary">
                                    <metric.icon className="w-10 h-10 stroke-[1.5]" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{metric.label}</p>
                                    <p className="text-2xl font-bold font-serif text-foreground">{metric.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Data Table Area */}
                <div className="bg-card border-0 rounded-2xl shadow-none overflow-hidden flex flex-col">
                    
                    {/* Table Header / Filters */}
                    <div className="p-4 border-b border-border flex flex-col gap-4">
                        <h2 className="text-2xl font-serif font-bold text-foreground">Top Medications by Savings</h2>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full">
                            {categories.map((cat, i) => (
                                <Button 
                                    key={i} 
                                    variant={i === 0 ? "default" : "secondary"}
                                    className={`rounded-full whitespace-nowrap font-medium transition-all duration-200 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none ${i === 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {cat}
                                </Button>
                            ))}
                            <Button variant="outline" className="rounded-full whitespace-nowrap ml-auto transition-all duration-200 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">
                                <Filter className="w-4 h-4 mr-2" /> Filters
                            </Button>
                        </div>
                    </div>

                    {/* The CMC Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border text-sm text-muted-foreground">
                                    <th className="p-4 font-semibold w-12 text-center">#</th>
                                    <th className="p-4 font-semibold">Name</th>
                                    <th className="p-4 font-semibold">Category</th>
                                    <th className="p-4 font-semibold text-right">Avg Retail Price</th>
                                    <th className="p-4 font-semibold text-right">Best Price (CA/US)</th>
                                    <th className="p-4 font-semibold text-right">30d Change</th>
                                    <th className="p-4 font-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredMedications.map((med) => (
                                    <tr key={med.id} className="hover:bg-muted/50 transition-colors group">
                                        <td className="p-4 text-center font-bold text-muted-foreground">{med.rank}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Pill className="w-8 h-8 text-primary stroke-[1.5]" />
                                                <div>
                                                    <div className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                                        {med.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{med.generic}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-md">
                                                {med.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-medium text-muted-foreground line-through decoration-muted-foreground/50">
                                            {med.retail > 0 ? `$${med.retail.toLocaleString()}` : 'N/A'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="font-bold text-xl text-foreground">{med.bestPrice > 0 ? `$${med.bestPrice.toLocaleString()}` : 'N/A'}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className={`flex items-center justify-end gap-1 font-bold ${med.change < 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                {med.change < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                                {Math.abs(med.change)}%
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <Link href={`/medications/${med.id}`}>
                                                <Button size="sm" className="rounded-lg font-bold transition-all duration-200 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">Compare</Button>
                                            </Link>
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

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Market Overview',
            href: dashboard(),
        },
    ],
};
