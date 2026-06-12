import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IconShieldCheck, IconPill, IconUserHeart } from '@tabler/icons-react';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { MdLocalPharmacy, MdLocationPin, MdLocalHospital } from 'react-icons/md';
import { FaPrescriptionBottleAlt, FaRoute } from 'react-icons/fa';
import { SiWalmart } from 'react-icons/si';

export default function OnboardingWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({
        insurance: '',
        age_range: '',
        zip_code: '',
        pharmacy: '',
        radius: '20',
        plan: '',
    });

    const handleNext = (key: string, value: string) => {
        const newAnswers = { ...answers, [key]: value };
        setAnswers(newAnswers);

        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else if (step === 3) {
            setStep(4);
        } else if (step === 4) {
            setStep(5);
        } else {
            // Final step, submit
            setLoading(true);
            router.post('/onboarding', {
                profile_data: newAnswers
            });
        }
    };

    return (
        <>
            <Head title="Welcome to MedPrice" />

            <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
                <header className="bg-card border-b border-border px-4 py-4 shadow-sm flex items-center gap-2">
                    <IconShieldCheck size={32} className="text-primary" />
                    <span className="text-2xl font-serif font-bold tracking-tight text-primary">MedPrice</span>
                </header>

                <main className="flex-1 max-w-xl mx-auto w-full px-4 py-12 md:py-24">
                    <div className="mb-8">
                        <div className="flex gap-2 mb-4">
                            <div className={`h-2 rounded-full flex-1 ${step >= 1 ? 'bg-primary' : 'bg-muted'}`}></div>
                            <div className={`h-2 rounded-full flex-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
                            <div className={`h-2 rounded-full flex-1 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
                            <div className={`h-2 rounded-full flex-1 ${step >= 4 ? 'bg-primary' : 'bg-muted'}`}></div>
                            <div className={`h-2 rounded-full flex-1 ${step >= 5 ? 'bg-primary' : 'bg-muted'}`}></div>
                        </div>
                        <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">
                            Step {step} of 5
                        </p>
                    </div>

                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
                                To help you better, tell us how you pay for your medications today.
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                We want to find the cheapest options for your exact situation.
                            </p>

                            <div className="grid gap-4 mt-8">
                                <Button
                                    variant="outline"
                                    className="h-auto p-5 justify-start text-left text-lg font-semibold rounded-2xl border-border whitespace-normal hover:bg-muted"
                                    onClick={() => handleNext('insurance', 'uninsured')}
                                >
                                    <div className="bg-primary/10 p-3 rounded-full mr-4 text-primary shrink-0">
                                        <IconUserHeart size={28} />
                                    </div>
                                    I don't have health insurance (or pay out of pocket)
                                </Button>

                                <Button
                                    variant="outline"
                                    className="h-auto p-5 justify-start text-left text-lg font-semibold rounded-2xl border-border whitespace-normal hover:bg-muted"
                                    onClick={() => handleNext('insurance', 'high_copay')}
                                >
                                    <div className="bg-primary/10 p-3 rounded-full mr-4 text-primary shrink-0">
                                        <IconShieldCheck size={28} />
                                    </div>
                                    I have insurance, but my copays are too high
                                </Button>

                                <Button
                                    variant="outline"
                                    className="h-auto p-5 justify-start text-left text-lg font-semibold rounded-2xl border-border whitespace-normal hover:bg-muted"
                                    onClick={() => handleNext('insurance', 'medicare')}
                                >
                                    <div className="bg-primary/10 p-3 rounded-full mr-4 text-primary shrink-0">
                                        <IconShieldCheck size={28} />
                                    </div>
                                    I have Medicare (Part D)
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
                                What is your age group? (Optional)
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                This helps us find age-specific discounts like Medicare or senior savings.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                {['18-34', '35-50', '51-64', '65+'].map(age => (
                                    <Button
                                        key={age}
                                        variant={answers.age_range === age ? 'default' : 'outline'}
                                        className={`h-16 text-xl font-semibold rounded-2xl ${answers.age_range === age ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:bg-muted'}`}
                                        onClick={() => setAnswers({ ...answers, age_range: age })}
                                    >
                                        {age}
                                    </Button>
                                ))}
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-16 text-xl font-semibold rounded-2xl border-border hover:bg-muted"
                                    onClick={() => handleNext('age_range', answers.age_range || 'prefer_not_to_say')}
                                >
                                    Skip
                                </Button>
                                <Button
                                    className="flex-1 h-16 text-xl font-semibold rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
                                    onClick={() => handleNext('age_range', answers.age_range)}
                                    disabled={!answers.age_range}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight flex items-center gap-3">
                                <MdLocationPin className="text-primary text-5xl shrink-0" />
                                <div>Where are you located?</div>
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Enter your ZIP code so we can find the best pharmacy prices near you.
                            </p>

                            <div className="mt-8 space-y-4">
                                <Input
                                    type="text"
                                    placeholder="e.g. 90210"
                                    className="h-16 text-xl rounded-2xl px-6 bg-card border-border shadow-sm focus-visible:ring-primary"
                                    value={answers.zip_code}
                                    onChange={(e) => setAnswers({ ...answers, zip_code: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                                    disabled={loading}
                                    maxLength={5}
                                />

                                <Button
                                    className="w-full h-16 text-xl font-semibold rounded-2xl bg-primary text-primary-foreground mt-4 hover:bg-primary/90"
                                    onClick={() => handleNext('zip_code', answers.zip_code)}
                                    disabled={loading || !answers.zip_code || answers.zip_code.length < 5}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
                                Pharmacy Preferences
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Tell us your favorite pharmacy and how far you're willing to travel.
                            </p>

                            <div className="mt-8 space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                        <MdLocalPharmacy className="text-primary" /> Preferred Pharmacy
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { name: 'CVS', icon: FaPrescriptionBottleAlt },
                                            { name: 'Walgreens', icon: MdLocalPharmacy },
                                            { name: 'Walmart', icon: SiWalmart },
                                            { name: 'Local Pharmacy', icon: MdLocalHospital }
                                        ].map(pharma => (
                                            <Button
                                                key={pharma.name}
                                                variant={answers.pharmacy === pharma.name ? 'default' : 'outline'}
                                                className={`h-auto py-4 flex flex-col items-center gap-2 text-lg rounded-xl ${answers.pharmacy === pharma.name ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground'} hover:border-primary/50`}
                                                onClick={() => setAnswers({ ...answers, pharmacy: pharma.name })}
                                            >
                                                <pharma.icon size={28} />
                                                <span className="text-base font-semibold">{pharma.name}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-xl font-semibold flex items-center gap-2">
                                            <FaRoute className="text-primary" /> Maximum Distance
                                        </h3>
                                        <span className="text-xl font-bold text-primary">{answers.radius} miles</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={answers.radius}
                                        onChange={(e) => setAnswers({ ...answers, radius: e.target.value })}
                                        className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <div className="flex justify-between text-sm text-muted-foreground mt-2 font-medium">
                                        <span>1 mi</span>
                                        <span>100 mi</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-16 text-xl font-semibold rounded-2xl bg-primary text-primary-foreground mt-8 hover:bg-primary/90"
                                    onClick={() => handleNext('radius', answers.radius)}
                                    disabled={!answers.pharmacy || !answers.radius}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
                                Choose your savings plan
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Select the MedPrice plan that best fits your needs. You can change this anytime.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                <Card className="relative overflow-hidden rounded-2xl border-border hover:border-primary transition-colors cursor-pointer shadow-sm" onClick={() => handleNext('plan', 'free')}>
                                    <CardContent className="p-6">
                                        <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Basic Free</h3>
                                        <div className="text-3xl font-bold text-foreground mb-4">$0 <span className="text-lg text-muted-foreground font-normal">/month</span></div>
                                        <ul className="space-y-2 text-[17px] text-muted-foreground">
                                            <li>• Compare prices at local pharmacies</li>
                                            <li>• Access to standard digital coupons</li>
                                        </ul>
                                        {(loading && answers.plan === 'free') && <div className="mt-4"><Spinner /></div>}
                                    </CardContent>
                                </Card>

                                <Card className="relative overflow-hidden rounded-2xl border-2 border-primary shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNext('plan', 'premium')}>
                                    <div className="absolute top-0 inset-x-0 bg-primary text-primary-foreground text-center text-xs font-bold py-1.5 uppercase tracking-wider">
                                        Recommended
                                    </div>
                                    <CardContent className="p-6 pt-10">
                                        <h3 className="text-2xl font-serif font-bold text-primary mb-2">MedPrice+</h3>
                                        <div className="text-3xl font-bold text-foreground mb-4">$9.99 <span className="text-lg text-muted-foreground font-normal">/month</span></div>
                                        <ul className="space-y-2 text-[17px] text-foreground font-medium">
                                            <li>• Extra 20% off on generic medications</li>
                                            <li>• Access to Canadian pharmacy prices</li>
                                            <li>• Free home delivery on eligible meds</li>
                                        </ul>
                                        {(loading && answers.plan === 'premium') && <div className="mt-4"><Spinner /></div>}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
