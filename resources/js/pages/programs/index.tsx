import { Head } from '@inertiajs/react';
import { 
    HeartHandshake, 
    Search, 
    MapPin, 
    Phone, 
    Globe, 
    FileText, 
    SlidersHorizontal, 
    ChevronLeft, 
    ChevronRight, 
    Mail, 
    CheckCircle2, 
    X,
    Building2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

export default function ProgramsIndex() {
    // API Query States
    const [searchQuery, setSearchQuery] = useState('');
    const [isNational, setIsNational] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [rows, setRows] = useState<string>("10");
    const [orderBy, setOrderBy] = useState<string>("title");
    const [order, setOrder] = useState<string>("ASC");
    const [type, setType] = useState<string>("dba");
    
    // UI & Loading States
    const [programs, setPrograms] = useState<Program[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [searchTrigger, setSearchTrigger] = useState<number>(0);

    // Fetch programs from backend proxy
    useEffect(() => {
        let isMounted = true;
        const fetchPrograms = async () => {
            setIsLoading(true);

            try {
                const response = await fetch('/api/programs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    },
                    body: JSON.stringify({
                        isNational,
                        rows,
                        page: page.toString(),
                        order,
                        orderBy,
                        type,
                        runSearch: true,
                        from: "Search Tab switch",
                        query: searchQuery // Add custom search query if any
                    })
                });

                if (response.ok && isMounted) {
                    const data = await response.json();

                    if (data) {
                        setPrograms(data.programs || []);
                        setTotalCount(data.count || 0);
                    }
                }
            } catch (error) {
                console.error('Error fetching assistance programs:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchPrograms();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNational, page, rows, orderBy, order, type, searchTrigger]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        setSearchTrigger(prev => prev + 1);
    };

    const totalPages = Math.ceil(totalCount / parseInt(rows));

    return (
        <>
            <Head title="Assistance Programs" />
            <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full bg-transparent text-foreground">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <HeartHandshake className="text-primary w-8 h-8" /> Medical Assistance Programs
                        </h1>
                        <p className="text-muted-foreground mt-2 text-base max-w-3xl">
                            Search thousands of patient assistance programs (PAP), co-pay cards, state programs, and registry directories to help reduce your healthcare and prescription costs.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant={isNational ? "default" : "outline"}
                            onClick={() => {
 setIsNational(true); setPage(0); 
}}
                            className="rounded-full font-semibold text-xs px-4"
                        >
                            National
                        </Button>
                        <Button
                            variant={!isNational ? "default" : "outline"}
                            onClick={() => {
 setIsNational(false); setPage(0); 
}}
                            className="rounded-full font-semibold text-xs px-4"
                        >
                            State & Local
                        </Button>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-card border border-border rounded-2xl shadow-sm p-4 space-y-4">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by diagnosis, service, or program title (e.g. Cancer, Wigs)..."
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

                    {/* Expandable Advanced Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-border/40 text-xs animate-in slide-in-from-top-2 duration-200">
                            <div>
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Program Type</label>
                                <select 
                                    value={type} 
                                    onChange={(e) => {
 setType(e.target.value); setPage(0); 
}}
                                    className="w-full bg-transparent border border-border/80 rounded-lg p-2 text-foreground focus:ring-1 focus:ring-primary"
                                >
                                    <option value="dba">Diagnosis-Based Assistance (DBA)</option>
                                    <option value="pap">Patient Assistance Programs (PAP)</option>
                                    <option value="gov">Government & State Programs</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Sort Field</label>
                                <select 
                                    value={orderBy} 
                                    onChange={(e) => {
 setOrderBy(e.target.value); setPage(0); 
}}
                                    className="w-full bg-transparent border border-border/80 rounded-lg p-2 text-foreground focus:ring-1 focus:ring-primary"
                                >
                                    <option value="title">Program Title</option>
                                    <option value="providedBy">Provider Name</option>
                                    <option value="updateDate">Last Updated</option>
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
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Rows Per Page</label>
                                <select 
                                    value={rows} 
                                    onChange={(e) => {
 setRows(e.target.value); setPage(0); 
}}
                                    className="w-full bg-transparent border border-border/80 rounded-lg p-2 text-foreground focus:ring-1 focus:ring-primary"
                                >
                                    <option value="10">10 Programs</option>
                                    <option value="20">20 Programs</option>
                                    <option value="50">50 Programs</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Results Listing */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-card border border-border/60 rounded-2xl p-6 space-y-4 animate-pulse">
                                <div className="h-5 bg-muted rounded w-2/3"></div>
                                <div className="h-3.5 bg-muted rounded w-1/3"></div>
                                <div className="h-12 bg-muted rounded w-full"></div>
                                <div className="h-8 bg-muted rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                ) : programs.length > 0 ? (
                    <div className="space-y-6">
                        <div className="text-xs text-muted-foreground font-semibold flex items-center justify-between px-1">
                            <span>Found {totalCount.toLocaleString()} programs</span>
                            <span>Page {page + 1} of {totalPages || 1}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {programs.map((program) => (
                                <div 
                                    key={program.id}
                                    className="bg-card border border-border/70 hover:border-primary/50 hover:shadow-md rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                                    onClick={() => setSelectedProgram(program)}
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="font-bold text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                                                {program.title}
                                            </h3>
                                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                program.isNational 
                                                    ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400' 
                                                    : 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-400'
                                            }`}>
                                                {program.isNational ? 'National' : 'State'}
                                            </span>
                                        </div>

                                        {program.providedBy && (
                                            <p className="text-xs font-semibold text-muted-foreground mt-1 flex items-center gap-1">
                                                <Building2 className="w-3.5 h-3.5" /> {program.providedBy}
                                            </p>
                                        )}

                                        <p className="text-xs text-muted-foreground/90 mt-3 line-clamp-3 leading-relaxed">
                                            {program.summary || program.programDetails || "No program details available."}
                                        </p>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-xs">
                                        <div className="flex gap-2">
                                            {program.phone && (
                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                    <Phone className="w-3 h-3" /> {program.phone}
                                                </span>
                                            )}
                                        </div>
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

                        {/* Pagination Footer */}
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
                        <HeartHandshake className="w-12 h-12 text-muted-foreground/60 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-1">No Programs Found</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            Try adjusting your search terms or filters to find active assistance programs.
                        </p>
                    </div>
                )}

                {/* Program Details Modal */}
                {selectedProgram && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                            
                            {/* Modal Header */}
                            <div className="flex items-start justify-between pb-4 border-b border-border/60">
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                            selectedProgram.isNational 
                                                ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400' 
                                                : 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-400'
                                        }`}>
                                            {selectedProgram.isNational ? 'National Assistance' : 'State Assistance'}
                                        </span>
                                        {selectedProgram.updateDate && (
                                            <span className="text-[9px] text-muted-foreground/80 font-medium">Updated: {selectedProgram.updateDate}</span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-foreground leading-snug">
                                        {selectedProgram.title}
                                    </h3>
                                    {selectedProgram.providedBy && (
                                        <p className="text-xs font-semibold text-muted-foreground mt-1">Provided by: {selectedProgram.providedBy}</p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedProgram(null)}
                                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full w-8 h-8 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Modal Content */}
                            <div className="mt-6 space-y-6 text-sm">
                                
                                {/* Program Description */}
                                <div className="space-y-2">
                                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Program Overview</h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {selectedProgram.programDetails || selectedProgram.summary || "No detailed description available."}
                                    </p>
                                </div>

                                {/* Quick Info Badges */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/40">
                                    <div>
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Eligible Age Groups</span>
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {selectedProgram.ageGroups && selectedProgram.ageGroups.length > 0 ? (
                                                selectedProgram.ageGroups.map((age, i) => (
                                                    <span key={i} className="bg-card text-foreground text-[10px] px-2 py-0.5 rounded border border-border/80 font-medium">{age}</span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-muted-foreground">General Public</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Areas of Service</span>
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {selectedProgram.areasOfService && selectedProgram.areasOfService.length > 0 ? (
                                                selectedProgram.areasOfService.map((area, i) => (
                                                    <span key={i} className="bg-card text-foreground text-[10px] px-2 py-0.5 rounded border border-border/80 font-medium">{area}</span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-muted-foreground">United States</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Eligibility Guidelines */}
                                {selectedProgram.eligibilityGuidelines && selectedProgram.eligibilityGuidelines.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Eligibility Guidelines
                                        </h4>
                                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                            {selectedProgram.eligibilityGuidelines.map((guideline, i) => (
                                                <li key={i}>{guideline}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Applications / Forms */}
                                {selectedProgram.applications && selectedProgram.applications.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1">
                                            <FileText className="w-4 h-4 text-primary" /> Program Applications
                                        </h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {selectedProgram.applications.map((app, i) => (
                                                <a 
                                                    key={i} 
                                                    href={app.link || "#"} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                                                >
                                                    <span className="font-semibold text-foreground text-xs">{app.name || "Download Application Form"}</span>
                                                    <span className="text-primary hover:underline text-xs flex items-center gap-0.5">
                                                        Go to Form <Globe className="w-3.5 h-3.5" />
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Services Provided */}
                                {selectedProgram.services && selectedProgram.services.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Services Provided</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedProgram.services.map((srv) => (
                                                <span key={srv.id} className="bg-primary/5 text-primary text-[11px] font-semibold px-2.5 py-1 rounded-full border border-primary/20">
                                                    {srv.service}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Diagnoses Handled */}
                                {selectedProgram.diagnoses && selectedProgram.diagnoses.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Covered Diagnoses</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedProgram.diagnoses.map((diag) => (
                                                <span key={diag.id} className="bg-secondary text-secondary-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full border border-border" title={diag.details}>
                                                    {diag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Contact Details */}
                                <div className="pt-4 border-t border-border/40 space-y-3">
                                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Program Contacts</h4>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                                        {selectedProgram.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                                <span>Phone: <strong>{selectedProgram.phone}</strong> {selectedProgram.altPhone && `(Alt: ${selectedProgram.altPhone})`}</span>
                                            </div>
                                        )}
                                        {selectedProgram.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                                <span>Email: <strong>{selectedProgram.email}</strong></span>
                                            </div>
                                        )}
                                        {selectedProgram.address && selectedProgram.address.address && (
                                            <div className="flex items-start gap-2 sm:col-span-2 mt-1">
                                                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-foreground">Program Mailing Address:</p>
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
                                <span className="text-[10px] text-muted-foreground font-semibold">Verify details with the provider before applying.</span>
                                <div className="flex gap-2">
                                    {selectedProgram.programWebsite && (
                                        <a 
                                            href={selectedProgram.programWebsite} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            <Button className="rounded-xl bg-primary text-white font-bold text-xs px-4 py-2">
                                                Visit Program Website
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

ProgramsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Assistance Programs',
            href: '/programs',
        },
    ],
};
