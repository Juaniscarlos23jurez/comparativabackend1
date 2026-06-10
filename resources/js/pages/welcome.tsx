import { Head, Link } from '@inertiajs/react';
import { IconSearch, IconPill, IconArrowRight, IconShieldCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Welcome() {
    return (
        <>
            <Head title="RxSaver - Senior-Friendly Prescription Savings" />
            
            <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24 md:pb-0">
                {/* Header Navigation */}
                <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
                    <div className="text-2xl font-serif font-bold tracking-tight text-primary flex items-center gap-2">
                        <IconShieldCheck size={32} />
                        RxSaver
                    </div>
                    <nav className="hidden md:flex gap-4 items-center">
                        <Link href="/login" className="text-muted-foreground hover:text-foreground font-semibold text-[17px] transition-colors">
                            Log in
                        </Link>
                        <Button asChild className="h-12 px-6 rounded-xl font-semibold text-[17px] bg-primary text-primary-foreground">
                            <Link href="/register">
                                Register
                            </Link>
                        </Button>
                    </nav>
                </header>

                <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
                    {/* Hero Section */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-[44px] leading-snug font-serif font-bold text-foreground mb-4">
                            Find Affordable Meds
                        </h1>
                        <p className="text-lg leading-relaxed text-muted-foreground mb-8 max-w-lg mx-auto">
                            Compare prices across pharmacies and save money on your prescriptions today.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-lg mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <IconSearch size={24} className="text-muted-foreground" />
                            </div>
                            <Input
                                type="text"
                                className="w-full bg-card border-border rounded-2xl h-[60px] pl-12 pr-[120px] text-[18px] text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-2 shadow-sm"
                                placeholder="Search medication name..."
                            />
                            <Button className="absolute right-2 top-2 bottom-2 h-auto px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-[17px] hover:bg-primary/90">
                                Search
                            </Button>
                        </div>
                    </div>

                    {/* Content Container */}
                    <div className="space-y-8 mt-12">
                        
                        {/* Popular Meds */}
                        <section>
                            <h2 className="text-xl font-serif font-bold text-foreground mb-4">
                                Most Searched Medications
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="outline" className="h-12 px-6 rounded-full text-[17px] font-semibold bg-muted border-border text-foreground hover:bg-secondary">
                                    Atorvastatin
                                </Button>
                                <Button variant="outline" className="h-12 px-6 rounded-full text-[17px] font-semibold bg-muted border-border text-foreground hover:bg-secondary">
                                    Lisinopril
                                </Button>
                                <Button variant="outline" className="h-12 px-6 rounded-full text-[17px] font-semibold bg-muted border-border text-foreground hover:bg-secondary">
                                    Levothyroxine
                                </Button>
                            </div>
                        </section>

                        {/* US vs Canada Bar Example */}
                        <section className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                            <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                                Did you know?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                Purchasing internationally can save you hundreds of dollars on brand-name medications.
                            </p>
                            
                            <div className="space-y-5">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-us-price text-lg">US Price</span>
                                        <span className="font-bold text-us-price text-2xl">$450.00</span>
                                    </div>
                                    <div className="w-full bg-us-price/20 rounded-full h-5">
                                        <div className="bg-us-price h-5 rounded-full" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-ca-price text-lg">Canada Price</span>
                                        <span className="font-bold text-ca-price text-2xl">$85.00</span>
                                    </div>
                                    <div className="w-full bg-ca-price/20 rounded-full h-5 relative flex items-center">
                                        <div className="bg-ca-price h-5 rounded-full z-10" style={{ width: '25%' }}></div>
                                        <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-end pr-3 items-center z-0">
                                            <span className="text-[15px] font-bold text-savings">Save 81%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Medication Price Cards */}
                        <section>
                            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                                Local Pharmacy Prices
                            </h2>
                            
                            <div className="space-y-4">
                                {/* Highlighted Card */}
                                <Card className="rounded-2xl p-0 overflow-hidden border-border shadow-sm relative border-l-4 border-l-primary">
                                    <CardContent className="p-5 pt-6 flex flex-col gap-5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-[22px] font-serif font-bold text-foreground">
                                                    Walgreens Pharmacy
                                                </h3>
                                                <p className="text-[17px] text-muted-foreground mt-1">0.8 miles away</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[32px] font-bold text-savings mb-1 leading-none tracking-tight">
                                                    $12.50
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button className="flex-1 h-14 bg-savings text-savings-foreground hover:bg-savings/90 text-lg font-semibold rounded-xl">
                                                Get Coupon
                                            </Button>
                                            <Button variant="outline" className="h-14 w-14 px-0 border-primary text-primary hover:bg-secondary rounded-xl shrink-0">
                                                <IconArrowRight size={28} />
                                                <span className="sr-only">View Details</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Normal Card */}
                                <Card className="rounded-2xl p-0 overflow-hidden border-border shadow-sm">
                                    <CardContent className="p-5 pt-6 flex flex-col gap-5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-[22px] font-serif font-bold text-foreground">
                                                    CVS Pharmacy
                                                </h3>
                                                <p className="text-[17px] text-muted-foreground mt-1">1.2 miles away</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[32px] font-bold text-foreground mb-1 leading-none tracking-tight">
                                                    $24.99
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button className="flex-1 h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-semibold rounded-xl">
                                                Get Coupon
                                            </Button>
                                            <Button variant="outline" className="h-14 w-14 px-0 border-border text-foreground hover:bg-muted rounded-xl shrink-0">
                                                <IconArrowRight size={28} />
                                                <span className="sr-only">View Details</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                    </div>
                </main>

                {/* Bottom Navigation for Mobile */}
                <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 pb-safe flex justify-between items-center md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
                    <button className="flex flex-col items-center gap-1.5" aria-current="page">
                        <div className="bg-primary text-primary-foreground w-[60px] h-[36px] rounded-full flex items-center justify-center">
                            <IconSearch size={22} />
                        </div>
                        <span className="text-[11px] font-bold text-foreground">Search</span>
                    </button>
                    
                    <button className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                        <div className="w-[60px] h-[36px] flex items-center justify-center">
                            <IconPill size={24} />
                        </div>
                        <span className="text-[11px] font-bold">My Meds</span>
                    </button>

                    <button className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                        <div className="w-[60px] h-[36px] flex items-center justify-center">
                            <IconShieldCheck size={24} />
                        </div>
                        <span className="text-[11px] font-bold">Cards</span>
                    </button>
                </div>
            </div>
        </>
    );
}
