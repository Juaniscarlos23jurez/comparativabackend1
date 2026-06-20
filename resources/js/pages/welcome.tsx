import { Head, Link } from '@inertiajs/react';
import { 
    Sparkles, 
    Bell, 
    CreditCard, 
    ArrowRight, 
    Search, 
    Heart, 
    MapPin, 
    CheckCircle2, 
    Zap, 
    Pill, 
    Info, 
    Camera, 
    Map, 
    Trophy, 
    Users, 
    Bot,
    HeartHandshake,
    Percent,
    Phone,
    Globe,
    FileText,
    Mail,
    X,
    Building2,
    Calendar,
    ShieldAlert,
    ExternalLink,
    FileDown
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Drug = {
    id: string;
    name: string;
    genericName?: string;
    brandName?: string;
};

type Program = {
    id: string;
    title: string;
    type: string[];
    isNational: boolean;
    summary?: string;
    providedBy?: string;
    phone?: string;
    altPhone?: string;
    email?: string;
    fax?: string;
    programWebsite?: string;
    programDetails?: string;
    updateDate?: string;
    languages?: string[];
    applications?: { name: string; link: string }[];
    applicationProcess?: string[];
    eligibilityGuidelines?: string[];
    areasOfService?: string[];
    ageGroups?: string[];
    address?: {
        title?: string;
        attn?: string;
        address?: string;
        address2?: string;
        city?: string;
        state?: string;
        postalCode?: string;
    };
    services?: { id: string; service: string }[];
    diagnoses?: { id: string; name: string; details?: string }[];
};

type Coupon = {
    id: string;
    createdAt: string;
    name: string;
    details: string;
    expirationDate: string;
    lastUpdated: string;
    manufacturerOfferWebsite: string;
    patientSupportNumber?: string;
    pharmacySupportNumber?: string;
    printPDF?: string;
    drugs?: Drug[];
    activateBy?: string;
    category?: string;
    coverageRequirements?: string;
    offerType?: string;
    overTheCounter?: boolean;
};

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

    // Programs & Coupons Explore Section States
    const [activeTab, setActiveTab] = useState<'programs' | 'coupons'>('programs');

    // Programs States
    const [programQuery, setProgramQuery] = useState('');
    const [isNationalProgram, setIsNationalProgram] = useState(true);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [programsCount, setProgramsCount] = useState(0);
    const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

    // Coupons States
    const [couponQuery, setCouponQuery] = useState('');
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [couponsCount, setCouponsCount] = useState(0);
    const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

    const fetchWelcomePrograms = (search = '') => {
        setIsLoadingPrograms(true);
        fetch('/api/programs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify({
                isNational: isNationalProgram,
                rows: '4',
                page: '0',
                order: 'ASC',
                orderBy: 'title',
                type: 'dba',
                runSearch: true,
                query: search,
                zipCode: zipCode
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setPrograms(data.programs || []);
                    setProgramsCount(data.count || 0);
                }
            })
            .catch(err => console.error('Error fetching welcome programs:', err))
            .finally(() => setIsLoadingPrograms(false));
    };

    const fetchWelcomeCoupons = (search = '') => {
        setIsLoadingCoupons(true);
        fetch('/api/coupons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify({
                rows: '4',
                page: '0',
                order: 'ASC',
                orderBy: 'name',
                query: search
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setCoupons(data.coupons || []);
                    setCouponsCount(data.count || 0);
                }
            })
            .catch(err => console.error('Error fetching welcome coupons:', err))
            .finally(() => setIsLoadingCoupons(false));
    };

    // Load initial data
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchWelcomePrograms(programQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNationalProgram, zipCode]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchWelcomeCoupons(couponQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleProgramsSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchWelcomePrograms(programQuery);
    };

    const handleCouponsSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchWelcomeCoupons(couponQuery);
    };

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
                <title>pricemymeds - Save on Your Medications | Multi-Drug Prescription Optimizer</title>
                <meta name="description" content="Compare prescription prices and optimize your medication basket. Save up to 80% using discount coupons and price drop alarms." />
                <meta name="keywords" content="prescription, medication discounts, NeedyMeds, prescription optimizer, compare pharmacies, price alarms" />
                <meta property="og:title" content="pricemymeds - Save on Your Medications" />
                <meta property="og:description" content="Optimize your medication basket and find the most convenient or cheapest pharmacy near you." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="min-h-screen bg-[#FAFAFA] text-[#1A1C2E] font-sans antialiased pb-24 md:pb-0 selection:bg-[#3A6FA8]/20">

                {/* Header Navigation */}
                <header className="bg-white border-b border-border/40 px-6 py-4 sticky top-0 z-50 flex justify-between items-center relative">
                    <div className="text-2xl font-serif font-bold tracking-tight text-[#3A6FA8] flex items-center gap-2.5 z-10">
                        <img src="/logo1.png" alt="pricemymeds Logo" className="w-8 h-8 object-contain rounded-md" />
                        pricemymeds
                    </div>

                    <nav className="hidden md:flex gap-8 items-center absolute left-1/2 -translate-x-1/2">
                        <a href="#how-it-works" className="text-black hover:text-[#3A6FA8] font-bold text-[17px] transition-colors">Features</a>
                        <a href="#importing" className="text-black hover:text-[#3A6FA8] font-bold text-[17px] transition-colors">Compare</a>
                        <a href="#faq" className="text-black hover:text-[#3A6FA8] font-bold text-[17px] transition-colors">FAQ</a>
                    </nav>

                    <nav className="flex gap-4 items-center z-10">
                        <Link href="/login" className="text-black hover:text-[#3A6FA8] font-bold text-[17px] transition-colors px-3 py-2">
                            Log in
                        </Link>
                        <Button asChild className="h-12 px-7 rounded-xl font-bold text-[17px] bg-[#3A6FA8] hover:bg-[#3A6FA8]/90 text-white shadow-md transition-all duration-200">
                            <Link href="/register">
                                Register
                            </Link>
                        </Button>
                    </nav>
                </header>

                <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-28">

                    {/* Hero Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-8 text-left">

                            <h1 id="hero-heading" className="text-5xl md:text-6xl leading-tight font-serif font-extrabold text-[#3A6FA8] tracking-tight">
                                Save on your medications without changing pharmacies
                            </h1>
                            <p className="text-xl md:text-2xl leading-relaxed text-black font-medium">
                                Compare copay costs against coupons in real-time. Optimize your entire monthly prescription and calculate if it is cheaper to pickup everything in one place or split your purchase.
                            </p>

                            {/* Search Config */}
                            <div className="flex gap-3 mb-4 max-w-xl">
                                <Input
                                    type="text"
                                    placeholder="Zip Code"
                                    value={zipCode}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setZipCode(val);
                                        if (val && val.trim().length > 0) {
                                            setIsNationalProgram(false);
                                        } else {
                                            setIsNationalProgram(true);
                                        }
                                    }}
                                    className="w-1/3 bg-white border-2 border-border/80 rounded-xl text-black placeholder:text-gray-500 h-[54px] text-lg font-bold"
                                />
                                <select
                                    value={radius}
                                    onChange={e => setRadius(e.target.value)}
                                    className="w-1/3 bg-white border-2 border-border/80 rounded-xl px-3 text-black h-[54px] text-lg font-bold"
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
                                    className="w-1/3 bg-white border-2 border-border/80 rounded-xl text-black placeholder:text-gray-500 h-[54px] text-lg font-bold"
                                />
                            </div>

                            {/* Integrated Search Bar */}
                            <div className="relative max-w-xl" ref={dropdownRef}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                    <Search className="text-black w-6 h-6" />
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
                                    className="w-full bg-white border-2 border-[#3A6FA8] rounded-xl h-[64px] pl-12 pr-[140px] text-lg text-black placeholder:text-gray-500 font-bold focus-visible:ring-[#3A6FA8] focus-visible:ring-2 shadow-sm relative z-0"
                                    placeholder="Search medication name (e.g. Lipitor)..."
                                />
                                <Button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        handleSearchPharmacies(searchQuery);
                                    }}
                                    className="absolute right-2 top-2 bottom-2 h-auto px-6 rounded-lg bg-[#3A6FA8] text-white font-extrabold text-base hover:bg-[#3A6FA8]/90 z-10">
                                    Compare
                                </Button>

                                {/* Autocomplete Dropdown */}
                                {showDropdown && (searchQuery.trim().length > 2) && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border-2 border-border overflow-hidden z-50">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-black font-bold text-base">Searching...</div>
                                        ) : apiResults.length > 0 ? (
                                            <ul className="max-h-64 overflow-y-auto py-2 text-left">
                                                {apiResults.map((result) => (
                                                    <li
                                                        key={result.id}
                                                        className="px-4 py-3 hover:bg-slate-100 cursor-pointer transition-colors flex items-center justify-between border-b border-border last:border-0"
                                                        onClick={() => {
                                                            setSearchQuery(result.name);
                                                            setShowDropdown(false);
                                                            handleSearchPharmacies(result.name);
                                                        }}
                                                    >
                                                        <span className="font-extrabold text-lg text-black">{result.name}</span>
                                                        {result.ndc && <span className="text-sm text-black bg-slate-100 px-2 py-1 rounded-md font-mono font-bold">NDC: {result.ndc}</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="p-4 text-center text-black font-bold text-base">No matching drugs found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Pharmacy Results Table */}
                            {isLoadingPrices && (
                                <div className="mt-8 max-w-xl p-8 bg-white rounded-2xl shadow-md border-2 border-border text-center text-black font-bold text-lg">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3A6FA8] mx-auto mb-4"></div>
                                    Finding best prices near {zipCode || 'you'}...
                                </div>
                            )}

                            {!isLoadingPrices && pharmacyResults.length > 0 && (
                                <div className="mt-8 max-w-xl bg-white rounded-2xl shadow-xl border-2 border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="p-4 bg-[#3A6FA8] text-white flex justify-between items-center">
                                        <h3 className="font-extrabold text-lg flex items-center gap-2"><MapPin className="w-5 h-5" /> Lowest Prices for {selectedDrug}</h3>
                                        <span className="text-sm bg-white/20 px-3 py-1 rounded-md font-bold">Qty: {quantity || '1'}</span>
                                    </div>
                                    <div className="divide-y divide-border/60">
                                        {pharmacyResults.slice(0, 5).map((pharmacy, i) => (
                                            <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                <div className="text-left">
                                                    <div className="font-extrabold text-xl text-black">{pharmacy.name || pharmacy.pharmacy}</div>
                                                    <div className="text-base text-black mt-1 font-medium">{pharmacy.address || 'Local Pharmacy'} • {pharmacy.distance} mi</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-green-700">${parseFloat(pharmacy.price).toFixed(2)}</div>
                                                    <Button onClick={() => window.location.href = `/register?drug=${encodeURIComponent(selectedDrug)}`} size="sm" className="mt-1 h-9 text-sm font-bold bg-black hover:bg-black/90 text-white rounded-full px-4">Get Coupon</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-slate-50 text-center border-t border-border">
                                        <button onClick={() => window.location.href = `/register?drug=${encodeURIComponent(selectedDrug)}`} className="text-[#3A6FA8] text-base font-extrabold hover:underline flex items-center justify-center gap-1.5 mx-auto">
                                            Create free account to view all {pharmacyResults.length} options <ArrowRight className="w-5 h-5" />
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

                    {/* Explore Programs & Coupons Tabs Section */}
                    <section className="space-y-8 bg-transparent rounded-none p-0 max-w-5xl mx-auto">
                        <div className="text-center space-y-4">
                            <span className="text-sm font-bold uppercase tracking-wider bg-[#3A6FA8]/10 text-[#3A6FA8] px-4 py-1.5 rounded-full">
                                Savings Resources
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-[#3A6FA8]">Explore Our Databases</h2>
                            <p className="text-lg md:text-xl text-black font-semibold max-w-2xl mx-auto">
                                Search through active medical assistance programs and co-pay coupons directly from the landing page.
                            </p>
                            
                            {/* Tabs Control */}
                            <div className="flex bg-[#3A6FA8]/5 p-2 rounded-xl max-w-lg mx-auto mt-4">
                                <button
                                    onClick={() => setActiveTab('programs')}
                                    className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-lg font-bold transition-all ${
                                        activeTab === 'programs'
                                            ? 'bg-white text-[#3A6FA8] shadow-md'
                                            : 'text-black hover:text-[#3A6FA8]'
                                    }`}
                                >
                                    <HeartHandshake className="w-5 h-5" /> Assistance Programs
                                </button>
                                <button
                                    onClick={() => setActiveTab('coupons')}
                                    className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-lg font-bold transition-all ${
                                        activeTab === 'coupons'
                                            ? 'bg-white text-[#3A6FA8] shadow-md'
                                            : 'text-black hover:text-[#3A6FA8]'
                                    }`}
                                >
                                    <Percent className="w-5 h-5" /> Discount Coupons
                                </button>
                            </div>
                        </div>

                        {activeTab === 'programs' ? (
                            <div className="space-y-8 animate-in fade-in duration-200">
                                {/* Search Bar for Programs */}
                                <form onSubmit={handleProgramsSearch} className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto bg-white p-3 rounded-2xl border-2 border-border shadow-md">
                                    <div className="relative flex-1 flex items-center">
                                        <Search className="absolute left-3.5 w-5 h-5 text-black" />
                                        <Input
                                            type="text"
                                            placeholder="Search by diagnosis or program title (e.g. Cancer, Diabetes)..."
                                            value={programQuery}
                                            onChange={(e) => setProgramQuery(e.target.value)}
                                            className="pl-12 pr-4 py-6 rounded-xl border-none bg-transparent text-lg text-black placeholder:text-gray-500 font-semibold w-full shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-1.5 bg-slate-100 border border-border rounded-xl px-2 py-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setIsNationalProgram(true)}
                                                className={`rounded-lg font-extrabold text-sm px-4 py-2 transition-all ${
                                                    isNationalProgram ? 'bg-[#3A6FA8] text-white shadow-md' : 'text-black hover:text-[#3A6FA8]'
                                                }`}
                                            >
                                                National
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsNationalProgram(false)}
                                                className={`rounded-lg font-extrabold text-sm px-4 py-2 transition-all ${
                                                    !isNationalProgram ? 'bg-[#3A6FA8] text-white shadow-md' : 'text-black hover:text-[#3A6FA8]'
                                                }`}
                                            >
                                                State
                                            </button>
                                        </div>
                                        <Button type="submit" className="rounded-xl bg-[#3A6FA8] hover:bg-[#3A6FA8]/90 text-white font-extrabold text-lg px-8 shadow-md">
                                            Search
                                        </Button>
                                    </div>
                                </form>

                                {/* Programs List */}
                                {isLoadingPrograms ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="bg-white border-2 border-border rounded-2xl p-6 space-y-4 animate-pulse shadow-sm">
                                                <div className="h-6 bg-slate-100 rounded w-2/3"></div>
                                                <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                                                <div className="h-16 bg-slate-100 rounded w-full"></div>
                                                <div className="h-8 bg-slate-100 rounded w-1/4"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : programs.length > 0 ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {programs.map((program) => (
                                                <div
                                                    key={program.id}
                                                    className="bg-white border-2 border-border hover:border-[#3A6FA8]/50 hover:shadow-lg rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                                                    onClick={() => setSelectedProgram(program)}
                                                >
                                                    <div>
                                                        <div className="flex items-start justify-between gap-3">
                                                            <h3 className="font-extrabold text-xl md:text-2xl text-black hover:text-[#3A6FA8] transition-colors line-clamp-1">
                                                                {program.title}
                                                            </h3>
                                                            <span className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shrink-0 ${
                                                                program.isNational 
                                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                            }`}>
                                                                {program.isNational ? 'National' : 'State'}
                                                            </span>
                                                        </div>

                                                        {program.providedBy && (
                                                            <p className="text-sm font-extrabold text-[#3A6FA8] mt-2 flex items-center gap-1.5">
                                                                <Building2 className="w-4 h-4" /> {program.providedBy}
                                                            </p>
                                                        )}

                                                        <p className="text-base text-black font-semibold mt-4 line-clamp-2 leading-relaxed">
                                                            {program.summary || program.programDetails || "No program details available."}
                                                        </p>
                                                    </div>

                                                    <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-sm">
                                                        <span className="text-sm text-black font-bold truncate max-w-[200px]">
                                                            {program.phone ? `Phone: ${program.phone}` : ''}
                                                        </span>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="text-[#3A6FA8] hover:text-white hover:bg-[#3A6FA8] font-extrabold px-4 py-2 h-9 rounded-lg text-sm"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* View All Programs button */}
                                        <div className="flex justify-center pt-4">
                                            <Button asChild variant="outline" className="rounded-xl border-2 border-[#3A6FA8] text-[#3A6FA8] hover:bg-[#3A6FA8] hover:text-white font-extrabold text-lg px-8 py-4">
                                                <Link href="/programs">
                                                    View All {programsCount > 0 ? `${programsCount.toLocaleString()} ` : ''}Programs <ArrowRight className="ml-2 w-5 h-5" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-16 text-center border-2 border-dashed border-border rounded-2xl bg-white shadow-sm">
                                        <HeartHandshake className="w-16 h-16 text-black/60 mx-auto mb-4" />
                                        <h3 className="text-xl font-extrabold text-black mb-1">No Programs Found</h3>
                                        <p className="text-black font-bold text-base max-w-md mx-auto">
                                            Try adjusting your search terms to find active assistance programs.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in duration-200">
                                {/* Search Bar for Coupons */}
                                <form onSubmit={handleCouponsSearch} className="flex gap-3 max-w-3xl mx-auto bg-white p-3 rounded-2xl border-2 border-border shadow-md">
                                    <div className="relative flex-1 flex items-center">
                                        <Search className="absolute left-3.5 w-5 h-5 text-black" />
                                        <Input
                                            type="text"
                                            placeholder="Search by brand name or coupon offer (e.g. Quillivant)..."
                                            value={couponQuery}
                                            onChange={(e) => setCouponQuery(e.target.value)}
                                            className="pl-12 pr-4 py-6 rounded-xl border-none bg-transparent text-lg text-black placeholder:text-gray-500 font-semibold w-full shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                    <Button type="submit" className="rounded-xl bg-[#3A6FA8] hover:bg-[#3A6FA8]/90 text-white font-extrabold text-lg px-8 shadow-md">
                                        Search
                                    </Button>
                                </form>

                                {/* Coupons List */}
                                {isLoadingCoupons ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="bg-white border-2 border-border rounded-2xl p-6 space-y-4 animate-pulse shadow-sm">
                                                <div className="h-6 bg-slate-100 rounded w-2/3"></div>
                                                <div className="h-16 bg-slate-100 rounded w-full"></div>
                                                <div className="h-8 bg-slate-100 rounded w-1/4"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : coupons.length > 0 ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {coupons.map((coupon) => {
                                                const displayName = coupon.name || (coupon.drugs && coupon.drugs.length > 0 ? coupon.drugs[0].name : "Co-pay Card");
                                                return (
                                                    <div
                                                        key={coupon.id}
                                                        className="bg-white border-2 border-border hover:border-[#3A6FA8]/50 hover:shadow-lg rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                                                        onClick={() => setSelectedCoupon(coupon)}
                                                    >
                                                        <div>
                                                            <div className="flex items-start justify-between gap-3">
                                                                <h3 className="font-extrabold text-xl md:text-2xl text-black hover:text-[#3A6FA8] transition-colors line-clamp-1">
                                                                    {displayName}
                                                                </h3>
                                                                <span className="text-xs font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1 shrink-0">
                                                                    Co-pay Card
                                                                </span>
                                                            </div>

                                                            <p className="text-base text-black font-semibold mt-4 line-clamp-2 leading-relaxed">
                                                                {coupon.details || "No coupon details provided."}
                                                            </p>

                                                            {coupon.expirationDate && (
                                                                <div className="flex items-center gap-2 text-sm text-black font-bold mt-4">
                                                                    <Calendar className="w-4 h-4 text-[#3A6FA8]" />
                                                                    <span>Expires: {coupon.expirationDate}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-sm">
                                                            <span className="text-xs text-black font-bold">
                                                                {coupon.lastUpdated ? `Updated: ${coupon.lastUpdated.split(' ')[0]}` : ''}
                                                            </span>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="text-[#3A6FA8] hover:text-white hover:bg-[#3A6FA8] font-extrabold px-4 py-2 h-9 rounded-lg text-sm"
                                                            >
                                                                Claim Offer
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* View All Coupons button */}
                                        <div className="flex justify-center pt-4">
                                            <Button asChild variant="outline" className="rounded-xl border-2 border-[#3A6FA8] text-[#3A6FA8] hover:bg-[#3A6FA8] hover:text-white font-extrabold text-lg px-8 py-4">
                                                <Link href="/coupons">
                                                    View All {couponsCount > 0 ? `${couponsCount.toLocaleString()} ` : ''}Coupons <ArrowRight className="ml-2 w-5 h-5" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-16 text-center border-2 border-dashed border-border rounded-2xl bg-white shadow-sm">
                                        <Percent className="w-16 h-16 text-black/60 mx-auto mb-4" />
                                        <h3 className="text-xl font-extrabold text-black mb-1">No Coupons Found</h3>
                                        <p className="text-black font-bold text-base max-w-md mx-auto">
                                            Try searching for another brand-name drug.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Interactive Live Mock Simulator - Borderless, blends with page background */}
                    <section className="bg-transparent rounded-none p-0 max-w-3xl mx-auto space-y-6">
                        <div className="border-b border-border/40 pb-4">
                            <h2 className="text-3xl font-serif font-extrabold text-[#3A6FA8] flex items-center gap-2">
                                <Zap className="text-[#3A6FA8] w-7 h-7" /> Multi-Drug Recipe Simulator
                            </h2>
                            <p className="text-base text-black font-semibold mt-2">
                                Test how our technology works by combining multiple medications of common use.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left: Input controls */}
                            <div className="space-y-4">
                                <div className="p-5 bg-white border-2 border-border rounded-xl space-y-2 shadow-sm">
                                    <span className="text-sm font-extrabold text-[#3A6FA8] uppercase flex items-center gap-1.5">
                                        <Pill className="w-4 h-4 text-[#3A6FA8]" /> Configured Medication
                                    </span>
                                    <p className="font-extrabold text-lg text-black">LIPITOR 20 MG TABLET</p>
                                    <p className="text-xs text-black/80 font-bold">Estimated savings at local pharmacies compared to copay.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-base font-extrabold text-black uppercase block mb-1">Your Current Copay per Month</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-extrabold text-black text-lg">$</span>
                                        <Input
                                            type="number"
                                            value={mockCopay}
                                            onChange={(e) => setMockCopay(e.target.value)}
                                            className="pl-7 h-12 rounded-lg border-border focus-visible:ring-[#3A6FA8] w-full text-lg font-bold shadow-none bg-white text-black"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Real-time Optimized Results */}
                            <div className="bg-white border-2 border-border shadow-sm rounded-xl p-6 flex flex-col justify-between">
                                <div>
                                    <span className="text-xs font-extrabold uppercase tracking-wider bg-[#3A6FA8]/10 text-[#3A6FA8] px-3.5 py-1 rounded-full">Optimization Result</span>
                                    <div className="mt-4 flex justify-between items-baseline">
                                        <span className="text-base font-bold text-black">Optimized Cost (CVS/Walgreens):</span>
                                        <span className="text-3xl font-extrabold text-[#3A6FA8]">${mockOptTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="mt-2 text-sm text-black font-bold">
                                        * Based on negotiated discount rates via NeedyMeds coupons.
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border/40 mt-4 flex justify-between items-center">
                                    <span className="text-lg font-extrabold text-black">Net Monthly Savings:</span>
                                    <span className="text-3xl font-black text-[#3A6FA8]">
                                        {mockSavings > 0 ? `$${mockSavings.toFixed(2)}` : '$0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Grid - Glassmorphism cards */}
                    <section id="how-it-works" className="space-y-12">
                        <div className="text-center space-y-2">
                            <h2 className="text-4xl font-serif font-extrabold text-[#3A6FA8]">Premium Features to Maximize Savings</h2>
                            <p className="text-xl text-black font-semibold max-w-2xl mx-auto mt-3">
                                We go beyond simple price comparisons. Discover our innovative tools designed to make saving effortless and engaging.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1: AI Scanner */}
                            <div className="bg-white border-2 border-border p-8 hover:border-[#3A6FA8]/60 hover:shadow-lg rounded-2xl transition-all duration-300 flex flex-col items-center text-center shadow-sm group space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#3A6FA8]/10 flex items-center justify-center text-[#3A6FA8] group-hover:scale-110 transition-transform">
                                    <Camera className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-extrabold text-black group-hover:text-[#3A6FA8] transition-colors">AI Prescription Scanner</h3>
                                <p className="text-base text-black font-semibold mt-2 leading-relaxed">
                                    Snap a photo of your prescription or receipt. Our AI instantly extracts the medication details and calculates your potential savings.
                                </p>
                            </div>

                            {/* Feature 2: Price Heatmap */}
                            <div className="bg-white border-2 border-border p-8 hover:border-[#3A6FA8]/60 hover:shadow-lg rounded-2xl transition-all duration-300 flex flex-col items-center text-center shadow-sm group space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#3A6FA8]/10 flex items-center justify-center text-[#3A6FA8] group-hover:scale-110 transition-transform">
                                    <Map className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-extrabold text-black group-hover:text-[#3A6FA8] transition-colors">Interactive Price Heatmap</h3>
                                <p className="text-base text-black font-semibold mt-2 leading-relaxed">
                                    Visualize local pharmacy prices on a beautiful interactive map. Easily spot the cheapest options in your neighborhood at a glance.
                                </p>
                            </div>

                            {/* Feature 3: Price Alerts */}
                            <div className="bg-white border-2 border-border p-8 hover:border-[#3A6FA8]/60 hover:shadow-lg rounded-2xl transition-all duration-300 flex flex-col items-center text-center shadow-sm group space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#3A6FA8]/10 flex items-center justify-center text-[#3A6FA8] group-hover:scale-110 transition-transform">
                                    <Bell className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-extrabold text-black group-hover:text-[#3A6FA8] transition-colors">Smart Price Alerts</h3>
                                <p className="text-base text-black font-semibold mt-2 leading-relaxed">
                                    Set up alerts like flight trackers. We'll notify you instantly if a coupon value increases or a cheaper generic alternative becomes available.
                                </p>
                            </div>

                            {/* Feature 4: Gamification */}
                            <div className="bg-white border-2 border-border p-8 hover:border-[#3A6FA8]/60 hover:shadow-lg rounded-2xl transition-all duration-300 flex flex-col items-center text-center shadow-sm group space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#3A6FA8]/10 flex items-center justify-center text-[#3A6FA8] group-hover:scale-110 transition-transform">
                                    <Trophy className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-extrabold text-black group-hover:text-[#3A6FA8] transition-colors">Savings Milestones</h3>
                                <p className="text-base text-black font-semibold mt-2 leading-relaxed">
                                    Turn savings into a rewarding experience. Track your total dollars saved, unlock milestones, and visualize how your savings fund your personal goals.
                                </p>
                            </div>

                            {/* Feature 5: Family & Pets */}
                            <div className="bg-white border-2 border-border p-8 hover:border-[#3A6FA8]/60 hover:shadow-lg rounded-2xl transition-all duration-300 flex flex-col items-center text-center shadow-sm group space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#3A6FA8]/10 flex items-center justify-center text-[#3A6FA8] group-hover:scale-110 transition-transform">
                                    <Users className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-extrabold text-black group-hover:text-[#3A6FA8] transition-colors">Family & Pet Profiles</h3>
                                <p className="text-base text-black font-semibold mt-2 leading-relaxed">
                                    Manage prescriptions for your entire household in one place. Includes profiles for kids, elderly parents, and even your furry friends.
                                </p>
                            </div>

                            {/* Feature 6: AI Assistant */}
                            <div className="bg-white border-2 border-border p-8 hover:border-[#3A6FA8]/60 hover:shadow-lg rounded-2xl transition-all duration-300 flex flex-col items-center text-center shadow-sm group space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#3A6FA8]/10 flex items-center justify-center text-[#3A6FA8] group-hover:scale-110 transition-transform">
                                    <Bot className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-extrabold text-black group-hover:text-[#3A6FA8] transition-colors">AI Therapy Assistant</h3>
                                <p className="text-base text-black font-semibold mt-2 leading-relaxed">
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
                            <h2 className="text-4xl font-serif font-extrabold text-[#3A6FA8]">Real savings, right at the counter</h2>
                            <p className="text-xl text-black font-semibold leading-relaxed">
                                Forget complicated mail-order forms or waiting weeks for reimbursements. Simply show the digital discount card generated by pricemymeds directly from your phone to your local pharmacist.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-[#3A6FA8]/15 p-1.5 rounded-full"><CheckCircle2 className="w-5 h-5 text-[#3A6FA8]" /></div>
                                    <span className="text-lg font-bold text-black">Instant price drops applied before you pay.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-[#3A6FA8]/15 p-1.5 rounded-full"><CheckCircle2 className="w-5 h-5 text-[#3A6FA8]" /></div>
                                    <span className="text-lg font-bold text-black">Accepted at over 65,000 national chains.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Story Block 2: Family & Pets */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-16 pb-8">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-serif font-extrabold text-[#3A6FA8]">One profile for the whole family (and pets!)</h2>
                            <p className="text-xl text-black font-semibold leading-relaxed">
                                Keep track of all your dependents' medications under one single account. From your children's antibiotics to your furry friend's joint supplements, pricemymeds finds the lowest cost for everyone you care about.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-[#3A6FA8]/15 p-1.5 rounded-full"><CheckCircle2 className="w-5 h-5 text-[#3A6FA8]" /></div>
                                    <span className="text-lg font-bold text-black">Unlimited dependent profiles included for free.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-[#3A6FA8]/15 p-1.5 rounded-full"><CheckCircle2 className="w-5 h-5 text-[#3A6FA8]" /></div>
                                    <span className="text-lg font-bold text-black">Share the discount card with family members instantly.</span>
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
                            <h2 className="text-4xl font-serif font-extrabold text-[#3A6FA8] flex items-center gap-2">
                                <Info className="w-7 h-7 text-[#3A6FA8]" /> Did you know that importing can save you up to 80%?
                            </h2>
                            <p className="text-lg text-black font-semibold leading-relaxed">
                                Brand-name medication prices in the US are often excessive. We compare approved alternatives from certified Canadian pharmacies to give you the safest and cheapest option.
                            </p>
                        </div>

                        <div className="space-y-6 bg-white p-8 rounded-2xl border-2 border-border shadow-md">
                            <div>
                                <div className="flex justify-between mb-2 text-sm font-extrabold text-black tracking-wider">
                                    <span>AVERAGE US PRICE</span>
                                    <span className="text-lg font-black text-black">$450.00</span>
                                </div>
                                <div className="w-full bg-[#1A1C2E]/10 rounded-full h-4">
                                    <div className="bg-[#1A1C2E] h-4 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2 text-sm font-extrabold text-black tracking-wider">
                                    <span>IMPORTED CANADA PRICE</span>
                                    <span className="text-lg font-black text-[#3A6FA8]">$85.00</span>
                                </div>
                                <div className="w-full bg-[#3A6FA8]/10 rounded-full h-4 relative flex items-center">
                                    <div className="bg-[#3A6FA8] h-4 rounded-full" style={{ width: '19%' }}></div>
                                    <span className="absolute right-2 text-xs font-black text-[#3A6FA8]">You Save 81%</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* NeedyMeds Card Details Finder - Borderless Blended Card with Solid Accent Border */}
                    <section className="bg-white border-l-8 border-2 border-[#3A6FA8] rounded-2xl p-8 md:p-10 shadow-md relative overflow-hidden">
                        <div className="space-y-6 max-w-2xl">
                            <span className="inline-flex items-center text-[#3A6FA8] bg-[#3A6FA8]/10 text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                                Free Discount Card
                            </span>
                            <h2 className="text-4xl font-serif font-extrabold text-[#3A6FA8] leading-tight flex items-center gap-2">
                                <CreditCard className="w-7 h-7 text-[#3A6FA8]" /> Official pricemymeds Card by NeedyMeds
                            </h2>
                            <p className="text-lg text-black font-semibold leading-relaxed">
                                Accepted at over 65,000 pharmacies nationwide. Present these credentials to the pharmacist to instantly apply the discount.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/40 font-mono text-base text-black">
                                <div>
                                    <span className="block text-xs text-black/60 font-extrabold uppercase tracking-wider">BIN</span>
                                    <span className="text-xl font-extrabold text-black bg-slate-50 px-3 py-2 rounded-lg border border-border inline-block mt-1 font-mono">019520</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-black/60 font-extrabold uppercase tracking-wider">PCN</span>
                                    <span className="text-xl font-extrabold text-black bg-slate-50 px-3 py-2 rounded-lg border border-border inline-block mt-1 font-mono">NMeds</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-black/60 font-extrabold uppercase tracking-wider">GRP</span>
                                    <span className="text-xl font-extrabold text-black bg-slate-50 px-3 py-2 rounded-lg border border-border inline-block mt-1 font-mono">DRUGCARD</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-black/60 font-extrabold uppercase tracking-wider">Patient ID</span>
                                    <span className="text-xl font-extrabold text-black bg-slate-50 px-3 py-2 rounded-lg border border-border inline-block mt-1 font-mono truncate max-w-full">NMNA73366378</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Trust Banner */}
                    <section className="text-center space-y-4 max-w-xl mx-auto">
                        <div className="flex justify-center gap-1">
                            <Heart className="w-8 h-8 text-[#3A6FA8] fill-current animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-serif font-extrabold text-black">Join over 1.2 million people saving today</h2>
                        <p className="text-lg text-black font-semibold">
                            Totally free. No registration fees or mandatory subscriptions required to compare.
                        </p>
                        <div className="pt-2">
                            <Button asChild className="h-16 px-12 rounded-xl font-extrabold text-xl bg-[#3A6FA8] hover:bg-[#3A6FA8]/90 text-white shadow-md">
                                <Link href="/register">
                                    Register Now
                                </Link>
                            </Button>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section id="faq" className="max-w-3xl mx-auto space-y-8 pt-12 pb-12">
                        <div className="text-center space-y-2">
                            <h2 className="text-4xl font-serif font-extrabold text-[#3A6FA8]">Frequently Asked Questions</h2>
                            <p className="text-xl text-black font-semibold mt-3">
                                Everything you need to know about pricemymeds.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-2xl border-2 border-border shadow-md text-left flex flex-col items-start">
                                <h3 className="font-extrabold text-[#3A6FA8] mb-3 text-xl">How much does it cost?</h3>
                                <p className="text-base text-black font-semibold leading-relaxed">pricemymeds is completely free to use. There are no subscriptions or hidden fees. We help you find the best NeedyMeds coupons.</p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border-2 border-border shadow-md text-left flex flex-col items-start">
                                <h3 className="font-extrabold text-[#3A6FA8] mb-3 text-xl">Do I need to change my pharmacy?</h3>
                                <p className="text-base text-black font-semibold leading-relaxed">No. Our optimizer shows you prices at your current pharmacy and nearby alternatives. The choice is always yours.</p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border-2 border-border shadow-md text-left flex flex-col items-start">
                                <h3 className="font-extrabold text-[#3A6FA8] mb-3 text-xl">Can I use this with Medicare?</h3>
                                <p className="text-base text-black font-semibold leading-relaxed">Yes, but you cannot combine our coupons with your insurance at the register. You can choose whichever price is lower.</p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border-2 border-border shadow-md text-left flex flex-col items-start">
                                <h3 className="font-extrabold text-[#3A6FA8] mb-3 text-xl">Can I find pet medication?</h3>
                                <p className="text-base text-black font-semibold leading-relaxed">Absolutely! Many pet medications are human drugs. You can use our coupons at normal pharmacies to save on your furry friend's health.</p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border-2 border-border shadow-md text-left flex flex-col items-start">
                                <h3 className="font-extrabold text-[#3A6FA8] mb-3 text-xl">How do you make money if it's free?</h3>
                                <p className="text-base text-black font-semibold leading-relaxed">We receive a small administrative fee from the pharmacy networks when you use our coupons, at zero extra cost to you.</p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border-2 border-border shadow-md text-left flex flex-col items-start">
                                <h3 className="font-extrabold text-[#3A6FA8] mb-3 text-xl">Is my data secure?</h3>
                                <p className="text-base text-black font-semibold leading-relaxed">Yes. We use banking-level encryption and we strictly comply with privacy regulations to ensure your medical data is never sold.</p>
                            </div>
                        </div>
                    </section>

                </main>

                {/* Footer */}
                <footer className="border-t-2 border-border mt-16 bg-white py-12 px-6">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-base text-black font-bold">
                        <div className="flex items-center gap-2 font-serif font-extrabold text-lg text-[#3A6FA8]">
                            <img src="/logo1.png" alt="pricemymeds Logo" className="w-6 h-6 object-contain rounded-sm" />
                            pricemymeds
                        </div>
                        <div>
                            © {new Date().getFullYear()} pricemymeds. All rights reserved.
                        </div>
                        <div className="flex gap-6">
                            <Link href="/login" className="hover:underline hover:text-[#3A6FA8]">Log In</Link>
                            <Link href="/register" className="hover:underline hover:text-[#3A6FA8]">Create Account</Link>
                            <Link href="/terms" className="hover:underline hover:text-[#3A6FA8]">Terms & Conditions</Link>
                            <Link href="/privacy" className="hover:underline hover:text-[#3A6FA8]">Privacy Policy</Link>
                        </div>
                    </div>
                </footer>

                {/* Bottom Navigation for Mobile */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-border px-6 py-3 pb-safe flex justify-between items-center md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
                    <Link href="/login" className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-[60px] h-[36px] flex items-center justify-center text-black">
                            <Search size={24} />
                        </div>
                        <span className="text-xs font-extrabold text-black">Search</span>
                    </Link>

                    <Link href="/register" className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="bg-[#3A6FA8] text-white w-[60px] h-[36px] rounded-full flex items-center justify-center shadow-sm">
                            <Sparkles size={24} />
                        </div>
                        <span className="text-xs font-extrabold text-[#3A6FA8]">Get Started</span>
                    </Link>

                    <Link href="/login" className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-[60px] h-[36px] flex items-center justify-center text-black">
                            <CreditCard size={24} />
                        </div>
                        <span className="text-xs font-extrabold text-black">Card</span>
                    </Link>
                </div>

                {/* Details Modals */}
                {selectedProgram && (
                    <div className="fixed inset-0 bg-[#1A1C2E]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white border-2 border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 shadow-2xl animate-in fade-in zoom-in duration-200 text-left">
                            
                            {/* Modal Header */}
                            <div className="flex items-start justify-between pb-4 border-b border-border/60">
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                        <span className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                                            selectedProgram.isNational 
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                        }`}>
                                            {selectedProgram.isNational ? 'National Assistance' : 'State Assistance'}
                                        </span>
                                        {selectedProgram.updateDate && (
                                            <span className="text-xs text-black font-extrabold">Updated: {selectedProgram.updateDate}</span>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-serif font-extrabold text-[#3A6FA8] leading-snug">
                                        {selectedProgram.title}
                                    </h3>
                                    {selectedProgram.providedBy && (
                                        <p className="text-base font-extrabold text-black mt-2 flex items-center gap-1.5">
                                            <Building2 className="w-5 h-5 text-[#3A6FA8]" /> Provided by: {selectedProgram.providedBy}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedProgram(null)}
                                    className="text-[#3A6FA8] hover:text-[#3A6FA8] hover:bg-[#3A6FA8]/10 rounded-full w-10 h-10 p-0 shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Modal Content */}
                            <div className="mt-6 space-y-6 text-base">
                                
                                {/* Program Description */}
                                <div className="space-y-2">
                                    <h4 className="font-extrabold text-[#3A6FA8] text-sm uppercase tracking-wider">Program Overview</h4>
                                    <p className="text-black font-semibold leading-relaxed">
                                        {selectedProgram.programDetails || selectedProgram.summary || "No detailed description available."}
                                    </p>
                                </div>

                                {/* Quick Info Badges */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-border">
                                    <div>
                                        <span className="text-xs text-black uppercase font-extrabold tracking-wider">Eligible Age Groups</span>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {selectedProgram.ageGroups && selectedProgram.ageGroups.length > 0 ? (
                                                selectedProgram.ageGroups.map((age, i) => (
                                                    <span key={i} className="bg-white text-black text-xs font-bold px-2.5 py-1 rounded border border-border">{age}</span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-black font-bold">General Public</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-black uppercase font-extrabold tracking-wider">Areas of Service</span>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {selectedProgram.areasOfService && selectedProgram.areasOfService.length > 0 ? (
                                                selectedProgram.areasOfService.map((area, i) => (
                                                    <span key={i} className="bg-white text-black text-xs font-bold px-2.5 py-1 rounded border border-border">{area}</span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-black font-bold">United States</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Eligibility Guidelines */}
                                {selectedProgram.eligibilityGuidelines && selectedProgram.eligibilityGuidelines.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-extrabold text-[#3A6FA8] text-sm uppercase tracking-wider flex items-center gap-1.5">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Eligibility Guidelines
                                        </h4>
                                        <ul className="list-disc pl-5 space-y-1 text-black font-semibold">
                                            {selectedProgram.eligibilityGuidelines.map((guideline, i) => (
                                                <li key={i}>{guideline}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Applications / Forms */}
                                {selectedProgram.applications && selectedProgram.applications.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-extrabold text-[#3A6FA8] text-sm uppercase tracking-wider flex items-center gap-1.5">
                                            <FileText className="w-5 h-5 text-[#3A6FA8]" /> Program Applications
                                        </h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {selectedProgram.applications.map((app, i) => (
                                                <a 
                                                    key={i} 
                                                    href={app.link || "#"} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-4 rounded-lg border-2 border-border hover:bg-slate-50 transition-colors"
                                                >
                                                    <span className="font-bold text-black text-sm">{app.name || "Download Application Form"}</span>
                                                    <span className="text-[#3A6FA8] hover:underline text-sm font-extrabold flex items-center gap-1">
                                                        Go to Form <Globe className="w-4 h-4" />
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Services Provided */}
                                {selectedProgram.services && selectedProgram.services.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-extrabold text-[#3A6FA8] text-sm uppercase tracking-wider">Services Provided</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProgram.services.map((srv) => (
                                                <span key={srv.id} className="bg-[#3A6FA8]/5 text-[#3A6FA8] text-xs font-bold px-3 py-1.5 rounded-full border border-[#3A6FA8]/20">
                                                    {srv.service}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Covered Diagnoses */}
                                {selectedProgram.diagnoses && selectedProgram.diagnoses.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-extrabold text-[#3A6FA8] text-sm uppercase tracking-wider">Covered Diagnoses</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProgram.diagnoses.map((diag) => (
                                                <span key={diag.id} className="bg-slate-100 text-black text-xs font-bold px-3 py-1.5 rounded-full border border-border" title={diag.details}>
                                                    {diag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Contact Details */}
                                <div className="pt-4 border-t border-border/40 space-y-3">
                                    <h4 className="font-extrabold text-[#3A6FA8] text-sm uppercase tracking-wider">Program Contacts</h4>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-black font-semibold">
                                        {selectedProgram.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-[#3A6FA8] shrink-0" />
                                                <span>Phone: <strong>{selectedProgram.phone}</strong> {selectedProgram.altPhone && `(Alt: ${selectedProgram.altPhone})`}</span>
                                            </div>
                                        )}
                                        {selectedProgram.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-[#3A6FA8] shrink-0" />
                                                <span>Email: <strong>{selectedProgram.email}</strong></span>
                                            </div>
                                        )}
                                        {selectedProgram.address && selectedProgram.address.address && (
                                            <div className="flex items-start gap-2 sm:col-span-2 mt-1">
                                                <MapPin className="w-4 h-4 text-[#3A6FA8] shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-extrabold text-[#3A6FA8]">Program Mailing Address:</p>
                                                    <p>{selectedProgram.address.title || selectedProgram.address.attn}</p>
                                                    <p>{selectedProgram.address.address} {selectedProgram.address.address2}</p>
                                                    <p>{selectedProgram.address.city}, {selectedProgram.address.state} {selectedProgram.address.postalCode}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-8 pt-4 border-t border-border/60 flex justify-between items-center">
                                <span className="text-xs text-black font-extrabold">Verify details with the provider before applying.</span>
                                <div className="flex gap-2">
                                    {selectedProgram.programWebsite && (
                                        <a 
                                            href={selectedProgram.programWebsite} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            <Button className="rounded-xl bg-[#3A6FA8] text-white font-extrabold text-sm px-5 py-3 shadow-md">
                                                Visit Program Website
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {selectedCoupon && (
                    <div className="fixed inset-0 bg-[#1A1C2E]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white border-2 border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 shadow-2xl animate-in fade-in zoom-in duration-200 text-left">
                            
                            {/* Modal Header */}
                            <div className="flex items-start justify-between pb-4 border-b border-border/60">
                                <div>
                                    <span className="text-xs font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full inline-block mb-2">
                                        Manufacturer Offer
                                    </span>
                                    <h3 className="text-2xl font-serif font-extrabold text-[#3A6FA8] leading-snug">
                                        {selectedCoupon.name || (selectedCoupon.drugs && selectedCoupon.drugs.length > 0 ? selectedCoupon.drugs[0].name : "Co-pay Card Offer")}
                                    </h3>
                                    {selectedCoupon.lastUpdated && (
                                        <p className="text-xs text-black font-extrabold mt-1">Verified status as of: {selectedCoupon.lastUpdated}</p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedCoupon(null)}
                                    className="text-[#3A6FA8] hover:text-[#3A6FA8] hover:bg-[#3A6FA8]/10 rounded-full w-10 h-10 p-0 shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Modal Content */}
                            <div className="mt-6 space-y-6 text-base">
                                
                                {/* Offer Description */}
                                <div className="space-y-2">
                                    <h4 className="font-extrabold text-[#3A6FA8] text-sm uppercase tracking-wider">Offer Details</h4>
                                    <p className="text-black font-semibold leading-relaxed">
                                        {selectedCoupon.details || "No coupon details provided."}
                                    </p>
                                </div>

                                {/* Validity & Requirements */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-border">
                                    <div>
                                        <span className="text-xs text-black uppercase font-extrabold tracking-wider">Expiration Date</span>
                                        <p className="text-sm font-bold text-black mt-1 flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-[#3A6FA8]" /> {selectedCoupon.expirationDate || "No Expiration Date"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-black uppercase font-extrabold tracking-wider">Activation Required By</span>
                                        <p className="text-sm font-bold text-black mt-1 uppercase">
                                            {selectedCoupon.activateBy === "PAT" ? "Patient Self-Activation" : selectedCoupon.activateBy || "General Activation"}
                                        </p>
                                    </div>
                                </div>

                                {/* Coverage & Requirements */}
                                {selectedCoupon.coverageRequirements && (
                                    <div className="space-y-2">
                                        <h4 className="font-extrabold text-[#3A6FA8] text-sm uppercase tracking-wider flex items-center gap-1.5">
                                            <ShieldAlert className="w-5 h-5 text-amber-500" /> Coverage / Eligibility Requirements
                                        </h4>
                                        <p className="text-black font-semibold leading-relaxed">
                                            {selectedCoupon.coverageRequirements}
                                        </p>
                                    </div>
                                )}

                                {/* Covered Drugs list */}
                                {selectedCoupon.drugs && selectedCoupon.drugs.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-extrabold text-[#3A6FA8] text-sm uppercase tracking-wider">Covered Medications</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCoupon.drugs.map((drug) => (
                                                <span key={drug.id} className="bg-[#3A6FA8]/5 text-[#3A6FA8] text-xs font-bold px-3 py-1.5 rounded-full border border-[#3A6FA8]/20">
                                                    {drug.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Support Contact Details */}
                                <div className="pt-4 border-t border-border/40 space-y-3">
                                    <h4 className="font-extrabold text-[#3A6FA8] text-sm uppercase tracking-wider">Manufacturer Support Contact</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-black font-semibold">
                                        {selectedCoupon.patientSupportNumber && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-[#3A6FA8] shrink-0" />
                                                <span>Patient Support: <strong>{selectedCoupon.patientSupportNumber}</strong></span>
                                            </div>
                                        )}
                                        {selectedCoupon.pharmacySupportNumber && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-[#3A6FA8] shrink-0" />
                                                <span>Pharmacy Support: <strong>{selectedCoupon.pharmacySupportNumber}</strong></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-8 pt-4 border-t border-border/60 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <span className="text-xs text-black font-extrabold">Verify terms on the manufacturer's website.</span>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    {selectedCoupon.printPDF && (
                                        <a href={selectedCoupon.printPDF} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                                            <Button variant="outline" className="w-full rounded-xl text-sm font-extrabold px-5 py-3 flex items-center justify-center gap-1.5 shadow-md">
                                                <FileDown className="w-4 h-4" /> Download PDF Coupon
                                            </Button>
                                        </a>
                                    )}
                                    {selectedCoupon.manufacturerOfferWebsite && (
                                        <a href={selectedCoupon.manufacturerOfferWebsite} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                                            <Button className="w-full rounded-xl bg-[#3A6FA8] text-white font-extrabold text-sm px-5 py-3 flex items-center justify-center gap-1.5 shadow-md">
                                                Visit Offer Site <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </>
    );
}
