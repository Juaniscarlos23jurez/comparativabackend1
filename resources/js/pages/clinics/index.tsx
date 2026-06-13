import { Head } from '@inertiajs/react';
import { 
    MapPin, 
    Phone, 
    Globe, 
    Clock, 
    Languages, 
    DollarSign, 
    Building2, 
    SlidersHorizontal, 
    ChevronLeft, 
    ChevronRight, 
    X,
    HeartPulse,
    Activity,
    Brain,
    ShieldAlert
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Clinic = {
    id: string;
    createdAt: string;
    name: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
    website?: string;
    fees: string;
    income: string;
    hours: string;
    accepts?: string[];
    languagesSpoken?: string[];
    serviceArea?: string[];
    isDental: boolean;
    isMedical: boolean;
    isMentalHealth: boolean;
    isSubstance: boolean;
};

export default function ClinicsIndex() {
    // API Query States
    const [postalCode, setPostalCode] = useState('88595');
    const [radius, setRadius] = useState('63');
    const [clinicType, setClinicType] = useState('medical');
    const [page, setPage] = useState<number>(0);
    const [rows, setRows] = useState<string>("10");
    const [orderBy, setOrderBy] = useState<string>("name");
    const [order, setOrder] = useState<string>("ASC");

    // UI & Loading States
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [searchTrigger, setSearchTrigger] = useState<number>(0);

    useEffect(() => {
        let isMounted = true;
        const fetchClinics = async () => {
            setIsLoading(true);

            try {
                const response = await fetch('/api/clinics', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    },
                    body: JSON.stringify({
                        postalCode,
                        radius,
                        clinicType,
                        rows,
                        page: page.toString(),
                        order,
                        orderBy,
                        runSearch: true,
                        from: "Clinic-context useEffect end search",
                        chips: []
                    })
                });

                if (response.ok && isMounted) {
                    const data = await response.json();

                    if (data) {
                        setClinics(data.clinics || []);
                        setTotalCount(data.count || 0);
                    }
                }
            } catch (error) {
                console.error('Error fetching clinics:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchClinics();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clinicType, page, rows, orderBy, order, searchTrigger]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        setSearchTrigger(prev => prev + 1);
    };

    const totalPages = Math.ceil(totalCount / parseInt(rows));

    return (
        <>
            <Head title="Free & Low-Cost Clinics Finder" />
            <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full bg-transparent text-foreground">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <MapPin className="text-primary w-8 h-8" /> Free & Low-Cost Clinics Finder
                        </h1>
                        <p className="text-muted-foreground mt-2 text-base max-w-3xl">
                            Find community health clinics, dental clinics, sliding scale locations, and free mental health facilities in your local area based on your zip code.
                        </p>
                    </div>
                    
                    {/* Clinic Type Selection Quicktabs */}
                    <div className="flex items-center gap-2 shrink-0 bg-muted p-1 rounded-xl">
                        {[
                            { value: 'medical', label: 'Medical', icon: HeartPulse },
                            { value: 'dental', label: 'Dental', icon: Activity },
                            { value: 'mental', label: 'Mental Health', icon: Brain },
                        ].map((tab) => {
                            const IconComponent = tab.icon;

                            return (
                                <button
                                    key={tab.value}
                                    onClick={() => {
 setClinicType(tab.value); setPage(0); 
}}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
                                        clinicType === tab.value
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <IconComponent className="w-3.5 h-3.5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Search Inputs */}
                <div className="bg-card border border-border rounded-2xl shadow-sm p-5 space-y-4">
                    <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">ZIP Code</label>
                            <Input
                                type="text"
                                placeholder="Enter ZIP Code..."
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                className="py-5 rounded-xl border-border/80 bg-transparent text-sm w-full shadow-none focus-visible:ring-primary font-semibold"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Search Radius (Miles)</label>
                            <Input
                                type="number"
                                placeholder="Radius..."
                                value={radius}
                                onChange={(e) => setRadius(e.target.value)}
                                className="py-5 rounded-xl border-border/80 bg-transparent text-sm w-full shadow-none focus-visible:ring-primary font-semibold"
                            />
                        </div>
                        <div className="flex gap-2 sm:col-span-2">
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`rounded-xl flex items-center justify-center gap-1.5 py-5 flex-1 ${showFilters ? 'bg-muted border-primary text-primary' : ''}`}
                            >
                                <SlidersHorizontal className="w-4 h-4" /> Config Filters
                            </Button>
                            <Button 
                                type="submit" 
                                className="rounded-xl bg-primary hover:bg-primary/95 text-white font-bold py-5 px-8 shadow-sm flex-1"
                            >
                                Search Clinics
                            </Button>
                        </div>
                    </form>

                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/40 text-xs animate-in slide-in-from-top-2 duration-200">
                            <div>
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Order By</label>
                                <select 
                                    value={orderBy} 
                                    onChange={(e) => {
 setOrderBy(e.target.value); setPage(0); 
}}
                                    className="w-full bg-transparent border border-border/80 rounded-lg p-2 text-foreground focus:ring-1 focus:ring-primary"
                                >
                                    <option value="name">Clinic Name</option>
                                    <option value="city">City</option>
                                    <option value="state">State</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Sort Direction</label>
                                <select 
                                    value={order} 
                                    onChange={(e) => {
 setOrder(e.target.value); setPage(0); 
}}
                                    className="w-full bg-transparent border border-border/80 rounded-lg p-2 text-foreground focus:ring-1 focus:ring-primary"
                                >
                                    <option value="ASC">Ascending (A-Z)</option>
                                    <option value="DESC">Descending (Z-A)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Limit Results</label>
                                <select 
                                    value={rows} 
                                    onChange={(e) => {
 setRows(e.target.value); setPage(0); 
}}
                                    className="w-full bg-transparent border border-border/80 rounded-lg p-2 text-foreground focus:ring-1 focus:ring-primary"
                                >
                                    <option value="10">10 Clinics</option>
                                    <option value="20">20 Clinics</option>
                                    <option value="50">50 Clinics</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Clinics Results Listing */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-card border border-border/60 rounded-2xl p-6 space-y-4 animate-pulse">
                                <div className="h-5 bg-muted rounded w-2/3"></div>
                                <div className="h-4 bg-muted rounded w-1/3"></div>
                                <div className="h-12 bg-muted rounded w-full"></div>
                                <div className="h-8 bg-muted rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                ) : clinics.length > 0 ? (
                    <div className="space-y-6">
                        <div className="text-xs text-muted-foreground font-semibold flex items-center justify-between px-1">
                            <span>Found {totalCount.toLocaleString()} clinics within {radius} miles of {postalCode}</span>
                            <span>Page {page + 1} of {totalPages || 1}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {clinics.map((clinic) => (
                                <div 
                                    key={clinic.id}
                                    className="bg-card border border-border/70 hover:border-primary/50 hover:shadow-md rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                                    onClick={() => setSelectedClinic(clinic)}
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="font-bold text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                                                {clinic.name}
                                            </h3>
                                            <div className="flex gap-1 shrink-0 flex-wrap max-w-[120px]">
                                                {clinic.isMedical && <span className="text-[8px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 px-2 py-0.5 rounded-full">Med</span>}
                                                {clinic.isDental && <span className="text-[8px] font-bold uppercase tracking-wider bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400 px-2 py-0.5 rounded-full">Dent</span>}
                                                {clinic.isMentalHealth && <span className="text-[8px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-400 px-2 py-0.5 rounded-full">Mental</span>}
                                            </div>
                                        </div>

                                        <p className="text-xs font-semibold text-muted-foreground/80 mt-1 flex items-center gap-1">
                                            <Building2 className="w-3.5 h-3.5" /> {clinic.address}{clinic.address2 ? `, ${clinic.address2}` : ''}, {clinic.city}, {clinic.state} {clinic.postalCode}
                                        </p>

                                        <p className="text-xs text-muted-foreground/90 mt-4 leading-relaxed line-clamp-2">
                                            <strong>Cost Structure:</strong> {clinic.fees || "Sliding scale based on patient income"}
                                        </p>

                                        <p className="text-[11px] text-muted-foreground/85 mt-1">
                                            <strong>Accepts:</strong> {clinic.accepts && clinic.accepts.length > 0 ? clinic.accepts[0] : "All income levels accepted"}
                                        </p>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1 text-muted-foreground font-semibold">
                                            <Phone className="w-3.5 h-3.5 text-primary" /> {clinic.phone}
                                        </span>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-primary hover:text-primary-foreground hover:bg-primary font-bold px-3 py-1 h-7 rounded-lg"
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
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
                        <MapPin className="w-12 h-12 text-muted-foreground/60 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-1">No Clinics Found</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            We couldn't locate any community health clinics near ZIP code {postalCode}. Try expanding the search radius or validating the postal code.
                        </p>
                    </div>
                )}

                {/* Clinic Details Modal */}
                {selectedClinic && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                            
                            {/* Modal Header */}
                            <div className="flex items-start justify-between pb-4 border-b border-border/60">
                                <div>
                                    <div className="flex gap-1.5 mb-1.5 flex-wrap">
                                        {selectedClinic.isMedical && <span className="text-[8px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 px-2.5 py-0.5 rounded-full">Medical Care</span>}
                                        {selectedClinic.isDental && <span className="text-[8px] font-bold uppercase tracking-wider bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400 px-2.5 py-0.5 rounded-full">Dental Care</span>}
                                        {selectedClinic.isMentalHealth && <span className="text-[8px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-400 px-2.5 py-0.5 rounded-full">Mental Health</span>}
                                        {selectedClinic.isSubstance && <span className="text-[8px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 px-2.5 py-0.5 rounded-full">Substance Abuse Care</span>}
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-foreground leading-snug">
                                        {selectedClinic.name}
                                    </h3>
                                    <p className="text-xs font-semibold text-muted-foreground mt-1 flex items-center gap-1">
                                        <Building2 className="w-4 h-4" /> {selectedClinic.address}{selectedClinic.address2 ? `, ${selectedClinic.address2}` : ''}, {selectedClinic.city}, {selectedClinic.state} {selectedClinic.postalCode}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedClinic(null)}
                                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full w-8 h-8 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Modal Content */}
                            <div className="mt-6 space-y-6 text-sm">
                                
                                {/* Fees & Scale Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/40">
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                                            <DollarSign className="w-4 h-4 text-emerald-600" /> Fees & Costs
                                        </span>
                                        <p className="text-xs font-semibold text-foreground leading-relaxed">{selectedClinic.fees}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                                            <ShieldAlert className="w-4 h-4 text-primary" /> Income Guidelines
                                        </span>
                                        <p className="text-xs font-semibold text-foreground leading-relaxed">{selectedClinic.income}</p>
                                    </div>
                                </div>

                                {/* Patient Eligibility & Coverage */}
                                <div className="space-y-2">
                                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Patient Qualifications</h4>
                                    <div className="p-3 bg-muted/10 border border-border/60 rounded-lg text-xs leading-relaxed text-muted-foreground">
                                        <p className="mb-2"><strong>Accepted Groups:</strong> {selectedClinic.accepts && selectedClinic.accepts.length > 0 ? selectedClinic.accepts.join(', ') : 'All populations (Uninsured, Medicare, Medicaid)'}</p>
                                        <p><strong>Languages Spoken:</strong> {selectedClinic.languagesSpoken && selectedClinic.languagesSpoken.length > 0 ? selectedClinic.languagesSpoken.join(', ') : 'English'}</p>
                                    </div>
                                </div>

                                {/* Service Area & Hours */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                                            <Clock className="w-4 h-4 text-primary" /> Hours of Operation
                                        </span>
                                        <p className="text-xs font-medium text-foreground leading-relaxed">{selectedClinic.hours}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                                            <Languages className="w-4 h-4 text-primary" /> Service Area
                                        </span>
                                        <p className="text-xs font-medium text-foreground leading-relaxed">{selectedClinic.serviceArea && selectedClinic.serviceArea.length > 0 ? selectedClinic.serviceArea.join(', ') : 'Local Community'}</p>
                                    </div>
                                </div>

                                {/* Google Maps directions link */}
                                <div className="pt-4 border-t border-border/40 flex flex-col gap-3">
                                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Directions</h4>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedClinic.name + ' ' + selectedClinic.address + ' ' + selectedClinic.city + ' ' + selectedClinic.state + ' ' + selectedClinic.postalCode)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-xs flex items-center gap-1 font-semibold"
                                    >
                                        <MapPin className="w-4 h-4 text-primary" /> Get Directions on Google Maps
                                    </a>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-8 pt-4 border-t border-border/60 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <span className="text-[10px] text-muted-foreground font-semibold">Contact the clinic to verify operational hours before visiting.</span>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    {selectedClinic.website && (
                                        <a href={selectedClinic.website} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                                            <Button className="w-full rounded-xl bg-primary text-white font-bold text-xs px-4 py-2 flex items-center justify-center gap-1">
                                                Visit Clinic Site <Globe className="w-3.5 h-3.5" />
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

ClinicsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Clinics Finder',
            href: '/clinics',
        },
    ],
};
