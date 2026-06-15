import { Head, Link } from '@inertiajs/react';
import { Sparkles, Bell, CreditCard, ArrowRight, Search, Heart, MapPin, CheckCircle2, Zap, Pill, Info, Camera, Map, Trophy, Users, Bot } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Welcome() {
    const [mockCopay, setMockCopay] = useState('180');
    const [searchQuery, setSearchQuery] = useState('');
    const [apiResults, setApiResults] = useState<{ id: string, name: string, ndc?: string }[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // New state for pharmacy results on landing
    const [zipCode, setZipCode] = useState('');
    const [radius, setRadius] = useState('42');
    const [quantity, setQuantity] = useState('');
    const [selectedDrug, setSelectedDrug] = useState('');
    const [pharmacyResults, setPharmacyResults] = useState<any[]>([]);
    const [isLoadingPrices, setIsLoadingPrices] = useState(false);

    const handleSearchPharmacies = (drugName: string) => {
        if (!drugName) {
return;
}

        setSelectedDrug(drugName);
        setIsLoadingPrices(true);
        fetch('/api/drugs/pharmacies', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ 
                drugName, 
                zip_code: zipCode || '88595', 
                radius, 
                quantity: quantity || '1' 
            })
        })
        .then(res => res.json())
        .then(data => setPharmacyResults(data))
        .catch(err => console.error('Error fetching pharmacies:', err))
        .finally(() => setIsLoadingPrices(false));
    };

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
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Live calculated mock data for interactive bundle simulator
    const mockOptTotal = 42.50;
    const mockSavings = parseFloat(mockCopay) - mockOptTotal;

    return (
        <>
            <Head>
                <title>MedPrice - Save on Your Medications | Multi-Drug Prescription Optimizer</title>
                <meta name="description" content="Compare prescription prices and optimize your medication basket. Save up to 80% using discount coupons and price drop alarms." />
                <meta name="keywords" content="prescription, medication discounts, NeedyMeds, prescription optimizer, compare pharmacies, price alarms" />
                <meta property="og:title" content="MedPrice - Save on Your Medications" />
                <meta property="og:description" content="Optimize your medication basket and find the most convenient or cheapest pharmacy near you." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="min-h-screen bg-[#FAFAFA] text-[#1A1C2E] font-sans antialiased pb-24 md:pb-0 selection:bg-[#3A6FA8]/20">

                {/* Header Navigation */}
                <header className="bg-white border-b border-border/40 px-6 py-4 sticky top-0 z-50 flex justify-between items-center relative">
                    <div className="text-2xl font-serif font-bold tracking-tight text-[#3A6FA8] flex items-center gap-2.5 z-10">
                        <img src="/logo.png" alt="MedPrice Logo" className="w-8 h-8 object-contain rounded-md" />
                        MedPrice
                    </div>

                    <nav className="hidden md:flex gap-8 items-center absolute left-1/2 -translate-x-1/2">
                        <a href="#how-it-works" className="text-[#6A6C7D] hover:text-[#1A1C2E] font-medium text-[15px] transition-colors">Features</a>
                        <a href="#importing" className="text-[#6A6C7D] hover:text-[#1A1C2E] font-medium text-[15px] transition-colors">Compare</a>
                        <a href="#faq" className="text-[#6A6C7D] hover:text-[#1A1C2E] font-medium text-[15px] transition-colors">FAQ</a>
                    </nav>

                    <nav className="flex gap-4 items-center z-10">
                        <Link href="/login" className="text-[#6A6C7D] hover:text-[#1A1C2E] font-semibold text-[15px] transition-colors px-3 py-2">
                            Log in
                        </Link>
                        <Button asChild className="h-11 px-6 rounded-lg font-semibold text-[15px] bg-[#3A6FA8] hover:bg-[#3A6FA8]/90 text-white shadow-sm transition-all duration-200">
                            <Link href="/register">
                                Register
                            </Link>
                        </Button>
                    </nav>
                </header>

                <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-28">

                    {/* Hero Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6 text-left">

                            <h1 id="hero-heading" className="text-4xl md:text-5xl leading-tight font-serif font-bold text-[#1A1C2E] tracking-tight">
                                Save on your medications without changing pharmacies
                            </h1>
                            <p className="text-base md:text-lg leading-relaxed text-[#6A6C7D]">
                                Compare copay costs against coupons in real-time. Optimize your entire monthly prescription and calculate if it is cheaper to pickup everything in one place or split your purchase.
                            </p>

                            {/* Search Config */}
                            <div className="flex gap-3 mb-4 max-w-xl">
                                <Input 
                                    type="text" 
                                    placeholder="Zip Code" 
                                    value={zipCode} 
                                    onChange={e => setZipCode(e.target.value)} 
                                    className="w-1/3 bg-white border-border/80 rounded-xl text-[#1A1C2E] placeholder:text-[#6A6C7D] h-[46px]" 
                                />
                                <select 
                                    value={radius} 
                                    onChange={e => setRadius(e.target.value)} 
                                    className="w-1/3 bg-white border border-border/80 rounded-xl px-3 text-[#1A1C2E] h-[46px]"
                                >
                                    <option value="10">10 Miles</option>
                                    <option value="25">25 Miles</option>
                                    <option value="42">42 Miles</option>
                                    <option value="100">100 Miles</option>
                                </select>
                                <Input 
                                    type="number" 
                                    placeholder="Qty (e.g. 30)" 
                                    value={quantity} 
                                    onChange={e => setQuantity(e.target.value)} 
                                    className="w-1/3 bg-white border-border/80 rounded-xl text-[#1A1C2E] placeholder:text-[#6A6C7D] h-[46px]" 
                                />
                            </div>

                            {/* Integrated Search Bar */}
                            <div className="relative max-w-xl" ref={dropdownRef}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                    <Search className="text-muted-foreground w-5 h-5" />
                                </div>
                                <Input
                                    type="text"
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
                                    className="w-full bg-white border-border/80 rounded-xl h-[54px] pl-12 pr-[120px] text-base text-[#1A1C2E] placeholder:text-[#6A6C7D] focus-visible:ring-[#3A6FA8] focus-visible:ring-2 shadow-sm relative z-0"
                                    placeholder="Search medication name (e.g. Lipitor)..."
                                />
                                <Button 
                                    onClick={() => {
                                        setShowDropdown(false);
                                        handleSearchPharmacies(searchQuery);
                                    }}
                                    className="absolute right-1.5 top-1.5 bottom-1.5 h-auto px-5 rounded-lg bg-[#3A6FA8] text-white font-semibold text-sm hover:bg-[#3A6FA8]/90 z-10">
                                    Compare
                                </Button>

                                {/* Autocomplete Dropdown */}
                                {showDropdown && (searchQuery.trim().length > 2) && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-border/50 overflow-hidden z-50">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-muted-foreground text-sm">Searching...</div>
                                        ) : apiResults.length > 0 ? (
                                            <ul className="max-h-64 overflow-y-auto py-2 text-left">
                                                {apiResults.map((result) => (
                                                    <li
                                                        key={result.id}
                                                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between border-b border-border/40 last:border-0"
                                                        onClick={() => {
                                                            setSearchQuery(result.name);
                                                            setShowDropdown(false);
                                                            handleSearchPharmacies(result.name);
                                                        }}
                                                    >
                                                        <span className="font-semibold text-[#1A1C2E]">{result.name}</span>
                                                        {result.ndc && <span className="text-xs text-[#6A6C7D] bg-slate-100 px-2 py-1 rounded-md font-mono">NDC: {result.ndc}</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="p-4 text-center text-muted-foreground text-sm">No matching drugs found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Pharmacy Results Table */}
                            {isLoadingPrices && (
                                <div className="mt-8 max-w-xl p-8 bg-white rounded-2xl shadow-sm border border-border/40 text-center text-[#6A6C7D]">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A6FA8] mx-auto mb-4"></div>
                                    Finding best prices near {zipCode || 'you'}...
                                </div>
                            )}
                            
                            {!isLoadingPrices && pharmacyResults.length > 0 && (
                                <div className="mt-8 max-w-xl bg-white rounded-2xl shadow-lg border border-border/40 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="p-4 bg-[#3A6FA8] text-white flex justify-between items-center">
                                        <h3 className="font-bold flex items-center gap-2"><MapPin className="w-4 h-4" /> Lowest Prices for {selectedDrug}</h3>
                                        <span className="text-xs bg-white/20 px-2 py-1 rounded-md font-medium">Qty: {quantity || '1'}</span>
                                    </div>
                                    <div className="divide-y divide-border/40">
                                        {pharmacyResults.slice(0, 5).map((pharmacy, i) => (
                                            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                <div className="text-left">
                                                    <div className="font-bold text-[#1A1C2E]">{pharmacy.name || pharmacy.pharmacy}</div>
                                                    <div className="text-xs text-[#6A6C7D] mt-1">{pharmacy.address || 'Local Pharmacy'} • {pharmacy.distance} mi</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-green-600">${parseFloat(pharmacy.price).toFixed(2)}</div>
                                                    <Button onClick={() => window.location.href = `/register?drug=${encodeURIComponent(selectedDrug)}`} size="sm" className="mt-1 h-7 text-xs bg-[#1A1C2E] hover:bg-[#1A1C2E]/90 text-white rounded-full px-3">Get Coupon</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 bg-slate-50 text-center border-t border-border/40">
                                        <button onClick={() => window.location.href = `/register?drug=${encodeURIComponent(selectedDrug)}`} className="text-[#3A6FA8] text-sm font-semibold hover:underline flex items-center justify-center gap-1 mx-auto">
                                            Create free account to view all {pharmacyResults.length} options <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Hero Illustration */}
                        <div className="lg:col-span-5 flex justify-center">
                            <img
                                src="/images/realistic_senior_savings.png"
                                alt="Prescription Optimization Illustration"
                                className="w-full max-w-[420px] object-contain rounded-2xl shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Interactive Live Mock Simulator - Borderless, blends with page background */}
                    <section className="bg-transparent rounded-none p-0 max-w-3xl mx-auto space-y-6">
                        <div className="border-b border-border/40 pb-4">
                            <h2 className="text-2xl font-serif font-bold text-[#1A1C2E] flex items-center gap-2">
                                <Zap className="text-[#3A6FA8] w-6 h-6" /> Multi-Drug Recipe Simulator
                            </h2>
                            <p className="text-xs text-[#6A6C7D] mt-1">
                                Test how our technology works by combining multiple medications of common use.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left: Input controls */}
                            <div className="space-y-4">
                                <div className="p-4 bg-white/40 rounded-xl border border-transparent space-y-1">
                                    <span className="text-xs font-bold text-[#6A6C7D] uppercase flex items-center gap-1.5">
                                        <Pill className="w-3.5 h-3.5 text-[#3A6FA8]" /> Configured Medication
                                    </span>
                                    <p className="font-bold text-sm">LIPITOR 20 MG TABLET</p>
                                    <p className="text-[11px] text-[#6A6C7D]">Estimated savings at local pharmacies compared to copay.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#6A6C7D] uppercase block">Your Current Copay per Month</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#6A6C7D]">$</span>
                                        <Input
                                            type="number"
                                            value={mockCopay}
                                            onChange={(e) => setMockCopay(e.target.value)}
                                            className="pl-7 h-12 rounded-lg border-border focus-visible:ring-[#3A6FA8] w-full text-base font-medium shadow-none bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Real-time Optimized Results */}
                            <div className="bg-[#3A6FA8]/5 rounded-xl p-6 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#3A6FA8]/10 text-[#3A6FA8] px-2.5 py-0.5 rounded-full">Optimization Result</span>
                                    <div className="mt-4 flex justify-between items-baseline">
                                        <span className="text-xs font-medium text-[#6A6C7D]">Optimized Cost (CVS/Walgreens):</span>
                                        <span className="text-2xl font-bold text-[#3A6FA8]">${mockOptTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="mt-2 text-xs text-[#6A6C7D]">
                                        * Based on negotiated discount rates via NeedyMeds coupons.
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border/40 mt-4 flex justify-between items-center">
                                    <span className="text-sm font-bold text-[#1A1C2E]">Net Monthly Savings:</span>
                                    <span className="text-xl font-extrabold text-[#3A6FA8]">
                                        {mockSavings > 0 ? `$${mockSavings.toFixed(2)}` : '$0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Grid - Glassmorphism cards */}
                    <section id="how-it-works" className="space-y-12">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-serif font-bold text-[#1A1C2E]">Premium Features to Maximize Savings</h2>
                            <p className="text-sm text-[#6A6C7D] max-w-lg mx-auto">
                                We go beyond simple price comparisons. Discover our innovative tools designed to make saving effortless and engaging.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1: AI Scanner */}
                            <div className="bg-transparent border-none p-4 md:p-6 group space-y-4 hover:bg-[#3A6FA8]/5 rounded-2xl transition-all duration-300 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-[#3A6FA8]/10 flex items-center justify-center text-[#3A6FA8] group-hover:scale-105 transition-transform">
                                    <Camera className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1A1C2E]">AI Prescription Scanner</h3>
                                <p className="text-sm text-[#6A6C7D] leading-relaxed">
                                    Snap a photo of your prescription or receipt. Our AI instantly extracts the medication details and calculates your potential savings.
                                </p>
                            </div>

                            {/* Feature 2: Price Heatmap */}
                            <div className="bg-transparent border-none p-4 md:p-6 group space-y-4 hover:bg-[#3A6FA8]/5 rounded-2xl transition-all duration-300 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-[#3A6FA8]/10 flex items-center justify-center text-[#3A6FA8] group-hover:scale-105 transition-transform">
                                    <Map className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1A1C2E]">Interactive Price Heatmap</h3>
                                <p className="text-sm text-[#6A6C7D] leading-relaxed">
                                    Visualize local pharmacy prices on a beautiful interactive map. Easily spot the cheapest options in your neighborhood at a glance.
                                </p>
                            </div>

                            {/* Feature 3: Price Alerts */}
                            <div className="bg-transparent border-none p-4 md:p-6 group space-y-4 hover:bg-[#3A6FA8]/5 rounded-2xl transition-all duration-300 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-[#3A6FA8]/10 flex items-center justify-center text-[#3A6FA8] group-hover:scale-105 transition-transform">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1A1C2E]">Smart Price Alerts</h3>
                                <p className="text-sm text-[#6A6C7D] leading-relaxed">
                                    Set up alerts like flight trackers. We'll notify you instantly if a coupon value increases or a cheaper generic alternative becomes available.
                                </p>
                            </div>

                            {/* Feature 4: Gamification */}
                            <div className="bg-transparent border-none p-4 md:p-6 group space-y-4 hover:bg-[#3A6FA8]/5 rounded-2xl transition-all duration-300 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-[#3A6FA8]/10 flex items-center justify-center text-[#3A6FA8] group-hover:scale-105 transition-transform">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1A1C2E]">Savings Milestones</h3>
                                <p className="text-sm text-[#6A6C7D] leading-relaxed">
                                    Turn savings into a rewarding experience. Track your total dollars saved, unlock milestones, and visualize how your savings fund your personal goals.
                                </p>
                            </div>

                            {/* Feature 5: Family & Pets */}
                            <div className="bg-transparent border-none p-4 md:p-6 group space-y-4 hover:bg-[#3A6FA8]/5 rounded-2xl transition-all duration-300 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-[#3A6FA8]/10 flex items-center justify-center text-[#3A6FA8] group-hover:scale-105 transition-transform">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1A1C2E]">Family & Pet Profiles</h3>
                                <p className="text-sm text-[#6A6C7D] leading-relaxed">
                                    Manage prescriptions for your entire household in one place. Includes profiles for kids, elderly parents, and even your furry friends.
                                </p>
                            </div>

                            {/* Feature 6: AI Assistant */}
                            <div className="bg-transparent border-none p-4 md:p-6 group space-y-4 hover:bg-[#3A6FA8]/5 rounded-2xl transition-all duration-300 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-[#3A6FA8]/10 flex items-center justify-center text-[#3A6FA8] group-hover:scale-105 transition-transform">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1A1C2E]">AI Therapy Assistant</h3>
                                <p className="text-sm text-[#6A6C7D] leading-relaxed">
                                    Ask our intelligent chatbot about cheaper therapeutic alternatives to discuss with your doctor, empowering you to negotiate better care.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Story Block 1: Pharmacy Checkout */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-16">
                        <div className="order-2 md:order-1 flex justify-center">
                            <img src="/images/pharmacy_checkout.png" alt="Happy senior saving at pharmacy" className="w-full max-w-md rounded-3xl shadow-xl border border-border/40" />
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <h2 className="text-3xl font-serif font-bold text-[#1A1C2E]">Real savings, right at the counter</h2>
                            <p className="text-lg text-[#6A6C7D] leading-relaxed">
                                Forget complicated mail-order forms or waiting weeks for reimbursements. Simply show the digital discount card generated by MedPrice directly from your phone to your local pharmacist.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-[#3A6FA8]/10 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-[#3A6FA8]" /></div>
                                    <span className="text-[#6A6C7D]">Instant price drops applied before you pay.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-[#3A6FA8]/10 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-[#3A6FA8]" /></div>
                                    <span className="text-[#6A6C7D]">Accepted at over 65,000 national chains.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Story Block 2: Family & Pets */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-16 pb-8">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-serif font-bold text-[#1A1C2E]">One profile for the whole family (and pets!)</h2>
                            <p className="text-lg text-[#6A6C7D] leading-relaxed">
                                Keep track of all your dependents' medications under one single account. From your children's antibiotics to your furry friend's joint supplements, MedPrice finds the lowest cost for everyone you care about.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-[#3A6FA8]/10 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-[#3A6FA8]" /></div>
                                    <span className="text-[#6A6C7D]">Unlimited dependent profiles included for free.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-[#3A6FA8]/10 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-[#3A6FA8]" /></div>
                                    <span className="text-[#6A6C7D]">Share the discount card with family members instantly.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex justify-center">
                            <img src="/images/happy_family_pet.png" alt="Family with dog relaxing at home" className="w-full max-w-md rounded-3xl shadow-xl border border-border/40" />
                        </div>
                    </section>

                    {/* US vs Canada price comparison callout - Borderless Blended Container */}
                    <section id="importing" className="bg-transparent rounded-none grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-serif font-bold text-[#1A1C2E] flex items-center gap-2">
                                <Info className="w-7 h-7 text-[#3A6FA8]" /> Did you know that importing can save you up to 80%?
                            </h2>
                            <p className="text-sm text-[#6A6C7D] leading-relaxed">
                                Brand-name medication prices in the US are often excessive. We compare approved alternatives from certified Canadian pharmacies to give you the safest and cheapest option.
                            </p>
                        </div>

                        <div className="space-y-4 bg-white/40 p-6 rounded-xl border border-transparent">
                            <div>
                                <div className="flex justify-between mb-1.5 text-xs font-bold text-[#6A6C7D]">
                                    <span>AVERAGE US PRICE</span>
                                    <span className="text-[#1A1C2E]">$450.00</span>
                                </div>
                                <div className="w-full bg-[#1A1C2E]/10 rounded-full h-4">
                                    <div className="bg-[#1A1C2E] h-4 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1.5 text-xs font-bold text-[#6A6C7D]">
                                    <span>IMPORTED CANADA PRICE</span>
                                    <span className="text-[#3A6FA8]">$85.00</span>
                                </div>
                                <div className="w-full bg-[#3A6FA8]/10 rounded-full h-4 relative flex items-center">
                                    <div className="bg-[#3A6FA8] h-4 rounded-full" style={{ width: '19%' }}></div>
                                    <span className="absolute right-2 text-[9px] font-bold text-[#3A6FA8]">You Save 81%</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* NeedyMeds Card Details Finder - Borderless Blended Card with Solid Accent Border */}
                    <section className="bg-white border-l-4 border-[#3A6FA8] rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                        <div className="space-y-6 max-w-2xl">
                            <span className="inline-flex items-center text-[#3A6FA8] bg-[#3A6FA8]/10 text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wider">
                                Free Discount Card
                            </span>
                            <h2 className="text-3xl font-serif font-bold text-[#1A1C2E] leading-tight flex items-center gap-2">
                                <CreditCard className="w-7 h-7 text-[#3A6FA8]" /> Official MedPrice Card by NeedyMeds
                            </h2>
                            <p className="text-sm text-[#6A6C7D] leading-relaxed">
                                Accepted at over 65,000 pharmacies nationwide. Present these credentials to the pharmacist to instantly apply the discount.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/40 font-mono text-xs text-[#1A1C2E]">
                                <div>
                                    <span className="block text-[10px] text-[#6A6C7D] uppercase">BIN</span>
                                    <span className="text-base font-bold">019520</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-[#6A6C7D] uppercase">PCN</span>
                                    <span className="text-base font-bold">NMeds</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-[#6A6C7D] uppercase">GRP</span>
                                    <span className="text-base font-bold">DRUGCARD</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-[#6A6C7D] uppercase">Patient ID</span>
                                    <span className="text-base font-bold truncate">NMNA73366378</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Trust Banner */}
                    <section className="text-center space-y-4 max-w-xl mx-auto">
                        <div className="flex justify-center gap-1">
                            <Heart className="w-6 h-6 text-[#3A6FA8] fill-current animate-pulse" />
                        </div>
                        <h2 className="text-xl font-bold text-[#1A1C2E]">Join over 1.2 million people saving today</h2>
                        <p className="text-xs text-[#6A6C7D]">
                            Totally free. No registration fees or mandatory subscriptions required to compare.
                        </p>
                        <div className="pt-2">
                            <Button asChild className="h-14 px-10 rounded-full font-bold text-base bg-[#3A6FA8] hover:bg-[#3A6FA8]/90 text-white shadow-sm">
                                <Link href="/register">
                                    Register Now
                                </Link>
                            </Button>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section id="faq" className="max-w-3xl mx-auto space-y-8 pt-12 pb-12">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-serif font-bold text-[#1A1C2E]">Frequently Asked Questions</h2>
                            <p className="text-sm text-[#6A6C7D]">
                                Everything you need to know about MedPrice.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-xl border border-border/40 shadow-sm text-center flex flex-col items-center">
                                <h3 className="font-bold text-[#1A1C2E] mb-2 text-base">How much does it cost?</h3>
                                <p className="text-sm text-[#6A6C7D]">MedPrice is completely free to use. There are no subscriptions or hidden fees. We help you find the best NeedyMeds coupons.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-border/40 shadow-sm text-center flex flex-col items-center">
                                <h3 className="font-bold text-[#1A1C2E] mb-2 text-base">Do I need to change my pharmacy?</h3>
                                <p className="text-sm text-[#6A6C7D]">No. Our optimizer shows you prices at your current pharmacy and nearby alternatives. The choice is always yours.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-border/40 shadow-sm text-center flex flex-col items-center">
                                <h3 className="font-bold text-[#1A1C2E] mb-2 text-base">Can I use this with Medicare?</h3>
                                <p className="text-sm text-[#6A6C7D]">Yes, but you cannot combine our coupons with your insurance at the register. You can choose whichever price is lower.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-border/40 shadow-sm text-center flex flex-col items-center">
                                <h3 className="font-bold text-[#1A1C2E] mb-2 text-base">Can I find pet medication?</h3>
                                <p className="text-sm text-[#6A6C7D]">Absolutely! Many pet medications are human drugs. You can use our coupons at normal pharmacies to save on your furry friend's health.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-border/40 shadow-sm text-center flex flex-col items-center">
                                <h3 className="font-bold text-[#1A1C2E] mb-2 text-base">How do you make money if it's free?</h3>
                                <p className="text-sm text-[#6A6C7D]">We receive a small administrative fee from the pharmacy networks when you use our coupons, at zero extra cost to you.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-border/40 shadow-sm text-center flex flex-col items-center">
                                <h3 className="font-bold text-[#1A1C2E] mb-2 text-base">Is my data secure?</h3>
                                <p className="text-sm text-[#6A6C7D]">Yes. We use banking-level encryption and we strictly comply with privacy regulations to ensure your medical data is never sold.</p>
                            </div>
                        </div>
                    </section>

                </main>

                {/* Footer */}
                <footer className="border-t border-border/40 mt-12 bg-white py-12 px-6">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-[#6A6C7D]">
                        <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#3A6FA8]">
                            <img src="/logo.png" alt="MedPrice Logo" className="w-5 h-5 object-contain rounded-sm" />
                            MedPrice
                        </div>
                        <div>
                            © {new Date().getFullYear()} MedPrice. All rights reserved.
                        </div>
                        <div className="flex gap-6">
                            <Link href="/login" className="hover:underline">Log In</Link>
                            <Link href="/register" className="hover:underline">Create Account</Link>
                            <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
                            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                        </div>
                    </div>
                </footer>

                {/* Bottom Navigation for Mobile */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border/40 px-6 py-3 pb-safe flex justify-between items-center md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
                    <Link href="/login" className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-[60px] h-[36px] flex items-center justify-center text-[#6A6C7D]">
                            <Search size={22} />
                        </div>
                        <span className="text-[11px] font-bold text-[#6A6C7D]">Search</span>
                    </Link>

                    <Link href="/register" className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="bg-[#3A6FA8] text-white w-[60px] h-[36px] rounded-full flex items-center justify-center shadow-sm">
                            <Sparkles size={22} />
                        </div>
                        <span className="text-[11px] font-bold text-[#3A6FA8]">Get Started</span>
                    </Link>

                    <Link href="/login" className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-[60px] h-[36px] flex items-center justify-center text-[#6A6C7D]">
                            <CreditCard size={22} />
                        </div>
                        <span className="text-[11px] font-bold text-[#6A6C7D]">Card</span>
                    </Link>
                </div>

            </div>
        </>
    );
}
