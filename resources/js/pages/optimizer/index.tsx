import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Plus, Trash2, Search, FileDown, Loader2, MapPin, Navigation, ShoppingBag, Eye, HelpCircle } from 'lucide-react';

type BasketItem = {
    name: string;
    current_price: number;
    quantity: number;
};

type OptimizedOptionItem = {
    medication: string;
    pharmacy: string;
    brand: string;
    price: number;
    current_price: number;
};

type OptimizedOption = {
    total: number;
    items: OptimizedOptionItem[];
    brand?: string;
    brandA?: string;
    brandB?: string;
    is_complete?: boolean;
};

type OptimizationResults = {
    individual: OptimizedOption;
    conveniencia: OptimizedOption;
    split: OptimizedOption;
};

export default function SavingsOptimizer() {
    // Search & Configuration States
    const [searchQuery, setSearchQuery] = useState('');
    const [apiResults, setApiResults] = useState<{ id: string, name: string }[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Current inputs
    const [currentCopay, setCurrentCopay] = useState('80');
    const [quantity, setQuantity] = useState('30');
    const [selectedDrug, setSelectedDrug] = useState('');

    // Basket & Location States
    const [basket, setBasket] = useState<BasketItem[]>([
        { name: 'LIPITOR 20 MG TABLET', current_price: 150, quantity: 30 },
        { name: 'SYNTHROID 50 MCG TABLET', current_price: 68, quantity: 30 }
    ]);
    const [zipCode, setZipCode] = useState('88595');
    const [radius, setRadius] = useState('42');

    // Calculation Results
    const [results, setResults] = useState<OptimizationResults | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounced Drug Search
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
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Close search dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Add to prescription basket
    const handleAddToBasket = () => {
        if (!selectedDrug) return;
        const currentPriceNum = parseFloat(currentCopay) || 0;
        const qtyNum = parseInt(quantity) || 30;

        // Prevent duplicates
        if (basket.some(item => item.name === selectedDrug)) {
            alert('This medication is already in your basket.');
            return;
        }

        const newItem: BasketItem = {
            name: selectedDrug,
            current_price: currentPriceNum,
            quantity: qtyNum
        };

        setBasket([...basket, newItem]);
        setSelectedDrug('');
        setSearchQuery('');
        setCurrentCopay('80');
        setQuantity('30');
        setResults(null); // Clear previous results to force recalculation
    };

    const handleRemoveFromBasket = (nameToRemove: string) => {
        setBasket(basket.filter(item => item.name !== nameToRemove));
        setResults(null);
    };

    // Calculate bundle options on the server
    const calculateOptimization = async () => {
        if (basket.length === 0) return;
        setIsCalculating(true);
        try {
            const res = await fetch('/api/optimizer/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    medications: basket,
                    zip_code: zipCode,
                    radius: radius
                })
            });
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error('Error calculating optimization:', error);
            alert('Failed to calculate. Please try again.');
        } finally {
            setIsCalculating(false);
        }
    };

    // Trigger PDF compilation on backend
    const handleDownloadPdf = async () => {
        if (!results || basket.length === 0) return;
        setIsGeneratingPdf(true);
        try {
            const res = await fetch('/api/savings/pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    medications: basket,
                    options: results
                })
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'optimized_prescription_plan.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                alert('Failed to generate PDF. Please try again.');
            }
        } catch (err) {
            console.error('PDF generation error:', err);
            alert('Error generating PDF.');
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    // Total cost user pays currently
    const totalCurrentCosts = basket.reduce((acc, item) => acc + item.current_price, 0);

    return (
        <>
            <Head title="Prescription Bundle Optimizer" />
            <div className="flex flex-col gap-10 p-4 md:p-8 max-w-5xl mx-auto w-full bg-transparent text-foreground">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <Sparkles className="text-primary w-8 h-8" /> Prescription Bundle Optimizer
                        </h1>
                        <p className="text-muted-foreground mt-2 text-base">
                            Seniors often take multiple medications. Optimize your entire recipe list across local pharmacies to find the perfect balance between savings and pickup convenience.
                        </p>
                    </div>
                </div>

                {/* Configuration Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-6 border-t border-border/40">
                    
                    {/* Step 1: Add Drugs to Basket */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">1. Add Medications to your Recipe Basket</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Autocomplete Search input */}
                            <div className="relative md:col-span-1" ref={dropdownRef}>
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Drug Name</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Type brand/generic name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 pr-4 py-5 rounded-md border-border/60 bg-transparent text-sm w-full shadow-none"
                                    />
                                </div>

                                {showDropdown && (searchQuery.trim().length > 2) && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-md shadow-lg border border-border/80 overflow-hidden z-50">
                                        {isSearching ? (
                                            <div className="p-3 text-xs text-center text-muted-foreground">Searching...</div>
                                        ) : apiResults.length > 0 ? (
                                            <ul className="max-h-48 overflow-y-auto py-1 divide-y divide-border/20">
                                                {apiResults.slice(0, 8).map((result) => (
                                                    <li
                                                        key={result.id}
                                                        className="px-3 py-2.5 hover:bg-muted/50 cursor-pointer text-xs font-medium text-foreground transition-colors"
                                                        onClick={() => {
                                                            setSelectedDrug(result.name);
                                                            setSearchQuery(result.name);
                                                            setShowDropdown(false);
                                                        }}
                                                    >
                                                        {result.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="p-3 text-xs text-center text-muted-foreground">No matching drugs found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Current Copay Input */}
                            <div className="flex flex-col">
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Your Current Copay / Cost</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={currentCopay}
                                        onChange={(e) => setCurrentCopay(e.target.value)}
                                        className="pl-7 pr-4 py-5 rounded-md border-border/60 bg-transparent text-sm w-full shadow-none"
                                    />
                                </div>
                            </div>

                            {/* Quantity Input */}
                            <div className="flex flex-col">
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Refill Quantity (e.g. 30, 90)</label>
                                <Input
                                    type="number"
                                    placeholder="30"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="px-4 py-5 rounded-md border-border/60 bg-transparent text-sm w-full shadow-none"
                                />
                            </div>
                        </div>

                        {selectedDrug && (
                            <div className="p-4 bg-muted/10 rounded-lg border border-border/40 text-xs flex justify-between items-center">
                                <div>
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Selected Drug</span>
                                    <p className="font-bold mt-0.5 text-sm">{selectedDrug}</p>
                                </div>
                                <Button
                                    onClick={handleAddToBasket}
                                    className="bg-primary text-white hover:bg-primary/90 rounded-full font-bold px-4 py-1 h-8 text-xs"
                                >
                                    Add to Basket
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Location Settings */}
                    <div className="lg:col-span-1 p-5 bg-muted/10 border border-border/40 rounded-xl space-y-4">
                        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-primary" /> Target Location
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">ZIP Code</label>
                                <Input
                                    type="text"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    className="rounded-md border-border/60 bg-transparent text-xs w-full py-4"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">Radius (Miles)</label>
                                <Input
                                    type="number"
                                    value={radius}
                                    onChange={(e) => setRadius(e.target.value)}
                                    className="rounded-md border-border/60 bg-transparent text-xs w-full py-4"
                                />
                            </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-normal pt-1">
                            We will calculate optimization using local pharmacy prices around this area.
                        </p>
                    </div>
                </div>

                {/* Basket Table & Calculation Triggers */}
                {basket.length > 0 && (
                    <div className="space-y-6 pt-6 border-t border-border/40">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-primary" /> Recipe Basket ({basket.length} items)
                                </h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Medications you want to calculate.</p>
                            </div>
                            <Button
                                onClick={calculateOptimization}
                                disabled={isCalculating}
                                className="rounded-full bg-primary hover:bg-primary/95 text-white font-bold text-xs px-6 py-2.5 shadow-sm flex items-center gap-1.5"
                            >
                                {isCalculating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Optimizing...
                                    </>
                                ) : (
                                    <>
                                        <Navigation className="w-4 h-4" /> Calculate Bundle Optimization
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                        <th className="pb-3">Medication</th>
                                        <th className="pb-3 text-center">Refill Size</th>
                                        <th className="pb-3 text-right">Current Copay / Fill</th>
                                        <th className="pb-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {basket.map((item, idx) => (
                                        <tr key={idx} className="group text-sm">
                                            <td className="py-4 font-bold text-foreground">{item.name}</td>
                                            <td className="py-4 text-center">{item.quantity} tabs/fills</td>
                                            <td className="py-4 text-right font-medium">${item.current_price.toFixed(2)}</td>
                                            <td className="py-4 text-center">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleRemoveFromBasket(item.name)}
                                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md w-8 h-8 p-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="font-bold text-sm bg-muted/5">
                                        <td colSpan={2} className="py-4 pl-2">Total Current Out-of-Pocket Cost</td>
                                        <td className="py-4 text-right pr-2">${totalCurrentCosts.toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Optimized Results Section */}
                {results && (
                    <div className="space-y-8 pt-8 border-t border-border/40">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-foreground">Optimization Scenarios</h2>
                                <p className="text-xs text-muted-foreground mt-1">We found three options to optimize your prescription costs.</p>
                            </div>
                            <Button
                                onClick={handleDownloadPdf}
                                disabled={isGeneratingPdf}
                                className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 shadow-sm flex items-center gap-1.5"
                            >
                                {isGeneratingPdf ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Preparing PDF...
                                    </>
                                ) : (
                                    <>
                                        <FileDown className="w-4 h-4" /> Export Savings PDF Plan
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Three Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Card 1: Conveniencia (1 stop) */}
                            <div className="border border-border/60 bg-card rounded-xl p-5 flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">1 Stop Option</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-foreground mt-3">Convenient Stop</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Buy all medications at one location to save time and driving.</p>
                                    
                                    <div className="mt-4 pt-3 border-t border-border/30">
                                        <p className="text-xs font-semibold text-muted-foreground">Optimal Chain:</p>
                                        <p className="font-bold text-foreground text-sm mt-0.5">{results.conveniencia.brand || 'No pharmacy carries all'}</p>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {results.conveniencia.items.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center text-xs">
                                                <span className="truncate max-w-[140px] text-muted-foreground" title={item.medication}>{item.medication.split(' ')[0]}</span>
                                                <span className="font-semibold text-foreground">${item.price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border/30">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">New Monthly Total</p>
                                            <p className="text-2xl font-bold text-primary mt-0.5">${results.conveniencia.total.toFixed(2)}</p>
                                        </div>
                                        {totalCurrentCosts > results.conveniencia.total && (
                                            <div className="text-right">
                                                <p className="text-[9px] text-emerald-600 font-bold uppercase">Saves</p>
                                                <p className="text-sm font-bold text-emerald-600">${(totalCurrentCosts - results.conveniencia.total).toFixed(0)}/mo</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Split (2 stops) */}
                            <div className="border-2 border-emerald-600/40 bg-card rounded-xl p-5 flex flex-col justify-between space-y-4 relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                                    Recommended Balance
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">Max 2 Stops</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-foreground mt-3">Split Savings</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Split medications across at most two pharmacy brands for optimal price savings.</p>
                                    
                                    <div className="mt-4 pt-3 border-t border-border/30">
                                        <p className="text-xs font-semibold text-muted-foreground">Optimal Chains:</p>
                                        <p className="font-bold text-foreground text-sm mt-0.5 truncate">{results.split.brandA} & {results.split.brandB}</p>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {results.split.items.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center text-xs">
                                                <div className="flex flex-col">
                                                    <span className="truncate max-w-[120px] font-medium text-foreground" title={item.medication}>{item.medication.split(' ')[0]}</span>
                                                    <span className="text-[9px] text-muted-foreground">Pick up at: {item.brand}</span>
                                                </div>
                                                <span className="font-semibold text-foreground">${item.price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border/30">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">New Monthly Total</p>
                                            <p className="text-2xl font-bold text-emerald-600 mt-0.5">${results.split.total.toFixed(2)}</p>
                                        </div>
                                        {totalCurrentCosts > results.split.total && (
                                            <div className="text-right">
                                                <p className="text-[9px] text-emerald-600 font-bold uppercase">Saves</p>
                                                <p className="text-sm font-bold text-emerald-600">${(totalCurrentCosts - results.split.total).toFixed(0)}/mo</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Extreme Ahorro (Individual cheapest) */}
                            <div className="border border-border/60 bg-card rounded-xl p-5 flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">Multi-Stop</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-foreground mt-3">Absolute Cheapest</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Get the absolute lowest price for each drug by visiting any number of stores.</p>
                                    
                                    <div className="mt-4 pt-3 border-t border-border/30">
                                        <p className="text-xs font-semibold text-muted-foreground">Strategy:</p>
                                        <p className="font-bold text-foreground text-sm mt-0.5">Visit Cheapest Specific Store</p>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {results.individual.items.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center text-xs">
                                                <div className="flex flex-col">
                                                    <span className="truncate max-w-[120px] font-medium text-foreground" title={item.medication}>{item.medication.split(' ')[0]}</span>
                                                    <span className="text-[9px] text-muted-foreground" title={item.pharmacy}>{item.brand} ({item.pharmacy.substring(0, 12)}...)</span>
                                                </div>
                                                <span className="font-semibold text-foreground">${item.price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border/30">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">New Monthly Total</p>
                                            <p className="text-2xl font-bold text-foreground mt-0.5">${results.individual.total.toFixed(2)}</p>
                                        </div>
                                        {totalCurrentCosts > results.individual.total && (
                                            <div className="text-right">
                                                <p className="text-[9px] text-emerald-600 font-bold uppercase">Saves</p>
                                                <p className="text-sm font-bold text-emerald-600">${(totalCurrentCosts - results.individual.total).toFixed(0)}/mo</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* Educational Box */}
                <div className="p-5 bg-muted/10 border border-border/40 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        Understanding Prescription Bundle Optimization
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-muted-foreground leading-relaxed">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-foreground">Why split prescriptions?</h4>
                            <p>
                                Different pharmacies negotiate different discount prices with coupon networks. A single pharmacy might have the cheapest price for drug A but be twice as expensive for drug B. Splitting your shopping between two chains can often save hundreds of dollars.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-foreground">What is the "Convenient Stop" option?</h4>
                            <p>
                                If you do not want the hassle of driving to multiple stores, this option calculates which single pharmacy brand gives you the lowest combined price for all items in your recipe basket.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="text-[11px] text-muted-foreground leading-relaxed pt-4 border-t border-border/40">
                    * Savings Disclaimer: All prices are estimates based on geographical pharmacy data. Actual savings may fluctuate depending on retail store changes, formulary tier updates, or local copay structures.
                </div>
            </div>
        </>
    );
}

SavingsOptimizer.layout = {
    breadcrumbs: [
        {
            title: 'Savings Optimizer',
            href: '/optimizer',
        },
    ],
};
