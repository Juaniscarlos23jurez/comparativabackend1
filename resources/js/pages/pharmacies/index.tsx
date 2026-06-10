import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

const mockPharmacies = [
    { name: 'CVS Pharmacy', address: '123 Main St', distance: '1.2 mi', open: true },
    { name: 'Walgreens', address: '456 Oak Ave', distance: '3.5 mi', open: true },
    { name: 'Local Mom & Pop', address: '789 Pine Rd', distance: '5.0 mi', open: false },
];

export default function PharmaciesIndex() {
    return (
        <>
            <Head title="Nearby Pharmacies" />
            <div className="flex flex-col gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground flex items-center gap-3">
                        <MapPin className="text-primary" /> Nearby Pharmacies
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Find the closest pharmacies to pick up your prescriptions.
                    </p>
                </div>

                {/* Mock Map Area */}
                <div className="w-full h-64 bg-muted rounded-2xl border border-border flex items-center justify-center">
                    <p className="text-muted-foreground font-semibold flex items-center gap-2">
                        <MapPin /> Interactive Map Placeholder
                    </p>
                </div>

                <div className="grid gap-4 mt-4">
                    {mockPharmacies.map((pharm, i) => (
                        <Card key={i} className="rounded-2xl border-border shadow-sm">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold font-serif text-foreground">{pharm.name}</h3>
                                    <p className="text-muted-foreground mt-1">{pharm.address}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-sm font-medium bg-muted px-2 py-1 rounded text-muted-foreground">
                                            {pharm.distance}
                                        </span>
                                        <span className={`text-sm font-bold ${pharm.open ? 'text-green-600' : 'text-red-500'}`}>
                                            {pharm.open ? 'Open Now' : 'Closed'}
                                        </span>
                                    </div>
                                </div>
                                <Button className="rounded-xl gap-2 h-12">
                                    <Navigation className="w-4 h-4" /> Directions
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

PharmaciesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Nearby Pharmacies',
            href: '/pharmacies',
        },
    ],
};
