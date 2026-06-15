import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Heart, Shield } from 'lucide-react';

export default function Privacy() {
    return (
        <>
            <Head>
                <title>MedPrice - Privacy Policy</title>
                <meta name="description" content="Read the Privacy Policy for MedPrice. Discover how we protect your health search and personal information." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="min-h-screen bg-[#F5F2EC] text-[#1A1C2E] font-sans antialiased pb-12 selection:bg-[#3A6FA8]/20">
                {/* Header */}
                <header className="bg-white border-b border-border/40 px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
                    <div className="text-2xl font-serif font-bold tracking-tight text-[#3A6FA8] flex items-center gap-2.5">
                        <img src="/logo.png" alt="MedPrice Logo" className="w-8 h-8 object-contain rounded-md" />
                        MedPrice
                    </div>

                    <Link href="/" className="inline-flex items-center gap-2 text-[#6A6C7D] hover:text-[#1A1C2E] font-semibold text-[15px] transition-colors py-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </header>

                <main className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-8">
                    {/* Header Intro */}
                    <div className="space-y-3 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1A1C2E] tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-base md:text-lg text-[#6A6C7D] font-medium">
                            Last Updated: June 14, 2026. Your privacy and trust are our top priorities.
                        </p>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-border/40 p-6 md:p-10 space-y-10">
                        
                        {/* Privacy Promise Callout (US compliance) */}
                        <div className="bg-[#2E7D52]/5 border-l-4 border-[#2E7D52] p-6 rounded-r-xl space-y-3">
                            <h2 className="text-lg font-bold text-[#2E7D52] flex items-center gap-2">
                                <Shield className="w-5 h-5 flex-shrink-0" />
                                OUR PRIVACY PROMISE
                            </h2>
                            <p className="text-sm text-[#1A1C2E] leading-relaxed">
                                At MedPrice, we believe your health search history is personal. <strong>We do NOT sell, rent, or lease your personal information, contact info, or medication search history</strong> to insurance companies, pharmaceutical manufacturers, or third-party marketers. We monetize solely through administrative processing fees from coupon network partners at checkout, at no cost to you.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-bold text-[#1A1C2E] border-b border-border/40 pb-2">
                                1. Information We Collect
                            </h2>
                            <p className="text-[17px] leading-relaxed text-[#1A1C2E]/90">
                                When you use MedPrice, we collect information to help optimize your drug savings and provide our services. This includes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-[17px] text-[#1A1C2E]/90">
                                <li><strong>Medication Searches:</strong> The names, dosages, and quantities of medications you search for.</li>
                                <li><strong>Location Information:</strong> Your Zip Code and search radius to display the nearest pharmacies and local prices.</li>
                                <li><strong>Account Details:</strong> If you sign up, we save your name, email address, password, and preferences (such as price alerts).</li>
                                <li><strong>Usage and Device Data:</strong> IP address, device identifier, browser type, and operating system collected via analytics tools.</li>
                            </ul>
                        </section>

                        {/* Section 2 */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-bold text-[#1A1C2E] border-b border-border/40 pb-2">
                                2. How We Use Your Information
                            </h2>
                            <p className="text-[17px] leading-relaxed text-[#1A1C2E]/90">
                                We use the collected data strictly for the following purposes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-[17px] text-[#1A1C2E]/90">
                                <li>To compare local pharmacy pricing and calculate your maximum prescription basket savings.</li>
                                <li>To send you price drop notifications (alarms) you explicitly set.</li>
                                <li>To verify eligibility for third-party programs or manufacturer coupon codes (e.g., NeedyMeds programs).</li>
                                <li>To detect, prevent, and address technical errors or security incidents.</li>
                            </ul>
                        </section>

                        {/* Section 3 */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-bold text-[#1A1C2E] border-b border-border/40 pb-2">
                                3. HIPAA Disclaimer
                            </h2>
                            <p className="text-[17px] leading-relaxed text-[#1A1C2E]/90">
                                MedPrice is a consumer-facing tool and is <strong>not</strong> a "covered entity" under the Health Insurance Portability and Accountability Act (HIPAA). Therefore, HIPAA regulations do not apply to the data you input. However, we treat your search queries with the highest level of privacy and handle your health-related information with security standards equivalent to corporate compliance protocols.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-bold text-[#1A1C2E] border-b border-border/40 pb-2">
                                4. Cookies and Tracking Technologies
                            </h2>
                            <p className="text-[17px] leading-relaxed text-[#1A1C2E]/90">
                                We use cookies and standard session tracking to keep you logged in and preserve your zip code settings. Third-party partners (such as analytics providers and coupon network providers) may also use cookies or web beacons to track page conversions when you redeem a coupon code at the counter.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-bold text-[#1A1C2E] border-b border-border/40 pb-2">
                                5. State-Specific Privacy Rights (CCPA / CPRA)
                            </h2>
                            <p className="text-[17px] leading-relaxed text-[#1A1C2E]/90">
                                Under state privacy laws, including the California Consumer Privacy Act (CCPA), residents of certain states have special rights:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-[17px] text-[#1A1C2E]/90">
                                <li><strong>Right to Know:</strong> You can request a summary of the personal data we hold about you.</li>
                                <li><strong>Right to Delete:</strong> You can request that we delete your account and clear your search history.</li>
                                <li><strong>Right to Opt-Out:</strong> Since we do not sell your personal data, opt-out triggers are default-active on our platform.</li>
                            </ul>
                        </section>

                        {/* Section 6 */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-bold text-[#1A1C2E] border-b border-border/40 pb-2">
                                6. Security Standards
                            </h2>
                            <p className="text-[17px] leading-relaxed text-[#1A1C2E]/90">
                                We utilize secure socket layer (SSL) encryption, firewalls, and token-based database design to safeguard your account. Your password is securely encrypted, and we regularly monitor our systems for vulnerabilities.
                            </p>
                        </section>

                        {/* Section 7 */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-bold text-[#1A1C2E] border-b border-border/40 pb-2">
                                7. Contact Privacy Office
                            </h2>
                            <p className="text-[17px] leading-relaxed text-[#1A1C2E]/90">
                                If you wish to delete your account, access your data, or submit a query regarding our privacy practices, please contact us:
                            </p>
                            <div className="bg-[#FAFAFA] rounded-xl p-5 border border-border/40">
                                <p className="font-bold text-[#1A1C2E]">MedPrice Privacy Office</p>
                                <p className="text-sm text-[#6A6C7D] mt-1">Email: privacy@medprice.com</p>
                                <p className="text-sm text-[#6A6C7D]">Address: 1209 North Orange Street, Wilmington, DE 19801</p>
                            </div>
                        </section>
                    </div>

                    {/* Footer inside page */}
                    <div className="text-center pt-6 space-y-4">
                        <div className="flex justify-center gap-1">
                            <Heart className="w-5 h-5 text-[#3A6FA8] fill-current" />
                        </div>
                        <p className="text-xs text-[#6A6C7D]">
                            © {new Date().getFullYear()} MedPrice. All rights reserved.
                        </p>
                        <div className="flex justify-center gap-6 text-xs text-[#3A6FA8] font-semibold">
                            <Link href="/" className="hover:underline">Home</Link>
                            <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
