import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Bell, CreditCard, ArrowRight, Search, Heart, ShieldCheck, MapPin, CheckCircle2, Shuffle, Zap, Pill, Info } from 'lucide-react';
import { useState } from 'react';

export default function Welcome() {
    const [mockCopay, setMockCopay] = useState('180');
    const [searchQuery, setSearchQuery] = useState('');

    // Live calculated mock data for interactive bundle simulator
    const mockOptTotal = 42.50;
    const mockSavings = parseFloat(mockCopay) - mockOptTotal;

    return (
        <>
            <Head>
                <title>RxSaver - Save on Your Medications | Multi-Drug Prescription Optimizer</title>
                <meta name="description" content="Compare prescription prices and optimize your medication basket. Save up to 80% using discount coupons and price drop alarms." />
                <meta name="keywords" content="prescription, medication discounts, NeedyMeds, prescription optimizer, compare pharmacies, price alarms" />
                <meta property="og:title" content="RxSaver - Save on Your Medications" />
                <meta property="og:description" content="Optimize your medication basket and find the most convenient or cheapest pharmacy near you." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="min-h-screen bg-[#FAFAFA] text-[#1A1C2E] font-sans antialiased pb-24 md:pb-0 selection:bg-[#3A6FA8]/20">

                {/* Header Navigation */}
                <header className="bg-white border-b border-border/40 px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
                    <div className="text-2xl font-serif font-bold tracking-tight text-[#3A6FA8] flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-[#3A6FA8]" />
                        RxSaver
                    </div>
                    <nav className="flex gap-4 items-center">
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

                            {/* Integrated Search Bar */}
                            <div className="relative max-w-xl">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="text-muted-foreground w-5 h-5" />
                                </div>
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white border-border/80 rounded-xl h-[54px] pl-12 pr-[120px] text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-[#3A6FA8] focus-visible:ring-2 shadow-sm"
                                    placeholder="Search medication name (e.g. Lipitor)..."
                                />
                                <Button className="absolute right-1.5 top-1.5 bottom-1.5 h-auto px-5 rounded-lg bg-[#3A6FA8] text-white font-semibold text-sm hover:bg-[#3A6FA8]/90">
                                    Search
                                </Button>
                            </div>
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

                    {/* Features Grid - Borderless blending cards */}
                    <section id="how-it-works" className="space-y-12">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-serif font-bold text-[#1A1C2E]">Three smart ways to save</h2>
                            <p className="text-sm text-[#6A6C7D] max-w-lg mx-auto">
                                Designed especially for seniors. Simple, clear, and fully supported.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-transparent rounded-none p-0 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-[#3A6FA8]/10 flex items-center justify-center text-[#3A6FA8]">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1A1C2E]">1 Stop Option (Convenience)</h3>
                                <p className="text-sm text-[#6A6C7D] leading-relaxed">
                                    We calculate which local pharmacy chain offers the lowest cumulative price for your entire prescription, saving you extra trips.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-transparent rounded-none p-0 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-[#3A6FA8]/15 flex items-center justify-center text-[#3A6FA8]">
                                    <Shuffle className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1A1C2E]">Balanced Split (Max 2 Stops)</h3>
                                <p className="text-sm text-[#6A6C7D] leading-relaxed">
                                    We split your recipe across at most two pharmacy brands. Perfect for maximizing savings without complicating your daily logistics.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-transparent rounded-none p-0 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-[#3A6FA8]/10 flex items-center justify-center text-[#3A6FA8]">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1A1C2E]">Smart Price Alerts</h3>
                                <p className="text-sm text-[#6A6C7D] leading-relaxed">
                                    We monitor prices automatically. If your recurring medication cost falls below your target price, we'll email you.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* US vs Canada price comparison callout - Borderless Blended Container */}
                    <section className="bg-transparent rounded-none grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
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
                                <CreditCard className="w-7 h-7 text-[#3A6FA8]" /> Official RxSaver Card by NeedyMeds
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

                </main>

                {/* Footer */}
                <footer className="border-t border-border/40 mt-12 bg-white py-12 px-6">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-[#6A6C7D]">
                        <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#3A6FA8]">
                            <ShieldCheck className="w-5 h-5" /> RxSaver
                        </div>
                        <div>
                            © {new Date().getFullYear()} RxSaver. All rights reserved.
                        </div>
                        <div className="flex gap-4">
                            <Link href="/login" className="hover:underline">Log In</Link>
                            <Link href="/register" className="hover:underline">Create Account</Link>
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
