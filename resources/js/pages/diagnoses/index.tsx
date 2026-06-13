import { Head } from '@inertiajs/react';
import { 
    Activity, 
    Search, 
    SlidersHorizontal, 
    ChevronLeft, 
    ChevronRight, 
    X,
    Info,
    Calendar,
    BookOpen
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Diagnosis = {
    id: string;
    createdAt: string;
    name: string;
    details?: string;
    hasDetail: boolean;
    lastUpdate?: string;
};

export default function DiagnosesIndex() {
    // API States
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(15);
    const [orderBy, setOrderBy] = useState<string>("diagnosis.name");
    const [order, setOrder] = useState<string>("ASC");

    // UI & Loading States
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const fetchDiagnoses = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/diagnoses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    page,
                    rowsPerPage,
                    order,
                    orderBy,
                    name: searchQuery,
                    from: "DiagnosisContextProviderAutocomplete"
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setDiagnoses(data.diagnoses || []);
                    setTotalCount(data.count || 0);
                }
            }
        } catch (error) {
            console.error('Error fetching diagnoses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDiagnoses();
    }, [page, rowsPerPage, orderBy, order]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        fetchDiagnoses();
    };

    const totalPages = Math.ceil(totalCount / rowsPerPage);

    // Clean details text replacing formatting placeholders like ¶
    const cleanDetails = (text?: string) => {
        if (!text) return "No details available.";
        return text.split('¶').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;
            return <p key={index} className="mb-4 leading-relaxed text-muted-foreground">{trimmed}</p>;
        });
    };

    return (
        <>
            <Head title="Diagnoses & Disease Directory" />
            <div className="flex flex-col gap-8 p-4 md:p-8 max-w-6xl mx-auto w-full bg-transparent text-foreground">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <Activity className="text-primary w-8 h-8" /> Medical Diagnoses Directory
                        </h1>
                        <p className="text-muted-foreground mt-2 text-base max-w-3xl">
                            Search and explore information databases for medical diagnoses. Learn details about disease management, educational savings resources, and related savings programs.
                        </p>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-card border border-border rounded-2xl shadow-sm p-4 space-y-4">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search diagnoses and medical conditions (e.g. Cancer, Asthma, Diabetes)..."
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
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Sort Field</label>
                                <select 
                                    value={orderBy} 
                                    onChange={(e) => { setOrderBy(e.target.value); setPage(0); }}
                                    className="w-full bg-transparent border border-border/80 rounded-lg p-2 text-foreground focus:ring-1 focus:ring-primary"
                                >
                                    <option value="diagnosis.name">Diagnosis Name</option>
                                    <option value="diagnosis.createdAt">Created Date</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Items Per Page</label>
                                <select 
                                    value={rowsPerPage.toString()} 
                                    onChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
                                    className="w-full bg-transparent border border-border/80 rounded-lg p-2 text-foreground focus:ring-1 focus:ring-primary"
                                >
                                    <option value="15">15 Diagnoses</option>
                                    <option value="30">30 Diagnoses</option>
                                    <option value="50">50 Diagnoses</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* List View Table */}
                {isLoading ? (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-4 animate-pulse">
                        {[1, 2, 3, 5, 6].map((i) => (
                            <div key={i} className="h-10 bg-muted rounded w-full"></div>
                        ))}
                    </div>
                ) : diagnoses.length > 0 ? (
                    <div className="space-y-6">
                        <div className="text-xs text-muted-foreground font-semibold flex items-center justify-between px-1">
                            <span>Found {totalCount.toLocaleString()} diagnoses</span>
                            <span>Page {page + 1} of {totalPages || 1}</span>
                        </div>

                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-muted/40 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
                                            <th className="p-4 pl-6">Diagnosis / Disease Name</th>
                                            <th className="p-4">Has Education Info</th>
                                            <th className="p-4 pr-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {diagnoses.map((diag) => (
                                            <tr 
                                                key={diag.id} 
                                                className="hover:bg-muted/20 transition-colors cursor-pointer text-sm"
                                                onClick={() => setSelectedDiagnosis(diag)}
                                            >
                                                <td className="p-4 pl-6 font-bold text-foreground">
                                                    {diag.name}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                                        diag.hasDetail 
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' 
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}>
                                                        {diag.hasDetail ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="p-4 pr-6 text-right">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-primary hover:text-primary-foreground hover:bg-primary font-bold px-3 py-1 h-7 rounded-lg"
                                                    >
                                                        {diag.hasDetail ? 'View Info' : 'Quick Details'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                        <Activity className="w-12 h-12 text-muted-foreground/60 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-1">No Diagnoses Found</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            Try adjusting your search criteria or checking alternative keywords.
                        </p>
                    </div>
                )}

                {/* Details Modal */}
                {selectedDiagnosis && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                            
                            {/* Modal Header */}
                            <div className="flex items-start justify-between pb-4 border-b border-border/60">
                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                                        Diagnosis Profile
                                    </span>
                                    <h3 className="text-xl font-serif font-bold text-foreground leading-snug">
                                        {selectedDiagnosis.name}
                                    </h3>
                                    {selectedDiagnosis.lastUpdate && selectedDiagnosis.lastUpdate !== '""' && (
                                        <p className="text-[10px] text-muted-foreground font-semibold mt-1">Last Updated: {selectedDiagnosis.lastUpdate}</p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedDiagnosis(null)}
                                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full w-8 h-8 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Modal Content */}
                            <div className="mt-6 space-y-6 text-sm">
                                {selectedDiagnosis.hasDetail && selectedDiagnosis.details ? (
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                                            <BookOpen className="w-4 h-4 text-primary" /> Educational & Medical Guides
                                        </h4>
                                        <div className="bg-muted/10 p-4 rounded-xl border border-border/40 text-muted-foreground leading-relaxed">
                                            {cleanDetails(selectedDiagnosis.details)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 py-4 text-center">
                                        <Info className="w-10 h-10 text-muted-foreground/60 mx-auto mb-2" />
                                        <p className="text-muted-foreground text-sm">
                                            General profile for <strong className="text-foreground">{selectedDiagnosis.name}</strong>. No educational booklets or specific savings guides are currently registered under this condition name.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-8 pt-4 border-t border-border/60 flex justify-between items-center text-xs text-muted-foreground">
                                <span>ID: {selectedDiagnosis.id.substring(0, 8)}...</span>
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedDiagnosis(null)}
                                    className="rounded-xl text-xs font-bold px-4 py-2"
                                >
                                    Close Details
                                </Button>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </>
    );
}

DiagnosesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Diagnoses Directory',
            href: '/diagnoses',
        },
    ],
};
