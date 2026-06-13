import { Head } from '@inertiajs/react';
import { 
    Percent, 
    Search, 
    Calendar, 
    Phone, 
    Globe, 
    SlidersHorizontal, 
    ChevronLeft, 
    ChevronRight, 
    ExternalLink,
    X,
    FileDown,
    Building2,
    ShieldAlert
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Drug = {
    id: string;
    name: string;
    genericName?: string;
    brandName?: string;
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

export default function CouponsIndex() {
    // API States
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState<number>(0);
    const [rows, setRows] = useState<string>("10");
    const [orderBy, setOrderBy] = useState<string>("name");
    const [order, setOrder] = useState<string>("ASC");

    // UI & Loading States
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const fetchCoupons = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/coupons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    rows,
                    page: page.toString(),
                    order,
                    orderBy,
                    from: "coupon-context",
                    query: searchQuery
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setCoupons(data.coupons || []);
                    setTotalCount(data.count || 0);
                }
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [page, rows, orderBy, order]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        fetchCoupons();
    };

    const totalPages = Math.ceil(totalCount / parseInt(rows));

    return (
        <>
            <Head title="Discount Coupons & Co-pay Cards" />
            <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full bg-transparent text-foreground">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <Percent className="text-primary w-8 h-8" /> Manufacturer Co-pay Cards & Coupons
                        </h1>
                        <p className="text-muted-foreground mt-2 text-base max-w-3xl">
                            Find official co-pay savings cards, rebates, and free trial offers direct from pharmaceutical manufacturers. Pay as little as $5 or $25 for brand-name prescriptions.
                        </p>
                    </div>
                </div>

                {/* Search & Filter Options */}
                <div className="bg-card border border-border rounded-2xl shadow-sm p-4 space-y-4">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by brand name, active ingredient, or coupon offer (e.g. Quillivant)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-5 rounded-xl border-border/80 bg-transparent text-sm w-full shadow-none focus-visible:ring-primary"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`rounded-xl flex items-center gap-1.5 px-4 ${showFilters ? 'bg-muted border-primary text-primary' : ''}`}
                            >
                                <SlidersHorizontal className="w-4 h-4" /> Filters
                            </Button>
                            <Button 
                                type="submit" 
                                className="rounded-xl bg-primary hover:bg-primary/95 text-white font-bold px-6 shadow-sm"
                            >
                                Search
                            </Button>
                        </div>
                    </form>

                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/40 text-xs animate-in slide-in-from-top-2 duration-200">
                            <div>
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Sort Field</label>
                                <select 
                                    value={orderBy} 
                                    onChange={(e) => { setOrderBy(e.target.value); setPage(0); }}
                                    className="w-full bg-transparent border border-border/80 rounded-lg p-2 text-foreground focus:ring-1 focus:ring-primary"
                                >
                                    <option value="name">Medication/Coupon Name</option>
                                    <option value="lastUpdated">Last Updated</option>
                                    <option value="expirationDate">Expiration Date</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Sort Direction</label>
                                <select 
                                    value={order} 
                                    onChange={(e) => { setOrder(e.target.value); setPage(0); }}
                                    className="w-full bg-transparent border border-border/80 rounded-lg p-2 text-foreground focus:ring-1 focus:ring-primary"
                                >
                                    <option value="ASC">Ascending (A-Z)</option>
                                    <option value="DESC">Descending (Z-A)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Display Rows</label>
                                <select 
                                    value={rows} 
                                    onChange={(e) => { setRows(e.target.value); setPage(0); }}
                                    className="w-full bg-transparent border border-border/80 rounded-lg p-2 text-foreground focus:ring-1 focus:ring-primary"
                                >
                                    <option value="10">10 Coupons</option>
                                    <option value="20">20 Coupons</option>
                                    <option value="50">50 Coupons</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Coupons Listing */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-card border border-border/60 rounded-2xl p-6 space-y-4 animate-pulse">
                                <div className="h-5 bg-muted rounded w-2/3"></div>
                                <div className="h-12 bg-muted rounded w-full"></div>
                                <div className="h-8 bg-muted rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                ) : coupons.length > 0 ? (
                    <div className="space-y-6">
                        <div className="text-xs text-muted-foreground font-semibold flex items-center justify-between px-1">
                            <span>Found {totalCount.toLocaleString()} manufacturer coupons</span>
                            <span>Page {page + 1} of {totalPages || 1}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {coupons.map((coupon) => {
                                // Extract readable name if blank
                                const displayName = coupon.name || (coupon.drugs && coupon.drugs.length > 0 ? coupon.drugs[0].name : "Co-pay Card");
                                
                                return (
                                    <div 
                                        key={coupon.id}
                                        className="bg-card border border-border/70 hover:border-primary/50 hover:shadow-md rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                                        onClick={() => setSelectedCoupon(coupon)}
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="font-bold text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                                                    {displayName}
                                                </h3>
                                                <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                                    Co-pay Card
                                                </span>
                                            </div>

                                            <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
                                                {coupon.details || "No coupon details provided."}
                                            </p>

                                            {coupon.expirationDate && (
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 mt-4">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>Expires: {coupon.expirationDate}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-xs">
                                            <div>
                                                {coupon.lastUpdated && (
                                                    <span className="text-[10px] text-muted-foreground font-medium">Updated: {coupon.lastUpdated.split(' ')[0]}</span>
                                                )}
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="text-primary hover:text-primary-foreground hover:bg-primary font-bold px-3 py-1 h-7 rounded-lg"
                                            >
                                                Claim Offer
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 pt-6">
                                <Button
                                    variant="outline"
                                    disabled={page === 0}
                                    onClick={() => setPage(page - 1)}
                                    className="rounded-full w-10 h-10 p-0"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <span className="text-sm font-semibold text-foreground">
                                    Page {page + 1} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage(page + 1)}
                                    className="rounded-full w-10 h-10 p-0"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-16 text-center border border-dashed border-border rounded-2xl bg-card">
                        <Percent className="w-12 h-12 text-muted-foreground/60 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-1">No Coupons Found</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            Try searching for another brand-name drug or check active filters.
                        </p>
                    </div>
                )}

                {/* Detail Modal */}
                {selectedCoupon && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                            
                            {/* Modal Header */}
                            <div className="flex items-start justify-between pb-4 border-b border-border/60">
                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                                        Manufacturer Offer
                                    </span>
                                    <h3 className="text-xl font-serif font-bold text-foreground leading-snug">
                                        {selectedCoupon.name || (selectedCoupon.drugs && selectedCoupon.drugs.length > 0 ? selectedCoupon.drugs[0].name : "Co-pay Card Offer")}
                                    </h3>
                                    {selectedCoupon.lastUpdated && (
                                        <p className="text-[10px] text-muted-foreground font-semibold mt-1">Verified status as of: {selectedCoupon.lastUpdated}</p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedCoupon(null)}
                                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full w-8 h-8 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Modal Content */}
                            <div className="mt-6 space-y-6 text-sm">
                                
                                {/* Offer Description */}
                                <div className="space-y-2">
                                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Offer Details</h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {selectedCoupon.details || "No coupon details provided."}
                                    </p>
                                </div>

                                {/* Validity & Requirements */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/40">
                                    <div>
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Expiration Date</span>
                                        <p className="text-xs font-semibold text-foreground mt-1 flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-primary" /> {selectedCoupon.expirationDate || "No Expiration Date"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Activation Required By</span>
                                        <p className="text-xs font-semibold text-foreground mt-1 uppercase">
                                            {selectedCoupon.activateBy === "PAT" ? "Patient Self-Activation" : selectedCoupon.activateBy || "General Activation"}
                                        </p>
                                    </div>
                                </div>

                                {/* Coverage & Requirements */}
                                {selectedCoupon.coverageRequirements && (
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1">
                                            <ShieldAlert className="w-4 h-4 text-amber-500" /> Coverage / Eligibility Requirements
                                        </h4>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {selectedCoupon.coverageRequirements}
                                        </p>
                                    </div>
                                )}

                                {/* Covered Drugs list */}
                                {selectedCoupon.drugs && selectedCoupon.drugs.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Covered Medications</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedCoupon.drugs.map((drug) => (
                                                <span key={drug.id} className="bg-primary/5 text-primary text-[11px] font-semibold px-2.5 py-1 rounded-full border border-primary/20">
                                                    {drug.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Support Contact Details */}
                                <div className="pt-4 border-t border-border/40 space-y-3">
                                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Manufacturer Support Contact</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                                        {selectedCoupon.patientSupportNumber && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                                <span>Patient Support: <strong>{selectedCoupon.patientSupportNumber}</strong></span>
                                            </div>
                                        )}
                                        {selectedCoupon.pharmacySupportNumber && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                                <span>Pharmacy Support: <strong>{selectedCoupon.pharmacySupportNumber}</strong></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-8 pt-4 border-t border-border/60 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <span className="text-[10px] text-muted-foreground font-semibold">Verify terms on the manufacturer's website.</span>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    {selectedCoupon.printPDF && (
                                        <a href={selectedCoupon.printPDF} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                                            <Button variant="outline" className="w-full rounded-xl text-xs font-bold px-4 py-2 flex items-center justify-center gap-1">
                                                <FileDown className="w-4 h-4" /> Download PDF Coupon
                                            </Button>
                                        </a>
                                    )}
                                    {selectedCoupon.manufacturerOfferWebsite && (
                                        <a href={selectedCoupon.manufacturerOfferWebsite} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                                            <Button className="w-full rounded-xl bg-primary text-white font-bold text-xs px-4 py-2 flex items-center justify-center gap-1">
                                                Visit Offer Site <ExternalLink className="w-3.5 h-3.5" />
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

CouponsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Discount Coupons',
            href: '/coupons',
        },
    ],
};
