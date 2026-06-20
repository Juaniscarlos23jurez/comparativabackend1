import { Head, Link, usePage } from '@inertiajs/react';
import { Search, Activity, Pill, Stethoscope, HeartHandshake, Wallet, LineChart, MapPin, Layers, Percent, Bell, Trash2, CreditCard } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';

const globalMetrics = [
    { label: 'Medications Tracked', value: '4,021', icon: Stethoscope },
    { label: 'Active Users Saving', value: '1.2M+', icon: HeartHandshake },
    { label: 'Avg User Savings', value: '$2,450/yr', icon: Wallet },
    { label: 'GLP-1 Market Dominance', value: '45%', icon: LineChart },
];


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
    const page = usePage();
    const { auth } = page.props as any;
    const [searchQuery, setSearchQuery] = useState('');
    const [apiResults, setApiResults] = useState<{ id: string, name: string, ndc: string }[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Search Parameters
    const [quantity, setQuantity] = useState('1');
    const [miles, setMiles] = useState(auth?.user?.radius?.toString() || '10');

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
    const [alarmsList, setAlarmsList] = useState<any[]>([]);

    // Price Alarm Modal States
    const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
    const [alarmModalThreshold, setAlarmModalThreshold] = useState('');

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
                    setAlarmsList(data);
                    setActiveAlarms(data.map((a: any) => a.medication_name));
                }
            })
            .catch(err => console.error('Error fetching alarms:', err));
    }, []);

    const handleOpenAlarmModal = () => {
        if (!comparedDrug) {
            return;
        }

        const alarmObj = alarmsList.find(a => a.medication_name === comparedDrug);

        if (alarmObj && alarmObj.last_price) {
            setAlarmModalThreshold(parseFloat(alarmObj.last_price).toFixed(2));
        } else {
            const lowestPriceVal = compareResults.length > 0
                ? Math.min(...compareResults.map(p => parseFloat(p.price)))
                : null;
            setAlarmModalThreshold(lowestPriceVal ? lowestPriceVal.toFixed(2) : '');
        }

        setIsAlarmModalOpen(true);
    };

    const handleSaveAlarmFromModal = async () => {
        const thresholdPrice = parseFloat(alarmModalThreshold);

        if (isNaN(thresholdPrice) || thresholdPrice <= 0) {
            alert("Please enter a valid price threshold.");

            return;
        }

        try {
            const res = await fetch('/api/alarms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ medication_name: comparedDrug, last_price: thresholdPrice })
            });

            if (res.ok) {
                if (!activeAlarms.includes(comparedDrug)) {
                    setActiveAlarms([...activeAlarms, comparedDrug]);
                }

                // Refresh list
                const refreshed = await fetch('/api/alarms').then(r => r.json());

                if (Array.isArray(refreshed)) {
                    setAlarmsList(refreshed);
                }

                setIsAlarmModalOpen(false);
            }
        } catch (err) {
            console.error('Error creating/updating alarm:', err);
        }
    };

    const handleDeleteAlarm = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete the price alarm for ${name}?`)) {
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
                setAlarmsList(alarmsList.filter(a => a.id !== id));
                setActiveAlarms(activeAlarms.filter(aName => aName !== name));
            }
        } catch (err) {
            console.error('Error removing alarm:', err);
        }
    };

    const handleCompareForSaved = async (medicationName: string) => {
        setSearchQuery(medicationName);
        setShowDropdown(false);
        setIsComparing(true);
        setComparedDrug(medicationName);

        const userZip = auth?.user?.zip_code || '88595';

        try {
            const res = await fetch('/api/drugs/pharmacies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ drugName: medicationName, quantity: quantity, radius: miles, zip_code: userZip })
            });
            const data = await res.json();
            setCompareResults(data);
        } catch (error) {
            console.error('Error fetching pharmacies:', error);
        } finally {
            setIsComparing(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        if (expandedPharmacy !== npi) {
            return null;
        }

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
                                        <stop offset="5%" stopColor="#2b73e0" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#2b73e0" stopOpacity={0.01} />
                                    </linearGradient>
                                    <linearGradient id={`colorDiscount-${npi}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(156, 163, 175, 0.15)" />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#888888', fontSize: 10, fontWeight: 500 }}
                                    dy={8}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tickFormatter={(val) => `$${val}`}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#888888', fontSize: 10, fontWeight: 500 }}
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
                                    formatter={(value, name) => [
                                        `$${parseFloat(value as string).toFixed(2)}`,
                                        name === 'price' ? 'Standard Price' : 'Discount Price'
                                    ]}
                                />
                                <Area
                                    type="monotone"
                                    name="price"
                                    dataKey="price"
                                    stroke="#2b73e0"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill={`url(#colorPrice-${npi})`}
                                    activeDot={{ r: 4, fill: '#2b73e0', stroke: '#fff', strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    name="discount_price"
                                    dataKey="discount_price"
                                    stroke="#10b981"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill={`url(#colorDiscount-${npi})`}
                                    activeDot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
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
        if (!searchQuery) {
            return;
        }

        setShowDropdown(false);
        setIsComparing(true);
        setComparedDrug(searchQuery);

        const userZip = auth?.user?.zip_code || '88595';

        try {
            const res = await fetch('/api/drugs/pharmacies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ drugName: searchQuery, quantity: quantity, radius: miles, zip_code: userZip })
            });
            const data = await res.json();
            setCompareResults(data);
        } catch (error) {
            console.error('Error fetching pharmacies:', error);
        } finally {
            setIsComparing(false);
        }
    };
    const alarmObj = alarmsList.find(a => a.medication_name === comparedDrug);
    const hasActiveAlarm = !!alarmObj;

    return (
        <>
            <Head title="Market Overview" />

            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full">

                {/* Search Bar (Hero) */}
                <div className="relative max-w-4xl mx-auto w-full mb-4 flex flex-col gap-4 bg-card p-5 rounded-2xl border border-border/80 shadow-sm" ref={dropdownRef}>
                    <div className="flex flex-col md:flex-row gap-3 items-center w-full">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search for medication (e.g. Lisinopril)..."
                                className="w-full h-14 pl-12 pr-4 text-lg rounded-xl border-border bg-transparent focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary shadow-none"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => {
                                    if (apiResults.length > 0) {
                                        setShowDropdown(true);
                                    }
                                }}
                            />
                        </div>

                        {/* Quantity (Numeric Input) */}
                        <div className="flex items-center gap-2 w-full md:w-32">
                            <span className="text-sm font-semibold text-muted-foreground shrink-0">Qty:</span>
                            <Input
                                type="number"
                                min="1"
                                placeholder="Qty"
                                className="w-full h-14 text-center text-lg rounded-xl border-border bg-transparent focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary shadow-none"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                title="Quantity"
                            />
                        </div>

                        <Button
                            onClick={handleCompare}
                            className="h-14 rounded-xl bg-primary px-8 text-lg font-bold transition-all duration-200 shadow-sm hover:bg-primary/95 text-white w-full md:w-auto shrink-0"
                        >
                            Search
                        </Button>
                    </div>

                    {/* Slider and ZIP indicator info */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-3 border-t border-border/50 w-full">
                        {/* Range (Radius Slider) */}
                        <div className="flex items-center gap-4 w-full md:max-w-md">
                            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider shrink-0 w-24">Radius: {miles} mi</span>
                            <input
                                type="range"
                                min="5"
                                max="150"
                                step="5"
                                value={miles}
                                onChange={(e) => setMiles(e.target.value)}
                                className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                                title="Search Radius in Miles"
                            />
                        </div>
                        {/* ZIP code display */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="font-semibold">Searching in ZIP Code:</span>
                            <span className="bg-secondary px-2.5 py-0.5 rounded-full font-bold text-foreground">{auth?.user?.zip_code || '88595'}</span>
                        </div>
                    </div>

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
                <div className="max-w-xl mx-auto w-full">
                    <a
                        href="https://www.needymeds.org/files/drug-card-print.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col sm:flex-row sm:items-center gap-5 bg-white border-2 border-[#3A6FA8]/80 hover:border-[#3A6FA8] hover:bg-slate-50 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl"
                    >
                        <div className="bg-[#3A6FA8]/10 p-4 rounded-full shrink-0 flex items-center justify-center">
                            <CreditCard className="w-8 h-8 text-[#3A6FA8] group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold text-xl text-[#3A6FA8] uppercase tracking-wide">NeedyMeds Discount Card</span>
                            </div>
                            <p className="text-base text-black font-semibold flex items-center gap-2 transition-colors">
                                Click here to use or print card <span className="transition-transform group-hover:translate-x-1 text-[#3A6FA8]">→</span>
                            </p>
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
                                <div className="text-sm text-muted-foreground mt-1.5 flex flex-wrap items-center gap-3">
                                    Comparing prices for <span className="font-extrabold text-foreground text-base tracking-tight ml-1">{comparedDrug}</span>
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={handleOpenAlarmModal}
                                        className={`h-7 px-3 rounded-full flex items-center gap-1.5 text-[11px] font-bold transition-all duration-200 ${hasActiveAlarm ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm' : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground border shadow-sm'}`}
                                    >
                                        <Bell className={`w-3.5 h-3.5 ${hasActiveAlarm ? 'fill-current' : ''}`} />
                                        {hasActiveAlarm ? `Price Alert Active (< $${parseFloat(alarmObj?.last_price || '0').toFixed(0)})` : 'Set Price Alert'}
                                    </Button>
                                </div>
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
                                    {/* Pharmacy Price Comparison Chart */}
                                    <div className="p-6 border-b border-border bg-card">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5">
                                            <LineChart className="w-3.5 h-3.5 text-primary" />
                                            Pharmacy Price Comparison (Lowest Price per Chain)
                                        </h3>
                                        <div className="h-44 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart
                                                    data={(() => {
                                                        const grouped = compareResults.reduce((acc: Record<string, number>, pharm) => {
                                                            const brand = pharm.pharmacy || pharm.name || 'Independent';
                                                            const priceNum = parseFloat(pharm.price);

                                                            if (!isNaN(priceNum)) {
                                                                if (acc[brand] === undefined || priceNum < acc[brand]) {
                                                                    acc[brand] = priceNum;
                                                                }
                                                            }

                                                            return acc;
                                                        }, {});

                                                        return Object.entries(grouped).map(([name, price]) => ({
                                                            name: name.replace(/\s+(PHARMACY|PHAR)/i, '').substring(0, 15),
                                                            price: price,
                                                            discountPrice: Math.round(price * 0.85 * 100) / 100
                                                        }));
                                                    })()}
                                                    margin={{ top: 10, right: 10, bottom: 5, left: -20 }}
                                                >
                                                    <defs>
                                                        <linearGradient id="colorComparePrices" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#2b73e0" stopOpacity={0.2} />
                                                            <stop offset="95%" stopColor="#2b73e0" stopOpacity={0.01} />
                                                        </linearGradient>
                                                        <linearGradient id="colorCompareDiscount" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(156, 163, 175, 0.15)" />
                                                    <XAxis
                                                        dataKey="name"
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tick={{ fill: '#888888', fontSize: 10, fontWeight: 500 }}
                                                        dy={8}
                                                    />
                                                    <YAxis
                                                        domain={['auto', 'auto']}
                                                        tickFormatter={(val) => `$${val}`}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tick={{ fill: '#888888', fontSize: 10, fontWeight: 500 }}
                                                        dx={-8}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: 'var(--background)',
                                                            borderRadius: '12px',
                                                            border: '1px solid var(--border)',
                                                            fontSize: '11px',
                                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                                                            padding: '8px 12px'
                                                        }}
                                                        formatter={(value, name) => [
                                                            `$${parseFloat(value as string).toFixed(2)}`,
                                                            name === 'price' ? 'Standard Price' : 'Discount Price'
                                                        ]}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        name="price"
                                                        dataKey="price"
                                                        stroke="#2b73e0"
                                                        strokeWidth={2.5}
                                                        fillOpacity={1}
                                                        fill="url(#colorComparePrices)"
                                                        activeDot={{ r: 4, fill: '#2b73e0', stroke: '#fff', strokeWidth: 2 }}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        name="discountPrice"
                                                        dataKey="discountPrice"
                                                        stroke="#10b981"
                                                        strokeWidth={2.5}
                                                        fillOpacity={1}
                                                        fill="url(#colorCompareDiscount)"
                                                        activeDot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {groupByPharmacy ? (
                                        <div className="divide-y divide-border">
                                            {Object.entries(
                                                compareResults.reduce((acc: Record<string, any[]>, pharm) => {
                                                    const brand = pharm.pharmacy || 'Independent / Other';

                                                    if (!acc[brand]) {
                                                        acc[brand] = [];
                                                    }

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

                    {/* Table Header */}
                    <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/10">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
                                <Bell className="w-6 h-6 text-primary" />
                                Saved Medications & Alerts
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Your tracked medications and customized price drop thresholds.
                            </p>
                        </div>
                        <Link href="/alarms">
                            <Button variant="outline" size="sm" className="rounded-full font-bold transition-all duration-200">
                                <Bell className="w-4 h-4 mr-2" /> Manage All Alerts
                            </Button>
                        </Link>
                    </div>

                    {/* The CMC Table */}
                    <div className="overflow-x-auto">
                        {alarmsList.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider bg-muted/5">
                                        <th className="p-4 font-bold w-12 text-center">#</th>
                                        <th className="p-4 font-bold">Medication</th>
                                        <th className="p-4 font-bold text-right">Target Threshold</th>
                                        <th className="p-4 font-bold text-center">Status</th>
                                        <th className="p-4 font-bold text-center">Date Added</th>
                                        <th className="p-4 font-bold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {alarmsList.map((alarm, idx) => {
                                        const formattedDate = new Date(alarm.created_at).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        });

                                        return (
                                            <tr key={alarm.id} className="hover:bg-muted/50 transition-colors group">
                                                <td className="p-4 text-center font-bold text-muted-foreground">{idx + 1}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                                            <Pill className="w-4 h-4" />
                                                        </div>
                                                        <div className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                                                            {alarm.medication_name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className="font-bold text-base text-foreground">
                                                        {alarm.last_price ? `$${parseFloat(alarm.last_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="inline-flex items-center gap-1.5 font-bold text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        Active Alert
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center text-sm text-muted-foreground">
                                                    {formattedDate}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            size="xs"
                                                            onClick={() => handleCompareForSaved(alarm.medication_name)}
                                                            className="rounded-full bg-primary hover:bg-primary/95 text-white font-bold px-3 transition-all duration-200"
                                                        >
                                                            Compare
                                                        </Button>
                                                        <Button
                                                            size="xs"
                                                            variant="ghost"
                                                            onClick={() => handleDeleteAlarm(alarm.id, alarm.medication_name)}
                                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-150 p-1"
                                                            title="Delete Price Alert"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center">
                                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-foreground mb-1">No Saved Medications</h3>
                                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                                    Search for a medication above and click "Set Price Alert" to begin tracking savings.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Price Alarm Modal */}
                {isAlarmModalOpen && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                            <div className="flex items-center justify-between pb-4 border-b border-border/60">
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-primary" />
                                    Set Price Alert
                                </h3>
                                <button
                                    onClick={() => setIsAlarmModalOpen(false)}
                                    className="text-muted-foreground hover:text-foreground transition-colors text-sm font-semibold"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="mt-4 space-y-4">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Enter the price threshold for <strong className="text-foreground">{comparedDrug}</strong>. We'll send an email alert immediately if the price drops below this target.
                                </p>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Target Threshold Price (USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={alarmModalThreshold}
                                            onChange={(e) => setAlarmModalThreshold(e.target.value)}
                                            className="pl-7 pr-4 py-5 rounded-lg border-border/80 focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary shadow-none text-base font-semibold w-full"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsAlarmModalOpen(false)}
                                    className="rounded-full text-xs font-semibold px-4 py-2 hover:bg-muted"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveAlarmFromModal}
                                    className="rounded-full bg-primary text-white font-bold text-xs px-5 py-2 shadow-sm"
                                >
                                    Save Alert
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

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
