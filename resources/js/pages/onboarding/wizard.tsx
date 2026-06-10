import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IconShieldCheck, IconPill, IconUserHeart } from '@tabler/icons-react';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';

export default function OnboardingWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({
        insurance: '',
        zip_code: '',
        pharmacy: '',
        radius: '',
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
            <Head title="Welcome to RxSaver" />

            <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
                <header className="bg-card border-b border-border px-4 py-4 shadow-sm flex items-center gap-2">
                    <IconShieldCheck size={32} className="text-primary" />
                    <span className="text-2xl font-serif font-bold tracking-tight text-primary">RxSaver</span>
                </header>

                <main className="flex-1 max-w-xl mx-auto w-full px-4 py-12 md:py-24">
                    <div className="mb-8">
                        <div className="flex gap-2 mb-4">
                            <div className={`h-2 rounded-full flex-1 ${step >= 1 ? 'bg-primary' : 'bg-muted'}`}></div>
                            <div className={`h-2 rounded-full flex-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
                            <div className={`h-2 rounded-full flex-1 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
                            <div className={`h-2 rounded-full flex-1 ${step >= 4 ? 'bg-primary' : 'bg-muted'}`}></div>
                        </div>
                        <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">
                            Step {step} of 4
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
                                Where are you located?
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
                                    onChange={(e) => setAnswers({...answers, zip_code: e.target.value.replace(/\D/g, '').slice(0, 5)})}
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

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
                                Pharmacy Preferences
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Tell us your favorite pharmacy and how far you're willing to travel.
                            </p>

                            <div className="mt-8 space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">Preferred Pharmacy</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['CVS', 'Walgreens', 'Walmart', 'Local Pharmacy'].map(pharma => (
                                            <Button
                                                key={pharma}
                                                variant={answers.pharmacy === pharma ? 'default' : 'outline'}
                                                className={`h-14 text-lg rounded-xl ${answers.pharmacy === pharma ? 'border-primary' : 'border-border'} hover:border-primary/50`}
                                                onClick={() => setAnswers({...answers, pharmacy: pharma})}
                                            >
                                                {pharma}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-3">Maximum Distance</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['5 miles', '10 miles', '20+ miles'].map(rad => (
                                            <Button
                                                key={rad}
                                                variant={answers.radius === rad ? 'default' : 'outline'}
                                                className={`h-14 text-lg rounded-xl ${answers.radius === rad ? 'border-primary' : 'border-border'} hover:border-primary/50`}
                                                onClick={() => setAnswers({...answers, radius: rad})}
                                            >
                                                {rad}
                                            </Button>
                                        ))}
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

                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
                                Choose your savings plan
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Select the RxSaver plan that best fits your needs. You can change this anytime.
                            </p>

                            <div className="grid gap-4 mt-8">
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
                                        <h3 className="text-2xl font-serif font-bold text-primary mb-2">RxSaver+</h3>
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
